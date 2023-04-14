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

import {
    Maturity, Platform, LinkKind,
    FDroidLink, FlathubLink, PlayStoreLink, WebsiteLink
} from "../types.js";

const trustedWebInstances = [
    "app.schildi.chat",   // first one is the default one
    "test.schildi.chat",
];

/**
 * Information on how to deep link to a given matrix client.
 */
export class SchildiChat {
    get id() { return "schildi.chat"; }

    get platforms() {
        return [
            Platform.Android,
            Platform.Windows, Platform.macOS, Platform.Linux,
            Platform.DesktopWeb
        ];
    }

    get icon() { return "images/client-icons/schildichat.svg"; }
    get name() { return "SchildiChat"; }
    get description() { return 'Feature-rich messenger for Matrix based on Element with some extras and tweaks.'; }
    get homepage() { return "https://schildi.chat"; }
    get author() { return "SchildiChat team"; }
    getMaturity(platform) { return Maturity.Stable; }

    getDeepLink(platform, link) {
        let fragmentPath;
        switch (link.kind) {
            case LinkKind.User:
                fragmentPath = `user/${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Room:
                fragmentPath = `room/${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Group:
                fragmentPath = `group/${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Event:
                fragmentPath = `room/${encodeURIComponent(link.identifier)}/${encodeURIComponent(link.eventId)}`;
                break;
        }

        if ((link.kind === LinkKind.Event || link.kind === LinkKind.Room) && link.servers.length > 0) {
            fragmentPath += '?' + link.servers.map(server => `via=${encodeURIComponent(server)}`).join('&');
        }

        const isWebPlatform = platform === Platform.DesktopWeb || platform === Platform.MobileWeb;
        if (isWebPlatform) {
            let instanceHost = trustedWebInstances[0];
            if (isWebPlatform && trustedWebInstances.includes(link.webInstances[this.id])) {
                instanceHost = link.webInstances[this.id];
            }
            return `https://${instanceHost}/#/${fragmentPath}`;
        } else if (platform === Platform.Linux || platform === Platform.Windows || platform === Platform.macOS) {
            return `schildichat://vector/webapp/#/${fragmentPath}`;
        } else {
            return `schildichat://${fragmentPath}`;
        }
    }

    getLinkInstructions(platform, link) { }
    getCopyString(platform, link) { }
    getInstallLinks(platform) {
        switch (platform) {
            case Platform.Linux:
                return [
                    new FlathubLink("chat.schildi.desktop"),
                    new WebsiteLink("https://schildi.chat/desktop/"),
                ]
            case Platform.Windows || Platform.macOS:
                return [new WebsiteLink("https://schildi.chat/desktop/")];
            case Platform.Android:
                return [
                    new PlayStoreLink('de.spiritcroc.riotx'),
                    new FDroidLink('de.spiritcroc.riotx'),
                    new WebsiteLink("https://schildi.chat/android/"),
                ];
            default: return [new WebsiteLink("https://schildi.chat")];
        }
    }

    canInterceptMatrixToLinks(platform) {
        return platform === Platform.Android;
    }

    getPreferredWebInstance(link) {
        const idx = trustedWebInstances.indexOf(link.webInstances[this.id])
        return idx === -1 ? undefined : trustedWebInstances[idx];
    }
}
