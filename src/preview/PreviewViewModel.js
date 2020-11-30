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

import {LinkKind} from "../Link.js";
import {ViewModel} from "../utils/ViewModel.js";
import {resolveServer} from "./HomeServer.js";
import {ClientListViewModel} from "../client/ClientListViewModel.js";

export class PreviewViewModel extends ViewModel {
	constructor(options) {
		super(options);
		const {
			link, consentedServers,
			preferredClient, preferredPlatform, clients
		} = options;
		this._link = link;
		this._consentedServers = consentedServers;
		this._preferredClient = preferredClient;
		// used to differentiate web from native if a client supports both
		this._preferredPlatform = preferredPlatform;
		this._clients = clients;

		this.loading = false;
		this.name = null;
		this.avatarUrl = null;
		this.previewDomain = null;
		this.clientsViewModel = null;
		this.acceptInstructions = null;
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

	get acceptLabel() {
		if (this._preferredClient) {
			return `Open in ${this._preferredClient.getName(this._preferredPlatform)}`;
		} else {
			return "Choose app";
		}
	}

	accept() {
		if (this._preferredClient) {
			if (this._preferredClient.getLinkSupport(this._preferredPlatform, this._link)) {
				const deepLink = this._preferredClient.getDeepLink(this._preferredPlatform, this._link);
				this.openLink(deepLink);
				// show "looks like you don't have the native app installed"
			} else {
				this.acceptInstructions = this._preferredClient.getLinkInstructions(this._preferredPlatform, this._link);
			}
		} else {
			this.clientsViewModel = new ClientListViewModel(this.childOptions({clients: this._clients, link: this._link}));
			// show client list
		}
		this.emitChange();
	}
}