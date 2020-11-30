import {xhrRequest} from "./utils/xhr.js";
import {RootViewModel} from "./RootViewModel.js";
import {RootView} from "./RootView.js";

export async function main(container) {
	const vm = new RootViewModel(xhrRequest);
	vm.updateHash(location.hash);
	window.__rootvm = vm;
	const view = new RootView(vm);
	container.appendChild(view.mount());
	window.addEventListener('hashchange', event => {
		vm.updateHash(location.hash);
	});
}