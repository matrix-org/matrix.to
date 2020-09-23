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
import { Group } from '../matrix-cypher';

import { GroupAvatar } from './Avatar';

import './GroupPreview.scss';

interface IProps {
    group: Group;
}

const GroupPreview: React.FC<IProps> = ({ group }: IProps) => {
    const description = group.long_description
        ? group.long_description
        : group.short_description
        ? group.short_description
        : null;

    return (
        <div className="groupPreview">
            <GroupAvatar group={group} />
            <h1>{group.name}</h1>
            {description ? <p>{description}</p> : null}
        </div>
    );
};

export default GroupPreview;
