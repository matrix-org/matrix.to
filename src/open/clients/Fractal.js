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

import {Maturity, Platform, LinkKind, FlathubLink} from "../types.js";

/**
 * Information on how to deep link to a given matrix client.
 */
export class Fractal {
    get id() { return "fractal"; }
    get name() { return "Fractal"; }
    get icon() { return "images/client-icons/fractal.svg"; }
    get author() { return "Daniel Garcia Moreno"; }
    get homepage() { return "https://gitlab.gnome.org/World/fractal"; }
    get platforms() { return [Platform.Linux]; }
    get description() { return 'GNOME client, suitable for desktop and mobile. Written in Rust.'; }
    getMaturity(platform) { return Maturity.Beta; }

    getDeepLink(platform, link) {
        if (platform === Platform.Linux) {
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
    }

    canInterceptMatrixToLinks(platform) { return false; }

    getLinkInstructions(platform, link) {
        if (link.kind === LinkKind.User || link.kind === LinkKind.Room) {
            return "Click the menu button above the list of rooms, select the Join Room entry, and paste the identifier";
        }
    }

    getCopyString(platform, link) {
        if (link.kind === LinkKind.User || link.kind === LinkKind.Room) {
            return link.identifier;
        }
    }

    getInstallLinks(platform) {
        if (platform === Platform.Linux) {
            return [new FlathubLink("org.gnome.Fractal")];
        }
    }

    getPreferredWebInstance(link) {}
}
