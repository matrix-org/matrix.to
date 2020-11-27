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

const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')
const path = require('path');

// Serve up parent directory with cache disabled
const serve = serveStatic(
	path.resolve(__dirname, "../"),
	{
		etag: false,
		setHeaders: res => {
			res.setHeader("Pragma", "no-cache");
			res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
			res.setHeader("Expires", "Wed, 21 Oct 2015 07:28:00 GMT");
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
server.listen(3000);
