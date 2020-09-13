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
import Toggle from './Toggle';
import StyledCheckbox from './StyledCheckbox';

import './HomeserverOptions.scss';

interface IProps {}

interface FormValues {
    HSUrl: string;
}

function validateURL(values: FormValues): Partial<FormValues> {
    const errors: Partial<FormValues> = {};
    try {
        string().url().parse(values.HSUrl);
    } catch {
        errors.HSUrl = 'This must be a valid url';
    }
    return errors;
}

const HomeserverOptions: React.FC<IProps> = () => {
    const HSStateDispatcher = useContext(HSContext)[1];
    const TempHSStateDispatcher = useContext(TempHSContext)[1];
    const [rememberSelection, setRemeberSelection] = useState(false);
    const [usePrefered, setUsePrefered] = useState(false);
    const dispatcher = rememberSelection
        ? HSStateDispatcher
        : TempHSStateDispatcher;

    const hsInput = usePrefered ? (
        <Formik
            initialValues={{
                HSUrl: '',
            }}
            validate={validateURL}
            onSubmit={({ HSUrl }): void =>
                dispatcher({ action: ActionType.SetHS, HSURL: HSUrl })
            }
        >
            <Form>
                <Input
                    type="text"
                    name="HSUrl"
                    placeholder="https://example.com"
                />
                <Button type="submit">Set HS</Button>
            </Form>
        </Formik>
    ) : null;

    return (
        <Tile className="homeserverOptions">
            <div className="homeserverOptionsDescription">
                <div>
                    <p>
                        Let's locate a homeserver to show you more information.
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
                Remember my choice.
            </StyledCheckbox>
            <Button
                onClick={(): void => {
                    dispatcher({ action: ActionType.SetAny });
                }}
            >
                Use any homeserver
            </Button>
            <Toggle
                checked={usePrefered}
                onChange={(): void => setUsePrefered(!usePrefered)}
            >
                Use my prefered homeserver only
            </Toggle>
            {hsInput}
        </Tile>
    );
};

export default HomeserverOptions;
