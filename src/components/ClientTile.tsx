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

import React, { useContext } from 'react';
import classNames from 'classnames';
import { UAContext } from '@quentin-sommer/react-useragent';

import { Client, ClientKind, Platform } from '../clients/types';
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

    const { uaResults } = useContext(UAContext);

    const className = classNames('clientTile', {
        clientTileLink: client.kind === ClientKind.LINKED_CLIENT,
    });

    let inviteButton: JSX.Element = <></>;
    let hasNativeClient = false;
    let installButton = undefined;
    if (client.kind === ClientKind.LINKED_CLIENT) {
        const availableClients = client.installLinks.filter((distrib) => {
            if ((uaResults as any).ios) {
                return distrib.platform == Platform.iOS;
            } else if ((uaResults as any).android) {
                return distrib.platform == Platform.Android;
            } else {
                return false;
            }
        });
        hasNativeClient = availableClients.length > 0;
        if (hasNativeClient) {
            inviteButton = (
                <Button
                    onClick={() => window.open('matrix://' + link.originalLink)}
                >
                    Accept invite
                </Button>
            );
        } else {
            inviteButton = <Button>Accept invite</Button>;
        }

        installButton = availableClients.map((distrib) => (
            <Button
                onClick={() =>
                    window.open(
                        distrib.supportReferrer
                            ? distrib.download +
                                  '&referrer=' +
                                  link.originalLink
                            : distrib.download,
                        '_blank'
                    )
                }
            >
                Get it on {distrib.name}
            </Button>
        ));
    } else {
        const copyString = client.copyString(link);
        if (copyString !== '') {
            inviteButton = (
                <Button
                    onClick={() => navigator.clipboard?.writeText(copyString)}
                    flashChildren="Invite copied"
                >
                    Copy invite
                </Button>
            );
        }
    }

    let clientTile = (
        <Tile className={className}>
            <img src={client.logo} alt={client.name + ' logo'} />
            <div>
                <h1>{client.name}</h1>
                <p>{client.description}</p>
                {inviteLine}
                {hasNativeClient && installButton}
                {inviteButton}
            </div>
        </Tile>
    );

    if (client.kind === ClientKind.LINKED_CLIENT) {
        if (!hasNativeClient) {
            clientTile = (
                <a href={client.toUrl(link).toString()}>{clientTile}</a>
            );
        }
    }

    return clientTile;
};

export default ClientTile;
