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

import {TemplateView} from "../utils/TemplateView.js";
import {copy} from "../utils/copy.js";
import {text, tag} from "../utils/html.js";

function formatPlatforms(platforms) {
    return platforms.reduce((str, p, i, all) => {
        const first = i === 0;
        const last = i === all.length - 1;
        return str + (first ? "" : last ? " & " : ", ") + p;
    }, "");
}

function renderInstructions(parts) {
    return parts.map(p => {
        if (p.type === "code") {
            return tag.code(p.text);
        } else {
            return text(p);
        }
    });
}

export class ClientView extends TemplateView {

    render(t, vm) {
        return t.mapView(vm => vm.customWebInstanceFormOpen, open => {
            switch (open) {
                case true: return new SetCustomWebInstanceView(vm);
                case false: return new TemplateView(vm, t => this.renderContent(t, vm));
            }
        });
    }
    renderContent(t, vm) {
        return t.div({className: {"ClientView": true, "isPreferred": vm => vm.hasPreferredWebInstance}}, [
            ... vm.hasPreferredWebInstance ? [t.div({className: "hostedBanner"}, vm.hostedByBannerLabel)] : [],
            t.div({className: "header"}, [
                t.div({className: "description"}, [
                    t.h3(vm.name),
                    t.p([vm.description, " ", t.a({
                        href: vm.homepage,
                        target: "_blank",
                        rel: "noopener noreferrer"
                    }, "Learn more")]),
                    t.p({className: "platforms"}, formatPlatforms(vm.availableOnPlatformNames)),
                ]),
                t.img({className: "clientIcon", src: vm.iconUrl})
            ]),
            t.mapView(vm => vm.stage, stage => {
                switch (stage) {
                    case "open": return new OpenClientView(vm);
                    case "install": return new InstallClientView(vm);
                }
            }),
        ]);
    }
}

class OpenClientView extends TemplateView {
    render(t, vm) {
        return t.div({className: "OpenClientView"}, [
            ...vm.openActions.map(a => renderAction(t, a)),
            showBack(t, vm),
        ]);
    }
}

class InstallClientView extends TemplateView {
    render(t, vm) {
        const children = [];

        const textInstructions = vm.textInstructions;
        if (textInstructions) {
            const copyButton = t.button({
                className: "copy",
                title: "Copy instructions",
                "aria-label": "Copy instructions",
                onClick: evt => {
                    if (copy(vm.copyString, copyButton.parentElement)) {
                        copyButton.className = "tick";
                        setTimeout(() => {
                            copyButton.className = "copy";
                        }, 2000);
                    }
                }
            });
            children.push(t.p({className: "instructions"}, renderInstructions(textInstructions).concat(copyButton)));
        }

        const actions = t.div({className: "actions"}, vm.installActions.map(a => renderAction(t, a)));
        children.push(actions);

        if (vm.showDeepLinkInInstall) {
            const openItHere = t.a({
                rel: "noopener noreferrer",
                href: vm.openActions[0].url,
                onClick: () => vm.openActions[0].activated(),
            }, "open it here");
            children.push(t.p([`If you already have ${vm.name} installed, you can `, openItHere, "."]))
        }

        children.push(showBack(t, vm));

        return t.div({className: "InstallClientView"}, children);
    }
}

export class SetCustomWebInstanceView extends TemplateView {
    render(t, vm) {
        return t.div({className: "SetCustomWebInstanceView"}, [
            t.p([
                "Use a custom web instance for the ", t.strong(vm.name), " client:",
            ]),
            t.form({action: "#", id: "setCustomWebInstanceForm", onSubmit: evt => this._onSubmit(evt)}, [
                t.input({
                    type: "text",
                    className: "fullwidth large",
                    placeholder: "chat.example.org",
                    name: "instanceHostname",
                    value: vm.preferredWebInstance || "",
                }),
                t.input({type: "submit", value: "Save", className: "primary fullwidth"}),
                t.input({type: "button", value: "Use Default Instance", className: "secondary fullwidth", onClick: evt => this._onReset(evt)}),
            ])
        ]);
    }

    _onSubmit(evt) {
        evt.preventDefault();
        const form = evt.target;
        const {instanceHostname} = form.elements;
        this.value.setCustomWebInstance(instanceHostname.value || undefined);
        this.value.closeCustomWebInstanceForm();
    }

    _onReset(evt) {
        this.value.setCustomWebInstance(undefined);
        this.value.closeCustomWebInstanceForm();
    }
}

function showBack(t, vm) {
    return t.p({className: {caption: true, "back": true, hidden: vm => !vm.showBack}}, [
        `Continue with ${vm.name} · `,
        t.button({className: "text", onClick: () => vm.back()}, "Change"),
        t.span({hidden: vm => !vm.supportsCustomWebInstances}, [
            ' · ',
            t.button({className: "text", onClick: () => vm.configureCustomWebInstance()}, "Use Custom Web Instance"),
        ])

    ]);
}

function renderAction(t, a) {
    let badgeUrl;
    switch (a.kind) {
        case "play-store": badgeUrl = "images/google-play-us.svg"; break;
        case "fdroid": badgeUrl = "images/fdroid-badge.png"; break;
        case "apple-app-store": badgeUrl = "images/app-store-us-alt.svg"; break;
        case "flathub": badgeUrl = "images/flathub-badge.svg"; break;
    }
    return t.a({
        href: a.url,
        className: {
            fullwidth: !badgeUrl,
            primary: a.primary && !badgeUrl,
            secondary: !a.primary && !badgeUrl,
            badge: !!badgeUrl,
        },
        rel: "noopener noreferrer",
        ["aria-label"]: a.label, 
        onClick: () => a.activated()
    }, badgeUrl ? t.img({src: badgeUrl}) : a.label);
}
