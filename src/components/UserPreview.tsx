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

import React, { useState, useEffect } from 'react';
import { client, User, getUserDetails } from 'matrix-cypher';
import icon from '../imgs/chat-icon.svg';

import Avatar, { UserAvatar } from './Avatar';
import useHSs from '../utils/getHS';
import { UserId } from '../parser/types';

import './UserPreview.scss';

interface IProps {
    user: User;
    userId: string;
}

const UserPreview: React.FC<IProps> = ({ user, userId }: IProps) => (
    <div className="userPreview">
        <UserAvatar user={user} userId={userId} />
        <h1>{user.displayname} invites you to connect</h1>
        <p>{userId}</p>
        <hr />
    </div>
);

export default UserPreview;

interface InviterPreviewProps {
    user?: User;
    userId: string;
}

export const InviterPreview: React.FC<InviterPreviewProps> = ({
    user,
    userId,
}: InviterPreviewProps) => {
    const avatar = user ? (
        <UserAvatar user={user} userId={userId} />
    ) : (
        <Avatar label={`Placeholder icon for ${userId}`} avatarUrl={icon} />
    );
    return (
        <div className="miniUserPreview">
            <div>
                <h1>
                    Invited by <b>{user ? user.displayname : userId}</b>
                </h1>
                {user ? <p>{userId}</p> : null}
            </div>
            {avatar}
        </div>
    );
};

interface WrappedInviterProps {
    link: UserId;
}

export const WrappedInviterPreview: React.FC<WrappedInviterProps> = ({
    link,
}: WrappedInviterProps) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const hss = useHSs(link);
    useEffect(() => {
        if (hss.length) {
            client(hss[0])
                .then((c) => getUserDetails(c, link.identifier))
                .then(setUser)
                .catch((x) => console.log("couldn't fetch user preview", x));
        }
    }, [hss, link]);
    return <InviterPreview user={user} userId={link.identifier} />;
};
