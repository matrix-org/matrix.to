import {TemplateView} from "../utils/TemplateView.js";

export class DisclaimerView extends TemplateView {
    render(t) {
        return t.div({ className: "DisclaimerView card" }, [
            t.h1("Disclaimer"),
            t.p(
                'Matrix.to is a service provided by the Matrix.org Foundation ' +
                'which allows you to easily create invites to Matrix rooms and accounts, ' +
                'regardless of your Matrix homeserver. The service is provided "as is" without ' +
                'warranty of any kind, either express, implied, statutory or otherwise. ' +
                'The Matrix.org Foundation shall not be responsible or liable for the room ' +
                'and account contents shared via this service.'
            ),
        ]);
    }
}
