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
import {ClientView} from "../client/ClientView.js";

export class PreviewView extends TemplateView {
	render(t, vm) {
		return t.div({className: "PreviewView card"}, [
			t.h1({className: {hidden: vm => !vm.loading}}, "Loading preview…"),
			t.div({className: {hidden: vm => vm.loading}}, [
				t.div({className: "preview"}, [
					t.p(t.img({className: "avatar", src: vm => vm.avatarUrl})),
					t.h1(vm => vm.name),
					t.p(vm => vm.identifier),
					t.p({className: {hidden: vm => !vm.memberCount}}, [vm => vm.memberCount, " members"]),
					t.p({className: {hidden: vm => !vm.topic}}, [vm => vm.topic]),
				]),
				t.p({className: {hidden: vm => vm.clientsViewModel}}, t.button({
					className: "primary fullwidth",
					onClick: () => vm.showClients()
				}, vm => vm.showClientsLabel)),
				t.mapView(vm => vm.clientsViewModel, childVM => childVM ? new ClientListView(childVM) : null),
				t.p(["Preview provided by ", vm => vm.previewDomain]),
			])
		]);
	}
}
