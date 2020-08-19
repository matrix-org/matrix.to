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

import React from 'react';
import { Room } from 'matrix-cypher';

import { RoomAvatar } from './Avatar';

import './RoomPreview.scss';

interface IProps {
    room: Room;
}

const RoomPreview: React.FC<IProps> = ({ room }: IProps) => {
    const roomAlias = room.aliases ? room.aliases[0] : room.room_id;
    return (
        <div className="roomPreview">
            <RoomAvatar room={room} />
            <h1>{room.name ? room.name : room.room_id}</h1>
            <p>{room.num_joined_members.toLocaleString()} members</p>
            <p>{roomAlias}</p>
        </div>
    );
};

export const RoomPreviewWithTopic: React.FC<IProps> = ({ room }: IProps) => {
    const topic = room.topic ? <p className="roomTopic">{room.topic}</p> : null;
    return (
        <>
            <RoomPreview room={room} />
            {topic}
        </>
    );
};

export default RoomPreview;
