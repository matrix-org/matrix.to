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

import {Maturity, Platform, LinkKind, WebsiteLink, style} from "../types.js";

/**
 * Information on how to deep link to a given matrix client.
 */
export class Weechat {
    get id() { return "weechat"; }
    get name() { return "Weechat"; }
    get icon() { return "images/client-icons/weechat.svg"; }
    get author() { return "Poljar"; }
    get homepage() { return "https://github.com/poljar/weechat-matrix"; }
    get platforms() { return [Platform.Windows, Platform.macOS, Platform.Linux]; }
    get description() { return 'Command-line Matrix interface using Weechat.'; }
    getMaturity(platform) { return Maturity.Beta; }
    getDeepLink(platform, link) {}
    canInterceptMatrixToLinks(platform) { return false; }

    getLinkInstructions(platform, link) {
        switch (link.kind) {
            case LinkKind.User: return [`Type `, style.code(`/invite ${link.identifier}`)];
            case LinkKind.Room: return [`Type `, style.code(`/join ${link.identifier}`)];
        }
    }

    getCopyString(platform, link) {
        switch (link.kind) {
            case LinkKind.User: return `/invite ${link.identifier}`;
            case LinkKind.Room: return `/join ${link.identifier}`;
        }
    }

    getInstallLinks(platform) {}

    getPreferredWebInstance(link) {}
}
