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

function noTrailingSlash(url) {
    return url.endsWith("/") ? url.substr(0, url.length - 1) : url;
}

export async function resolveServer(request, baseURL) {
    baseURL = noTrailingSlash(baseURL);
    if (!baseURL.startsWith("http://") && !baseURL.startsWith("https://")) {
        baseURL = `https://${baseURL}`;
    }
    {
        try {
            const {status, body} = await request(`${baseURL}/.well-known/matrix/client`, {method: "GET"}).response();
            if (status === 200) {
                const proposedBaseURL = body?.['m.homeserver']?.base_url;
                if (typeof proposedBaseURL === "string") {
                    baseURL = noTrailingSlash(proposedBaseURL);
                }
            }
        } catch (e) {
            console.warn("Failed to fetch ${baseURL}/.well-known/matrix/client", e);
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
        const {body} = await this._request(`${this.baseURL}/_matrix/client/r0/profile/${encodeURIComponent(userId)}`).response();
        return body;
    }

    // MSC3266 implementation
    async getRoomSummary(roomIdOrAlias, viaServers) {
        let query;
        if (viaServers.length > 0) {
            query = "?" + viaServers.map(server => `via=${encodeURIComponent(server)}`).join('&');
        }
        const {body, status} = await this._request(`${this.baseURL}/_matrix/client/unstable/im.nheko.summary/rooms/${encodeURIComponent(roomIdOrAlias)}/summary${query}`).response();
        if (status !== 200) return;
        return body;
    }

    async findPublicRoomById(roomId) {
        const {body, status} = await this._request(`${this.baseURL}/_matrix/client/r0/directory/list/room/${encodeURIComponent(roomId)}`).response();
        if (status !== 200 || body.visibility !== "public") {
            return;
        }
        let nextBatch;
        do {
            const queryParams = encodeQueryParams({limit: 10000, since: nextBatch});
            const {body, status} = await this._request(`${this.baseURL}/_matrix/client/r0/publicRooms?${queryParams}`).response();
            nextBatch = body.next_batch;
            const publicRoom = body.chunk.find(c => c.room_id === roomId);
            if (publicRoom) {
                return publicRoom;
            }
        } while (nextBatch);
    }

    async getRoomIdFromAlias(alias) {
        const {status, body}  = await this._request(`${this.baseURL}/_matrix/client/r0/directory/room/${encodeURIComponent(alias)}`).response();
        if (status === 200) {
            return body.room_id;
        }
    }

    async getPrivacyPolicyUrl(lang = "en") {
        const headers = new Map();
        headers.set("Content-Type", "application/json");
        const options = {method: "POST", body: "{}", headers};
        const {status, body}  = await this._request(`${this.baseURL}/_matrix/client/r0/register`, options).response();
        if (status === 401 && body) {   // Unauthorized
            const hasTermsStage = body.flows.some(flow => flow.stages.includes("m.login.terms"));
            if (hasTermsStage) {
                const privacyPolicy = body.params?.["m.login.terms"]?.policies?.privacy_policy;
                if (privacyPolicy) {
                    const firstLang = Object.keys(privacyPolicy).find(k => k !== "version");
                    let languagePolicy = privacyPolicy[lang] || privacyPolicy[firstLang];
                    return languagePolicy?.url;
                }
            }
        }
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

function encodeQueryParams(queryParams) {
    return Object.entries(queryParams || {})
        .filter(([, value]) => value !== undefined)
        .map(([name, value]) => {
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            return `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        })
        .join("&");
}
