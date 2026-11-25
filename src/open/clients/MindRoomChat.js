/*
Copyright 2026 Bas Nijholt

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
    Maturity,
    Platform,
    LinkKind,
    AppleStoreLink,
    WebsiteLink,
} from "../types.js";

const trustedWebInstances = [
    "chat.mindroom.chat", // first one is the default one
];

/**
 * Information on how to deep link to MindRoom Chat.
 */
export class MindRoomChat {
    get id() {
        return "chat.mindroom.app";
    }
    get name() {
        return "MindRoom Chat";
    }
    get icon() {
        return "images/client-icons/mindroom-chat.png";
    }
    get author() {
        return "MindRoom";
    }
    get homepage() {
        return "https://github.com/mindroom-ai/mindroom-chat";
    }
    get platforms() {
        return [
            Platform.DesktopWeb,
            Platform.MobileWeb,
            Platform.macOS,
            Platform.iOS,
        ];
    }
    get description() {
        return "Open-source Matrix client with threads, spaces, E2EE, and calls. Includes optional MindRoom AI agent features that stay hidden unless connected to a MindRoom backend.";
    }
    getMaturity(platform) {
        switch (platform) {
            case Platform.DesktopWeb:
            case Platform.MobileWeb:
            case Platform.macOS:
            case Platform.iOS:
                return Maturity.Stable;
        }
    }

    getDeepLink(platform, link) {
        if (platform === Platform.macOS) {
            return;
        }
        if (!this.platforms.includes(platform)) {
            return;
        }

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
            default:
                return;
        }

        if ((link.kind === LinkKind.Event || link.kind === LinkKind.Room) && link.servers.length > 0) {
            path += `?viaServers=${link.servers.map(server => encodeURIComponent(server)).join(",")}`;
        }

        const isWebPlatform = platform === Platform.DesktopWeb || platform === Platform.MobileWeb;
        // Always use chat.mindroom.chat on iOS so Universal Links intercept room and event links;
        // only honor a preferred web instance on web platforms.
        let instanceHost = trustedWebInstances[0];
        if (isWebPlatform && trustedWebInstances.includes(link.webInstances[this.id])) {
            instanceHost = link.webInstances[this.id];
        }
        return `https://${instanceHost}/${path}`;
    }

    canInterceptMatrixToLinks() {
        return false;
    }

    getLinkInstructions() {}

    getCopyString() {}

    getInstallLinks(platform) {
        switch (platform) {
            case Platform.iOS:
                return [new AppleStoreLink("mindroom-ai", "id6760272172")];
            case Platform.macOS:
                return [new WebsiteLink("https://github.com/mindroom-ai/mindroom-chat/releases")];
        }
    }

    getPreferredWebInstance(link) {
        const idx = trustedWebInstances.indexOf(link.webInstances[this.id]);
        return idx === -1 ? undefined : trustedWebInstances[idx];
    }
}
