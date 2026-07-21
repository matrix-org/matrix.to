/*
Copyright 2026 Element Creations Ltd.

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

import fs from "fs/promises";
import path from "path";

// Resolves which clients should be included in this build, honouring:
// - MATRIX_TO_CLIENTS: comma-separated allow-list of built-in client ids (default: all of them)
// - MATRIX_TO_CUSTOM_CLIENTS_DIR: a directory of extra client modules to include alongside the built-ins
//   (default: "custom-clients", relative to the project root)
export async function resolveClients(projectDir, env = process.env) {
    const indexPath = path.join(projectDir, "src/open/clients/index.js");
    const {createClients} = await import(indexPath);
    const builtins = createClients().map(instance => ({
        importPath: path.join(projectDir, "src/open/clients", `${instance.constructor.name}.js`),
        exportName: instance.constructor.name,
        isDefault: false,
        instance,
    }));

    let selected = builtins;
    const includeEnv = env.MATRIX_TO_CLIENTS;
    if (includeEnv && includeEnv.trim()) {
        const wanted = includeEnv.split(",").map(id => id.trim()).filter(Boolean);
        const knownIds = new Set(builtins.map(c => c.instance.id));
        const unknown = wanted.filter(id => !knownIds.has(id));
        if (unknown.length > 0) {
            throw new Error(`MATRIX_TO_CLIENTS references unknown client id(s): ${unknown.join(", ")}. Known ids: ${Array.from(knownIds).join(", ")}`);
        }
        const wantedSet = new Set(wanted);
        selected = builtins.filter(c => wantedSet.has(c.instance.id));
    }

    const customDirSetting = env.MATRIX_TO_CUSTOM_CLIENTS_DIR ?? "custom-clients";
    const customDir = path.isAbsolute(customDirSetting) ? customDirSetting : path.join(projectDir, customDirSetting);
    const custom = await loadCustomClients(customDir);

    const all = [...selected, ...custom];
    const seenIds = new Set();
    for (const {instance} of all) {
        if (seenIds.has(instance.id)) {
            throw new Error(`duplicate client id "${instance.id}" - client ids must be unique`);
        }
        seenIds.add(instance.id);
    }
    if (all.length === 0) {
        throw new Error("no matrix.to clients configured - check MATRIX_TO_CLIENTS and MATRIX_TO_CUSTOM_CLIENTS_DIR");
    }
    return all;
}

async function loadCustomClients(dirPath) {
    let entries;
    try {
        entries = await fs.readdir(dirPath, {withFileTypes: true});
    } catch (err) {
        if (err.code === "ENOENT") {
            return [];
        }
        throw err;
    }
    const clients = [];
    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith(".js")) {
            continue;
        }
        const modulePath = path.join(dirPath, entry.name);
        const exportName = path.basename(entry.name, ".js");
        const mod = await import(modulePath);
        const isDefault = !mod[exportName];
        const ClientClass = mod[exportName] ?? mod.default;
        if (!ClientClass) {
            throw new Error(`custom client ${entry.name} must have a named export "${exportName}" (matching the file name) or a default export`);
        }
        const instance = new ClientClass();
        if (!instance.id) {
            throw new Error(`custom client ${entry.name} does not implement the required "id" getter`);
        }
        clients.push({importPath: modulePath, exportName: isDefault ? "default" : exportName, isDefault, instance});
    }
    return clients;
}

// Rollup plugin that redirects any import of src/open/clients/index.js to a virtual module
// which statically imports exactly the resolved set of clients, so unselected clients (and
// their dependencies/assets) are tree-shaken out of the browser bundle entirely.
export function createClientsPlugin(projectDir, clients) {
    const targetId = path.join(projectDir, "src/open/clients/index.js");
    const virtualId = "\0matrix-to:clients";

    const localNames = clients.map((_, i) => `Client${i}`);
    const importLines = clients.map((c, i) => c.isDefault ?
        `import ${localNames[i]} from ${JSON.stringify(c.importPath)};` :
        `import {${c.exportName} as ${localNames[i]}} from ${JSON.stringify(c.importPath)};`
    );
    const source = `${importLines.join("\n")}
export function createClients() {
    return [${localNames.map(name => `new ${name}()`).join(", ")}];
}
`;

    return {
        name: "matrix-to-clients",
        resolveId(importee, importer) {
            if (!importer) {
                return null;
            }
            const resolved = path.resolve(path.dirname(importer), importee);
            if (resolved === targetId) {
                return virtualId;
            }
            return null;
        },
        load(id) {
            if (id === virtualId) {
                return source;
            }
            return null;
        }
    };
}
