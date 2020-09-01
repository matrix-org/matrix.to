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

import React, { useState, useEffect, useContext } from 'react';
import { getEvent, client } from 'matrix-cypher';

import { RoomPreviewWithTopic } from './RoomPreview';
import InviteTile from './InviteTile';
import { SafeLink, LinkKind } from '../parser/types';
import UserPreview from './UserPreview';
import EventPreview from './EventPreview';
import { clientMap } from '../clients';
import {
    getRoomFromId,
    getRoomFromAlias,
    getRoomFromPermalink,
    getUser,
} from '../utils/cypher-wrapper';
import { ClientContext } from '../contexts/ClientContext';

interface IProps {
    link: SafeLink;
}

const LOADING: JSX.Element = <>Generating invite</>;

const invite = async ({ link }: { link: SafeLink }): Promise<JSX.Element> => {
    // TODO: replace with client fetch
    const defaultClient = await client('https://matrix.org');
    switch (link.kind) {
        case LinkKind.Alias:
            return (
                <RoomPreviewWithTopic
                    room={
                        await getRoomFromAlias(defaultClient, link.identifier)
                    }
                />
            );

        case LinkKind.RoomId:
            return (
                <RoomPreviewWithTopic
                    room={await getRoomFromId(defaultClient, link.identifier)}
                />
            );

        case LinkKind.UserId:
            return (
                <UserPreview
                    user={await getUser(defaultClient, link.identifier)}
                    userId={link.identifier}
                />
            );

        case LinkKind.Permalink:
            return (
                <EventPreview
                    room={await getRoomFromPermalink(defaultClient, link)}
                    event={
                        await getEvent(
                            defaultClient,
                            link.roomLink,
                            link.eventId
                        )
                    }
                />
            );

        default:
            // Todo Implement events
            return <></>;
    }
};

const LinkPreview: React.FC<IProps> = ({ link }: IProps) => {
    const [content, setContent] = useState(LOADING);

    useEffect(() => {
        (async (): Promise<void> => setContent(await invite({ link })))();
    }, [link]);

    const [{ rememberSelection, clientId }] = useContext(ClientContext);

    // Select which client to link to
    const displayClientId =
        rememberSelection && clientId
            ? clientId
            : link.arguments.client
            ? link.arguments.client
            : null;

    const client = displayClientId ? clientMap[displayClientId] : null;

    return (
        <InviteTile client={client} link={link}>
            {content}
        </InviteTile>
    );
};

export default LinkPreview;
