/*
Copyright 2020 Bruno Windels <bruno@windels.cloud>
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

import { setAttribute, text, isChildren, classNames, TAG_NAMES, HTML_NS } from "./html.js";

/**
    Bindable template. Renders once, and allows bindings for given nodes. If you need
    to change the structure on a condition, use a subtemplate (if)

    supports
        - event handlers (attribute fn value with name that starts with on)
        - one way binding of attributes (other attribute fn value)
        - one way binding of text values (child fn value)
        - refs to get dom nodes
        - className binding returning object with className => enabled map
        - add subviews inside the template
*/
// TODO: should we rename this to BoundView or something? As opposed to StaticView ...
export class TemplateView {
    constructor(value, render = undefined) {
        this._value = value;
        // TODO: can avoid this if we have a separate class for inline templates vs class template views
        this._render = render;
        this._eventListeners = null;
        this._bindings = null;
        this._subViews = null;
        this._root = null;
        // TODO: can avoid this if we adopt the handleEvent pattern in our EventListener
        this._boundUpdateFromValue = null;
    }

    get value() {
        return this._value;
    }

    _subscribe() {
        if (typeof this._value?.on === "function") {
            this._boundUpdateFromValue = this._updateFromValue.bind(this);
            this._value.on("change", this._boundUpdateFromValue);
        }
    }

    _unsubscribe() {
        if (this._boundUpdateFromValue) {
            if (typeof this._value.off === "function") {
                this._value.off("change", this._boundUpdateFromValue);
            }
            this._boundUpdateFromValue = null;
        }
    }

    _attach() {
        if (this._eventListeners) {
            for (let {node, name, fn, useCapture} of this._eventListeners) {
                node.addEventListener(name, fn, useCapture);
            }
        }
    }

    _detach() {
        if (this._eventListeners) {
            for (let {node, name, fn, useCapture} of this._eventListeners) {
                node.removeEventListener(name, fn, useCapture);
            }
        }
    }

    mount(options) {
        const builder = new TemplateBuilder(this);
        if (this._render) {
            this._root = this._render(builder, this._value);
        } else if (this.render) {   // overriden in subclass
            this._root = this.render(builder, this._value);
        } else {
            throw new Error("no render function passed in, or overriden in subclass");
        }
        const parentProvidesUpdates = options && options.parentProvidesUpdates;
        if (!parentProvidesUpdates) {
            this._subscribe();
        }
        this._attach();
        return this._root;
    }

    unmount() {
        this._detach();
        this._unsubscribe();
        if (this._subViews) {
            for (const v of this._subViews) {
                v.unmount();
            }
        }
    }

    root() {
        return this._root;
    }

    _updateFromValue(changedProps) {
        this.update(this._value, changedProps);
    }

    update(value) {
        this._value = value;
        if (this._bindings) {
            for (const binding of this._bindings) {
                binding();
            }
        }
    }

    _addEventListener(node, name, fn, useCapture = false) {
        if (!this._eventListeners) {
            this._eventListeners = [];
        }
        this._eventListeners.push({node, name, fn, useCapture});
    }

    _addBinding(bindingFn) {
        if (!this._bindings) {
            this._bindings = [];
        }
        this._bindings.push(bindingFn);
    }

    addSubView(view) {
        if (!this._subViews) {
            this._subViews = [];
        }
        this._subViews.push(view);
    }

    removeSubView(view) {
        const idx = this._subViews.indexOf(view);
        if (idx !== -1) {
            this._subViews.splice(idx, 1);
        }
    }
}

// what is passed to render
class TemplateBuilder {
    constructor(templateView) {
        this._templateView = templateView;
    }

    get _value() {
        return this._templateView._value;
    }

    addEventListener(node, name, fn, useCapture = false) {
        this._templateView._addEventListener(node, name, fn, useCapture);
    }

    _addAttributeBinding(node, name, fn) {
        let prevValue = undefined;
        const binding = () => {
            const newValue = fn(this._value);
            if (prevValue !== newValue) {
                prevValue = newValue;
                setAttribute(node, name, newValue);
            }
        };
        this._templateView._addBinding(binding);
        binding();
    }

    _addClassNamesBinding(node, obj) {
        this._addAttributeBinding(node, "className", value => classNames(obj, value));
    }

    _addTextBinding(fn) {
        const initialValue = fn(this._value);
        const node = text(initialValue);
        let prevValue = initialValue;
        const binding = () => {
            const newValue = fn(this._value);
            if (prevValue !== newValue) {
                prevValue = newValue;
                node.textContent = newValue+"";
            }
        };

        this._templateView._addBinding(binding);
        return node;
    }

    _setNodeAttributes(node, attributes) {
        for(let [key, value] of Object.entries(attributes)) {
            const isFn = typeof value === "function";
            // binding for className as object of className => enabled
            if (key === "className" && typeof value === "object" && value !== null) {
                if (objHasFns(value)) {
                    this._addClassNamesBinding(node, value);
                } else {
                    setAttribute(node, key, classNames(value));
                }
            } else if (key.startsWith("on") && key.length > 2 && isFn) {
                const eventName = key.slice(2, 3).toLowerCase() + key.slice(3);
                const handler = value;
                this._templateView._addEventListener(node, eventName, handler);
            } else if (isFn) {
                this._addAttributeBinding(node, key, value);
            } else {
                setAttribute(node, key, value);
            }
        }
    }

    _setNodeChildren(node, children) {
        if (!Array.isArray(children)) {
            children = [children];
        }
        for (let child of children) {
            if (typeof child === "function") {
                child = this._addTextBinding(child);
            } else if (!child.nodeType) {
                // not a DOM node, turn into text
                child = text(child);
            }
            node.appendChild(child);
        }
    }
    
    _addReplaceNodeBinding(fn, renderNode) {
        let prevValue = fn(this._value);
        let node = renderNode(null);

        const binding = () => {
            const newValue = fn(this._value);
            if (prevValue !== newValue) {
                prevValue = newValue;
                const newNode = renderNode(node);
                if (node.parentNode) {
                    node.parentNode.replaceChild(newNode, node);
                }
                node = newNode;
            }
        };
        this._templateView._addBinding(binding);
        return node;
    }

    el(name, attributes, children) {
        return this.elNS(HTML_NS, name, attributes, children);
    }

    elNS(ns, name, attributes, children) {
        if (attributes && isChildren(attributes)) {
            children = attributes;
            attributes = null;
        }

        const node = document.createElementNS(ns, name);
        
        if (attributes) {
            this._setNodeAttributes(node, attributes);
        }
        if (children) {
            this._setNodeChildren(node, children);
        }

        return node;
    }

    // this insert a view, and is not a view factory for `if`, so returns the root element to insert in the template
    // you should not call t.view() and not use the result (e.g. attach the result to the template DOM tree).
    view(view) {
        let root;
        try {
            root = view.mount();
        } catch (err) {
            return errorToDOM(err);
        }
        this._templateView.addSubView(view);
        return root;
    }

    // map a value to a view, every time the value changes
    mapView(mapFn, viewCreator) {
        return this._addReplaceNodeBinding(mapFn, (prevNode) => {
            if (prevNode && prevNode.nodeType !== Node.COMMENT_NODE) {
                const subViews = this._templateView._subViews;
                const viewIdx = subViews.findIndex(v => v.root() === prevNode);
                if (viewIdx !== -1) {
                    const [view] = subViews.splice(viewIdx, 1);
                    view.unmount();
                }
            }
            const view = viewCreator(mapFn(this._value));
            if (view) {
                return this.view(view);
            } else {
                return document.createComment("node binding placeholder");
            }
        });
    }

    // Special case of mapView for a TemplateView.
    // Always creates a TemplateView, if this is optional depending
    // on mappedValue, use `if` or `mapView`
    map(mapFn, renderFn) {
        return this.mapView(mapFn, mappedValue => {
            return new TemplateView(this._value, (t, vm) => {
                const rootNode = renderFn(mappedValue, t, vm);
                if (!rootNode) {
                    // TODO: this will confuse mapView which assumes that
                    // a comment node means there is no view to clean up
                    return document.createComment("map placeholder");
                }
                return rootNode;
            });
        });
    }

    ifView(predicate, viewCreator) {
        return this.mapView(
            value => !!predicate(value),
            enabled => enabled ? viewCreator(this._value) : null
        );
    }

    // creates a conditional subtemplate
    // use mapView if you need to map to a different view class
    if(predicate, renderFn) {
        return this.ifView(predicate, vm => new TemplateView(vm, renderFn));
    }
}

function errorToDOM(error) {
    const stack = new Error().stack;
    const callee = stack.split("\n")[1];
    return tag.div([
        tag.h2("Something went wrong…"),
        tag.h3(error.message),
        tag.p(`This occurred while running ${callee}.`),
        tag.pre(error.stack),
    ]);
}

function objHasFns(obj) {
    for(const value of Object.values(obj)) {
        if (typeof value === "function") {
            return true;
        }
    }
    return false;
}

for (const [ns, tags] of Object.entries(TAG_NAMES)) {
    for (const tag of tags) {
        TemplateBuilder.prototype[tag] = function(attributes, children) {
            return this.elNS(ns, tag, attributes, children);
        };
    }
}
