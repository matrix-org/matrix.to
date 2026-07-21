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
