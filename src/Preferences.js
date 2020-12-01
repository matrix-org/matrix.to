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

import {Platform} from "./client/Platform.js";

export class Preferences {
	constructor(localStorage) {
		this._localStorage = localStorage;
		this.clientId = null;
		// used to differentiate web from native if a client supports both
		this.platform = null;
		this.homeservers = [];

		const prefsStr = localStorage.getItem("preferred_client");
		if (prefsStr) {
			const {id, platform} = JSON.parse(prefsStr);
			this.clientId = id;
			this.platform = Platform[platform];
		}
	}

	setClient(id, platform) {
		this.clientId = id;
		platform = Platform[platform];
		this.platform = platform;
		this._localStorage.setItem("preferred_client", JSON.stringify({id, platform}));
	}

	setHomeservers(homeservers) {

	}

	clear() {
		this._localStorage.removeItem("preferred_client");
		this.clientId = null;
		this.platform = null;
	}

	get canClear() {
		return !!this.clientId || !!this.platform; 
	}
}