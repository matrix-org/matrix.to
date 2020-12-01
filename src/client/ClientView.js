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

export class ListedClientView extends TemplateView {
	render(t, vm) {
		return t.div({className: "ListedClientView"}, [
			t.div({className: "header"}, [
				t.div({className: "description"}, [
					t.h3(vm.name),
					t.p(vm.description),
				]),
				t.div({className: `icon ${vm.clientId}`})
			]),
			t.view(new ClientView(vm))
		]);
	}
}

export class ClientView extends TemplateView {
	render(t, vm) {
		return t.div({className: "ClientView"}, [
			t.mapView(vm => vm.stage, stage => {
				switch (stage) {
					case "open": return new OpenClientView(vm);
					case "install": return new InstallClientView(vm);
				}
			}),
		]);
	}
}

class OpenClientView extends TemplateView {
	render(t, vm) {
		return t.div({className: "OpenClientView"}, [
			t.a({
				className: "primary",
				href: vm.deepLink,
				rel: "noopener noreferrer",
				onClick: () => vm.deepLinkActivated(),
			}, vm.deepLinkLabel)
		]);
	}
}

class InstallClientView extends TemplateView {
	render(t, vm) {
		return t.div({className: "InstallClientView"}, [
			t.h3(`Looks like you don't have ${vm.name} installed.`),
			t.div({className: "actions"}, vm.actions.map(a => {
				let badgeUrl;
				switch (a.kind) {
					case "play-store": badgeUrl = "images/google-play-us.svg"; break;
					case "fdroid": badgeUrl = "images/fdroid-badge.png"; break;
					case "apple-app-store": badgeUrl = "images/app-store-us-alt.svg"; break;
				}
				return t.a({
					href: a.url,
					className: {
						primary: a.primary && !badgeUrl,
						secondary: !a.primary && !badgeUrl,
						badge: !!badgeUrl,
					},
					rel: "noopener noreferrer",
					["aria-label"]: a.label, 
					onClick: () => a.activated()
				}, badgeUrl ? t.img({src: badgeUrl}) : a.label);
			}))
		]);
	}
}