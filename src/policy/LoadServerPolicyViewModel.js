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
import {resolveServer} from "../preview/HomeServer.js";

export class LoadServerPolicyViewModel extends ViewModel {
    constructor(options) {
        super(options);
        this.server = options.server;
        this.message = `Looking up ${this.server} privacy policy…`;
        this.loading = false;
    }

    async load() {
        this.loading = true;
        this.emitChange();
        try {
            const homeserver = await resolveServer(this.request, this.server);
            if (homeserver) {
                const url = await homeserver.getPrivacyPolicyUrl();
                if (url) {
                    this.message = `Loading ${this.server} privacy policy now…`;
                    this.openLink(url);
                } else {
                    this.loading = false;
                    this.message = `${this.server} does not declare a privacy policy.`;
                }
            } else {
                this.loading = false;
                this.message = `${this.server} does not look like a matrix homeserver.`;
            }
        } catch (err) {
            this.loading = false;
            this.message = `Failed to get the privacy policy for ${this.server}`;
        }
        this.emitChange();
    }
}
