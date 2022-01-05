/*
Copyright 2021 The Matrix.org Foundation C.I.C.
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

import { Maturity, Platform, LinkKind, FlathubLink, AppleStoreLink, PlayStoreLink, WebsiteLink } from "../types.js";

/**
 * Information on how to deep link to a given matrix client.
 */
export class Cinny {
    get id() { return "in.cinny"; }
    get name() { return "Cinny"; }
    get icon() { return "images/client-icons/cinny.svg"; }
    get author() { return "ajbura"; }
    get homepage() { return "https://cinny.in"; }
    get platforms() {
        return [
            Platform.DesktopWeb,
        ];
    }
    get description() { return "Yet another Matrix client."; }
    getMaturity(platform) {
        switch (platform) {
            case Platform.DesktopWeb: return Maturity.Stable;
        }
    }

    getInstallLinks(platform) {
        switch (platform) {
            default: return [new WebsiteLink("https://cinny.in")];
        }
    }

    getLinkInstructions(platform, link) {
        if (link.kind === LinkKind.User) {
            switch (platform) {
                case Platform.Android: return "Cinny doesn't support Android devices.";
                case Platform.DesktopWeb: return "Open the web app at https://cinny.in and log in to your account. Click on 'Public Rooms' and paste the username.";
                default: return "Open the app and click on 'Public Rooms' and paste the username.";
            }
        }
        if (link.kind === LinkKind.Room) {
            switch (platform) {
                case Platform.DesktopWeb: return "Open the web app at https://cinny.in/ and log in to your account. Click on 'Public Rooms' and paste the room address (name:homeserver).";
                default: return "Open the app on your device. Click on 'Public Rooms' and paste the room address (name:homeserver).";
            }
        }
    }

    getCopyString(platform, link) {
        if (link.kind === LinkKind.User || link.kind === LinkKind.Room) {
            return link.identifier;
        }
    }

    getDeepLink(platform, link) {
        switch (platform) {
            case Platform.Android: return `in.fluffychat://`;
            case Platform.iOS: return `in.fluffychat://`;
            default: break;
        }
    }
    canInterceptMatrixToLinks(platform) {
        return platform === Platform.Android;
    }

    getPreferredWebInstance(link) {}
}
