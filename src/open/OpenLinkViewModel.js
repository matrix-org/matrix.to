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

import {ViewModel} from "../utils/ViewModel.js";
import {ClientListViewModel} from "./ClientListViewModel.js";
import {ClientViewModel} from "./ClientViewModel.js";
import {PreviewViewModel} from "../preview/PreviewViewModel.js";
import {OpenDefaultViewModel} from "./OpenDefaultViewModel.js";
import {ServerConsentViewModel} from "./ServerConsentViewModel.js";
import {getLabelForLinkKind} from "../Link.js";
import {orderedUnique} from "../utils/unique.js";
import {getMatchingPlatforms, selectPlatforms} from "./clients/index.js";

export class OpenLinkViewModel extends ViewModel {
    constructor(options) {
        super(options);
        const {clients, link} = options;
        this._link = link;
        this._clients = clients;
        this.openDefaultViewModel = null;
        this.serverConsentViewModel = null;
        this.previewViewModel = null;
        this.clientsViewModel = null;
        this.previewLoading = false;
        this.tryingLink = false;
        if (!this._tryOpenDefault()) {
            this._activeOpen();
        }
    }

    _tryOpenDefault() {
        const client = this._getPreferredClient();
        let proposedPlatform = null;
        let webPlatform = null;
        if (client) {
            const matchingPlatforms = getMatchingPlatforms(client, this.platforms);
            const selectedPlatforms = selectPlatforms(matchingPlatforms, this.preferences.platform);
            if (selectedPlatforms.proposedPlatform !== selectedPlatforms.nativePlatform) {
                // Do not auto-open web applications
                return false;
            }
            proposedPlatform = selectedPlatforms.proposedPlatform;
            webPlatform = selectedPlatforms.webPlatform;

            if (!client.getDeepLink(proposedPlatform, this._link)) {
                // Client doesn't support deep links. We can't open it.
                return false;
            }
        }
        this.openDefaultViewModel = new OpenDefaultViewModel(this.childOptions({
            client,
            link: this._link,
            openLinkVM: this,
            proposedPlatform,
            webPlatform,
        }));
        this.openDefaultViewModel.tryOpenLink();
        return true;
    }

    closeDefault() {
        this.openDefaultViewModel = null;
        this._activeOpen();
    }

    _activeOpen() {
        if (this.preferences.homeservers === null) {
            this._showServerConsent();
        } else {
            this._showLink();
        }
    }

    _showServerConsent() {
        let servers = [];
        if (this.preferences.homeservers) {
            servers.push(...this.preferences.homeservers);
        }
        servers.push(...this._link.servers);
        servers = orderedUnique(servers);
        this.serverConsentViewModel = new ServerConsentViewModel(this.childOptions({
            servers,
            done: () => {
                this.serverConsentViewModel = null;
                this._showLink();
            }
        }));
        this.emitChange();
    }

    _getPreferredClient() {
        const clientId = this.preferences.clientId || this._link.clientId;
        return clientId ? this._clients.find(c => c.id === clientId) : null;
    }

    async _showLink() {
        const preferredClient = this._getPreferredClient();
        this.clientsViewModel = new ClientListViewModel(this.childOptions({
            clients: this._clients,
            link: this._link,
            client: preferredClient,
        }));
        this.previewViewModel = new PreviewViewModel(this.childOptions({
            link: this._link,
            consentedServers: this.preferences.homeservers
        }));
        this.previewLoading = true;
        this.emitChange();
        await this.previewViewModel.load();
        this.previewLoading = false;
        this.emitChange();
    }

    get previewDomain() {
        return this.previewViewModel?.domain;
    }

    get previewFailed() {
        return this.previewViewModel?.failed;
    }

    get showClientsLabel() {
        return getLabelForLinkKind(this._link.kind);
    }

    changeServer() {
        this.previewViewModel = null;
        this.clientsViewModel = null;
        this._showServerConsent();
        this.emitChange();
    }
}
