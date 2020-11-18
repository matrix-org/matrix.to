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

import HSContext, { HSOptions } from '../contexts/HSContext';
import Tile from '../components/Tile';
import LinkPreview from '../components/LinkPreview';
import InvitingClientTile from '../components/InvitingClientTile';
import { parseHash } from '../parser/parser';
import { LinkKind } from '../parser/types';
import HomeserverOptions from '../components/HomeserverOptions';

/* eslint-disable no-restricted-globals */

interface IProps {
    link: string;
}

const LinkRouter: React.FC<IProps> = ({ link }: IProps) => {
    // our room id's will be stored in the hash
    const parsedLink = parseHash(link);
    const [hsState] = useContext(HSContext);

    if (parsedLink.kind === LinkKind.ParseFailed) {
        return (
            <Tile>
                <p>
                    That URL doesn't seem right. Links should be in the format:
                </p>
                <br />
                <p>
                    {location.host}/#/{'<'}matrix-resourceidentifier{'>'}
                </p>
            </Tile>
        );
    }

    if (hsState.option === HSOptions.Unset) {
        return <HomeserverOptions link={parsedLink} />;
    }

    let client: JSX.Element = <></>;
    if (parsedLink.arguments.client) {
        client = (
            <InvitingClientTile clientName={parsedLink.arguments.client} />
        );
    }

    return (
        <>
            <LinkPreview link={parsedLink} />
            {client}
        </>
    );
};

export default LinkRouter;
