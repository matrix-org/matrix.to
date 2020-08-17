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

import { prefixFetch, Client, discoverServer } from "matrix-cypher";

type State = {
    clientURL: string;
    client: Client;
}[];

// Actions are a discriminated union.
export enum ActionTypes {
    AddClient = "ADD_CLIENT",
    RemoveClient = "REMOVE_CLIENT",
}

export interface AddClient {
    action: ActionTypes.AddClient;
    clientURL: string;
}

export interface RemoveClient {
    action: ActionTypes.RemoveClient;
    clientURL: string;
}

export type Action = AddClient | RemoveClient;

export const INITIAL_STATE: State = [];
export const reducer = async (state: State, action: Action): Promise<State> => {
    switch (action.action) {
        case ActionTypes.AddClient:
            return state.filter((x) => x.clientURL !== action.clientURL);

        case ActionTypes.RemoveClient:
            if (!state.filter((x) => x.clientURL === action.clientURL)) {
                const resolvedURL = await discoverServer(action.clientURL);
                state.push({
                    clientURL: resolvedURL,
                    client: prefixFetch(resolvedURL),
                });
            }
    }
    return state;
};

// The null is a hack to make the type checker happy
// create context does not need an argument
const { Provider, Consumer } = React.createContext<typeof reducer | null>(null);

// Quick rename to make importing easier
export const ClientProvider = Provider;
export const ClientConsumer = Consumer;
