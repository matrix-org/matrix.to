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

function getWebInstanceMap(queryParams) {
    const prefix = "web-instance[";
    const postfix = "]";
    const webInstanceParams = queryParams.filter(([key]) => key.startsWith(prefix) && key.endsWith(postfix));
    const webInstances = webInstanceParams.map(([key, value]) => {
        const noPrefix = key.substr(prefix.length);
        const clientId = noPrefix.substr(0, noPrefix.length - postfix.length);
        return [clientId, value];
    });
    return webInstances.reduce((map, [clientId, host]) => {
        map[clientId] = host;
        return map;
    }, {});
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

export function tryFixUrl(fragment) {
    const attempts = [];
    const afterHash = fragment.substring(fragment.startsWith("#/") ? 2 : 1);
    attempts.push('#/@' + afterHash);
    attempts.push('#/#' + afterHash);
    attempts.push('#/!' + afterHash);

    const validAttempts = [];
    for (const attempt of [...new Set(attempts)]) {
        const link = Link.parseFragment(attempt);
        if (link) {
            validAttempts.push({ url: attempt, link });
        }
    }
    return validAttempts;
}

export class Link {
    static validateIdentifier(identifier) {
        return !!(
            USERID_PATTERN.exec(identifier) ||
            ROOMALIAS_PATTERN.exec(identifier) || 
            ROOMID_PATTERN.exec(identifier) ||
            GROUPID_PATTERN.exec(identifier)
        );
    }

    static parseIdentifier(identifier) {
        return Link._parse(identifier);
    }

    static parseFragment(fragment) {
        if (!fragment) {
            return null;
        }
        let [linkStr, queryParamsStr] = fragment.split("?");
        if (!linkStr.startsWith("#/")) {
            return null;
        }
        linkStr = linkStr.substr(2);
        const [identifier, eventId] = linkStr.split("/");

        let viaServers = [];
        let clientId = null;
        let webInstances = {};
        if (queryParamsStr) {
            const queryParams = queryParamsStr.split("&").map(pair => {
                const [key, value] = pair.split("=");
                return [decodeURIComponent(key), decodeURIComponent(value)];
            });
            viaServers = queryParams
                .filter(([key, value]) => key === "via")
                .map(([,value]) => value);
            const clientParam = queryParams.find(([key]) => key === "client");
            if (clientParam) {
                clientId = clientParam[1];
            }
            webInstances = getWebInstanceMap(queryParams);
        }
        return Link._parse(identifier, eventId, clientId, viaServers, webInstances);
    }

    static _parse(identifier, eventId = undefined, clientId = null, viaServers = [], webInstances = {}) {
        if (!identifier) {
            return null;
        }
        let matches;
        matches = USERID_PATTERN.exec(identifier);
        if (matches) {
            const server = matches[2];
            const localPart = matches[1];
            return new Link(clientId, viaServers, IdentifierKind.UserId, localPart, server, webInstances);
        }
        matches = ROOMALIAS_PATTERN.exec(identifier);
        if (matches) {
            const server = matches[2];
            const localPart = matches[1];
            return new Link(clientId, viaServers, IdentifierKind.RoomAlias, localPart, server, webInstances, eventId);
        }
        matches = ROOMID_PATTERN.exec(identifier);
        if (matches) {
            const server = matches[2];
            const localPart = matches[1];
            return new Link(clientId, viaServers, IdentifierKind.RoomId, localPart, server, webInstances, eventId);
        }
        matches = GROUPID_PATTERN.exec(identifier);
        if (matches) {
            const server = matches[2];
            const localPart = matches[1];
            return new Link(clientId, viaServers, IdentifierKind.GroupId, localPart, server, webInstances);
        }
        return null;
    }

    constructor(clientId, viaServers, identifierKind, localPart, server, webInstances, eventId) {
        const servers = [server];
        servers.push(...viaServers);
        this.webInstances = webInstances;
        this.servers = orderedUnique(servers);
        this.identifierKind = identifierKind;
        this.identifier = `${asPrefix(identifierKind)}${localPart}:${server}`;
        this.eventId = eventId;
        this.clientId = clientId;
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
            this.servers.every((s, i) => link.servers[i] === s) &&
            Object.keys(this.webInstances).length === Object.keys(link.webInstances).length &&
            Object.keys(this.webInstances).every(k => this.webInstances[k] === link.webInstances[k]);
    }

    toFragment() {
        if (this.eventId) {
            return `/${this.identifier}/${this.eventId}`;
        } else {
            return `/${this.identifier}`;
        }
    }
}
