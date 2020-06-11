import {
  parseLink,
  parsePermalink,
  parseArgs,
  verifiers,
  discriminate,
  toURI,
} from "./parser";
import { LinkDiscriminator } from "./types";

const curriedDiscriminate = (id: string) =>
  discriminate(id, verifiers, LinkDiscriminator.ParseFailed);

it("types identifiers correctly", () => {
  expect(curriedDiscriminate("@user:matrix.org")).toEqual(
    LinkDiscriminator.UserId
  );
  expect(curriedDiscriminate("!room:matrix.org")).toEqual(
    LinkDiscriminator.RoomId
  );
  expect(
    curriedDiscriminate("!somewhere:example.org/$event:example.org")
  ).toEqual(LinkDiscriminator.Permalink);
  expect(curriedDiscriminate("+group:matrix.org")).toEqual(
    LinkDiscriminator.GroupId
  );
  expect(curriedDiscriminate("#alias:matrix.org")).toEqual(
    LinkDiscriminator.Alias
  );
});

it("types garbadge as such", () => {
  expect(curriedDiscriminate("sdfa;fdlkja")).toEqual(
    LinkDiscriminator.ParseFailed
  );
  expect(curriedDiscriminate("$event$matrix.org")).toEqual(
    LinkDiscriminator.ParseFailed
  );
  expect(curriedDiscriminate("/user:matrix.org")).toEqual(
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

it("parses random args", () => {
  expect(parseArgs("via=qreqrqwer&banter=2342")).toHaveProperty(
    "extras.banter",
    ["2342"]
  );
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
    "!somewhere:example.org/$event:example.org?via=dfasdf&via=jfjafjaf&uselesstag=useless";
  const host = "matrix.org";
  const prefix = host + "/#/";
  const parse = parseLink(bigLink);

  switch (parse.kind) {
    case LinkDiscriminator.ParseFailed:
      fail("Parse failed");
    default:
      expect(toURI(host, parse)).toEqual(prefix + bigLink);
  }
});
