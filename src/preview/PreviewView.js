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
import {ClientListView} from "../client/ClientListView.js";

export class PreviewView extends TemplateView {
	render(t, vm) {
		return t.div({className: "PreviewView card"}, [
			t.h2({className: {hidden: vm => !vm.loading}}, "Loading preview…"),
			t.div({className: {hidden: vm => vm.loading}}, [
				t.div({className: "preview"}, [
					t.p(t.img({className: "avatar", src: vm => vm.avatarUrl})),
					t.div({className: "profileInfo"}, [
						t.h2(vm => vm.name),
						t.p(vm => vm.identifier),
						t.p(["Preview from ", vm => vm.previewDomain]),
					]),
				]),
				t.p({hidden: vm => !!vm.clientsViewModel}, t.button({onClick: () => vm.accept()}, vm => vm.acceptLabel)),
				t.mapView(vm => vm.clientsViewModel, vm => vm ? new ClientListView(vm) : null)
			])
		]);
	}
}