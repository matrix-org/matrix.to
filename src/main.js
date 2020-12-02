import {xhrRequest} from "./utils/xhr.js";
import {RootViewModel} from "./RootViewModel.js";
import {RootView} from "./RootView.js";
import {Preferences} from "./Preferences.js";
import {guessApplicablePlatforms} from "./Platform.js";

export async function main(container) {
	const vm = new RootViewModel({
		request: xhrRequest,
		openLink: url => location.href = url,
		platforms: guessApplicablePlatforms(navigator.userAgent),
		preferences: new Preferences(window.localStorage),
		origin: location.origin,
	});
	vm.updateHash(location.hash);
	window.__rootvm = vm;
	const view = new RootView(vm);
	container.appendChild(view.mount());
	window.addEventListener('hashchange', event => {
		vm.updateHash(location.hash);
	});
}