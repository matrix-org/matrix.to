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

import Tile from '../components/Tile';
import LinkPreview from '../components/LinkPreview';
import { parseHash } from '../parser/parser';
import { LinkKind } from '../parser/types';

interface IProps {
    link: string;
}

const LinkRouter: React.FC<IProps> = ({ link }: IProps) => {
    // our room id's will be stored in the hash
    const parsedLink = parseHash(link);
    console.log({ link });

    let feedback: JSX.Element;
    switch (parsedLink.kind) {
        case LinkKind.ParseFailed:
            feedback = (
                <Tile>
                    <h1>Invalid matrix.to link</h1>
                    <p>{link}</p>
                </Tile>
            );
            break;
        default:
            feedback = <LinkPreview link={parsedLink} />;
    }

    return feedback;
};

export default LinkRouter;
