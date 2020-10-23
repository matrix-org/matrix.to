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

import HSContext, {
    HSOptions,
    ActionType as HSACtionType,
} from '../contexts/HSContext';
import ClientContext, {
    ActionType as ClientActionType,
} from '../contexts/ClientContext';
import TextButton from './TextButton';

import './Footer.scss';

const Footer: React.FC = () => {
    const [hsState, hsDispatch] = useContext(HSContext);
    const [clientState, clientDispatch] = useContext(ClientContext);

    const clear =
        hsState.option !== HSOptions.Unset || clientState.clientId !== null ? (
            <>
                {' · '}
                <TextButton
                    onClick={(): void => {
                        hsDispatch({
                            action: HSACtionType.Clear,
                        });
                        clientDispatch({
                            action: ClientActionType.ClearClient,
                        });
                    }}
                >
                    Clear preferences
                </TextButton>
            </>
        ) : null;

    return (
        <div className="footer">
            <a href="https://github.com/matrix-org/matrix.to">GitHub project</a>
            {' · '}
            <a href="https://github.com/matrix-org/matrix.to/tree/main/src/clients">
                Add your app
            </a>
            {clear}
        </div>
    );
};

export default Footer;
