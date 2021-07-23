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
import {PreviewViewModel} from "../preview/PreviewViewModel.js";
import {Link} from "../Link.js";

export class CreateLinkViewModel extends ViewModel {
    constructor(options) {
        super(options);
        this._link = null;
        this.previewViewModel = null;
    }

    validateIdentifier(identifier) {
        return Link.validateIdentifier(identifier);
    }

    async createLink(identifier) {
        this._link = Link.parse(identifier);
        if (this._link) {
            this.openLink("#" + this._link.toFragment());
        }
    }
}
