import {
  parseHash,
  parsePermalink,
  parseArgs,
  verifiers,
  identifyTypeFromRegex,
  toURL,
} from "./parser";

import { LinkDiscriminator } from "./types";

function identifierType(id: string) {
  return identifyTypeFromRegex(id, verifiers, LinkDiscriminator.ParseFailed);
}

it("types identifiers correctly", () => {
  expect(identifierType("@user:matrix.org")).toEqual(LinkDiscriminator.UserId);
  expect(identifierType("!room:matrix.org")).toEqual(LinkDiscriminator.RoomId);
  expect(identifierType("!somewhere:example.org/$event:example.org")).toEqual(
    LinkDiscriminator.Permalink
  );
  expect(identifierType("+group:matrix.org")).toEqual(
    LinkDiscriminator.GroupId
  );
  expect(identifierType("#alias:matrix.org")).toEqual(LinkDiscriminator.Alias);
});

it("types garbage as such", () => {
  expect(identifierType("sdfa;fdlkja")).toEqual(LinkDiscriminator.ParseFailed);
  expect(identifierType("$event$matrix.org")).toEqual(
    LinkDiscriminator.ParseFailed
  );
  expect(identifierType("/user:matrix.org")).toEqual(
    LinkDiscriminator.ParseFailed
  );
});

it("parses vias", () => {
  expect(
    parseArgs("via=example.org&via=alt.example.org")
  ).toHaveProperty("vias", ["example.org", "alt.example.org"]);
});

it("parses sharer", () => {
  expect(parseArgs("sharer=blah")).toHaveProperty("sharer", "blah");
});

it("parses client", () => {
  expect(parseArgs("client=blah.com")).toHaveProperty("client", "blah.com");
});

it("parses federated", () => {
  expect(parseArgs("federated=true")).toHaveProperty("federated", true);
  expect(parseArgs("federated=false")).toHaveProperty("federated", false);
});

it("parses permalinks", () => {
  expect(parsePermalink("!somewhere:example.org/$event:example.org")).toEqual({
    roomKind: LinkDiscriminator.RoomId,
    roomLink: "!somewhere:example.org",
    eventId: "$event:example.org",
  });
});

it("formats links correctly", () => {
  const bigLink =
    "!somewhere:example.org/$event:example.org?via=dfasdf&via=jfjafjaf";
  const origin = "https://matrix.org";
  const prefix = origin + "/#/";
  const parse = parseHash(bigLink);

  switch (parse.kind) {
    case LinkDiscriminator.ParseFailed:
      fail("Parse failed");
    default:
      expect(toURL(origin, parse).toString()).toEqual(prefix + bigLink);
  }
});
