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

function selectNode(node) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNode(node);
    selection.addRange(range);
}

export function copy(text, parent) {
    const span = document.createElement("span");
    span.innerText = text;
    parent.appendChild(span);
    selectNode(span);
    const result = document.execCommand("copy");
    parent.removeChild(span);
    return result;
}

export function copyButton(t, getCopyText, label, classNames) {
    return t.button({className: `${classNames} icon copy`, onClick: evt => {
        const button = evt.target;
        if (copy(getCopyText(), button)) {
            button.innerText = "Copied!";
            button.classList.remove("copy");
            button.classList.add("tick");
            setTimeout(() => {
                button.classList.remove("tick");
                button.classList.add("copy");
                button.innerText = label;
            }, 2000);
        }
    }}, label);
}
