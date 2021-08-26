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

export class AutoOpenViewModel extends ViewModel {
    constructor(options) {
        super(options);
        const {client, link, openLinkVM, proposedPlatform, webPlatform} = options;
        this._client = client;
        this._link = link;
        this._openLinkVM = openLinkVM;
        this._proposedPlatform = proposedPlatform;
        this._webPlatform = webPlatform;
    }

    get name() {
        return this._client?.name;
    }

    get iconUrl() {
        return this._client?.icon;
    }

    get openingDefault() {
        return !this._client;
    }

    get autoRedirect() {
        // Only auto-redirect when a preferred client hasn't been set.
        return this.openingDefault;
    }

    get webDeepLink() {
        return this._client && this._webPlatform && this._client.getDeepLink(this._webPlatform, this._link);
    }

    close() {
        this._openLinkVM.closeAutoOpen();
    }

    tryOpenLink() {
        this.openLink(this._client ? 
            this._client.getDeepLink(this._proposedPlatform, this._link) :
            this._link.toMatrixUrl());
        this.trying = true;
        this.setTimeout(() => {
            if (this.autoRedirect) {
                // We're about to be closed so don't
                // bother with visual updates.
                this.close();
            } else {
                this.trying = false;
                this.emitChange();
            }
        }, 1000);
        this.emitChange();
    }
}
