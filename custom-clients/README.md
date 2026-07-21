# Custom clients

Drop extra client definitions in this directory to have them built into matrix.to
alongside (or instead of) the built-in ones, without forking the codebase.

## Interface

Each file must export a class, either as a named export matching the file name
(`MyClient.js` exporting `class MyClient`) or as a default export. The class
must implement the same interface as the built-in clients under
`src/open/clients/` — the simplest one to copy from is
[`src/open/clients/Cinny.js`](../src/open/clients/Cinny.js):

- `id` — a unique, stable string identifying this client
- `name` — display name
- `icon` — path to an icon. Either a full URL, or a path under `images/` in this
  repo (those get content-hashed automatically at build time; anything else is
  used as-is and won't be bundled)
- `author`, `homepage`, `description`
- `platforms` — array of `Platform` values from `../src/open/types.js`
- `getMaturity(platform)` — one of `Maturity.Alpha/Beta/Stable`
- `getDeepLink(platform, link)` — deep link URL for the given `Link` (see `../src/Link.js`)
- `canInterceptMatrixToLinks(platform)`
- `getLinkInstructions(platform, link)` / `getCopyString(platform, link)` — used
  for clients that are opened manually rather than via a deep link
- `getInstallLinks(platform)` — array of `AppleStoreLink`/`PlayStoreLink`/`FDroidLink`/`FlathubLink`/`WebsiteLink` from `../src/open/types.js`
- `getPreferredWebInstance(link)`
- `appleAssociatedAppId` (optional) — used to generate `.well-known/apple-app-site-association`

## Build-time configuration

Two environment variables (also exposed as Docker build args, see the
top-level `Dockerfile`) control which clients end up in the build:

- `MATRIX_TO_CLIENTS` — comma-separated allow-list of built-in client ids to
  include (run `yarn list-clients` to see the available ids). Leave unset to
  include all built-in clients.
- `MATRIX_TO_CUSTOM_CLIENTS_DIR` — directory to load custom clients from,
  defaults to this directory (`custom-clients`). Files here are always
  included, in addition to whatever `MATRIX_TO_CLIENTS` selects.

```sh
MATRIX_TO_CLIENTS=element.io,cinny yarn build

docker build --build-arg CLIENTS=element.io,cinny --build-arg CUSTOM_CLIENTS_DIR=custom-clients .
```
