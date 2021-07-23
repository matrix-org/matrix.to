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
import {orderedUnique} from "../utils/unique.js";

export class ServerConsentViewModel extends ViewModel {
    constructor(options) {
        super(options);
        this.servers = options.servers;
        this.done = options.done;
        this.selectedServer = this.servers[0];
        this.showSelectServer = false;
    }

    setShowServers() {
        this.showSelectServer = true;
        this.emitChange();
    }

    selectServer(server) {
        this.selectedServer = server;
        this.emitChange();
    }

    selectOtherServer(domainOrUrl) {
        let urlStr = domainOrUrl;
        if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
            urlStr = `https://${domainOrUrl}`;
        }
        try {
            const domain = new URL(urlStr).hostname;
            if (/((?:[0-9a-zA-Z][0-9a-zA-Z-]{1,61}\.)+)(xn--[a-z0-9]+|[a-z]+)/.test(domain) || domain === "localhost") {
                this.selectServer(domainOrUrl);
                return true;
            }
        } catch (err) {}
        this.selectServer(null);
        return false;
    }

    continueWithSelection(askEveryTime) {
        // keep previously consented servers
        const homeservers = this.preferences.homeservers || [];
        homeservers.unshift(this.selectedServer);
        this.preferences.setHomeservers(orderedUnique(homeservers), !askEveryTime);
        this.done();
    }

    continueWithoutConsent(askEveryTime) {
        this.preferences.setHomeservers([], !askEveryTime);
        this.done();
    }
}
