/*
Copyright 2020 Bruno Windels <bruno@windels.cloud>

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

import finalhandler from "finalhandler"
import http from "http"
import serveStatic from "serve-static"
import path from "path"
import { fileURLToPath } from "url";
const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../");

// Serve up parent directory with cache disabled
const serve = serveStatic(
    projectDir,
    {
        etag: false,
        setHeaders: res => {
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Expires", "Wed, 21 Oct 2015 07:28:00 GMT");
            // same CSP as matrix.to server is using, so local testing happens under similar environment
            res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src * data:; connect-src *; font-src 'self'; manifest-src 'self'; form-action 'self'; navigate-to *;");
        },
        index: ['index.html', 'index.htm']
    }
);
 
// Create server
const server = http.createServer(function onRequest (req, res) {
    console.log(req.method, req.url);
    serve(req, res, finalhandler(req, res))
});

// Listen
server.listen(5000);
console.log("Listening on port 5000");
