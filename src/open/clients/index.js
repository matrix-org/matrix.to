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

import {Element} from "./Element.js";
import {Weechat} from "./Weechat.js";
import {Nheko} from "./Nheko.js";
import {Fractal} from "./Fractal.js";
import {Quaternion} from "./Quaternion.js";
import {Tensor} from "./Tensor.js";
import {Fluffychat} from "./Fluffychat.js";
import {isWebPlatform} from "../../Platform.js"

export function getMatchingPlatforms(client, supportedPlatforms) {
    const clientPlatforms = client.platforms;
    const matchingPlatforms = supportedPlatforms.filter(p => {
        return clientPlatforms.includes(p);
    });
    return matchingPlatforms;
}

export function selectPlatforms(matchingPlatforms, userPreferredPlatform) {
    const webPlatform = matchingPlatforms.find(p => isWebPlatform(p));
    const nativePlatform = matchingPlatforms.find(p => !isWebPlatform(p));
    const preferredPlatform = matchingPlatforms.find(p => p === userPreferredPlatform);
    return {
        proposedPlatform: preferredPlatform || nativePlatform || webPlatform,
        nativePlatform, webPlatform
    };
}

export function createClients() {
    return [
        new Element(),
        new Weechat(),
        new Nheko(),
        new Fractal(),
        new Quaternion(),
        new Tensor(),
        new Fluffychat(),
    ];
}
