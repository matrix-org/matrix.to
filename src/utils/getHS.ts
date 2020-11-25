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

export function getHSFromIdentifier(identifier: string) {
  try {
    const match = identifier.match(/^.*:(?<server>.*)$/);
    if (match && match.groups) {
      return match.groups.server;
    }
  } catch (e) {
    console.error(`Could parse user identifier: ${identifier}`);
    console.error(e);
  }
  return;
}

function selectedClient({ link, identifier, hsOptions }: {
  link?: SafeLink,
  identifier?: string;
  hsOptions: State
}): string[] {
    const linkHSs = link ? [
        ...link.identifier
            .split('/')
            .map((i) => 'https://' + i.split(':')[1]),
        ...link.arguments.vias,
    ] : [];
    const identifierHS: string[] = [];

    if (identifier) {
      const server = getHSFromIdentifier(identifier);
      if (server) {
        identifierHS.push(server);
      }
    }

    switch (hsOptions.option) {
        case HSOptions.Unset:
        case HSOptions.None:
            return [];
        case HSOptions.TrustedHSOnly:
            return [hsOptions.hs];
        case HSOptions.Any:
            return [
              ...linkHSs,
              ...identifierHS,
            ];
    }
}

export default function useHSs({ link, identifier }: {
  link?: SafeLink,
  identifier?: string,
}): string[] {
    const [HSState] = useContext(HSContext);
    const [TempHSState] = useContext(TempHSContext);

    if (HSState.option !== HSOptions.Unset) {
        return selectedClient({
          link, 
          identifier,
          hsOptions: HSState
        });
    } else if (TempHSState.option !== HSOptions.Unset) {
        return selectedClient({
          link,
          identifier,
          hsOptions: TempHSState
        });
    } else {
        return [];
    }
}
