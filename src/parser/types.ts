import _ from "lodash";

export interface Arguments {
  vias: string[];
  // Either one of the enums or a custom link
  sharer: string;
  extras: { [key: string]: string[] };
}

export interface LinkContent {
  identifier: string;
  arguments: Arguments;
  originalLink: string;
}

export enum LinkDiscriminator {
  Alias = "ALIAS",
  RoomId = "ROOM_ID",
  UserId = "USER_ID",
  Permalink = "PERMALINK",
  GroupId = "GROUP_ID",
  ParseFailed = "PARSE_FAILED",
}

export interface Alias extends LinkContent {
  kind: LinkDiscriminator.Alias;
}

export interface RoomId extends LinkContent {
  kind: LinkDiscriminator.RoomId;
}

export interface UserId extends LinkContent {
  kind: LinkDiscriminator.UserId;
}

export interface GroupId extends LinkContent {
  kind: LinkDiscriminator.GroupId;
}

export interface Permalink extends LinkContent {
  kind: LinkDiscriminator.Permalink;
  roomKind: LinkDiscriminator.RoomId | LinkDiscriminator.Alias;
  roomLink: string;
  eventId: string;
}

export interface ParseFailed {
  kind: LinkDiscriminator.ParseFailed;
  originalLink: string;
}

export type SafeLink = Alias | RoomId | UserId | Permalink | GroupId;

export type Link = SafeLink | ParseFailed;
