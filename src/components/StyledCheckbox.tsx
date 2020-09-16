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

/*
 * Stolen from the matrix-react-sdk
 */

import React from 'react';

import tick from '../imgs/tick.svg';

import './StyledCheckbox.scss';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledCheckbox: React.FC<IProps> = ({
    children,
    className,
    ...otherProps
}: IProps) => (
    <label className="styledCheckbox">
        <input {...otherProps} type="checkbox" />
        {/* Using the div to center the image */}
        <div className="styledCheckboxWrapper">
            <img src={tick} alt="" />
        </div>
        {children}
    </label>
);

export default StyledCheckbox;
