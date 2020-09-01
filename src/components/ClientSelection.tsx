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

import './ClientSelection.scss';
import { ActionType, ClientContext } from '../contexts/ClientContext';
import ClientList from './ClientList';
import { SafeLink } from '../parser/types';

interface IProps {
    link: SafeLink;
}

const ClientSelection: React.FC<IProps> = ({ link }: IProps) => {
    const [clientState, clientStateDispatch] = useContext(ClientContext);
    const options = (
        <div className="advancedOptions">
            <label>
                <input
                    type="checkbox"
                    onChange={(): void => {
                        clientStateDispatch({
                            action: ActionType.ToggleRememberSelection,
                        });
                    }}
                    checked={clientState.rememberSelection}
                />
                Remember my selection for future invites in this browser
            </label>
            <label>
                <input
                    type="checkbox"
                    onChange={(): void => {
                        clientStateDispatch({
                            action: ActionType.ToggleShowOnlyDeviceClients,
                        });
                    }}
                    checked={clientState.showOnlyDeviceClients}
                />
                Show only clients suggested for this device
            </label>
            <label>
                <input
                    type="checkbox"
                    onChange={(): void => {
                        clientStateDispatch({
                            action: ActionType.ToggleShowExperimentalClients,
                        });
                    }}
                    checked={clientState.showExperimentalClients}
                />
                Show experimental clients
            </label>
        </div>
    );

    return (
        <div className="advanced">
            {options}
            <ClientList link={link} />
        </div>
    );
};

export default ClientSelection;
