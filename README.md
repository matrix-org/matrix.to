# element.io fork

Element maintains it's own fork of matrix.to for doing experimental work, but otherwise will continue
to contribute to the primary project.

# Matrix.to

Matrix.to is a simple url redirection service for the Matrix.org ecosystem
which lets users share links to matrix entities without being tied to a
specific app.
Stylistically it serves as a landing page for rooms and communities.

## How can I put a badge on my website linking to my matrix room?

You can use the badge image we've put up at https://matrix.to/img/matrix-badge.svg, and use it in a link like this:

[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/#matrix.to:matrix.org)

You can use this Markdown:
```md
[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/#matrix.to:matrix.org)
```

Or this HTML:

```html
<a href="https://matrix.to/#/#matrix.to:matrix.org" rel="noopener" target="_blank"><img src="https://matrix.to/img/matrix-badge.svg" alt="Chat on Matrix"></a>
```

to show the badge.

## How does matrix.to work?

Matrix.to preserves user privacy by not sharing any information about the links
being followed with the Matrix.to server - the redirection is calculated
entirely clientside using JavaScript, and the link details is hidden behind a
fragment to avoid web clients leaking it to the server. However, acting as a
landing page it may leak your ip to any number of homeservers involved with the
entity linked to while fetching previews. There is an opt out under which no
previews will be loaded.

Anyone is welcome to host their own version of the Matrix.to app - Matrix.to is
**not** a single point of failure on the Matrix ecosystem; if the matrix.to
deployment ever failed, users could trivially copy the room/user/message
details out of the URLs and follow them manually, or change the hostname to
point at an alternative deployment of the service.  The Matrix.to service could
also be hosted in an immutable/signed environment such as IPFS to further
increase its availability and avoid tampering.

## URL Scheme

The matrix.to URL scheme is

| Entity type: | Example URL                                                       |
|--------------|-------------------------------------------------------------------|
| Rooms:       | https://matrix.to/#/#matrix:matrix.org                            |
| Rooms by ID: | https://matrix.to/#/!cURbafjkfsMDVwdRDQ:matrix.org                |
| Users:       | https://matrix.to/#/@matthew:matrix.org                           |
| Messages:    | https://matrix.to/#/#matrix:matrix.org/$1448831580433WbpiJ:jki.re |

The #/ component is mandatory and exists to avoid leaking the target URL to the
server hosting matrix.to.

There is no _Entity type_ for **Spaces**, as they are technically just rooms.

Note that linking to rooms by ID should only be used for rooms to which the
target user has been invited: these links cannot be assumed to work for all
visitors.

(Technically the # and @ in the URL fragment should probably be escaped, but in
practice for legibility we bend the rules and include it verbatim)

### Optional parameters

https://matrix.to/#/#matrix:matrix.org?web-instance[element.io]=chat.mozilla.org

- `client`, e.g. `client=im.fluffychat`, `client=element.io`
- `web-instance[]`, e.g. `web-instance[element.io]=chat.mozilla.org`.
    - For [matrix.to](https://matrix.to/), we have a list of [trusted web instances configured](src/open/clients/Element.js) (see `trustedWebInstances`).
-  `via`, e.g. `via=mozilla.org`

You can discuss matrix.to in
[`#matrix.to:matrix.org`](https://matrix.to/#/#matrix.to:matrix.org)

## Build Instructions

1. Install [yarn](https://classic.yarnpkg.com/en/docs/install) and Node.js 24+
1. `git clone https://github.com/matrix-org/matrix.to`
1. `cd matrix.to`
1. `yarn`
1. `yarn start`
1. Go to http://localhost:5000 in your browser

Run `yarn build` to produce a production build in `build/`, or `docker build .`
to build a container image (a static nginx server) instead.

### Customizing the client list

Which clients are shown is decided at build time, so you can ship
a build containing only the clients you care about:

- `MATRIX_TO_CLIENTS` - comma-separated allow-list of built-in client ids to
  include (run `yarn list-clients` to see the available ids). Leave unset to
  include all of them.
- `MATRIX_TO_CUSTOM_CLIENTS_DIR` - a directory of extra client modules to
  include alongside the built-ins. See [`custom-clients/README.md`](custom-clients/README.md)
  for the interface these need to implement. Defaults to `custom-clients`.

```sh
MATRIX_TO_CLIENTS=element.io,cinny yarn build
```

The same options are exposed as Docker build args:

```sh
docker build --build-arg CLIENTS=element.io,cinny --build-arg CUSTOM_CLIENTS_DIR=custom-clients .
```
