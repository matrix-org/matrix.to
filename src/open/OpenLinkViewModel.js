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
import {getLabelForLinkKind} from "../Link.js";

export class OpenLinkViewModel extends ViewModel {
	constructor(options) {
		super(options);
		const {clients, link, consentedServers} = options;
		this._link = link;
		this._clients = clients;
		this.previewViewModel = new PreviewViewModel(this.childOptions({link, consentedServers}));
		this.previewLoading = false;
		const preferredClient = this.preferences.clientId ? clients.find(c => c.id === this.preferences.clientId) : null;
		this.clientsViewModel = preferredClient ? new ClientListViewModel(this.childOptions({
			clients,
			link,
			client: preferredClient,
		})) : null;
	}

	async load() {
		this.previewLoading = true;	
		this.emitChange();
		await this.previewViewModel.load();
		this.previewLoading = false;
		this.emitChange();
	}

	get previewDomain() {
		return this.previewViewModel.previewDomain;
	}

	get showClientsLabel() {
		return getLabelForLinkKind(this._link.kind);
	}

	showClients() {
		if (!this.clientsViewModel) {
			this.clientsViewModel = new ClientListViewModel(this.childOptions({
				clients: this._clients,
				link: this._link
			}));
			this.emitChange();
		}
	}
}
