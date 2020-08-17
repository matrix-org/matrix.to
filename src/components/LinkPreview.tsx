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

import React, { useState, useEffect } from "react";
import { Client, getEvent, client } from "matrix-cypher";

import {
    getRoomIdFromAlias,
    searchPublicRooms,
    getUserDetails,
} from "../utils/cypher-wrapper";
import { RoomPreviewWithTopic } from "./RoomPreview";
import InviteTile from "./InviteTile";

import { SafeLink } from "../parser/types";
import { LinkKind } from "../parser/types";
import UserPreview from "./UserPreview";
import EventPreview from "./EventPreview";
import Clients from "../clients";

interface IProps {
    link: SafeLink;
}

// TODO: replace with client fetch
const defaultClient: () => Promise<Client> = () => client("https://matrix.org");

const LOADING: JSX.Element = <>Generating invite</>;

const invite = async ({ link }: { link: SafeLink }): Promise<JSX.Element> => {
    switch (link.kind) {
        case LinkKind.Alias:
            return (
                <RoomPreviewWithTopic
                    room={
                        await searchPublicRooms(
                            await defaultClient(),
                            (
                                await getRoomIdFromAlias(
                                    await defaultClient(),
                                    link.identifier
                                )
                            ).room_id
                        )
                    }
                />
            );

        case LinkKind.RoomId:
            return (
                <RoomPreviewWithTopic
                    room={
                        await searchPublicRooms(
                            await defaultClient(),
                            link.identifier
                        )
                    }
                />
            );

        case LinkKind.UserId:
            return (
                <UserPreview
                    user={
                        await getUserDetails(
                            await defaultClient(),
                            link.identifier
                        )
                    }
                    userId={link.identifier}
                />
            );

        case LinkKind.Permalink:
            return (
                <EventPreview
                    room={
                        await searchPublicRooms(
                            await defaultClient(),
                            link.identifier
                        )
                    }
                    event={
                        await getEvent(
                            await defaultClient(),
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

    return (
        <InviteTile client={Clients[0]} link={link}>
            {content}
        </InviteTile>
    );
};

export default LinkPreview;
