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
        this._webPlatform = matchingPlatforms.find(p => isWebPlatform(p));
        this._nativePlatform = matchingPlatforms.find(p => !isWebPlatform(p));
        const preferredPlatform = matchingPlatforms.find(p => p === this.preferences.platform);
        this._proposedPlatform = preferredPlatform || this._nativePlatform || this._webPlatform;

        this.openActions = this._createOpenActions();
        this.installActions = this._createInstallActions();
        this._clientCanIntercept = !!(this._nativePlatform && this._client.canInterceptMatrixToLinks(this._nativePlatform));
        this._showOpen = this.openActions.length && !this._clientCanIntercept;
    }

    // these are only shown in the open stage
    _createOpenActions() {
        const hasPreferredWebInstance = this.hasPreferredWebInstance;
        let deepLinkLabel = "Continue";
        if (hasPreferredWebInstance) {
            if (this._proposedPlatform === this._nativePlatform) {
                deepLinkLabel = "Open in app";
            } else {
                deepLinkLabel = `Open on ${this._client.getPreferredWebInstance(this._link)}`;
            }
        }
        const actions = [];
        const proposedDeepLink = this._client.getDeepLink(this._proposedPlatform, this._link);
        if (proposedDeepLink) {
            actions.push({
                label: deepLinkLabel,
                url: proposedDeepLink,
                primary: true,
                activated: () => {
                    this._pickClient(this._client);
                    this.preferences.setClient(this._client.id, this._proposedPlatform);
                    // only show install screen if we tried to open a native deeplink
                    if (this._showOpen && this._proposedPlatform === this._nativePlatform) {
                        this._showOpen = false;
                        this.emitChange();
                    }
                },
            });
        }
        // show only if there is a preferred instance, and if we don't already link to it in the first button
        if (hasPreferredWebInstance && this._webPlatform && this._proposedPlatform !== this._webPlatform) {
            actions.push({
                label: `Open on ${this._client.getPreferredWebInstance(this._link)}`,
                url: this._client.getDeepLink(this._webPlatform, this._link),
                kind: "open-in-web",
                activated: () => {} // don't persist this choice as we don't persist the preferred web instance, it's in the url
            });
        }
        return actions;
    }

    // these are only shown in the install stage
    _createInstallActions() {
        let actions = [];
        if (this._nativePlatform) {
            const nativeActions = (this._client.getInstallLinks(this._nativePlatform) || []).map(installLink => {
                return {
                    label: installLink.getDescription(this._nativePlatform),
                    url: installLink.createInstallURL(this._link),
                    kind: installLink.channelId,
                    primary: true,
                    activated: () => this.preferences.setClient(this._client.id, this._nativePlatform),
                };
            });
            actions.push(...nativeActions);
        }
        if (this._webPlatform) {
            const webDeepLink = this._client.getDeepLink(this._webPlatform, this._link);
            if (webDeepLink) {
                const webLabel = this.hasPreferredWebInstance ?
                    `Open on ${this._client.getPreferredWebInstance(this._link)}` :
                    `Continue in your browser`;
                actions.push({
                    label: webLabel,
                    url: webDeepLink,
                    kind: "open-in-web",
                    activated: () => {
                        if (!this.hasPreferredWebInstance) {
                            this.preferences.setClient(this._client.id, this._webPlatform);
                        }
                    },
                });
            }
        }
        return actions;
    }

    get hasPreferredWebInstance() {
        // also check there is a web platform that matches the platforms the user is on (mobile or desktop web)
        return this._webPlatform && typeof this._client.getPreferredWebInstance(this._link) === "string";
    }

    get hostedByBannerLabel() {
        const preferredWebInstance = this._client.getPreferredWebInstance(this._link);
        if (this._webPlatform && preferredWebInstance) {
            let label = preferredWebInstance;
            const subDomainIdx = preferredWebInstance.lastIndexOf(".", preferredWebInstance.lastIndexOf("."));
            if (subDomainIdx !== -1) {
                label = preferredWebInstance.substr(preferredWebInstance.length - subDomainIdx + 1);
            }
            return `Hosted by ${label}`;
        }
        return;
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
