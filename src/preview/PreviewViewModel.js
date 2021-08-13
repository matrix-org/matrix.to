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

import {LinkKind, IdentifierKind} from "../Link.js";
import {ViewModel} from "../utils/ViewModel.js";
import {resolveServer} from "./HomeServer.js";
import {ClientListViewModel} from "../open/ClientListViewModel.js";
import {ClientViewModel} from "../open/ClientViewModel.js";

export class PreviewViewModel extends ViewModel {
    constructor(options) {
        super(options);
        const { link, consentedServers } = options;
        this._link = link;
        this._consentedServers = consentedServers;
        this.loading = false;
        this.name = this._link.identifier;
        this.avatarUrl = null;
        this.identifier = null;
        this.memberCount = null;
        this.topic = null;
        this.domain = null;
        this.failed = false;
        this.isSpaceRoom = false;
    }

    async load() {
        const {kind} = this._link; 
        const supportsPreview = kind === LinkKind.User || kind === LinkKind.Room || kind === LinkKind.Event;
        if (supportsPreview) {
            this.loading = true;
            this.emitChange();
            for (const server of this._consentedServers) {
                try {
                    const homeserver = await resolveServer(this.request, server);
                    switch (this._link.kind) {
                        case LinkKind.User:
                            await this._loadUserPreview(homeserver, this._link.identifier);
                            break;
                        case LinkKind.Room:
                        case LinkKind.Event:
                            await this._loadRoomPreview(homeserver, this._link);
                            break;
                    }
                    // assume we're done if nothing threw
                    this.domain = server;
                    this.loading = false;
                    this.emitChange();
                    return;
                } catch (err) {
                    continue;
                }
            }
        }

        this.loading = false;
        this._setNoPreview(this._link);
        if (this._consentedServers.length && supportsPreview) {
            this.domain = this._consentedServers[this._consentedServers.length - 1];
            this.failed = true;
        }
        this.emitChange();
    }

    get hasTopic() { return this._link.kind === LinkKind.Room; }
    get hasMemberCount() { return this.hasTopic; }

    async _loadUserPreview(homeserver, userId) {
        const profile = await homeserver.getUserProfile(userId);
        this.name = profile.displayname || userId;
        this.avatarUrl = profile.avatar_url ?
            homeserver.mxcUrlThumbnail(profile.avatar_url, 64, 64, "crop") :
            null;
        this.identifier = userId;
    }

    async _loadRoomPreview(homeserver, link) {
        let publicRoom;
        if (link.identifierKind === IdentifierKind.RoomId || link.identifierKind === IdentifierKind.RoomAlias) {
            publicRoom = await homeserver.getRoomSummary(link.identifier, link.servers);
        }

        if (!publicRoom) {
            if (link.identifierKind === IdentifierKind.RoomId) {
                publicRoom = await homeserver.findPublicRoomById(link.identifier);
            } else if (link.identifierKind === IdentifierKind.RoomAlias) {
                const roomId = await homeserver.getRoomIdFromAlias(link.identifier);
                if (roomId) {
                    publicRoom = await homeserver.findPublicRoomById(roomId);
                }
            }
        }

        this.name = publicRoom?.name || publicRoom?.canonical_alias || link.identifier;
        this.avatarUrl = publicRoom?.avatar_url ?
            homeserver.mxcUrlThumbnail(publicRoom.avatar_url, 64, 64, "crop") :
            null;
        this.memberCount = publicRoom?.num_joined_members;
        this.topic = publicRoom?.topic;
        this.identifier = publicRoom?.canonical_alias || link.identifier;
        this.isSpaceRoom = publicRoom?.room_type === "m.space";
        if (this.identifier === this.name) {
            this.identifier = null;
        }
    }

    _setNoPreview(link) {
        this.name = link.identifier;
        this.identifier = null;
        this.avatarUrl = null;
    }
}
