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

import SingleColumn from "./layouts/SingleColumn";
import CreateLinkTile from "./components/CreateLinkTile";
import MatrixTile from "./components/MatrixTile";
import Tile from "./components/Tile";
import LinkRouter from "./pages/LinkRouter";

import "./App.scss";

/* eslint-disable no-restricted-globals */

const App: React.FC = () => {
    let page = (
        <>
            <CreateLinkTile /> <hr />{" "}
        </>
    );
    if (location.hash) {
        console.log(location.hash);
        if (location.hash.startsWith("#/")) {
            page = <LinkRouter link={location.hash.slice(2)} />;
        } else {
            page = (
                <Tile>
                    Links should be in the format {location.host}/#/{"<"}
                    matrix-resource-identifier{">"}
                </Tile>
            );
        }
    }

    return (
        <SingleColumn>
            <div className="topSpacer" />
            {page}
            <MatrixTile />
            <div className="bottomSpacer" />
        </SingleColumn>
    );
};

export default App;
