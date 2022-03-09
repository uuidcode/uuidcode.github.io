
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe$1(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe$1(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe$1(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update$1(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
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
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
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
            mount_component(component, options.target, options.anchor, options.customElement);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
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
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
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
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
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
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const itemCardList = [
        {
            name: '약',
            description: "부상 토큰을 하나 제거합니다.",
            category: '약',
            type: 'execute',
            feature: 'care',
            targetCount: 1
        },
        {
            name: '주사기',
            description: "부상 토큰을 두개를 제거합니다.",
            category: '약',
            type: 'execute',
            feature: 'care',
            targetCount: 2
        },
        {
            name: '야구방망이',
            description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴립니다.",
            category: '도구',
            type: 'execute'
        },
        {
            name: '식량1',
            description: "식량창고에 식량토큰을 하나를 추가합니다.",
            category: '식량',
            type: 'execute',
            feature: 'food',
            targetCount: 1
        },
        {
            name: '식량2',
            description: "식량창고에 식량토큰을 두개를 추가합니다.",
            category: '식량',
            type: 'execute',
            feature: 'food',
            targetCount: 2
        },
        {
            name: '식량3',
            description: "식량창고에 식량토큰을 세개를 추가합니다.",
            category: '식량',
            type: 'execute',
            feature: 'food',
            targetCount: 3
        },
        {
            name: '바리게이트',
            description: "바리게이트를 설치합니다.",
            category: '교육',
            type: 'execute',
            feature: 'barricade'
        },
        {
            name: '격투기',
            description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
            category: '교육',
            type: 'execute',
            feature: 'attack',
            targetCount: 1
        },
        {
            name: '가위',
            category: '도구',
            description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
            type: 'execute',
            feature: 'attack',
            targetCount: 1
        },
        {
            name: '확성기',
            description: "좀비를 3구를 유인합니다.",
            category: '도구',
            type: 'execute',
            feature: 'invite'
        },
        {
            name: '외부인1',
            description: "외부인 1명을 피난기지로 보냅니다.",
            category: '외부인',
            type: 'event',
            targetCount: 1
        },
        {
            name: '외부인2',
            description: "외부인 2명을 피난기지로 보냅니다.",
            category: '외부인',
            type: 'event',
            targetCount: 2
        },
        {
            name: '외부인3',
            description: "외부인 3명을 피난기지로 보냅니다.",
            category: '외부인',
            type: 'event',
            targetCount: 3
        },
        {
            name: '학교 청사진',
            description: "학교의 아이템 카드를 획득합니다.",
            category: '교육',
            type: 'execute',
            feature: 'search',
            placeNameList: ['학교']
        },
        {
            name: '경찰서 청사진',
            description: "경찰서의 아이템 카드를 획득합니다.",
            category: '교육',
            type: 'execute',
            feature: 'search',
            placeNameList: ['경찰서']
        },
        {
            name: '주유소 청사진',
            description: "주유소의 아이템 카드를 획득합니다.",
            category: '교육',
            type: 'execute',
            feature: 'search',
            placeNameList: ['주유소']
        },
        {
            name: '마트 청사진',
            description: "마트의 아이템 카드를 획득합니다.",
            category: '교육',
            type: 'execute',
            feature: 'search',
            placeNameList: ['마트']
        },
        {
            name: '병원 청사진',
            description: "병원의 아이템 카드를 획득합니다.",
            category: '교육',
            type: 'execute',
            feature: 'search',
            placeNameList: ['병원']
        },
        {
            name: '도서관 청사진',
            description: "도서관의 아이템 카드를 획득합니다.",
            category: '교육',
            type: 'execute',
            feature: 'search',
            placeNameList: ['도서관']
        },
        {
            name: '생존 요리법',
            description: "피난기지에 음식 토큰 1개를 추가합니다.",
            category: '교육',
            type: 'execute',
            feature: 'food',
            place: '피난기지',
            targetCount: 1
        },
        {
            name: '리더십',
            category: '교육',
            description: "미사용 행동 주사위의 결과값을 1 증가시킵니다.",
            type: 'execute',
            feature: 'power'
        },
        {
            name: '잡동사니',
            description: "미사용 행동 주사위의 결과값을 1 증가시킵니다.",
            category: '도구',
            type: 'execute',
            feature: 'power'
        },
        {
            name: '백과사전',
            description: "미사용 행동 주사위의 결과값을 1 증가시킵니다.",
            category: '교육',
            type: 'execute',
            feature: 'power'
        },
        {
            name: '연료',
            description: "생존자를 이동합니다. 위험 노출 주사위를 굴리지 않습니다.",
            category: '연료',
            type: 'execute',
            feature: 'safeMove'
        },
        {
            name: '독서등',
            description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴립니다.",
            category: '도구',
            type: 'execute',
            feature: 'attack',
            targetCount: 1
        },
        {
            name: '무전기',
            description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
            category: '도구',
            type: 'execute',
            feature: 'attack',
            targetCount: 1
        },
        {
            name: '산탄총',
            description: "좀비를 2구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
            category: '무기',
            type: 'execute',
            feature: 'attack',
            targetCount: 2
        },
        {
            name: '소총',
            description: "좀비를 2구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
            category: '무기',
            type: 'execute',
            feature: 'attack',
            targetCount: 2
        },
        {
            name: '권총',
            description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
            category: '무기',
            type: 'execute',
            feature: 'attack',
            targetCount: 1
        },
        {
            name: '주머니칼',
            description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
            category: '무기',
            type: 'execute',
            feature: 'attack',
            targetCount: 1
        },
        // {
        //     name: '라이터',
        //     description: "연료카드도 같이 사용해서 좀비를 4구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
        //     category: '무기',
        //     type: 'execute',
        //     feature: 'attackWithFuel'
        // },
        {
            name: '야시경',
            description: "좀비를 1구를 제거합니다. 위험 노출 주사를 굴리지 않습니다.",
            category: '도구',
            type: 'execute',
            feature: 'attack',
            targetCount: 1
        },
        {
            name: '자물쇠',
            description: "바리게이트를 설치합니다.",
            category: '도구',
            type: 'execute',
            feature: 'barricade'
        },
        {
            name: '망치',
            description: "바리게이트를 설치합니다.",
            category: '도구',
            type: 'execute',
            feature: 'barricade'
        },
        {
            name: '대걸레',
            description: "쓰레기 3개를 치웁니다.",
            category: '도구',
            type: 'execute',
            feature: 'clean'
        }
        // ,
        // {
        //     name: '손전등',
        //     description: "아무 장소의 아이템 카드 3장을 획득합니다.",
        //     category: '도구',
        //     type: 'execute',
        //     feature: 'search',
        //     placeNameList: ['학교', '병원', '경찰서', '마트', '도서관', '주유소']
        // }
    ];

    itemCardList.forEach(itemCard => {
        itemCard.canPreventRisk = false;
        itemCard.canExecute = false;
    });

    const survivorList = [
        {
            index: 0,
            name: '브라이언 리',
            job: '시장',
            power: 68,
            attack: 3,
            search: 4,
            ability: {
                name: '도서관에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['도서관']
            }
        },
        {
            index: 1,
            name: '토머스 하트',
            job: '군인',
            power: 64,
            attack: 1,
            search: 3,
            ability: {
                name: '현재 장소에서 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        },
        {
            index: 2,
            name: '스파키',
            job: '스턴트견',
            power: 10,
            attack: 2,
            search: 2,
            ability: {
                name: '이동하지만 위험 노출 주사위를 굴리지 않습니다.',
                type: 'move'
            }
        },
        {
            index: 3,
            name: '올리비아 브라운',
            job: '의사',
            power: 56,
            attack: 4,
            search: 3,
            ability: {
                name: '올리바아와 같은 장소의 생존자(올리비아 포함) 중 한 명에게서 부상 토근 1개 제거합니다.',
                type: 'care',
            }
        },
        {
            index: 4,
            name: '그레이 비어드',
            job: '해적',
            power: 16,
            attack: 1,
            search: 4,
            ability: {
                name: '현재 장소의 아이템 카드 1장 가져갑니다.',
                type: 'get',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        },
        {
            index: 5,
            name: '로레타 클레이',
            job: '요리사',
            power: 20,
            attack: 2,
            search: 4,
            ability: {
                name: '식량 창고에 식량 토큰 2개 추가합니다.',
                type: 'food'
            }
        },
        {
            index: 6,
            name: '앤드류 에반스',
            job: '농부',
            power: 12,
            attack: 3,
            search: 3,
            ability: {
                name: '마트에 있을때, 아이템 카드 1장 가져갑니다.',
                type: 'get',
                placeNameList: ['마트']
            }
        },
        {
            index: 7,
            name: '탈리아 존스',
            job: '점술가',
            power: 28,
            attack: 3,
            search: 1,
            ability: {
                name: '도서관에 있을때, 아이템 카드 1장 가져갑니다.',
                type: 'get',
                placeNameList: ['도서관']
            }
        },
        {
            index: 8,
            name: '포레스트 플럼',
            job: '쇼핑몰 직원',
            power: 14,
            attack: 2,
            search: 5,
            ability: {
                name: '포레스트를 게임에서 제거함으로 사기 1 상승 합니다.',
                type: 'plusMoral'
            }
        },
        {
            index: 9,
            name: '데이비드 가르시아',
            job: '회계사',
            power: 50,
            attack: 4,
            search: 3,
            ability: {
                name: '현재 장소에서 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        },
        {
            index: 10,
            name: '존 프라이스',
            job: '학생',
            power: 18,
            attack: 3,
            search: 5,
            ability: {
                name: '학교에 있을때, 아이템 카드 1장 가져갑니다.',
                type: 'get',
                placeNameList: ['학교']
            }
        },
        {
            index: 11,
            name: '에드워드 화이트',
            job: '화학자',
            power: 44,
            attack: 4,
            search: 3,
            ability: {
                name: '주유소에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['주유소']
            }
        },
        {
            index: 12,
            name: '알렉시스 그레이',
            job: '사서',
            power: 46,
            attack: 5,
            search: 4,
            ability: {
                name: '도서관에 있을때 아이템 카드 1장을 가져갑니다.',
                type: 'get',
                placeNameList: ['도서관']
            }
        },
        {
            index: 13,
            name: '마리아 로페즈',
            job: '교사',
            power: 48,
            attack: 4,
            search: 2,
            ability: {
                name: '학교에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['학교']
            }
        },
        {
            index: 14,
            name: '소피 로빈슨',
            job: '항공기 조종사',
            power: 58,
            attack: 4,
            search: 1,
            ability: {
                name: '경찰서에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['경찰서']
            }
        },
        {
            index: 15,
            name: '가브리엘 디아즈',
            job: '소방관',
            power: 60,
            attack: 2,
            search: 3,
            ability: {
                name: '현재 장소에선 외부인 카드 1장를 가져갑니다.',
                type: 'rescue'
            }
        },
        {
            index: 16,
            name: '제니 클라크',
            job: '웨이트리스',
            power: 24,
            attack: 4,
            search: 3,
            ability: {
                name: '현재 장소의 아이템 카드를 1장을 가져갑니다.',
                type: 'get',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        },
        {
            index: 17,
            name: '브랜든 케인',
            job: '건물 관리인',
            power: 26,
            attack: 2,
            search: 4,
            ability: {
                name: '쓰레기 카드 5장 처분합니다.',
                type: 'clean'
            }
        },
        {
            index: 18,
            name: '베브 러셀',
            job: '어머니',
            power: 34,
            attack: 2,
            search: 4,
            ability: {
                name: '피난기지에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['피난기지']
            }
        },
        {
            index: 19,
            name: '버디 데이비스',
            job: '헬스 트레이너',
            power: 36,
            attack: 2,
            search: 4,
            ability: {
                name: '마트에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['마트']
            }
        },
        {
            index: 20,
            name: '애널리 첸',
            job: '변호사',
            power: 38,
            attack: 2,
            search: 2,
            ability: {
                name: '현재 장소의 아이템 카드를 1장을 가져갑니다.',
                type: 'get',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        },
        {
            index: 21,
            name: '로드 밀러',
            job: '트럭 운전기사',
            power: 40,
            attack: 3,
            search: 3,
            ability: {
                name: '주유소에 있을때 아이템 카드를 1장을 가져갑니다.',
                type: 'get',
                placeNameList: ['주유소']
            }
        },
        {
            index: 22,
            name: '자넷 타일러',
            job: '간호사',
            power: 42,
            attack: 3,
            search: 4,
            ability: {
                name: '병원에 있을때 아이템 카드 1장 가져갑니다.',
                type: 'get',
                placeNameList: ['병원']
            }
        },
        {
            index: 23,
            name: '아서 서스턴',
            job: '교장',
            power: 62,
            attack: 4,
            search: 2,
            ability: {
                name: '학교에 있을때 아이템 카드 1장 가져갑니다.',
                type: 'get',
                placeNameList: ['학교']
            }
        },
        {
            index: 24,
            name: '마이크 조',
            job: '닌자',
            power: 30,
            attack: 2,
            search: 4,
            ability: {
                name: '현재 장소에서 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        },
        {
            index: 25,
            name: '하먼 브록스',
            job: '공원 관리인',
            power: 32,
            attack: 3,
            search: 3,
            ability: {
                name: '현재 장소에 바리케이트 2개 설치합니다.',
                type: 'barricade',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        },
        {
            index: 26,
            name: '제임스 마이어스',
            job: '정신과 의사',
            power: 54,
            attack: 6,
            search: 3,
            ability: {
                name: '병원에 있을때 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['병원']
            }
        },
        {
            index: 27,
            name: '카를라 톰슨',
            job: '경찰 지령요원',
            power: 22,
            attack: 4,
            search: 3,
            ability: {
                name: '경찰서에 있을때 아이템 카드 1장 가져갑니다.',
                type: 'get',
                placeNameList: ['경찰서']
            }
        },
        {
            index: 28,
            name: '에슐리 로스',
            job: '건설 노동자',
            power: 52,
            attack: 2,
            search: 5,
            ability: {
                name: '현재 장소에 바리케이트 2개 설치합니다.',
                type: 'barricade',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        },
        {
            index: 29,
            name: '다니엘 스미스',
            job: '보안관',
            power: 66,
            attack: 2,
            search: 5,
            ability: {
                name: '현재 장소에서 좀비 1구 처치합니다. 이때 위험 노출 주사위를 굴리지 않습니다.',
                type: 'killZombie',
                placeNameList: ['피난기지', '병원', '경찰서', '주유소', '학교', '도서관', '마트']
            }
        }
    ];

    survivorList.forEach(survivor => {
        survivor.wound = 0;
        survivor.playerIndex = 0;
        survivor.active = false;
        survivor.place = null;
        survivor.ability.done = false;
        survivor.actionTable = [];
        survivor.foodList = [];
        survivor.noRollDangerDice = false;
        survivor.canUseAbility = true;
        survivor.playerName;
    });

    const placeList = [
        {
            name: '피난기지',
            maxSurvivorCount: 24,
            survivorList: [],
            survivorLocationList: [],
            foodCount: 0,
            starvingTokenCount: 0,
            weakTokenCount: 0,
            trashCount: 0,
            itemCardList: [],
            entranceList: [
                {
                    maxZombieCount: 3,
                    zombieCount: 0,
                    barricadeCount: 0
                },
                {
                    maxZombieCount: 3,
                    zombieCount: 0,
                    barricadeCount: 0
                },
                {
                    maxZombieCount: 3,
                    zombieCount: 0,
                    barricadeCount: 0
                },
                {
                    maxZombieCount: 3,
                    zombieCount: 0,
                    barricadeCount: 0
                },
                {
                    maxZombieCount: 3,
                    zombieCount: 0,
                    barricadeCount: 0
                },
                {
                    maxZombieCount: 3,
                    zombieCount: 0,
                    barricadeCount: 0
                }
            ]
        },
        {
            name: '경찰서',
            entranceList: [
                {
                    maxZombieCount: 4,
                    zombieCount: 0,
                    barricadeCount: 0
                }
            ],
            maxSurvivorCount: 3,
            survivorList: [],
            survivorLocationList: [],
            noiseTokenCount: 0,
            itemCardList: [
                "무전기",
                "잡동사니",
                "야시경",
                "자물쇠",
                "산탄총",
                "권총",
                "권총",
                "권총",
                "소총",
                "소총",
                "연료",
                "연료",
                "연료",
                "연료",
                "식량1",
                "식량1",
                "식량1",
                "외부인1",
                "외부인2",
                "외부인2",
            ]
        },
        {
            name: '병원',
            entranceList: [
                {
                    maxZombieCount: 4,
                    zombieCount: 0,
                    barricadeCount: 0
                }
            ],
            maxSurvivorCount: 4,
            survivorList: [],
            survivorLocationList: [],
            noiseTokenCount: 0,
            itemCardList: [
                "잡동사니",
                "대걸레",
                "약",
                "약",
                "약",
                "약",
                "약",
                "주사기",
                "주사기",
                "연료",
                "연료",
                "연료",
                "연료",
                "식량2",
                "식량2",
                "식량2",
                "식량2",
                "외부인2",
                "외부인2",
                "외부인2",
            ]
        },
        {
            name: '학교',
            entranceList: [
                {
                    maxZombieCount: 4,
                    zombieCount: 0,
                    barricadeCount: 0
                }
            ],
            maxSurvivorCount: 4,
            survivorList: [],
            survivorLocationList: [],
            noiseTokenCount: 0,
            itemCardList: [
                "잡동사니",
                "야구방망이",
                "가위",
                "확성기",
                "약",
                "약",
                "약",
                "학교 청사진",
                "바리게이트",
                "리더십",
                "격투기",
                "식량1",
                "식량1",
                "식량1",
                "식량2",
                "식량2",
                "식량2",
                "외부인2",
                "외부인2",
                "외부인3"
            ]
        },
        {
            name: '마트',
            maxSurvivorCount: 3,
            entranceList: [
                {
                    maxZombieCount: 4,
                    zombieCount: 0,
                    barricadeCount: 0
                }
            ],
            survivorList: [],
            survivorLocationList: [],
            noiseTokenCount: 0,
            itemCardList: [
                "잡동사니",
                "잡동사니",
                "주머니칼",
                "망치",
                "연료",
                "약",
                "약",
                "약",
                "약",
                "약",
                "약",
                "식량1",
                "식량1",
                "식량2",
                "식량2",
                "식량3",
                "식량3",
                "외부인1",
                "외부인2",
                "외부인2",
            ]
        },
        {
            name: '도서관',
            entranceList: [
                {
                    maxZombieCount: 3,
                    zombieCount: 0,
                    barricadeCount: 0
                }
            ],
            maxSurvivorCount: 3,
            survivorList: [],
            survivorLocationList: [],
            barricadeCount: 0,
            noiseTokenCount: 0,
            itemCardList: [
                "독서등",
                "잡동사니",
                "백과사전",
                "생존 요리법",
                "경찰서 청사진",
                "병원 청사진",
                "마트 청사진",
                "주유소 청사진",
                "도서관 청사진",
                "연료",
                "연료",
                "연료",
                "연료",
                "식량1",
                "식량1",
                "식량1",
                "식량1",
                "외부인1",
                "외부인2",
                "외부인2",
            ]
        },
        {
            name: '주유소',
            entranceList: [
                {
                    maxZombieCount: 3,
                    zombieCount: 0,
                    barricadeCount: 0
                }
            ],
            maxSurvivorCount: 2,
            survivorList: [],
            survivorLocationList: [],
            noiseTokenCount: 0,
            itemCardList: [
                "산탄총",
                "주머니칼",
                "주머니칼",
                "바리게이트",
                "잡동사니",
                "약",
                "약",
                "약",
                "연료",
                "연료",
                "연료",
                "연료",
                "연료",
                "연료",
                "식량1",
                "식량1",
                "식량1",
                "외부인1",
                "외부인2",
                "외부인2",
            ]
        }
    ];

    survivorList.forEach(survivor => {
        survivor.activieSurvive = null;
    });

    placeList.forEach((place, index) => {
        place.index = index;
        place.currentZombieCount = 0;
        place.currentBarricadeCount = 0;
        place.maxZombieCount = 0;
        place.currentZombieList = [];

        place.entranceList.forEach(entrance => {
            entrance.zombieList = [];
        });

        if (index === 0) {
            place.activeClassName = 'active';
        } else {
            place.activeClassName = 'inactive';
        }
    });

    const riskCardList = [
        {
            name: '식량 2개를 모아라. 실패시 사기 1 하락',
            condition: {
                itemCardList: ['식량'],
                fail: {
                    actionList: [
                        {
                            name: 'minusMoral'
                        }
                    ]
                }
            }
        },
        {
            name: '연료 2개를 모아라. 실패시 피난기지에 좀비 12구 출현',
            condition: {
                itemCardList: ['연료'],
                fail: {
                    actionList: [
                        {
                            name: 'zombie',
                            targetCount: 12,
                            placeList: ['피난기지']
                        }
                    ]
                }
            }
        },
        {
            name: '약 2개를 모아라. 실패시 5번의 부상',
            condition: {
                itemCardList: ['약'],
                fail: {
                    actionList: [
                        {
                            name: 'wound',
                            targetCount: 5
                        }
                    ]
                }
            }
        },
        {
            name: '약/도구 2개를 모아라. 실패시 도서관과 마트에 좀비 3구 출현',
            condition: {
                itemCardList: ['약', '도구'],
                fail: {
                    actionList: [
                        {
                            name: 'zombie',
                            placeList: ['도서관', '마트'],
                            targetCount: 3
                        }
                    ]
                }
            }
        },
        {
            name: '약/도구 2개를 모아라. 실패시 바리케이드 모두 제거, 1번의 부상',
            condition: {
                itemCardList: ['약', '도구'],
                fail: {
                    actionList: [
                        {
                            name: 'barricade',
                            targetCount: 100
                        },
                        {
                            name: 'wound',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '연료 2개를 모아라. 실패시 사기 2 저하, 1번의 부상',
            condition: {
                itemCardList: ['연료'],
                fail: {
                    actionList: [
                        {
                            name: 'minusMoral',
                            targetCount: 2
                        },
                        {
                            name: 'wound',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '식량 2개를 모아라. 실패시 굶주림 토큰 1개, 사기 1 저하',
            condition: {
                itemCardList: ['식량'],
                fail: {
                    actionList: [
                        {
                            name: 'starving',
                            targetCount: 1
                        },
                        {
                            name: 'minusMoral',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '식량 2개를 모아라. 실패시 굶주림 토큰 1개, 사기 1 저하',
            condition: {
                itemCardList: ['식량'],
                fail: {
                    actionList: [
                        {
                            name: 'starving',
                            targetCount: 1
                        },
                        {
                            name: 'minusMoral',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '도구 2개를 모아라. 실패시 피난기지에 좀비 6구 촐몰, 다른 모든 장소에는 좀비 1구 출몰',
            condition: {
                itemCardList: ['도구'],
                fail: {
                    actionList: [
                        {
                            name: 'zombie',
                            placeList: ['피난기지'],
                            targetCount: 6
                        },
                        {
                            name: 'zombie',
                            placeList: ['병원', '마트', '경찰서', '주유소', '도서관', '학교'],
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '약 2개를 모아라. 실패시 모든 생존자 1번의 부상, 사기 1 저하',
            condition: {
                itemCardList: ['약'],
                fail: {
                    actionList: [
                        {
                            name: 'wound',
                            targetCount: 100
                        },
                        {
                            name: 'minusMoral',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '식량 2개를 모아라. 실패시 사기 2 저하',
            condition: {
                itemCardList: ['식량'],
                fail: {
                    actionList: [
                        {
                            name: 'minusMoral',
                            targetCount: 2
                        }
                    ]
                }
            }
        },
        {
            name: '식량/약 2개를 모아라. 실패시 병원, 주유소에 좀비 3구 출몰',
            condition: {
                itemCardList: ['식량', '약'],
                fail: {
                    actionList: [
                        {
                            name: 'zombie',
                            placeList: ['병원', '주유소'],
                            targetCount: 3
                        }
                    ]
                }
            }
        },
        {
            name: '연료 2개를 모아라. 실패시 모든 바리케이트 제거',
            condition: {
                itemCardList: ['연료'],
                fail: {
                    actionList: [
                        {
                            name: 'barricade',
                            targetCount: 100
                        },
                    ]
                }
            }
        },
        {
            name: '연료 2개를 모아라. 실패시 바리케이트 제거, 1번의 부상, 사기 1 저하',
            condition: {
                itemCardList: ['연료'],
                fail: {
                    actionList: [
                        {
                            name: 'barricade'
                        },
                        {
                            name: 'wound',
                            targetCount: 1
                        },
                        {
                            name: 'minusMoral',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '도구 2개를 모아라. 실패시 피난기지에 좀비 8구 출몰, 사기 1 저하',
            condition: {
                itemCardList: ['도구'],
                fail: {
                    actionList: [
                        {
                            name: 'zombie',
                            placeList: ['피난기지'],
                            targetCount: 8
                        },
                        {
                            name: 'minusMoral',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '약 2개를 모아라. 실패시 사기 2 저하',
            condition: {
                itemCardList: ['약'],
                fail: {
                    actionList: [
                        {
                            name: 'minusMoral',
                            targetCount: 2
                        }
                    ]
                }
            }
        },
        {
            name: '식량 2개를 모아라. 실패시 생존자 2명 죽음, 사기는 저하되지 않습니다.',
            condition: {
                itemCardList: ['식량'],
                fail: {
                    actionList: [
                        {
                            name: 'dead',
                            targetCount: 2
                        }
                    ]
                }
            }
        },
        {
            name: '식량 2개를 모아라. 실패시 생존자 1명 죽음, 사기 1 저하',
            condition: {
                itemCardList: ['식량'],
                fail: {
                    actionList: [
                        {
                            name: 'dead',
                            targetCount: 1
                        },
                        {
                            name: 'minusMoral',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '도구 2개를 모아라. 실패시 피난기지의 식량 3개 제거, 사기 1 저하',
            condition: {
                itemCardList: ['도구'],
                fail: {
                    actionList: [
                        {
                            name: '식량제거',
                            targetCount: 3
                        },
                        {
                            name: 'minusMoral',
                            targetCount: 1
                        }
                    ]
                }
            }
        },
        {
            name: '도구/연료 2개를 모아라. 실패시 학교, 경찰서에 각각 좀비 1구 출몰',
            condition: {
                itemCardList: ['도구', '연료'],
                fail: {
                    actionList: [
                        {
                            name: 'zombie',
                            placeList: ['학교', '경찰서'],
                            targetCount: 1
                        }
                    ]
                }
            }
        }
    ];

    const game = {
        fail: false,
        itemCardAnimationType: 'risk',
        modalClass: '',
        modalType: '',
        actionType: '',
        currentActionIndex: -1,
        goal: '좀비 40구를 잡아라',
        messageList: [],
        zombieIndex: 0,
        entranceZombieIndex: 0,
        campFoodIndex: 0,
        campTrashIndex: 0,
        selectedItemCardFeature: null,
        selectedActionIndex: 0,
        actionTable: [],
        currentPlace: null,
        currentPlaceName: '피난기지',
        currentRiskCard: null,
        riskCard: true,
        dangerDice: false,
        currentSurvivor: null,
        successRiskCardList: [],
        currentPlayer: null,
        canTurn: false,
        canAction: false,
        rollDice: false,
        turn: 0,
        round: 6,
        moral: 6,
        survivorCount: 0,
        deadSurvivorCount: 0,
        deadSurvivorList: [],
        zombieCount: 0,
        zombieTokenCount: 0,
        deadZombieCount: 0,
        deadZombieList: [],
        itemCardCount: 0,
        riskCardList: riskCardList,
        itemCardList: itemCardList,
        initItemCardList: [
            '식량1', '식량1', "식량1", "식량1", "식량1",
            "식량1", "식량1", "식량1", "식량1", "식량1",
            '약',  '약', '약', '약', '약',
            "잡동사니", "잡동사니", "잡동사니", "잡동사니", "잡동사니",
            "연료", "연료", "연료","연료","연료"
        ],
        placeList: placeList,
        survivorList: survivorList,
        playerList: [
            {
                index: 0,
                name: '테드',
                color: '#e3befa',
                survivorList: [],
                itemCardList:[],
                actionDiceList: [],
                actionTable: []
            },
            {
                index: 1,
                name: '다은',
                color: '#FCF3CF  ',
                survivorList: [],
                itemCardList:[],
                actionDiceList: [],
                actionTable: []
            }
        ]
    };

    game.survivorList
        .reduce((group, survivor) => {
            const { ability } = survivor;

            const key = `${ability.type}-${ability.place}`;
            group[key] = group[key] ?? 0;
            group[key]++;

            return group;
        }, {});

    game.survivorList.forEach(survivor => {
        return survivor.woundedCount = 0;
    });

    const { subscribe, set, update } = writable(game);

    let updateAll = () => {};
    let g = game;

    const u2 = (callback) => {
        update(game => {
            g = game;
            callback(game);
            return game;
        });
    };

    const u = (callback) => {
        u2(callback);
        updateAll();
    };


    let gameStore = {
        subscribe,
        set,
        update
    };

    gameStore = {
        ...gameStore,

        minusRound: () => u(game => {
            g.round -= 1;
        }),

        plusMoral: () => u(game => {
            g.moral += 1;
        }),

        minusMoral: () => u(game => {
            if (g.moral > 0) {
                g.moral--;
            }
        }),

        initRiskCard: () => {
            g.riskCardList = g.riskCardList
                .sort(gameStore.random);
        },

        initItemCard: () => {
            g.playerList.forEach(player => {
                player.itemCardList = game.initItemCardList
                    .sort(gameStore.random)
                    .slice(0, 7)
                    .map(name => gameStore.createNewItemCard(name));
            });

            g.placeList.forEach(place => {
                place.itemCardList = place.itemCardList
                    .sort(gameStore.random)
                    .map(name => gameStore.createNewItemCard(name));
            });
        },

        createNewItemCard: (name) => {
            let itemCard = g.itemCardList.find(item => item.name === name);

            return {
                ...itemCard
            };
        },

        getPlayerColorForSurvivor: (survivor) => {
            return g.playerList
                .find(player => player.index === survivor.playerIndex)
                .color;
        },

        initSurvivor: (game) => {
            g.playerList.forEach((player, playerIndex) => {
                g.survivorList
                    .sort(gameStore.random);

                const survivorList = [];

                for (let i = 0; i < 4; i++) {
                    const survivor = g.survivorList.pop();
                    survivor.playerIndex = playerIndex;
                    survivorList.push(survivor);
                }

                survivorList.sort((a, b) => a.index - b.index);

                player.survivorList = survivorList;

                g.survivorList = [...g.survivorList];
            });
        },

        updatePlace: () => {
            g.placeList.forEach(place => {
                if (place.name === '피난기지') {
                    place.trashCount = place.trashList.length;
                }

                place.survivorList.sort((a, b) => a.playerIndex - b.playerIndex);

                const initPlayerSurvivorMap = {};

                g.playerList.forEach(player => {
                    initPlayerSurvivorMap[player.name] = [];
                });

                place.playerSurvivorMap = place.survivorList.reduce((group, survivor) => {
                    const playerName = g.playerList[survivor.playerIndex].name;
                    group[playerName] = group[playerName] ?? [];
                    group[playerName].push(survivor);
                    return group;
                }, initPlayerSurvivorMap);

                [...place.survivorList];

                if (place.name === g.currentPlaceName) {
                    place.activeClassName = 'active';
                } else {
                    place.activeClassName = 'inactive';
                }

                place.currentZombieCount = place.entranceList
                    .map(entrance => entrance.zombieCount)
                    .reduce((a, b) => a + b, 0);

                place.currentZombieList = [];

                for (let i = 0; i < place.currentZombieCount; i++) {
                    place.currentZombieList.push(game.zombieIndex++);
                }

                place.maxZombieCount = place.entranceList
                    .map(entrance => entrance.maxZombieCount)
                    .reduce((a, b) => a + b, 0);

                place.currentBarricadeCount = place.entranceList
                    .map(entrance => entrance.barricadeCount)
                    .reduce((a, b) => a + b, 0);

                place.survivorLocationList = [...Array(place.maxSurvivorCount).keys()]
                    .map(index => {
                        if (place.survivorList.length > index) {
                            return place.survivorList[index];
                        }

                        return null;
                    });
            });
        },

        getCamp: () => {
            return g.placeList.find(place => place.name === '피난기지');
        },

        getSurvivorList: () => {
            return g.playerList.flatMap(player => player.survivorList);
        },

        getCurrentPlayer: () => {
            const playerList = g.playerList;
            return playerList[g.turn % 2];
        },

        getCurrentPlayerColor: () => {
            return gameStore.getCurrentPlayer().color;
        },

        getPlayerColor: (index) => {
            return g.playerList[index].color;
        },

        initCamp: () => {
            const survivorList = gameStore.getSurvivorList();
            const camp = gameStore.getCamp();

            camp.survivorList = survivorList;
            camp.survivorList.forEach(survivor => survivor.place = camp);

            camp.foodList = [...Array(camp.foodCount).keys()]
                .map(index => g.campFoodIndex++);

            camp.trashList = [];
        },

        care: (woundSurvivor) => {
            u(game => {
                g.currentSurvivor.canUseAbility = false;

                if (g.currentActionIndex >= 0) {
                    g.currentPlayer.actionDiceList[g.currentActionIndex].done = true;
                }

                woundSurvivor.wound--;
                g.modalClass = '';
                g.modalType = '';
            });

            alert(`${woundSurvivor.name} 부상토큰 하나가 제거되었습니다.`);
        },

        move: (currentSurvivor, placeName) => {
            u(game => {
                g.modalClass = '';
                g.modalType = '';
                g.actionType = 'move';
                g.placeList.forEach(place => {
                    if (place.name === placeName) {
                        place.survivorList = [...place.survivorList, currentSurvivor];
                    } else {
                        place.survivorList = place.survivorList
                            .filter(survivor => survivor.index !== currentSurvivor.index);
                    }
                });

                g.currentSurvivor = currentSurvivor;
                g.currentSurvivor.place = g.placeList.find(place => place.name === placeName);

                console.log('>>> currentSurvivor', currentSurvivor);
                console.log('>>> g.currentSurvivor', g.currentSurvivor);

                g.currentPlaceName = placeName;

                if (g.currentActionIndex >= 0) {
                    g.currentPlayer.actionDiceList[g.currentActionIndex].done = true;
                }
            });
        },

        changePlaceByName: (currentPlaceName) => {
            if (currentPlaceName === null) {
                return;
            }

            u(game => game.currentPlaceName = currentPlaceName);
        },

        showMessage: (messageList) => {
            u(game => game.messageList = messageList);
        },

        processFood: (messageList) => {
            const camp = gameStore.getCamp();

            if (camp.survivorList.length >= 2) {
                const foodCount = Math.floor(camp.survivorList.length / 2);

                if (foodCount > camp.foodCount) {
                    let starvingTokenCount = 0;
                    let oldMoral = 0;

                    u(game => {
                        oldMoral = g.moral;
                        camp.starvingTokenCount++;
                        starvingTokenCount = camp.starvingTokenCount;
                    });

                    messageList.push(`식량이 부족하여 굶주림 토큰이 추가되었습니다.`);

                    if (starvingTokenCount > 0) {
                        for (let i = 0; i < starvingTokenCount; i++) {
                            gameStore.minusMoral();
                        }

                        let newMoral = 0;

                        u(game => {
                            newMoral = g.moral;
                        });

                        messageList.push(`굶주림 토큰이 ${starvingTokenCount}개가 있어서 사기가 ${oldMoral}에서 ${newMoral}로 하락 하였습니다.`);
                    }
                } else {
                    for (let i = 0; i < foodCount; i++) {
                        u(game => {
                            const camp = gameStore.getCamp();
                            gameStore.removeFood(camp);
                        });
                    }

                    messageList.push(`식량을 ${foodCount}개 소모합니다.`);
                }

                gameStore.showMessage(messageList);
            }
        },

        processTrash: (messageList) => {
            const camp = gameStore.getCamp();

            if (camp.trashList.length < 10) {
                return;
            }

            const minusMoral = Math.floor(camp.trashList.length / 10);
            messageList.push(`쓰레기가 ${camp.trashList.length}에서 ${camp.trashList.length - (minusMoral * 10)}로 줄어들었으며 사기는 ${minusMoral} 하락합니다.`);
            gameStore.showMessage(messageList);

            u(game => {
                for (let i = 0; i < minusMoral; i++) {
                    gameStore.minusMoral(g);
                }

                const currentCamp = gameStore.getCamp();

                for (let i = 0; i < minusMoral * 10; i++) {
                    currentCamp.trashList.pop();
                }
            });
        },

        processRisk: (messageList) => {
            if (g.successRiskCardList.length < 2) {
                messageList.push('위기상황을 해결하지 못하였습니다.');
                gameStore.showMessage(messageList);

                g.currentRiskCard.condition.fail.actionList.forEach(action => {
                    if (action.name === 'minusMoral') {
                        for (let i = 0; i < action.targetCount; i++) {
                            gameStore.minusMoral();
                        }

                        messageList.push(`사기 ${action.targetCount} 하락합니다.`);
                        gameStore.showMessage(messageList);
                    } else if (action.name === 'zombie') {
                        action.placeList
                            .map(placeName => g.placeList
                                .find(place => place.name === placeName))
                            .forEach(place => {
                                gameStore.inviteZombie(place, undefined, action.targetCount);
                                messageList.push(`좀비가 ${place.name}에 ${action.targetCount}구 출몰하였습니다.`);
                                gameStore.showMessage(messageList);
                            });
                    } else if (action.name === 'wound') {
                        const survivorList = g.playerList
                            .flatMap(player => player.survivorList)
                            .sort(gameStore.random);

                        for (let i = 0; i < action.targetCount; i++) {
                            const survivor = survivorList.pop();

                            if (survivor) {
                                u(game => {
                                    g.currentSurvivor = survivor;
                                });

                                gameStore.wound(messageList);
                            }
                        }
                    } else if (action.name === 'barricade') {
                        gameStore.removeAllBarricade(messageList);
                    } else if (action.name === 'dead') {
                        const survivorList = g.playerList
                            .flatMap(player => player.survivorList)
                            .sort(gameStore.random);

                        for (let i = 0; i < action.targetCount; i++) {
                            const survivor = survivorList.pop();

                            u(game => {
                                g.currentSurvivor = survivor;
                            });

                            gameStore.dead(false, messageList);
                        }
                    } else if (action.name === 'food') {
                        for (let i = 0; i < action.targetCount; i++) {
                            u(game => {
                                const camp = gameStore.getCamp();
                                gameStore.removeFood(camp);
                            });
                        }

                        messageList.push(`피난기지의 식량 ${action.targetCount}개가 제거되었습니다.`);
                        gameStore.showMessage(messageList);
                    }
                });
            } else {
                messageList.push('위기상황을 해결하였습니다.');
                gameStore.showMessage(messageList);
            }
        },

        turn: () => {
            u(game => {
                g.currentPlayer.actionTable = [];

                g.survivorList.forEach(survivor => {
                    survivor.actionTable = [];
                });

                g.placeList.forEach(place => {
                    place.survivorList.forEach(survivor => {
                        survivor.actionTable = [];
                        survivor.canUseAbility = true;
                    });
                });

                g.playerList.forEach(player => player.actionDiceList = []);

                g.turn++;
                g.canAction = false;
                g.canTurn = false;
                g.rollDice = true;
            });

            const turn = g.turn;

            if (turn > 0 && turn % 2 === 0) {
                const messageList = [];
                gameStore.processFood(messageList);
                gameStore.processTrash(messageList);
                gameStore.processRisk(messageList);
                gameStore.showZombie(messageList);

                u(game => {
                    g.riskCard = true;
                    g.rollDice = false;
                    g.messageList = messageList;
                });

                gameStore.minusRound();
            }
        },

        removeAllBarricade: (messageList) => {
            u(game => {
                g.placeList
                    .flatMap(place => place.entranceList)
                    .forEach(entrance => {
                        entrance.barricadeCount = 0;
                    });
            });

            messageList.push('바라케이트가 제거되었습니다.');
            gameStore.showMessage(messageList);
        },

        changePlace: (event) => {
            let currentPlaceName = null;

            if (event.keyCode === 49 || event.keyCode === 97) {
                currentPlaceName = '피난기지';
            } else if (event.keyCode === 50 || event.keyCode === 98) {
                currentPlaceName = '경찰서';
            } else if (event.keyCode === 51 || event.keyCode === 99) {
                currentPlaceName = '병원';
            } else if (event.keyCode === 52 || event.keyCode === 100) {
                currentPlaceName = '학교';
            } else if (event.keyCode === 53 || event.keyCode === 101) {
                currentPlaceName = '마트';
            } else if (event.keyCode === 54 || event.keyCode === 102) {
                currentPlaceName = '도서관';
            } else if (event.keyCode === 55 || event.keyCode === 103) {
                currentPlaceName = '주유소';
            } else if (event.keyCode === 56) {
                console.log(g);
            }

            gameStore.changePlaceByName(currentPlaceName);
        },

        init: () => u(game => {
            gameStore.initRiskCard();
            gameStore.initItemCard();
            gameStore.initSurvivor();
            gameStore.initCamp();
        }),

        getPlayerSurvivorList: (game, player) => {
            return game.placeList
                .flatMap(place => place.survivorList)
                .filter(survivor => survivor.playerIndex === player.index);
        },

        updateSurvivor: game => {
            game.playerList.forEach(player => {
                player.survivorList = gameStore.getPlayerSurvivorList(game, player);

                game.placeList
                    .flatMap(place => place.survivorList)
                    .forEach(survivor => {
                        survivor.woundList = [...Array(survivor.wound).keys()];
                        survivor.playerName = game.playerList[survivor.playerIndex].name;
                        survivor.noRollDangerDice = false;
                    });
            });

            game.survivorCount = game.playerList
                .map(player => player.survivorList.length)
                .reduce((a, b) => a + b, 0);

            game.playerList = game.playerList.map(player => {
                player.active = false;
                return player;
            });
        },

        sum: (a, b) => {
            return a + b;
        },

        updateZombie: game => {
            game.zombieCount = game.placeList
                .flatMap(player => player.entranceList)
                .map(entrance => entrance.zombieCount)
                .reduce(gameStore.sum);
        },

        updateItemCard: game => {
            game.itemCardCount = game.playerList
                .map(player => player.itemCardList.length)
                .reduce(gameStore.sum);

            let itemCardIndex = 0;

            game.playerList.forEach(player => {
                player.itemCardList.forEach(itemCard => {
                    itemCard.index = itemCardIndex++;
                });

                game.playerList.forEach(player => {
                    player.itemCardList.forEach(itemCard => {
                        itemCard.canAction = false;
                        itemCard.canPreventRisk = false;
                    });
                });

                game.currentPlayer.itemCardList.forEach((itemCard) => {
                    let placeMatch = true;

                    if (itemCard.placeNameList && itemCard.feature === 'search') {
                        placeMatch = game.currentSurvivor.place.name === itemCard.placeNameList[0];
                    }

                    itemCard.canAction = game.canAction === true &&
                        game.selectedItemCardFeature === itemCard.feature &&
                        placeMatch;
                });

                if (game.currentRiskCard) {
                    game.currentPlayer.itemCardList.forEach((itemCard) => {
                        itemCard.canPreventRisk =
                            game.dangerDice === false &&
                            game.selectedItemCardFeature === null &&
                            game.successRiskCardList.length < 2 &&
                            game.canAction &&
                            game.currentRiskCard.condition.itemCardList
                                .filter(name => name === itemCard.category)
                                .length > 0;
                    });
                }
            });
        },

        updateItemCardTable: game => {
            game.playerList.forEach(player => {
                player.itemCardTable = player.itemCardList
                    .reduce((previousValue, itemCard) => {
                        const row = previousValue.find(value => value.name === itemCard.name);

                        if (row) {
                            row.count++;
                        } else {
                            previousValue.push({
                                name: itemCard.name,
                                description: itemCard.description,
                                category: itemCard.category,
                                count: 1
                            });
                        }

                        return previousValue;
                    }, [])
                    .sort((a, b) => {
                        if (a.name > b.name) {
                            return 1;
                        }

                        if (a.name < b.name) {
                            return -1;
                        }

                        return 0;
                    });
            });
        },

        updateSurvivorCount: () => {
            game.survivorCount = game.placeList
                .map(player => player.survivorList.length)
                .reduce((a, b) => a + b, 0);

            if (game.survivorCount === 0) {
                alert('생존자가 모두 죽었습니다. 실패하였습니다.');
            }
        },

        setDisabled: (value) => {
            if (value === true) {
                return '';
            }

            return 'disabled';
        },

        updateSurvivorActionTable: (game) => {
            const currentPlayer = gameStore.getCurrentPlayer(game);
            const camp = gameStore.getCamp(game);

            currentPlayer.survivorList.forEach(survivor => {
                let currentPlace = survivor.place;

                survivor.actionTable = currentPlayer
                    .actionDiceList.map(dice => {
                        const attackItemList = currentPlayer.itemCardList
                            .filter(itemCard => itemCard.feature === 'attack')
                            .filter(itemCard => currentPlace.maxZombieCount > currentPlace.currentZombieCount + currentPlace.currentBarricadeCount)
                            .filter(itemCard => currentPlace.currentZombieCount > 0);

                        const searchItemList = currentPlayer.itemCardList
                            .filter(itemCard => itemCard.feature === 'search')
                            .filter(itemCard => currentPlace.itemCardList.length > 0)
                            .filter(itemCard => itemCard.placeNameList.filter(placeName => placeName === currentPlace.name).length > 0);

                        const careItemList =  currentPlayer.itemCardList
                            .filter(itemCard => itemCard.feature === 'care')
                            .filter(itemCard => survivor.wound > 0);

                        const foodItemList = currentPlayer.itemCardList
                            .filter(itemCard => itemCard.feature === 'food');

                        const barricadeItemList = currentPlayer.itemCardList
                            .filter(itemCard => itemCard.feature === 'barricade')
                            .filter(itemCard => currentPlace.maxZombieCount > currentPlace.zombieCount + currentPlace.barricadeCount);

                        return {
                            dice: dice,
                            ability: game.selectedItemCardFeature === null &&
                                !dice.done &&
                                !game.dangerDice &&
                                gameStore.canUseAbility(survivor),
                            food: game.selectedItemCardFeature === null &&
                                !dice.done &&
                                !game.dangerDice &&
                                dice.power < 6 &&
                                gameStore.getCamp(game).foodCount > 0,
                            attack: game.selectedItemCardFeature === null &&
                                !dice.done && !game.dangerDice &&
                                dice.power >= survivor.attack  &&
                                currentPlace.currentZombieCount > 0,
                            search: game.selectedItemCardFeature === null &&
                                dice.power >= survivor.search &&
                                !dice.done &&
                                !game.dangerDice &&
                                currentPlace.itemCardList.length > 0,
                            barricade: game.selectedItemCardFeature === null &&
                                !dice.done &&
                                !game.dangerDice &&
                                currentPlace.maxZombieCount > currentPlace.currentZombieCount + currentPlace.currentBarricadeCount,
                            clean: game.selectedItemCardFeature === null &&
                                !dice.done &&
                                !game.dangerDice &&
                                currentPlace.name === '피난기지' &&
                                currentPlace.trashCount > 0,
                            invite: game.selectedItemCardFeature === null &&
                                !dice.done && !game.dangerDice &&
                                currentPlace.maxZombieCount >= currentPlace.currentZombieCount + currentPlace.currentBarricadeCount + 2,
                            move: game.selectedItemCardFeature === null &&
                                !dice.done &&
                                currentPlayer.itemCardList.filter(itemCard => itemCard.feature === 'safeMove'),
                            itemFood: game.selectedItemCardFeature === null &&
                                !dice.done &&
                                !game.dangerDice &&
                                dice.power < 6 &&
                                currentPlayer.itemCardList.filter(itemCard => itemCard.feature === 'power').length > 0,
                            attackItemList,
                            searchItemList,
                            careItemList,
                            foodItemList,
                            barricadeItemList
                        };
                    });

                const attackItemList = currentPlayer.itemCardList
                    .filter(itemCard => itemCard.feature === 'attack')
                    .filter(itemCard => currentPlace.currentZombieCount > 0);

                const searchItemList = currentPlayer.itemCardList
                    .filter(itemCard => itemCard.feature === 'search')
                    .filter(itemCard => currentPlace.itemCardList.length > 0)
                    .filter(itemCard => itemCard.placeNameList.filter(placeName => placeName === currentPlace.name).length > 0);

                const careItemList =  currentPlayer.itemCardList
                    .filter(itemCard => itemCard.feature === 'care')
                    .filter(itemCard => survivor.wound > 0);

                const cleanItemList =  currentPlayer.itemCardList
                    .filter(itemCard => itemCard.feature === 'clean')
                    .filter(itemCard => camp.trashCount > 0);

                const foodItemList = currentPlayer.itemCardList
                    .filter(itemCard => itemCard.feature === 'food');

                const barricadeItemList = currentPlayer.itemCardList
                    .filter(itemCard => itemCard.feature === 'barricade')
                    .filter(itemCard => {
                        return currentPlace.entranceList
                            .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                            .length > 0
                    });

                survivor.actionItemCard = {
                    attack: game.selectedItemCardFeature === null && attackItemList.length > 0,
                    search: game.selectedItemCardFeature === null && searchItemList.length > 0,
                    care: game.selectedItemCardFeature === null && careItemList.length > 0,
                    food: game.selectedItemCardFeature === null && foodItemList.length > 0,
                    barricade: game.selectedItemCardFeature === null && barricadeItemList.length > 0,
                    clean: game.selectedItemCardFeature === null && cleanItemList.length > 0
                };

                survivor.actionItemCard.enabled = Object.values(survivor.actionItemCard)
                    .filter(item => item).length > 0;

                survivor.targetPlaceList = game.placeList
                    .map(place => {
                        return {
                            ...place,
                            disabled: false
                        }
                    })
                    .map(targetPlace => {
                        targetPlace.disabled = game.selectedItemCardFeature != null ||
                            game.dangerDice ||
                            currentPlace.name === targetPlace.name ||
                            targetPlace.survivorList.length >= targetPlace.maxSurvivorCount;

                        return targetPlace;
                    });
            });

            const doneLength = currentPlayer.actionDiceList.filter(dice => dice.done).length;

            if (doneLength !== 0 &&
                doneLength === currentPlayer.actionDiceList.length &&
                game.dangerDice === false) {
                game.canTurn = true;
            }

            game.actionTable = [
                {
                    name: '공격',
                    dice: true,
                    count: currentPlayer.survivorList
                        .filter(survivor => survivor.actionTable.filter(action => action.attack).length > 0)
                        .length
                },
                {
                    name: '검색',
                    dice: true,
                    count: currentPlayer.survivorList
                        .filter(survivor => survivor.actionTable.filter(action => action.search).length > 0)
                        .length
                },
                {
                    name: '바리게이트',
                    dice: true,
                    count: currentPlayer.survivorList
                        .filter(survivor => survivor.actionTable.filter(action => action.barricade).length > 0)
                        .length
                },
                {
                    name: '청소',
                    dice: true,
                    count: currentPlayer.survivorList
                        .filter(survivor => survivor.actionTable.filter(action => action.clean).length > 0)
                        .length
                },
                {
                    name: '유인',
                    dice: true,
                    count: currentPlayer.survivorList
                        .filter(survivor => survivor.actionTable.filter(action => action.invite).length > 0)
                        .length
                },
                {
                    name: '식사',
                    dice: false,
                    count: currentPlayer.survivorList
                        .filter(survivor => survivor.actionTable.filter(action => action.food).length > 0)
                        .length
                }
            ];

            return game;
        },

        isCurrentPlayerOfSurvivor: (currentSurvivor) => {
            return gameStore.getCurrentPlayer()
                .survivorList
                .filter(survivor => survivor.name === currentSurvivor.name)
                .length > 0;
        },

        check: () => {
            if (g.fail === true) {
                return false;
            }

            if (g.moral === 0) {
                alert('사기가 0입니다. 실패하였습니다.');
                return false;
            }

            if (g.round === 0) {
                alert('라운드가 0입니다. 실패하였습니다.');
                return false;
            }

            g.playerList.forEach(player => {
                if (gameStore.getPlayerSurvivorList(g, player).length === 0) {
                    alert(`${player.name}의 생존자가 모두 죽었습니다. 실패하였습니다.`);
                    return false;
                }
            });

            if (g.deadZombieCount === 40) {
                alert('목표를 완수하였습니다.');
                return false;
            }

            return true
        },

        updateAll: () => u2(game => {
            const ok = gameStore.check();

            if (!ok) {
                g.fail = true;
                return;
            }

            g.currentPlayer = g.playerList[game.turn % 2];
            gameStore.updateSurvivorCount(g);
            gameStore.updateItemCardTable(g);
            gameStore.updateSurvivor(g);
            gameStore.updateItemCard(g);
            gameStore.updateZombie(g);
            gameStore.updatePlace();
            gameStore.updateSurvivorActionTable(g);
        }),

        done: (currentSurvivor, actionIndex) => {
            u(game => {
                const currentPlayer = gameStore.getCurrentPlayer();
                currentPlayer.actionDiceList[actionIndex].done = true;
            });
        },

        plusPower: (currentSurvivor, currentPlace, actionIndex) => {
            u(game => {
                const currentPlayer = gameStore.getCurrentPlayer();
                currentPlayer.actionDiceList[actionIndex].power++;
                const camp = gameStore.getCamp();
                gameStore.removeFood(camp, currentSurvivor);
            });
        },

        removeFood: (camp, survivor) => {
            const food = camp.foodList.pop();
            camp.foodList = [...camp.foodList];
            camp.foodCount = camp.foodList.length;

            if (survivor !== undefined) {
                survivor.foodList = [...survivor.foodList, food];
            }
        },

        addFood: (game, camp, targetCount) => {
            for (let i = 0; i < targetCount; i++) {
                camp.foodList.push(game.campFoodIndex++);
            }

            camp.foodCount = camp.foodList.length;
        },

        selectItemCard: (currentPlace, actionIndex) => {
            u(game => {
                g.selectedItemCardFeature = 'power';
                g.selectedActionIndex = actionIndex;
            });
        },

        selectItemCardWithoutDice: (currentPlace, survivor, feature) => {
            u(game => {
                g.currentPlace = currentPlace;
                g.selectedItemCardFeature = feature;
                g.currentSurvivor = survivor;
                g.currentSurvivor.place = currentPlace;
            });
        },

        preventRisk: (currentItemCard) => {
            u(game => {
                g.itemCardAnimationType = 'risk';
                g.currentPlayer.itemCardList = g.currentPlayer.itemCardList
                    .filter(itemCard => itemCard.index !== currentItemCard.index);

                g.successRiskCardList = [...g.successRiskCardList, currentItemCard];
            });
        },

        search: (game, survivor, currentPlace, actionIndex) => {
            if (game === null) {
                u(game => {
                    gameStore.searchInternal(g, survivor, currentPlace, actionIndex);
                });
            } else {
                gameStore.searchInternal(game, survivor, currentPlace, actionIndex);
            }
        },

        addSurvivor: (game, itemCard) => {
            alert(`외부인 ${itemCard.targetCount}명을 피난기지에 합류합니다.`);

            for (let i = 0; i < itemCard.targetCount; i++) {
                const newSurvivor = game.survivorList.pop();
                newSurvivor.playerIndex = game.currentPlayer.index;
                newSurvivor.place = gameStore.getCamp(game);

                game.placeList
                    .find(place => place.name === '피난기지')
                    .survivorList
                    .push(newSurvivor);
            }
        },

        searchInternal: (game, currentSurvivor, currentPlace, actionIndex) => {
            game.itemCardAnimationType = 'get';
            game.currentSurvivor = currentSurvivor;
            game.currentSurvivor.place = currentPlace;

            const newItemCard = currentPlace.itemCardList.pop();

            if (newItemCard.category === '외부인') {
                gameStore.addSurvivor(game, newItemCard);
            } else {
                game.currentPlayer.itemCardList = [newItemCard, ...game.currentPlayer.itemCardList];
            }

            if (actionIndex !== undefined) {
                game.currentPlayer.actionDiceList[actionIndex].done = true;
            }
        },

        setUseAbility: (game, currentSurvivor) => {
            const targetSurvivor = game.placeList.flatMap(place => place.survivorList)
                .find(survivor => survivor.index === currentSurvivor.index);

            targetSurvivor.canUseAbility = false;

            return targetSurvivor;
        },

        useAbility: (currentSurvivor, currentPlace, actionIndex) => {
            console.log('>>> currentSurvivor.ability.type', currentSurvivor.ability.type);

            currentPlace.name;
            currentSurvivor.ability.placeNameList ?? [];
            gameStore.getCurrentPlayer();
            currentSurvivor.noRollDangerDice = true;

            if (currentSurvivor.ability.type === 'killZombie') {
                u(game => {
                    gameStore.killZombieWithGame(currentSurvivor, currentPlace, actionIndex);
                    const targetSurvivor = gameStore.setUseAbility(g, currentSurvivor);
                    targetSurvivor.noRollDangerDice = false;
                });
            } else if (currentSurvivor.ability.type === 'get') {
                u(game => {
                    gameStore.searchInternal(g, currentSurvivor, currentPlace, actionIndex);
                    gameStore.setUseAbility(g, currentSurvivor);
                });
            } else if (currentSurvivor.ability.type === 'move') {
                u(game => {
                    g.modalClass = 'show';
                    g.modalType = 'move';
                    g.currentSurvivor = currentSurvivor;
                    g.currentActionIndex = actionIndex;
                    currentSurvivor.canUseAbility = false;
                });
            } else if (currentSurvivor.ability.type === 'care') {
                u(game => {
                    g.currentSurvivor = currentSurvivor;
                    g.currentPlace = currentPlace;
                    g.modalClass = 'show';
                    g.modalType = 'care';
                    g.currentActionIndex = actionIndex;
                });
            } else if (currentSurvivor.ability.type === 'food') {
                u(game => {
                    const camp = gameStore.getCamp();
                    gameStore.addFood(game, camp, 2);
                    currentSurvivor.canUseAbility = false;
                    g.currentPlayer.actionDiceList[actionIndex].done = true;
                    return g;
                });
            } else if (currentSurvivor.ability.type === 'plusMoral') {
                u(game => {
                    g.currentSurvivor = currentSurvivor;
                    currentSurvivor.canUseAbility = false;
                    g.currentPlayer.actionDiceList[actionIndex].done = true;
                });

                gameStore.dead(false, undefined, currentPlace);
                gameStore.plusMoral();

                alert('사기가 상승하였습니다.');
            } else if (currentSurvivor.ability.type === 'rescue') {
                u(game => {
                    const targetPlace = g.placeList
                        .find(place => place.name === currentPlace.name);

                    let rescued = false;
                    let rescueItemCard = null;

                    targetPlace.itemCardList =
                        targetPlace.itemCardList
                            .filter(itemCard => {
                                if (rescued === false && itemCard.category === '외부인') {
                                    rescueItemCard = itemCard;
                                    rescued = true;
                                    return false;
                                }

                                return true;
                            });

                    gameStore.addSurvivor(g, rescueItemCard);
                    g.currentSurvivor = currentSurvivor;
                    currentSurvivor.canUseAbility = false;
                    g.currentPlayer.actionDiceList[actionIndex].done = true;
                });
            } else if (currentSurvivor.ability.type === 'clean') {
                update(game => {
                    game.currentSurvivor = currentSurvivor;
                    game.currentSurvivor.canUseAbility = false;
                    return game;
                });

                gameStore.clean(5, actionIndex);
            } else if (currentSurvivor.ability.type === 'barricade') {
                update(game => {
                    game.currentSurvivor = currentSurvivor;
                    game.currentSurvivor.canUseAbility = false;
                    return game;
                });

                for (let i = 0; i < 2; i++) {
                    gameStore.createBarricade(currentPlace, actionIndex);
                }
            }
        },

        use:  async (currentItemCard) => {
            u(game => {
                g.currentPlayer.itemCardList = g.currentPlayer.itemCardList
                    .filter(itemCard => itemCard.index !== currentItemCard.index);

                const camp = gameStore.getCamp();

                if (currentItemCard.feature === 'power') {
                    g.currentPlayer.actionDiceList[g.selectedActionIndex].power++;
                } else if (currentItemCard.feature === 'food') {
                    gameStore.addFood(g, camp, currentItemCard.targetCount);
                } else if (currentItemCard.feature === 'clean') {
                    gameStore.clean(4);
                } else if (currentItemCard.feature === 'search') {
                    const currentPlace = g.placeList
                        .find(place => place.name === currentItemCard.placeNameList[0]);

                    gameStore.search(g, g.currentSurvivor, currentPlace);
                } else if (currentItemCard.feature === 'attack') {
                    for (let i = 0; i < currentItemCard.targetCount; i++) {
                        gameStore.killZombieWithGame(g.currentSurvivor, g.currentPlace);
                    }
                } else if (currentItemCard.feature === 'barricade') {
                    gameStore.createBarricade(g.currentPlace);
                } else if (currentItemCard.feature === 'care') {
                    for (let i = 0; i < currentItemCard.targetCount; i++) {
                        g.currentSurvivor.wound--;

                        if (g.currentSurvivor.wound === 0) {
                            break;
                        }
                    }
                }
            });

            u(game => {
                const camp = gameStore.getCamp();
                camp.trashList = [...camp.trashList, currentItemCard];
                camp.trashCount = camp.trashList.length;
                g.campTrashIndex++;

                g.selectedItemCardFeature = null;
                g.currentPlace = null;
            });
        },

        cancel: (currentItemCard) => {
            u(game => {
                g.selectedItemCardFeature = null;
            });
        },

        attack: (currentSurvivor, currentPlace, actionIndex) => {
            u(game => {
                g.actionType = 'attack';
                gameStore.killZombieWithGame(currentSurvivor, currentPlace, actionIndex);
            });
        },

        random: (a, b) => {
            return Math.random() - 0.5;
        },
        
        killZombieWithGame: (currentSurvivor, currentPlace, actionIndex) => {
            g.currentSurvivor = currentSurvivor;
            g.currentSurvivor.place = currentPlace;

            if (currentPlace.currentZombieCount > 0) {
                const currentPlayer = gameStore.getCurrentPlayer(game);

                if (actionIndex !== undefined) {
                    currentPlayer.actionDiceList[actionIndex].done = true;
                }

                const currentEntrance = currentPlace.entranceList
                    .filter(entrance => entrance.zombieCount > 0)
                    .sort(gameStore.random)[0];

                currentEntrance.zombieCount--;
                currentPlace.currentZombieCount--;
                game.deadZombieCount++;
                game.deadZombieList.push(game.deadZombieCount);

                if (currentSurvivor.noRollDangerDice === true) {
                    return;
                }

                if (actionIndex !== undefined) {
                    game.currentSurvivor = currentSurvivor;
                    gameStore.rollDangerActionDice(currentSurvivor, true);
                }
            }
        },

        createBarricade: (currentPlace, actionIndex) => {
            u(game => {
                const currentPlayer = gameStore.getCurrentPlayer(g);

                if (actionIndex !== undefined) {
                    currentPlayer.actionDiceList[actionIndex].done = true;
                }

                const currentEntrance = currentPlace.entranceList
                    .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                    .sort(gameStore.random)[0];

                currentEntrance.barricadeCount++;
            });
        },

        inviteZombie: (currentPlace, actionIndex, zombieCount) => {
            zombieCount = zombieCount || 2;

            u(game => {
                const currentPlayer = gameStore.getCurrentPlayer(game);

                if (actionIndex !== undefined) {
                    currentPlayer.actionDiceList[actionIndex].done = true;
                }

                for (let i = 0; i < zombieCount; i++) {
                    const entranceList = currentPlace.entranceList
                        .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                        .sort(gameStore.random);

                    if (entranceList.length > 0) {
                        const currentEntrance = entranceList[0];

                        currentEntrance.zombieCount += 1;
                        currentEntrance.zombieList.push(g.entranceZombieIndex++);
                    }
                }
            });
        },

        showZombie: (messageList) => {
            let showZombieCount = 0;

            u(game => {
                g.placeList.forEach(place => {
                    const zombieCount = place.survivorList.length;

                    if (zombieCount > 0) {
                        if (showZombieCount === 0) {
                            messageList.push('라운드가 종료될때 마다 좀비가 타나납니다.');
                            showZombieCount++;
                        }

                        const message = `좀비가 ${place.name}에 ${zombieCount}구가 출몰하였습니다.`;
                        messageList.push(message);

                        for (let i = 0; i < zombieCount; i++) {
                            const currentEntrance = place.entranceList
                                .sort(gameStore.random)[0];

                            currentEntrance.zombieCount++;
                            let currentZombieCount = currentEntrance.zombieCount;

                            if (currentEntrance.maxZombieCount < currentEntrance.zombieCount + currentEntrance.barricadeCount) {
                                if (currentEntrance.barricadeCount > 0) {
                                    currentEntrance.barricadeCount--;

                                    const message = `${place.name}에 바리케이트가 제거되었습니다.`;
                                    messageList.push(message);
                                } else {
                                    currentEntrance.zombieCount--;

                                    if (place.survivorList.length > 0) {
                                        const randomIndex = Math.floor(Math.random() * place.survivorList.length);
                                        g.currentSurvivor = place.survivorList[randomIndex];
                                        gameStore.dead(true, messageList, place);
                                    }
                                }
                            }

                            if (currentZombieCount > currentEntrance.zombieCount ) {
                                currentEntrance.zombieList.push(game.entranceZombieIndex++);
                            }
                        }
                    }
                });
            });
        },

        clean: (trashCount, actionIndex) => {
            u(game => {
                const camp = gameStore.getCamp(g);

                for (let i = 0; i < trashCount; i++) {
                    camp.trashList.pop();
                    camp.trashCount = camp.trashList.length;

                    if (camp.trashCount === 0) {
                        break;
                    }
                }

                if (actionIndex !== undefined) {
                    g.playerList[g.turn % 2].actionDiceList[actionIndex].done = true;
                }
            });
        },

        choiceRiskCard: () => {
            u(game => {
                g.successRiskCardList = [];
                g.currentRiskCard = g.riskCardList.pop();
                g.riskCardList = [...g.riskCardList, g.currentRiskCard];

                gameStore.initRiskCard();

                g.riskCard = false;
                game.rollDice = true;
            });
        },

        rollActionDice: () => {
            u(game => {
                game.messageList = [];
            });

            u(game => {
                const player = gameStore.getCurrentPlayer(g);

                player.actionDiceList = [...Array(player.survivorList.length + 1).keys()]
                    .map(i => {
                        return {
                            power: 1 + Math.floor(Math.random() * 6),
                            done: false
                        };
                    })
                    .sort((a, b) => b.power - a.power);

                g.rollDice = false;
                g.canAction = true;
                g.canTurn = false;
            });
        },

        dead: (minusMoral, messageList, currentPlace) => {
            let oldMoral = 0;
            let newMoral = 0;
            let currentSurvivorName = '';

            u(game => {
                g.deadSurvivorCount++;
                g.deadSurvivorList.push(g.currentSurvivor);

                g.placeList
                    .filter(place => {
                        if (currentPlace === undefined) {
                            return true;
                        }

                        return place.name === currentPlace.name;
                    })
                    .forEach(place => {
                        place.survivorList = place.survivorList
                            .filter(survivor => survivor !== game.currentSurvivor);
                    });

                minusMoral = minusMoral && game.moral > 0;

                if (minusMoral === true) {
                    oldMoral = game.moral;
                    game.moral--;
                    newMoral = game.moral;
                }

                currentSurvivorName = game.currentSurvivor.name;
                g.currentSurvivor = null;
            });

            const message = `${currentPlace.name}에 있던 ${currentSurvivorName} 생존자가 죽었습니다.`;

            if (messageList !== undefined) {
                messageList.push(message);
                gameStore.showMessage(messageList);
            } else {
                alert(message);
            }

            if (minusMoral === true) {
                const message = `사기가 ${oldMoral}에서 ${newMoral}로 떨어졌습니다.`;

                if (messageList !== undefined) {
                    messageList.push(message);
                    gameStore.showMessage(messageList);
                } else {
                    alert(message);
                }
            }
        },

        wound: (messageList) => {
            u(game => {
                g.currentSurvivor.wound++;

                const message = `${g.currentSurvivor.name} 부상을 입었습니다.`;

                if (messageList !== undefined) {
                    messageList.push(message);
                    gameStore.showMessage(messageList);
                } else {
                    alert(message);
                }

                if (g.currentSurvivor.wound >= 3) {
                    const message = `${g.currentSurvivor.name} 부상을 3차례 입었습니다.'`;

                    if (messageList !== undefined) {
                        messageList.push(message);
                        gameStore.showMessage(messageList);
                    } else {
                        alert(message);
                    }

                    gameStore.dead(true);
                }

                g.currentSurvivor = null;
            });
        },

        rollDangerActionDice: (survivor, killZombie) => {
            const currentSurvivor = get_store_value(gameStore).currentSurvivor;

            if (currentSurvivor === null || survivor == null ||
                currentSurvivor.name !== survivor.name) {
                return;
            }

            const currentActionIndex = get_store_value(gameStore).currentActionIndex;

            if (currentActionIndex >= 0) {
                u(game => {
                    g.currentActionIndex = -1;
                });

                return;
            }

            const saveMoveCount = get_store_value(gameStore).currentPlayer.itemCardList
                .filter(itemCard => itemCard.feature === 'safeMove')
                .length;

            let rollDangerDice = true;

            if (killZombie === undefined && saveMoveCount > 0) {
                rollDangerDice = !confirm(`연료 아이템이 ${saveMoveCount}개가 있으며 하나를 사용하여 위험노출 주사위를 굴리지 않고 이동할까요?`);
            }

            if (!rollDangerDice) {
                u(game => {
                    let use = false;

                    g.playerList
                        .filter(player => player.index === g.currentPlayer.index)
                        .forEach(player => {
                            player.itemCardList = player.itemCardList
                                .filter(itemCard => {
                                    if (use === false && itemCard.feature === 'safeMove') {
                                        use = true;
                                        return false;
                                    }

                                    return true;
                                });
                        });
                });

                return;
            }

            alert('위험노출 주사위를 던집니다.');

            u(game => {
                const dangerDice = ['', '', '', '', '', '', '부상', '부상', '부상', '부상', '부상', '연쇄물림'];
                const result = dangerDice.sort(gameStore.random).pop();

                if (result === '') {
                    alert('아무런 일이 일어나지 않았습니다.');
                } else if (result === '부상') {
                    alert('부상을 당하였습니다.');
                    gameStore.wound();
                } else if (result === '연쇄물림') {
                    alert('연쇄물림이 발생하였습니다.');

                    const currentPlace = currentSurvivor.place;

                    gameStore.dead(true);

                    currentPlace.survivorList.forEach(survivor => {
                        g.currentSurvivor = survivor;
                        gameStore.wound();
                    });
                }

                g.dangerDice = false;
            });
        },

        canUseAbility: (survivor) => {
            const currentPlace = survivor.place;
            const currentPlaceName = currentPlace.name;
            const placeNameList = survivor.ability.placeNameList ?? [];
            const currentPlayer = gameStore.getCurrentPlayer();

            if (survivor.canUseAbility === false) {
                return false;
            }

            if (survivor.ability.type === 'killZombie') {
                if (placeNameList.find(name => name === currentPlaceName)) {
                    return survivor.canUseAbility === true &&
                        currentPlace.currentZombieCount > 0;
                }

                return false;
            } else if (survivor.ability.type === 'get') {
                if (placeNameList.find(name => name === currentPlaceName)) {
                    return currentPlace.itemCardList.length > 0;
                }

                return false;
            } else if (survivor.ability.type === 'plusPower') {
                if (currentPlayer.actionTable) {
                    return currentPlayer.actionDiceList
                        .filter(dice => dice.power <= 5)
                        .filter(dice => dice.done === false).length > 0;
                }

                return false;
            } else if (survivor.ability.type === 'move') {
                return get_store_value(gameStore).placeList
                    .filter(place => place.name !== survivor.place.name)
                    .filter(place => place.maxSurvivorCount > place.survivorList.length)
                    .length > 0
            } else if (survivor.ability.type === 'care') {
                return currentPlace.survivorList
                    .filter(survivor => survivor.wound > 0)
                    .length > 0;
            } else if (survivor.ability.type === 'food') {
                return true;
            } else if (survivor.ability.type === 'plusMoral') {
                return true;
            } else if (survivor.ability.type === 'rescue') {
                return currentPlace.itemCardList
                    .filter(item => item.name.startsWith("외부인")).length > 0;
            } else if (survivor.ability.type === 'clean') {
                return true;
            } else if (survivor.ability.type === 'barricade') {
                return currentPlace.maxZombieCount >
                    currentPlace.currentZombieCount + currentPlace.currentBarricadeCount;
            }
        },

        getPlaceClassName: (currentPlace) => {
            if (currentPlace.name === get_store_value(gameStore).currentPlaceName) {
                return "current-place";
            }

            return '';
        }
    };

    updateAll = gameStore.updateAll;

    gameStore.init();

    var gameStore$1 = gameStore;

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    const itemCardCrossfade = crossfade({});
    const placeItemCardCrossfade = crossfade({});
    const foodCrossfade = crossfade({});
    const trashCrossfade = crossfade({});
    const deadSurvivorCrossfade = crossfade({});
    const deadZombieCrossfade = crossfade({});

    /* src\Player.svelte generated by Svelte v3.46.4 */

    const file$4 = "src\\Player.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (68:24) {#if itemCard.canPreventRisk == true}
    function create_if_block_1$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*itemCard*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "위기사항처리";
    			attr_dev(button, "class", "card-action-dice-button");
    			add_location(button, file$4, 68, 28, 2805);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(68:24) {#if itemCard.canPreventRisk == true}",
    		ctx
    	});

    	return block;
    }

    // (73:24) {#if itemCard.canAction == true}
    function create_if_block$3(ctx) {
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[11](/*itemCard*/ ctx[21]);
    	}

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[12](/*itemCard*/ ctx[21]);
    	}

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			button0.textContent = "사용";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "취소";
    			attr_dev(button0, "class", "none-action-dice-button");
    			add_location(button0, file$4, 73, 28, 3065);
    			attr_dev(button1, "class", "none-action-dice-button");
    			add_location(button1, file$4, 75, 28, 3222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_1, false, false, false),
    					listen_dev(button1, "click", click_handler_2, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(73:24) {#if itemCard.canAction == true}",
    		ctx
    	});

    	return block;
    }

    // (54:8) {#each itemCardList as itemCard (itemCard)}
    function create_each_block$4(key_1, ctx) {
    	let table;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t2_value = /*itemCard*/ ctx[21].name + "";
    	let t2;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t6_value = /*itemCard*/ ctx[21].category + "";
    	let t6;
    	let t7;
    	let tr1;
    	let td4;
    	let t8_value = /*itemCard*/ ctx[21].description + "";
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let table_intro;
    	let table_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	let if_block0 = /*itemCard*/ ctx[21].canPreventRisk == true && create_if_block_1$3(ctx);
    	let if_block1 = /*itemCard*/ ctx[21].canAction == true && create_if_block$3(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "이름";
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "유형";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			tr1 = element("tr");
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			if (if_block0) if_block0.c();
    			t10 = space();
    			if (if_block1) if_block1.c();
    			t11 = space();
    			attr_dev(td0, "class", "active");
    			add_location(td0, file$4, 60, 20, 2422);
    			attr_dev(td1, "class", "active");
    			add_location(td1, file$4, 61, 20, 2470);
    			attr_dev(td2, "class", "active");
    			add_location(td2, file$4, 62, 20, 2531);
    			add_location(td3, file$4, 63, 20, 2579);
    			add_location(tr0, file$4, 59, 16, 2396);
    			attr_dev(td4, "colspan", "4");
    			add_location(td4, file$4, 66, 20, 2674);
    			add_location(tr1, file$4, 65, 16, 2648);
    			attr_dev(table, "class", "game-table box");
    			set_style(table, "width", "190px");
    			set_style(table, "margin", "5px");
    			add_location(table, file$4, 54, 12, 2166);
    			this.first = table;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(td1, t2);
    			append_dev(tr0, t3);
    			append_dev(tr0, td2);
    			append_dev(tr0, t5);
    			append_dev(tr0, td3);
    			append_dev(td3, t6);
    			append_dev(table, t7);
    			append_dev(table, tr1);
    			append_dev(tr1, td4);
    			append_dev(td4, t8);
    			append_dev(td4, t9);
    			if (if_block0) if_block0.m(td4, null);
    			append_dev(td4, t10);
    			if (if_block1) if_block1.m(td4, null);
    			append_dev(table, t11);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*itemCardList*/ 4) && t2_value !== (t2_value = /*itemCard*/ ctx[21].name + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*itemCardList*/ 4) && t6_value !== (t6_value = /*itemCard*/ ctx[21].category + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*itemCardList*/ 4) && t8_value !== (t8_value = /*itemCard*/ ctx[21].description + "")) set_data_dev(t8, t8_value);

    			if (/*itemCard*/ ctx[21].canPreventRisk == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(td4, t10);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*itemCard*/ ctx[21].canAction == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(td4, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		r: function measure() {
    			rect = table.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(table);
    			stop_animation();
    			add_transform(table, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(table, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (table_outro) table_outro.end(1);
    				table_intro = create_in_transition(table, /*receive*/ ctx[4], { key: /*itemCard*/ ctx[21] });
    				table_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (table_intro) table_intro.invalidate();
    			table_outro = create_out_transition(table, /*send*/ ctx[3], { key: /*itemCard*/ ctx[21] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching && table_outro) table_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(54:8) {#each itemCardList as itemCard (itemCard)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div4;
    	let div2;
    	let div0;
    	let t0_value = /*player*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3_value = /*player*/ ctx[0].itemCardList.length + "";
    	let t3;
    	let t4;
    	let t5_value = /*player*/ ctx[0].survivorList.length + "";
    	let t5;
    	let t6;
    	let div3;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*itemCardList*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*itemCard*/ ctx[21];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text("아이템 카드 : ");
    			t3 = text(t3_value);
    			t4 = text(", 생존자 : ");
    			t5 = text(t5_value);
    			t6 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div0, "padding", "5px 10px");
    			set_style(div0, "border-radius", "10px");
    			set_style(div0, "border", "1px solid darkgray");
    			set_style(div0, "text-align", "center");
    			add_location(div0, file$4, 49, 8, 1823);
    			set_style(div1, "margin-top", "5px");
    			add_location(div1, file$4, 50, 8, 1947);
    			set_style(div2, "display", "flex");
    			set_style(div2, "flex-direction", "column");
    			set_style(div2, "padding", "10px 5px");
    			add_location(div2, file$4, 48, 4, 1747);
    			set_style(div3, "height", "100vh");
    			add_location(div3, file$4, 52, 4, 2073);
    			attr_dev(div4, "class", "flex-column player-card-list-section");

    			set_style(div4, "background-color", /*currentPlayer*/ ctx[1].index === /*player*/ ctx[0].index
    			? gameStore$1.getCurrentPlayerColor()
    			: 'white');

    			add_location(div4, file$4, 46, 0, 1574);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div4, t6);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*player*/ 1) && t0_value !== (t0_value = /*player*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*player*/ 1) && t3_value !== (t3_value = /*player*/ ctx[0].itemCardList.length + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*player*/ 1) && t5_value !== (t5_value = /*player*/ ctx[0].survivorList.length + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*itemCardList, gameStore*/ 4) {
    				each_value = /*itemCardList*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div3, fix_and_outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}

    			if (!current || dirty & /*currentPlayer, player*/ 3) {
    				set_style(div4, "background-color", /*currentPlayer*/ ctx[1].index === /*player*/ ctx[0].index
    				? gameStore$1.getCurrentPlayerColor()
    				: 'white');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $gameStore;
    	validate_store(gameStore$1, 'gameStore');
    	component_subscribe($$self, gameStore$1, $$value => $$invalidate(9, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Player', slots, []);
    	const [itemCardSend, itemCardReceive] = itemCardCrossfade;
    	const [placeItemCardSend, placeItemCardReceive] = placeItemCardCrossfade;
    	const [trashSend, trashReceive] = trashCrossfade;
    	let { playerIndex } = $$props;
    	let player;
    	let playerList;
    	let currentPlayer;
    	let survivorList;
    	let itemCardTable;
    	let itemCardList;
    	let selectedItemCardFeature;
    	let itemCardAnimationType;
    	let send = itemCardSend;
    	let receive = itemCardReceive;
    	const writable_props = ['playerIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	const click_handler = itemCard => gameStore$1.preventRisk(itemCard);
    	const click_handler_1 = itemCard => gameStore$1.use(itemCard);
    	const click_handler_2 = itemCard => gameStore$1.cancel(itemCard);

    	$$self.$$set = $$props => {
    		if ('playerIndex' in $$props) $$invalidate(5, playerIndex = $$props.playerIndex);
    	};

    	$$self.$capture_state = () => ({
    		gameStore: gameStore$1,
    		flip,
    		itemCardCrossfade,
    		trashCrossfade,
    		placeItemCardCrossfade,
    		itemCardSend,
    		itemCardReceive,
    		placeItemCardSend,
    		placeItemCardReceive,
    		trashSend,
    		trashReceive,
    		playerIndex,
    		player,
    		playerList,
    		currentPlayer,
    		survivorList,
    		itemCardTable,
    		itemCardList,
    		selectedItemCardFeature,
    		itemCardAnimationType,
    		send,
    		receive,
    		$gameStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('playerIndex' in $$props) $$invalidate(5, playerIndex = $$props.playerIndex);
    		if ('player' in $$props) $$invalidate(0, player = $$props.player);
    		if ('playerList' in $$props) $$invalidate(6, playerList = $$props.playerList);
    		if ('currentPlayer' in $$props) $$invalidate(1, currentPlayer = $$props.currentPlayer);
    		if ('survivorList' in $$props) survivorList = $$props.survivorList;
    		if ('itemCardTable' in $$props) itemCardTable = $$props.itemCardTable;
    		if ('itemCardList' in $$props) $$invalidate(2, itemCardList = $$props.itemCardList);
    		if ('selectedItemCardFeature' in $$props) $$invalidate(7, selectedItemCardFeature = $$props.selectedItemCardFeature);
    		if ('itemCardAnimationType' in $$props) $$invalidate(8, itemCardAnimationType = $$props.itemCardAnimationType);
    		if ('send' in $$props) $$invalidate(3, send = $$props.send);
    		if ('receive' in $$props) $$invalidate(4, receive = $$props.receive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$gameStore, playerList, playerIndex, player, selectedItemCardFeature, itemCardAnimationType*/ 993) {
    			{
    				$$invalidate(6, playerList = $gameStore.playerList);
    				$$invalidate(8, itemCardAnimationType = $gameStore.itemCardAnimationType);
    				$$invalidate(1, currentPlayer = $gameStore.currentPlayer);
    				$$invalidate(7, selectedItemCardFeature = $gameStore.selectedItemCardFeature);
    				$$invalidate(0, player = playerList[playerIndex]);
    				survivorList = player.survivorList;
    				itemCardTable = player.itemCardTable;
    				$$invalidate(2, itemCardList = player.itemCardList);

    				if (selectedItemCardFeature != null) {
    					$$invalidate(3, send = trashSend);
    					$$invalidate(4, receive = trashReceive);
    				} else {
    					if (itemCardAnimationType === 'risk') {
    						$$invalidate(3, send = itemCardSend);
    						$$invalidate(4, receive = itemCardReceive);
    					} else if (itemCardAnimationType === 'get') {
    						$$invalidate(3, send = placeItemCardSend);
    						$$invalidate(4, receive = placeItemCardReceive);
    					}
    				}
    			}
    		}
    	};

    	return [
    		player,
    		currentPlayer,
    		itemCardList,
    		send,
    		receive,
    		playerIndex,
    		playerList,
    		selectedItemCardFeature,
    		itemCardAnimationType,
    		$gameStore,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { playerIndex: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*playerIndex*/ ctx[5] === undefined && !('playerIndex' in props)) {
    			console.warn("<Player> was created without expected prop 'playerIndex'");
    		}
    	}

    	get playerIndex() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playerIndex(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Place.svelte generated by Svelte v3.46.4 */

    const file$3 = "src\\Place.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	child_ctx[40] = i;
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	child_ctx[43] = i;
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[47] = list[i];
    	child_ctx[40] = i;
    	return child_ctx;
    }

    function get_each_context_4$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[49] = list[i];
    	child_ctx[51] = i;
    	return child_ctx;
    }

    function get_each_context_5$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	child_ctx[54] = i;
    	return child_ctx;
    }

    function get_each_context_6$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[55] = list[i];
    	child_ctx[57] = i;
    	return child_ctx;
    }

    function get_each_context_7$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[58] = list[i];
    	return child_ctx;
    }

    function get_each_context_8$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[61] = list[i];
    	return child_ctx;
    }

    function get_each_context_9$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[64] = list[i];
    	return child_ctx;
    }

    // (40:8) {#each itemCardList as itemCard (itemCard)}
    function create_each_block_9$1(key_1, ctx) {
    	let div;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", "1px");
    			set_style(div, "height", "1px");
    			add_location(div, file$3, 40, 12, 1436);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_9$1.name,
    		type: "each",
    		source: "(40:8) {#each itemCardList as itemCard (itemCard)}",
    		ctx
    	});

    	return block;
    }

    // (62:40) {#each deadSurvivorList as surviror (surviror)}
    function create_each_block_8$1(key_1, ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_intro;
    	let div1_outro;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			set_style(div0, "width", "5px");
    			set_style(div0, "height", "5px");
    			set_style(div0, "background-color", "lightgreen");
    			set_style(div0, "border", "1px solid greenyellow");
    			add_location(div0, file$3, 64, 48, 2896);
    			add_location(div1, file$3, 62, 44, 2711);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, /*deadSurvivorReceive*/ ctx[8], { key: /*surviror*/ ctx[61] });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, /*deadSurvivorSend*/ ctx[7], { key: /*surviror*/ ctx[61] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8$1.name,
    		type: "each",
    		source: "(62:40) {#each deadSurvivorList as surviror (surviror)}",
    		ctx
    	});

    	return block;
    }

    // (78:40) {#each deadZombieList as deadZombie (deadZombie)}
    function create_each_block_7$1(key_1, ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_intro;
    	let div1_outro;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			set_style(div0, "width", "5px");
    			set_style(div0, "height", "5px");
    			set_style(div0, "background-color", "lightsalmon");
    			set_style(div0, "border", "1px solid red");
    			add_location(div0, file$3, 80, 48, 4034);
    			add_location(div1, file$3, 78, 44, 3849);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, /*deadZombieReceive*/ ctx[10], { key: /*deadZombie*/ ctx[58] });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, /*deadZombieSend*/ ctx[9], { key: /*deadZombie*/ ctx[58] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7$1.name,
    		type: "each",
    		source: "(78:40) {#each deadZombieList as deadZombie (deadZombie)}",
    		ctx
    	});

    	return block;
    }

    // (120:175) 
    function create_if_block_6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", "100%");
    			set_style(div, "height", "100%");
    			set_style(div, "background-color", "lightgray");
    			add_location(div, file$3, 120, 40, 6639);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(120:175) ",
    		ctx
    	});

    	return block;
    }

    // (116:36) {#if zombieIndex < currentPlace.entranceList[entranceIndex].zombieCount}
    function create_if_block_5(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", "100%");
    			set_style(div, "height", "100%");
    			set_style(div, "background-color", "darkred");
    			add_location(div, file$3, 116, 40, 6072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				div_intro = create_in_transition(div, /*deadZombieReceive*/ ctx[10], {
    					key: /*currentPlace*/ ctx[0].entranceList[/*entranceIndex*/ ctx[54]].zombieList[/*zombieIndex*/ ctx[57]]
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, /*deadZombieSend*/ ctx[9], {
    				key: /*currentPlace*/ ctx[0].entranceList[/*entranceIndex*/ ctx[54]].zombieList[/*zombieIndex*/ ctx[57]]
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(116:36) {#if zombieIndex < currentPlace.entranceList[entranceIndex].zombieCount}",
    		ctx
    	});

    	return block;
    }

    // (114:28) {#each Array(currentPlace.entranceList[entranceIndex].maxZombieCount) as _, zombieIndex}
    function create_each_block_6$1(ctx) {
    	let td;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_5, create_if_block_6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*zombieIndex*/ ctx[57] < /*currentPlace*/ ctx[0].entranceList[/*entranceIndex*/ ctx[54]].zombieCount) return 0;
    		if (/*currentPlace*/ ctx[0].entranceList[/*entranceIndex*/ ctx[54]].maxZombieCount - /*zombieIndex*/ ctx[57] <= /*currentPlace*/ ctx[0].entranceList[/*entranceIndex*/ ctx[54]].barricadeCount) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(td, "class", "zombie-position");
    			add_location(td, file$3, 114, 32, 5892);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(td, null);
    			}

    			append_dev(td, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(td, t);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6$1.name,
    		type: "each",
    		source: "(114:28) {#each Array(currentPlace.entranceList[entranceIndex].maxZombieCount) as _, zombieIndex}",
    		ctx
    	});

    	return block;
    }

    // (111:16) {#each currentPlace.entranceList as entrance, entranceIndex}
    function create_each_block_5$2(ctx) {
    	let table;
    	let tr;
    	let t;
    	let current;
    	let each_value_6 = Array(/*currentPlace*/ ctx[0].entranceList[/*entranceIndex*/ ctx[54]].maxZombieCount);
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6$1(get_each_context_6$1(ctx, each_value_6, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(tr, file$3, 112, 24, 5736);
    			attr_dev(table, "class", "game-table zombie-line");
    			add_location(table, file$3, 111, 20, 5672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(table, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPlace*/ 1) {
    				each_value_6 = Array(/*currentPlace*/ ctx[0].entranceList[/*entranceIndex*/ ctx[54]].maxZombieCount);
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6$1(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_6$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_6.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_6.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$2.name,
    		type: "each",
    		source: "(111:16) {#each currentPlace.entranceList as entrance, entranceIndex}",
    		ctx
    	});

    	return block;
    }

    // (138:20) {#if survivor}
    function create_if_block$2(ctx) {
    	let table1;
    	let tr1;
    	let td0;
    	let img;
    	let img_src_value;
    	let t0;
    	let td9;
    	let div5;
    	let div1;
    	let span;
    	let t1_value = /*survivor*/ ctx[38].playerName + "";
    	let t1;
    	let t2;
    	let div0;
    	let t3_value = /*survivor*/ ctx[38].name + "";
    	let t3;
    	let t4;
    	let table0;
    	let tr0;
    	let td1;
    	let t6;
    	let td2;
    	let t7_value = /*survivor*/ ctx[38].power + "";
    	let t7;
    	let t8;
    	let td3;
    	let t10;
    	let td4;
    	let t11_value = /*survivor*/ ctx[38].attack + "";
    	let t11;
    	let t12;
    	let td5;
    	let t14;
    	let td6;
    	let t15_value = /*survivor*/ ctx[38].search + "";
    	let t15;
    	let t16;
    	let td7;
    	let t18;
    	let td8;
    	let div3;
    	let div2;
    	let t19_value = /*survivor*/ ctx[38].wound + "";
    	let t19;
    	let t20;
    	let t21;
    	let div4;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let t22;
    	let tr2;
    	let td10;
    	let t23_value = /*survivor*/ ctx[38].job + "";
    	let t23;
    	let t24;
    	let t25_value = /*survivor*/ ctx[38].ability.name + "";
    	let t25;
    	let t26;
    	let t27;
    	let show_if = /*survivor*/ ctx[38].actionTable.length > 0 && gameStore$1.isCurrentPlayerOfSurvivor(/*survivor*/ ctx[38]) == true;
    	let t28;
    	let current;
    	let each_value_4 = /*survivor*/ ctx[38].woundList;
    	validate_each_argument(each_value_4);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_1[i] = create_each_block_4$2(get_each_context_4$2(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*survivor*/ ctx[38].foodList;
    	validate_each_argument(each_value_3);
    	const get_key = ctx => /*food*/ ctx[47];
    	validate_each_keys(ctx, each_value_3, get_each_context_3$2, get_key);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3$2(ctx, each_value_3, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block_3$2(key, child_ctx));
    	}

    	let if_block0 = /*survivor*/ ctx[38].canUseAbility == false && create_if_block_4(ctx);
    	let if_block1 = show_if && create_if_block_3(ctx);
    	let if_block2 = /*survivor*/ ctx[38].actionTable.length > 0 && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			table1 = element("table");
    			tr1 = element("tr");
    			td0 = element("td");
    			img = element("img");
    			t0 = space();
    			td9 = element("td");
    			div5 = element("div");
    			div1 = element("div");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			div0 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			table0 = element("table");
    			tr0 = element("tr");
    			td1 = element("td");
    			td1.textContent = "파워";
    			t6 = space();
    			td2 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td3 = element("td");
    			td3.textContent = "공격";
    			t10 = space();
    			td4 = element("td");
    			t11 = text(t11_value);
    			t12 = space();
    			td5 = element("td");
    			td5.textContent = "검색";
    			t14 = space();
    			td6 = element("td");
    			t15 = text(t15_value);
    			t16 = space();
    			td7 = element("td");
    			td7.textContent = "부상";
    			t18 = space();
    			td8 = element("td");
    			div3 = element("div");
    			div2 = element("div");
    			t19 = text(t19_value);
    			t20 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t21 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t22 = space();
    			tr2 = element("tr");
    			td10 = element("td");
    			t23 = text(t23_value);
    			t24 = text(" : ");
    			t25 = text(t25_value);
    			t26 = space();
    			if (if_block0) if_block0.c();
    			t27 = space();
    			if (if_block1) if_block1.c();
    			t28 = space();
    			if (if_block2) if_block2.c();
    			if (!src_url_equal(img.src, img_src_value = "image/" + /*survivor*/ ctx[38].index + ".png")) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "60px");
    			set_style(img, "height", "60px");
    			add_location(img, file$3, 141, 36, 7656);
    			attr_dev(td0, "rowspan", "2");
    			set_style(td0, "width", "40px");
    			attr_dev(td0, "valign", "top");
    			add_location(td0, file$3, 140, 32, 7569);
    			set_style(span, "padding", "2px 10px");
    			set_style(span, "border-radius", "10px");
    			set_style(span, "border", "1px solid darkgray");
    			add_location(span, file$3, 146, 44, 8078);
    			set_style(div0, "display", "inline-block");
    			set_style(div0, "margin-left", "4px");
    			add_location(div0, file$3, 147, 44, 8229);
    			set_style(div1, "display", "flex");
    			set_style(div1, "align-items", "center");
    			add_location(div1, file$3, 145, 40, 7983);
    			add_location(td1, file$3, 151, 48, 8543);
    			add_location(td2, file$3, 152, 48, 8604);
    			add_location(td3, file$3, 153, 48, 8679);
    			add_location(td4, file$3, 154, 48, 8740);
    			add_location(td5, file$3, 155, 48, 8816);
    			add_location(td6, file$3, 156, 48, 8877);
    			add_location(td7, file$3, 157, 48, 8953);
    			add_location(div2, file$3, 160, 56, 9202);
    			set_style(div3, "display", "flex");
    			set_style(div3, "align-items", "center");
    			set_style(div3, "justify-content", "center");
    			add_location(div3, file$3, 159, 52, 9072);
    			add_location(td8, file$3, 158, 48, 9014);
    			add_location(tr0, file$3, 150, 44, 8489);
    			attr_dev(table0, "class", "game-table");
    			set_style(table0, "margin-left", "5px");
    			add_location(table0, file$3, 149, 40, 8392);
    			set_style(div4, "display", "flex");
    			add_location(div4, file$3, 168, 40, 9831);
    			set_style(div5, "display", "flex");
    			add_location(div5, file$3, 144, 36, 7915);
    			set_style(td9, "background-color", gameStore$1.getPlayerColorForSurvivor(/*survivor*/ ctx[38]));
    			add_location(td9, file$3, 143, 32, 7799);
    			add_location(tr1, file$3, 139, 28, 7531);
    			add_location(td10, file$3, 181, 32, 10698);
    			add_location(tr2, file$3, 180, 28, 10660);
    			attr_dev(table1, "class", "game-table");
    			set_style(table1, "width", "100%");
    			add_location(table1, file$3, 138, 24, 7455);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table1, anchor);
    			append_dev(table1, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, img);
    			append_dev(tr1, t0);
    			append_dev(tr1, td9);
    			append_dev(td9, div5);
    			append_dev(div5, div1);
    			append_dev(div1, span);
    			append_dev(span, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, t3);
    			append_dev(div5, t4);
    			append_dev(div5, table0);
    			append_dev(table0, tr0);
    			append_dev(tr0, td1);
    			append_dev(tr0, t6);
    			append_dev(tr0, td2);
    			append_dev(td2, t7);
    			append_dev(tr0, t8);
    			append_dev(tr0, td3);
    			append_dev(tr0, t10);
    			append_dev(tr0, td4);
    			append_dev(td4, t11);
    			append_dev(tr0, t12);
    			append_dev(tr0, td5);
    			append_dev(tr0, t14);
    			append_dev(tr0, td6);
    			append_dev(td6, t15);
    			append_dev(tr0, t16);
    			append_dev(tr0, td7);
    			append_dev(tr0, t18);
    			append_dev(tr0, td8);
    			append_dev(td8, div3);
    			append_dev(div3, div2);
    			append_dev(div2, t19);
    			append_dev(div3, t20);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(div5, t21);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			append_dev(table1, t22);
    			append_dev(table1, tr2);
    			append_dev(tr2, td10);
    			append_dev(td10, t23);
    			append_dev(td10, t24);
    			append_dev(td10, t25);
    			append_dev(td10, t26);
    			if (if_block0) if_block0.m(td10, null);
    			append_dev(table1, t27);
    			if (if_block1) if_block1.m(table1, null);
    			append_dev(table1, t28);
    			if (if_block2) if_block2.m(table1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*currentPlace*/ 1 && !src_url_equal(img.src, img_src_value = "image/" + /*survivor*/ ctx[38].index + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t1_value !== (t1_value = /*survivor*/ ctx[38].playerName + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t3_value !== (t3_value = /*survivor*/ ctx[38].name + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t7_value !== (t7_value = /*survivor*/ ctx[38].power + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t11_value !== (t11_value = /*survivor*/ ctx[38].attack + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t15_value !== (t15_value = /*survivor*/ ctx[38].search + "")) set_data_dev(t15, t15_value);
    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t19_value !== (t19_value = /*survivor*/ ctx[38].wound + "")) set_data_dev(t19, t19_value);

    			if (dirty[0] & /*currentPlace*/ 1) {
    				const old_length = each_value_4.length;
    				each_value_4 = /*survivor*/ ctx[38].woundList;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = old_length; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$2(ctx, each_value_4, i);

    					if (!each_blocks_1[i]) {
    						each_blocks_1[i] = create_each_block_4$2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div3, null);
    					}
    				}

    				for (i = each_value_4.length; i < old_length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_4.length;
    			}

    			if (dirty[0] & /*currentPlace*/ 1) {
    				each_value_3 = /*survivor*/ ctx[38].foodList;
    				validate_each_argument(each_value_3);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_3, get_each_context_3$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_3, each1_lookup, div4, fix_and_outro_and_destroy_block, create_each_block_3$2, null, get_each_context_3$2);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}

    			if (!current || dirty[0] & /*currentPlace*/ 1) {
    				set_style(td9, "background-color", gameStore$1.getPlayerColorForSurvivor(/*survivor*/ ctx[38]));
    			}

    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t23_value !== (t23_value = /*survivor*/ ctx[38].job + "")) set_data_dev(t23, t23_value);
    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t25_value !== (t25_value = /*survivor*/ ctx[38].ability.name + "")) set_data_dev(t25, t25_value);

    			if (/*survivor*/ ctx[38].canUseAbility == false) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(td10, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*currentPlace*/ 1) show_if = /*survivor*/ ctx[38].actionTable.length > 0 && gameStore$1.isCurrentPlayerOfSurvivor(/*survivor*/ ctx[38]) == true;

    			if (show_if) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(table1, t28);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*survivor*/ ctx[38].actionTable.length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$2(ctx);
    					if_block2.c();
    					if_block2.m(table1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table1);
    			destroy_each(each_blocks_1, detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(138:20) {#if survivor}",
    		ctx
    	});

    	return block;
    }

    // (162:56) {#each survivor.woundList as wound, woundIndex}
    function create_each_block_4$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", "10px");
    			set_style(div, "height", "10px");
    			set_style(div, "border-radius", "10px");
    			set_style(div, "background-color", "lightsalmon");
    			set_style(div, "border", "1px solid red");
    			add_location(div, file$3, 162, 60, 9396);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$2.name,
    		type: "each",
    		source: "(162:56) {#each survivor.woundList as wound, woundIndex}",
    		ctx
    	});

    	return block;
    }

    // (170:44) {#each survivor.foodList as food, index (food)}
    function create_each_block_3$2(key_1, ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_intro;
    	let div1_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			set_style(div0, "margin-top", "3px");
    			set_style(div0, "width", "10px");
    			set_style(div0, "height", "10px");
    			set_style(div0, "background-color", "lightgreen");
    			set_style(div0, "border", "1px solid greenyellow");
    			add_location(div0, file$3, 173, 52, 10237);
    			add_location(div1, file$3, 170, 48, 10001);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		r: function measure() {
    			rect = div1.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div1);
    			stop_animation();
    			add_transform(div1, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div1, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, /*foodReceive*/ ctx[6], { key: /*food*/ ctx[47] });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, /*foodSend*/ ctx[5], { key: /*food*/ ctx[47] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$2.name,
    		type: "each",
    		source: "(170:44) {#each survivor.foodList as food, index (food)}",
    		ctx
    	});

    	return block;
    }

    // (185:36) {#if survivor.canUseAbility == false}
    function create_if_block_4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "능력을 사용하였습니다.";
    			set_style(span, "background-color", "lightgreen");
    			add_location(span, file$3, 185, 40, 10899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(185:36) {#if survivor.canUseAbility == false}",
    		ctx
    	});

    	return block;
    }

    // (190:28) {#if survivor.actionTable.length > 0 && gameStore.isCurrentPlayerOfSurvivor(survivor) == true}
    function create_if_block_3(ctx) {
    	let tr;
    	let td;
    	let t;
    	let each_value_2 = /*survivor*/ ctx[38].targetPlaceList;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = text("\r\n                                        로 이동");
    			add_location(td, file$3, 191, 36, 11278);
    			add_location(tr, file$3, 190, 32, 11236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td, null);
    			}

    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPlace*/ 1) {
    				each_value_2 = /*survivor*/ ctx[38].targetPlaceList;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(190:28) {#if survivor.actionTable.length > 0 && gameStore.isCurrentPlayerOfSurvivor(survivor) == true}",
    		ctx
    	});

    	return block;
    }

    // (193:40) {#each survivor.targetPlaceList as place}
    function create_each_block_2$2(ctx) {
    	let button;
    	let t_value = /*place*/ ctx[44].name + "";
    	let t;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "none-action-dice-button");
    			button.disabled = button_disabled_value = /*place*/ ctx[44].disabled;
    			set_style(button, "margin-right", "5px");
    			add_location(button, file$3, 193, 44, 11411);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(gameStore$1.move(/*survivor*/ ctx[38], /*place*/ ctx[44].name))) gameStore$1.move(/*survivor*/ ctx[38], /*place*/ ctx[44].name).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*currentPlace*/ 1 && t_value !== (t_value = /*place*/ ctx[44].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*currentPlace*/ 1 && button_disabled_value !== (button_disabled_value = /*place*/ ctx[44].disabled)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(193:40) {#each survivor.targetPlaceList as place}",
    		ctx
    	});

    	return block;
    }

    // (204:28) {#if survivor.actionTable.length > 0}
    function create_if_block_1$2(ctx) {
    	let tr;
    	let td;
    	let table;
    	let t;
    	let each_value_1 = /*survivor*/ ctx[38].actionTable;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let if_block = /*survivor*/ ctx[38].actionItemCard.enabled && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(table, "class", "game-table");
    			set_style(table, "width", "100%");
    			add_location(table, file$3, 206, 40, 12134);
    			add_location(td, file$3, 205, 36, 12088);
    			add_location(tr, file$3, 204, 32, 12046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, table);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(table, t);
    			if (if_block) if_block.m(table, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*currentPlace*/ 1) {
    				each_value_1 = /*survivor*/ ctx[38].actionTable;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*survivor*/ ctx[38].actionItemCard.enabled) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(table, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(204:28) {#if survivor.actionTable.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (208:44) {#each survivor.actionTable as action, actionIndex}
    function create_each_block_1$3(ctx) {
    	let tr;
    	let td0;
    	let span;
    	let t0_value = /*action*/ ctx[41].dice.power + "";
    	let t0;
    	let t1;
    	let td1;
    	let button0;
    	let t2;
    	let button0_disabled_value;
    	let t3;
    	let button1;
    	let t4;
    	let button1_disabled_value;
    	let t5;
    	let td2;
    	let button2;
    	let t6;
    	let button2_disabled_value;
    	let t7;
    	let td3;
    	let button3;
    	let t8;
    	let button3_disabled_value;
    	let t9;
    	let td4;
    	let button4;
    	let t10;
    	let button4_disabled_value;
    	let t11;
    	let td5;
    	let button5;
    	let t12;
    	let button5_disabled_value;
    	let t13;
    	let td6;
    	let button6;
    	let t14;
    	let button6_disabled_value;
    	let t15;
    	let td7;
    	let button7;
    	let t16;
    	let button7_disabled_value;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[16](/*survivor*/ ctx[38], /*actionIndex*/ ctx[43]);
    	}

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[17](/*survivor*/ ctx[38], /*actionIndex*/ ctx[43]);
    	}

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[18](/*actionIndex*/ ctx[43]);
    	}

    	function click_handler_6() {
    		return /*click_handler_6*/ ctx[19](/*survivor*/ ctx[38], /*actionIndex*/ ctx[43]);
    	}

    	function click_handler_7() {
    		return /*click_handler_7*/ ctx[20](/*survivor*/ ctx[38], /*actionIndex*/ ctx[43]);
    	}

    	function click_handler_8() {
    		return /*click_handler_8*/ ctx[21](/*survivor*/ ctx[38], /*actionIndex*/ ctx[43]);
    	}

    	function click_handler_9() {
    		return /*click_handler_9*/ ctx[22](/*actionIndex*/ ctx[43]);
    	}

    	function click_handler_10() {
    		return /*click_handler_10*/ ctx[23](/*actionIndex*/ ctx[43]);
    	}

    	function click_handler_11() {
    		return /*click_handler_11*/ ctx[24](/*actionIndex*/ ctx[43]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			button0 = element("button");
    			t2 = text("식사+1");
    			t3 = space();
    			button1 = element("button");
    			t4 = text("아이템+1");
    			t5 = space();
    			td2 = element("td");
    			button2 = element("button");
    			t6 = text("공격");
    			t7 = space();
    			td3 = element("td");
    			button3 = element("button");
    			t8 = text("검색");
    			t9 = space();
    			td4 = element("td");
    			button4 = element("button");
    			t10 = text("능력");
    			t11 = space();
    			td5 = element("td");
    			button5 = element("button");
    			t12 = text("바리케이트");
    			t13 = space();
    			td6 = element("td");
    			button6 = element("button");
    			t14 = text("유인");
    			t15 = space();
    			td7 = element("td");
    			button7 = element("button");
    			t16 = text("청소");
    			set_style(span, "cursor", "pointer");
    			attr_dev(span, "alt", "행동주사위 포기");
    			add_location(span, file$3, 210, 56, 12551);
    			set_style(td0, "width", "20px");
    			set_style(td0, "text-align", "center");

    			set_style(td0, "background-color", /*action*/ ctx[41].dice.done
    			? 'lightgray'
    			: 'lightgreen');

    			add_location(td0, file$3, 209, 52, 12385);
    			attr_dev(button0, "class", "food-action-dice-button");
    			button0.disabled = button0_disabled_value = !/*action*/ ctx[41].food;
    			add_location(button0, file$3, 213, 56, 12867);
    			attr_dev(button1, "class", "card-action-dice-button");
    			button1.disabled = button1_disabled_value = !/*action*/ ctx[41].itemFood;
    			add_location(button1, file$3, 217, 56, 13260);
    			add_location(td1, file$3, 212, 52, 12805);
    			attr_dev(button2, "class", "action-dice-button");
    			button2.disabled = button2_disabled_value = !/*action*/ ctx[41].attack;
    			add_location(button2, file$3, 223, 56, 13778);
    			add_location(td2, file$3, 222, 52, 13716);
    			attr_dev(button3, "class", "action-dice-button");
    			button3.disabled = button3_disabled_value = !/*action*/ ctx[41].search;
    			add_location(button3, file$3, 228, 56, 14226);
    			add_location(td3, file$3, 228, 52, 14222);
    			attr_dev(button4, "class", "action-dice-button");
    			button4.disabled = button4_disabled_value = !/*action*/ ctx[41].ability;
    			add_location(button4, file$3, 233, 56, 14679);
    			add_location(td4, file$3, 233, 52, 14675);
    			attr_dev(button5, "class", "action-dice-button");
    			button5.disabled = button5_disabled_value = !/*action*/ ctx[41].barricade;
    			add_location(button5, file$3, 239, 56, 15189);
    			add_location(td5, file$3, 238, 52, 15127);
    			attr_dev(button6, "class", "action-dice-button");
    			button6.disabled = button6_disabled_value = !/*action*/ ctx[41].invite;
    			add_location(button6, file$3, 246, 56, 15753);
    			add_location(td6, file$3, 245, 52, 15691);
    			attr_dev(button7, "class", "action-dice-button");
    			button7.disabled = button7_disabled_value = !/*action*/ ctx[41].clean;
    			add_location(button7, file$3, 251, 56, 16193);
    			add_location(td7, file$3, 251, 52, 16189);
    			add_location(tr, file$3, 208, 48, 12327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, span);
    			append_dev(span, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button0);
    			append_dev(button0, t2);
    			append_dev(td1, t3);
    			append_dev(td1, button1);
    			append_dev(button1, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td2);
    			append_dev(td2, button2);
    			append_dev(button2, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td3);
    			append_dev(td3, button3);
    			append_dev(button3, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td4);
    			append_dev(td4, button4);
    			append_dev(button4, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td5);
    			append_dev(td5, button5);
    			append_dev(button5, t12);
    			append_dev(tr, t13);
    			append_dev(tr, td6);
    			append_dev(td6, button6);
    			append_dev(button6, t14);
    			append_dev(tr, t15);
    			append_dev(tr, td7);
    			append_dev(td7, button7);
    			append_dev(button7, t16);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", prevent_default(click_handler_3), false, true, false),
    					listen_dev(button0, "click", click_handler_4, false, false, false),
    					listen_dev(button1, "click", click_handler_5, false, false, false),
    					listen_dev(button2, "click", click_handler_6, false, false, false),
    					listen_dev(button3, "click", click_handler_7, false, false, false),
    					listen_dev(button4, "click", click_handler_8, false, false, false),
    					listen_dev(button5, "click", click_handler_9, false, false, false),
    					listen_dev(button6, "click", click_handler_10, false, false, false),
    					listen_dev(button7, "click", click_handler_11, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*currentPlace*/ 1 && t0_value !== (t0_value = /*action*/ ctx[41].dice.power + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*currentPlace*/ 1) {
    				set_style(td0, "background-color", /*action*/ ctx[41].dice.done
    				? 'lightgray'
    				: 'lightgreen');
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button0_disabled_value !== (button0_disabled_value = !/*action*/ ctx[41].food)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button1_disabled_value !== (button1_disabled_value = !/*action*/ ctx[41].itemFood)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button2_disabled_value !== (button2_disabled_value = !/*action*/ ctx[41].attack)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button3_disabled_value !== (button3_disabled_value = !/*action*/ ctx[41].search)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button4_disabled_value !== (button4_disabled_value = !/*action*/ ctx[41].ability)) {
    				prop_dev(button4, "disabled", button4_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button5_disabled_value !== (button5_disabled_value = !/*action*/ ctx[41].barricade)) {
    				prop_dev(button5, "disabled", button5_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button6_disabled_value !== (button6_disabled_value = !/*action*/ ctx[41].invite)) {
    				prop_dev(button6, "disabled", button6_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button7_disabled_value !== (button7_disabled_value = !/*action*/ ctx[41].clean)) {
    				prop_dev(button7, "disabled", button7_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(208:44) {#each survivor.actionTable as action, actionIndex}",
    		ctx
    	});

    	return block;
    }

    // (259:44) {#if survivor.actionItemCard.enabled}
    function create_if_block_2$2(ctx) {
    	let tr;
    	let td0;
    	let t0;
    	let td1;
    	let button0;
    	let t1;
    	let button0_disabled_value;
    	let t2;
    	let td2;
    	let button1;
    	let t3;
    	let button1_disabled_value;
    	let t4;
    	let td3;
    	let button2;
    	let t5;
    	let button2_disabled_value;
    	let t6;
    	let td4;
    	let button3;
    	let t7;
    	let button3_disabled_value;
    	let t8;
    	let td5;
    	let button4;
    	let t9;
    	let button4_disabled_value;
    	let t10;
    	let td6;
    	let t11;
    	let td7;
    	let button5;
    	let t12;
    	let button5_disabled_value;
    	let mounted;
    	let dispose;

    	function click_handler_12() {
    		return /*click_handler_12*/ ctx[25](/*survivor*/ ctx[38]);
    	}

    	function click_handler_13() {
    		return /*click_handler_13*/ ctx[26](/*survivor*/ ctx[38]);
    	}

    	function click_handler_14() {
    		return /*click_handler_14*/ ctx[27](/*survivor*/ ctx[38]);
    	}

    	function click_handler_15() {
    		return /*click_handler_15*/ ctx[28](/*survivor*/ ctx[38]);
    	}

    	function click_handler_16() {
    		return /*click_handler_16*/ ctx[29](/*survivor*/ ctx[38]);
    	}

    	function click_handler_17() {
    		return /*click_handler_17*/ ctx[30](/*survivor*/ ctx[38]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			button0 = element("button");
    			t1 = text("식량공급");
    			t2 = space();
    			td2 = element("td");
    			button1 = element("button");
    			t3 = text("공격");
    			t4 = space();
    			td3 = element("td");
    			button2 = element("button");
    			t5 = text("검색");
    			t6 = space();
    			td4 = element("td");
    			button3 = element("button");
    			t7 = text("치료");
    			t8 = space();
    			td5 = element("td");
    			button4 = element("button");
    			t9 = text("바리케이트");
    			t10 = space();
    			td6 = element("td");
    			t11 = space();
    			td7 = element("td");
    			button5 = element("button");
    			t12 = text("청소");
    			add_location(td0, file$3, 260, 52, 16802);
    			attr_dev(button0, "class", "card-action-dice-button");
    			button0.disabled = button0_disabled_value = !/*survivor*/ ctx[38].actionItemCard.food;
    			add_location(button0, file$3, 261, 56, 16869);
    			add_location(td1, file$3, 261, 52, 16865);
    			attr_dev(button1, "class", "card-action-dice-button");
    			button1.disabled = button1_disabled_value = !/*survivor*/ ctx[38].actionItemCard.attack;
    			add_location(button1, file$3, 265, 56, 17299);
    			add_location(td2, file$3, 265, 52, 17295);
    			attr_dev(button2, "class", "card-action-dice-button");
    			button2.disabled = button2_disabled_value = !/*survivor*/ ctx[38].actionItemCard.search;
    			add_location(button2, file$3, 269, 56, 17731);
    			add_location(td3, file$3, 269, 52, 17727);
    			attr_dev(button3, "class", "card-action-dice-button");
    			button3.disabled = button3_disabled_value = !/*survivor*/ ctx[38].actionItemCard.care;
    			add_location(button3, file$3, 273, 56, 18163);
    			add_location(td4, file$3, 273, 52, 18159);
    			attr_dev(button4, "class", "card-action-dice-button");
    			button4.disabled = button4_disabled_value = !/*survivor*/ ctx[38].actionItemCard.barricade;
    			add_location(button4, file$3, 277, 56, 18591);
    			add_location(td5, file$3, 277, 52, 18587);
    			add_location(td6, file$3, 281, 52, 19028);
    			attr_dev(button5, "class", "card-action-dice-button");
    			button5.disabled = button5_disabled_value = !/*survivor*/ ctx[38].actionItemCard.clean;
    			add_location(button5, file$3, 282, 56, 19095);
    			add_location(td7, file$3, 282, 52, 19091);
    			add_location(tr, file$3, 259, 48, 16744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, button0);
    			append_dev(button0, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, button1);
    			append_dev(button1, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td3);
    			append_dev(td3, button2);
    			append_dev(button2, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td4);
    			append_dev(td4, button3);
    			append_dev(button3, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td5);
    			append_dev(td5, button4);
    			append_dev(button4, t9);
    			append_dev(tr, t10);
    			append_dev(tr, td6);
    			append_dev(tr, t11);
    			append_dev(tr, td7);
    			append_dev(td7, button5);
    			append_dev(button5, t12);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_12, false, false, false),
    					listen_dev(button1, "click", click_handler_13, false, false, false),
    					listen_dev(button2, "click", click_handler_14, false, false, false),
    					listen_dev(button3, "click", click_handler_15, false, false, false),
    					listen_dev(button4, "click", click_handler_16, false, false, false),
    					listen_dev(button5, "click", click_handler_17, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*currentPlace*/ 1 && button0_disabled_value !== (button0_disabled_value = !/*survivor*/ ctx[38].actionItemCard.food)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button1_disabled_value !== (button1_disabled_value = !/*survivor*/ ctx[38].actionItemCard.attack)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button2_disabled_value !== (button2_disabled_value = !/*survivor*/ ctx[38].actionItemCard.search)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button3_disabled_value !== (button3_disabled_value = !/*survivor*/ ctx[38].actionItemCard.care)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button4_disabled_value !== (button4_disabled_value = !/*survivor*/ ctx[38].actionItemCard.barricade)) {
    				prop_dev(button4, "disabled", button4_disabled_value);
    			}

    			if (dirty[0] & /*currentPlace*/ 1 && button5_disabled_value !== (button5_disabled_value = !/*survivor*/ ctx[38].actionItemCard.clean)) {
    				prop_dev(button5, "disabled", button5_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(259:44) {#if survivor.actionItemCard.enabled}",
    		ctx
    	});

    	return block;
    }

    // (132:8) {#each currentPlace.survivorLocationList as survivor, index (survivor??index)}
    function create_each_block$3(key_1, ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*survivor*/ ctx[38] && create_if_block$2(ctx);

    	function introend_handler() {
    		return /*introend_handler*/ ctx[31](/*survivor*/ ctx[38]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(div0, "class", "survivor-position");
    			add_location(div0, file$3, 136, 16, 7362);
    			set_style(div1, "border", "1px solid lightgreen");
    			add_location(div1, file$3, 132, 12, 7107);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div1, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "introend", introend_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*survivor*/ ctx[38]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*currentPlace*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, /*deadSurvivorReceive*/ ctx[8], { key: /*survivor*/ ctx[38] });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, /*deadSurvivorSend*/ ctx[7], { key: /*survivor*/ ctx[38] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(132:8) {#each currentPlace.survivorLocationList as survivor, index (survivor??index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div15;
    	let div0;
    	let each_blocks_4 = [];
    	let each0_lookup = new Map();
    	let t0;
    	let div13;
    	let div12;
    	let div8;
    	let table;
    	let tr;
    	let td0;
    	let t2;
    	let td1;
    	let t3_value = /*$gameStore*/ ctx[1].turn + 1 + "";
    	let t3;
    	let t4;
    	let td2;
    	let t6;
    	let td3;
    	let t7_value = /*$gameStore*/ ctx[1].round + "";
    	let t7;
    	let t8;
    	let td4;
    	let t10;
    	let td5;
    	let t11_value = /*$gameStore*/ ctx[1].moral + "";
    	let t11;
    	let t12;
    	let td6;
    	let t14;
    	let td7;
    	let t15_value = /*$gameStore*/ ctx[1].survivorCount + "";
    	let t15;
    	let t16;
    	let td8;
    	let t18;
    	let td9;
    	let div3;
    	let div1;
    	let t19_value = /*$gameStore*/ ctx[1].deadSurvivorCount + "";
    	let t19;
    	let t20;
    	let div2;
    	let each_blocks_3 = [];
    	let each1_lookup = new Map();
    	let t21;
    	let td10;
    	let t23;
    	let td11;
    	let t24_value = /*$gameStore*/ ctx[1].zombieCount + "";
    	let t24;
    	let t25;
    	let td12;
    	let t27;
    	let td13;
    	let div6;
    	let div4;
    	let t28_value = /*$gameStore*/ ctx[1].deadZombieCount + "";
    	let t28;
    	let t29;
    	let div5;
    	let each_blocks_2 = [];
    	let each2_lookup = new Map();
    	let t30;
    	let div7;
    	let button0;
    	let t31;
    	let button0_disabled_value;
    	let t32;
    	let button1;
    	let t33;
    	let button1_disabled_value;
    	let t34;
    	let button2;
    	let t35;
    	let button2_disabled_value;
    	let t36;
    	let div10;
    	let div9;
    	let t37_value = /*currentPlace*/ ctx[0].name + "";
    	let t37;
    	let t38;
    	let div11;
    	let t39;
    	let div14;
    	let each_blocks = [];
    	let each4_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_9 = /*itemCardList*/ ctx[2];
    	validate_each_argument(each_value_9);
    	const get_key = ctx => /*itemCard*/ ctx[64];
    	validate_each_keys(ctx, each_value_9, get_each_context_9$1, get_key);

    	for (let i = 0; i < each_value_9.length; i += 1) {
    		let child_ctx = get_each_context_9$1(ctx, each_value_9, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_4[i] = create_each_block_9$1(key, child_ctx));
    	}

    	let each_value_8 = /*deadSurvivorList*/ ctx[3];
    	validate_each_argument(each_value_8);
    	const get_key_1 = ctx => /*surviror*/ ctx[61];
    	validate_each_keys(ctx, each_value_8, get_each_context_8$1, get_key_1);

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		let child_ctx = get_each_context_8$1(ctx, each_value_8, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks_3[i] = create_each_block_8$1(key, child_ctx));
    	}

    	let each_value_7 = /*deadZombieList*/ ctx[4];
    	validate_each_argument(each_value_7);
    	const get_key_2 = ctx => /*deadZombie*/ ctx[58];
    	validate_each_keys(ctx, each_value_7, get_each_context_7$1, get_key_2);

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		let child_ctx = get_each_context_7$1(ctx, each_value_7, i);
    		let key = get_key_2(child_ctx);
    		each2_lookup.set(key, each_blocks_2[i] = create_each_block_7$1(key, child_ctx));
    	}

    	let each_value_5 = /*currentPlace*/ ctx[0].entranceList;
    	validate_each_argument(each_value_5);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_1[i] = create_each_block_5$2(get_each_context_5$2(ctx, each_value_5, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*currentPlace*/ ctx[0].survivorLocationList;
    	validate_each_argument(each_value);
    	const get_key_3 = ctx => /*survivor*/ ctx[38] ?? /*index*/ ctx[40];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key_3);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key_3(child_ctx);
    		each4_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div15 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t0 = space();
    			div13 = element("div");
    			div12 = element("div");
    			div8 = element("div");
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			td0.textContent = "횟수";
    			t2 = space();
    			td1 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td2 = element("td");
    			td2.textContent = "라운드";
    			t6 = space();
    			td3 = element("td");
    			t7 = text(t7_value);
    			t8 = space();
    			td4 = element("td");
    			td4.textContent = "사기";
    			t10 = space();
    			td5 = element("td");
    			t11 = text(t11_value);
    			t12 = space();
    			td6 = element("td");
    			td6.textContent = "생존자";
    			t14 = space();
    			td7 = element("td");
    			t15 = text(t15_value);
    			t16 = space();
    			td8 = element("td");
    			td8.textContent = "죽은 생존자";
    			t18 = space();
    			td9 = element("td");
    			div3 = element("div");
    			div1 = element("div");
    			t19 = text(t19_value);
    			t20 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t21 = space();
    			td10 = element("td");
    			td10.textContent = "좀비";
    			t23 = space();
    			td11 = element("td");
    			t24 = text(t24_value);
    			t25 = space();
    			td12 = element("td");
    			td12.textContent = "죽은 좀비";
    			t27 = space();
    			td13 = element("td");
    			div6 = element("div");
    			div4 = element("div");
    			t28 = text(t28_value);
    			t29 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t30 = space();
    			div7 = element("div");
    			button0 = element("button");
    			t31 = text("위기상황카드");
    			t32 = space();
    			button1 = element("button");
    			t33 = text("행동 주사위");
    			t34 = space();
    			button2 = element("button");
    			t35 = text("완료");
    			t36 = space();
    			div10 = element("div");
    			div9 = element("div");
    			t37 = text(t37_value);
    			t38 = space();
    			div11 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t39 = space();
    			div14 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div0, "display", "flex");
    			add_location(div0, file$3, 38, 4, 1342);
    			attr_dev(td0, "class", "active");
    			add_location(td0, file$3, 48, 28, 1706);
    			attr_dev(td1, "class", "game-info");
    			add_location(td1, file$3, 49, 28, 1762);
    			attr_dev(td2, "class", "active");
    			add_location(td2, file$3, 50, 28, 1840);
    			attr_dev(td3, "class", "game-info");
    			add_location(td3, file$3, 51, 28, 1897);
    			attr_dev(td4, "class", "active");
    			add_location(td4, file$3, 52, 28, 1972);
    			attr_dev(td5, "class", "game-info");
    			add_location(td5, file$3, 53, 28, 2028);
    			attr_dev(td6, "class", "active");
    			add_location(td6, file$3, 54, 28, 2103);
    			attr_dev(td7, "class", "game-info");
    			add_location(td7, file$3, 55, 28, 2160);
    			attr_dev(td8, "class", "active");
    			add_location(td8, file$3, 56, 28, 2243);
    			add_location(div1, file$3, 59, 36, 2424);
    			set_style(div2, "display", "flex");
    			set_style(div2, "width", "50px");
    			set_style(div2, "flex-wrap", "wrap");
    			set_style(div2, "margin-left", "5px");
    			add_location(div2, file$3, 60, 36, 2503);
    			set_style(div3, "display", "flex");
    			add_location(div3, file$3, 58, 32, 2359);
    			attr_dev(td9, "class", "game-info");
    			add_location(td9, file$3, 57, 28, 2303);
    			attr_dev(td10, "class", "active");
    			add_location(td10, file$3, 70, 28, 3245);
    			attr_dev(td11, "class", "game-info");
    			add_location(td11, file$3, 71, 28, 3301);
    			attr_dev(td12, "class", "active");
    			add_location(td12, file$3, 72, 28, 3382);
    			add_location(div4, file$3, 75, 36, 3562);
    			set_style(div5, "display", "flex");
    			set_style(div5, "width", "50px");
    			set_style(div5, "flex-wrap", "wrap");
    			set_style(div5, "margin-left", "5px");
    			add_location(div5, file$3, 76, 36, 3639);
    			set_style(div6, "display", "flex");
    			add_location(div6, file$3, 74, 32, 3497);
    			attr_dev(td13, "class", "game-info");
    			add_location(td13, file$3, 73, 28, 3441);
    			add_location(tr, file$3, 47, 24, 1672);
    			attr_dev(table, "class", "game-table");
    			add_location(table, file$3, 46, 20, 1620);
    			attr_dev(button0, "class", "game-button dice action-button");
    			button0.disabled = button0_disabled_value = !/*$gameStore*/ ctx[1].riskCard;
    			set_style(button0, "height", "30px");
    			add_location(button0, file$3, 90, 24, 4488);
    			attr_dev(button1, "class", "game-button dice action-button");
    			button1.disabled = button1_disabled_value = !/*$gameStore*/ ctx[1].rollDice;
    			set_style(button1, "height", "30px");
    			add_location(button1, file$3, 96, 24, 4795);
    			attr_dev(button2, "class", "game-button action-button");
    			button2.disabled = button2_disabled_value = !/*$gameStore*/ ctx[1].canTurn;
    			set_style(button2, "height", "30px");
    			add_location(button2, file$3, 100, 24, 5046);
    			set_style(div7, "margin-left", "20px");
    			add_location(div7, file$3, 89, 20, 4431);
    			set_style(div8, "display", "flex");
    			add_location(div8, file$3, 45, 16, 1571);
    			attr_dev(div9, "class", "place-name");
    			add_location(div9, file$3, 106, 12, 5375);
    			set_style(div10, "display", "table");
    			set_style(div10, "margin-left", "10px");
    			add_location(div10, file$3, 105, 12, 5315);
    			attr_dev(div11, "class", "flex");
    			set_style(div11, "justify-content", "space-evenly");
    			set_style(div11, "align-content", "flex-start");
    			set_style(div11, "margin", "2px");
    			add_location(div11, file$3, 108, 12, 5458);
    			set_style(div12, "display", "flex");
    			add_location(div12, file$3, 44, 8, 1526);
    			add_location(div13, file$3, 43, 4, 1511);
    			attr_dev(div14, "class", "flex survivor-container");
    			add_location(div14, file$3, 130, 4, 6968);
    			attr_dev(div15, "class", "place place-part");
    			add_location(div15, file$3, 37, 0, 1306);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div0);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(div0, null);
    			}

    			append_dev(div15, t0);
    			append_dev(div15, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div8);
    			append_dev(div8, table);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(tr, t10);
    			append_dev(tr, td5);
    			append_dev(td5, t11);
    			append_dev(tr, t12);
    			append_dev(tr, td6);
    			append_dev(tr, t14);
    			append_dev(tr, td7);
    			append_dev(td7, t15);
    			append_dev(tr, t16);
    			append_dev(tr, td8);
    			append_dev(tr, t18);
    			append_dev(tr, td9);
    			append_dev(td9, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t19);
    			append_dev(div3, t20);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div2, null);
    			}

    			append_dev(tr, t21);
    			append_dev(tr, td10);
    			append_dev(tr, t23);
    			append_dev(tr, td11);
    			append_dev(td11, t24);
    			append_dev(tr, t25);
    			append_dev(tr, td12);
    			append_dev(tr, t27);
    			append_dev(tr, td13);
    			append_dev(td13, div6);
    			append_dev(div6, div4);
    			append_dev(div4, t28);
    			append_dev(div6, t29);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div5, null);
    			}

    			append_dev(div8, t30);
    			append_dev(div8, div7);
    			append_dev(div7, button0);
    			append_dev(button0, t31);
    			append_dev(div7, t32);
    			append_dev(div7, button1);
    			append_dev(button1, t33);
    			append_dev(div7, t34);
    			append_dev(div7, button2);
    			append_dev(button2, t35);
    			append_dev(div12, t36);
    			append_dev(div12, div10);
    			append_dev(div10, div9);
    			append_dev(div9, t37);
    			append_dev(div12, t38);
    			append_dev(div12, div11);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div11, null);
    			}

    			append_dev(div15, t39);
    			append_dev(div15, div14);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div14, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[13], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[14], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*itemCardList*/ 4) {
    				each_value_9 = /*itemCardList*/ ctx[2];
    				validate_each_argument(each_value_9);
    				validate_each_keys(ctx, each_value_9, get_each_context_9$1, get_key);
    				each_blocks_4 = update_keyed_each(each_blocks_4, dirty, get_key, 0, ctx, each_value_9, each0_lookup, div0, destroy_block, create_each_block_9$1, null, get_each_context_9$1);
    			}

    			if ((!current || dirty[0] & /*$gameStore*/ 2) && t3_value !== (t3_value = /*$gameStore*/ ctx[1].turn + 1 + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[0] & /*$gameStore*/ 2) && t7_value !== (t7_value = /*$gameStore*/ ctx[1].round + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty[0] & /*$gameStore*/ 2) && t11_value !== (t11_value = /*$gameStore*/ ctx[1].moral + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty[0] & /*$gameStore*/ 2) && t15_value !== (t15_value = /*$gameStore*/ ctx[1].survivorCount + "")) set_data_dev(t15, t15_value);
    			if ((!current || dirty[0] & /*$gameStore*/ 2) && t19_value !== (t19_value = /*$gameStore*/ ctx[1].deadSurvivorCount + "")) set_data_dev(t19, t19_value);

    			if (dirty[0] & /*deadSurvivorList*/ 8) {
    				each_value_8 = /*deadSurvivorList*/ ctx[3];
    				validate_each_argument(each_value_8);
    				group_outros();
    				validate_each_keys(ctx, each_value_8, get_each_context_8$1, get_key_1);
    				each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key_1, 1, ctx, each_value_8, each1_lookup, div2, outro_and_destroy_block, create_each_block_8$1, null, get_each_context_8$1);
    				check_outros();
    			}

    			if ((!current || dirty[0] & /*$gameStore*/ 2) && t24_value !== (t24_value = /*$gameStore*/ ctx[1].zombieCount + "")) set_data_dev(t24, t24_value);
    			if ((!current || dirty[0] & /*$gameStore*/ 2) && t28_value !== (t28_value = /*$gameStore*/ ctx[1].deadZombieCount + "")) set_data_dev(t28, t28_value);

    			if (dirty[0] & /*deadZombieList*/ 16) {
    				each_value_7 = /*deadZombieList*/ ctx[4];
    				validate_each_argument(each_value_7);
    				group_outros();
    				validate_each_keys(ctx, each_value_7, get_each_context_7$1, get_key_2);
    				each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_2, 1, ctx, each_value_7, each2_lookup, div5, outro_and_destroy_block, create_each_block_7$1, null, get_each_context_7$1);
    				check_outros();
    			}

    			if (!current || dirty[0] & /*$gameStore*/ 2 && button0_disabled_value !== (button0_disabled_value = !/*$gameStore*/ ctx[1].riskCard)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (!current || dirty[0] & /*$gameStore*/ 2 && button1_disabled_value !== (button1_disabled_value = !/*$gameStore*/ ctx[1].rollDice)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (!current || dirty[0] & /*$gameStore*/ 2 && button2_disabled_value !== (button2_disabled_value = !/*$gameStore*/ ctx[1].canTurn)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if ((!current || dirty[0] & /*currentPlace*/ 1) && t37_value !== (t37_value = /*currentPlace*/ ctx[0].name + "")) set_data_dev(t37, t37_value);

    			if (dirty[0] & /*currentPlace*/ 1) {
    				each_value_5 = /*currentPlace*/ ctx[0].entranceList;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5$2(ctx, each_value_5, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_5$2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div11, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_5.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*currentPlace*/ 1) {
    				each_value = /*currentPlace*/ ctx[0].survivorLocationList;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key_3);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_3, 1, ctx, each_value, each4_lookup, div14, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_8.length; i += 1) {
    				transition_in(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_value_7.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_5.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				transition_out(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div15);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].d();
    			}

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].d();
    			}

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].d();
    			}

    			destroy_each(each_blocks_1, detaching);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const survivorCountPerRow = 4;

    function instance$3($$self, $$props, $$invalidate) {
    	let $gameStore;
    	validate_store(gameStore$1, 'gameStore');
    	component_subscribe($$self, gameStore$1, $$value => $$invalidate(1, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Place', slots, []);
    	const [foodSend, foodReceive] = foodCrossfade;
    	const [deadSurvivorSend, deadSurvivorReceive] = deadSurvivorCrossfade;
    	const [deadZombieSend, deadZombieReceive] = deadZombieCrossfade;
    	let { placeIndex } = $$props;
    	let placeList;
    	let currentPlace;
    	let survivorList;
    	let survivorLocationList;
    	let survivorAreaTable = [];
    	let currentPlayer;
    	let dangerDice;
    	let selectedItemCardFeature;
    	let itemCardList;
    	let deadSurvivorList;
    	let deadZombieList;
    	const writable_props = ['placeIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Place> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => gameStore$1.choiceRiskCard();
    	const click_handler_1 = () => gameStore$1.rollActionDice();
    	const click_handler_2 = () => gameStore$1.turn();
    	const click_handler_3 = (survivor, actionIndex) => gameStore$1.done(survivor, actionIndex);
    	const click_handler_4 = (survivor, actionIndex) => gameStore$1.plusPower(survivor, currentPlace, actionIndex);
    	const click_handler_5 = actionIndex => gameStore$1.selectItemCard(currentPlace, actionIndex);
    	const click_handler_6 = (survivor, actionIndex) => gameStore$1.attack(survivor, currentPlace, actionIndex);
    	const click_handler_7 = (survivor, actionIndex) => gameStore$1.search(null, survivor, currentPlace, actionIndex);
    	const click_handler_8 = (survivor, actionIndex) => gameStore$1.useAbility(survivor, currentPlace, actionIndex);
    	const click_handler_9 = actionIndex => gameStore$1.createBarricade(currentPlace, actionIndex);
    	const click_handler_10 = actionIndex => gameStore$1.inviteZombie(currentPlace, actionIndex);
    	const click_handler_11 = actionIndex => gameStore$1.clean(3, actionIndex);
    	const click_handler_12 = survivor => gameStore$1.selectItemCardWithoutDice(currentPlace, survivor, 'food');
    	const click_handler_13 = survivor => gameStore$1.selectItemCardWithoutDice(currentPlace, survivor, 'attack');
    	const click_handler_14 = survivor => gameStore$1.selectItemCardWithoutDice(currentPlace, survivor, 'search');
    	const click_handler_15 = survivor => gameStore$1.selectItemCardWithoutDice(currentPlace, survivor, 'care');
    	const click_handler_16 = survivor => gameStore$1.selectItemCardWithoutDice(currentPlace, survivor, 'barricade');
    	const click_handler_17 = survivor => gameStore$1.selectItemCardWithoutDice(currentPlace, survivor, 'clean');
    	const introend_handler = survivor => gameStore$1.rollDangerActionDice(survivor);

    	$$self.$$set = $$props => {
    		if ('placeIndex' in $$props) $$invalidate(11, placeIndex = $$props.placeIndex);
    	};

    	$$self.$capture_state = () => ({
    		gameStore: gameStore$1,
    		flip,
    		foodCrossfade,
    		deadSurvivorCrossfade,
    		deadZombieCrossfade,
    		foodSend,
    		foodReceive,
    		deadSurvivorSend,
    		deadSurvivorReceive,
    		deadZombieSend,
    		deadZombieReceive,
    		placeIndex,
    		survivorCountPerRow,
    		placeList,
    		currentPlace,
    		survivorList,
    		survivorLocationList,
    		survivorAreaTable,
    		currentPlayer,
    		dangerDice,
    		selectedItemCardFeature,
    		itemCardList,
    		deadSurvivorList,
    		deadZombieList,
    		$gameStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('placeIndex' in $$props) $$invalidate(11, placeIndex = $$props.placeIndex);
    		if ('placeList' in $$props) $$invalidate(12, placeList = $$props.placeList);
    		if ('currentPlace' in $$props) $$invalidate(0, currentPlace = $$props.currentPlace);
    		if ('survivorList' in $$props) survivorList = $$props.survivorList;
    		if ('survivorLocationList' in $$props) survivorLocationList = $$props.survivorLocationList;
    		if ('survivorAreaTable' in $$props) survivorAreaTable = $$props.survivorAreaTable;
    		if ('currentPlayer' in $$props) currentPlayer = $$props.currentPlayer;
    		if ('dangerDice' in $$props) dangerDice = $$props.dangerDice;
    		if ('selectedItemCardFeature' in $$props) selectedItemCardFeature = $$props.selectedItemCardFeature;
    		if ('itemCardList' in $$props) $$invalidate(2, itemCardList = $$props.itemCardList);
    		if ('deadSurvivorList' in $$props) $$invalidate(3, deadSurvivorList = $$props.deadSurvivorList);
    		if ('deadZombieList' in $$props) $$invalidate(4, deadZombieList = $$props.deadZombieList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$gameStore, placeList, placeIndex, currentPlace*/ 6147) {
    			{
    				currentPlayer = gameStore$1.getCurrentPlayer();
    				$$invalidate(12, placeList = $gameStore.placeList);
    				dangerDice = $gameStore.dangerDice;
    				$$invalidate(2, itemCardList = $gameStore.itemCardList);
    				selectedItemCardFeature = $gameStore.selectedItemCardFeature;
    				$$invalidate(0, currentPlace = placeList[placeIndex]);
    				survivorList = currentPlace.survivorList;
    				survivorLocationList = currentPlace.survivorLocationList;
    				$$invalidate(3, deadSurvivorList = $gameStore.deadSurvivorList);
    				$$invalidate(4, deadZombieList = $gameStore.deadZombieList);
    			}
    		}
    	};

    	return [
    		currentPlace,
    		$gameStore,
    		itemCardList,
    		deadSurvivorList,
    		deadZombieList,
    		foodSend,
    		foodReceive,
    		deadSurvivorSend,
    		deadSurvivorReceive,
    		deadZombieSend,
    		deadZombieReceive,
    		placeIndex,
    		placeList,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16,
    		click_handler_17,
    		introend_handler
    	];
    }

    class Place extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { placeIndex: 11 }, null, [-1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Place",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*placeIndex*/ ctx[11] === undefined && !('placeIndex' in props)) {
    			console.warn("<Place> was created without expected prop 'placeIndex'");
    		}
    	}

    	get placeIndex() {
    		throw new Error("<Place>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeIndex(value) {
    		throw new Error("<Place>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Action.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\Action.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_5$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (56:15) {#each action.attackSurvivorList as survivor}
    function create_each_block_5$1(ctx) {
    	let button;
    	let t_value = /*survivor*/ ctx[6].index + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$2, 56, 19, 2294);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPlayer*/ 2 && t_value !== (t_value = /*survivor*/ ctx[6].index + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$1.name,
    		type: "each",
    		source: "(56:15) {#each action.attackSurvivorList as survivor}",
    		ctx
    	});

    	return block;
    }

    // (61:15) {#each action.searchSurvivorList as survivor}
    function create_each_block_4$1(ctx) {
    	let button;
    	let t_value = /*survivor*/ ctx[6].index + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$2, 61, 19, 2469);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPlayer*/ 2 && t_value !== (t_value = /*survivor*/ ctx[6].index + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(61:15) {#each action.searchSurvivorList as survivor}",
    		ctx
    	});

    	return block;
    }

    // (66:16) {#each action.barricadeSurvivorList as survivor}
    function create_each_block_3$1(ctx) {
    	let button;
    	let t_value = /*survivor*/ ctx[6].index + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$2, 66, 20, 2650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPlayer*/ 2 && t_value !== (t_value = /*survivor*/ ctx[6].index + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(66:16) {#each action.barricadeSurvivorList as survivor}",
    		ctx
    	});

    	return block;
    }

    // (71:16) {#each action.trashSurvivorList as survivor}
    function create_each_block_2$1(ctx) {
    	let button;
    	let t_value = /*survivor*/ ctx[6].index + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$2, 71, 20, 2829);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPlayer*/ 2 && t_value !== (t_value = /*survivor*/ ctx[6].index + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(71:16) {#each action.trashSurvivorList as survivor}",
    		ctx
    	});

    	return block;
    }

    // (76:16) {#each action.inviteZombieSurvivorList as survivor}
    function create_each_block_1$2(ctx) {
    	let button;
    	let t_value = /*survivor*/ ctx[6].index + "";
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$2, 76, 20, 3015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPlayer*/ 2 && t_value !== (t_value = /*survivor*/ ctx[6].index + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(76:16) {#each action.inviteZombieSurvivorList as survivor}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#each currentPlayer.actionTable as action}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*action*/ ctx[3].power + "";
    	let t0;
    	let t1;
    	let td1;
    	let button;
    	let t3;
    	let td2;
    	let t4;
    	let td3;
    	let t5;
    	let td4;
    	let t6;
    	let td5;
    	let t7;
    	let td6;
    	let t8;
    	let each_value_5 = /*action*/ ctx[3].attackSurvivorList;
    	validate_each_argument(each_value_5);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_4[i] = create_each_block_5$1(get_each_context_5$1(ctx, each_value_5, i));
    	}

    	let each_value_4 = /*action*/ ctx[3].searchSurvivorList;
    	validate_each_argument(each_value_4);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_3[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*action*/ ctx[3].barricadeSurvivorList;
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*action*/ ctx[3].trashSurvivorList;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*action*/ ctx[3].inviteZombieSurvivorList;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			button = element("button");
    			button.textContent = "+1";
    			t3 = space();
    			td2 = element("td");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t4 = space();
    			td3 = element("td");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t5 = space();
    			td4 = element("td");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t6 = space();
    			td5 = element("td");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			td6 = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			add_location(td0, file$2, 52, 11, 2129);
    			add_location(button, file$2, 53, 16, 2170);
    			add_location(td1, file$2, 53, 12, 2166);
    			add_location(td2, file$2, 54, 11, 2207);
    			add_location(td3, file$2, 59, 11, 2382);
    			add_location(td4, file$2, 64, 12, 2558);
    			add_location(td5, file$2, 69, 12, 2741);
    			add_location(td6, file$2, 74, 12, 2920);
    			add_location(tr, file$2, 51, 8, 2112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button);
    			append_dev(tr, t3);
    			append_dev(tr, td2);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(td2, null);
    			}

    			append_dev(tr, t4);
    			append_dev(tr, td3);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(td3, null);
    			}

    			append_dev(tr, t5);
    			append_dev(tr, td4);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(td4, null);
    			}

    			append_dev(tr, t6);
    			append_dev(tr, td5);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(td5, null);
    			}

    			append_dev(tr, t7);
    			append_dev(tr, td6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td6, null);
    			}

    			append_dev(tr, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentPlayer*/ 2 && t0_value !== (t0_value = /*action*/ ctx[3].power + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currentPlayer*/ 2) {
    				each_value_5 = /*action*/ ctx[3].attackSurvivorList;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5$1(ctx, each_value_5, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_5$1(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(td2, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_5.length;
    			}

    			if (dirty & /*currentPlayer*/ 2) {
    				each_value_4 = /*action*/ ctx[3].searchSurvivorList;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_4$1(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(td3, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_4.length;
    			}

    			if (dirty & /*currentPlayer*/ 2) {
    				each_value_3 = /*action*/ ctx[3].barricadeSurvivorList;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_3$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(td4, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty & /*currentPlayer*/ 2) {
    				each_value_2 = /*action*/ ctx[3].trashSurvivorList;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(td5, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*currentPlayer*/ 2) {
    				each_value_1 = /*action*/ ctx[3].inviteZombieSurvivorList;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td6, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(51:4) {#each currentPlayer.actionTable as action}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let table0;
    	let tr0;
    	let td0;
    	let t1;
    	let td1;
    	let t2_value = /*$gameStore*/ ctx[0].round + "";
    	let t2;
    	let t3;
    	let td2;
    	let t5;
    	let td3;
    	let t6_value = /*$gameStore*/ ctx[0].moral + "";
    	let t6;
    	let t7;
    	let td4;
    	let t9;
    	let td5;
    	let t10_value = /*$gameStore*/ ctx[0].survivorCount + "";
    	let t10;
    	let t11;
    	let td6;
    	let t13;
    	let td7;
    	let t14_value = /*$gameStore*/ ctx[0].zombieCount + "";
    	let t14;
    	let t15;
    	let td8;
    	let t17;
    	let td9;
    	let t18_value = /*$gameStore*/ ctx[0].itemCardCount + "";
    	let t18;
    	let t19;
    	let tr1;
    	let td10;
    	let t21;
    	let td11;
    	let t22_value = /*$gameStore*/ ctx[0].deadSurvivorCount + "";
    	let t22;
    	let t23;
    	let td12;
    	let t25;
    	let td13;
    	let t26_value = /*$gameStore*/ ctx[0].deadZombieCount + "";
    	let t26;
    	let t27;
    	let td14;
    	let t29;
    	let td15;
    	let t30_value = /*$gameStore*/ ctx[0].survivorCount + "";
    	let t30;
    	let t31;
    	let td16;
    	let t33;
    	let td17;
    	let t34_value = /*$gameStore*/ ctx[0].zombieTokenCount + "";
    	let t34;
    	let t35;
    	let td18;
    	let t37;
    	let td19;
    	let t38_value = /*$gameStore*/ ctx[0].itemCardCount + "";
    	let t38;
    	let t39;
    	let table1;
    	let tr2;
    	let td20;
    	let button;
    	let t41;
    	let tr3;
    	let td21;
    	let t43;
    	let td22;
    	let t45;
    	let td23;
    	let t47;
    	let td24;
    	let t49;
    	let td25;
    	let t51;
    	let td26;
    	let t53;
    	let td27;
    	let t55;
    	let mounted;
    	let dispose;
    	let each_value = /*currentPlayer*/ ctx[1].actionTable;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table0 = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			td0.textContent = "라운드";
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			td2.textContent = "사기";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			td4.textContent = "생존자";
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			td6.textContent = "좀비";
    			t13 = space();
    			td7 = element("td");
    			t14 = text(t14_value);
    			t15 = space();
    			td8 = element("td");
    			td8.textContent = "아이템";
    			t17 = space();
    			td9 = element("td");
    			t18 = text(t18_value);
    			t19 = space();
    			tr1 = element("tr");
    			td10 = element("td");
    			td10.textContent = "죽은 생존자";
    			t21 = space();
    			td11 = element("td");
    			t22 = text(t22_value);
    			t23 = space();
    			td12 = element("td");
    			td12.textContent = "죽은 좀비";
    			t25 = space();
    			td13 = element("td");
    			t26 = text(t26_value);
    			t27 = space();
    			td14 = element("td");
    			td14.textContent = "생존자";
    			t29 = space();
    			td15 = element("td");
    			t30 = text(t30_value);
    			t31 = space();
    			td16 = element("td");
    			td16.textContent = "좀비 토큰";
    			t33 = space();
    			td17 = element("td");
    			t34 = text(t34_value);
    			t35 = space();
    			td18 = element("td");
    			td18.textContent = "아이템";
    			t37 = space();
    			td19 = element("td");
    			t38 = text(t38_value);
    			t39 = space();
    			table1 = element("table");
    			tr2 = element("tr");
    			td20 = element("td");
    			button = element("button");
    			button.textContent = "행동 주사기 굴리기";
    			t41 = space();
    			tr3 = element("tr");
    			td21 = element("td");
    			td21.textContent = "주사위";
    			t43 = space();
    			td22 = element("td");
    			td22.textContent = "식사";
    			t45 = space();
    			td23 = element("td");
    			td23.textContent = "공격";
    			t47 = space();
    			td24 = element("td");
    			td24.textContent = "검색";
    			t49 = space();
    			td25 = element("td");
    			td25.textContent = "바리케이트 설치";
    			t51 = space();
    			td26 = element("td");
    			td26.textContent = "쓰레기 처분";
    			t53 = space();
    			td27 = element("td");
    			td27.textContent = "좀비 유인";
    			t55 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "class", "active");
    			attr_dev(td0, "width", "100");
    			add_location(td0, file$2, 11, 8, 218);
    			attr_dev(td1, "width", "100");
    			add_location(td1, file$2, 12, 8, 267);
    			attr_dev(td2, "class", "active");
    			attr_dev(td2, "width", "100");
    			add_location(td2, file$2, 13, 8, 316);
    			attr_dev(td3, "width", "100");
    			add_location(td3, file$2, 14, 8, 364);
    			attr_dev(td4, "class", "active");
    			attr_dev(td4, "width", "100");
    			add_location(td4, file$2, 15, 8, 413);
    			attr_dev(td5, "width", "100");
    			add_location(td5, file$2, 16, 8, 462);
    			attr_dev(td6, "class", "active");
    			attr_dev(td6, "width", "100");
    			add_location(td6, file$2, 17, 8, 519);
    			attr_dev(td7, "width", "100");
    			add_location(td7, file$2, 18, 8, 567);
    			attr_dev(td8, "class", "active");
    			attr_dev(td8, "width", "100");
    			add_location(td8, file$2, 19, 8, 622);
    			attr_dev(td9, "width", "100");
    			add_location(td9, file$2, 20, 8, 671);
    			add_location(tr0, file$2, 10, 4, 204);
    			attr_dev(td10, "class", "active");
    			attr_dev(td10, "width", "100");
    			add_location(td10, file$2, 23, 8, 749);
    			attr_dev(td11, "width", "100");
    			add_location(td11, file$2, 24, 8, 801);
    			attr_dev(td12, "class", "active");
    			attr_dev(td12, "width", "100");
    			add_location(td12, file$2, 25, 8, 862);
    			attr_dev(td13, "width", "100");
    			add_location(td13, file$2, 26, 8, 913);
    			attr_dev(td14, "class", "active");
    			attr_dev(td14, "width", "100");
    			add_location(td14, file$2, 27, 8, 972);
    			attr_dev(td15, "width", "100");
    			add_location(td15, file$2, 28, 8, 1021);
    			attr_dev(td16, "class", "active");
    			attr_dev(td16, "width", "100");
    			add_location(td16, file$2, 29, 8, 1078);
    			attr_dev(td17, "width", "100");
    			add_location(td17, file$2, 30, 8, 1129);
    			attr_dev(td18, "class", "active");
    			attr_dev(td18, "width", "100");
    			add_location(td18, file$2, 31, 8, 1189);
    			attr_dev(td19, "width", "100");
    			add_location(td19, file$2, 32, 8, 1238);
    			add_location(tr1, file$2, 22, 4, 735);
    			attr_dev(table0, "class", "game-info");
    			add_location(table0, file$2, 9, 0, 173);
    			attr_dev(button, "class", "game-button dice");
    			add_location(button, file$2, 38, 12, 1386);
    			attr_dev(td20, "colspan", "8");
    			add_location(td20, file$2, 37, 8, 1356);
    			add_location(tr2, file$2, 36, 4, 1342);
    			attr_dev(td21, "width", "50");
    			add_location(td21, file$2, 42, 8, 1528);
    			attr_dev(td22, "class", "no-action-dice");
    			set_style(td22, "background-color", "lightskyblue");
    			add_location(td22, file$2, 43, 8, 1561);
    			attr_dev(td23, "class", "action-dice");
    			set_style(td23, "background-color", "lightsalmon");
    			add_location(td23, file$2, 44, 8, 1644);
    			attr_dev(td24, "class", "action-dice");
    			set_style(td24, "background-color", "lightsalmon");
    			add_location(td24, file$2, 45, 8, 1723);
    			attr_dev(td25, "class", "action-dice");
    			set_style(td25, "background-color", "lightsalmon");
    			add_location(td25, file$2, 46, 8, 1802);
    			attr_dev(td26, "class", "action-dice");
    			set_style(td26, "background-color", "lightsalmon");
    			add_location(td26, file$2, 47, 8, 1887);
    			attr_dev(td27, "class", "action-dice");
    			set_style(td27, "background-color", "lightsalmon");
    			add_location(td27, file$2, 48, 8, 1970);
    			add_location(tr3, file$2, 41, 4, 1514);
    			attr_dev(table1, "class", "action-panel");
    			add_location(table1, file$2, 35, 0, 1308);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table0, anchor);
    			append_dev(table0, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(td1, t2);
    			append_dev(tr0, t3);
    			append_dev(tr0, td2);
    			append_dev(tr0, t5);
    			append_dev(tr0, td3);
    			append_dev(td3, t6);
    			append_dev(tr0, t7);
    			append_dev(tr0, td4);
    			append_dev(tr0, t9);
    			append_dev(tr0, td5);
    			append_dev(td5, t10);
    			append_dev(tr0, t11);
    			append_dev(tr0, td6);
    			append_dev(tr0, t13);
    			append_dev(tr0, td7);
    			append_dev(td7, t14);
    			append_dev(tr0, t15);
    			append_dev(tr0, td8);
    			append_dev(tr0, t17);
    			append_dev(tr0, td9);
    			append_dev(td9, t18);
    			append_dev(table0, t19);
    			append_dev(table0, tr1);
    			append_dev(tr1, td10);
    			append_dev(tr1, t21);
    			append_dev(tr1, td11);
    			append_dev(td11, t22);
    			append_dev(tr1, t23);
    			append_dev(tr1, td12);
    			append_dev(tr1, t25);
    			append_dev(tr1, td13);
    			append_dev(td13, t26);
    			append_dev(tr1, t27);
    			append_dev(tr1, td14);
    			append_dev(tr1, t29);
    			append_dev(tr1, td15);
    			append_dev(td15, t30);
    			append_dev(tr1, t31);
    			append_dev(tr1, td16);
    			append_dev(tr1, t33);
    			append_dev(tr1, td17);
    			append_dev(td17, t34);
    			append_dev(tr1, t35);
    			append_dev(tr1, td18);
    			append_dev(tr1, t37);
    			append_dev(tr1, td19);
    			append_dev(td19, t38);
    			insert_dev(target, t39, anchor);
    			insert_dev(target, table1, anchor);
    			append_dev(table1, tr2);
    			append_dev(tr2, td20);
    			append_dev(td20, button);
    			append_dev(table1, t41);
    			append_dev(table1, tr3);
    			append_dev(tr3, td21);
    			append_dev(tr3, t43);
    			append_dev(tr3, td22);
    			append_dev(tr3, t45);
    			append_dev(tr3, td23);
    			append_dev(tr3, t47);
    			append_dev(tr3, td24);
    			append_dev(tr3, t49);
    			append_dev(tr3, td25);
    			append_dev(tr3, t51);
    			append_dev(tr3, td26);
    			append_dev(tr3, t53);
    			append_dev(tr3, td27);
    			append_dev(table1, t55);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table1, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gameStore*/ 1 && t2_value !== (t2_value = /*$gameStore*/ ctx[0].round + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$gameStore*/ 1 && t6_value !== (t6_value = /*$gameStore*/ ctx[0].moral + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$gameStore*/ 1 && t10_value !== (t10_value = /*$gameStore*/ ctx[0].survivorCount + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*$gameStore*/ 1 && t14_value !== (t14_value = /*$gameStore*/ ctx[0].zombieCount + "")) set_data_dev(t14, t14_value);
    			if (dirty & /*$gameStore*/ 1 && t18_value !== (t18_value = /*$gameStore*/ ctx[0].itemCardCount + "")) set_data_dev(t18, t18_value);
    			if (dirty & /*$gameStore*/ 1 && t22_value !== (t22_value = /*$gameStore*/ ctx[0].deadSurvivorCount + "")) set_data_dev(t22, t22_value);
    			if (dirty & /*$gameStore*/ 1 && t26_value !== (t26_value = /*$gameStore*/ ctx[0].deadZombieCount + "")) set_data_dev(t26, t26_value);
    			if (dirty & /*$gameStore*/ 1 && t30_value !== (t30_value = /*$gameStore*/ ctx[0].survivorCount + "")) set_data_dev(t30, t30_value);
    			if (dirty & /*$gameStore*/ 1 && t34_value !== (t34_value = /*$gameStore*/ ctx[0].zombieTokenCount + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*$gameStore*/ 1 && t38_value !== (t38_value = /*$gameStore*/ ctx[0].itemCardCount + "")) set_data_dev(t38, t38_value);

    			if (dirty & /*currentPlayer*/ 2) {
    				each_value = /*currentPlayer*/ ctx[1].actionTable;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table1, null);
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
    			if (detaching) detach_dev(table0);
    			if (detaching) detach_dev(t39);
    			if (detaching) detach_dev(table1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $gameStore;
    	validate_store(gameStore$1, 'gameStore');
    	component_subscribe($$self, gameStore$1, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Action', slots, []);
    	let currentPlayer;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Action> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => gameStore$1.rollActionDice();
    	$$self.$capture_state = () => ({ gameStore: gameStore$1, currentPlayer, $gameStore });

    	$$self.$inject_state = $$props => {
    		if ('currentPlayer' in $$props) $$invalidate(1, currentPlayer = $$props.currentPlayer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$gameStore*/ 1) {
    			{
    				$$invalidate(1, currentPlayer = gameStore$1.getCurrentPlayer($gameStore));
    			}
    		}
    	};

    	return [$gameStore, currentPlayer, click_handler];
    }

    class Action extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Action",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\PlaceList.svelte generated by Svelte v3.46.4 */

    const file$1 = "src\\PlaceList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    function get_each_context_9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[25] = i;
    	return child_ctx;
    }

    function get_each_context_10(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[42] = list[i];
    	return child_ctx;
    }

    // (39:12) {#if currentRiskCard != null}
    function create_if_block_2$1(ctx) {
    	let div0;
    	let t0;
    	let span0;
    	let t1_value = /*currentRiskCard*/ ctx[2].name + "";
    	let t1;
    	let t2;
    	let span1;
    	let t3_value = /*successRiskCardList*/ ctx[3].length + "";
    	let t3;
    	let t4;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value_10 = /*successRiskCardList*/ ctx[3];
    	validate_each_argument(each_value_10);
    	const get_key = ctx => /*successRiskCard*/ ctx[42];
    	validate_each_keys(ctx, each_value_10, get_each_context_10, get_key);

    	for (let i = 0; i < each_value_10.length; i += 1) {
    		let child_ctx = get_each_context_10(ctx, each_value_10, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_10(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text("위기상황 : ");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = text("\r\n                지금까지 모은 아이템수 : ");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span0, "class", "game-title");
    			add_location(span0, file$1, 40, 23, 1663);
    			attr_dev(span1, "class", "game-title");
    			add_location(span1, file$1, 41, 31, 1750);
    			add_location(div0, file$1, 39, 16, 1633);
    			set_style(div1, "display", "flex");
    			set_style(div1, "margin-left", "10px");
    			set_style(div1, "align-items", "center");
    			add_location(div1, file$1, 43, 16, 1852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, span1);
    			append_dev(span1, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*currentRiskCard*/ 4) && t1_value !== (t1_value = /*currentRiskCard*/ ctx[2].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*successRiskCardList*/ 8) && t3_value !== (t3_value = /*successRiskCardList*/ ctx[3].length + "")) set_data_dev(t3, t3_value);

    			if (dirty[0] & /*successRiskCardList*/ 8) {
    				each_value_10 = /*successRiskCardList*/ ctx[3];
    				validate_each_argument(each_value_10);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_10, get_each_context_10, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_10, each_1_lookup, div1, fix_and_outro_and_destroy_block, create_each_block_10, null, get_each_context_10);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_10.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(39:12) {#if currentRiskCard != null}",
    		ctx
    	});

    	return block;
    }

    // (45:20) {#each successRiskCardList as successRiskCard (successRiskCard)}
    function create_each_block_10(key_1, ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", "25px");
    			set_style(div, "height", "25px");
    			set_style(div, "border-radius", "25px");
    			set_style(div, "background-color", "lightgreen");
    			set_style(div, "border", "1px solid greenyellow");
    			set_style(div, "margin-right", "5px");
    			add_location(div, file$1, 45, 24, 2028);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*itemCardReceive*/ ctx[8], { key: /*successRiskCard*/ ctx[42] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*itemCardSend*/ ctx[7], { key: /*successRiskCard*/ ctx[42] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_10.name,
    		type: "each",
    		source: "(45:20) {#each successRiskCardList as successRiskCard (successRiskCard)}",
    		ctx
    	});

    	return block;
    }

    // (124:16) {:else}
    function create_else_block(ctx) {
    	let table;
    	let tr0;
    	let td0;
    	let t0_value = /*place*/ ctx[20].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*place*/ ctx[20].index + 1 + "";
    	let t2;
    	let t3;
    	let t4;
    	let tr1;
    	let td1;
    	let t6;
    	let td2;
    	let t7_value = /*place*/ ctx[20].currentZombieCount + "";
    	let t7;
    	let t8;
    	let t9_value = /*place*/ ctx[20].maxZombieCount + "";
    	let t9;
    	let t10;
    	let div1;
    	let div0;
    	let each_blocks_1 = [];
    	let each1_lookup = new Map();
    	let t11;
    	let tr2;
    	let td3;
    	let t13;
    	let td4;
    	let t14_value = /*place*/ ctx[20].currentBarricadeCount + "";
    	let t14;
    	let t15;
    	let t16_value = /*place*/ ctx[20].maxZombieCount + "";
    	let t16;
    	let t17;
    	let tr3;
    	let td5;
    	let t19;
    	let td6;
    	let div2;
    	let t20_value = /*place*/ ctx[20].survivorList.length + "";
    	let t20;
    	let t21;
    	let t22_value = /*place*/ ctx[20].maxSurvivorCount + "";
    	let t22;
    	let t23;
    	let tr4;
    	let td7;
    	let t25;
    	let td8;
    	let t26_value = /*place*/ ctx[20].itemCardList.length + "";
    	let t26;
    	let t27;
    	let div4;
    	let div3;
    	let each_blocks = [];
    	let each2_lookup = new Map();
    	let current;
    	let each_value_9 = /*playerList*/ ctx[1];
    	validate_each_argument(each_value_9);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_9.length; i += 1) {
    		each_blocks_2[i] = create_each_block_9(get_each_context_9(ctx, each_value_9, i));
    	}

    	let each_value_8 = /*place*/ ctx[20].currentZombieList;
    	validate_each_argument(each_value_8);
    	const get_key = ctx => /*zombie*/ ctx[32];
    	validate_each_keys(ctx, each_value_8, get_each_context_8, get_key);

    	for (let i = 0; i < each_value_8.length; i += 1) {
    		let child_ctx = get_each_context_8(ctx, each_value_8, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks_1[i] = create_each_block_8(key, child_ctx));
    	}

    	let each_value_7 = /*place*/ ctx[20].itemCardList;
    	validate_each_argument(each_value_7);
    	const get_key_1 = ctx => /*itemCard*/ ctx[27];
    	validate_each_keys(ctx, each_value_7, get_each_context_7, get_key_1);

    	for (let i = 0; i < each_value_7.length; i += 1) {
    		let child_ctx = get_each_context_7(ctx, each_value_7, i);
    		let key = get_key_1(child_ctx);
    		each2_lookup.set(key, each_blocks[i] = create_each_block_7(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = text(")\r\n                                ");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t4 = space();
    			tr1 = element("tr");
    			td1 = element("td");
    			td1.textContent = "좀비수";
    			t6 = space();
    			td2 = element("td");
    			t7 = text(t7_value);
    			t8 = text("/");
    			t9 = text(t9_value);
    			t10 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t11 = space();
    			tr2 = element("tr");
    			td3 = element("td");
    			td3.textContent = "바리케이트수";
    			t13 = space();
    			td4 = element("td");
    			t14 = text(t14_value);
    			t15 = text("/");
    			t16 = text(t16_value);
    			t17 = space();
    			tr3 = element("tr");
    			td5 = element("td");
    			td5.textContent = "생존자수";
    			t19 = space();
    			td6 = element("td");
    			div2 = element("div");
    			t20 = text(t20_value);
    			t21 = text("/");
    			t22 = text(t22_value);
    			t23 = space();
    			tr4 = element("tr");
    			td7 = element("td");
    			td7.textContent = "아이템카드수";
    			t25 = space();
    			td8 = element("td");
    			t26 = text(t26_value);
    			t27 = space();
    			div4 = element("div");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "colspan", "2");
    			set_style(td0, "height", "26px");
    			add_location(td0, file$1, 126, 28, 6835);
    			add_location(tr0, file$1, 125, 24, 6801);
    			add_location(td1, file$1, 134, 28, 7416);
    			set_style(div0, "display", "flex");
    			set_style(div0, "width", "50px");
    			set_style(div0, "flex-wrap", "wrap");
    			add_location(div0, file$1, 137, 36, 7588);
    			add_location(div1, file$1, 136, 32, 7545);
    			add_location(td2, file$1, 135, 28, 7458);
    			add_location(tr1, file$1, 133, 24, 7382);
    			add_location(td3, file$1, 146, 28, 8145);
    			add_location(td4, file$1, 147, 28, 8190);
    			add_location(tr2, file$1, 145, 24, 8111);
    			add_location(td5, file$1, 150, 28, 8342);
    			set_style(div2, "display", "flex");
    			set_style(div2, "flex-direction", "column");
    			add_location(div2, file$1, 152, 32, 8423);
    			add_location(td6, file$1, 151, 28, 8385);
    			add_location(tr3, file$1, 149, 24, 8308);
    			add_location(td7, file$1, 158, 28, 8730);
    			set_style(div3, "display", "flex");
    			set_style(div3, "width", "25px");
    			set_style(div3, "flex-wrap", "wrap");
    			add_location(div3, file$1, 161, 36, 8883);
    			add_location(div4, file$1, 160, 32, 8840);
    			add_location(td8, file$1, 159, 28, 8775);
    			add_location(tr4, file$1, 157, 24, 8696);
    			add_location(table, file$1, 124, 20, 6768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(td0, t2);
    			append_dev(td0, t3);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(td0, null);
    			}

    			append_dev(table, t4);
    			append_dev(table, tr1);
    			append_dev(tr1, td1);
    			append_dev(tr1, t6);
    			append_dev(tr1, td2);
    			append_dev(td2, t7);
    			append_dev(td2, t8);
    			append_dev(td2, t9);
    			append_dev(td2, t10);
    			append_dev(td2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(table, t11);
    			append_dev(table, tr2);
    			append_dev(tr2, td3);
    			append_dev(tr2, t13);
    			append_dev(tr2, td4);
    			append_dev(td4, t14);
    			append_dev(td4, t15);
    			append_dev(td4, t16);
    			append_dev(table, t17);
    			append_dev(table, tr3);
    			append_dev(tr3, td5);
    			append_dev(tr3, t19);
    			append_dev(tr3, td6);
    			append_dev(td6, div2);
    			append_dev(div2, t20);
    			append_dev(div2, t21);
    			append_dev(div2, t22);
    			append_dev(table, t23);
    			append_dev(table, tr4);
    			append_dev(tr4, td7);
    			append_dev(tr4, t25);
    			append_dev(tr4, td8);
    			append_dev(td8, t26);
    			append_dev(td8, t27);
    			append_dev(td8, div4);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*placeList*/ 1) && t0_value !== (t0_value = /*place*/ ctx[20].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t2_value !== (t2_value = /*place*/ ctx[20].index + 1 + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*placeList, playerList*/ 3) {
    				each_value_9 = /*playerList*/ ctx[1];
    				validate_each_argument(each_value_9);
    				let i;

    				for (i = 0; i < each_value_9.length; i += 1) {
    					const child_ctx = get_each_context_9(ctx, each_value_9, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_9(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(td0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_9.length;
    			}

    			if ((!current || dirty[0] & /*placeList*/ 1) && t7_value !== (t7_value = /*place*/ ctx[20].currentZombieCount + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t9_value !== (t9_value = /*place*/ ctx[20].maxZombieCount + "")) set_data_dev(t9, t9_value);

    			if (dirty[0] & /*placeList*/ 1) {
    				each_value_8 = /*place*/ ctx[20].currentZombieList;
    				validate_each_argument(each_value_8);
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].r();
    				validate_each_keys(ctx, each_value_8, get_each_context_8, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 0, ctx, each_value_8, each1_lookup, div0, fix_and_destroy_block, create_each_block_8, null, get_each_context_8);
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].a();
    			}

    			if ((!current || dirty[0] & /*placeList*/ 1) && t14_value !== (t14_value = /*place*/ ctx[20].currentBarricadeCount + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t16_value !== (t16_value = /*place*/ ctx[20].maxZombieCount + "")) set_data_dev(t16, t16_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t20_value !== (t20_value = /*place*/ ctx[20].survivorList.length + "")) set_data_dev(t20, t20_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t22_value !== (t22_value = /*place*/ ctx[20].maxSurvivorCount + "")) set_data_dev(t22, t22_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t26_value !== (t26_value = /*place*/ ctx[20].itemCardList.length + "")) set_data_dev(t26, t26_value);

    			if (dirty[0] & /*placeList*/ 1) {
    				each_value_7 = /*place*/ ctx[20].itemCardList;
    				validate_each_argument(each_value_7);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_7, get_each_context_7, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value_7, each2_lookup, div3, fix_and_outro_and_destroy_block, create_each_block_7, null, get_each_context_7);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_7.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks_2, detaching);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(124:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (59:16) {#if place.name == '피난기지'}
    function create_if_block_1$1(ctx) {
    	let table;
    	let tr0;
    	let td0;
    	let t0_value = /*place*/ ctx[20].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*place*/ ctx[20].index + 1 + "";
    	let t2;
    	let t3;
    	let t4;
    	let tr1;
    	let td1;
    	let t6;
    	let td2;
    	let t7_value = /*place*/ ctx[20].currentZombieCount + "";
    	let t7;
    	let t8;
    	let t9_value = /*place*/ ctx[20].maxZombieCount + "";
    	let t9;
    	let t10;
    	let div1;
    	let div0;
    	let each_blocks_2 = [];
    	let each1_lookup = new Map();
    	let t11;
    	let td3;
    	let t13;
    	let td4;
    	let t14_value = /*place*/ ctx[20].currentBarricadeCount + "";
    	let t14;
    	let t15;
    	let t16_value = /*place*/ ctx[20].maxZombieCount + "";
    	let t16;
    	let t17;
    	let tr2;
    	let td5;
    	let t19;
    	let td6;
    	let div2;
    	let t20_value = /*place*/ ctx[20].survivorList.length + "";
    	let t20;
    	let t21;
    	let t22_value = /*place*/ ctx[20].maxSurvivorCount + "";
    	let t22;
    	let t23;
    	let td7;
    	let t24;
    	let span;
    	let t25_value = Math.floor(/*place*/ ctx[20].survivorList.length / 2) + "";
    	let t25;
    	let t26;
    	let t27;
    	let t28;
    	let td8;
    	let t29_value = /*place*/ ctx[20].foodCount + "";
    	let t29;
    	let t30;
    	let div4;
    	let div3;
    	let each_blocks_1 = [];
    	let each2_lookup = new Map();
    	let t31;
    	let tr3;
    	let td9;
    	let t33;
    	let td10;
    	let t34_value = /*place*/ ctx[20].starvingTokenCount + "";
    	let t34;
    	let t35;
    	let td11;
    	let t37;
    	let td12;
    	let t38_value = /*place*/ ctx[20].trashCount + "";
    	let t38;
    	let t39;
    	let div6;
    	let div5;
    	let each_blocks = [];
    	let each3_lookup = new Map();
    	let current;
    	let each_value_6 = /*playerList*/ ctx[1];
    	validate_each_argument(each_value_6);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks_3[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	let each_value_5 = /*place*/ ctx[20].currentZombieList;
    	validate_each_argument(each_value_5);
    	const get_key = ctx => /*zombie*/ ctx[32];
    	validate_each_keys(ctx, each_value_5, get_each_context_5, get_key);

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		let child_ctx = get_each_context_5(ctx, each_value_5, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks_2[i] = create_each_block_5(key, child_ctx));
    	}

    	let each_value_4 = /*camp*/ ctx[4].foodList;
    	validate_each_argument(each_value_4);
    	const get_key_1 = ctx => /*food*/ ctx[30];
    	validate_each_keys(ctx, each_value_4, get_each_context_4, get_key_1);

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		let child_ctx = get_each_context_4(ctx, each_value_4, i);
    		let key = get_key_1(child_ctx);
    		each2_lookup.set(key, each_blocks_1[i] = create_each_block_4(key, child_ctx));
    	}

    	let each_value_3 = /*camp*/ ctx[4].trashList;
    	validate_each_argument(each_value_3);
    	const get_key_2 = ctx => /*itemCard*/ ctx[27];
    	validate_each_keys(ctx, each_value_3, get_each_context_3, get_key_2);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key_2(child_ctx);
    		each3_lookup.set(key, each_blocks[i] = create_each_block_3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = text(")\r\n                                ");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t4 = space();
    			tr1 = element("tr");
    			td1 = element("td");
    			td1.textContent = "좀비수";
    			t6 = space();
    			td2 = element("td");
    			t7 = text(t7_value);
    			t8 = text("/");
    			t9 = text(t9_value);
    			t10 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t11 = space();
    			td3 = element("td");
    			td3.textContent = "바리케이트수";
    			t13 = space();
    			td4 = element("td");
    			t14 = text(t14_value);
    			t15 = text("/");
    			t16 = text(t16_value);
    			t17 = space();
    			tr2 = element("tr");
    			td5 = element("td");
    			td5.textContent = "생존자수";
    			t19 = space();
    			td6 = element("td");
    			div2 = element("div");
    			t20 = text(t20_value);
    			t21 = text("/");
    			t22 = text(t22_value);
    			t23 = space();
    			td7 = element("td");
    			t24 = text("식량(");
    			span = element("span");
    			t25 = text(t25_value);
    			t26 = text("필요");
    			t27 = text(")");
    			t28 = space();
    			td8 = element("td");
    			t29 = text(t29_value);
    			t30 = space();
    			div4 = element("div");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t31 = space();
    			tr3 = element("tr");
    			td9 = element("td");
    			td9.textContent = "굶주림 토큰";
    			t33 = space();
    			td10 = element("td");
    			t34 = text(t34_value);
    			t35 = space();
    			td11 = element("td");
    			td11.textContent = "쓰레기";
    			t37 = space();
    			td12 = element("td");
    			t38 = text(t38_value);
    			t39 = space();
    			div6 = element("div");
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td0, "colspan", "4");
    			set_style(td0, "height", "26px");
    			add_location(td0, file$1, 61, 28, 2845);
    			add_location(tr0, file$1, 60, 24, 2811);
    			add_location(td1, file$1, 69, 28, 3426);
    			set_style(div0, "display", "flex");
    			set_style(div0, "width", "50px");
    			set_style(div0, "flex-wrap", "wrap");
    			add_location(div0, file$1, 72, 36, 3598);
    			add_location(div1, file$1, 71, 32, 3555);
    			add_location(td2, file$1, 70, 28, 3468);
    			add_location(td3, file$1, 79, 28, 4094);
    			add_location(td4, file$1, 80, 28, 4139);
    			add_location(tr1, file$1, 68, 24, 3392);
    			add_location(td5, file$1, 83, 28, 4291);
    			set_style(div2, "display", "flex");
    			set_style(div2, "flex-direction", "column");
    			add_location(div2, file$1, 85, 32, 4372);
    			add_location(td6, file$1, 84, 28, 4334);
    			set_style(span, "background-color", "lightgreen");
    			add_location(span, file$1, 89, 35, 4625);
    			add_location(td7, file$1, 89, 28, 4618);
    			set_style(div3, "display", "flex");
    			set_style(div3, "width", "50px");
    			set_style(div3, "flex-wrap", "wrap");
    			add_location(div3, file$1, 92, 36, 4854);
    			add_location(div4, file$1, 91, 32, 4811);
    			add_location(td8, file$1, 90, 28, 4756);
    			add_location(tr2, file$1, 82, 24, 4257);
    			add_location(td9, file$1, 105, 28, 5667);
    			add_location(td10, file$1, 106, 28, 5712);
    			add_location(td11, file$1, 107, 28, 5777);
    			set_style(div5, "display", "flex");
    			set_style(div5, "width", "50px");
    			set_style(div5, "flex-wrap", "wrap");
    			add_location(div5, file$1, 110, 36, 5918);
    			add_location(div6, file$1, 109, 32, 5875);
    			add_location(td12, file$1, 108, 28, 5819);
    			add_location(tr3, file$1, 104, 24, 5633);
    			add_location(table, file$1, 59, 20, 2778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, t0);
    			append_dev(td0, t1);
    			append_dev(td0, t2);
    			append_dev(td0, t3);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(td0, null);
    			}

    			append_dev(table, t4);
    			append_dev(table, tr1);
    			append_dev(tr1, td1);
    			append_dev(tr1, t6);
    			append_dev(tr1, td2);
    			append_dev(td2, t7);
    			append_dev(td2, t8);
    			append_dev(td2, t9);
    			append_dev(td2, t10);
    			append_dev(td2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div0, null);
    			}

    			append_dev(tr1, t11);
    			append_dev(tr1, td3);
    			append_dev(tr1, t13);
    			append_dev(tr1, td4);
    			append_dev(td4, t14);
    			append_dev(td4, t15);
    			append_dev(td4, t16);
    			append_dev(table, t17);
    			append_dev(table, tr2);
    			append_dev(tr2, td5);
    			append_dev(tr2, t19);
    			append_dev(tr2, td6);
    			append_dev(td6, div2);
    			append_dev(div2, t20);
    			append_dev(div2, t21);
    			append_dev(div2, t22);
    			append_dev(tr2, t23);
    			append_dev(tr2, td7);
    			append_dev(td7, t24);
    			append_dev(td7, span);
    			append_dev(span, t25);
    			append_dev(span, t26);
    			append_dev(td7, t27);
    			append_dev(tr2, t28);
    			append_dev(tr2, td8);
    			append_dev(td8, t29);
    			append_dev(td8, t30);
    			append_dev(td8, div4);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(table, t31);
    			append_dev(table, tr3);
    			append_dev(tr3, td9);
    			append_dev(tr3, t33);
    			append_dev(tr3, td10);
    			append_dev(td10, t34);
    			append_dev(tr3, t35);
    			append_dev(tr3, td11);
    			append_dev(tr3, t37);
    			append_dev(tr3, td12);
    			append_dev(td12, t38);
    			append_dev(td12, t39);
    			append_dev(td12, div6);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*placeList*/ 1) && t0_value !== (t0_value = /*place*/ ctx[20].name + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t2_value !== (t2_value = /*place*/ ctx[20].index + 1 + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*placeList, playerList*/ 3) {
    				each_value_6 = /*playerList*/ ctx[1];
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_6(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(td0, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_6.length;
    			}

    			if ((!current || dirty[0] & /*placeList*/ 1) && t7_value !== (t7_value = /*place*/ ctx[20].currentZombieCount + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t9_value !== (t9_value = /*place*/ ctx[20].maxZombieCount + "")) set_data_dev(t9, t9_value);

    			if (dirty[0] & /*placeList*/ 1) {
    				each_value_5 = /*place*/ ctx[20].currentZombieList;
    				validate_each_argument(each_value_5);
    				for (let i = 0; i < each_blocks_2.length; i += 1) each_blocks_2[i].r();
    				validate_each_keys(ctx, each_value_5, get_each_context_5, get_key);
    				each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key, 0, ctx, each_value_5, each1_lookup, div0, fix_and_destroy_block, create_each_block_5, null, get_each_context_5);
    				for (let i = 0; i < each_blocks_2.length; i += 1) each_blocks_2[i].a();
    			}

    			if ((!current || dirty[0] & /*placeList*/ 1) && t14_value !== (t14_value = /*place*/ ctx[20].currentBarricadeCount + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t16_value !== (t16_value = /*place*/ ctx[20].maxZombieCount + "")) set_data_dev(t16, t16_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t20_value !== (t20_value = /*place*/ ctx[20].survivorList.length + "")) set_data_dev(t20, t20_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t22_value !== (t22_value = /*place*/ ctx[20].maxSurvivorCount + "")) set_data_dev(t22, t22_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t25_value !== (t25_value = Math.floor(/*place*/ ctx[20].survivorList.length / 2) + "")) set_data_dev(t25, t25_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t29_value !== (t29_value = /*place*/ ctx[20].foodCount + "")) set_data_dev(t29, t29_value);

    			if (dirty[0] & /*camp*/ 16) {
    				each_value_4 = /*camp*/ ctx[4].foodList;
    				validate_each_argument(each_value_4);
    				group_outros();
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].r();
    				validate_each_keys(ctx, each_value_4, get_each_context_4, get_key_1);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_1, 1, ctx, each_value_4, each2_lookup, div3, fix_and_outro_and_destroy_block, create_each_block_4, null, get_each_context_4);
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].a();
    				check_outros();
    			}

    			if ((!current || dirty[0] & /*placeList*/ 1) && t34_value !== (t34_value = /*place*/ ctx[20].starvingTokenCount + "")) set_data_dev(t34, t34_value);
    			if ((!current || dirty[0] & /*placeList*/ 1) && t38_value !== (t38_value = /*place*/ ctx[20].trashCount + "")) set_data_dev(t38, t38_value);

    			if (dirty[0] & /*camp*/ 16) {
    				each_value_3 = /*camp*/ ctx[4].trashList;
    				validate_each_argument(each_value_3);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_3, get_each_context_3, get_key_2);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_2, 1, ctx, each_value_3, each3_lookup, div5, fix_and_outro_and_destroy_block, create_each_block_3, null, get_each_context_3);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks_3, detaching);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].d();
    			}

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(59:16) {#if place.name == '피난기지'}",
    		ctx
    	});

    	return block;
    }

    // (128:32) {#each playerList as player, index}
    function create_each_block_9(ctx) {
    	let span;
    	let t0_value = /*player*/ ctx[35].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*place*/ ctx[20].playerSurvivorMap[/*player*/ ctx[35].name].length + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(" : ");
    			t2 = text(t2_value);
    			t3 = text("\r\n                                     ");
    			set_style(span, "border-radius", "10px");
    			set_style(span, "border", "1px solid darkgray");
    			set_style(span, "padding", "2px");
    			set_style(span, "background-color", gameStore$1.getPlayerColor(/*index*/ ctx[25]));
    			add_location(span, file$1, 128, 36, 7011);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*playerList*/ 2 && t0_value !== (t0_value = /*player*/ ctx[35].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*placeList, playerList*/ 3 && t2_value !== (t2_value = /*place*/ ctx[20].playerSurvivorMap[/*player*/ ctx[35].name].length + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_9.name,
    		type: "each",
    		source: "(128:32) {#each playerList as player, index}",
    		ctx
    	});

    	return block;
    }

    // (139:40) {#each place.currentZombieList as zombie (zombie)}
    function create_each_block_8(key_1, ctx) {
    	let div;
    	let rect;
    	let stop_animation = noop;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", "10px");
    			set_style(div, "height", "10px");
    			set_style(div, "background-color", "lightsalmon");
    			set_style(div, "border", "1px solid red");
    			add_location(div, file$1, 139, 44, 7780);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, {});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_8.name,
    		type: "each",
    		source: "(139:40) {#each place.currentZombieList as zombie (zombie)}",
    		ctx
    	});

    	return block;
    }

    // (163:40) {#each place.itemCardList as itemCard (itemCard)}
    function create_each_block_7(key_1, ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", "1px");
    			set_style(div, "height", "1px");
    			add_location(div, file$1, 163, 44, 9074);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*placeItemCardReceive*/ ctx[10], { key: /*itemCard*/ ctx[27] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*placeItemCardSend*/ ctx[9], { key: /*itemCard*/ ctx[27] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_7.name,
    		type: "each",
    		source: "(163:40) {#each place.itemCardList as itemCard (itemCard)}",
    		ctx
    	});

    	return block;
    }

    // (63:32) {#each playerList as player, index}
    function create_each_block_6(ctx) {
    	let span;
    	let t0_value = /*player*/ ctx[35].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*place*/ ctx[20].playerSurvivorMap[/*player*/ ctx[35].name].length + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = text(" : ");
    			t2 = text(t2_value);
    			t3 = text("\r\n                                     ");
    			set_style(span, "border-radius", "10px");
    			set_style(span, "border", "1px solid darkgray");
    			set_style(span, "padding", "2px");
    			set_style(span, "background-color", gameStore$1.getPlayerColor(/*index*/ ctx[25]));
    			add_location(span, file$1, 63, 36, 3021);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*playerList*/ 2 && t0_value !== (t0_value = /*player*/ ctx[35].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*placeList, playerList*/ 3 && t2_value !== (t2_value = /*place*/ ctx[20].playerSurvivorMap[/*player*/ ctx[35].name].length + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(63:32) {#each playerList as player, index}",
    		ctx
    	});

    	return block;
    }

    // (74:40) {#each place.currentZombieList as zombie (zombie)}
    function create_each_block_5(key_1, ctx) {
    	let div;
    	let rect;
    	let stop_animation = noop;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			set_style(div, "width", "10px");
    			set_style(div, "height", "10px");
    			set_style(div, "background-color", "lightsalmon");
    			set_style(div, "border", "1px solid red");
    			add_location(div, file$1, 74, 44, 3790);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, {});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(74:40) {#each place.currentZombieList as zombie (zombie)}",
    		ctx
    	});

    	return block;
    }

    // (94:40) {#each camp.foodList as food, index (food)}
    function create_each_block_4(key_1, ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_intro;
    	let div1_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			set_style(div0, "width", "10px");
    			set_style(div0, "height", "10px");
    			set_style(div0, "background-color", "#ffdc7a");
    			set_style(div0, "border", "1px solid #f7ce59");
    			add_location(div0, file$1, 97, 48, 5263);
    			add_location(div1, file$1, 94, 44, 5039);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		r: function measure() {
    			rect = div1.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div1);
    			stop_animation();
    			add_transform(div1, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div1, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, /*foodReceive*/ ctx[14], { key: /*food*/ ctx[30] });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, /*foodSend*/ ctx[13], { key: /*food*/ ctx[30] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(94:40) {#each camp.foodList as food, index (food)}",
    		ctx
    	});

    	return block;
    }

    // (112:40) {#each camp.trashList as itemCard (itemCard)}
    function create_each_block_3(key_1, ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_intro;
    	let div1_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			set_style(div0, "width", "10px");
    			set_style(div0, "height", "10px");
    			set_style(div0, "background-color", "lightgreen");
    			set_style(div0, "border", "1px solid greenyellow");
    			add_location(div0, file$1, 115, 48, 6339);
    			add_location(div1, file$1, 112, 44, 6105);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		r: function measure() {
    			rect = div1.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div1);
    			stop_animation();
    			add_transform(div1, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div1, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, /*trashReceive*/ ctx[12], { key: /*itemCard*/ ctx[27] });
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, /*trashSend*/ ctx[11], { key: /*itemCard*/ ctx[27] });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_outro) div1_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(112:40) {#each camp.trashList as itemCard (itemCard)}",
    		ctx
    	});

    	return block;
    }

    // (57:8) {#each placeList as place, placeIndex}
    function create_each_block_2(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*place*/ ctx[20].name == '피난기지') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "class", div_class_value = "flex place-header " + gameStore$1.getPlaceClassName(/*place*/ ctx[20]));
    			add_location(div, file$1, 57, 12, 2593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(gameStore$1.changePlaceByName(/*place*/ ctx[20].name))) gameStore$1.changePlaceByName(/*place*/ ctx[20].name).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, t);
    			}

    			if (!current || dirty[0] & /*placeList*/ 1 && div_class_value !== (div_class_value = "flex place-header " + gameStore$1.getPlaceClassName(/*place*/ ctx[20]))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(57:8) {#each placeList as place, placeIndex}",
    		ctx
    	});

    	return block;
    }

    // (178:4) {#if messageList.length > 0}
    function create_if_block$1(ctx) {
    	let div;
    	let each_value_1 = /*messageList*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div, "display", "flex");
    			set_style(div, "flex-direction", "column");
    			set_style(div, "justify-content", "center");
    			set_style(div, "margin", "10px 300px");
    			add_location(div, file$1, 178, 8, 9656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*messageList*/ 32) {
    				each_value_1 = /*messageList*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(178:4) {#if messageList.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (180:12) {#each messageList as message, index}
    function create_each_block_1$1(ctx) {
    	let div;
    	let t0_value = /*index*/ ctx[25] + 1 + "";
    	let t0;
    	let t1;
    	let t2_value = /*message*/ ctx[23] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(div, file$1, 180, 16, 9819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*messageList*/ 32 && t2_value !== (t2_value = /*message*/ ctx[23] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(180:12) {#each messageList as message, index}",
    		ctx
    	});

    	return block;
    }

    // (187:4) {#each placeList as place, placeIndex}
    function create_each_block$1(ctx) {
    	let div;
    	let place;
    	let t;
    	let div_class_value;
    	let current;

    	place = new Place({
    			props: { placeIndex: /*placeIndex*/ ctx[22] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(place.$$.fragment);
    			t = space();
    			attr_dev(div, "class", div_class_value = "place-container " + /*place*/ ctx[20].activeClassName);
    			add_location(div, file$1, 187, 8, 9990);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(place, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*placeList*/ 1 && div_class_value !== (div_class_value = "place-container " + /*place*/ ctx[20].activeClassName)) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(place.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(place.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(place);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(187:4) {#each placeList as place, placeIndex}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div5;
    	let div2;
    	let div0;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let div3;
    	let t4;
    	let t5;
    	let div4;
    	let current;
    	let if_block0 = /*currentRiskCard*/ ctx[2] != null && create_if_block_2$1(ctx);
    	let each_value_2 = /*placeList*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let if_block1 = /*messageList*/ ctx[5].length > 0 && create_if_block$1(ctx);
    	let each_value = /*placeList*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("목표 : ");
    			span = element("span");
    			t1 = text(/*goal*/ ctx[6]);
    			t2 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "game-title");
    			add_location(span, file$1, 36, 44, 1455);
    			set_style(div0, "line-height", "30px");
    			add_location(div0, file$1, 36, 8, 1419);
    			set_style(div1, "line-height", "30px");
    			set_style(div1, "display", "flex");
    			set_style(div1, "margin-left", "10px");
    			add_location(div1, file$1, 37, 8, 1509);
    			set_style(div2, "display", "flex");
    			set_style(div2, "justify-content", "center");
    			set_style(div2, "background-color", "#0f6674");
    			set_style(div2, "color", "white");
    			add_location(div2, file$1, 35, 4, 1319);
    			attr_dev(div3, "class", "flex");
    			set_style(div3, "padding", "10px");
    			set_style(div3, "justify-content", "space-evenly");
    			add_location(div3, file$1, 55, 4, 2461);
    			attr_dev(div4, "class", "place-container");
    			add_location(div4, file$1, 185, 4, 9907);
    			attr_dev(div5, "class", "flex-column");
    			add_location(div5, file$1, 34, 0, 1288);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div5, t3);
    			append_dev(div5, div3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(div5, t4);
    			if (if_block1) if_block1.m(div5, null);
    			append_dev(div5, t5);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*goal*/ 64) set_data_dev(t1, /*goal*/ ctx[6]);

    			if (/*currentRiskCard*/ ctx[2] != null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*currentRiskCard*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*placeList, camp, playerList*/ 19) {
    				each_value_2 = /*placeList*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*messageList*/ ctx[5].length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(div5, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*placeList*/ 1) {
    				each_value = /*placeList*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_1, detaching);
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $gameStore;
    	validate_store(gameStore$1, 'gameStore');
    	component_subscribe($$self, gameStore$1, $$value => $$invalidate(15, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlaceList', slots, []);
    	const [itemCardSend, itemCardReceive] = itemCardCrossfade;
    	const [placeItemCardSend, placeItemCardReceive] = placeItemCardCrossfade;
    	const [trashSend, trashReceive] = trashCrossfade;
    	const [foodSend, foodReceive] = foodCrossfade;
    	const [deadSurvivorSend, deadSurvivorReceive] = deadSurvivorCrossfade;
    	let placeList;
    	let playerList;
    	let deadSurvivorList;
    	let currentRiskCard;
    	let successRiskCardList;
    	let camp;
    	let actionTable;
    	let messageList;
    	let goal;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlaceList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		gameStore: gameStore$1,
    		Place,
    		flip,
    		itemCardCrossfade,
    		trashCrossfade,
    		foodCrossfade,
    		deadSurvivorCrossfade,
    		placeItemCardCrossfade,
    		itemCardSend,
    		itemCardReceive,
    		placeItemCardSend,
    		placeItemCardReceive,
    		trashSend,
    		trashReceive,
    		foodSend,
    		foodReceive,
    		deadSurvivorSend,
    		deadSurvivorReceive,
    		placeList,
    		playerList,
    		deadSurvivorList,
    		currentRiskCard,
    		successRiskCardList,
    		camp,
    		actionTable,
    		messageList,
    		goal,
    		$gameStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('placeList' in $$props) $$invalidate(0, placeList = $$props.placeList);
    		if ('playerList' in $$props) $$invalidate(1, playerList = $$props.playerList);
    		if ('deadSurvivorList' in $$props) deadSurvivorList = $$props.deadSurvivorList;
    		if ('currentRiskCard' in $$props) $$invalidate(2, currentRiskCard = $$props.currentRiskCard);
    		if ('successRiskCardList' in $$props) $$invalidate(3, successRiskCardList = $$props.successRiskCardList);
    		if ('camp' in $$props) $$invalidate(4, camp = $$props.camp);
    		if ('actionTable' in $$props) actionTable = $$props.actionTable;
    		if ('messageList' in $$props) $$invalidate(5, messageList = $$props.messageList);
    		if ('goal' in $$props) $$invalidate(6, goal = $$props.goal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$gameStore*/ 32768) {
    			{
    				$$invalidate(0, placeList = $gameStore.placeList);
    				$$invalidate(1, playerList = $gameStore.playerList);
    				$$invalidate(6, goal = $gameStore.goal);
    				$$invalidate(5, messageList = $gameStore.messageList);
    				deadSurvivorList = $gameStore.deadSurvivorList;
    				$$invalidate(2, currentRiskCard = $gameStore.currentRiskCard);
    				$$invalidate(3, successRiskCardList = $gameStore.successRiskCardList);
    				$$invalidate(4, camp = $gameStore.placeList.find(place => place.name === '피난기지'));
    				actionTable = $gameStore.actionTable;
    			}
    		}
    	};

    	return [
    		placeList,
    		playerList,
    		currentRiskCard,
    		successRiskCardList,
    		camp,
    		messageList,
    		goal,
    		itemCardSend,
    		itemCardReceive,
    		placeItemCardSend,
    		placeItemCardReceive,
    		trashSend,
    		trashReceive,
    		foodSend,
    		foodReceive,
    		$gameStore
    	];
    }

    class PlaceList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlaceList",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (37:8) {#if currentSurvivor != null}
    function create_if_block(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*modalType*/ ctx[0] == 'move') return create_if_block_1;
    		if (/*modalType*/ ctx[0] == 'care') return create_if_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(37:8) {#if currentSurvivor != null}",
    		ctx
    	});

    	return block;
    }

    // (56:42) 
    function create_if_block_2(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let button;
    	let each_value_1 = /*woundSurvivorList*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			button = element("button");
    			button.textContent = "취소";
    			add_location(button, file, 63, 24, 2634);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "row-reverse");
    			add_location(div0, file, 62, 20, 2552);
    			set_style(div1, "display", "flex");
    			set_style(div1, "flex-direction", "column");
    			add_location(div1, file, 56, 16, 2170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*gameStore, woundSurvivorList*/ 2) {
    				each_value_1 = /*woundSurvivorList*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(56:42) ",
    		ctx
    	});

    	return block;
    }

    // (38:12) {#if modalType == 'move'}
    function create_if_block_1(ctx) {
    	let div4;
    	let div0;
    	let strong;
    	let t0_value = /*currentSurvivor*/ ctx[3].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t4;
    	let div3;
    	let button;
    	let each_value = /*currentSurvivor*/ ctx[3].targetPlaceList;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div2 = element("div");
    			div2.textContent = "위험노출 주사위 없이 이동";
    			t4 = space();
    			div3 = element("div");
    			button = element("button");
    			button.textContent = "취소";
    			add_location(strong, file, 40, 24, 1270);
    			set_style(div0, "display", "flex");
    			set_style(div0, "margin-top", "10px");
    			add_location(div0, file, 39, 20, 1200);
    			set_style(div1, "display", "flex");
    			set_style(div1, "margin-top", "10px");
    			add_location(div1, file, 42, 20, 1359);
    			set_style(div2, "display", "flex");
    			set_style(div2, "margin-top", "10px");
    			add_location(div2, file, 50, 20, 1869);
    			add_location(button, file, 52, 24, 2037);
    			set_style(div3, "display", "flex");
    			set_style(div3, "flex-direction", "row-reverse");
    			add_location(div3, file, 51, 20, 1955);
    			set_style(div4, "display", "flex");
    			set_style(div4, "flex-direction", "column");
    			add_location(div4, file, 38, 16, 1128);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, strong);
    			append_dev(strong, t0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, button);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*currentSurvivor*/ 8 && t0_value !== (t0_value = /*currentSurvivor*/ ctx[3].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*currentSurvivor, gameStore*/ 8) {
    				each_value = /*currentSurvivor*/ ctx[3].targetPlaceList;
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(38:12) {#if modalType == 'move'}",
    		ctx
    	});

    	return block;
    }

    // (58:20) {#each woundSurvivorList as woundSurvivor}
    function create_each_block_1(ctx) {
    	let div;
    	let button;
    	let t0_value = /*woundSurvivor*/ ctx[10].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*woundSurvivor*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = text(" 치료");
    			add_location(button, file, 59, 28, 2384);
    			set_style(div, "display", "flex");
    			set_style(div, "margin-top", "10px");
    			add_location(div, file, 58, 24, 2310);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*woundSurvivorList*/ 2 && t0_value !== (t0_value = /*woundSurvivor*/ ctx[10].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(58:20) {#each woundSurvivorList as woundSurvivor}",
    		ctx
    	});

    	return block;
    }

    // (44:24) {#each currentSurvivor.targetPlaceList as place}
    function create_each_block(ctx) {
    	let button;
    	let t_value = /*place*/ ctx[7].name + "";
    	let t;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "none-action-dice-button");
    			button.disabled = button_disabled_value = /*place*/ ctx[7].disabled;
    			set_style(button, "margin-right", "5px");
    			add_location(button, file, 44, 28, 1507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(gameStore$1.move(/*currentSurvivor*/ ctx[3], /*place*/ ctx[7].name))) gameStore$1.move(/*currentSurvivor*/ ctx[3], /*place*/ ctx[7].name).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*currentSurvivor*/ 8 && t_value !== (t_value = /*place*/ ctx[7].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*currentSurvivor*/ 8 && button_disabled_value !== (button_disabled_value = /*place*/ ctx[7].disabled)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(44:24) {#each currentSurvivor.targetPlaceList as place}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let div1_class_value;
    	let t0;
    	let div5;
    	let div2;
    	let player0;
    	let t1;
    	let div3;
    	let placelist;
    	let t2;
    	let div4;
    	let player1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*currentSurvivor*/ ctx[3] != null && create_if_block(ctx);

    	player0 = new Player({
    			props: { playerIndex: 0 },
    			$$inline: true
    		});

    	placelist = new PlaceList({ $$inline: true });

    	player1 = new Player({
    			props: { playerIndex: 1 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div5 = element("div");
    			div2 = element("div");
    			create_component(player0.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			create_component(placelist.$$.fragment);
    			t2 = space();
    			div4 = element("div");
    			create_component(player1.$$.fragment);
    			attr_dev(div0, "class", "modal_body");
    			add_location(div0, file, 35, 4, 1008);
    			attr_dev(div1, "class", div1_class_value = "modal " + /*modalClass*/ ctx[2]);
    			add_location(div1, file, 34, 0, 970);
    			attr_dev(div2, "class", "board-item-section board-player-section");
    			add_location(div2, file, 72, 4, 2793);
    			attr_dev(div3, "class", "board-item-section board-content-section");
    			add_location(div3, file, 73, 4, 2891);
    			attr_dev(div4, "class", "board-item-section board-player-section");
    			add_location(div4, file, 74, 4, 2980);
    			attr_dev(div5, "class", "board flex");
    			add_location(div5, file, 71, 0, 2763);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div2);
    			mount_component(player0, div2, null);
    			append_dev(div5, t1);
    			append_dev(div5, div3);
    			mount_component(placelist, div3, null);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			mount_component(player1, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", gameStore$1.changePlace, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*currentSurvivor*/ ctx[3] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*modalClass*/ 4 && div1_class_value !== (div1_class_value = "modal " + /*modalClass*/ ctx[2])) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player0.$$.fragment, local);
    			transition_in(placelist.$$.fragment, local);
    			transition_in(player1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player0.$$.fragment, local);
    			transition_out(placelist.$$.fragment, local);
    			transition_out(player1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			destroy_component(player0);
    			destroy_component(placelist);
    			destroy_component(player1);
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
    	validate_store(gameStore$1, 'gameStore');
    	component_subscribe($$self, gameStore$1, $$value => $$invalidate(4, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let placeList;
    	let modalType;
    	let modalClass;
    	let currentSurvivor;
    	let woundSurvivorList = [];
    	gameStore$1.updateAll();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = woundSurvivor => gameStore$1.care(woundSurvivor);

    	$$self.$capture_state = () => ({
    		gameStore: gameStore$1,
    		Player,
    		Place,
    		Action,
    		PlaceList,
    		placeList,
    		modalType,
    		modalClass,
    		currentSurvivor,
    		woundSurvivorList,
    		$gameStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('placeList' in $$props) placeList = $$props.placeList;
    		if ('modalType' in $$props) $$invalidate(0, modalType = $$props.modalType);
    		if ('modalClass' in $$props) $$invalidate(2, modalClass = $$props.modalClass);
    		if ('currentSurvivor' in $$props) $$invalidate(3, currentSurvivor = $$props.currentSurvivor);
    		if ('woundSurvivorList' in $$props) $$invalidate(1, woundSurvivorList = $$props.woundSurvivorList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$gameStore, modalType, woundSurvivorList*/ 19) {
    			{
    				placeList = $gameStore.placeList;
    				$$invalidate(0, modalType = $gameStore.modalType);
    				$$invalidate(2, modalClass = $gameStore.modalClass);
    				$$invalidate(3, currentSurvivor = $gameStore.currentSurvivor);

    				if ($gameStore.currentPlace) {
    					$$invalidate(1, woundSurvivorList = $gameStore.currentPlace.survivorList.filter(survivor => survivor.wound > 0));
    				}

    				console.log('>>> modalType', modalType);
    				console.log('>>> woundSurvivorList', woundSurvivorList);
    			}
    		}
    	};

    	return [
    		modalType,
    		woundSurvivorList,
    		modalClass,
    		currentSurvivor,
    		$gameStore,
    		click_handler
    	];
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

})();
//# sourceMappingURL=bundle.js.map
