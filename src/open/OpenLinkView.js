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

import {TemplateView} from "../utils/TemplateView.js";
import {ClientListView} from "./ClientListView.js";
import {PreviewView} from "../preview/PreviewView.js";
import {ServerConsentView} from "./ServerConsentView.js";

export class OpenLinkView extends TemplateView {
    render(t, vm) {
        return t.div({className: "OpenLinkView card"}, [
            t.mapView(vm => [ vm.openDefaultViewModel, vm.previewViewModel ], ([openDefaultVM, previewVM]) => {
                if (openDefaultVM) {
                    return new TryingLinkView(openDefaultVM)
                } else if (previewVM) {
                    return new ShowLinkView(vm);
                } else {
                    return new ServerConsentView(vm.serverConsentViewModel);
                }
            }),
        ]);
    }
}


class TryingLinkView extends TemplateView {
    render (t, vm) {
        const children = [
            vm.iconUrl ? t.img({ className: "clientIcon", src: vm.iconUrl }) : t.div({className: "defaultAvatar"}),
            t.h1(vm.name ? `Opening ${vm.name}` : "Trying to open your default client..."),
        ]
        if (vm.name) {
            children.push(t.span(["Select ", t.strong(`"Open ${vm.name}"`), " to launch the app."]));
        }
        if (vm.autoRedirect) {
            children.push("If this doesn't work, you will be redirected shortly.");
        }
        if (vm.webDeepLink) {
            children.push(t.span(["You can also ", t.a({
                href: vm.webDeepLink,
                target: "_blank",
                rel: "noopener noreferrer",
            }, `open ${vm.name} in your browser.`)]));
        }
        const timeoutOptions = t.span({ className: "timeoutOptions" }, [
            t.strong("Not working? "),
            t.a({ href: vm.deepLink, onClick: () => vm.startSpinner() }, "Try again"),
            " or ",
            t.button({ className: "text", onClick: () => vm.close() }, "select another app.")
        ]);
        children.push(
            t.map(vm => vm.trying, trying => trying ?
                t.div({className: "spinner"}) :
                timeoutOptions
            ),
        );
                
        return t.div({ className: "OpeningClientView" }, children);
    }
}

class ShowLinkView extends TemplateView {
    render(t, vm) {
        return t.div([
            t.view(new PreviewView(vm.previewViewModel)),
            t.view(new ClientListView(vm.clientsViewModel)),
            t.p({className: {caption: true, hidden: vm => !vm.previewDomain}}, [
                vm => vm.previewFailed ? `${vm.previewDomain} has not returned a preview.` : `Preview provided by ${vm.previewDomain}`,
                " · ",
                t.button({className: "text", onClick: () => vm.changeServer()}, "Change"),
            ]),
        ]);
    }
}
