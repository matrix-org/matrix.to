const {Maturity, Platform, LinkKind, WebsiteLink} = window.MatrixTo.types;

const trustedWebInstances = [
    "whatever.element.io",   // first one is the default one
];

export default class CustomElement {
    get id() { return "element.io.custom"; }
    get name() { return "Element Example"; }
    // icons aren't bundled/hashed for runtime clients, so this must be a full URL
    get icon() { return "./clients/element.svg"; }
    get author() { return "Element"; }
    get homepage() { return "https://element.io"; }
    get description() { return "Specialized Element Client for this deployment."; }
    get platforms() {
        return [Platform.Android, Platform.iOS, Platform.Windows, Platform.macOS, Platform.Linux, Platform.DesktopWeb];
    }
    getMaturity() { return Maturity.Stable; }

    getDeepLink(platform, link) {
        let fragmentPath;
        switch (link.kind) {
            case LinkKind.User:
                fragmentPath = `user/${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Room:
                fragmentPath = `room/${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Group:
                fragmentPath = `group/${encodeURIComponent(link.identifier)}`;
                break;
            case LinkKind.Event:
                fragmentPath = `room/${encodeURIComponent(link.identifier)}/${encodeURIComponent(link.eventId)}`;
                break;
        }

        if ((link.kind === LinkKind.Event || link.kind === LinkKind.Room) && link.servers.length > 0) {
            fragmentPath += "?" + link.servers.map(server => `via=${encodeURIComponent(server)}`).join("&");
        }

        const isWebPlatform = platform === Platform.DesktopWeb || platform === Platform.MobileWeb;
        if (isWebPlatform || platform === Platform.iOS) {
            let instanceHost = trustedWebInstances[0];
            if (isWebPlatform && trustedWebInstances.includes(link.webInstances[this.id])) {
                instanceHost = link.webInstances[this.id];
            }
            return `https://${instanceHost}/#/${fragmentPath}`;
        } else if (platform === Platform.Linux || platform === Platform.Windows || platform === Platform.macOS) {
            return `element://vector/webapp/#/${fragmentPath}`;
        } else {
            return `element://${fragmentPath}`;
        }
    }

    getLinkInstructions() {}
    getCopyString() {}

    getInstallLinks() {
        return [new WebsiteLink("https://element.io/download")];
    }

    canInterceptMatrixToLinks() {
        return false;
    }

    getPreferredWebInstance(link) {
        const idx = trustedWebInstances.indexOf(link.webInstances[this.id]);
        return idx === -1 ? undefined : trustedWebInstances[idx];
    }
}
