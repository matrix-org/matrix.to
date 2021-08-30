/*
Copyright 2021 The Matrix.org Foundation C.I.C.

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

import {TemplateView} from "./utils/TemplateView.js";

export class InvalidUrlView extends TemplateView {
    render(t) {
        return t.div({ className: "DisclaimerView card" }, [
            t.h1("Invalid URL"),
            t.p([
                'The link you have entered is not valid. If you like, you can ',
                t.a({ href: "#/" }, 'return to the home page.')
            ]),
        ]);
    }
}
