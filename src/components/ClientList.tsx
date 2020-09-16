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

import React, { useContext } from 'react';
import { UAContext } from '@quentin-sommer/react-useragent';

import { SafeLink } from '../parser/types';
import { ActionType, ClientContext } from '../contexts/ClientContext';
import Clients from '../clients';
import { Client, Platform } from '../clients/types';
import ClientTile from './ClientTile';

import './ClientList.scss';

interface IProps {
    link: SafeLink;
    rememberSelection: boolean;
}

const ClientList: React.FC<IProps> = ({ link, rememberSelection }: IProps) => {
    const [
        { showOnlyDeviceClients, showExperimentalClients },
        clientDispatcher,
    ] = useContext(ClientContext);
    const { uaResults } = useContext(UAContext);

    /*
     * Function to decide whether a client is shown
     */
    const showClient = (client: Client): boolean => {
        let showClient = false;

        if (!showOnlyDeviceClients || uaResults === {}) {
            showClient = true;
        }

        switch (client.platform) {
            case Platform.Desktop:
                showClient = showClient || !(uaResults as any).mobile;
                break;
            case Platform.iOS:
                showClient = showClient || (uaResults as any).ios;
                break;
            case Platform.Android:
                showClient = showClient || (uaResults as any).android;
                break;
        }

        if (!showExperimentalClients && client.experimental) {
            showClient = false;
        }

        if (!client.linkSupport(link)) {
            showClient = false;
        }

        return showClient;
    };

    const clientLi = (client: Client): JSX.Element => (
        <li
            key={client.clientId}
            onClick={(): void =>
                rememberSelection
                    ? clientDispatcher({
                          action: ActionType.SetClient,
                          clientId: client.clientId,
                      })
                    : undefined
            }
        >
            <ClientTile client={client} link={link} />
        </li>
    );

    return (
        <ul className="clientList">
            {Clients.filter(showClient).map(clientLi)}
        </ul>
    );
};

export default ClientList;
