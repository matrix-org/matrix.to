import _ from "lodash";

import {
  LinkDiscriminator,
  SafeLink,
  Link,
  LinkContent,
  Arguments,
} from "./types";

/*
 * Verifiers are regexes which will match valid
 * identifiers to their type
 */
type Verifier<A> = [RegExp, A];
export const roomVerifiers: Verifier<
  LinkDiscriminator.Alias | LinkDiscriminator.RoomId
>[] = [
  [/^#([^\/:]+?):(.+)$/, LinkDiscriminator.Alias],
  [/^!([^\/:]+?):(.+)$/, LinkDiscriminator.RoomId],
];
export const verifiers: Verifier<LinkDiscriminator>[] = [
  [/^[\!#]([^\/:]+?):(.+?)\/\$([^\/:]+?):(.+?)$/, LinkDiscriminator.Permalink],
  [/^@([^\/:]+?):(.+)$/, LinkDiscriminator.UserId],
  [/^\+([^\/:]+?):(.+)$/, LinkDiscriminator.GroupId],
  ...roomVerifiers,
];

/*
 * parseLink takes a striped hash link (without the '#/' prefix)
 * and parses into a Link. If the parse failed the result will
 * be ParseFailed
 */
export function parseLink(link: string): Link {
  const [identifier, args] = link.split("?");

  const kind = discriminate(
    identifier,
    verifiers,
    LinkDiscriminator.ParseFailed
  );
  const { vias, sharer, extras } = parseArgs(args);

  let parsedLink: LinkContent = {
    identifier,
    arguments: {
      vias,
      sharer,
      extras,
    },
    originalLink: link,
  };

  if (kind === LinkDiscriminator.Permalink) {
    const { roomKind, roomLink, eventId } = parsePermalink(identifier);

    return {
      kind,
      ...parsedLink,
      roomKind,
      roomLink,
      eventId,
    };
  }

  return {
    kind,
    ...parsedLink,
  };
}

/*
 * Parses a permalink.
 * Assumes the permalink is correct.
 */
export function parsePermalink(identifier: string) {
  const [roomLink, eventId] = identifier.split("/");
  const roomKind = discriminate(
    roomLink,
    roomVerifiers,
    // This is hacky but we're assuming identifier is a valid permalink
    LinkDiscriminator.Alias
  );

  return {
    roomKind,
    roomLink,
    eventId,
  };
}

/*
 * descriminate applies the verifiers to the identifier and
 * returns it's type
 */
export function discriminate<T, F>(
  identifier: string,
  verifiers: Verifier<T>[],
  fail: F
): T | F {
  if (identifier !== encodeURI(identifier)) {
    return fail;
  }

  return verifiers.reduce<T | F>((discriminator, verifier) => {
    if (discriminator !== fail) {
      return discriminator;
    }

    if (identifier.match(verifier[0])) {
      return verifier[1];
    }

    return discriminator;
  }, fail);
}

/*
 * parseArgs parses the <extra args> part of matrix.to links
 */
export function parseArgs(args: string): Arguments {
  const parsedArgTuples = _.groupBy(
    args
      .split("&")
      .map((x) => x.split("="))
      .filter((x) => x.length == 2),
    (arg) => {
      return arg[0];
    }
  );

  const parsedArgs = _.mapValues(parsedArgTuples, (arg) =>
    arg.map((x) => x[1])
  );

  const { via, sharer, ...extras } = parsedArgs;

  return {
    vias: via,
    sharer: (parsedArgs.sharer || [undefined])[0],
    extras,
  };
}

/*
 * toURI converts a parsed link to uri. Typically it's recommended
 * to show the original link if it existed but this is handy in the
 * case where this was constructed.
 */
export function toURI(hostname: string, link: SafeLink): string {
  const cleanHostname = hostname.trim().replace(/\/+$/, "");
  switch (link.kind) {
    case LinkDiscriminator.GroupId:
    case LinkDiscriminator.UserId:
    case LinkDiscriminator.RoomId:
    case LinkDiscriminator.Alias:
    case LinkDiscriminator.Permalink:
      const uri = encodeURI(cleanHostname + "/#/" + link.identifier);
      const vias = link.arguments.vias.map((s) => "via=" + s).join("&");
      const sharer = link.arguments.sharer
        ? "sharer=" + link.arguments.sharer
        : "";
      const extras = _.map(link.arguments.extras, (vals, key) =>
        vals.map((v) => key + "=" + v).join("&")
      ).join("&");

      const args = [vias, sharer, extras].filter(Boolean).join("&");

      if (args) {
        return uri + "?" + args;
      }

      return uri;
  }
}
