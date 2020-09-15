/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// disable camelcase check because our object keys come
// from the matrix spec
/* eslint-disable @typescript-eslint/camelcase */

import {
    Client,
    client,
    Room,
    RoomAlias,
    User,
    getRoomIdFromAlias,
    searchPublicRooms,
    getUserDetails,
    convertMXCtoMediaQuery,
} from 'matrix-cypher';
import { LinkKind, Permalink } from '../parser/types';

/* This is a collection of methods for providing fallback metadata
 * for cypher queries
 */

/*
 * Returns an instance of User with fallback information instead
 * of fetched metadata
 */
export const fallbackUser = (userId: string): User => ({
    displayname: userId,
});

/*
 * Returns an instance of Room with fallback information instead
 * of fecthed metadata
 */
export const fallbackRoom = ({
    identifier,
    roomId,
    roomAlias,
}: {
    identifier: string;
    roomId?: string;
    roomAlias?: string;
}): Room => {
    const roomId_ = roomId ? roomId : identifier;
    const roomAlias_ = roomAlias ? roomAlias : identifier;
    return {
        aliases: [roomAlias_],
        topic:
            'No details available.  This might be a private room.  You can still join below.',
        canonical_alias: roomAlias_,
        name: roomAlias_,
        num_joined_members: 0,
        room_id: roomId_,
        guest_can_join: true,
        avatar_url: '',
        world_readable: false,
    };
};

/*
 * Tries to fetch room details from an alias. If it fails it uses
 * a `fallbackRoom`
 */
export async function getRoomFromAlias(
    clientURL: string,
    roomAlias: string
): Promise<Room> {
    let resolvedRoomAlias: RoomAlias;
    let resolvedClient: Client;

    try {
        resolvedClient = await client(clientURL);
        resolvedRoomAlias = await getRoomIdFromAlias(resolvedClient, roomAlias);
    } catch {
        return fallbackRoom({ identifier: roomAlias });
    }

    try {
        return await searchPublicRooms(
            resolvedClient,
            resolvedRoomAlias.room_id
        );
    } catch {
        return fallbackRoom({
            identifier: roomAlias,
            roomId: resolvedRoomAlias.room_id,
            roomAlias: roomAlias,
        });
    }
}

/*
 * Tries to fetch room details from a roomId. If it fails it uses
 * a `fallbackRoom`
 */
export async function getRoomFromId(
    clientURL: string,
    roomId: string
): Promise<Room> {
    try {
        const resolvedClient = await client(clientURL);
        return await searchPublicRooms(resolvedClient, roomId);
    } catch {
        return fallbackRoom({ identifier: roomId });
    }
}

/*
 * Tries to fetch user details. If it fails it uses a `fallbackUser`
 */
export async function getUser(
    clientURL: string,
    userId: string
): Promise<User> {
    try {
        const resolvedClient = await client(clientURL);
        return await getUserDetails(resolvedClient, userId);
    } catch {
        return fallbackUser(userId);
    }
}

/*
 * Tries to fetch room details from a permalink. If it fails it uses
 * a `fallbackRoom`
 */
export async function getRoomFromPermalink(
    client: string,
    link: Permalink
): Promise<Room> {
    switch (link.roomKind) {
        case LinkKind.Alias:
            return getRoomFromAlias(client, link.roomLink);
        case LinkKind.RoomId:
            return getRoomFromId(client, link.roomLink);
    }
}

/*
 * tries to convert an mxc to a media query. If it fails it
 * uses the empty string
 */
export function getMediaQueryFromMCX(mxc?: string): string {
    if (!mxc) {
        return '';
    }
    try {
        return convertMXCtoMediaQuery(
            // TODO: replace with correct client
            'https://matrix.org',
            mxc
        );
    } catch {
        return '';
    }
}
