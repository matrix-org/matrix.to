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

export class ServerConsentView extends TemplateView {
    render(t, vm) {
        const useAnotherServer = t.button({
            className: "text",
            onClick: () => vm.setShowServers()}, "use another server");
        const continueWithoutPreview = t.button({
            className: "text",
            onClick: () => vm.continueWithoutConsent(this._askEveryTimeChecked)
        }, "continue without a preview");
        return t.div({className: "ServerConsentView"}, [
            t.p([
                "Preview this link using the ",
                t.strong(vm => vm.selectedServer || "…"),
                " homeserver ",
                t.span({className: {hidden: vm => !vm.selectedServer}}, [
                    " (",
                    t.a({
                        href: vm => `#/policy/${vm.selectedServer}`,
                        target: "_blank",
                    }, "privacy policy"),
                    ")",
                ]),
                t.span({className: {hidden: vm => vm.showSelectServer}}, [
                    ", ",
                    useAnotherServer,
                ]),
                " or ",
                continueWithoutPreview,
                "."
            ]),
            t.form({action: "#", id: "serverConsentForm", onSubmit: evt => this._onSubmit(evt)}, [
                t.mapView(vm => vm.showSelectServer, show => show ? new ServerOptions(vm) : null),
                t.div({className: "actions"}, [
                    t.label([t.input({type: "checkbox", name: "askEveryTime"}), "Ask every time"]),
                    t.input({type: "submit", value: "Continue", className: "primary fullwidth"})
                ])
            ])
        ]);
    }

    _onSubmit(evt) {
        evt.preventDefault();
        this.value.continueWithSelection(this._askEveryTimeChecked);
    }

    get _askEveryTimeChecked() {
        const form = document.getElementById("serverConsentForm");
        const {askEveryTime} = form.elements;
        return askEveryTime.checked;
    }
}

class ServerOptions extends TemplateView {
    render(t, vm) {
        const options = vm.servers.map(server => {
            return t.div(t.label([t.input({
                type: "radio",
                name: "selectedServer",
                value: server,
                checked: server === vm.selectedServer
            }), t.span(server)]))
        });
        options.push(t.div({className: "other"}, t.label([
            t.input({type: "radio", name: "selectedServer", value: "other"}),
            t.input({
                type: "text",
                className: "line",
                placeholder: "Other",
                name: "otherServer",
                onClick: evt => this._onClickOther(evt),
            })
        ])));
        return t.div({
            className: "ServerOptions",
            onChange: evt => this._onChange(evt),
        }, options);
    }

    _onClickOther(evt) {
        const textField = evt.target;
        const radio = Array.from(textField.form.elements.selectedServer).find(r => r.value === "other");
        if (!radio.checked) {
            radio.checked = true;
            this._onChangeServerRadio(radio);
        }
    }

    _onChange(evt) {
        let {name, value} = evt.target;
        if (name === "selectedServer") {
            this._onChangeServerRadio(evt.target);
        } else if (name === "otherServer") {
            const textField = evt.target;
            if(!this.value.selectOtherServer(value)) {
                textField.setCustomValidity("Please enter a valid domain name");
            } else {
                textField.setCustomValidity("");
            }
        }
    }

    _onChangeServerRadio(radio) {
        let {value, form} = radio;
        const {otherServer} = form.elements;
        if (value === "other") {
            otherServer.required = true;
            value = otherServer.value;
        } else {
            otherServer.required = false;
            otherServer.setCustomValidity("");
        }
        this.value.selectServer(value);
    }
}
