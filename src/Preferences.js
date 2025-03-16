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

import {Platform} from "./Platform.js";
import {EventEmitter} from "./utils/ViewModel.js";

export class Preferences extends EventEmitter {
    constructor(localStorage) {
        super();
        this._localStorage = localStorage;
        this.clientId = null;
        // used to differentiate web from native if a client supports both
        this.platform = null;
        this.homeservers = null;
        this.preferredWebInstances = {};

        const prefsStr = localStorage.getItem("preferred_client");
        if (prefsStr) {
            const {id, platform} = JSON.parse(prefsStr);
            this.clientId = id;
            this.platform = Platform[platform];
        }
        const serversStr = localStorage.getItem("consented_servers");
        if (serversStr) {
            this.homeservers = JSON.parse(serversStr);
        }
        const preferredWebInstancesStr = localStorage.getItem("preferred_web_instances");
        if (preferredWebInstancesStr) {
            this.preferredWebInstances = JSON.parse(preferredWebInstancesStr);
        }
    }

    setClient(id, platform) {
        this.clientId = id;
        platform = Platform[platform];
        this.platform = platform;
        this._localStorage.setItem("preferred_client", JSON.stringify({id, platform}));
        this.emit("canClear")
    }

    setHomeservers(homeservers, persist) {
        this.homeservers = homeservers;
        if (persist) {
            this._localStorage.setItem("consented_servers", JSON.stringify(homeservers));
            this.emit("canClear");
        }
    }

    setPreferredWebInstance(client_id, instance_url) {
        this.preferredWebInstances[client_id] = instance_url;
        this._localStorage.setItem("preferred_web_instances", JSON.stringify(this.preferredWebInstances));
        this.emit("canClear");
    }

    getPreferredWebInstance(client_id) {
        return this.preferredWebInstances[client_id];
    }

    clear() {
        this._localStorage.removeItem("preferred_client");
        this._localStorage.removeItem("consented_servers");
        this._localStorage.removeItem("preferred_web_instances");
        this.clientId = null;
        this.platform = null;
        this.homeservers = null;
        this.preferredWebInstances = {};
    }

    get canClear() {
        return !!this.clientId || !!this.platform || !!this.homeservers;
    }
}
