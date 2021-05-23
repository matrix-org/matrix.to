/*
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

const dictionaries = {
    en: {
        "create": {
            "header": "Create shareable links to Matrix rooms, users or messages without being tied to any app",
            "inputPlaceholder": "#room:example.com, @user:example.com",
            "submit": "Create link",
            "inputError": "That doesn't seem valid. Try #room:example.com, @user:example.com or +group:example.com."
        },
        "root": {
            "github": "GitHub project",
            "addClient": "Add your app",
            "clearPreferences": "Clear preferences",
            "matrixLinkPart1": "This invite uses",
            "matrixLinkPart2": ", an open network for secure, decentralized communication."
        }
    },
    de: {
        "create": {
            "header": "Erstelle teilbare Links zu Matrix Räumen, Benutzern oder Nachrichten, ohne dabei auf eine Anwendung angewiesen zu sein.",
            "inputPlaceholder": "#raum:example.com, @benutzer:example.com",
            "submit": "Link erstellen",
            "inputError": "That doesn't seem valid. Try #room:example.com, @user:example.com or +group:example.com."
        },
        "root": {
            "github": "GitHub Projekt",
            "addClient": "Füge deine Anwendung hinzu",
            "clearPreferences": "Einstellungen zurücksetzen",
            "matrixLinkPart1": "Deise Einladung benutz ",
            "matrixLinkPart2": ", ein offenes Netzwerk für sichere und dezentrale Kommunikation."
        }
    }
}

function resolve(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

export class I18N {
    constructor() {
        const userLang = navigator.language || navigator.userLanguage;
        if (typeof userLang === 'string') {
            this.language = userLang.slice(0,2);
        } else {
            this.language = 'en';
        }
    }

    translate(key) {
        if (typeof dictionaries[this.language] === 'undefined') {
            return key;
        }

        const translate = resolve(key, dictionaries[this.language]);

        if (typeof translate !== 'string') {
            return key;
        }

        return translate;
    }
}
