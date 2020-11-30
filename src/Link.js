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

import {createEnum} from "./utils/enum.js";

const ROOMALIAS_PATTERN = /^#([^:]*):(.+)$/;
const ROOMID_PATTERN = /^!([^:]*):(.+)$/;
const EVENT_WITH_ROOMID_PATTERN = /^[!]([^:]*):(.+)\/\$([^:]+):(.+)$/;
const EVENT_WITH_ROOMALIAS_PATTERN = /^[#]([^:]*):(.+)\/\$([^:]+):(.+)$/;
const USERID_PATTERN = /^@([^:]+):(.+)$/;
const GROUPID_PATTERN = /^\+([^:]+):(.+)$/;

const IdentifierKind = createEnum(
	"RoomId",
	"RoomAlias",
	"UserId",
	"GroupId",
);

function asPrefix(identifierKind) {
	switch (identifierKind) {
		case IdentifierKind.RoomId: return "!";
		case IdentifierKind.RoomAlias: return "#";
		case IdentifierKind.GroupId: return "+";
		case IdentifierKind.UserId: return "@";
		default: throw new Error("invalid id kind " + identifierKind);
	}
}

export const LinkKind = createEnum(
	"Room",
	"User",
	"Group",
	"Event"
)

function orderedUnique(array) {
	const copy = [];
	for (let i = 0; i < array.length; ++i) {
		if (i === 0 || array.lastIndexOf(array[i], i - 1) === -1) {
			copy.push(array[i]);
		}
	}
	return copy;
}

export class Link {
	static parseFragment(fragment) {
		if (!fragment) {
			return null;
		}
		let [identifier, queryParams] = fragment.split("?");

		let viaServers = [];
		if (queryParams) {
			viaServers = queryParams.split("&")
				.map(pair => pair.split("="))
				.filter(([key, value]) => key === "via")
				.map(([,value]) => value);
		}

		if (identifier.startsWith("#/")) {
			identifier = identifier.substr(2);
		}

		let kind;
		let matches;
		// longest first, so they dont get caught by ROOMALIAS_PATTERN and ROOMID_PATTERN
		matches = EVENT_WITH_ROOMID_PATTERN.exec(identifier);
		if (matches) {
			const roomServer = matches[2];
			const messageServer = matches[4];
			const roomLocalPart = matches[1];
			const messageLocalPart = matches[3];
			return new Link(viaServers, IdentifierKind.RoomId, roomLocalPart, roomServer, messageLocalPart, messageServer);
		}
		matches = EVENT_WITH_ROOMALIAS_PATTERN.exec(identifier);
		if (matches) {
			const roomServer = matches[2];
			const messageServer = matches[4];
			const roomLocalPart = matches[1];
			const messageLocalPart = matches[3];
			return new Link(viaServers, IdentifierKind.RoomAlias, roomLocalPart, roomServer, messageLocalPart, messageServer);
		}
		matches = USERID_PATTERN.exec(identifier);
		if (matches) {
			const server = matches[2];
			const localPart = matches[1];
			return new Link(viaServers, IdentifierKind.UserId, localPart, server);
		}
		matches = ROOMALIAS_PATTERN.exec(identifier);
		if (matches) {
			const server = matches[2];
			const localPart = matches[1];
			return new Link(viaServers, IdentifierKind.RoomAlias, localPart, server);
		}
		matches = ROOMID_PATTERN.exec(identifier);
		if (matches) {
			const server = matches[2];
			const localPart = matches[1];
			return new Link(viaServers, IdentifierKind.RoomId, localPart, server);
		}
		matches = GROUPID_PATTERN.exec(identifier);
		if (matches) {
			const server = matches[2];
			const localPart = matches[1];
			return new Link(viaServers, IdentifierKind.GroupId, localPart, server);
		}
		return null;
	}

	constructor(viaServers, identifierKind, localPart, server, messageLocalPart = null, messageServer = null) {
		const servers = [server];
		if (messageServer) {
			servers.push(messageServer);
		}
		servers.push(...viaServers);
		this.servers = orderedUnique(servers);
		this.identifierKind = identifierKind;
		this.identifier = `${asPrefix(identifierKind)}${localPart}:${server}`;
		this.eventId = messageLocalPart ? `$${messageLocalPart}:${messageServer}` : null;
	}

	get kind() {
		if (this.eventId) {
			return LinkKind.Event;
		}
		switch (this.identifierKind) {
			case IdentifierKind.RoomId:
			case IdentifierKind.RoomAlias:
				return LinkKind.Room;
			case IdentifierKind.UserId:
				return LinkKind.User;
			case IdentifierKind.GroupId:
				return LinkKind.Group;
			default:
				return null;
		}
	}
}
