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

import logo from '../imgs/weechat.svg';

const Weechat: TextClient = {
    kind: ClientKind.TEXT_CLIENT,
    name: 'Weechat',
    logo: logo,
    author: 'Poljar',
    homepage: 'https://github.com/poljar/weechat-matrix',
    maturity: Maturity.LATE_BETA,
    experimental: false,
    platform: Platform.Desktop,
    clientId: ClientId.WeeChat,
    toInviteString: (link) => {
        switch (link.kind) {
            case LinkKind.Alias:
            case LinkKind.RoomId:
                return (
                    <span>
                        Type{' '}
                        <code>
                            /join <b>{link.identifier}</b>
                        </code>
                    </span>
                );
            case LinkKind.UserId:
                return (
                    <span>
                        Type{' '}
                        <code>
                            /invite <b>{link.identifier}</b>
                        </code>
                    </span>
                );
            default:
                return <span>Weechat doesn't support this kind of link</span>;
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
    description: 'Command-line Matrix interface using Weechat',
};

export default Weechat;
