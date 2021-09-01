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
import {LinkKind, IdentifierKind} from "./Link.js";

export class InvalidUrlView extends TemplateView {
    render(t, vm) {
        return t.div({ className: "DisclaimerView card" }, [
            t.h1("Invalid URL"),
            t.p([
                'The link you have entered is not valid. If you like, you can ',
                t.a({ href: "#/" }, 'return to the home page.')
            ]),
            vm.validFixes.length ? this._renderValidFixes(t, vm.validFixes) : [],
        ]);
    }

    _describeRoom(identifierKind) {
        return identifierKind === IdentifierKind.RoomAlias ? "room alias" : "room";
    }

    _describeLinkKind(linkKind, identifierKind) {
        switch (linkKind) {
            case LinkKind.Room: return `The ${this._describeRoom(identifierKind)} `;
            case LinkKind.User: return "The user ";
            case LinkKind.Group: return "The group ";
            case LinkKind.Event: return `An event in ${this._describeRoom(identifierKind)} `;
        }
    }

    _renderValidFixes(t, validFixes) {
        return t.p([
            'Did you mean any of the following?',
            t.ul(validFixes.map(fix =>
                t.li([
                    this._describeLinkKind(fix.link.kind, fix.link.identifierKind),
                    t.a({ href: fix.url }, fix.link.identifier)
                ])
            ))
        ]);
    }
}
