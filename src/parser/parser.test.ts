/* eslint-disable no-fallthrough */

import {
    parseHash,
    parsePermalink,
    parseArgs,
    verifiers,
    identifyTypeFromRegex,
    toURL,
} from "./parser";

import { LinkKind } from "./types";

const identifierType = (id: string): LinkKind =>
    identifyTypeFromRegex(id, verifiers, LinkKind.ParseFailed);

it("types identifiers correctly", () => {
    expect(identifierType("@user:matrix.org")).toEqual(LinkKind.UserId);
    expect(identifierType("!room:matrix.org")).toEqual(LinkKind.RoomId);
    expect(identifierType("!somewhere:example.org/$event:example.org")).toEqual(
        LinkKind.Permalink
    );
    expect(identifierType("+group:matrix.org")).toEqual(LinkKind.GroupId);
    expect(identifierType("#alias:matrix.org")).toEqual(LinkKind.Alias);
});

it("types garbage as such", () => {
    expect(identifierType("sdfa;fdlkja")).toEqual(LinkKind.ParseFailed);
    expect(identifierType("$event$matrix.org")).toEqual(LinkKind.ParseFailed);
    expect(identifierType("/user:matrix.org")).toEqual(LinkKind.ParseFailed);
});

it("parses args correctly", () => {
    expect(
        parseArgs("via=example.org&via=alt.example.org")
    ).toHaveProperty("vias", ["example.org", "alt.example.org"]);
    expect(parseArgs("sharer=blah")).toHaveProperty("sharer", "blah");
    expect(parseArgs("client=blah.com")).toHaveProperty("client", "blah.com");
});

it("parses permalinks", () => {
    expect(parsePermalink("!somewhere:example.org/$event:example.org")).toEqual(
        {
            roomKind: LinkKind.RoomId,
            roomLink: "!somewhere:example.org",
            eventId: "$event:example.org",
        }
    );
});

it("formats links correctly", () => {
    const bigLink =
        "!somewhere:example.org/$event:example.org?via=dfasdf&via=jfjafjaf";
    const origin = "https://matrix.org";
    const prefix = origin + "/#/";
    const parse = parseHash(bigLink);

    switch (parse.kind) {
        case LinkKind.ParseFailed:
            fail("Parse failed");
        default:
            expect(toURL(origin, parse).toString()).toEqual(prefix + bigLink);
    }
});
