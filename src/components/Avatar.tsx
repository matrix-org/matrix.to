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

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Room, User } from 'matrix-cypher';

import { getMediaQueryFromMCX } from '../utils/cypher-wrapper';
import logo from '../imgs/chat-icon.svg';

import './Avatar.scss';

interface IProps {
    className?: string;
    avatarUrl: string;
    label: string;
}

const Avatar: React.FC<IProps> = ({ className, avatarUrl, label }: IProps) => {
    const [src, setSrc] = useState(avatarUrl);
    useEffect(() => {
        setSrc(avatarUrl);
    }, [avatarUrl]);

    return (
        <img
            src={src}
            onError={(): void => setSrc(logo)}
            alt={label}
            className={classNames('avatar', className)}
        />
    );
};

interface IPropsUserAvatar {
    user: User;
    userId: string;
}

export const UserAvatar: React.FC<IPropsUserAvatar> = ({
    user,
    userId,
}: IPropsUserAvatar) => (
    <Avatar
        avatarUrl={getMediaQueryFromMCX(user.avatar_url)}
        label={user.displayname ? user.displayname : userId}
    />
);

interface IPropsRoomAvatar {
    room: Room;
}

export const RoomAvatar: React.FC<IPropsRoomAvatar> = ({
    room,
}: IPropsRoomAvatar) => (
    <Avatar
        avatarUrl={getMediaQueryFromMCX(room.avatar_url)}
        label={room.name || room.room_id}
    />
);

export default Avatar;
