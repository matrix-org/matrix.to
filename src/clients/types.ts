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

import { SafeLink } from '../parser/types';

/*
 * A collection of descriptive tags that can be added to
 * a clients description.
 */
export enum Platform {
    iOS = 'iOS',
    Android = 'ANDROID',
    Desktop = 'DESKTOP',
}

/*
 * A collection of states used for describing a clients maturity.
 */
export enum Maturity {
    ALPHA = 'ALPHA',
    LATE_ALPHA = 'LATE ALPHA',
    BETA = 'BETA',
    LATE_BETA = 'LATE_BETA',
    STABLE = 'STABLE',
}

/*
 * Used for constructing the discriminated union of all client types.
 */
export enum ClientKind {
    LINKED_CLIENT = 'LINKED_CLIENT',
    TEXT_CLIENT = 'TEXT_CLIENT',
}

export enum ClientId {
    Element = 'element.io',
    ElementDevelop = 'develop.element.io',
    WeeChat = 'weechat',
    Nheko = 'nheko',
    Fractal = 'fractal',
}

/*
 * The descriptive details of a client
 */
export interface ClientDescription {
    name: string;
    author: string;
    homepage: string;
    logo: string;
    description: string;
    platforms: Platform[];
    maturity: Maturity;
    clientId: ClientId;
    experimental: boolean;
    linkSupport: (link: SafeLink) => boolean;
}

/*
 * A client which can be opened using a link with the matrix resource.
 */
export interface LinkedClient extends ClientDescription {
    kind: ClientKind.LINKED_CLIENT;
    toUrl(parsedLink: SafeLink): URL;
}

/*
 * A client which provides isntructions for how to access the descired
 * resource.
 */
export interface TextClient extends ClientDescription {
    kind: ClientKind.TEXT_CLIENT;
    toInviteString(parsedLink: SafeLink): JSX.Element;
    copyString(parsedLink: SafeLink): string;
}

/*
 * A description for a client as well as a method for converting matrix.to
 * links to the client's specific representation.
 */
export type Client = LinkedClient | TextClient;
