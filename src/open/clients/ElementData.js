import {Maturity, Platform, FDroidLink, AppleStoreLink, PlayStoreLink, WebsiteLink, FlathubLink} from "../types.js";

export const data = {
    "id": "element.io",
    "platforms": [Platform.Android, Platform.iOS, Platform.Windows, Platform.macOS, Platform.Linux, Platform.DesktopWeb],
    "icon": "element.svg",
    "appleAssociatedAppId": "7J4U792NQT.im.vector.app",
    "name": "Element",
    "description": "Fully-featured Matrix client, used by millions.",
    "homepage": "https://element.io",
    "author": "Element",
    "maturity": Maturity.Stable,
    "applestorelink": new AppleStoreLink('vector', 'id1083446067'),
    "playstorelink": new PlayStoreLink('im.vector.app'),
    "fdroidlink": new FDroidLink('im.vector.app'),
    "flathublink": new FlathubLink('im.riot.Riot'),
    "defaultInstallLink": new WebsiteLink("https://element.io/get-started"),
};