import forEach from 'lodash/forEach';

import {
    LinkKind,
    SafeLink,
    Link,
    LinkContent,
    Arguments,
    Permalink,
} from './types';

/*
 * Verifiers are regexes which will match valid
 * identifiers to their type. (This is a lie, they
 * can return anything)
 */
type Verifier<A> = [RegExp, A];
export const roomVerifiers: Verifier<LinkKind.Alias | LinkKind.RoomId>[] = [
    [/^#([^:]*):(.+)$/, LinkKind.Alias],
    [/^!([^:]*):(.+)$/, LinkKind.RoomId],
];
export const verifiers: Verifier<LinkKind>[] = [
    [/^[!#]([^:]*):(.+)\/\$([^:]+):(.+)$/, LinkKind.Permalink],
    [/^@([^:]+):(.+)$/, LinkKind.UserId],
    [/^\+([^:]+):(.+)$/, LinkKind.GroupId],
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

    return verifiers.reduce<T | F>((kind, verifier) => {
        if (kind !== fail) {
            return kind;
        }

        if (identifier.match(verifier[0])) {
            return verifier[1];
        }

        return kind;
    }, fail);
}

/*
 * Parses a permalink.
 * Assumes the permalink is correct.
 */
export function parsePermalink(
    identifier: string
): Pick<Permalink, 'roomKind' | 'roomLink' | 'eventId'> {
    const [roomLink, eventId] = identifier.split('/');
    const roomKind = identifyTypeFromRegex(
        roomLink,
        roomVerifiers,
        // This is hacky but we're assuming identifier is a valid permalink
        LinkKind.Alias
    );

    return {
        roomKind,
        roomLink,
        eventId,
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
 * parseArgs parses the <extra args> part of matrix.to links
 */
export function parseArgs(args: string): Arguments {
    const params = new URLSearchParams(args);

    return {
        vias: params.getAll('via'),
        client: bottomExchange(params.get('client')),
        sharer: bottomExchange(params.get('sharer')),
        originalParams: params,
    };
}

/*
 * parseLink takes a striped matrix.to hash link (without the '#/' prefix)
 * and parses into a Link. If the parse failed the result will
 * be ParseFailed
 */
export function parseHash(hash: string): Link {
    const [identifier, args] = hash.split('?');

    const kind = identifyTypeFromRegex(
        identifier,
        verifiers,
        LinkKind.ParseFailed
    );

    const parsedLink: LinkContent = {
        identifier,
        arguments: parseArgs(args),
        originalLink: hash,
    };

    if (kind === LinkKind.Permalink) {
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
 * toURI converts a Link to a url. It's recommended
 * to use the original link instead of toURI if it existed.
 * This is handy function in case the Link was constructed.
 */
export function toURL(origin: string, link: SafeLink): URL {
    const params = new URLSearchParams();
    const url = new URL(origin);
    switch (link.kind) {
        case LinkKind.GroupId:
        case LinkKind.UserId:
        case LinkKind.RoomId:
        case LinkKind.Alias:
        case LinkKind.Permalink:
            forEach(link.arguments, (value, key) => {
                if (value === undefined) {
                    // do nothing
                } else if (key === 'vias') {
                    (value as string[]).forEach((via) =>
                        params.append('via', via)
                    );
                } else {
                    params.append(key, value.toString());
                }
            });

            url.hash = `/${link.identifier}?${params.toString()}`;
    }
    return url;
}
