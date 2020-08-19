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

import React from "react";
import { User } from "matrix-cypher";

import { UserAvatar } from "./Avatar";

import "./UserPreview.scss";

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

export const InviterPreview: React.FC<IProps> = ({ user, userId }: IProps) => (
    <div className="miniUserPreview">
        <div>
            <h1>
                Invited by <b>{user.displayname}</b>
            </h1>
            <p>{userId}</p>
        </div>
        <UserAvatar user={user} userId={userId} />
    </div>
);
