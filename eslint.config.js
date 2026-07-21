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

import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["build/**"],
    },
    js.configs.recommended,
    {
        files: ["src/**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: globals.browser,
        },
        rules: {
            "no-console": "off",
            // many client implementations share an interface and don't use every argument
            "no-unused-vars": ["error", {args: "none"}],
            "getter-return": ["error", {allowImplicit: true}],
            "no-empty": ["error", {allowEmptyCatch: true}],
        },
    },
    {
        files: ["scripts/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: globals.node,
        },
        rules: {
            "no-console": "off",
        },
    },
];
