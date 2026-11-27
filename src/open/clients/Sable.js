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

import { Maturity, Platform, LinkKind, FlathubLink, WebsiteLink } from "../types.js";

const webAppUrl = "https://app.sable.moe/";
const releasesUrl = "https://github.com/SableClient/Sable/releases/latest";

export class Sable {
    get id() {
        return "sable.moe";
    }
    get name() {
        return "Sable";
    }
    get icon() {
        return "images/client-icons/sable.svg";
    }
    get author() {
        return "SableClient contributors";
    }
    get homepage() {
        return "https://sable.moe";
    }
    get platforms() {
        return [
            Platform.DesktopWeb,
            Platform.MobileWeb,
            Platform.Android,
            Platform.iOS,
            Platform.Linux,
            Platform.macOS,
            Platform.Windows,
        ];
    }
    get description() {
        return "An almost stable Matrix client.";
    }
    getMaturity(platform) {
        return Maturity.Beta;
    }

    getDeepLink(platform, link) {
        let path;

        switch (link.kind) {
            case LinkKind.User:
                path = `direct/create?userId=${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Room:
                path = `home/${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Event:
                path = `home/${encodeURIComponent(link.identifier)}/${encodeURIComponent(link.eventId)}`;
                break;
        }

        if (!path) {
            return;
        }

        if ((link.kind === LinkKind.Event || link.kind === LinkKind.Room) && link.servers.length > 0) {
            path += `?viaServers=${link.servers.map(server => encodeURIComponent(server)).join(",")}`;
        }

        return `${webAppUrl}${path}`;
    }

    canInterceptMatrixToLinks(platform) {
        return false;
    }

    getLinkInstructions(platform, link) {}

    getCopyString(platform, link) {}

    getInstallLinks(platform) {
        switch (platform) {
            case Platform.Linux:
                return [
                    new FlathubLink("moe.sable.client"),
                    new WebsiteLink(releasesUrl),
                ];
            case Platform.Android:
            case Platform.iOS:
            case Platform.macOS:
            case Platform.Windows:
                return [new WebsiteLink(releasesUrl)];
            default: return [new WebsiteLink(webAppUrl)];
        }
    }

    getPreferredWebInstance(link) {}
}
