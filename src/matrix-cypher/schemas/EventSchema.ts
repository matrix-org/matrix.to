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

import { object, string, TypeOf } from 'zod';

const EventSchema = object({
  content: object({}).nonstrict(),
  type: string(),
  event_id: string(),
  sender: string(),
  origin_server_ts: string(),
  unsigned: object({}).nonstrict().optional(),
  room_id: string(),
});

export type Event = TypeOf<typeof EventSchema>;
export default EventSchema;
