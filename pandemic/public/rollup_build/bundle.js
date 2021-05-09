
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const gameObject = {
        cityList: [
            {
                index: 0,
                name: '샌프란시스코',
                x: 58,
                y: 280,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [1, 14, 39, 46]
            },
            {
                index: 1,
                name: '시카고',
                x: 183,
                y: 245,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [0, 2, 4, 13, 14]
            },
            {
                index: 2,
                name: '몬트리올',
                x: 280,
                y: 245,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [1, 3, 5]
            },
            {
                index: 3,
                name: '뉴욕',
                x: 360,
                y: 250,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [2, 5, 6, 7]
            },
            {
                index: 4,
                name: '애틀란타',
                x: 220,
                y: 306,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [1, 5, 12]
            },
            {
                index: 5,
                name: '위싱턴',
                x: 324,
                y: 300,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [2, 3, 4, 12]
            },
            {
                index: 6,
                name: '런던',
                x: 530,
                y: 195,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [3, 8, 9, 7]
            },
            {
                index: 7,
                name: '마그리드',
                x: 520,
                y: 290,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [3, 6, 8, 24]
            },
            {
                index: 8,
                name: '파리',
                x: 600,
                y: 245,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [6, 7, 9, 10, 24]
            },
            {
                index: 9,
                name: '에센',
                x: 630,
                y: 185,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [6, 8, 10, 11]
            },
            {
                index: 10,
                name: '밀라노',
                x: 665,
                y: 240,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [8, 9, 28]
            },
            {
                index: 11,
                name: '상트페테르부르크',
                x: 735,
                y: 165,
                count: 3,
                blue: true,
                red: false,
                yellow: false,
                black: false,
                linkedCityListIndex: [9, 28, 31]
            },
            {
                index: 12,
                name: '마이에미',
                x: 280,
                y: 385,
                count: 3,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [4, 5, 13, 15]
            },
            {
                index: 13,
                name: '멕시코 시티',
                x: 170,
                y: 400,
                count: 3,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [12, 14, 15, 16]
            },
            {
                index: 14,
                name: '로스엔젤레스',
                x: 80,
                y: 370,
                count: 3,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [0, 1, 13, 47]
            },
            {
                index: 15,
                name: '보고타',
                x: 275,
                y: 485,
                count: 3,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [12, 13, 16, 18, 19]
            },
            {
                index: 16,
                name: '리마',
                x: 240,
                y: 590,
                count: 3,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [13, 15, 17]
            },
            {
                index: 17,
                name: '산티아고',
                x: 255,
                y: 695,
                count: 2,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [16]
            },
            {
                index: 18,
                name: '부에노스아이레스',
                x: 355,
                y: 680,
                count: 1,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [15, 19]
            },
            {
                index: 19,
                name: '상파울루',
                x: 415,
                y: 610,
                count: 1,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [7, 15]
            },
            {
                index: 20,
                name: '라고스',
                x: 600,
                y: 475,
                count: 1,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [19, 21, 22]
            },
            {
                index: 21,
                name: '카스툼',
                x: 715,
                y: 460,
                count: 1,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [20, 22, 23, 25]
            },
            {
                index: 22,
                name: '킨샤샤',
                x: 650,
                y: 540,
                count: 1,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [20, 21, 23]
            },
            {
                index: 23,
                name: '요하네스버그',
                x: 715,
                y: 630,
                count: 1,
                blue: false,
                red: false,
                yellow: true,
                black: false,
                linkedCityListIndex: [21, 22]
            },
            {
                index: 24,
                name: '알제',
                x: 620,
                y: 340,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [7, 8, 25, 28]
            },
            {
                index: 25,
                name: '카이로',
                x: 705,
                y: 355,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [21, 24, 26, 27, 28]
            },
            {
                index: 26,
                name: '리야드',
                x: 795,
                y: 410,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [25, 27, 30]
            },
            {
                index: 27,
                name: '바그다드',
                x: 785,
                y: 335,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [25, 26, 28, 30, 32]
            },
            {
                index: 28,
                name: '이스탄불',
                x: 715,
                y: 275,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [10, 11, 24, 25, 27, 31]
            },
            {
                index: 29,
                name: '뭄바이',
                x: 885,
                y: 425,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [30, 33, 35]
            },
            {
                index: 30,
                name: '카라치',
                x: 875,
                y: 365,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [26, 27, 29, 32, 33]
            },
            {
                index: 31,
                name: '모스크바',
                x: 790,
                y: 230,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [11, 28, 32]
            },
            {
                index: 32,
                name: '테헤란',
                x: 855,
                y: 275,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [27, 30, 31]
            },
            {
                index: 33,
                name: '델리',
                x: 945,
                y: 340,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [29, 30, 32, 34, 35]
            },
            {
                index: 34,
                name: '콜카타',
                x: 1010,
                y: 370,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [33, 35, 40, 43]
            },
            {
                index: 35,
                name: '첸나이',
                x: 960,
                y: 490,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [29, 33, 34, 40, 41]
            },
            {
                index: 36,
                name: '베이징',
                x: 1060,
                y: 260,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [37, 38]
            },
            {
                index: 37,
                name: '상하이',
                x: 1060,
                y: 320,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [36, 38, 39, 43, 45]
            },
            {
                index: 38,
                name: '서울',
                x: 1140,
                y: 260,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [36, 37, 39]
            },
            {
                index: 39,
                name: '도쿄',
                x: 1210,
                y: 290,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [37, 38, 44]
            },
            {
                index: 40,
                name: '방콕',
                x: 1015,
                y: 440,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [34, 35, 41, 42, 43]
            },
            {
                index: 41,
                name: '자카르타',
                x: 1015,
                y: 570,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [35, 40, 42, 47]
            },
            {
                index: 42,
                name: '호치민 시티',
                x: 1075,
                y: 500,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [40, 41, 43, 46]
            },
            {
                index: 43,
                name: '홍콩',
                x: 1070,
                y: 400,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [34, 37, 40, 42, 45, 46]
            },
            {
                index: 44,
                name: '오사카',
                x: 1225,
                y: 360,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [39, 45]
            },
            {
                index: 45,
                name: '타이베이',
                x: 1155,
                y: 390,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [37, 43, 44, 46]
            },
            {
                index: 46,
                name: '마닐라',
                x: 1165,
                y: 495,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [43, 43, 45, 47]
            },
            {
                index: 47,
                name: '시드니',
                x: 1220,
                y: 695,
                count: 1,
                blue: false,
                red: false,
                yellow: false,
                black: true,
                linkedCityListIndex: [14, 41, 46]
            }
        ]
    };

    const { subscribe: subscribe$1, set, update: update$1 } = writable(gameObject);

    const gameStore = {
        subscribe: subscribe$1,
        set,
        update: update$1
    };

    /* src\App.svelte generated by Svelte v3.32.3 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (14:8) {#each cityList as city}
    function create_each_block(ctx) {
    	let div;
    	let t0_value = /*city*/ ctx[3].count + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "city svelte-crh8lm");
    			set_style(div, "left", /*city*/ ctx[3].x + "px");
    			set_style(div, "top", /*city*/ ctx[3].y + "px");
    			toggle_class(div, "blue", /*city*/ ctx[3].blue);
    			toggle_class(div, "yellow", /*city*/ ctx[3].yellow);
    			toggle_class(div, "black", /*city*/ ctx[3].black);
    			toggle_class(div, "red", /*city*/ ctx[3].red);
    			add_location(div, file, 14, 12, 334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(14:8) {#each cityList as city}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div3;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let mounted;
    	let dispose;
    	let each_value = /*cityList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = "1";
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div2 = element("div");
    			div2.textContent = "3";
    			attr_dev(div0, "class", "left svelte-crh8lm");
    			add_location(div0, file, 11, 4, 213);
    			attr_dev(div1, "class", "board svelte-crh8lm");
    			add_location(div1, file, 12, 4, 244);
    			attr_dev(div2, "class", "right svelte-crh8lm");
    			add_location(div2, file, 24, 4, 711);
    			attr_dev(div3, "class", "pandemic svelte-crh8lm");
    			add_location(div3, file, 10, 0, 185);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div3, t2);
    			append_dev(div3, div2);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*handleClick*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*cityList*/ 1) {
    				each_value = /*cityList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $gameStore;
    	validate_store(gameStore, "gameStore");
    	component_subscribe($$self, gameStore, $$value => $$invalidate(2, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const cityList = $gameStore.cityList;

    	const handleClick = e => {
    		console.log(">>> e", e);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		gameStore,
    		cityList,
    		handleClick,
    		$gameStore
    	});

    	return [cityList, handleClick];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
