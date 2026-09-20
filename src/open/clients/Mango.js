/*
Copyright 2026 Pavel Kanzelsberger

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

import {Maturity, Platform, LinkKind, WebsiteLink} from "../types.js";

export class Mango {
    get id() { return "chat.mangoirc.mango"; }
    get name() { return "Mango"; }
    get icon() { return "images/client-icons/mango.svg"; }
    get author() { return "Pavel Kanzelsberger"; }
    get homepage() { return "https://mangoirc.chat"; }
    get platforms() { return [Platform.iOS, Platform.macOS]; }
    get description() { return "Native IRC and Matrix client for Mac, iPhone and iPad. Matrix support is available in the 3.2 TestFlight."; }
    getMaturity(platform) { return this.platforms.includes(platform) ? Maturity.Alpha : undefined; }

    getDeepLink(platform, link) {
        if (!this.platforms.includes(platform) || link.kind !== LinkKind.Room) { return; }
        const query = link.servers.map(server => `via=${encodeURIComponent(server)}`).join("&");
        return `mango://matrix/room/${encodeURIComponent(link.identifier)}${query ? "?" + query : ""}`;
    }

    getInstallLinks(platform) {
        if (this.platforms.includes(platform)) {
            return [new WebsiteLink("https://testflight.apple.com/join/F26xRR6b")];
        }
    }

    getLinkInstructions(platform, link) {
        if (link.kind === LinkKind.Room) {
            return "Open Mango 3.2 or later, choose your Matrix account, and confirm to open or join the room.";
        }
    }

    getCopyString(platform, link) {
        if (link.kind === LinkKind.Room) { return link.identifier; }
    }
    canInterceptMatrixToLinks(platform) { return false; }
    getPreferredWebInstance(link) {}
}
