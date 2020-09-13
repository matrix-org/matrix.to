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

import { useContext } from 'react';
import HSContext, {
    TempHSContext,
    State,
    HSOptions,
} from '../contexts/HSContext';
import { SafeLink } from '../parser/types';

function selectedClient(link: SafeLink, hsOptions: State): string[] {
    switch (hsOptions.option) {
        case HSOptions.Unset:
            return [];
        case HSOptions.TrustedHSOnly:
            return [hsOptions.hs];
        case HSOptions.Any:
            return [
                ...link.identifier
                    .split('/')
                    .map((i) => 'https://' + i.split(':')[1]),
                ...link.arguments.vias,
            ];
    }
}

export default function useHSs(link: SafeLink): string[] {
    const [HSState] = useContext(HSContext);
    const [TempHSState] = useContext(TempHSContext);

    if (HSState.option !== HSOptions.Unset) {
        return selectedClient(link, HSState);
    } else if (TempHSState.option !== HSOptions.Unset) {
        return selectedClient(link, TempHSState);
    } else {
        return [];
    }
}
