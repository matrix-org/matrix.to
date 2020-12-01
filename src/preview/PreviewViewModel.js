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

import {LinkKind, getLabelForLinkKind} from "../Link.js";
import {ViewModel} from "../utils/ViewModel.js";
import {resolveServer} from "./HomeServer.js";
import {ClientListViewModel} from "../client/ClientListViewModel.js";
import {ClientViewModel} from "../client/ClientViewModel.js";

export class PreviewViewModel extends ViewModel {
	constructor(options) {
		super(options);
		const { link, consentedServers, clients } = options;
		this._link = link;
		this._consentedServers = consentedServers;
		this._clients = clients;
		this._preferredClient = this.preferences.clientId ? clients.find(c => c.id === this.preferences.clientId) : null;

		this.loading = false;
		this.name = null;
		this.avatarUrl = null;
		this.previewDomain = null;
		this.clientsViewModel = null;
		this.acceptInstructions = null;
		this.preferredClientViewModel = this._preferredClient ? new ClientViewModel(this.childOptions({
			client: this._preferredClient,
			link: this._link
		})) : null;
	}

	async load() {
		this.loading = true;
		this.emitChange();
		for (const server of this._consentedServers) {
			try {
				const homeserver = await resolveServer(this.request, server);
				switch (this._link.kind) {
					case LinkKind.User:
						await this._loadUserPreview(homeserver, this._link.identifier);
				}
				// assume we're done if nothing threw
				this.previewDomain = server;
				break;
			} catch (err) {
				continue;
			}
		}
		this.loading = false;
		this.emitChange();
	}

	async _loadUserPreview(homeserver, userId) {
		const profile = await homeserver.getUserProfile(userId);
		this.name = profile.displayname || userId;
		this.avatarUrl = profile.avatar_url ?
			homeserver.mxcUrlThumbnail(profile.avatar_url, 64, 64, "crop") :
			null;
	}

	get identifier() {
		return this._link.identifier;
	}

	get canShowClients() {
		return !(this.preferredClientViewModel || this.clientsViewModel);
	}

	get showClientsLabel() {
		return getLabelForLinkKind(this._link.kind);
	}

	showClients() {
		if (!this._preferredClient) {
			this.clientsViewModel = new ClientListViewModel(this.childOptions({clients: this._clients, link: this._link}));
			this.emitChange();
		}
	}
}