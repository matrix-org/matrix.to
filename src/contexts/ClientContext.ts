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
import { object, string, boolean, TypeOf } from 'zod';

import { ClientId } from '../clients/types';
import { persistReducer } from '../utils/localStorage';

const STATE_SCHEMA = object({
    clientId: string().nullable(),
    showOnlyDeviceClients: boolean(),
    rememberSelection: boolean(),
    showExperimentalClients: boolean(),
});

type State = TypeOf<typeof STATE_SCHEMA>;

// Actions are a discriminated union.
export enum ActionType {
    SetClient = 'SET_CLIENT',
    ToggleRememberSelection = 'TOGGLE_REMEMBER_SELECTION',
    ToggleShowOnlyDeviceClients = 'TOGGLE_SHOW_ONLY_DEVICE_CLIENTS',
    ToggleShowExperimentalClients = 'TOGGLE_SHOW_EXPERIMENTAL_CLIENTS',
}

interface SetClient {
    action: ActionType.SetClient;
    clientId: ClientId;
}

interface ToggleRememberSelection {
    action: ActionType.ToggleRememberSelection;
}

interface ToggleShowOnlyDeviceClients {
    action: ActionType.ToggleShowOnlyDeviceClients;
}

interface ToggleShowExperimentalClients {
    action: ActionType.ToggleShowExperimentalClients;
}

export type Action =
    | SetClient
    | ToggleRememberSelection
    | ToggleShowOnlyDeviceClients
    | ToggleShowExperimentalClients;

const INITIAL_STATE: State = {
    clientId: null,
    rememberSelection: false,
    showOnlyDeviceClients: true,
    showExperimentalClients: false,
};

export const [initialState, reducer] = persistReducer(
    'default-client',
    INITIAL_STATE,
    STATE_SCHEMA,
    (state: State, action: Action): State => {
        switch (action.action) {
            case ActionType.SetClient:
                return {
                    ...state,
                    clientId: action.clientId,
                };
            case ActionType.ToggleRememberSelection:
                return {
                    ...state,
                    rememberSelection: !state.rememberSelection,
                };
            case ActionType.ToggleShowOnlyDeviceClients:
                return {
                    ...state,
                    showOnlyDeviceClients: !state.showOnlyDeviceClients,
                };
            case ActionType.ToggleShowExperimentalClients:
                return {
                    ...state,
                    showExperimentalClients: !state.showExperimentalClients,
                };
            default:
                return state;
        }
    }
);

// The defualt reducer needs to be overwritten with the one above
// after it's been put through react's useReducer
export const ClientContext = React.createContext<
    [State, React.Dispatch<Action>]
>([initialState, (): void => {}]);

// Quick rename to make importing easier
export const ClientProvider = ClientContext.Provider;
export const ClientConsumer = ClientContext.Consumer;
