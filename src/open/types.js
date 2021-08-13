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

import {createEnum} from "../utils/enum.js";
export const Maturity = createEnum("Alpha", "Beta", "Stable");
export {LinkKind} from "../Link.js";
export {Platform} from "../Platform.js";

export class AppleStoreLink {
    constructor(org, appId) {
        this._org = org;
        this._appId = appId;
    }

    createInstallURL(link) {
        return `https://apps.apple.com/app/${encodeURIComponent(this._org)}/${encodeURIComponent(this._appId)}`;
    }

    get channelId() {
        return "apple-app-store";
    }

    getDescription() {
        return "Download on the App Store";
    }
}

export class PlayStoreLink {
    constructor(appId) {
        this._appId = appId;
    }

    createInstallURL(link) {
        return `https://play.google.com/store/apps/details?id=${encodeURIComponent(this._appId)}&referrer=${encodeURIComponent(link.identifier)}`;
    }
      
    get channelId() {
        return "play-store";
    }

    getDescription() {
        return "Get it on Google Play";
    }
}

export class FDroidLink {
    constructor(appId) {
        this._appId = appId;
    }

    createInstallURL(link) {
        return `https://f-droid.org/packages/${encodeURIComponent(this._appId)}`;
    }

    get channelId() {
        return "fdroid";
    }

    getDescription() {
        return "Get it on F-Droid";
    }
}

export class FlathubLink {
    constructor(appId) {
        this._appId = appId;
    }

    createInstallURL(link) {
        return `https://flathub.org/apps/details/${encodeURIComponent(this._appId)}`;
    }

    get channelId() {
        return "flathub";
    }

    getDescription() {
        return "Get it on Flathub";
    }
}

export class WebsiteLink {
    constructor(url) {
        this._url = url;
    }

    createInstallURL(link) {
        return this._url;
    }

    get channelId() {
        return "website";
    }

    getDescription(platform) {
        return `Download for ${platform}`;
    }
}

export const style = {
    code(text) {
        return {type: "code", text};
    }
}
