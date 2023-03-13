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
import {SchildiChat} from "./SchildiChat.js";
import {Weechat} from "./Weechat.js";
import {Nheko} from "./Nheko.js";
import {Fractal} from "./Fractal.js";
import {Quaternion} from "./Quaternion.js";
import {Tensor} from "./Tensor.js";
import {Fluffychat} from "./Fluffychat.js";
import {NeoChat} from "./NeoChat.js";
import {Syphon} from "./Syphon.js";
import {Thunderbird} from "./Thunderbird.js";
import {Cinny} from "./Cinny.js"

export function createClients() {
    return [
        new Element(),
        new SchildiChat(),
        new Weechat(),
        new Nheko(),
        new Fractal(),
        new Quaternion(),
        new Tensor(),
        new Fluffychat(),
        new NeoChat(),
        new Syphon(),
        new Thunderbird(),
        new Cinny(),
    ];
}
