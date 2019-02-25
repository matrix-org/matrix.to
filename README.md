Matrix.to
----------

Matrix.to is a simple stateless privacy-protecting URL redirecting service,
which lets users share links to entities in the Matrix.org ecosystem without
being tied to any specific app.  This lets users choose their own favourite
Matrix client to participate in conversations rather than being forced to use
the same app as whoever sent the link.

Matrix.to preserves user privacy by not sharing any information about the links
being followed with the Matrix.to server - the redirection is calculated
entirely clientside using JavaScript, and the link details is hidden behind a
fragment to avoid web clients leaking it to the server.

Matrix.to links are designed to be human-friendly, both for reading and
constructing, and are essentially a compatibility step in the journey towards a
ubiquitous mx:// URL scheme (see https://github.com/matrix-org/matrix-doc/issues/455).

Anyone is welcome to host their own version of the Matrix.to app - Matrix.to is
**not** a single point of failure on the Matrix ecosystem; if the matrix.to
deployment ever failed, users could trivially copy the room/user/message details
out of the URLs and follow them manually, or change the hostname to point at an
alternative deployment of the service.  The Matrix.to service could also be
hosted in an immutable/signed environment such as IPFS to further increase its
availability and avoid tampering.

The matrix.to URL scheme is:

| Entity type: | Example URL                                                       |
|--------------|-------------------------------------------------------------------|
| Rooms:       | https://matrix.to/#/#matrix:matrix.org                            |
| Rooms by ID: | https://matrix.to/#/!cURbafjkfsMDVwdRDQ:matrix.org                |
| Users:       | https://matrix.to/#/@matthew:matrix.org                           |
| Messages:    | https://matrix.to/#/#matrix:matrix.org/$1448831580433WbpiJ:jki.re |

The #/ component is mandatory and exists to avoid leaking the target URL to the
server hosting matrix.to.

Note that linking to rooms by ID should only be used for rooms to which the target
user has been invited: these links cannot be assumed to work for all visitors.

(Technically the # and @ in the URL fragment should probably be escaped, but in
practice for legibility we bend the rules and include it verbatim)

You can discuss matrix.to in [`#matrix.to:matrix.org`](https://matrix.to/#/#matrix.to:matrix.org)
