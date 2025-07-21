/*
Copyright 2025 The Matrix.org Foundation C.I.C.

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

import {Maturity, Platform, LinkKind, FlathubLink, WebsiteLink, style} from "../types.js";

/**
 * Information on how to deep link to a given matrix client.
 */
export class Generic {
    get id() { return "generic"; }
    get name() { return "Client independent"; }
    get icon() { return "images/matrix-logo.svg"; }
    /*get author() { return ""; }*/
    get homepage() { return "https://spec.matrix.org/latest/appendices/#matrix-uri-scheme"; }
    get platforms() { return [Platform.DesktopWeb, Platform.Windows, Platform.macOS, Platform.Linux, Platform.iOS]; }
    get description() { return 'Client-independent matrix: link for all clients supporting this scheme'; }
    getMaturity(platform) { return Maturity.Stable; }
    getDeepLink(platform, link) {
        let identifier = encodeURIComponent(link.identifier.substring(1));
        let isRoomid = link.identifier.substring(0, 1) === '!';
        let fragmentPath;
        switch (link.kind) {
            case LinkKind.User:
                fragmentPath = `u/${identifier}?action=chat`;
                break;
            case LinkKind.Room:
            case LinkKind.Event:
                if (isRoomid)
                    fragmentPath = `roomid/${identifier}`;
                else
                    fragmentPath = `r/${identifier}`;
                if (link.kind === LinkKind.Event)
                    fragmentPath += `/e/${encodeURIComponent(link.eventId.substring(1))}`;
                fragmentPath += '?action=join';
                fragmentPath += link.servers.map(server => `&via=${encodeURIComponent(server)}`).join('');
                break;
            case LinkKind.Group:
                return;
        }
        return `matrix:${fragmentPath}`;
    }
    canInterceptMatrixToLinks(platform) { return false; }

    getLinkInstructions(platform, link) {
        return ['Open the following link: ', this.getDeepLink(platform, link)];
    }

    getCopyString(platform, link) {
        return this.getDeepLink(platform, link);
    }

    getInstallLinks(platform) {}
    getPreferredWebInstance(link) {}
}
