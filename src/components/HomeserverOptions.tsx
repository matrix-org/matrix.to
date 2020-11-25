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
import { Formik, Form, Field } from 'formik';
import { string } from 'zod';

import Tile from './Tile';
import HSContext, { TempHSContext, ActionType } from '../contexts/HSContext';
import icon from '../imgs/telecom-mast.svg';
import Button from './Button';
import TextButton from './TextButton';
import Input from './Input';
import StyledCheckbox from './StyledCheckbox';
import { SafeLink } from '../parser/types';
import { getHSFromIdentifier } from "../utils/getHS";

import './HomeserverOptions.scss';

interface IProps {
    link: SafeLink;
}

interface FormValues {
    HSUrl: string;
    HSOtherUrl: string;
}

interface SubmitEvent extends Event {
    submitter: HTMLFormElement;
}

function validateURL(values: FormValues): Partial<FormValues> {
    const errors: Partial<FormValues> = {};
    if (values.HSUrl === "other") {
        try {
            string().url().parse(hsToURL(values.HSOtherUrl));
        } catch {
            errors.HSOtherUrl =
                'This must be a valid homeserver URL';
        }
    }
    return errors;
}

function hsToURL(hs: string): string {
    if (!hs.startsWith("http://") && !hs.startsWith("https://")) {
        return "https://" + hs;
    }
    return hs;
}

function getChosenHS(values: FormValues) {
    return values.HSUrl === "other" ? values.HSOtherUrl : values.HSUrl;
}

function getHSDomain(hs: string) {
    try {
        // TODO: take port as well
        return new URL(hsToURL(hs)).hostname;
    } catch (err) {
        return;
    }
}

const HomeserverOptions: React.FC<IProps> = ({ link }: IProps) => {
    const HSStateDispatcher = useContext(HSContext)[1];
    const TempHSStateDispatcher = useContext(TempHSContext)[1];

    const [askEveryTime, setAskEveryTime] = useState(false);
    const [showHSPicker, setShowHSPicker] = useState(false);

    // Select which disaptcher to use based on whether we're writing
    // the choice to localstorage
    const dispatcher = askEveryTime
        ? TempHSStateDispatcher
        : HSStateDispatcher;

    let topSection;
    const identifierHS = getHSFromIdentifier(link.identifier) || "";
    const homeservers = [identifierHS, ... link.arguments.vias];

    const chosenHS = "home.server";
    const continueWithout = <TextButton onClick={(e): void => dispatcher({ action: ActionType.SetNone})}>continue without a preview</TextButton>;
    let instructions;
    if (showHSPicker) {
        instructions = <p>View this link using {chosenHS} to preview content or {continueWithout}.</p>
    } else {
        const useAnotherServer = <TextButton onClick={(e): void => setShowHSPicker(true)}>use another server</TextButton>;
        instructions = <p>View this link using {chosenHS} to preview content, or you can {useAnotherServer} or {continueWithout}.</p>
    }

    return (
        <Tile className="homeserverOptions">
            {instructions}
            <Formik
                initialValues={{
                    HSUrl: identifierHS,
                    HSOtherUrl: '',
                }}
                validate={validateURL}
                onSubmit={(values): void => {
                    dispatcher({ action: ActionType.SetHS, HSURL: getHSDomain(getChosenHS(values)) || "" });
                }}>
                {({ values, errors }): JSX.Element => {
                    let hsOptions;
                    if (showHSPicker) {
                        const radios = homeservers.map(hs => {
                            return <label key={hs}><Field
                                type="radio"
                                name="HSUrl"
                                value={hs}
                            />{hs}</label>;
                        });
                        const otherHSField = values.HSUrl === "other" ?
                            <Input
                                required={true}
                                type="text"
                                name="HSOtherUrl"
                                placeholder="Preferred homeserver URL"
                            /> : undefined;
                        hsOptions = <div role="group" className="serverChoices">
                                {radios}
                                <label><Field type="radio" name="HSUrl" value="other" />Other {otherHSField}</label>
                            </div>;
                    }
                    return <Form>
                        {hsOptions}
                        <div className="actions">
                            <StyledCheckbox
                                checked={askEveryTime}
                                onChange={(e): void => setAskEveryTime(e.target.checked)}
                            >Ask every time</StyledCheckbox>
                            <Button type="submit">Continue</Button>
                        </div>
                    </Form>;
                }}
            </Formik>;
        </Tile>
    );
};

export default HomeserverOptions;
