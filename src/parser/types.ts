export interface Arguments {
    vias: string[];
    // Schemeless http identifier
    client?: string;
    // MXID
    sharer?: string;
}

export interface LinkContent {
    identifier: string;
    arguments: Arguments;
    originalLink: string;
}

export enum LinkKind {
    Alias = "ALIAS",
    RoomId = "ROOM_ID",
    UserId = "USER_ID",
    Permalink = "PERMALINK",
    GroupId = "GROUP_ID",
    ParseFailed = "PARSE_FAILED",
}

export interface Alias extends LinkContent {
    kind: LinkKind.Alias;
}

export interface RoomId extends LinkContent {
    kind: LinkKind.RoomId;
}

export interface UserId extends LinkContent {
    kind: LinkKind.UserId;
}

export interface GroupId extends LinkContent {
    kind: LinkKind.GroupId;
}

export interface Permalink extends LinkContent {
    kind: LinkKind.Permalink;
    roomKind: LinkKind.RoomId | LinkKind.Alias;
    roomLink: string;
    eventId: string;
}

export interface ParseFailed {
    kind: LinkKind.ParseFailed;
    originalLink: string;
}

export type Link = Alias | RoomId | UserId | Permalink | GroupId | ParseFailed;
export type SafeLink = Alias | RoomId | UserId | Permalink | GroupId;
