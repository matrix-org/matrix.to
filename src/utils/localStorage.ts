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

import {
  Schema,
} from 'zod';
import React from 'react';

/*
 * Initialises local storage to initial value if
 * a value matching the schema is not in storage.
 */
export function persistReducer<T, A>(
  stateKey: string,
  initialState: T,
  schema: Schema<T>,
  reducer: React.Reducer<T, A>,
): [T, React.Reducer<T, A>] {
  let currentState = initialState;
  // Try to load state from local storage
  const stateInStorage = localStorage.getItem(stateKey);
  if (stateInStorage) {
    try {
       // Validate state type
       const parsedState = JSON.parse(stateInStorage);
       if (parsedState as T) {
          currentState = schema.parse(parsedState);
       }
    } catch (e) {
      // if invalid delete state
      localStorage.setItem(stateKey, JSON.stringify(initialState));
    }
  } else {
    localStorage.setItem(stateKey, JSON.stringify(initialState));
  }

  return [
    currentState, 
    (state: T, action: A) => {
      // state passed to this reducer is the source of truth
      const newState = reducer(state, action);
      localStorage.setItem(stateKey, JSON.stringify(newState));
      return newState;
    },
  ];
}
