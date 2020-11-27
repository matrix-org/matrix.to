import {xhrRequest} from "./utils/xhr.js";
import {validateHomeServer} from "./matrix/HomeServer.js";
import {Link, LinkKind} from "./Link.js";

export async function main() {
	const link = Link.parseFragment(location.hash);
	if (!link) {
		throw new Error("bad link");
	}
	const hs = await validateHomeServer(xhrRequest, link.servers[0]);
	if (link.kind === LinkKind.User) {
		const profile = await hs.getUserProfile(link.identifier);
		const imageURL = hs.mxcUrlThumbnail(profile.avatar_url, 64, 64, "crop");
		console.log(imageURL);
	}
}