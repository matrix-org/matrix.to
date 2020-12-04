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

import {isWebPlatform, isDesktopPlatform, Platform} from "../Platform.js";
import {ViewModel} from "../utils/ViewModel.js";
import {IdentifierKind} from "../Link.js";

export class ClientViewModel extends ViewModel {
	constructor(options) {
		super(options);
		const {client, link, pickClient} = options;
		this._client = client;
		this._link = link;
		this._pickClient = pickClient;

		const supportedPlatforms = client.platforms;
		const matchingPlatforms = this.platforms.filter(p => {
			return supportedPlatforms.includes(p);
		});
		const nativePlatform = matchingPlatforms.find(p => !isWebPlatform(p));
		const webPlatform = matchingPlatforms.find(p => isWebPlatform(p));
		
		this._proposedPlatform = this.preferences.platform || nativePlatform || webPlatform;
		
		this.actions = this._createActions(client, link, nativePlatform, webPlatform);
		this.name = this._client.getName(this._proposedPlatform);
		this.deepLink = this._client.getDeepLink(this._proposedPlatform, this._link);
		this._clientCanIntercept = !!(nativePlatform && client.canInterceptMatrixToLinks(nativePlatform));
		this._showOpen = this.deepLink && !this._clientCanIntercept;
	}

	_createActions(client, link, nativePlatform, webPlatform) {
		let actions = [];
		if (nativePlatform) {
			const nativeActions = (client.getInstallLinks(nativePlatform) || []).map(installLink => {
				return {
					label: installLink.description,
					url: installLink.createInstallURL(link),
					kind: installLink.channelId,
					primary: true,
					activated: () => this.preferences.setClient(client.id, nativePlatform),
				};
			});
			actions.push(...nativeActions);
		}
		if (webPlatform) {
			const webDeepLink = client.getDeepLink(webPlatform, link);
			if (webDeepLink) {
				actions.push({
					label: `Or open in ${client.getName(webPlatform)}`,
					url: webDeepLink,
					kind: "open-in-web",
					activated: () => this.preferences.setClient(client.id, webPlatform),
				});
			}
		}
		actions.push({
			label: `Visit app homepage`,
			url: client.homepage,
			primary: true,
			kind: "homepage",
			activated: () => {},
		});
		return actions;
	}

	get identifier() {
		return this._link.identifier;
	}

	get description() {
		return this._client.description;
	}

	get clientId() {
		return this._client.id;
	}

    get iconUrl() {
        return this._client.icon;
    }

	get stage() {
		return this._showOpen ? "open" : "install";
	}

	get textInstructions() {
		return this._client.getLinkInstructions(this._proposedPlatform, this._link);
	}

    get copyString() {
        return this._client.getCopyString(this._proposedPlatform, this._link);
    }

	get showDeepLinkInInstall() {
		return this._clientCanIntercept && this.deepLink;
	}

	get availableOnPlatformNames() {
		const platforms = this._client.platforms;
		const textPlatforms = [];
		const hasWebPlatform = platforms.some(p => isWebPlatform(p));
		if (hasWebPlatform) {
			textPlatforms.push("Web");
		}
		const desktopPlatforms = platforms.filter(p => isDesktopPlatform(p));
		if (desktopPlatforms.length === 1) {
			textPlatforms.push(desktopPlatforms[0]);
		} else {
			textPlatforms.push("Desktop");
		}
		if (platforms.includes(Platform.Android)) {
			textPlatforms.push("Android");
		}
		if (platforms.includes(Platform.iOS)) {
			textPlatforms.push("iOS");
		}
		return textPlatforms;
	}
	
	deepLinkActivated() {
		this._pickClient(this._client);
		this.preferences.setClient(this._client.id, this._proposedPlatform);
		if (this._showOpen) {
			this._showOpen = false;
			this.emitChange();
		}
	}
}
