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

export class CreateLinkView extends TemplateView {
	render(t, vm) {
		return t.div({className: "CreateLinkView card"}, [
			t.mapView(vm => vm.previewViewModel, childVM => childVM ? new PreviewView(childVM) : null),
			t.h2({className: {hidden: vm => !vm.linkUrl}}, t.a({href: vm => vm.linkUrl}, vm => vm.linkUrl)),
			t.div(t.input({
				className: "fullwidth",
				type: "text",
				onChange: evt => vm.createLink(evt.target.value),
				placeholder: "#room:example.com, @user:example.com"
			})),
		]);
	}
}