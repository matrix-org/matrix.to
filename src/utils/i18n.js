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
        "create_header": "Create shareable links to Matrix rooms, users or messages without being tied to any app",
    },
    de: {
        "create_header": "Erstelle teilbare Links zu Matrix Räumen, Benutzern oder Nachrichten, ohne dabei auf eine Anwendung angewiesen zu sein.",
    }
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

        if (typeof dictionaries[this.language][key] === 'undefined') {
            return key;
        }

        return dictionaries[this.language][key];
    }
}
