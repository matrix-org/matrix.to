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

import {xhrRequest} from "./utils/xhr.js";
import {RootViewModel} from "./RootViewModel.js";
import {RootView} from "./RootView.js";
import {Preferences} from "./Preferences.js";
import {guessApplicablePlatforms} from "./Platform.js";

export async function main(container) {
    const vm = new RootViewModel({
        request: xhrRequest,
        openLink: url => location.href = url,
        platforms: guessApplicablePlatforms(navigator.userAgent, navigator.platform),
        preferences: new Preferences(window.localStorage),
        origin: location.origin,
    });
    vm.updateHash(decodeURIComponent(location.hash));
    window.__rootvm = vm;
    const view = new RootView(vm);
    container.appendChild(view.mount());
    window.addEventListener('hashchange', () => {
        vm.updateHash(decodeURIComponent(location.hash));
    });
}
