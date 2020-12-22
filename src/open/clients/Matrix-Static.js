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

import {Maturity, Platform, LinkKind, style} from "../types.js";

/**
 * Information on how to deep link to a given matrix client.
 */
export class MatrixStatic {
    get id() { return "matrix-static"; }
    get name() { return "Matrix Static"; }
    get icon() { return "images/client-icons/matrix-static.png"; }
    get author() { return "Michael Telatynski"; }
    get homepage() { return "https://github.com/matrix-org/matrix-static"; }
    get platforms() { return [Platform.DesktopWeb, Platform.MobileWeb]; }
    get description() { return 'A static preview of public world readable Matrix rooms.'; }
    getMaturity(platform) { return Maturity.Stable; }
    canInterceptMatrixToLinks(platform) { return false; }

    getDeepLink(platform, link) {
        let fragmentPath;
        switch (link.kind) {
            case LinkKind.RoomId:
                fragmentPath = `room/${link.identifier}`;
                break;
            case LinkKind.RoomAlias:
                fragmentPath = `alias/${link.identifier.replace(/#/g, '%23')}`;
                break;
            case LinkKind.Event:
                fragmentPath = `room/${link.identifier}/${link.eventId}`;
                break;
        }
        return `https://view.matrix.org/${fragmentPath}`;
    }

    getLinkInstructions(platform, link) {}
    getCopyString(platform, link) {}
    getInstallLinks(platform) {}
}
