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

import {createEnum} from "./utils/enum.js";

export const Platform = createEnum(
    "DesktopWeb",
    "MobileWeb",
    "Android",
    "iOS",
    "Windows",
    "macOS",
    "Linux"
);

export function guessApplicablePlatforms(userAgent, platform) {
    // return [Platform.DesktopWeb, Platform.Linux];
    let nativePlatform;
    let webPlatform;
    if (/android/i.test(userAgent)) {
        nativePlatform = Platform.Android;
        webPlatform = Platform.MobileWeb;
    } else if ( // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885
        (
            /iPad|iPhone|iPod/.test(navigator.platform) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        ) && !window.MSStream
    ) {
        nativePlatform = Platform.iOS;
        webPlatform = Platform.MobileWeb;
    } else if (platform.toLowerCase().indexOf("linux") !== -1) {
        nativePlatform = Platform.Linux;
        webPlatform = Platform.DesktopWeb;
    } else if (platform.toLowerCase().indexOf("mac") !== -1) {
        nativePlatform = Platform.macOS;
        webPlatform = Platform.DesktopWeb;
    } else {
        nativePlatform = Platform.Windows;
        webPlatform = Platform.DesktopWeb;
    }
    return [nativePlatform, webPlatform];
}

export function isWebPlatform(p) {
    return p === Platform.DesktopWeb || p === Platform.MobileWeb;
}


export function isDesktopPlatform(p) {
    return p === Platform.Linux || p === Platform.Windows || p === Platform.macOS;
}
