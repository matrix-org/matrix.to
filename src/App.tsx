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

import React, { useState, useEffect } from 'react';

import SingleColumn from './layouts/SingleColumn';
import CreateLinkTile from './components/CreateLinkTile';
import MatrixTile from './components/MatrixTile';
import Tile from './components/Tile';
import LinkRouter from './pages/LinkRouter';
import Footer from './components/Footer';

import './App.scss';

import GlobalContext from './contexts/GlobalContext';

/* eslint-disable no-restricted-globals */

const App: React.FC = () => {
    let page = (
        <>
            <CreateLinkTile />
        </>
    );

    const [hash, setHash] = useState(location.hash);

    console.log(hash);
    useEffect(() => {
        // Some hacky uri decoding
        if (location.href.split('/').length > 4) {
            location.href = decodeURIComponent(location.href);
        }

        window.onhashchange = () => setHash(location.hash);
    }, []);

    if (hash) {
        if (hash.startsWith('#/')) {
            page = <LinkRouter link={hash.slice(2)} />;
        } else {
            page = (
                <Tile>
                    Links should be in the format {location.host}/#/{'<'}
                    matrix-resource-identifier{'>'}
                </Tile>
            );
        }
    }

    return (
        <GlobalContext>
            <SingleColumn>
                <div className="topSpacer" />
                {page}
                <div>
                    <MatrixTile isLink={!!location.hash} />
                    <br />
                    <Footer />
                </div>
                <div className="bottomSpacer" />
            </SingleColumn>
        </GlobalContext>
    );
};

export default App;
