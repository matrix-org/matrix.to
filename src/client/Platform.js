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

export const Platform = createEnum(
	"DesktopWeb",
	"MobileWeb",
	"Android",
	"iOS",
	"Windows",
	"macOS",
	"Linux"
);

export function guessApplicablePlatforms(userAgent) {
	// use https://github.com/faisalman/ua-parser-js to guess, and pass as RootVM options
	return [Platform.DesktopWeb, Platform.Linux];
	//return [Platform.MobileWeb, Platform.iOS];
}

export function isWebPlatform(p) {
	return p === Platform.DesktopWeb || p === Platform.MobileWeb;
}


export function isDesktopPlatform(p) {
	return p === Platform.Linux || p === Platform.Windows || p === Platform.macOS;
}