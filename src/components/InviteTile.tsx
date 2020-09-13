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

import React, { useState } from 'react';

import './InviteTile.scss';

import Tile from './Tile';
import LinkButton from './LinkButton';
import Button from './Button';
import ClientSelection from './ClientSelection';
import { Client, ClientKind } from '../clients/types';
import { SafeLink } from '../parser/types';
import TextButton from './TextButton';
import FakeProgress from './FakeProgress';

interface IProps {
    children?: React.ReactNode;
    client: Client | null;
    link: SafeLink;
}

const InviteTile: React.FC<IProps> = ({ children, client, link }: IProps) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    let invite: React.ReactNode;
    let advanced: React.ReactNode;

    if (client === null) {
        invite = showAdvanced ? (
            <FakeProgress />
        ) : (
            <Button onClick={() => setShowAdvanced(!showAdvanced)}>
                Accept invite
            </Button>
        );
    } else {
        let inviteUseString: string;

        switch (client.kind) {
            case ClientKind.LINKED_CLIENT:
                invite = (
                    <LinkButton href={client.toUrl(link).toString()}>
                        Accept invite
                    </LinkButton>
                );
                inviteUseString = `Accepting will open ${link.identifier} in ${client.name}.`;
                break;
            case ClientKind.TEXT_CLIENT:
                // TODO: copy to clipboard
                invite = <p>{client.toInviteString(link)}</p>;
                navigator.clipboard.writeText(client.copyString(link));
                inviteUseString = `These are instructions for ${client.name}.`;
                break;
        }

        const advancedToggle = (
            <p>
                {inviteUseString}
                <TextButton
                    onClick={(): void => setShowAdvanced(!showAdvanced)}
                >
                    Change Client.
                </TextButton>
            </p>
        );

        invite = (
            <>
                {invite}
                {advancedToggle}
            </>
        );
    }

    if (showAdvanced) {
        if (client === null) {
            advanced = (
                <>
                    <h4>Pick an app to accept the invite with</h4>
                    <ClientSelection link={link} />
                </>
            );
        } else {
            advanced = (
                <>
                    <hr />
                    <h4>Change app</h4>
                    <ClientSelection link={link} />
                </>
            );
        }
    }

    return (
        <>
            <Tile className="inviteTile">
                {children}
                {invite}
                <div className="inviteTileClientSelection">{advanced}</div>
            </Tile>
        </>
    );
};

export default InviteTile;
