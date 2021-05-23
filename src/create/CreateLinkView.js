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
import {copyButton} from "../utils/copy.js";

export class CreateLinkView extends TemplateView {
	render(t, vm) {
        console.dir(this);
        const link = t.a({href: vm => vm.linkUrl}, vm => vm.linkUrl);
		return t.div({className: "CreateLinkView card"}, [
			t.h1(this._i18n.translate('create.header')),
			t.form({action: "#", onSubmit: evt => this._onSubmit(evt)}, [
				t.div(t.input({
					className: "fullwidth large",
					type: "text",
					name: "identifier",
                    required: true,
					placeholder: this._i18n.translate("create.inputPlaceholder"),
                    onChange: evt => this._onIdentifierChange(evt)
				})),
				t.div(t.input({className: "primary fullwidth icon link", type: "submit", value: this._i18n.translate('create.submit')}))
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
            inputField.setCustomValidity(this._i18n.translate("create.inputError"));
        } else {
            inputField.setCustomValidity("");
        }
    }
}
