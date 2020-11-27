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

export async function validateHomeServer(request, baseURL) {
	if (!baseURL.startsWith("http://") && !baseURL.startsWith("https://")) {
		baseURL = `https://${baseURL}`;
	}
	{
		const {status, body} = await request(`${baseURL}/.well-known/matrix/client`, {method: "GET"}).response();
		if (status === 200) {
			const proposedBaseURL = body?.['m.homeserver']?.base_url;
			if (typeof proposedBaseURL === "string") {
				baseURL = proposedBaseURL;
			}
		}
	}
	{
		const {status} = await request(`${baseURL}/_matrix/client/versions`, {method: "GET"}).response();
		if (status !== 200) {
			throw new Error(`Invalid versions response from ${baseURL}`);
		}
	}
	return new HomeServer(request, baseURL);
}

export class HomeServer {
	constructor(request, baseURL) {
		this._request = request;
		this.baseURL = baseURL;
	}

	async getUserProfile(userId) {
		const {body} = await this._request(`${this.baseURL}/_matrix/client/r0/profile/${userId}`, {method: "GET"}).response();
		return body;
	}

	getGroupProfile(groupId) {
		//`/_matrix/client/r0/groups/${groupId}/profile`
	}

	getPublicRooms() {

	}

	mxcUrlThumbnail(url, width, height, method) {
        const parts = parseMxcUrl(url);
        if (parts) {
            const [serverName, mediaId] = parts;
            const httpUrl = `${this.baseURL}/_matrix/media/r0/thumbnail/${encodeURIComponent(serverName)}/${encodeURIComponent(mediaId)}`;
            return httpUrl + `?width=${width}&height=${height}&method=${method}`;
        }
        return null;
    }
}

function parseMxcUrl(url) {
    const prefix = "mxc://";
    if (url.startsWith(prefix)) {
        return url.substr(prefix.length).split("/", 2);
    } else {
        return null;
    }
}