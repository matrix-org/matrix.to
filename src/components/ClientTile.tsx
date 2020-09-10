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
import classNames from 'classnames';

import { Client, ClientKind } from '../clients/types';
import { SafeLink } from '../parser/types';
import Tile from './Tile';
import Button from './Button';

import './ClientTile.scss';

interface IProps {
    client: Client;
    link: SafeLink;
}

const ClientTile: React.FC<IProps> = ({ client, link }: IProps) => {
    const inviteLine =
        client.kind === ClientKind.TEXT_CLIENT ? (
            <p>{client.toInviteString(link)}</p>
        ) : null;

    const className = classNames('clientTile', {
        clientTileLink: client.kind === ClientKind.LINKED_CLIENT,
    });

    const inviteButton =
        client.kind === ClientKind.LINKED_CLIENT ? (
            <Button>Accept invite</Button>
        ) : null;

    let clientTile = (
        <Tile className={className}>
            <img src={client.logo} alt={client.name + ' logo'} />
            <div>
                <h1>{client.name}</h1>
                <p>{client.description}</p>
                {inviteLine}
                {inviteButton}
            </div>
        </Tile>
    );

    if (client.kind === ClientKind.LINKED_CLIENT) {
        clientTile = <a href={client.toUrl(link).toString()}>{clientTile}</a>;
    }

    return clientTile;
};

export default ClientTile;
