/*
Copyright 2020 The Matrix.org Foundation C.I.C.
Copyright 2022 3nt3 <gott@3nt3.de>

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

import { Maturity, Platform, LinkKind, FlathubLink, style } from "../types.js";

export class Cinny {
    get id() {
        return "cinny";
    }
    get name() {
        return "Cinny";
    }
    get icon() {
        return "images/client-icons/cinny.svg";
    }
    get author() {
        return "Copyright (c) 2021-present Ajay Bura (ajbura) and contributors";
    }
    get homepage() {
        return "https://cinny.in";
    }
    get platforms() {
        return [
            Platform.DesktopWeb,
            Platform.Linux,
            Platform.macOS,
            Platform.Windows,
        ];
    }
    get description() {
        return "A Matrix client focusing primarily on simple, elegant and secure interface. The main goal is to have an instant messaging application that is easy on people and has a modern touch.";
    }
    getMaturity(platform) {
        return Maturity.Stable;
    }

    getDeepLink(platform, link) {
        let fragmentPath;

        switch (link.kind) {
            case LinkKind.User:
                fragmentPath = `direct/create?userId=${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Room:
                fragmentPath = `home/${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Event:
                fragmentPath = `home/${encodeURIComponent(link.identifier)}/${encodeURIComponent(link.eventId)}`;
                break;
        }

         if ((link.kind === LinkKind.Event || link.kind === LinkKind.Room) && link.servers.length > 0) {
            fragmentPath += `?via=${link.servers.map(server => encodeURIComponent(server)).join(',')}`;
        }

        return `https://app.cinny.in/${fragmentPath}`
    }

    canInterceptMatrixToLinks(platform) {
        return false;
    }

    getLinkInstructions(platform, link) {}

    getCopyString(platform, link) {}

    getInstallLinks(platform) {}

    getPreferredWebInstance(link) {}
}
