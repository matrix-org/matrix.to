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
import {OpenLinkViewModel} from "./open/OpenLinkViewModel.js";
import {createClients} from "./open/clients/index.js";
import {CreateLinkViewModel} from "./create/CreateLinkViewModel.js";
import {LoadServerPolicyViewModel} from "./policy/LoadServerPolicyViewModel.js";
import {Platform} from "./Platform.js";

export class RootViewModel extends ViewModel {
    constructor(options) {
        super(options);
        this.link = null;
        this.openLinkViewModel = null;
        this.createLinkViewModel = null;
        this.loadServerPolicyViewModel = null;
        this.preferences.on("canClear", () => {
            this.emitChange();
        });
    }

    _updateChildVMs(oldLink) {
        if (this.link) {
            this.createLinkViewModel = null;
            if (!oldLink || !oldLink.equals(this.link)) {
                this.openLinkViewModel = new OpenLinkViewModel(this.childOptions({
                    link: this.link,
                    clients: createClients(),
                }));
            }
        } else {
            this.openLinkViewModel = null;
            this.createLinkViewModel = new CreateLinkViewModel(this.childOptions());
        }
        this.emitChange();
    }

    updateHash(hash) {
        if (hash.startsWith("#/policy/")) {
            const server = hash.substr(9);
            this.loadServerPolicyViewModel = new LoadServerPolicyViewModel(this.childOptions({server}));
            this.loadServerPolicyViewModel.load();
        } else {
            const oldLink = this.link;
            this.link = Link.parse(hash);
            this._updateChildVMs(oldLink);
        }
    }

    clearPreferences() {
        this.preferences.clear();
        this._updateChildVMs();
    }

    get hasPreferences() {
        return this.preferences.canClear;
    }
}
