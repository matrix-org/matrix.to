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

import React from 'react';
import classnames from 'classnames';
import { useField } from 'formik';

import './Input.scss';

interface IProps extends React.InputHTMLAttributes<HTMLElement> {
    name: string;
    type: string;
    required?: boolean;
    muted?: boolean;
}

const Input: React.FC<IProps> = ({ className, muted, ...props }) => {
    const [field, meta] = useField(props);

    const errorBool = meta.touched && meta.value !== '' && meta.error;
    const error = errorBool ? (
        <div className="inputError">{meta.error}</div>
    ) : null;

    const classNames = classnames('input', className, {
        error: errorBool,
        inputMuted: !!muted,
    });

    return (
        <>
            <input type="text" className={classNames} {...field} {...props} />
            {error}
        </>
    );
};

export default Input;
