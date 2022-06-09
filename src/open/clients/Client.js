import { Platform } from "../types.js";

export class Client {
    constructor(data) {
        this.data = data;
    }

    get id() { return this.data.id; }

    get platforms() { return this.data.platforms; }

    get icon() { return "images/client-icons/"+this.data.icon; }
    get name() {return this.data.name; }
    get description() { return this.data.description; }
    get homepage() { return this.data.homepage; }
    get author() { return this.data.author; }
    getMaturity(platform) { return this.data.maturity; }

    getLinkInstructions(platform, link) {}
    getCopyString(platform, link) {}
    getInstallLinks(platform) {
        var links = [];
        if (platform === Platform.iOS && this.platforms().includes(Platform.iOS) && this.data.applestorelink) {
            links.push(this.data.applestorelink);
        } else if (platform === Platform.Android && this.platforms.includes(Platform.Android)) {
            if (this.data.playstorelink) { links.push(this.data.playstorelink); }
            if (this.data.fdroidlink) { links.push(this.data.fdroidlink); }
        }
        else if (this.data.defaultInstallLink) { links.push(this.data.defaultInstallLink); }

        return links;
    }

    canInterceptMatrixToLinks(platform) { return false; }
}