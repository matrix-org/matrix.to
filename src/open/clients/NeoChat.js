/*
Copyright 2020 The Matrix.org Foundation C.I.C.
Copyright 2021 Carl Schwan <carl@carlschwan.eu>

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

import {Maturity, Platform, LinkKind, FlathubLink, style} from "../types.js";
import {Link} from "../../Link.js"

export class NeoChat {
    get id() { return "neochat"; }
    get name() { return "NeoChat"; }
    get icon() { return "images/client-icons/org.kde.neochat.svg"; }
    get author() { return "Tobias Fella and Carl Schwan"; }
    get homepage() { return "https://apps.kde.org/neochat/"; }
    get platforms() { return [Platform.Linux]; }
    get description() { return 'NeoChat is a convergent, cross-platform Matrix client.'; }
    getMaturity(platform) { return Maturity.Beta; }
    getDeepLink(platform, link) {
        if (platform === Platform.Linux || platform === Platform.Windows) {
            return Link.toMatrixUri(link);
        }
    }
    canInterceptMatrixToLinks(platform) { return false; }

    getLinkInstructions(platform, link) {
        switch (link.kind) {
            case LinkKind.User: return [`Type `, style.code(`/invite ${link.identifier}`)];
            case LinkKind.Room: return [`Type `, style.code(`/join ${link.identifier}`)];
        }
    }

    getCopyString(platform, link) {
        switch (link.kind) {
            case LinkKind.User: return `/invite ${link.identifier}`;
            case LinkKind.Room: return `/join ${link.identifier}`;
        }
    }

    getInstallLinks(platform) {
        if (platform === Platform.Linux) {
            return [new FlathubLink("org.kde.neochat")];
        }
    }

    getPreferredWebInstance(link) {}
}
