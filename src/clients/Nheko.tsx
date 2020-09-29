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

import { TextClient, Maturity, ClientKind, ClientId, Platform } from './types';

import { LinkKind } from '../parser/types';

import logo from '../imgs/nheko.svg';

const Nheko: TextClient = {
    kind: ClientKind.TEXT_CLIENT,
    name: 'Nheko',
    logo: logo,
    author: 'mujx, red_sky, deepbluev7, Konstantinos Sideris',
    homepage: 'https://github.com/Nheko-Reborn/nheko',
    maturity: Maturity.BETA,
    experimental: false,
    platforms: [Platform.Desktop],
    clientId: ClientId.Nheko,
    toInviteString: (link) => {
        switch (link.kind) {
            case LinkKind.Alias:
            case LinkKind.RoomId:
                return (
                    <span>
                        Type{' '}
                        <code>
                            /join{' '}
                            <b className="matrixIdentifier">
                                {link.identifier}
                            </b>
                        </code>
                    </span>
                );
            case LinkKind.UserId:
                return (
                    <span>
                        Type{' '}
                        <code>
                            /invite{' '}
                            <b className="matrixIdentifier">
                                {link.identifier}
                            </b>
                        </code>
                    </span>
                );
            default:
                return <span>Nheko doesn't support this kind of link</span>;
        }
    },
    copyString: (link) => {
        switch (link.kind) {
            case LinkKind.Alias:
            case LinkKind.RoomId:
                return `/join ${link.identifier}`;
            case LinkKind.UserId:
                return `/invite ${link.identifier}`;
            default:
                return '';
        }
    },
    linkSupport: (link) => {
        switch (link.kind) {
            case LinkKind.Alias:
            case LinkKind.RoomId:
            case LinkKind.UserId:
                return true;
            default:
                return false;
        }
    },
    description:
        'A native desktop app for Matrix that feels more like a mainstream chat app.',
};

export default Nheko;
