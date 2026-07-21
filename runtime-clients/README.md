# Runtime clients

Files in this directory are read by the **browser**, directly from your
running deployment - add or edit them and they take effect on the next page
load, with no rebuild and no restart.

## How it works

The app fetches `runtime-clients/manifest.json` on page load (same-origin
only, ~5s timeout - if it's missing or slow, the page just proceeds without
runtime clients). While that's in flight, the client list shows a small
"Looking for more apps…" indicator rather than blocking the page.

`manifest.json`:
```jsonc
{
  "version": 1,
  "visibleClients": ["element.io.custom"], // Omit if you want to show the default clients.
  "clients": [
    { "module": "./MyClient.js" },
  ]
}
```
- `module` - resolved relative to `manifest.json` itself. **Must be
  same-origin** (rejected otherwise) - this is the same trust boundary as
  editing any other static file in your deployment, not a new one.

A broken entry (404, no default export, no `id`, duplicate `id`) is skipped
with a `console.warn` - it never breaks the rest of the page.

## Client interface

Each module has a default export of a class. See
[`ExampleClient.js`](ExampleClient.js) in this directory for a full working
example.

Use `window.MatrixTo.types` to import common utility types.

## Deploying without a rebuild

Bind-mount this directory over the running container instead of rebuilding
the image:
```sh
docker run -v ./my-runtime-clients:/usr/share/nginx/html/clients:ro -p 8080:80 matrix-to
```
The nginx config (`docker/nginx.conf`) serves this path with
`Cache-Control: no-cache`, so edits are picked up on next load rather than
served stale.
