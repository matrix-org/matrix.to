/*
Copyright 2020 Bruno Windels <bruno@windels.cloud>
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";
import xxhash from 'xxhashjs';
import { rollup } from 'rollup';
import postcss from "postcss";
import postcssImport from "postcss-import";
// needed for legacy bundle
import babel from '@rollup/plugin-babel';
// needed to find the polyfill modules in the main-legacy.js bundle
import { nodeResolve } from '@rollup/plugin-node-resolve';
// needed because some of the polyfills are written as commonjs modules
import commonjs from '@rollup/plugin-commonjs';
// multi-entry plugin so we can add polyfill file to main
import multi from '@rollup/plugin-multi-entry';
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
// replace urls of asset names with content hashed version
import postcssUrl from "postcss-url";
import cssvariables from "postcss-css-variables";
import autoprefixer from "autoprefixer";
import flexbugsFixes from "postcss-flexbugs-fixes";

import {createClients} from "../src/open/clients/index.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const projectDir = path.join(dirname(fileURLToPath(import.meta.url)), "../");

async function build() {
    // get version number
    const version = JSON.parse(await fs.readFile(path.join(projectDir, "package.json"), "utf8")).version;
    // clear target dir
    const targetDir = path.join(projectDir, "build/");
    await removeDirIfExists(targetDir);
    await fs.mkdir(targetDir);
    await fs.mkdir(path.join(targetDir, "images"));
    await fs.mkdir(path.join(targetDir, "img")); // contains the badge image for historical reasons, unhashed
    await fs.mkdir(path.join(targetDir, ".well-known"));
    const assets = new AssetMap(targetDir);
    const imageAssets = await copyFolder(path.join(projectDir, "images"), path.join(targetDir, "images"));
    assets.addSubMap(imageAssets);
    await assets.write(`bundle.js`, await buildJs("src/main.js", assets, ["src/polyfill.js"]));
    await assets.write(`bundle.css`, await buildCss("css/main.css", targetDir, assets));
    await assets.writeUnhashed(".well-known/apple-app-site-association", buildAppleAssociatedAppsFile(createClients()));
    await assets.writeUnhashed("index.html", await buildHtml(assets));
    await assets.writeUnhashed("img/matrix-badge.svg", await fs.readFile(path.join(projectDir, "images-nohash/matrix-badge.svg")));
    const globalHash = assets.hashForAll();
    console.log(`built matrix.to ${version} (${globalHash}) successfully with ${assets.size} files`);
}

async function buildHtml(assets) {
    const devHtml = await fs.readFile(path.join(projectDir, "index.html"), "utf8");
    const doc = cheerio.load(devHtml);
    doc("link[rel=stylesheet]").attr("href", assets.resolve(`bundle.css`));
    const mainScripts = [
        // this is needed to avoid hitting https://github.com/facebook/regenerator/issues/378
        // which prevents the whole bundle to load, as our CSP headers don't allow unsafe-eval
        // and I preferred this over disabling strict mode for the whole bundle
        `<script type="text/javascript">window.regeneratorRuntime = undefined;</script>`,
        `<script type="text/javascript" src="${assets.resolve(`bundle.js`)}"></script>`,
        `<script type="text/javascript">bundle.main(document.body);</script>`
    ];
    doc("script#main").replaceWith(mainScripts.join(""));
    return doc.html();
}

function createReplaceUrlPlugin(assets) {
    const replacements = {};
    for (const [key, value] of assets) {
        replacements[key] = value;
    }
    return replace(replacements);
}

async function buildJs(mainFile, assets, extraFiles = []) {
    // compile down to whatever IE 11 needs
    const babelPlugin = babel.babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
            [
                "@babel/preset-env",
                {
                    useBuiltIns: "entry",
                    corejs: "3",
                    targets: "IE 11",
                }
            ]
        ]
    });
    // create js bundle
    const rollupConfig = {
        // important the extraFiles come first,
        // so polyfills are available in the global scope
        // if needed for the mainfile
        input: extraFiles.concat(mainFile),
        plugins: [multi(), commonjs(), nodeResolve(), createReplaceUrlPlugin(assets), babelPlugin, terser()]
    };
    const bundle = await rollup(rollupConfig);
    const {output} = await bundle.generate({
        format: 'iife',
        name: `bundle`
    });
    const code = output[0].code;
    return code;
}

function buildAppleAssociatedAppsFile(clients) {
    const appIds = clients.map(c => c.appleAssociatedAppId).flat().filter(id => !!id);
    return JSON.stringify({
        "applinks": {
            "details": [
                {
                    appIDs: appIds,
                    components: [
                        {
                            "#": "/*",
                            "comment": "Only open urls with a fragment, so you can still create links"
                        }
                    ]
                }
            ]
        }
    });
}

async function buildCss(entryPath, targetDir, assets) {
    entryPath = path.join(projectDir, entryPath);
    const assetUrlMapper = ({absolutePath}) => {
        const relPath = absolutePath.slice(projectDir.length);
        return assets.resolve(path.join(targetDir, relPath));
    };

    const preCss = await fs.readFile(entryPath, "utf8");
    const options = [
        postcssImport,
        cssvariables(),
        autoprefixer({overrideBrowserslist: ["IE 11"], grid: "no-autoplace"}),
        flexbugsFixes(),
        postcssUrl({url: assetUrlMapper}),
    ];
    const cssBundler = postcss(options);
    const result = await cssBundler.process(preCss, {from: entryPath});
    return result.css;
}

async function removeDirIfExists(targetDir) {
    try {
        await fs.rm(targetDir, { recursive: true });
    } catch (err) {
        if (err.code !== "ENOENT") {
            throw err;
        }
    }
}

async function copyFolder(srcRoot, dstRoot, filter = null, assets = null) {
    assets = assets || new AssetMap(dstRoot);
    const dirEnts = await fs.readdir(srcRoot, {withFileTypes: true});
    for (const dirEnt of dirEnts) {
        const dstPath = path.join(dstRoot, dirEnt.name);
        const srcPath = path.join(srcRoot, dirEnt.name);
        if (dirEnt.isDirectory()) {
            await fs.mkdir(dstPath);
            await copyFolder(srcPath, dstPath, filter, assets);
        } else if ((dirEnt.isFile() || dirEnt.isSymbolicLink()) && (!filter || filter(srcPath))) {
            const content = await fs.readFile(srcPath);
            await assets.write(dstPath, content);
        }
    }
    return assets;
}

function contentHash(str) {
    var hasher = new xxhash.h32(0);
    hasher.update(str);
    return hasher.digest();
}

class AssetMap {
    constructor(targetDir) {
        // remove last / if any, so substr in create works well
        this._targetDir = path.resolve(targetDir);
        this._assets = new Map();
        // hashes for unhashed resources so changes in these resources also contribute to the hashForAll
        this._unhashedHashes = [];
    }

    _toRelPath(resourcePath) {
        let relPath = resourcePath;
        if (path.isAbsolute(resourcePath)) {
            if (!resourcePath.startsWith(this._targetDir)) {
                throw new Error(`absolute path ${resourcePath} that is not within target dir ${this._targetDir}`);
            }
            relPath = resourcePath.slice(this._targetDir.length + 1); // + 1 for the /
        }
        return relPath;
    }

    _create(resourcePath, content) {
        const relPath = this._toRelPath(resourcePath);
        const hash = contentHash(Buffer.from(content));
        const dir = path.dirname(relPath);
        const extname = path.extname(relPath);
        const basename = path.basename(relPath, extname);
        const dstRelPath = path.join(dir, `${basename}-${hash}${extname}`);
        this._assets.set(relPath, dstRelPath);
        return dstRelPath;
    }

    async write(resourcePath, content) {
        const relPath = this._create(resourcePath, content);
        const fullPath = path.join(this.directory, relPath);
        if (typeof content === "string") {
            await fs.writeFile(fullPath, content, "utf8");
        } else {
            await fs.writeFile(fullPath, content);
        }
        return relPath;
    }

    async writeUnhashed(resourcePath, content) {
        const relPath = this._toRelPath(resourcePath);
        this._assets.set(relPath, relPath);
        const fullPath = path.join(this.directory, relPath);
        if (typeof content === "string") {
            await fs.writeFile(fullPath, content, "utf8");
        } else {
            await fs.writeFile(fullPath, content);
        }
        return relPath;
    }

    get directory() {
        return this._targetDir;
    }

    resolve(resourcePath) {
        const relPath = this._toRelPath(resourcePath);
        const result = this._assets.get(relPath);
        if (!result) {
            throw new Error(`unknown path: ${relPath}, only know ${Array.from(this._assets.keys()).join(", ")}`);
        }
        return result;
    }

    addSubMap(assetMap) {
        if (!assetMap.directory.startsWith(this.directory)) {
            throw new Error(`map directory doesn't start with this directory: ${assetMap.directory} ${this.directory}`);
        }
        const relSubRoot = assetMap.directory.slice(this.directory.length + 1);
        for (const [key, value] of assetMap._assets.entries()) {
            this._assets.set(path.join(relSubRoot, key), path.join(relSubRoot, value));
        }
    }

    [Symbol.iterator]() {
        return this._assets.entries();
    }

    isUnhashed(relPath) {
        const resolvedPath = this._assets.get(relPath);
        if (!resolvedPath) {
            throw new Error("Unknown asset: " + relPath);
        }
        return relPath === resolvedPath;
    }

    get size() {
        return this._assets.size;
    }

    has(relPath) {
        return this._assets.has(relPath);
    }

    hashForAll() {
        const globalHashAssets = Array.from(this).map(([, resolved]) => resolved);
        globalHashAssets.push(...this._unhashedHashes);
        globalHashAssets.sort();
        return contentHash(globalHashAssets.join(","));
    }

    addToHashForAll(resourcePath, content) {
        this._unhashedHashes.push(`${resourcePath}-${contentHash(Buffer.from(content))}`);
    }
}

build().catch(err => console.error(err));
