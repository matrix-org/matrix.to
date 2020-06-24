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

import React from "react";
import classnames from "classnames";

import "./Button.scss";

interface IProps extends React.ButtonHTMLAttributes<Element> {
    // Briefly display these instead of the children onClick
    flashChildren?: React.ReactNode;
}

/**
 * Like a normal button except it will flash content when clicked.
 */
const Button: React.FC<
    IProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(
    (
        { onClick, children, flashChildren, className, ...restProps }: IProps,
        ref: React.Ref<HTMLButtonElement>
    ) => {
        const [wasClicked, setWasClicked] = React.useState(false);

        const wrappedOnClick: React.MouseEventHandler = (e) => {
            if (onClick) {
                onClick(e);
            }

            setWasClicked(true);
            window.setTimeout(() => {
                setWasClicked(false);
            }, 1000);
        };

        const content = wasClicked && flashChildren ? flashChildren : children;

        const classNames = classnames("button", className, {
            buttonHighlight: wasClicked,
        });

        return (
            <button
                className={classNames}
                onClick={wrappedOnClick}
                ref={ref}
                {...restProps}
            >
                {content}
            </button>
        );
    }
);

export default Button;
