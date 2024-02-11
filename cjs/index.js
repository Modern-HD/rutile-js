/** @typedef {import('../index')} Rutile */

const Rutile = (function () {
    const DANGER_WORD = [
        'javascript',
        'script',
        '<iframe',
        'vbscript',
        'applet',
        'embed',
        '<object',
        '<frame',
        'onblur',
        'onchange',
        'onclick',
        'ondblclick',
        'enerror',
        'onfocus',
        'onload',
        'onmouse',
        'onscroll',
        'onsubmit',
        'onunload',
        'onerror',
    ];

    const replaceTargetFunc = [
        { origin: 'onClick', fix: 'onclick' },
        { origin: 'onChange', fix: 'onchange' },
        { origin: 'onInput', fix: 'oninput' },
    ];

    /** @type {Map<string, Function>} */
    const funcPrepareMap = new Map();

    /** @type {Map<string, Rutile.DomRef>} */
    const domRefMap = new Map();

    /** @type {Map<string, Function>} */
    const domReadyMap = new Map();

    /** @type {Rutile.StateMap} */
    const stateMap = new Map();

    /** @type {Rutile.StateMap} */
    const globalStateMap = new Map();

    /** @type {Rutile.IdxGenerator} */
    function* idxGenerator(keyword) {
        let i = 0;
        let idx = 0;
        while (true) {
            if (idx >= Number.MAX_SAFE_INTEGER) {
                i++;
                idx = 0;
            }
            yield `__${keyword}_${i}_${idx++}_`;
        }
    }

    const funcIdxGen = idxGenerator('FUNC');
    const domIdxGen = idxGenerator('DOM_REF');
    const domReadyIdxGen = idxGenerator('DOM_READY');
    const stateIdxGen = idxGenerator('DOM_SUBS');
    const subsCallbackIdxGen = idxGenerator('DOM_SUBS_CALL_BACK');

    /** @type {Rutile.Rutile} */
    const rutile = {
        render(html, root, renderOptions) {
            const eventAttributesPattern = new RegExp(DANGER_WORD.join('|'), 'gi');
            const htmlStr = html.replace(eventAttributesPattern, 'x');
            while (eventAttributesPattern.test(html)) {
                html = html.replace(eventAttributesPattern, 'x');
            }
            const rendering = document.createElement('div');
            const readyFunc = [];
            rendering.innerHTML = htmlStr;
            replaceTargetFunc.forEach((target, i) => {
                rendering.querySelectorAll(`div [data-func_prepare_${i}]`).forEach(el => {
                    let temp;
                    const funcName = el.dataset[`func_prepare_${i}`];
                    if ((temp = funcPrepareMap.get(funcName))) el[target.fix] = temp;
                    delete el.dataset[`func_prepare_${i}`];
                    !rendering.querySelector(`[data-func_prepare_${i}="${funcName}"]`) &&
                        funcPrepareMap.delete(funcName);
                });
            });
            rendering.querySelectorAll(`div [ref]`).forEach(el => {
                const refIdx = el.getAttribute('ref');
                domRefMap.get(refIdx).current = el;
                el.removeAttribute('ref');
                domRefMap.delete(refIdx);
            });
            rendering.querySelectorAll(`div dom-ready-event[data-dom_ready]`).forEach(el => {
                const idx = el.dataset['dom_ready'];
                readyFunc.push(domReadyMap.get(idx));
                domReadyMap.delete(idx);
                el.remove();
            });
            rendering.querySelectorAll(`div state-subs`).forEach(el => {
                if (!(el instanceof HTMLElement)) return;
                const stateIdx = el.dataset['dom_subs'];
                const globalStateKey = el.dataset['dom_global_subs'];
                if (!(stateIdx || globalStateKey)) return;
                const state = stateIdx ? stateMap.get(stateIdx) : globalStateMap.get(globalStateKey);
                if (!state) return;
                const isComponent = el.dataset['dom_subs_component'];
                const subsCallbackIdx = el.dataset['dom_subs_callback'];
                const callback = subsCallbackIdx ? state.callbackMap.get(subsCallbackIdx) : undefined;
                if (isComponent) {
                    readyFunc.push(() => {
                        rutile.render(rutile.build(callback ? `${callback(state.value)}` : state.value), el);
                    });
                } else if (callback) {
                    el.innerText = rutile.safeXSS(`${callback(state.value)}`);
                } else {
                    el.innerText = rutile.safeXSS(`${state.value}`);
                }
                state.subsList.push({ elem: el, callback: callback, component: isComponent && isComponent === 'true' });
                delete el.dataset['dom_subs'];
                if (isComponent) delete el.dataset['dom_subs_component'];
                if (subsCallbackIdx) delete el.dataset['dom_subs_callback'];
                if (globalStateKey) delete el.dataset['dom_global_subs'];
                if (callback) state.callbackMap.delete(subsCallbackIdx);
            });
            rendering.querySelectorAll('div script').forEach(el => {
                el.remove();
            });
            if (renderOptions) {
                if (!renderOptions.append) root.innerHTML = '';
            } else {
                root.innerHTML = '';
            }
            Array.from(rendering.children).forEach(el => {
                root.appendChild(el);
            });
            readyFunc.forEach(func => func());
            stateMap.forEach((value, key) => {
                value.subsList = value.subsList.filter(subs => document.contains(subs.elem));
                if (value.subsList.length !== 0) return;
                stateMap.delete(key);
            });
        },
        build(html, buildOptions) {
            if (!buildOptions) {
                return html;
            }
            let htmlStr = html;
            if (buildOptions.eventPrepare) {
                replaceTargetFunc.forEach((target, i) => {
                    const regexStr = `${target.origin}="{(.*?)}\"`;
                    const regex = new RegExp(regexStr, 'g');
                    let temp;
                    for (const match of htmlStr.matchAll(regex)) {
                        const name = match[1];
                        if (temp && temp === name) continue;
                        temp = name;
                        if (!buildOptions.eventPrepare[name]) continue;
                        const newFuncName = funcIdxGen.next().value;
                        htmlStr = htmlStr.replaceAll(
                            `${target.origin}="{${name}}"`,
                            `data-func_prepare_${i}="${newFuncName}"`
                        );
                        funcPrepareMap.set(newFuncName, buildOptions.eventPrepare[name]);
                    }
                });
            }
            if (buildOptions.stylePrepare) {
                const regexStr = `style="({.*?})\"`;
                let regex = new RegExp(regexStr, 'g');
                for (const match of htmlStr.matchAll(regex)) {
                    const name = match[1].substring(1, match[1].length - 1);
                    if (!buildOptions.stylePrepare[name]) continue;
                    let style = '';
                    for (const key in buildOptions.stylePrepare[name]) {
                        style += `${kebabStyleProperty(key)}: ${buildOptions.stylePrepare[name][key]}; `;
                    }
                    htmlStr = htmlStr.replaceAll(`{${name}}`, style);
                }
            }
            if (buildOptions.domReady) {
                if (buildOptions.domReady instanceof Function) {
                    const array = [];
                    array.push(buildOptions.domReady);
                    buildOptions.domReady = array;
                }

                if (buildOptions.domReady instanceof Array) {
                    buildOptions.domReady.forEach(func => {
                        const idx = domReadyIdxGen.next().value;
                        domReadyMap.set(idx, func);
                        htmlStr += `<dom-ready-event data-dom_ready="${idx}"></dom-ready-event> `;
                    });
                }
            }
            return htmlStr;
        },
        domRef() {
            /** @type {Rutile.DomRef} */
            const domRef = {
                current: null,
                set: domIdxGen.next().value,
            };
            domRefMap.set(domRef.set, domRef);
            return domRef;
        },
        createState(initialState) {
            const stateIdx = stateIdxGen.next().value;
            /** @type {Rutile.State} */
            const state = { value: initialState, subsList: [], callbackMap: new Map() };
            stateMap.set(stateIdx, state);

            return [
                {
                    subs(type = 'inline', callback) {
                        if (type instanceof Function) {
                            callback = type;
                            type = 'inline';
                        }
                        let html = `<state-subs data-dom_subs="${stateIdx}" ${
                            type === 'block' ? 'style="display: block;"' : ''
                        } `;
                        if (type === 'component') {
                            html += 'data-dom_subs_component="true" ';
                        }
                        if (callback instanceof Function) {
                            const subsCallbackIdx = subsCallbackIdxGen.next().value;
                            html += `data-dom_subs_callback="${subsCallbackIdx}" `;
                            state.callbackMap.set(subsCallbackIdx, callback);
                        }
                        html += '></state-subs>';
                        return html;
                    },
                    getState() {
                        if (state.value instanceof Object) return { ...state.value };
                        if (state.value instanceof Array) return [...state.value];
                        return state.value;
                    },
                },
                newValue => {
                    if (state.value === newValue) return;
                    state.value = newValue;
                    rerenderState(state);
                },
            ];
        },
        createGlobalState(option) {
            if (globalStateMap.has(option.key))
                throw new DuplicateKeyError('globalState에서는 중복된 키를 사용하실 수 없습니다.');
            /** @type {Rutile.State} */
            const state = { value: option.default, default: option.default, subsList: [], callbackMap: new Map() };
            globalStateMap.set(option.key, state);
            const defaultValue =
                state.default instanceof Object
                    ? { ...state.default }
                    : state.default instanceof Array
                    ? [...state.default]
                    : state.default;

            return {
                stateKey: option.key,
                defaultValue,
            };
        },
        getGlobalState(atom) {
            return {
                subs(type = 'inline', callback) {
                    if (type instanceof Function) {
                        callback = type;
                        type = 'inline';
                    }
                    let html = `<state-subs data-dom_global_subs="${atom.stateKey}" ${
                        type === 'block' ? 'style="display: block;"' : ''
                    } `;
                    if (type === 'component') {
                        html += 'data-dom_subs_component="true" ';
                    }
                    const state = globalStateMap.get(atom.stateKey);
                    if (callback instanceof Function) {
                        const subsCallbackIdx = subsCallbackIdxGen.next().value;
                        html += `data-dom_subs_callback="${subsCallbackIdx}" `;
                        state.callbackMap.set(subsCallbackIdx, callback);
                    }
                    html += '></state-subs>';
                    return html;
                },
                getState() {
                    const state = globalStateMap.get(atom.stateKey);
                    if (state.value instanceof Object) return { ...state.value };
                    if (state.value instanceof Array) return [...state.value];
                    return state.value;
                },
            };
        },
        setGlobalState(atom) {
            return newVal => {
                const state = globalStateMap.get(atom.stateKey);
                if (state.value === newVal) return;
                state.value = newVal;
                state.subsList = state.subsList.filter(subs => document.contains(subs.elem));
                rerenderState(state);
            };
        },
        useGlobalState(atom) {
            return [rutile.getGlobalState(atom), rutile.setGlobalState(atom)];
        },
        resetGlobalState(atom) {
            const state = globalStateMap.get(atom.stateKey);
            if (state.value === state.default) return;
            state.value = state.default;
            state.subsList = state.subsList.filter(subs => document.contains(subs.elem));
            rerenderState(state);
        },
        safeXSS(unsafeHtml) {
            return unsafeHtml
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },
    };

    class DuplicateKeyError extends Error {
        constructor(message) {
            super(message);
            this.name = 'DuplicateKeyError';
        }
    }

    /** @param {Rutile.State} state */
    function rerenderState(state) {
        state.subsList.forEach(el => {
            if (el.component) {
                rutile.render(rutile.build(el.callback ? `${el.callback(state.value)}` : state.value), el.elem);
            } else if (el.callback) {
                el.elem.innerText = rutile.safeXSS(`${el.callback(state.value)}`);
            } else {
                el.elem.innerText = rutile.safeXSS(`${state.value}`);
            }
        });
    }

    function kebabStyleProperty(styleProperty) {
        return styleProperty
            .split('')
            .map((char, index) => {
                const kebabChar = char.toLowerCase();
                return char !== kebabChar && index > 0 ? '-' + kebabChar : kebabChar;
            })
            .join('');
    }

    return rutile;
})();

module.exports = Rutile;
