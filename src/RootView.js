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

import {TemplateView} from "./utils/TemplateView.js";
import {OpenLinkView} from "./open/OpenLinkView.js";
import {CreateLinkView} from "./create/CreateLinkView.js";
import {LoadServerPolicyView} from "./policy/LoadServerPolicyView.js";
import {DisclaimerView} from "./disclaimer/DisclaimerView.js";

export class RootView extends TemplateView {
    render(t, vm) {
        return t.div({className: "RootView"}, [
            t.mapView(vm => vm.showDisclaimer, disclaimer => disclaimer ? new DisclaimerView() : null),
            t.mapView(vm => vm.openLinkViewModel, vm => vm ? new OpenLinkView(vm) : null),
            t.mapView(vm => vm.createLinkViewModel, vm => vm ? new CreateLinkView(vm) : null),
            t.mapView(vm => vm.loadServerPolicyViewModel, vm => vm ? new LoadServerPolicyView(vm) : null),
            t.div({className: "footer"}, [
                t.p(t.img({src: "images/matrix-logo.svg"})),
                t.p(["This invite uses ", externalLink(t, "https://matrix.org", "Matrix"), ", an open network for secure, decentralized communication."]),
                t.ul({className: "links"}, [
                    t.li(externalLink(t, "https://github.com/matrix-org/matrix.to", "GitHub project")),
                    t.li(externalLink(t, "https://github.com/matrix-org/matrix.to/tree/main/src/open/clients", "Add your app")),
                    t.li({className: {hidden: vm => !vm.hasPreferences}},
                        t.button({className: "text", onClick: () => vm.clearPreferences()}, "Clear preferences")),
                    t.li(t.a({href: "#/disclaimer/"}, "Disclaimer")),
                ])
            ])
        ]);
    }
}

function externalLink(t, href, label) {
    return t.a({href, target: "_blank", rel: "noopener noreferrer"}, label);
}
