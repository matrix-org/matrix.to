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

import {
    Client,
    getUserDetails as cGetUserDetails,
    User,
    getRoomDetails as cGetRoomDetails,
    searchPublicRooms as cSearchPublicRooms,
    Room,
    convertMXCtoMediaQuery as cConvertMXCtoMediaQuery,
    getRoomIdFromAlias as cGetRoomIdFromAlias,
    RoomAlias,
} from "matrix-cypher";

/*
 * Gets the details for a user
 */
export function getUserDetails(client: Client, userId: string): Promise<User> {
    return cGetUserDetails(client, userId).catch(() => ({
        displayname: userId,
    }));
}

function defaultRoom(roomId: string): Room {
    return {
        aliases: [roomId],
        topic: "Unable to find room details.",
        canonical_alias: roomId,
        name: roomId,
        num_joined_members: 0,
        room_id: roomId,
        guest_can_join: true,
        avatar_url: "",
        world_readable: false,
    };
}

/*
 * Gets the details of a room if that room is public
 */
export function getRoomDetails(
    clients: Client[],
    roomId: string
): Promise<Room> {
    return cGetRoomDetails(clients, roomId).catch(() => defaultRoom(roomId));
}

/*
 * Searches the public rooms of a homeserver for the metadata of a particular
 */
export function searchPublicRooms(
    client: Client,
    roomId: string
): Promise<Room> {
    return cSearchPublicRooms(client, roomId).catch(() => defaultRoom(roomId));
}

export function convertMXCtoMediaQuery(clientURL: string, mxc: string): string {
    try {
        return cConvertMXCtoMediaQuery(clientURL, mxc);
    } catch {
        return "";
    }
}

export function getRoomIdFromAlias(
    client: Client,
    roomAlias: string
): Promise<RoomAlias> {
    return cGetRoomIdFromAlias(client, roomAlias).catch(() => ({
        room_id: roomAlias,
        servers: [],
    }));
}
