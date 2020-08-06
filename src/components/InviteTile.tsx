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

import Tile from "./Tile";
import LinkButton from "./LinkButton";
import TextButton from "./TextButton";

import "./InviteTile.scss";

export interface InviteLink {
    type: "link";
    link: string;
}

export interface InviteInstruction {
    type: "instruction";
    text: string;
}

type InviteAction = InviteLink | InviteInstruction;

interface IProps {
    children?: React.ReactNode;
    inviteAction: InviteAction;
}

const InviteTile: React.FC<IProps> = ({ children, inviteAction }: IProps) => {
    let invite: React.ReactNode;
    switch (inviteAction.type) {
        case "link":
            invite = (
                <LinkButton href={inviteAction.link}>Accept invite</LinkButton>
            );
            break;
        case "instruction":
            invite = <p>{inviteAction.text}</p>;
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
