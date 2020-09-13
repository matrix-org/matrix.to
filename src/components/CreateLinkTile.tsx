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

import React, { useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';

import Tile from './Tile';
import Button from './Button';
import TextButton from './TextButton';
import Input from './Input';
import { parseHash } from '../parser/parser';
import { LinkKind } from '../parser/types';

import './CreateLinkTile.scss';

interface ILinkNotCreatedTileProps {
    setLink: React.Dispatch<React.SetStateAction<string>>;
}

interface FormValues {
    identifier: string;
}

// Hacky use of types here
function validate(values: FormValues): Partial<FormValues> {
    const errors: Partial<FormValues> = {};

    const parse = parseHash(values.identifier);

    if (parse.kind === LinkKind.ParseFailed) {
        errors.identifier =
            "That link doesn't look right. Double check the details.";
    }

    return errors;
}

const LinkNotCreatedTile: React.FC<ILinkNotCreatedTileProps> = (
    props: ILinkNotCreatedTileProps
) => {
    return (
        <Tile className="createLinkTile">
            <h1>
                Create shareable links to Matrix rooms, users or messages
                without being tied to any app
            </h1>
            <Formik
                initialValues={{
                    identifier: '',
                }}
                validate={validate}
                onSubmit={(values): void => {
                    props.setLink(
                        document.location.protocol +
                            '//' +
                            document.location.host +
                            '/#/' +
                            values.identifier
                    );
                }}
            >
                <Form>
                    <Input
                        name={'identifier'}
                        type={'text'}
                        placeholder="#room:example.com, @user:example.com"
                    />
                    <Button type="submit">Get Link</Button>
                </Form>
            </Formik>
        </Tile>
    );
};

interface ILinkCreatedTileProps {
    link: string;
    setLink: React.Dispatch<React.SetStateAction<string>>;
}

const LinkCreatedTile: React.FC<ILinkCreatedTileProps> = (props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Focus button on render
    useEffect((): void => {
        if (buttonRef && buttonRef.current) {
            buttonRef.current.focus();
        }
    });

    return (
        <Tile className="createLinkTile">
            <TextButton onClick={(): void => props.setLink('')}>
                Create another link
            </TextButton>
            <a href={props.link}>
                <h1>{props.link}</h1>
            </a>
            <Button
                flashChildren={'Copied'}
                onClick={(): void => {
                    navigator.clipboard.writeText(props.link);
                }}
                ref={buttonRef}
            >
                Copy Link
            </Button>
        </Tile>
    );
};

const CreateLinkTile: React.FC = () => {
    const [link, setLink] = React.useState('');
    if (!link) {
        return <LinkNotCreatedTile setLink={setLink} />;
    } else {
        return <LinkCreatedTile link={link} setLink={setLink} />;
    }
};

export default CreateLinkTile;
