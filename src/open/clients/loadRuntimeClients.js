/*
Copyright 2026 Element Creations Ltd.

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

const MANIFEST_URL = "clients/manifest.json";
// Determined to be a suitable amount of time to wait for custom clients to load.
const MANIFEST_TIMEOUT_MS = 5000;


/**
 * Load clients that are only available at runtime, and filter out any clients
 * that may be hidden by the manifest.
 * @param existingClients The existing set of builtin clients.
 * @param manifestUrl The
 */
export async function loadRuntimeClients(existingClients) {
    const manifest = await fetchManifest(MANIFEST_URL);
    const entries = Array.isArray(manifest?.clients) ? manifest.clients : [];
    const clients = [...existingClients];
    for (const entry of entries) {
        const instance = await loadClientEntry(entry, MANIFEST_URL);
        if (!instance) {
            continue;
        }
        if (clients.some(s => s.id === instance.id)) {
            console.warn(`matrix.to: ignoring runtime client with duplicate id "${instance.id}"`);
            continue;
        }
        clients.push(instance);
    }
    const visibleClientList = manifest?.visibleClients;
    return visibleClientList ? clients.filter(c => visibleClientList.includes(c.id)) : clients;
}

async function fetchManifest(manifestUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), MANIFEST_TIMEOUT_MS);
    try {
        const response = await fetch(manifestUrl, {signal: controller.signal});
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (err) {
        console.warn(`matrix.to: could not load runtime clients manifest: ${err.message}`);
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

async function loadClientEntry(entry, manifestUrl) {
    let moduleUrl;
    try {
        moduleUrl = new URL(entry.module, new URL(manifestUrl, document.baseURI));
    } catch (err) {
        console.warn(`matrix.to: invalid runtime client module URL "${entry?.module}": ${err.message}`);
        return null;
    }
    if (moduleUrl.origin !== location.origin) {
        console.warn(`matrix.to: ignoring runtime client module "${moduleUrl}" - must be same-origin`);
        return null;
    }
    try {
        const mod = await import(moduleUrl.href);
        const ClientClass = mod.default;
        if (!ClientClass) {
            console.warn(`matrix.to: runtime client module "${moduleUrl}" has no default export`);
            return null;
        }
        const instance = new ClientClass();
        if (!instance.id) {
            console.warn(`matrix.to: runtime client module "${moduleUrl}" does not implement the required "id" getter`);
            return null;
        }
        return instance;
    } catch (err) {
        console.warn(`matrix.to: failed to load runtime client module "${moduleUrl}": ${err.message}`);
        return null;
    }
}
