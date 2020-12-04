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
import {PreviewView} from "../preview/PreviewView.js";

function selectNode(node) {
    let selection = window.getSelection();
    selection.removeAllRanges();
    let range = document.createRange();
    range.selectNode(node);
    selection.addRange(range);
}

function copyButton(t, copyNode, label, classNames) {
    return t.button({className: `${classNames} icon copy`, onClick: evt => {
        const button = evt.target;
        selectNode(copyNode);
        if (document.execCommand("copy")) {
            button.innerText = "Copied!";
            button.classList.remove("copy");
            button.classList.add("tick");
            setTimeout(() => {
                button.classList.remove("tick");
                button.classList.add("copy");
                button.innerText = label;
            }, 2000);
        }
    }}, label);
}

export class CreateLinkView extends TemplateView {
	render(t, vm) {
        const link = t.a({href: vm => vm.linkUrl}, vm => vm.linkUrl);
		return t.div({className: "CreateLinkView card"}, [
			t.h1(
				{className: {hidden: vm => vm.previewViewModel}},
				"Create shareable links to Matrix rooms, users or messages without being tied to any app"
			),
			t.mapView(vm => vm.previewViewModel, childVM => childVM ? new PreviewView(childVM) : null),
            t.div({className: {hidden: vm => !vm.linkUrl}}, [
                t.h2(link),
                t.div(copyButton(t, link, "Copy link", "fullwidth primary")),
                t.div(t.button({className: "secondary fullwidth", onClick: () => this._clear()}, "Or create another link")),
            ]),
			t.form({action: "#", onSubmit: evt => this._onSubmit(evt), className: {hidden: vm => vm.linkUrl}}, [
				t.div(t.input({
					className: "fullwidth large",
					type: "text",
					name: "identifier",
                    required: true,
					placeholder: "#room:example.com, @user:example.com",
                    onChange: evt => this._onIdentifierChange(evt)
				})),
				t.div(t.input({className: "primary fullwidth icon link", type: "submit", value: "Create link"}))
			]),
		]);
	}

	_onSubmit(evt) {
		evt.preventDefault();
		const form = evt.target;
		const {identifier} = form.elements;
		this.value.createLink(identifier.value);
        identifier.value = "";

	}

    _onIdentifierChange(evt) {
        const inputField = evt.target;
        if (!this.value.validateIdentifier(inputField.value)) {
            inputField.setCustomValidity("That doesn't seem valid. Try #room:example.com, @user:example.com or +group:example.com.");
        } else {
            inputField.setCustomValidity("");
        }
    }

    _clear() {
        this.value.clear();
        const textField = this.root().querySelector("input[name=identifier]");
        textField.focus();
    }
}
