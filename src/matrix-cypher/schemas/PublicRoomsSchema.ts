/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { object, array, string, boolean, number, TypeOf } from 'zod';

export const RoomSchema = object({
  aliases: array(string()).optional(),
  canonical_alias: string().optional(),
  name: string().optional(),
  num_joined_members: number(),
  room_id: string(),
  topic: string().optional(),
  world_readable: boolean(),
  guest_can_join: boolean(),
  avatar_url: string().optional(),
});


const PublicRoomsSchema = object({
  chunk: array(RoomSchema),
  next_batch: string().optional(),
  prev_batch: string().optional(),
  total_room_count_estimate: number().optional(),
});

export type Room = TypeOf<typeof RoomSchema>;
export type PublicRooms = TypeOf<typeof PublicRoomsSchema>;

export default PublicRoomsSchema;

