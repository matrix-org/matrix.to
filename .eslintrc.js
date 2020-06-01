module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
    },
    env: {
        browser: true,
        jest: true,
    },
    extends: ["eslint:recommended", "google"],
    plugins: [
        "jest",
    ],
    rules: {
        "max-len": ["error", {
            code: 90,
            ignoreComments: true,
        }],
        curly: ["error", "multi-line"],
        "prefer-const": ["error"],
        "comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "always-multiline",
        }],
        quotes: ["single"],
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        "camelcase": ["error", { properties: "always" } ],
        "no-multi-spaces": ["error", { "ignoreEOLComments": true }],
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always",
        }],
        "arrow-parens": "error",
    }
}
