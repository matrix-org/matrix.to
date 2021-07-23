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
import {ClientListView} from "../open/ClientListView.js";
import {ClientView} from "../open/ClientView.js";

export class PreviewView extends TemplateView {
    render(t, vm) {
        return t.div({className: "PreviewView"}, t.mapView(vm => vm.loading, loading => {
            return loading ? new LoadingPreviewView(vm) : new LoadedPreviewView(vm);
        }));
    }
}

class LoadingPreviewView extends TemplateView {
    render(t, vm) {
        return t.div([
            t.div({className: "avatarContainer"}, t.div({className: "avatar loading"}, t.div({className: "spinner"}))),
            t.h1(vm => vm.name),
            t.p({className: "identifier placeholder"}),
            t.div({className: {memberCount: true, loading: true, hidden: !vm.hasMemberCount}}, t.p({className: "placeholder"})),
            t.p({className: {topic: true, loading: true, hidden: !vm.hasTopic}}, [
                t.div({className: "placeholder"}),
                t.div({className: "placeholder"}),
                t.div({className: "placeholder"}),
            ]),
        ]);
    }
}

class LoadedPreviewView extends TemplateView {
    render(t, vm) {
        const avatar = t.map(vm => vm.avatarUrl, (avatarUrl, t) => {
            if (avatarUrl) {
                return t.img({className: "avatar", src: avatarUrl});
            } else {
                return t.div({className: "defaultAvatar"});
            }
        });
        return t.div({className: vm.isSpaceRoom ? "mxSpace" : undefined}, [
            t.div({className: "avatarContainer"}, avatar),
            t.h1(vm => vm.name),
            t.p({className: {identifier: true, hidden: vm => !vm.identifier}}, vm => vm.identifier),
            t.div({className: {memberCount: true, hidden: vm => !vm.memberCount}}, t.p([vm => vm.memberCount, " members"])),
            t.p({className: {topic: true, hidden: vm => !vm.topic}}, [vm => vm.topic]),
        ]);
    }
}
