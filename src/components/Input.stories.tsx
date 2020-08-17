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
import { withDesign } from "storybook-addon-designs";
import { Formik, Form } from "formik";

import Input from "./Input";

export default {
    title: "Input",
    parameters: {
        design: {
            type: "figma",
            url:
                "https://figma.com/file/WSXjCGc1k6FVI093qhlzOP/04-Recieving-share-link?node-id=59%3A1",
        },
    },
    decorators: [withDesign],
};

export const Default: React.FC = () => (
    <Formik initialValues={{}} onSubmit={(): void => {}}>
        <Form>
            <Input
                name="Example input"
                type="text"
                placeholder="Write something"
            />
        </Form>
    </Formik>
);
