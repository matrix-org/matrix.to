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
import Tile from './Tile';

import { clientMap } from '../clients';
import './MatrixTile.scss';

interface IProps {
    clientName: string;
}

const InvitingClientTile: React.FC<IProps> = ({ clientName }: IProps) => {
    const client = clientMap[clientName];

    if (!client) {
        return (
            <Tile className="matrixTile">
                {/* TODO: add gh link */}
                <p>
                    The client that created this link "{clientName}" is not a
                    recognised client. If this is a mistake and you'd like a
                    nice advertisement for it here please{' '}
                    <a href="https://github.com/matrix-org/matrix.to">
                        open a pr
                    </a>
                    .
                </p>
            </Tile>
        );
    }

    return (
        <Tile className="matrixTile">
            <img src={client.logo} alt={client.name} />
            <h2>
                Invite created with <a href={client.homepage}>{client.name}</a>
            </h2>
            <div>{client.description}</div>
        </Tile>
    );
};

export default InvitingClientTile;
