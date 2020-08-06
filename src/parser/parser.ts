import forEach from "lodash/forEach";

import {
  LinkDiscriminator,
  SafeLink,
  Link,
  LinkContent,
  Arguments,
} from "./types";

/*
 * parseLink takes a striped matrix.to hash link (without the '#/' prefix)
 * and parses into a Link. If the parse failed the result will
 * be ParseFailed
 */
export function parseHash(hash: string): Link {
  const [identifier, args] = hash.split("?");

  const kind = identifyTypeFromRegex(
    identifier,
    verifiers,
    LinkDiscriminator.ParseFailed
  );

  let parsedLink: LinkContent = {
    identifier,
    arguments: parseArgs(args),
    originalLink: hash,
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
  const roomKind = identifyTypeFromRegex(
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
 * parseArgs parses the <extra args> part of matrix.to links
 */
export function parseArgs(args: string): Arguments {
  const params = new URLSearchParams(args);
  const _federated = params.get("federated");
  const federated = _federated !== null ? _federated === "true" : null;

  return {
    vias: params.getAll("via"),
    federated: bottomExchange(federated),
    client: bottomExchange(params.get("client")),
    sharer: bottomExchange(params.get("sharer")),
  };
}

/*
 * Repalces null with undefined
 */
function bottomExchange<T>(nullable: T | null): T | undefined {
  if (nullable === null) return undefined;
  return nullable;
}

/*
 * toURI converts a Link to a url. It's recommended
 * to use the original link instead of toURI if it existed.
 * This is handy function in case the Link was constructed.
 */
export function toURL(origin: string, link: SafeLink): URL {
  switch (link.kind) {
    case LinkDiscriminator.GroupId:
    case LinkDiscriminator.UserId:
    case LinkDiscriminator.RoomId:
    case LinkDiscriminator.Alias:
    case LinkDiscriminator.Permalink:
      const params = new URLSearchParams();
      forEach(link.arguments, (value, key) => {
        if (value === undefined) {
          // do nothing
        } else if (key === "vias") {
          (<string[]>(<unknown>value)).forEach((via) =>
            params.append("via", via)
          );
        } else {
          params.append(key, value.toString());
        }
      });

      const url = new URL(origin);
      url.hash = `/${link.identifier}?${params.toString()}`;
      return url;
  }
}

/*
 * Verifiers are regexes which will match valid
 * identifiers to their type. (This is a lie, they
 * can return anything)
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
 * identifyTypeFromRegex applies the verifiers to the identifier and
 * returns the identifier's type
 */
export function identifyTypeFromRegex<T, F>(
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
