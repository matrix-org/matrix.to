/*
Copyright 2019 Matrix.org Foundation C.I.C.

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

import DefaultRiotServer from './DefaultRiotServer'

var linkable_clients = [
    {
        name: "Riot",
        logo: {
            width: "48px",
            src: "img/riot@2x.png",
            srcSet: "img/riot.png, img/riot@2x.png 2x",
        },
        author: "New Vector",
        homepage: "https://riot.im/",
        appUrl: "https://riot.im/app",
        room_url(alias)  { return this.appUrl + "/#/room/" + alias },
        room_id_url(id)  { return this.appUrl + "/#/room/" + id },
        user_url(userId) { return this.appUrl + "/#/user/" + userId },
        msg_url(msg)     { return this.appUrl + "/#/room/" + msg },
        group_url(group)     { return this.appUrl + "/#/group/" + group },
        maturity: "Stable",
        comments: "Fully-featured Matrix client for Web, iOS & Android",
    },
    {
        name: "Matrix-Static",
        logo: "img/matrix-static-48px.png",
        author: "Michael Telatynski",
        homepage: "https://github.com/t3chguy/matrix-static",
        room_url(alias) { return "https://view.matrix.org/alias/" + alias.replace(/#/g, '%23') },
        room_id_url(id) { return "https://view.matrix.org/room/" + id },
        maturity: "Stable",
        comments: "A static golang generated preview of public world readable Matrix rooms.",
    },
];

var unlinkable_clients = [
    {
        name: "Weechat",
        logo: "img/weechat-48px.png",
        author: "Poljar",
        homepage: "https://github.com/poljar/weechat-matrix",
        maturity: "Late beta",
        room_instructions(alias)  { return <span>Type <code>/join <b>{ alias }</b></code></span> },
        user_instructions(userId) { return <span>Type <code>/invite <b>{ userId }</b></code></span> },
        comments: "Commandline Matrix interface using Weechat",
    },
    {
        name: "Quaternion",
        logo: "img/quaternion-48px.png",
        author: "Felix Rohrbach",
        homepage: "https://github.com/Fxrh/Quaternion",
        maturity: "Late alpha",
        room_instructions(alias)  { return <span>Type <code>/join <b>{ alias }</b></code></span> },
        user_instructions(userId) { return <span>Type <code>/invite <b>{ userId }</b></code></span> },
        comments: "Qt5 and C++ cross-platform desktop Matrix client",
    },
    {
        name: "Tensor",
        logo: "img/tensor-48px.png",
        author: "David A Roberts",
        homepage: "https://github.com/davidar/tensor",
        maturity: "Late alpha",
        room_instructions(alias)  { return <span>Type <code>/join <b>{ alias }</b></code></span> },
        user_instructions(userId) { return <span>Type <code>/invite <b>{ userId }</b></code></span> },
        comments: "QML and JS cross-platform desktop Matrix client",
    },
    {
        name: "Nheko",
        logo: "img/nheko.png",
        author: "Konstantinos Sideris",
        homepage: "https://github.com/Nheko-Reborn/nheko",
        maturity: "Beta",
        room_instructions(alias)  { return <span>Type <code>/join <b>{ alias }</b></code></span> },
        comments: "Qt5 and C++ desktop client",
    },
    {
        name: "Mclient.el",
        logo: "",
        author: "Ryan Rix",
        homepage: "http://fort.kickass.systems:10082/cgit/personal/rrix/pub/matrix.el.git/",
        maturity: "Alpha",
        comments: "Matrix client for Gnu Emacs",
    },
    {
        name: "Fractal",
        logo: "img/org.gnome.Fractal.svg",
        author: "Daniel Garcia Moreno",
        maturity: "Alpha",
        comments: "Matrix messaging app for GNOME written in Rust"
    },
    {
        name: "Matrix IRCd",
        logo: "img/ircd-48px.png",
        author: "matrix.org",
        homepage: "https://github.com/matrix-org/matrix-ircd",
        room_instructions(alias)  { return <span>Type <code>/join <b>{ alias }</b></code></span> },
        maturity: "Alpha",
        comments: "Access any room anywhere in Matrix via good old IRC!",
    }
];

export default React.createClass({

    getInitialState() {
        return {
            error: null,
            entity: null,
            showLink: false,
        }
    },

    onHashChange() {
        var entity = unescape(window.location.hash.substr(2)); // strip off #/ prefix
        if (!entity) {
            this.setState({
                entity: null,
                showLink: false,
                error: null,
            });
            return;
        }

        if (!this.isAliasValid(entity) && !this.isUserIdValid(entity) && !this.isMsglinkValid(entity) && !this.isRoomIdValid(entity) && !this.isGroupValid(entity)) {
            this.setState({
                entity: entity,
                error: "Invalid room alias, user ID, message permalink or group '" + entity + "'",
            });
            return;
        }
        this.setState({
            entity: entity,
            showLink: true,
            error: null,
        });
    },

    componentWillMount() {
        if (window.location.hash) {
            this.onHashChange();
        }
    },

    componentDidMount() {
        window.addEventListener("hashchange", this.onHashChange);
    },

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.onHashChange);
    },

    onSubmit(ev) {
        ev.preventDefault();

        var entity = this.refs.prompt.value.trim();
        if (!this.isAliasValid(entity) && !this.isUserIdValid(entity) && !this.isGroupValid(entity)) {
            this.setState({ error: "Invalid room alias, user ID or group" });
            return;
        }
        var loc = window.location;
        loc.hash = "#/" + entity;
        window.location.assign(loc.href);
        this.setState({
            showLink: true,
            entity: entity,
            error: null,
        });
    },

    // XXX: cargo-culted from matrix-react-sdk
    isAliasValid(alias) {
        // XXX: FIXME SPEC-1
        return (alias.match(/^#([^\/:]+?):(.+)$/) && encodeURI(alias) === alias);
    },

    isRoomIdValid(id) {
        // XXX: FIXME SPEC-1
        return (id.match(/^!([^\/:]+?):(.+)$/) && encodeURI(id) === id);
    },

    isUserIdValid(userId) {
        // XXX: FIXME SPEC-1
        return (userId.match(/^@([^\/:]+?):(.+)$/) && encodeURI(userId) === userId);
    },

    isMsglinkValid(msglink) {
        // XXX: FIXME SPEC-1
        console.log(msglink);
        console.log(encodeURI(msglink));
        return (msglink.match(/^[\!#]([^\/:]+?):(.+?)\/\$([^\/:]+?):(.+?)$/) && encodeURI(msglink) === msglink);
    },

    isGroupValid(group) {
        console.log(group);
        console.log(encodeURI(group));
        return (group.match(/^\+([^\/:]+?):(.+)$/) && encodeURI(group) === group);
    },

    render() {
        var error;
        if (this.state.error) {
            error = <div className="mxt_HomePage_error">{ this.state.error }</div>
        }

        var prompt;
        if (this.state.showLink) {
            var link = "https://matrix.to/#/" + this.state.entity;

            var isRoom = this.isAliasValid(this.state.entity);
            var isRoomId = this.isRoomIdValid(this.state.entity);
            var isUser = this.isUserIdValid(this.state.entity);
            var isMsg = this.isMsglinkValid(this.state.entity);
            var isGroup = this.isGroupValid(this.state.entity);

            var defaultRiotServer = window.localStorage.getItem('defaultRiotServer');
            if (defaultRiotServer) {
                var link;
                var riotClient = linkable_clients[0];
                riotClient.appUrl = defaultRiotServer;
                if (isRoom && riotClient.room_url) {
                    link = riotClient.room_url(this.state.entity);
                }
                else if (isRoomId && riotClient.room_id_url) {
                    link = riotClient.room_id_url(this.state.entity);
                }
                else if (isUser && riotClient.user_url) {
                    link = riotClient.user_url(this.state.entity);
                }
                else if (isMsg && riotClient.msg_url) {
                    link = riotClient.msg_url(this.state.entity);
                }
                else if (isGroup && riotClient.group_url) {
                    link = riotClient.group_url(this.state.entity);
                }
                if (link) {
                    window.location = link;
                }
            }

            var links;

            // name: "Vector",
            // logo: "",
            // author: "Vector.im",
            // link: "https://vector.im",
            // room_url: "https://vector.im/beta/#/room/",
            // user_url: "https://vector.im/beta/#/user/",
            // maturity: "Late beta",
            // comments: "Fully-featured Matrix client for Web, iOS & Android",

            var description;
            if (isRoom) {
                description = <span>the <b>{ this.state.entity }</b> room</span>;
            }
            else if (isUser) {
                description = <span>the user <b>{ this.state.entity }</b></span>;
            }
            else if (isMsg) {
                description = <span><b>this message</b></span>;
            }
            else if (isGroup) {
                description = <span>the <b>{ this.state.entity }</b> group</span>;
            }

            links = (
                <div key="links" className="mxt_HomePage_links">
                    <div className="mxt_HomePage_links_intro">
                        <p>
                            <a href="https://matrix.org">Matrix</a> is an ecosystem for open and interoperable communication.
                        </p>
                        <p>
                            To connect to { description }, please select an app:
                        </p>
                    </div>

                    <div className="mxt_HomePage_link mxt_HomePage_link_title">
                        <div className="mxt_HomePage_link_logo">
                        </div>
                        <div className="mxt_HomePage_link_name">
                            Name
                        </div>
                        <div className="mxt_HomePage_link_comments">
                            Description
                        </div>
                        <div className="mxt_HomePage_link_author">
                            Author
                        </div>
                        <div className="mxt_HomePage_link_maturity">
                            Maturity
                        </div>
                        <div className="mxt_HomePage_link_link">
                            Access { isMsg ? "message" : <b>{ this.state.entity }</b> }
                        </div>
                    </div>

                    { linkable_clients.map((client) => {
                        var link;
                        if (isRoom && client.room_url) {
                            link = client.room_url(this.state.entity);
                        }
                        else if (isRoomId && client.room_id_url) {
                            link = client.room_id_url(this.state.entity);
                        }
                        else if (isUser && client.user_url) {
                            link = client.user_url(this.state.entity);
                        }
                        else if (isMsg && client.msg_url) {
                            link = client.msg_url(this.state.entity);
                        }
                        else if (isGroup && client.group_url) {
                            link = client.group_url(this.state.entity);
                        }
                        if (!link) return null;

                        let logo;
                        if (typeof client.logo === "string") {
                            logo = <img src={client.logo} />;
                        } else {
                            logo = <img {...client.logo} />;
                        }

                        return (
                            <div key={ client.name } className="mxt_HomePage_link">
                                <div className="mxt_HomePage_link_logo">
                                    <a href={ link }>{ logo }</a>
                                </div>
                                <div className="mxt_HomePage_link_name">
                                    <a href={ link }>{ client.name }</a>
                                    <div className="mxt_HomePage_link_homepage">
                                        <a href={ client.homepage }>{ client.homepage }</a>
                                    </div>
                                </div>
                                <div className="mxt_HomePage_link_comments">
                                    { client.comments }
                                </div>
                                <div className="mxt_HomePage_link_author">
                                    { client.author }
                                </div>
                                <div className="mxt_HomePage_link_maturity">
                                    { client.maturity }
                                </div>
                                <div className="mxt_HomePage_link_link">
                                    <a href={ link }>{ link }</a>
                                </div>
                            </div>
                        );
                    })}
                    { unlinkable_clients.map((client) => {
                        var instructions;
                        if (isRoom && client.room_instructions) {
                            instructions = client.room_instructions(this.state.entity);
                        }
                        else if (isUser && client.user_instructions) {
                            instructions = client.user_instructions(this.state.entity);
                        }
                        else if (isMsg && client.msg_instructions) {
                            instructions = client.msg_instructions(this.state.entity);
                        }
                        else if (isGroup && client.group_instructions) {
                            instructions = client.group_instructions(this.state.entity);
                        }
                        if (!instructions) return null;

                        let logo;
                        if (typeof client.logo === "string") {
                            logo = <img src={client.logo} />;
                        } else {
                            logo = <img {...client.logo} />;
                        }

                        return (
                            <div key={ client.name } className="mxt_HomePage_link">
                                <div className="mxt_HomePage_link_logo">
                                    <a href={ client.homepage }>{ logo }</a>
                                </div>
                                <div className="mxt_HomePage_link_name">
                                    <a href={ client.homepage }>{ client.name }</a>
                                    <div className="mxt_HomePage_link_homepage">
                                        <a href={ client.homepage }>{ client.homepage }</a>
                                    </div>
                                </div>
                                <div className="mxt_HomePage_link_comments">
                                    { client.comments }
                                </div>
                                <div className="mxt_HomePage_link_author">
                                    { client.author }
                                </div>
                                <div className="mxt_HomePage_link_maturity">
                                    { client.maturity }
                                </div>
                                <div className="mxt_HomePage_link_instructions">
                                    { instructions }
                                </div>
                            </div>
                        );
                    })}

                    <p>
                        To add clients to this list, <a href="https://matrix.to/#/#matrix-dev:matrix.org">please contact us</a> or
                        simply send us a pull request <a href="https://github.com/matrix-org/matrix.to">on github</a>!
                    </p>
                </div>
            );

            prompt = [
                <div key="inputbox" className="mxt_HomePage_inputBox">
                    <a href={ link } className="mxt_HomePage_inputBox_link">{ link }</a>
                    { error }
                </div>,
                links
            ];
        }
        else {
            prompt = [
                <div key="inputBox" className="mxt_HomePage_inputBox">
                    <form onSubmit={ this.onSubmit }>
                        <input autoFocus className="mxt_HomePage_inputBox_prompt" value={ this.state.entity } ref="prompt" size="36" type="text" placeholder="#room:example.com, @user:example.com or +group:example.com" />
                        <input className="mxt_HomePage_inputBox_button" type="submit" value="Get link!" />
                    </form>
                    { error }
                </div>,
                <div key="cta" className="mxt_HomePage_cta">
                    Create shareable links to Matrix rooms, users or messages<br/>
                    without being tied to a specific app.
                </div>
            ];
        }

        return (
            <div className="mxt_HomePage">
                <a href="#">
                    <img className="mxt_HomePage_logo" src="img/matrix-logo.svg" width="352" height="150" alt="[matrix]"/>
                </a>

                { prompt }

                <div className="mxt_HomePage_info">
                    <h3>About</h3>
                    <p>
                        Matrix.to is a simple stateless URL redirecting service
                        which lets users share links to entities in the <a href="https://matrix.org">Matrix.org
                        </a> ecosystem without being tied to any specific app.  This lets users choose their own favourite
                        Matrix client to participate in conversations rather than being forced to use the same app as
                        whoever sent the link.
                    </p>
                    <p>
                        The service preserves user privacy by not
                        sharing any information about the links being followed with the Matrix.to server - the
                        redirection is calculated entirely clientside using JavaScript.
                    </p>
                    <p>
                        Links are designed to be human-friendly, both for reading and constructing, and are
                        essentially a compatibility step in the journey towards
                        a <a href="https://github.com/matrix-org/matrix-doc/issues/455">ubiquitous mx://</a> URL scheme.
                    </p>
                    <p>
                        As with all of Matrix, Matrix.to is released as open source under the terms of
                        the <a href="http://www.apache.org/licenses/LICENSE-2.0">Apache License v2.0</a> - get the source
                        from <a href="https://github.com/matrix-org/matrix.to">Github</a>.
                    </p>

                    <h3>Set Default Riot server</h3>
                    <p>
                        If you would like to automatically redirect to a Riot instance when visiting a Matrix.to link,
                        You may enter it here. If you do so this, clicking on a share link will automatically redirect
                        statelessly with JavaScript.  This Riot server is stored only within your browser's local
                        storage. If you would like to change this, simply visit <a href="/">Matrix.to</a> and you may
                        update or delete your preferred Riot instance.
                    </p>
                    <DefaultRiotServer />
                </div>
            </div>
        );
    }
})
