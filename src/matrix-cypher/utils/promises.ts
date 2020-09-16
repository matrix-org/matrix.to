/*
Copyright 2020 The Matrix.org Foundation C.I.C.

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

/*
 * Conditional promises
 */

/*
 * If the condition is false reject with rejectReason
 * If it's true resolve with the result = resultThunk()
 */
export function ensure<T>(condition: boolean, resultThunk: () => T | PromiseLike<T>, rejectReason?: string) {
    return condition
        ? Promise.resolve(resultThunk())
        : Promise.reject(new Error(rejectReason));
}

/*
 * Loggin utilities
 */

/*
 * Logs a then using "success: {label: successArg}"
 */
export function logThen<T>(label: string): (v: T) => T | PromiseLike<T> {
    return (v: T) => {
        console.log('success:', {[`${label}`]: v}); return v
    }
}

/*
 * Logs a catch using "fail: {label: failArg}"
 */
export function logCatch<T>(label: string): (v: T) => T | PromiseLike<T> {
    return (v: T) => {
        console.log('fail:', {[`${label}`]: v});
        return Promise.reject(v)
    }
}

/*
 * inserts loggers for both callbacks of a then
 */
export function logThens<T1, T2 = T1>(label: string) {
    return [logThen<T1>(label), logCatch<T2>(label)]
}

