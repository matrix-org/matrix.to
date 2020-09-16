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

import React, { useContext, useState } from 'react';
import { Formik, Form } from 'formik';
import { string } from 'zod';

import Tile from './Tile';
import HSContext, { TempHSContext, ActionType } from '../contexts/HSContext';
import icon from '../imgs/telecom-mast.svg';
import Button from './Button';
import Input from './Input';
import StyledCheckbox from './StyledCheckbox';
import { SafeLink } from '../parser/types';

import './HomeserverOptions.scss';

interface IProps {
    link: SafeLink;
}

interface FormValues {
    HSUrl: string;
}

function validateURL(values: FormValues): Partial<FormValues> {
    const errors: Partial<FormValues> = {};
    try {
        string().url().parse(values.HSUrl);
    } catch {
        errors.HSUrl =
            'This must be a valid homeserver URL, starting with https://';
    }
    return errors;
}

const HomeserverOptions: React.FC<IProps> = ({ link }: IProps) => {
    const HSStateDispatcher = useContext(HSContext)[1];
    const TempHSStateDispatcher = useContext(TempHSContext)[1];

    const [rememberSelection, setRemeberSelection] = useState(false);

    // Select which disaptcher to use based on whether we're writing
    // the choice to localstorage
    const dispatcher = rememberSelection
        ? HSStateDispatcher
        : TempHSStateDispatcher;

    const hsInput = (
        <Formik
            initialValues={{
                HSUrl: '',
            }}
            validate={validateURL}
            onSubmit={({ HSUrl }): void =>
                dispatcher({ action: ActionType.SetHS, HSURL: HSUrl })
            }
        >
            {({ values, errors }): JSX.Element => (
                <Form>
                    <Input
                        muted={!values.HSUrl}
                        type="text"
                        name="HSUrl"
                        placeholder="Preferred homeserver URL"
                    />
                    {values.HSUrl && !errors.HSUrl ? (
                        <Button secondary type="submit">
                            Use {values.HSUrl}
                        </Button>
                    ) : null}
                </Form>
            )}
        </Formik>
    );

    return (
        <Tile className="homeserverOptions">
            <div className="homeserverOptionsDescription">
                <div>
                    <h3>About {link.identifier}</h3>
                    <p>
                        A homeserver will show you metadata about the link, like
                        a description. Homeservers will be able to relate your
                        IP to things you've opened invites for in matrix.to.
                    </p>
                </div>
                <img
                    src={icon}
                    alt="Icon making it clear that connections may be made with external services"
                />
            </div>
            <StyledCheckbox
                checked={rememberSelection}
                onChange={(e): void => setRemeberSelection(e.target.checked)}
            >
                Remember my choice
            </StyledCheckbox>
            <Button
                secondary
                onClick={(): void => {
                    dispatcher({ action: ActionType.SetAny });
                }}
            >
                Use any homeserver
            </Button>
            {hsInput}
        </Tile>
    );
};

export default HomeserverOptions;
