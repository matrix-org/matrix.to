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

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { convertMXCtoMediaQuery } from "cypher";
import { Room } from "cypher/src/schemas/PublicRoomsSchema";
import { User } from "cypher/src/schemas/UserSchema";
import logo from "../imgs/matrix-logo.svg";

import "./Avatar.scss";

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
            onError={(_) => setSrc(logo)}
            alt={label}
            className={classNames("avatar", className)}
        />
    );
};

interface IPropsUserAvatar {
    user: User;
}

export const UserAvatar: React.FC<IPropsUserAvatar> = ({
    user,
}: IPropsUserAvatar) => (
    <Avatar
        avatarUrl={convertMXCtoMediaQuery(
            // TODO: replace with correct client
            "matrix.org",
            user.avatar_url
        )}
        label={user.displayname}
    />
);

interface IPropsRoomAvatar {
    room: Room;
}

export const RoomAvatar: React.FC<IPropsRoomAvatar> = ({
    room,
}: IPropsRoomAvatar) => (
    <Avatar
        avatarUrl={
            room.avatar_url
                ? convertMXCtoMediaQuery(
                      // TODO: replace with correct client
                      "matrix.org",
                      room.avatar_url
                  )
                : ""
        }
        label={room.name || room.room_id}
    />
);

export default Avatar;
