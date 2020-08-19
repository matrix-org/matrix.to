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

import './InviteTile.scss';

import Tile from './Tile';
import LinkButton from './LinkButton';
import TextButton from './TextButton';
import { Client, ClientKind } from '../clients/types';
import { SafeLink } from '../parser/types';

interface IProps {
    children?: React.ReactNode;
    client: Client;
    link: SafeLink;
}

const InviteTile: React.FC<IProps> = ({ children, client, link }: IProps) => {
    let invite: React.ReactNode;
    switch (client.kind) {
        case ClientKind.LINKED_CLIENT:
            invite = (
                <LinkButton href={client.toUrl(link).toString()}>
                    Accept invite
                </LinkButton>
            );
            break;
        case ClientKind.TEXT_CLIENT:
            invite = <p>{client.toInviteString(link)}</p>;
            break;
    }

    return (
        <Tile className="inviteTile">
            {children}
            {invite}
            <TextButton>Advanced options</TextButton>
        </Tile>
    );
};

export default InviteTile;
