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

export class Kazv {
    get id() { return "kazv"; }
    get name() { return "kazv"; }
    get icon() { return "images/client-icons/kazv.png"; }
    get author() { return "The Kazv Project"; }
    get homepage() { return "https://kazv.chat/"; }
    get platforms() { return [Platform.Windows, Platform.Linux]; }
    get description() { return 'A convergent Matrix client and secure messaging app.'; }
    getMaturity(platform) { return Maturity.Beta; }
    getDeepLink(platform, link) {}
    canInterceptMatrixToLinks(platform) { return false; }

    getLinkInstructions(platform, link) {
        switch (link.kind) {
            case LinkKind.User: return [`In Global Drawer, click on "Create Room", and invite `, style.code(`${link.identifier}`)];
            case LinkKind.Room: return [`In Global Drawer, click on "Join Room", and enter `, style.code(`${link.identifier}`)];
        }
    }

    getCopyString(platform, link) {
        switch (link.kind) {
            case LinkKind.User: return link.identifier;
            case LinkKind.Room: return link.identifier;
        }
    }

    getInstallLinks(platform) {
        return [
            new WebsiteLink("https://lily-is.land/kazv/kazv/-/releases")
        ];
    }

    getPreferredWebInstance(link) {}
}
