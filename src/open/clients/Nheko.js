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

import {Maturity, Platform, LinkKind, FlathubLink, style} from "../types.js";

/**
 * Information on how to deep link to a given matrix client.
 */
export class Nheko {
	get id() { return "nheko"; }
	get name() { return "Nheko"; }
    get icon() { return "images/client-icons/nheko.svg"; }
    get author() { return "mujx, red_sky, deepbluev7, Konstantinos Sideris"; }
    get homepage() { return "https://github.com/Nheko-Reborn/nheko"; }
	get platforms() { return [Platform.Windows, Platform.macOS, Platform.Linux]; }
	get description() { return 'A native desktop app for Matrix that feels more like a mainstream chat app.'; }
	getMaturity(platform) { return Maturity.Beta; }
	getDeepLink(platform, link) {}
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
            return [new FlathubLink("io.github.NhekoReborn.Nheko")];
        }
    }

    getPreferredWebInstance(link) {}
}
