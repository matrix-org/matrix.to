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

import {Link} from "./Link.js";
import {ViewModel} from "./utils/ViewModel.js";
import {PreviewViewModel} from "./preview/PreviewViewModel.js";

export class RootViewModel extends ViewModel {
	constructor(request) {
		super({request});
		this.link = null;
		this.previewViewModel = null;
	}

	_updateChildVMs(oldLink) {
		if (this.link) {
			if (!oldLink || !oldLink.equals(this.link)) {
				this.previewViewModel = new PreviewViewModel(this.childOptions({
					link: this.link,
					consentedServers: this.link.servers
				}));
				this.previewViewModel.load();
			}
		} else {
			this.previewViewModel = null;
		}
		this.emitChange();
	}

	updateHash(hash) {
		const oldLink = this.link;
		this.link = Link.parseFragment(hash);
		this._updateChildVMs(oldLink);
	}

	get activeSection() {
		if (this.previewViewModel) {
			return "preview";
		}
		return "";
	}
}