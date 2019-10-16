/*
Copyright 2016 OpenMarket Ltd

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

import React from 'react'

export default React.createClass({

    getInitialState() {
        var defaultRiotServer = window.localStorage.getItem('defaultRiotServer');
        var inputClasses = 'mxt_DefaultRiotServer_inputBox_prompt' + (
            defaultRiotServer ? ' mxt_DefaultRiotServer_inputBox_prompt_set' : '');
        return {
            inputClasses: inputClasses,
            defaultRiotServer: defaultRiotServer || '',
        }
    },

    handleSet(evt) {
        window.localStorage.setItem('defaultRiotServer', this.state.defaultRiotServer);
        this.setState({
            inputClasses: 'mxt_DefaultRiotServer_inputBox_prompt mxt_DefaultRiotServer_inputBox_prompt_set',
        });
    },

    handleClear(evt) {
        window.localStorage.removeItem('defaultRiotServer');
        this.setState({
            inputClasses: 'mxt_DefaultRiotServer_inputBox_prompt',
            defaultRiotServer: '',
        });
    },

    handleChange(evt) {
        this.setState({
            inputClasses: 'mxt_DefaultRiotServer_inputBox_prompt',
            defaultRiotServer: evt.target.value,
        });
    },

    render() {
        return (
            <div className="mxt_DefaultRiotServer mxt_DefaultRiotServer_inputBox">
                <input className={this.state.inputClasses} placeholder="e.g: https://riot.im/app" value={this.state.defaultRiotServer} onChange={this.handleChange} />
                <button className="mxt_DefaultRiotServer_inputBox_button" onClick={this.handleSet}>Set default riot server</button>
                <button className="mxt_DefaultRiotServer_inputBox_button" onClick={this.handleClear}>Clear default riot server</button>
            </div>
        );
    }
});
