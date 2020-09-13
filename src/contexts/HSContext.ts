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
import { string, object, union, literal, TypeOf } from 'zod';

import { persistReducer } from '../utils/localStorage';

//import { prefixFetch, Client, discoverServer } from 'matrix-cypher';

export enum HSOptions {
    // The homeserver contact policy hasn't
    // been set yet.
    Unset = 'UNSET',
    // Matrix.to should only contact a single provided homeserver
    TrustedHSOnly = 'TRUSTED_CLIENT_ONLY',
    // Matrix.to may contact any homeserver it requires
    Any = 'ANY',
}

const STATE_SCHEMA = union([
    object({
        option: literal(HSOptions.Unset),
    }),
    object({
        option: literal(HSOptions.Any),
    }),
    object({
        option: literal(HSOptions.TrustedHSOnly),
        hs: string(),
    }),
]);

export type State = TypeOf<typeof STATE_SCHEMA>;

// TODO: rename actions to something with more meaning out of context
export enum ActionType {
    SetHS = 'SET_HS',
    SetAny = 'SET_ANY',
}

export interface SetHS {
    action: ActionType.SetHS;
    HSURL: string;
}

export interface SetAny {
    action: ActionType.SetAny;
}

export type Action = SetHS | SetAny;

export const INITIAL_STATE: State = {
    option: HSOptions.Unset,
};

export const unpersistedReducer = (state: State, action: Action): State => {
    switch (action.action) {
        case ActionType.SetAny:
            return {
                option: HSOptions.Any,
            };
        case ActionType.SetHS:
            return {
                option: HSOptions.TrustedHSOnly,
                hs: action.HSURL,
            };
        default:
            return state;
    }
};

export const [initialState, reducer] = persistReducer(
    'home-server-options',
    INITIAL_STATE,
    STATE_SCHEMA,
    unpersistedReducer
);

// The defualt reducer needs to be overwritten with the one above
// after it's been put through react's useReducer
const HSContext = React.createContext<[State, React.Dispatch<Action>]>([
    initialState,
    (): void => {},
]);

export default HSContext;

// Quick rename to make importing easier
export const HSProvider = HSContext.Provider;
export const HSConsumer = HSContext.Consumer;

// The defualt reducer needs to be overwritten with the one above
// after it's been put through react's useReducer
// The temp reducer is for unpersisted choices with regards to GDPR
export const TempHSContext = React.createContext<
    [State, React.Dispatch<Action>]
>([INITIAL_STATE, (): void => {}]);

// Quick rename to make importing easier
export const TempHSProvider = TempHSContext.Provider;
export const TempHSConsumer = TempHSContext.Consumer;
