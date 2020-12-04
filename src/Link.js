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
import {orderedUnique} from "./utils/unique.js";

const ROOMALIAS_PATTERN = /^#([^:]*):(.+)$/;
const ROOMID_PATTERN = /^!([^:]*):(.+)$/;
const USERID_PATTERN = /^@([^:]+):(.+)$/;
const EVENTID_PATTERN = /^$([^:]+):(.+)$/;
const GROUPID_PATTERN = /^\+([^:]+):(.+)$/;

export const IdentifierKind = createEnum(
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

export function getLabelForLinkKind(kind) {
	switch (kind) {
		case LinkKind.User: return "Start chat";
		case LinkKind.Room: return "View room";
		case LinkKind.Group: return "View community";
		case LinkKind.Event: return "View message";
	}
}

export const LinkKind = createEnum(
	"Room",
	"User",
	"Group",
	"Event"
)

export class Link {
    static validateIdentifier(identifier) {
        return !!(
            USERID_PATTERN.exec(identifier) ||
            ROOMALIAS_PATTERN.exec(identifier) || 
            ROOMID_PATTERN.exec(identifier) ||
            GROUPID_PATTERN.exec(identifier)
        );
    }

	static parse(fragment) {
		if (!fragment) {
			return null;
		}
		let [linkStr, queryParams] = fragment.split("?");

		let viaServers = [];
		if (queryParams) {
			viaServers = queryParams.split("&")
				.map(pair => pair.split("="))
				.filter(([key, value]) => key === "via")
				.map(([,value]) => value);
		}

		if (linkStr.startsWith("#/")) {
			linkStr = linkStr.substr(2);
		}

        const [identifier, eventId] = linkStr.split("/");

		let matches;
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
			return new Link(viaServers, IdentifierKind.RoomAlias, localPart, server, eventId);
		}
		matches = ROOMID_PATTERN.exec(identifier);
		if (matches) {
			const server = matches[2];
			const localPart = matches[1];
			return new Link(viaServers, IdentifierKind.RoomId, localPart, server, eventId);
		}
		matches = GROUPID_PATTERN.exec(identifier);
		if (matches) {
			const server = matches[2];
			const localPart = matches[1];
			return new Link(viaServers, IdentifierKind.GroupId, localPart, server);
		}
		return null;
	}

	constructor(viaServers, identifierKind, localPart, server, eventId) {
		const servers = [server];
		servers.push(...viaServers);
		this.servers = orderedUnique(servers);
		this.identifierKind = identifierKind;
		this.identifier = `${asPrefix(identifierKind)}${localPart}:${server}`;
		this.eventId = eventId;
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

	equals(link) {
		return link &&
			link.identifier === this.identifier &&
			this.servers.length === link.servers.length &&
			this.servers.every((s, i) => link.servers[i] === s);
	}

	toFragment() {
		if (this.eventId) {
			return `/${this.identifier}/${this.eventId}`;
		} else {
			return `/${this.identifier}`;
		}
	}
}
