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

import { Client } from './types';

import Element, { ElementDevelop } from './Element.io';
import Weechat from './Weechat';
import Nheko from './Nheko';
import Fractal from './Fractal';

/*
 * All the supported clients of matrix.to
 */
const clients: Client[] = [Element, Weechat, Nheko, Fractal, ElementDevelop];

/*
 * A map from sharer string to client.
 * Configured by hand so we can change the mappings
 * easily later.
 */
export const clientMap: { [key: string]: Client } = {
    [Element.clientId]: Element,
    [Weechat.clientId]: Weechat,
    [ElementDevelop.clientId]: ElementDevelop,
    [Nheko.clientId]: Nheko,
    [Fractal.clientId]: Fractal,
};

/*
 * All the supported clients of matrix.to
 */
export default clients;
