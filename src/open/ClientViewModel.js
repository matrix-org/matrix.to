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

function getMatchingPlatforms(client, supportedPlatforms) {
    const clientPlatforms = client.platforms;
    const matchingPlatforms = supportedPlatforms.filter(p => {
        return clientPlatforms.includes(p);
    });
    return matchingPlatforms;
}

export class ClientViewModel extends ViewModel {
	constructor(options) {
		super(options);
		const {client, link, pickClient} = options;
		this._client = client;
		this._link = link;
		this._pickClient = pickClient;
        // to provide "choose other client" button after calling pick()
        this._clientListViewModel = null;
        this._update();
	}

    _update() {
		const matchingPlatforms = getMatchingPlatforms(this._client, this.platforms);
		const webPlatform = matchingPlatforms.find(p => isWebPlatform(p));
		this._nativePlatform = matchingPlatforms.find(p => !isWebPlatform(p));
		this._proposedPlatform = this.preferences.platform || this._nativePlatform || webPlatform;

		this.actions = this._createActions(this._client, this._link, this._nativePlatform, webPlatform);
		this._clientCanIntercept = !!(this._nativePlatform && this._client.canInterceptMatrixToLinks(this._nativePlatform));
		this._showOpen = this.deepLink && !this._clientCanIntercept;
    }

    // these are only shown in the install stage
	_createActions(client, link, nativePlatform, webPlatform) {
		let actions = [];
		if (nativePlatform) {
			const nativeActions = (client.getInstallLinks(nativePlatform) || []).map(installLink => {
				return {
					label: installLink.getDescription(nativePlatform),
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
					label: `Continue in your browser`,
					url: webDeepLink,
					kind: "open-in-web",
					activated: () => this.preferences.setClient(client.id, webPlatform),
				});
			}
		}
		return actions;
	}

    get homepage() {
        return this._client.homepage;
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

    get name() {
        return this._client.name;
    }

    get iconUrl() {
        return this._client.icon;
    }

	get stage() {
		return this._showOpen ? "open" : "install";
	}

	get textInstructions() {
        let instructions = this._client.getLinkInstructions(this._proposedPlatform, this._link);
        if (instructions && !Array.isArray(instructions)) {
            instructions = [instructions];
        }
		return instructions;
	}

    get copyString() {
        return this._client.getCopyString(this._proposedPlatform, this._link);
    }

	get showDeepLinkInInstall() {
        // we can assume this._nativePlatform as this._clientCanIntercept already checks it
		return this._clientCanIntercept && !!this._client.getDeepLink(this._nativePlatform, this._link);
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

    get _deepLinkPlatform() {
        // in install stage, always show the native link in the small "open it here" link, independent of preference.
        return this._showOpen ? this._proposedPlatform : this._nativePlatform;
    }

    // both used for big "Continue" button in open stage,
    // and for small "open it here" link in the install stage.
    get deepLink() {
        return this._client.getDeepLink(this._deepLinkPlatform, this._link);
    }
	
	deepLinkActivated() {
		this._pickClient(this._client);
		this.preferences.setClient(this._client.id, this._deepLinkPlatform);
		if (this._showOpen) {
			this._showOpen = false;
			this.emitChange();
		}
	}

    pick(clientListViewModel) {
        this._clientListViewModel = clientListViewModel;
        this.emitChange();
    }

    // whether or not we are only showing this client (in open or install stage)
    get showBack() {
        return !!this._clientListViewModel;
    }

    back() {
        if (this._clientListViewModel) {
            const vm = this._clientListViewModel;
            this._clientListViewModel = null;
            // clear the client preference so we default back to to native link if any
            // in the list with all clients, and also if we refresh, we get the list with
            // all clients rather than having our "change client" click reverted.
            this.preferences.setClient(undefined, undefined);
            this._update();
            this.emitChange();
            vm.showAll();
        }
    }
}
