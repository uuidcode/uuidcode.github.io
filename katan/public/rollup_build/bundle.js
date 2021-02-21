
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function (jQuery) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var jQuery__default = /*#__PURE__*/_interopDefaultLegacy(jQuery);

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
    function empty() {
        return text('');
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
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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
    function create_component(block) {
        block && block.c();
    }
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

    /* src\Player.svelte generated by Svelte v3.32.3 */

    const file = "src\\Player.svelte";

    function create_fragment(ctx) {
    	let main;
    	let table;
    	let tr0;
    	let td0;
    	let t0_value = /*player*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let tr1;
    	let td1;
    	let img0;
    	let img0_src_value;
    	let img0_class_value;
    	let t2;
    	let td2;
    	let t3_value = /*player*/ ctx[0].resource.tree + "";
    	let t3;
    	let t4;
    	let tr2;
    	let td3;
    	let img1;
    	let img1_src_value;
    	let img1_class_value;
    	let t5;
    	let td4;
    	let t6_value = /*player*/ ctx[0].resource.mud + "";
    	let t6;
    	let t7;
    	let tr3;
    	let td5;
    	let img2;
    	let img2_src_value;
    	let img2_class_value;
    	let t8;
    	let td6;
    	let t9_value = /*player*/ ctx[0].resource.wheat + "";
    	let t9;
    	let t10;
    	let tr4;
    	let td7;
    	let img3;
    	let img3_src_value;
    	let img3_class_value;
    	let t11;
    	let td8;
    	let t12_value = /*player*/ ctx[0].resource.sheep + "";
    	let t12;
    	let t13;
    	let tr5;
    	let td9;
    	let img4;
    	let img4_src_value;
    	let img4_class_value;
    	let t14;
    	let td10;
    	let t15_value = /*player*/ ctx[0].resource.iron + "";
    	let t15;

    	const block = {
    		c: function create() {
    			main = element("main");
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			tr1 = element("tr");
    			td1 = element("td");
    			img0 = element("img");
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			tr2 = element("tr");
    			td3 = element("td");
    			img1 = element("img");
    			t5 = space();
    			td4 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			tr3 = element("tr");
    			td5 = element("td");
    			img2 = element("img");
    			t8 = space();
    			td6 = element("td");
    			t9 = text(t9_value);
    			t10 = space();
    			tr4 = element("tr");
    			td7 = element("td");
    			img3 = element("img");
    			t11 = space();
    			td8 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			tr5 = element("tr");
    			td9 = element("td");
    			img4 = element("img");
    			t14 = space();
    			td10 = element("td");
    			t15 = text(t15_value);
    			attr_dev(td0, "colspan", "2");
    			attr_dev(td0, "class", "name svelte-1dmco9w");
    			set_style(td0, "background-color", /*player*/ ctx[0].color);
    			add_location(td0, file, 7, 12, 129);
    			add_location(tr0, file, 6, 8, 112);
    			if (img0.src !== (img0_src_value = "tree_item.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", img0_class_value = "player_" + /*player*/ ctx[0].index + "_tree" + " svelte-1dmco9w");
    			add_location(img0, file, 12, 16, 292);
    			attr_dev(td1, "class", "svelte-1dmco9w");
    			add_location(td1, file, 12, 12, 288);
    			attr_dev(td2, "class", "number svelte-1dmco9w");
    			add_location(td2, file, 14, 12, 391);
    			add_location(tr1, file, 11, 8, 271);
    			if (img1.src !== (img1_src_value = "mud_item.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", img1_class_value = "player_" + /*player*/ ctx[0].index + "_mud" + " svelte-1dmco9w");
    			add_location(img1, file, 17, 16, 481);
    			attr_dev(td3, "class", "svelte-1dmco9w");
    			add_location(td3, file, 17, 12, 477);
    			attr_dev(td4, "class", "number svelte-1dmco9w");
    			add_location(td4, file, 19, 12, 578);
    			add_location(tr2, file, 16, 8, 460);
    			if (img2.src !== (img2_src_value = "wheat_item.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", img2_class_value = "player_" + /*player*/ ctx[0].index + "_wheat" + " svelte-1dmco9w");
    			add_location(img2, file, 22, 16, 667);
    			attr_dev(td5, "class", "svelte-1dmco9w");
    			add_location(td5, file, 22, 12, 663);
    			attr_dev(td6, "class", "number svelte-1dmco9w");
    			add_location(td6, file, 24, 12, 768);
    			add_location(tr3, file, 21, 8, 646);
    			if (img3.src !== (img3_src_value = "sheep_item.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", img3_class_value = "player_" + /*player*/ ctx[0].index + "_sheep" + " svelte-1dmco9w");
    			add_location(img3, file, 27, 16, 859);
    			attr_dev(td7, "class", "svelte-1dmco9w");
    			add_location(td7, file, 27, 12, 855);
    			attr_dev(td8, "class", "number svelte-1dmco9w");
    			add_location(td8, file, 29, 12, 960);
    			add_location(tr4, file, 26, 8, 838);
    			if (img4.src !== (img4_src_value = "iron_item.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", img4_class_value = "player_" + /*player*/ ctx[0].index + "_iron" + " svelte-1dmco9w");
    			add_location(img4, file, 32, 16, 1051);
    			attr_dev(td9, "class", "svelte-1dmco9w");
    			add_location(td9, file, 32, 12, 1047);
    			attr_dev(td10, "class", "number svelte-1dmco9w");
    			add_location(td10, file, 34, 12, 1150);
    			add_location(tr5, file, 31, 8, 1030);
    			attr_dev(table, "class", "resource svelte-1dmco9w");
    			toggle_class(table, "turn", /*player*/ ctx[0].turn);
    			add_location(table, file, 5, 4, 54);
    			add_location(main, file, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, table);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, t0);
    			append_dev(table, t1);
    			append_dev(table, tr1);
    			append_dev(tr1, td1);
    			append_dev(td1, img0);
    			append_dev(tr1, t2);
    			append_dev(tr1, td2);
    			append_dev(td2, t3);
    			append_dev(table, t4);
    			append_dev(table, tr2);
    			append_dev(tr2, td3);
    			append_dev(td3, img1);
    			append_dev(tr2, t5);
    			append_dev(tr2, td4);
    			append_dev(td4, t6);
    			append_dev(table, t7);
    			append_dev(table, tr3);
    			append_dev(tr3, td5);
    			append_dev(td5, img2);
    			append_dev(tr3, t8);
    			append_dev(tr3, td6);
    			append_dev(td6, t9);
    			append_dev(table, t10);
    			append_dev(table, tr4);
    			append_dev(tr4, td7);
    			append_dev(td7, img3);
    			append_dev(tr4, t11);
    			append_dev(tr4, td8);
    			append_dev(td8, t12);
    			append_dev(table, t13);
    			append_dev(table, tr5);
    			append_dev(tr5, td9);
    			append_dev(td9, img4);
    			append_dev(tr5, t14);
    			append_dev(tr5, td10);
    			append_dev(td10, t15);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*player*/ 1 && t0_value !== (t0_value = /*player*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*player*/ 1) {
    				set_style(td0, "background-color", /*player*/ ctx[0].color);
    			}

    			if (dirty & /*player*/ 1 && img0_class_value !== (img0_class_value = "player_" + /*player*/ ctx[0].index + "_tree" + " svelte-1dmco9w")) {
    				attr_dev(img0, "class", img0_class_value);
    			}

    			if (dirty & /*player*/ 1 && t3_value !== (t3_value = /*player*/ ctx[0].resource.tree + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*player*/ 1 && img1_class_value !== (img1_class_value = "player_" + /*player*/ ctx[0].index + "_mud" + " svelte-1dmco9w")) {
    				attr_dev(img1, "class", img1_class_value);
    			}

    			if (dirty & /*player*/ 1 && t6_value !== (t6_value = /*player*/ ctx[0].resource.mud + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*player*/ 1 && img2_class_value !== (img2_class_value = "player_" + /*player*/ ctx[0].index + "_wheat" + " svelte-1dmco9w")) {
    				attr_dev(img2, "class", img2_class_value);
    			}

    			if (dirty & /*player*/ 1 && t9_value !== (t9_value = /*player*/ ctx[0].resource.wheat + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*player*/ 1 && img3_class_value !== (img3_class_value = "player_" + /*player*/ ctx[0].index + "_sheep" + " svelte-1dmco9w")) {
    				attr_dev(img3, "class", img3_class_value);
    			}

    			if (dirty & /*player*/ 1 && t12_value !== (t12_value = /*player*/ ctx[0].resource.sheep + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*player*/ 1 && img4_class_value !== (img4_class_value = "player_" + /*player*/ ctx[0].index + "_iron" + " svelte-1dmco9w")) {
    				attr_dev(img4, "class", img4_class_value);
    			}

    			if (dirty & /*player*/ 1 && t15_value !== (t15_value = /*player*/ ctx[0].resource.iron + "")) set_data_dev(t15, t15_value);

    			if (dirty & /*player*/ 1) {
    				toggle_class(table, "turn", /*player*/ ctx[0].turn);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Player", slots, []);
    	let { player } = $$props;
    	const writable_props = ["player"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("player" in $$props) $$invalidate(0, player = $$props.player);
    	};

    	$$self.$capture_state = () => ({ player });

    	$$self.$inject_state = $$props => {
    		if ("player" in $$props) $$invalidate(0, player = $$props.player);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [player];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { player: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*player*/ ctx[0] === undefined && !("player" in props)) {
    			console.warn("<Player> was created without expected prop 'player'");
    		}
    	}

    	get player() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set player(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const config = {
        debug: false,
        cell: {
            width: 180,
            height: 200,
            margin: 5
        },
        castle: {
            width: 40,
            height: 40,
        },
        load: {
            width: 40,
            height: 40,
        },
        number: {
            width: 80,
            height: 80,
        },
        buglar: {
            width: 120,
            height: 120,
        }
    };

    const camelToDash = str => str.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`);

    function toStyle (styleObject) {
        let style = '';

        Object.entries(styleObject)
            .forEach(([key, value]) => {
                let cssKey = camelToDash(key);
                style += `${cssKey}:${value};`;
            });

        return style;
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

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*!
      * Bootstrap v5.0.0-alpha2 (https://getbootstrap.com/)
      * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var bootstrap_esm_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}function e(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}function n(){return (n=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i]);}return t}).apply(this,arguments)}var i,o,r,s,a=function(t){do{t+=Math.floor(1e6*Math.random());}while(document.getElementById(t));return t},l=function(t){var e=t.getAttribute("data-target");if(!e||"#"===e){var n=t.getAttribute("href");e=n&&"#"!==n?n.trim():null;}return e},c=function(t){var e=l(t);return e&&document.querySelector(e)?e:null},u=function(t){var e=l(t);return e?document.querySelector(e):null},f=function(t){if(!t)return 0;var e=window.getComputedStyle(t),n=e.transitionDuration,i=e.transitionDelay,o=parseFloat(n),r=parseFloat(i);return o||r?(n=n.split(",")[0],i=i.split(",")[0],1e3*(parseFloat(n)+parseFloat(i))):0},h=function(t){t.dispatchEvent(new Event("transitionend"));},d=function(t){return (t[0]||t).nodeType},p=function(t,e){var n=!1,i=e+5;t.addEventListener("transitionend",(function e(){n=!0,t.removeEventListener("transitionend",e);})),setTimeout((function(){n||h(t);}),i);},g=function(t,e,n){Object.keys(n).forEach((function(i){var o,r=n[i],s=e[i],a=s&&d(s)?"element":null==(o=s)?""+o:{}.toString.call(o).match(/\s([a-z]+)/i)[1].toLowerCase();if(!new RegExp(r).test(a))throw new Error(t.toUpperCase()+': Option "'+i+'" provided type "'+a+'" but expected type "'+r+'".')}));},m=function(t){if(!t)return !1;if(t.style&&t.parentNode&&t.parentNode.style){var e=getComputedStyle(t),n=getComputedStyle(t.parentNode);return "none"!==e.display&&"none"!==n.display&&"hidden"!==e.visibility}return !1},v=function(){return function(){}},_=function(t){return t.offsetHeight},b=function(){var t=window.jQuery;return t&&!document.body.hasAttribute("data-no-jquery")?t:null},y=(i={},o=1,{set:function(t,e,n){void 0===t.bsKey&&(t.bsKey={key:e,id:o},o++),i[t.bsKey.id]=n;},get:function(t,e){if(!t||void 0===t.bsKey)return null;var n=t.bsKey;return n.key===e?i[n.id]:null},delete:function(t,e){if(void 0!==t.bsKey){var n=t.bsKey;n.key===e&&(delete i[n.id],delete t.bsKey);}}}),w=function(t,e,n){y.set(t,e,n);},E=function(t,e){return y.get(t,e)},T=function(t,e){y.delete(t,e);},L=Element.prototype.querySelectorAll,k=Element.prototype.querySelector,C=(r=new CustomEvent("Bootstrap",{cancelable:!0}),(s=document.createElement("div")).addEventListener("Bootstrap",(function(){return null})),r.preventDefault(),s.dispatchEvent(r),r.defaultPrevented),A=/:scope\b/;(function(){var t=document.createElement("div");try{t.querySelectorAll(":scope *");}catch(t){return !1}return !0})()||(L=function(t){if(!A.test(t))return this.querySelectorAll(t);var e=Boolean(this.id);e||(this.id=a("scope"));var n=null;try{t=t.replace(A,"#"+this.id),n=this.querySelectorAll(t);}finally{e||this.removeAttribute("id");}return n},k=function(t){if(!A.test(t))return this.querySelector(t);var e=L.call(this,t);return void 0!==e[0]?e[0]:null});var O=b(),S=/[^.]*(?=\..*)\.|.*/,D=/\..*/,x=/::\d+$/,N={},I=1,j={mouseenter:"mouseover",mouseleave:"mouseout"},P=["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"];function M(t,e){return e&&e+"::"+I++||t.uidEvent||I++}function H(t){var e=M(t);return t.uidEvent=e,N[e]=N[e]||{},N[e]}function B(t,e,n){void 0===n&&(n=null);for(var i=Object.keys(t),o=0,r=i.length;o<r;o++){var s=t[i[o]];if(s.originalHandler===e&&s.delegationSelector===n)return s}return null}function R(t,e,n){var i="string"==typeof e,o=i?n:e,r=t.replace(D,""),s=j[r];return s&&(r=s),P.indexOf(r)>-1||(r=t),[i,o,r]}function F(t,e,n,i,o){if("string"==typeof e&&t){n||(n=i,i=null);var r=R(e,n,i),s=r[0],a=r[1],l=r[2],c=H(t),u=c[l]||(c[l]={}),f=B(u,a,s?n:null);if(f)f.oneOff=f.oneOff&&o;else {var h=M(a,e.replace(S,"")),d=s?function(t,e,n){return function i(o){for(var r=t.querySelectorAll(e),s=o.target;s&&s!==this;s=s.parentNode)for(var a=r.length;a--;)if(r[a]===s)return o.delegateTarget=s,i.oneOff&&U.off(t,o.type,n),n.apply(s,[o]);return null}}(t,n,i):function(t,e){return function n(i){return i.delegateTarget=t,n.oneOff&&U.off(t,i.type,e),e.apply(t,[i])}}(t,n);d.delegationSelector=s?n:null,d.originalHandler=a,d.oneOff=o,d.uidEvent=h,u[h]=d,t.addEventListener(l,d,s);}}}function W(t,e,n,i,o){var r=B(e[n],i,o);r&&(t.removeEventListener(n,r,Boolean(o)),delete e[n][r.uidEvent]);}var U={on:function(t,e,n,i){F(t,e,n,i,!1);},one:function(t,e,n,i){F(t,e,n,i,!0);},off:function(t,e,n,i){if("string"==typeof e&&t){var o=R(e,n,i),r=o[0],s=o[1],a=o[2],l=a!==e,c=H(t),u="."===e.charAt(0);if(void 0===s){u&&Object.keys(c).forEach((function(n){!function(t,e,n,i){var o=e[n]||{};Object.keys(o).forEach((function(r){if(r.indexOf(i)>-1){var s=o[r];W(t,e,n,s.originalHandler,s.delegationSelector);}}));}(t,c,n,e.slice(1));}));var f=c[a]||{};Object.keys(f).forEach((function(n){var i=n.replace(x,"");if(!l||e.indexOf(i)>-1){var o=f[n];W(t,c,a,o.originalHandler,o.delegationSelector);}}));}else {if(!c||!c[a])return;W(t,c,a,s,r?n:null);}}},trigger:function(t,e,n){if("string"!=typeof e||!t)return null;var i,o=e.replace(D,""),r=e!==o,s=P.indexOf(o)>-1,a=!0,l=!0,c=!1,u=null;return r&&O&&(i=O.Event(e,n),O(t).trigger(i),a=!i.isPropagationStopped(),l=!i.isImmediatePropagationStopped(),c=i.isDefaultPrevented()),s?(u=document.createEvent("HTMLEvents")).initEvent(o,a,!0):u=new CustomEvent(e,{bubbles:a,cancelable:!0}),void 0!==n&&Object.keys(n).forEach((function(t){Object.defineProperty(u,t,{get:function(){return n[t]}});})),c&&(u.preventDefault(),C||Object.defineProperty(u,"defaultPrevented",{get:function(){return !0}})),l&&t.dispatchEvent(u),u.defaultPrevented&&void 0!==i&&i.preventDefault(),u}},Q="alert",V=function(){function t(t){this._element=t,this._element&&w(t,"bs.alert",this);}var n=t.prototype;return n.close=function(t){var e=t?this._getRootElement(t):this._element,n=this._triggerCloseEvent(e);null===n||n.defaultPrevented||this._removeElement(e);},n.dispose=function(){T(this._element,"bs.alert"),this._element=null;},n._getRootElement=function(t){return u(t)||t.closest(".alert")},n._triggerCloseEvent=function(t){return U.trigger(t,"close.bs.alert")},n._removeElement=function(t){var e=this;if(t.classList.remove("show"),t.classList.contains("fade")){var n=f(t);U.one(t,"transitionend",(function(){return e._destroyElement(t)})),p(t,n);}else this._destroyElement(t);},n._destroyElement=function(t){t.parentNode&&t.parentNode.removeChild(t),U.trigger(t,"closed.bs.alert");},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.alert");n||(n=new t(this)),"close"===e&&n[e](this);}))},t.handleDismiss=function(t){return function(e){e&&e.preventDefault(),t.close(this);}},t.getInstance=function(t){return E(t,"bs.alert")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}}]),t}();U.on(document,"click.bs.alert.data-api",'[data-dismiss="alert"]',V.handleDismiss(new V));var K=b();if(K){var Y=K.fn[Q];K.fn[Q]=V.jQueryInterface,K.fn[Q].Constructor=V,K.fn[Q].noConflict=function(){return K.fn[Q]=Y,V.jQueryInterface};}var q=function(){function t(t){this._element=t,w(t,"bs.button",this);}var n=t.prototype;return n.toggle=function(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"));},n.dispose=function(){T(this._element,"bs.button"),this._element=null;},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.button");n||(n=new t(this)),"toggle"===e&&n[e]();}))},t.getInstance=function(t){return E(t,"bs.button")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}}]),t}();U.on(document,"click.bs.button.data-api",'[data-toggle="button"]',(function(t){t.preventDefault();var e=t.target.closest('[data-toggle="button"]'),n=E(e,"bs.button");n||(n=new q(e)),n.toggle();}));var z=b();if(z){var X=z.fn.button;z.fn.button=q.jQueryInterface,z.fn.button.Constructor=q,z.fn.button.noConflict=function(){return z.fn.button=X,q.jQueryInterface};}function G(t){return "true"===t||"false"!==t&&(t===Number(t).toString()?Number(t):""===t||"null"===t?null:t)}function $(t){return t.replace(/[A-Z]/g,(function(t){return "-"+t.toLowerCase()}))}var Z={setDataAttribute:function(t,e,n){t.setAttribute("data-"+$(e),n);},removeDataAttribute:function(t,e){t.removeAttribute("data-"+$(e));},getDataAttributes:function(t){if(!t)return {};var e=n({},t.dataset);return Object.keys(e).forEach((function(t){e[t]=G(e[t]);})),e},getDataAttribute:function(t,e){return G(t.getAttribute("data-"+$(e)))},offset:function(t){var e=t.getBoundingClientRect();return {top:e.top+document.body.scrollTop,left:e.left+document.body.scrollLeft}},position:function(t){return {top:t.offsetTop,left:t.offsetLeft}},toggleClass:function(t,e){t&&(t.classList.contains(e)?t.classList.remove(e):t.classList.add(e));}},J={matches:function(t,e){return t.matches(e)},find:function(t,e){var n;return void 0===e&&(e=document.documentElement),(n=[]).concat.apply(n,L.call(e,t))},findOne:function(t,e){return void 0===e&&(e=document.documentElement),k.call(e,t)},children:function(t,e){var n,i=(n=[]).concat.apply(n,t.children);return i.filter((function(t){return t.matches(e)}))},parents:function(t,e){for(var n=[],i=t.parentNode;i&&i.nodeType===Node.ELEMENT_NODE&&3!==i.nodeType;)this.matches(i,e)&&n.push(i),i=i.parentNode;return n},prev:function(t,e){for(var n=t.previousElementSibling;n;){if(n.matches(e))return [n];n=n.previousElementSibling;}return []},next:function(t,e){for(var n=t.nextElementSibling;n;){if(this.matches(n,e))return [n];n=n.nextElementSibling;}return []}},tt="carousel",et=".bs.carousel",nt={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},it={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},ot={TOUCH:"touch",PEN:"pen"},rt=function(){function t(t,e){this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this.touchStartX=0,this.touchDeltaX=0,this._config=this._getConfig(e),this._element=t,this._indicatorsElement=J.findOne(".carousel-indicators",this._element),this._touchSupported="ontouchstart"in document.documentElement||navigator.maxTouchPoints>0,this._pointerEvent=Boolean(window.PointerEvent),this._addEventListeners(),w(t,"bs.carousel",this);}var i=t.prototype;return i.next=function(){this._isSliding||this._slide("next");},i.nextWhenVisible=function(){!document.hidden&&m(this._element)&&this.next();},i.prev=function(){this._isSliding||this._slide("prev");},i.pause=function(t){t||(this._isPaused=!0),J.findOne(".carousel-item-next, .carousel-item-prev",this._element)&&(h(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null;},i.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config&&this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval));},i.to=function(t){var e=this;this._activeElement=J.findOne(".active.carousel-item",this._element);var n=this._getItemIndex(this._activeElement);if(!(t>this._items.length-1||t<0))if(this._isSliding)U.one(this._element,"slid.bs.carousel",(function(){return e.to(t)}));else {if(n===t)return this.pause(),void this.cycle();var i=t>n?"next":"prev";this._slide(i,this._items[t]);}},i.dispose=function(){U.off(this._element,et),T(this._element,"bs.carousel"),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null;},i._getConfig=function(t){return t=n({},nt,t),g(tt,t,it),t},i._handleSwipe=function(){var t=Math.abs(this.touchDeltaX);if(!(t<=40)){var e=t/this.touchDeltaX;this.touchDeltaX=0,e>0&&this.prev(),e<0&&this.next();}},i._addEventListeners=function(){var t=this;this._config.keyboard&&U.on(this._element,"keydown.bs.carousel",(function(e){return t._keydown(e)})),"hover"===this._config.pause&&(U.on(this._element,"mouseenter.bs.carousel",(function(e){return t.pause(e)})),U.on(this._element,"mouseleave.bs.carousel",(function(e){return t.cycle(e)}))),this._config.touch&&this._touchSupported&&this._addTouchEventListeners();},i._addTouchEventListeners=function(){var t=this,e=function(e){t._pointerEvent&&ot[e.pointerType.toUpperCase()]?t.touchStartX=e.clientX:t._pointerEvent||(t.touchStartX=e.touches[0].clientX);},n=function(e){t._pointerEvent&&ot[e.pointerType.toUpperCase()]&&(t.touchDeltaX=e.clientX-t.touchStartX),t._handleSwipe(),"hover"===t._config.pause&&(t.pause(),t.touchTimeout&&clearTimeout(t.touchTimeout),t.touchTimeout=setTimeout((function(e){return t.cycle(e)}),500+t._config.interval));};J.find(".carousel-item img",this._element).forEach((function(t){U.on(t,"dragstart.bs.carousel",(function(t){return t.preventDefault()}));})),this._pointerEvent?(U.on(this._element,"pointerdown.bs.carousel",(function(t){return e(t)})),U.on(this._element,"pointerup.bs.carousel",(function(t){return n(t)})),this._element.classList.add("pointer-event")):(U.on(this._element,"touchstart.bs.carousel",(function(t){return e(t)})),U.on(this._element,"touchmove.bs.carousel",(function(e){return function(e){e.touches&&e.touches.length>1?t.touchDeltaX=0:t.touchDeltaX=e.touches[0].clientX-t.touchStartX;}(e)})),U.on(this._element,"touchend.bs.carousel",(function(t){return n(t)})));},i._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.key){case"ArrowLeft":t.preventDefault(),this.prev();break;case"ArrowRight":t.preventDefault(),this.next();}},i._getItemIndex=function(t){return this._items=t&&t.parentNode?J.find(".carousel-item",t.parentNode):[],this._items.indexOf(t)},i._getItemByDirection=function(t,e){var n="next"===t,i="prev"===t,o=this._getItemIndex(e),r=this._items.length-1;if((i&&0===o||n&&o===r)&&!this._config.wrap)return e;var s=(o+("prev"===t?-1:1))%this._items.length;return -1===s?this._items[this._items.length-1]:this._items[s]},i._triggerSlideEvent=function(t,e){var n=this._getItemIndex(t),i=this._getItemIndex(J.findOne(".active.carousel-item",this._element));return U.trigger(this._element,"slide.bs.carousel",{relatedTarget:t,direction:e,from:i,to:n})},i._setActiveIndicatorElement=function(t){if(this._indicatorsElement){for(var e=J.find(".active",this._indicatorsElement),n=0;n<e.length;n++)e[n].classList.remove("active");var i=this._indicatorsElement.children[this._getItemIndex(t)];i&&i.classList.add("active");}},i._slide=function(t,e){var n,i,o,r=this,s=J.findOne(".active.carousel-item",this._element),a=this._getItemIndex(s),l=e||s&&this._getItemByDirection(t,s),c=this._getItemIndex(l),u=Boolean(this._interval);if("next"===t?(n="carousel-item-left",i="carousel-item-next",o="left"):(n="carousel-item-right",i="carousel-item-prev",o="right"),l&&l.classList.contains("active"))this._isSliding=!1;else if(!this._triggerSlideEvent(l,o).defaultPrevented&&s&&l){if(this._isSliding=!0,u&&this.pause(),this._setActiveIndicatorElement(l),this._element.classList.contains("slide")){l.classList.add(i),_(l),s.classList.add(n),l.classList.add(n);var h=parseInt(l.getAttribute("data-interval"),10);h?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,this._config.interval=h):this._config.interval=this._config.defaultInterval||this._config.interval;var d=f(s);U.one(s,"transitionend",(function(){l.classList.remove(n,i),l.classList.add("active"),s.classList.remove("active",i,n),r._isSliding=!1,setTimeout((function(){U.trigger(r._element,"slid.bs.carousel",{relatedTarget:l,direction:o,from:a,to:c});}),0);})),p(s,d);}else s.classList.remove("active"),l.classList.add("active"),this._isSliding=!1,U.trigger(this._element,"slid.bs.carousel",{relatedTarget:l,direction:o,from:a,to:c});u&&this.cycle();}},t.carouselInterface=function(e,i){var o=E(e,"bs.carousel"),r=n({},nt,Z.getDataAttributes(e));"object"==typeof i&&(r=n({},r,i));var s="string"==typeof i?i:r.slide;if(o||(o=new t(e,r)),"number"==typeof i)o.to(i);else if("string"==typeof s){if(void 0===o[s])throw new TypeError('No method named "'+s+'"');o[s]();}else r.interval&&r.ride&&(o.pause(),o.cycle());},t.jQueryInterface=function(e){return this.each((function(){t.carouselInterface(this,e);}))},t.dataApiClickHandler=function(e){var i=u(this);if(i&&i.classList.contains("carousel")){var o=n({},Z.getDataAttributes(i),Z.getDataAttributes(this)),r=this.getAttribute("data-slide-to");r&&(o.interval=!1),t.carouselInterface(i,o),r&&E(i,"bs.carousel").to(r),e.preventDefault();}},t.getInstance=function(t){return E(t,"bs.carousel")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return nt}}]),t}();U.on(document,"click.bs.carousel.data-api","[data-slide], [data-slide-to]",rt.dataApiClickHandler),U.on(window,"load.bs.carousel.data-api",(function(){for(var t=J.find('[data-ride="carousel"]'),e=0,n=t.length;e<n;e++)rt.carouselInterface(t[e],E(t[e],"bs.carousel"));}));var st=b();if(st){var at=st.fn[tt];st.fn[tt]=rt.jQueryInterface,st.fn[tt].Constructor=rt,st.fn[tt].noConflict=function(){return st.fn[tt]=at,rt.jQueryInterface};}var lt="collapse",ct={toggle:!0,parent:""},ut={toggle:"boolean",parent:"(string|element)"},ft=function(){function t(t,e){this._isTransitioning=!1,this._element=t,this._config=this._getConfig(e),this._triggerArray=J.find('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]');for(var n=J.find('[data-toggle="collapse"]'),i=0,o=n.length;i<o;i++){var r=n[i],s=c(r),a=J.find(s).filter((function(e){return e===t}));null!==s&&a.length&&(this._selector=s,this._triggerArray.push(r));}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle(),w(t,"bs.collapse",this);}var i=t.prototype;return i.toggle=function(){this._element.classList.contains("show")?this.hide():this.show();},i.show=function(){var e=this;if(!this._isTransitioning&&!this._element.classList.contains("show")){var n,i;this._parent&&0===(n=J.find(".show, .collapsing",this._parent).filter((function(t){return "string"==typeof e._config.parent?t.getAttribute("data-parent")===e._config.parent:t.classList.contains("collapse")}))).length&&(n=null);var o=J.findOne(this._selector);if(n){var r=n.filter((function(t){return o!==t}));if((i=r[0]?E(r[0],"bs.collapse"):null)&&i._isTransitioning)return}if(!U.trigger(this._element,"show.bs.collapse").defaultPrevented){n&&n.forEach((function(e){o!==e&&t.collapseInterface(e,"hide"),i||w(e,"bs.collapse",null);}));var s=this._getDimension();this._element.classList.remove("collapse"),this._element.classList.add("collapsing"),this._element.style[s]=0,this._triggerArray.length&&this._triggerArray.forEach((function(t){t.classList.remove("collapsed"),t.setAttribute("aria-expanded",!0);})),this.setTransitioning(!0);var a="scroll"+(s[0].toUpperCase()+s.slice(1)),l=f(this._element);U.one(this._element,"transitionend",(function(){e._element.classList.remove("collapsing"),e._element.classList.add("collapse","show"),e._element.style[s]="",e.setTransitioning(!1),U.trigger(e._element,"shown.bs.collapse");})),p(this._element,l),this._element.style[s]=this._element[a]+"px";}}},i.hide=function(){var t=this;if(!this._isTransitioning&&this._element.classList.contains("show")&&!U.trigger(this._element,"hide.bs.collapse").defaultPrevented){var e=this._getDimension();this._element.style[e]=this._element.getBoundingClientRect()[e]+"px",_(this._element),this._element.classList.add("collapsing"),this._element.classList.remove("collapse","show");var n=this._triggerArray.length;if(n>0)for(var i=0;i<n;i++){var o=this._triggerArray[i],r=u(o);r&&!r.classList.contains("show")&&(o.classList.add("collapsed"),o.setAttribute("aria-expanded",!1));}this.setTransitioning(!0);this._element.style[e]="";var s=f(this._element);U.one(this._element,"transitionend",(function(){t.setTransitioning(!1),t._element.classList.remove("collapsing"),t._element.classList.add("collapse"),U.trigger(t._element,"hidden.bs.collapse");})),p(this._element,s);}},i.setTransitioning=function(t){this._isTransitioning=t;},i.dispose=function(){T(this._element,"bs.collapse"),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null;},i._getConfig=function(t){return (t=n({},ct,t)).toggle=Boolean(t.toggle),g(lt,t,ut),t},i._getDimension=function(){return this._element.classList.contains("width")?"width":"height"},i._getParent=function(){var t=this,e=this._config.parent;d(e)?void 0===e.jquery&&void 0===e[0]||(e=e[0]):e=J.findOne(e);var n='[data-toggle="collapse"][data-parent="'+e+'"]';return J.find(n,e).forEach((function(e){var n=u(e);t._addAriaAndCollapsedClass(n,[e]);})),e},i._addAriaAndCollapsedClass=function(t,e){if(t&&e.length){var n=t.classList.contains("show");e.forEach((function(t){n?t.classList.remove("collapsed"):t.classList.add("collapsed"),t.setAttribute("aria-expanded",n);}));}},t.collapseInterface=function(e,i){var o=E(e,"bs.collapse"),r=n({},ct,Z.getDataAttributes(e),"object"==typeof i&&i?i:{});if(!o&&r.toggle&&"string"==typeof i&&/show|hide/.test(i)&&(r.toggle=!1),o||(o=new t(e,r)),"string"==typeof i){if(void 0===o[i])throw new TypeError('No method named "'+i+'"');o[i]();}},t.jQueryInterface=function(e){return this.each((function(){t.collapseInterface(this,e);}))},t.getInstance=function(t){return E(t,"bs.collapse")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return ct}}]),t}();U.on(document,"click.bs.collapse.data-api",'[data-toggle="collapse"]',(function(t){"A"===t.target.tagName&&t.preventDefault();var e=Z.getDataAttributes(this),n=c(this);J.find(n).forEach((function(t){var n,i=E(t,"bs.collapse");i?(null===i._parent&&"string"==typeof e.parent&&(i._config.parent=e.parent,i._parent=i._getParent()),n="toggle"):n=e,ft.collapseInterface(t,n);}));}));var ht=b();if(ht){var dt=ht.fn[lt];ht.fn[lt]=ft.jQueryInterface,ht.fn[lt].Constructor=ft,ht.fn[lt].noConflict=function(){return ht.fn[lt]=dt,ft.jQueryInterface};}var pt="undefined"!=typeof window&&"undefined"!=typeof document&&"undefined"!=typeof navigator,gt=function(){for(var t=["Edge","Trident","Firefox"],e=0;e<t.length;e+=1)if(pt&&navigator.userAgent.indexOf(t[e])>=0)return 1;return 0}();var mt=pt&&window.Promise?function(t){var e=!1;return function(){e||(e=!0,window.Promise.resolve().then((function(){e=!1,t();})));}}:function(t){var e=!1;return function(){e||(e=!0,setTimeout((function(){e=!1,t();}),gt));}};function vt(t){return t&&"[object Function]"==={}.toString.call(t)}function _t(t,e){if(1!==t.nodeType)return [];var n=t.ownerDocument.defaultView.getComputedStyle(t,null);return e?n[e]:n}function bt(t){return "HTML"===t.nodeName?t:t.parentNode||t.host}function yt(t){if(!t)return document.body;switch(t.nodeName){case"HTML":case"BODY":return t.ownerDocument.body;case"#document":return t.body}var e=_t(t),n=e.overflow,i=e.overflowX,o=e.overflowY;return /(auto|scroll|overlay)/.test(n+o+i)?t:yt(bt(t))}function wt(t){return t&&t.referenceNode?t.referenceNode:t}var Et=pt&&!(!window.MSInputMethodContext||!document.documentMode),Tt=pt&&/MSIE 10/.test(navigator.userAgent);function Lt(t){return 11===t?Et:10===t?Tt:Et||Tt}function kt(t){if(!t)return document.documentElement;for(var e=Lt(10)?document.body:null,n=t.offsetParent||null;n===e&&t.nextElementSibling;)n=(t=t.nextElementSibling).offsetParent;var i=n&&n.nodeName;return i&&"BODY"!==i&&"HTML"!==i?-1!==["TH","TD","TABLE"].indexOf(n.nodeName)&&"static"===_t(n,"position")?kt(n):n:t?t.ownerDocument.documentElement:document.documentElement}function Ct(t){return null!==t.parentNode?Ct(t.parentNode):t}function At(t,e){if(!(t&&t.nodeType&&e&&e.nodeType))return document.documentElement;var n=t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING,i=n?t:e,o=n?e:t,r=document.createRange();r.setStart(i,0),r.setEnd(o,0);var s=r.commonAncestorContainer;if(t!==s&&e!==s||i.contains(o))return function(t){var e=t.nodeName;return "BODY"!==e&&("HTML"===e||kt(t.firstElementChild)===t)}(s)?s:kt(s);var a=Ct(t);return a.host?At(a.host,e):At(t,Ct(e).host)}function Ot(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top",n="top"===e?"scrollTop":"scrollLeft",i=t.nodeName;if("BODY"===i||"HTML"===i){var o=t.ownerDocument.documentElement,r=t.ownerDocument.scrollingElement||o;return r[n]}return t[n]}function St(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=Ot(e,"top"),o=Ot(e,"left"),r=n?-1:1;return t.top+=i*r,t.bottom+=i*r,t.left+=o*r,t.right+=o*r,t}function Dt(t,e){var n="x"===e?"Left":"Top",i="Left"===n?"Right":"Bottom";return parseFloat(t["border"+n+"Width"])+parseFloat(t["border"+i+"Width"])}function xt(t,e,n,i){return Math.max(e["offset"+t],e["scroll"+t],n["client"+t],n["offset"+t],n["scroll"+t],Lt(10)?parseInt(n["offset"+t])+parseInt(i["margin"+("Height"===t?"Top":"Left")])+parseInt(i["margin"+("Height"===t?"Bottom":"Right")]):0)}function Nt(t){var e=t.body,n=t.documentElement,i=Lt(10)&&getComputedStyle(n);return {height:xt("Height",e,n,i),width:xt("Width",e,n,i)}}var It=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},jt=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),Pt=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},Mt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i]);}return t};function Ht(t){return Mt({},t,{right:t.left+t.width,bottom:t.top+t.height})}function Bt(t){var e={};try{if(Lt(10)){e=t.getBoundingClientRect();var n=Ot(t,"top"),i=Ot(t,"left");e.top+=n,e.left+=i,e.bottom+=n,e.right+=i;}else e=t.getBoundingClientRect();}catch(t){}var o={left:e.left,top:e.top,width:e.right-e.left,height:e.bottom-e.top},r="HTML"===t.nodeName?Nt(t.ownerDocument):{},s=r.width||t.clientWidth||o.width,a=r.height||t.clientHeight||o.height,l=t.offsetWidth-s,c=t.offsetHeight-a;if(l||c){var u=_t(t);l-=Dt(u,"x"),c-=Dt(u,"y"),o.width-=l,o.height-=c;}return Ht(o)}function Rt(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=Lt(10),o="HTML"===e.nodeName,r=Bt(t),s=Bt(e),a=yt(t),l=_t(e),c=parseFloat(l.borderTopWidth),u=parseFloat(l.borderLeftWidth);n&&o&&(s.top=Math.max(s.top,0),s.left=Math.max(s.left,0));var f=Ht({top:r.top-s.top-c,left:r.left-s.left-u,width:r.width,height:r.height});if(f.marginTop=0,f.marginLeft=0,!i&&o){var h=parseFloat(l.marginTop),d=parseFloat(l.marginLeft);f.top-=c-h,f.bottom-=c-h,f.left-=u-d,f.right-=u-d,f.marginTop=h,f.marginLeft=d;}return (i&&!n?e.contains(a):e===a&&"BODY"!==a.nodeName)&&(f=St(f,e)),f}function Ft(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=t.ownerDocument.documentElement,i=Rt(t,n),o=Math.max(n.clientWidth,window.innerWidth||0),r=Math.max(n.clientHeight,window.innerHeight||0),s=e?0:Ot(n),a=e?0:Ot(n,"left"),l={top:s-i.top+i.marginTop,left:a-i.left+i.marginLeft,width:o,height:r};return Ht(l)}function Wt(t){var e=t.nodeName;if("BODY"===e||"HTML"===e)return !1;if("fixed"===_t(t,"position"))return !0;var n=bt(t);return !!n&&Wt(n)}function Ut(t){if(!t||!t.parentElement||Lt())return document.documentElement;for(var e=t.parentElement;e&&"none"===_t(e,"transform");)e=e.parentElement;return e||document.documentElement}function Qt(t,e,n,i){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],r={top:0,left:0},s=o?Ut(t):At(t,wt(e));if("viewport"===i)r=Ft(s,o);else {var a=void 0;"scrollParent"===i?"BODY"===(a=yt(bt(e))).nodeName&&(a=t.ownerDocument.documentElement):a="window"===i?t.ownerDocument.documentElement:i;var l=Rt(a,s,o);if("HTML"!==a.nodeName||Wt(s))r=l;else {var c=Nt(t.ownerDocument),u=c.height,f=c.width;r.top+=l.top-l.marginTop,r.bottom=u+l.top,r.left+=l.left-l.marginLeft,r.right=f+l.left;}}var h="number"==typeof(n=n||0);return r.left+=h?n:n.left||0,r.top+=h?n:n.top||0,r.right-=h?n:n.right||0,r.bottom-=h?n:n.bottom||0,r}function Vt(t){return t.width*t.height}function Kt(t,e,n,i,o){var r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;if(-1===t.indexOf("auto"))return t;var s=Qt(n,i,r,o),a={top:{width:s.width,height:e.top-s.top},right:{width:s.right-e.right,height:s.height},bottom:{width:s.width,height:s.bottom-e.bottom},left:{width:e.left-s.left,height:s.height}},l=Object.keys(a).map((function(t){return Mt({key:t},a[t],{area:Vt(a[t])})})).sort((function(t,e){return e.area-t.area})),c=l.filter((function(t){var e=t.width,i=t.height;return e>=n.clientWidth&&i>=n.clientHeight})),u=c.length>0?c[0].key:l[0].key,f=t.split("-")[1];return u+(f?"-"+f:"")}function Yt(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,o=i?Ut(e):At(e,wt(n));return Rt(n,o,i)}function qt(t){var e=t.ownerDocument.defaultView.getComputedStyle(t),n=parseFloat(e.marginTop||0)+parseFloat(e.marginBottom||0),i=parseFloat(e.marginLeft||0)+parseFloat(e.marginRight||0);return {width:t.offsetWidth+i,height:t.offsetHeight+n}}function zt(t){var e={left:"right",right:"left",bottom:"top",top:"bottom"};return t.replace(/left|right|bottom|top/g,(function(t){return e[t]}))}function Xt(t,e,n){n=n.split("-")[0];var i=qt(t),o={width:i.width,height:i.height},r=-1!==["right","left"].indexOf(n),s=r?"top":"left",a=r?"left":"top",l=r?"height":"width",c=r?"width":"height";return o[s]=e[s]+e[l]/2-i[l]/2,o[a]=n===a?e[a]-i[c]:e[zt(a)],o}function Gt(t,e){return Array.prototype.find?t.find(e):t.filter(e)[0]}function $t(t,e,n){return (void 0===n?t:t.slice(0,function(t,e,n){if(Array.prototype.findIndex)return t.findIndex((function(t){return t[e]===n}));var i=Gt(t,(function(t){return t[e]===n}));return t.indexOf(i)}(t,"name",n))).forEach((function(t){t.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var n=t.function||t.fn;t.enabled&&vt(n)&&(e.offsets.popper=Ht(e.offsets.popper),e.offsets.reference=Ht(e.offsets.reference),e=n(e,t));})),e}function Zt(){if(!this.state.isDestroyed){var t={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};t.offsets.reference=Yt(this.state,this.popper,this.reference,this.options.positionFixed),t.placement=Kt(this.options.placement,t.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),t.originalPlacement=t.placement,t.positionFixed=this.options.positionFixed,t.offsets.popper=Xt(this.popper,t.offsets.reference,t.placement),t.offsets.popper.position=this.options.positionFixed?"fixed":"absolute",t=$t(this.modifiers,t),this.state.isCreated?this.options.onUpdate(t):(this.state.isCreated=!0,this.options.onCreate(t));}}function Jt(t,e){return t.some((function(t){var n=t.name;return t.enabled&&n===e}))}function te(t){for(var e=[!1,"ms","Webkit","Moz","O"],n=t.charAt(0).toUpperCase()+t.slice(1),i=0;i<e.length;i++){var o=e[i],r=o?""+o+n:t;if(void 0!==document.body.style[r])return r}return null}function ee(){return this.state.isDestroyed=!0,Jt(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.position="",this.popper.style.top="",this.popper.style.left="",this.popper.style.right="",this.popper.style.bottom="",this.popper.style.willChange="",this.popper.style[te("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function ne(t){var e=t.ownerDocument;return e?e.defaultView:window}function ie(t,e,n,i){n.updateBound=i,ne(t).addEventListener("resize",n.updateBound,{passive:!0});var o=yt(t);return function t(e,n,i,o){var r="BODY"===e.nodeName,s=r?e.ownerDocument.defaultView:e;s.addEventListener(n,i,{passive:!0}),r||t(yt(s.parentNode),n,i,o),o.push(s);}(o,"scroll",n.updateBound,n.scrollParents),n.scrollElement=o,n.eventsEnabled=!0,n}function oe(){this.state.eventsEnabled||(this.state=ie(this.reference,this.options,this.state,this.scheduleUpdate));}function re(){var t,e;this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=(t=this.reference,e=this.state,ne(t).removeEventListener("resize",e.updateBound),e.scrollParents.forEach((function(t){t.removeEventListener("scroll",e.updateBound);})),e.updateBound=null,e.scrollParents=[],e.scrollElement=null,e.eventsEnabled=!1,e));}function se(t){return ""!==t&&!isNaN(parseFloat(t))&&isFinite(t)}function ae(t,e){Object.keys(e).forEach((function(n){var i="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&se(e[n])&&(i="px"),t.style[n]=e[n]+i;}));}var le=pt&&/Firefox/i.test(navigator.userAgent);function ce(t,e,n){var i=Gt(t,(function(t){return t.name===e})),o=!!i&&t.some((function(t){return t.name===n&&t.enabled&&t.order<i.order}));if(!o){var r="`"+e+"`",s="`"+n+"`";console.warn(s+" modifier is required by "+r+" modifier in order to work, be sure to include it before "+r+"!");}return o}var ue=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],fe=ue.slice(3);function he(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=fe.indexOf(t),i=fe.slice(n+1).concat(fe.slice(0,n));return e?i.reverse():i}var de="flip",pe="clockwise",ge="counterclockwise";function me(t,e,n,i){var o=[0,0],r=-1!==["right","left"].indexOf(i),s=t.split(/(\+|\-)/).map((function(t){return t.trim()})),a=s.indexOf(Gt(s,(function(t){return -1!==t.search(/,|\s/)})));s[a]&&-1===s[a].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");var l=/\s*,\s*|\s+/,c=-1!==a?[s.slice(0,a).concat([s[a].split(l)[0]]),[s[a].split(l)[1]].concat(s.slice(a+1))]:[s];return (c=c.map((function(t,i){var o=(1===i?!r:r)?"height":"width",s=!1;return t.reduce((function(t,e){return ""===t[t.length-1]&&-1!==["+","-"].indexOf(e)?(t[t.length-1]=e,s=!0,t):s?(t[t.length-1]+=e,s=!1,t):t.concat(e)}),[]).map((function(t){return function(t,e,n,i){var o=t.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+o[1],s=o[2];if(!r)return t;if(0===s.indexOf("%")){var a=void 0;switch(s){case"%p":a=n;break;case"%":case"%r":default:a=i;}return Ht(a)[e]/100*r}if("vh"===s||"vw"===s)return ("vh"===s?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*r;return r}(t,o,e,n)}))}))).forEach((function(t,e){t.forEach((function(n,i){se(n)&&(o[e]+=n*("-"===t[i-1]?-1:1));}));})),o}var ve={placement:"bottom",positionFixed:!1,eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:function(t){var e=t.placement,n=e.split("-")[0],i=e.split("-")[1];if(i){var o=t.offsets,r=o.reference,s=o.popper,a=-1!==["bottom","top"].indexOf(n),l=a?"left":"top",c=a?"width":"height",u={start:Pt({},l,r[l]),end:Pt({},l,r[l]+r[c]-s[c])};t.offsets.popper=Mt({},s,u[i]);}return t}},offset:{order:200,enabled:!0,fn:function(t,e){var n=e.offset,i=t.placement,o=t.offsets,r=o.popper,s=o.reference,a=i.split("-")[0],l=void 0;return l=se(+n)?[+n,0]:me(n,r,s,a),"left"===a?(r.top+=l[0],r.left-=l[1]):"right"===a?(r.top+=l[0],r.left+=l[1]):"top"===a?(r.left+=l[0],r.top-=l[1]):"bottom"===a&&(r.left+=l[0],r.top+=l[1]),t.popper=r,t},offset:0},preventOverflow:{order:300,enabled:!0,fn:function(t,e){var n=e.boundariesElement||kt(t.instance.popper);t.instance.reference===n&&(n=kt(n));var i=te("transform"),o=t.instance.popper.style,r=o.top,s=o.left,a=o[i];o.top="",o.left="",o[i]="";var l=Qt(t.instance.popper,t.instance.reference,e.padding,n,t.positionFixed);o.top=r,o.left=s,o[i]=a,e.boundaries=l;var c=e.priority,u=t.offsets.popper,f={primary:function(t){var n=u[t];return u[t]<l[t]&&!e.escapeWithReference&&(n=Math.max(u[t],l[t])),Pt({},t,n)},secondary:function(t){var n="right"===t?"left":"top",i=u[n];return u[t]>l[t]&&!e.escapeWithReference&&(i=Math.min(u[n],l[t]-("right"===t?u.width:u.height))),Pt({},n,i)}};return c.forEach((function(t){var e=-1!==["left","top"].indexOf(t)?"primary":"secondary";u=Mt({},u,f[e](t));})),t.offsets.popper=u,t},priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:function(t){var e=t.offsets,n=e.popper,i=e.reference,o=t.placement.split("-")[0],r=Math.floor,s=-1!==["top","bottom"].indexOf(o),a=s?"right":"bottom",l=s?"left":"top",c=s?"width":"height";return n[a]<r(i[l])&&(t.offsets.popper[l]=r(i[l])-n[c]),n[l]>r(i[a])&&(t.offsets.popper[l]=r(i[a])),t}},arrow:{order:500,enabled:!0,fn:function(t,e){var n;if(!ce(t.instance.modifiers,"arrow","keepTogether"))return t;var i=e.element;if("string"==typeof i){if(!(i=t.instance.popper.querySelector(i)))return t}else if(!t.instance.popper.contains(i))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),t;var o=t.placement.split("-")[0],r=t.offsets,s=r.popper,a=r.reference,l=-1!==["left","right"].indexOf(o),c=l?"height":"width",u=l?"Top":"Left",f=u.toLowerCase(),h=l?"left":"top",d=l?"bottom":"right",p=qt(i)[c];a[d]-p<s[f]&&(t.offsets.popper[f]-=s[f]-(a[d]-p)),a[f]+p>s[d]&&(t.offsets.popper[f]+=a[f]+p-s[d]),t.offsets.popper=Ht(t.offsets.popper);var g=a[f]+a[c]/2-p/2,m=_t(t.instance.popper),v=parseFloat(m["margin"+u]),_=parseFloat(m["border"+u+"Width"]),b=g-t.offsets.popper[f]-v-_;return b=Math.max(Math.min(s[c]-p,b),0),t.arrowElement=i,t.offsets.arrow=(Pt(n={},f,Math.round(b)),Pt(n,h,""),n),t},element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:function(t,e){if(Jt(t.instance.modifiers,"inner"))return t;if(t.flipped&&t.placement===t.originalPlacement)return t;var n=Qt(t.instance.popper,t.instance.reference,e.padding,e.boundariesElement,t.positionFixed),i=t.placement.split("-")[0],o=zt(i),r=t.placement.split("-")[1]||"",s=[];switch(e.behavior){case de:s=[i,o];break;case pe:s=he(i);break;case ge:s=he(i,!0);break;default:s=e.behavior;}return s.forEach((function(a,l){if(i!==a||s.length===l+1)return t;i=t.placement.split("-")[0],o=zt(i);var c=t.offsets.popper,u=t.offsets.reference,f=Math.floor,h="left"===i&&f(c.right)>f(u.left)||"right"===i&&f(c.left)<f(u.right)||"top"===i&&f(c.bottom)>f(u.top)||"bottom"===i&&f(c.top)<f(u.bottom),d=f(c.left)<f(n.left),p=f(c.right)>f(n.right),g=f(c.top)<f(n.top),m=f(c.bottom)>f(n.bottom),v="left"===i&&d||"right"===i&&p||"top"===i&&g||"bottom"===i&&m,_=-1!==["top","bottom"].indexOf(i),b=!!e.flipVariations&&(_&&"start"===r&&d||_&&"end"===r&&p||!_&&"start"===r&&g||!_&&"end"===r&&m),y=!!e.flipVariationsByContent&&(_&&"start"===r&&p||_&&"end"===r&&d||!_&&"start"===r&&m||!_&&"end"===r&&g),w=b||y;(h||v||w)&&(t.flipped=!0,(h||v)&&(i=s[l+1]),w&&(r=function(t){return "end"===t?"start":"start"===t?"end":t}(r)),t.placement=i+(r?"-"+r:""),t.offsets.popper=Mt({},t.offsets.popper,Xt(t.instance.popper,t.offsets.reference,t.placement)),t=$t(t.instance.modifiers,t,"flip"));})),t},behavior:"flip",padding:5,boundariesElement:"viewport",flipVariations:!1,flipVariationsByContent:!1},inner:{order:700,enabled:!1,fn:function(t){var e=t.placement,n=e.split("-")[0],i=t.offsets,o=i.popper,r=i.reference,s=-1!==["left","right"].indexOf(n),a=-1===["top","left"].indexOf(n);return o[s?"left":"top"]=r[n]-(a?o[s?"width":"height"]:0),t.placement=zt(e),t.offsets.popper=Ht(o),t}},hide:{order:800,enabled:!0,fn:function(t){if(!ce(t.instance.modifiers,"hide","preventOverflow"))return t;var e=t.offsets.reference,n=Gt(t.instance.modifiers,(function(t){return "preventOverflow"===t.name})).boundaries;if(e.bottom<n.top||e.left>n.right||e.top>n.bottom||e.right<n.left){if(!0===t.hide)return t;t.hide=!0,t.attributes["x-out-of-boundaries"]="";}else {if(!1===t.hide)return t;t.hide=!1,t.attributes["x-out-of-boundaries"]=!1;}return t}},computeStyle:{order:850,enabled:!0,fn:function(t,e){var n=e.x,i=e.y,o=t.offsets.popper,r=Gt(t.instance.modifiers,(function(t){return "applyStyle"===t.name})).gpuAcceleration;void 0!==r&&console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");var s=void 0!==r?r:e.gpuAcceleration,a=kt(t.instance.popper),l=Bt(a),c={position:o.position},u=function(t,e){var n=t.offsets,i=n.popper,o=n.reference,r=Math.round,s=Math.floor,a=function(t){return t},l=r(o.width),c=r(i.width),u=-1!==["left","right"].indexOf(t.placement),f=-1!==t.placement.indexOf("-"),h=e?u||f||l%2==c%2?r:s:a,d=e?r:a;return {left:h(l%2==1&&c%2==1&&!f&&e?i.left-1:i.left),top:d(i.top),bottom:d(i.bottom),right:h(i.right)}}(t,window.devicePixelRatio<2||!le),f="bottom"===n?"top":"bottom",h="right"===i?"left":"right",d=te("transform"),p=void 0,g=void 0;if(g="bottom"===f?"HTML"===a.nodeName?-a.clientHeight+u.bottom:-l.height+u.bottom:u.top,p="right"===h?"HTML"===a.nodeName?-a.clientWidth+u.right:-l.width+u.right:u.left,s&&d)c[d]="translate3d("+p+"px, "+g+"px, 0)",c[f]=0,c[h]=0,c.willChange="transform";else {var m="bottom"===f?-1:1,v="right"===h?-1:1;c[f]=g*m,c[h]=p*v,c.willChange=f+", "+h;}var _={"x-placement":t.placement};return t.attributes=Mt({},_,t.attributes),t.styles=Mt({},c,t.styles),t.arrowStyles=Mt({},t.offsets.arrow,t.arrowStyles),t},gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:function(t){return ae(t.instance.popper,t.styles),function(t,e){Object.keys(e).forEach((function(n){!1!==e[n]?t.setAttribute(n,e[n]):t.removeAttribute(n);}));}(t.instance.popper,t.attributes),t.arrowElement&&Object.keys(t.arrowStyles).length&&ae(t.arrowElement,t.arrowStyles),t},onLoad:function(t,e,n,i,o){var r=Yt(o,e,t,n.positionFixed),s=Kt(n.placement,r,e,t,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return e.setAttribute("x-placement",s),ae(e,{position:n.positionFixed?"fixed":"absolute"}),n},gpuAcceleration:void 0}}},_e=function(){function t(e,n){var i=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};It(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(i.update)},this.update=mt(this.update.bind(this)),this.options=Mt({},t.Defaults,o),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=e&&e.jquery?e[0]:e,this.popper=n&&n.jquery?n[0]:n,this.options.modifiers={},Object.keys(Mt({},t.Defaults.modifiers,o.modifiers)).forEach((function(e){i.options.modifiers[e]=Mt({},t.Defaults.modifiers[e]||{},o.modifiers?o.modifiers[e]:{});})),this.modifiers=Object.keys(this.options.modifiers).map((function(t){return Mt({name:t},i.options.modifiers[t])})).sort((function(t,e){return t.order-e.order})),this.modifiers.forEach((function(t){t.enabled&&vt(t.onLoad)&&t.onLoad(i.reference,i.popper,i.options,t,i.state);})),this.update();var r=this.options.eventsEnabled;r&&this.enableEventListeners(),this.state.eventsEnabled=r;}return jt(t,[{key:"update",value:function(){return Zt.call(this)}},{key:"destroy",value:function(){return ee.call(this)}},{key:"enableEventListeners",value:function(){return oe.call(this)}},{key:"disableEventListeners",value:function(){return re.call(this)}}]),t}();_e.Utils=("undefined"!=typeof window?window:commonjsGlobal).PopperUtils,_e.placements=ue,_e.Defaults=ve;var be="dropdown",ye=new RegExp("ArrowUp|ArrowDown|Escape"),we={offset:0,flip:!0,boundary:"scrollParent",reference:"toggle",display:"dynamic",popperConfig:null},Ee={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)",display:"string",popperConfig:"(null|object)"},Te=function(){function t(t,e){this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners(),w(t,"bs.dropdown",this);}var i=t.prototype;return i.toggle=function(){if(!this._element.disabled&&!this._element.classList.contains("disabled")){var e=this._element.classList.contains("show");t.clearMenus(),e||this.show();}},i.show=function(){if(!(this._element.disabled||this._element.classList.contains("disabled")||this._menu.classList.contains("show"))){var e=t.getParentFromElement(this._element),n={relatedTarget:this._element};if(!U.trigger(this._element,"show.bs.dropdown",n).defaultPrevented){if(!this._inNavbar){if(void 0===_e)throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org)");var i=this._element;"parent"===this._config.reference?i=e:d(this._config.reference)&&(i=this._config.reference,void 0!==this._config.reference.jquery&&(i=this._config.reference[0])),"scrollParent"!==this._config.boundary&&e.classList.add("position-static"),this._popper=new _e(i,this._menu,this._getPopperConfig());}var o;if("ontouchstart"in document.documentElement&&!e.closest(".navbar-nav"))(o=[]).concat.apply(o,document.body.children).forEach((function(t){return U.on(t,"mouseover",null,(function(){}))}));this._element.focus(),this._element.setAttribute("aria-expanded",!0),Z.toggleClass(this._menu,"show"),Z.toggleClass(this._element,"show"),U.trigger(e,"shown.bs.dropdown",n);}}},i.hide=function(){if(!this._element.disabled&&!this._element.classList.contains("disabled")&&this._menu.classList.contains("show")){var e=t.getParentFromElement(this._element),n={relatedTarget:this._element};U.trigger(e,"hide.bs.dropdown",n).defaultPrevented||(this._popper&&this._popper.destroy(),Z.toggleClass(this._menu,"show"),Z.toggleClass(this._element,"show"),U.trigger(e,"hidden.bs.dropdown",n));}},i.dispose=function(){T(this._element,"bs.dropdown"),U.off(this._element,".bs.dropdown"),this._element=null,this._menu=null,this._popper&&(this._popper.destroy(),this._popper=null);},i.update=function(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.scheduleUpdate();},i._addEventListeners=function(){var t=this;U.on(this._element,"click.bs.dropdown",(function(e){e.preventDefault(),e.stopPropagation(),t.toggle();}));},i._getConfig=function(t){return t=n({},this.constructor.Default,Z.getDataAttributes(this._element),t),g(be,t,this.constructor.DefaultType),t},i._getMenuElement=function(){return J.next(this._element,".dropdown-menu")[0]},i._getPlacement=function(){var t=this._element.parentNode,e="bottom-start";return t.classList.contains("dropup")?(e="top-start",this._menu.classList.contains("dropdown-menu-right")&&(e="top-end")):t.classList.contains("dropright")?e="right-start":t.classList.contains("dropleft")?e="left-start":this._menu.classList.contains("dropdown-menu-right")&&(e="bottom-end"),e},i._detectNavbar=function(){return Boolean(this._element.closest(".navbar"))},i._getOffset=function(){var t=this,e={};return "function"==typeof this._config.offset?e.fn=function(e){return e.offsets=n({},e.offsets,t._config.offset(e.offsets,t._element)||{}),e}:e.offset=this._config.offset,e},i._getPopperConfig=function(){var t={placement:this._getPlacement(),modifiers:{offset:this._getOffset(),flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return "static"===this._config.display&&(t.modifiers.applyStyle={enabled:!1}),n({},t,this._config.popperConfig)},t.dropdownInterface=function(e,n){var i=E(e,"bs.dropdown");if(i||(i=new t(e,"object"==typeof n?n:null)),"string"==typeof n){if(void 0===i[n])throw new TypeError('No method named "'+n+'"');i[n]();}},t.jQueryInterface=function(e){return this.each((function(){t.dropdownInterface(this,e);}))},t.clearMenus=function(e){if(!e||2!==e.button&&("keyup"!==e.type||"Tab"===e.key))for(var n=J.find('[data-toggle="dropdown"]'),i=0,o=n.length;i<o;i++){var r=t.getParentFromElement(n[i]),s=E(n[i],"bs.dropdown"),a={relatedTarget:n[i]};if(e&&"click"===e.type&&(a.clickEvent=e),s){var l=s._menu;if(n[i].classList.contains("show"))if(!(e&&("click"===e.type&&/input|textarea/i.test(e.target.tagName)||"keyup"===e.type&&"Tab"===e.key)&&l.contains(e.target)))if(!U.trigger(r,"hide.bs.dropdown",a).defaultPrevented){var c;if("ontouchstart"in document.documentElement)(c=[]).concat.apply(c,document.body.children).forEach((function(t){return U.off(t,"mouseover",null,(function(){}))}));n[i].setAttribute("aria-expanded","false"),s._popper&&s._popper.destroy(),l.classList.remove("show"),n[i].classList.remove("show"),U.trigger(r,"hidden.bs.dropdown",a);}}}},t.getParentFromElement=function(t){return u(t)||t.parentNode},t.dataApiKeydownHandler=function(e){if(!(/input|textarea/i.test(e.target.tagName)?"Space"===e.key||"Escape"!==e.key&&("ArrowDown"!==e.key&&"ArrowUp"!==e.key||e.target.closest(".dropdown-menu")):!ye.test(e.key))&&(e.preventDefault(),e.stopPropagation(),!this.disabled&&!this.classList.contains("disabled"))){var n=t.getParentFromElement(this),i=this.classList.contains("show");if("Escape"===e.key)return (this.matches('[data-toggle="dropdown"]')?this:J.prev(this,'[data-toggle="dropdown"]')[0]).focus(),void t.clearMenus();if(i&&"Space"!==e.key){var o=J.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",n).filter(m);if(o.length){var r=o.indexOf(e.target);"ArrowUp"===e.key&&r>0&&r--,"ArrowDown"===e.key&&r<o.length-1&&r++,o[r=-1===r?0:r].focus();}}else t.clearMenus();}},t.getInstance=function(t){return E(t,"bs.dropdown")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return we}},{key:"DefaultType",get:function(){return Ee}}]),t}();U.on(document,"keydown.bs.dropdown.data-api",'[data-toggle="dropdown"]',Te.dataApiKeydownHandler),U.on(document,"keydown.bs.dropdown.data-api",".dropdown-menu",Te.dataApiKeydownHandler),U.on(document,"click.bs.dropdown.data-api",Te.clearMenus),U.on(document,"keyup.bs.dropdown.data-api",Te.clearMenus),U.on(document,"click.bs.dropdown.data-api",'[data-toggle="dropdown"]',(function(t){t.preventDefault(),t.stopPropagation(),Te.dropdownInterface(this,"toggle");})),U.on(document,"click.bs.dropdown.data-api",".dropdown form",(function(t){return t.stopPropagation()}));var Le=b();if(Le){var ke=Le.fn[be];Le.fn[be]=Te.jQueryInterface,Le.fn[be].Constructor=Te,Le.fn[be].noConflict=function(){return Le.fn[be]=ke,Te.jQueryInterface};}var Ce={backdrop:!0,keyboard:!0,focus:!0,show:!0},Ae={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},Oe=function(){function t(t,e){this._config=this._getConfig(e),this._element=t,this._dialog=J.findOne(".modal-dialog",t),this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._isTransitioning=!1,this._scrollbarWidth=0,w(t,"bs.modal",this);}var i=t.prototype;return i.toggle=function(t){return this._isShown?this.hide():this.show(t)},i.show=function(t){var e=this;if(!this._isShown&&!this._isTransitioning){this._element.classList.contains("fade")&&(this._isTransitioning=!0);var n=U.trigger(this._element,"show.bs.modal",{relatedTarget:t});this._isShown||n.defaultPrevented||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),U.on(this._element,"click.dismiss.bs.modal",'[data-dismiss="modal"]',(function(t){return e.hide(t)})),U.on(this._dialog,"mousedown.dismiss.bs.modal",(function(){U.one(e._element,"mouseup.dismiss.bs.modal",(function(t){t.target===e._element&&(e._ignoreBackdropClick=!0);}));})),this._showBackdrop((function(){return e._showElement(t)})));}},i.hide=function(t){var e=this;if((t&&t.preventDefault(),this._isShown&&!this._isTransitioning)&&!U.trigger(this._element,"hide.bs.modal").defaultPrevented){this._isShown=!1;var n=this._element.classList.contains("fade");if(n&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),U.off(document,"focusin.bs.modal"),this._element.classList.remove("show"),U.off(this._element,"click.dismiss.bs.modal"),U.off(this._dialog,"mousedown.dismiss.bs.modal"),n){var i=f(this._element);U.one(this._element,"transitionend",(function(t){return e._hideModal(t)})),p(this._element,i);}else this._hideModal();}},i.dispose=function(){[window,this._element,this._dialog].forEach((function(t){return U.off(t,".bs.modal")})),U.off(document,"focusin.bs.modal"),T(this._element,"bs.modal"),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._isTransitioning=null,this._scrollbarWidth=null;},i.handleUpdate=function(){this._adjustDialog();},i._getConfig=function(t){return t=n({},Ce,t),g("modal",t,Ae),t},i._showElement=function(t){var e=this,n=this._element.classList.contains("fade"),i=J.findOne(".modal-body",this._dialog);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0,i&&(i.scrollTop=0),n&&_(this._element),this._element.classList.add("show"),this._config.focus&&this._enforceFocus();var o=function(){e._config.focus&&e._element.focus(),e._isTransitioning=!1,U.trigger(e._element,"shown.bs.modal",{relatedTarget:t});};if(n){var r=f(this._dialog);U.one(this._dialog,"transitionend",o),p(this._dialog,r);}else o();},i._enforceFocus=function(){var t=this;U.off(document,"focusin.bs.modal"),U.on(document,"focusin.bs.modal",(function(e){document===e.target||t._element===e.target||t._element.contains(e.target)||t._element.focus();}));},i._setEscapeEvent=function(){var t=this;this._isShown?U.on(this._element,"keydown.dismiss.bs.modal",(function(e){t._config.keyboard&&"Escape"===e.key?(e.preventDefault(),t.hide()):t._config.keyboard||"Escape"!==e.key||t._triggerBackdropTransition();})):U.off(this._element,"keydown.dismiss.bs.modal");},i._setResizeEvent=function(){var t=this;this._isShown?U.on(window,"resize.bs.modal",(function(){return t._adjustDialog()})):U.off(window,"resize.bs.modal");},i._hideModal=function(){var t=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._showBackdrop((function(){document.body.classList.remove("modal-open"),t._resetAdjustments(),t._resetScrollbar(),U.trigger(t._element,"hidden.bs.modal");}));},i._removeBackdrop=function(){this._backdrop.parentNode.removeChild(this._backdrop),this._backdrop=null;},i._showBackdrop=function(t){var e=this,n=this._element.classList.contains("fade")?"fade":"";if(this._isShown&&this._config.backdrop){if(this._backdrop=document.createElement("div"),this._backdrop.className="modal-backdrop",n&&this._backdrop.classList.add(n),document.body.appendChild(this._backdrop),U.on(this._element,"click.dismiss.bs.modal",(function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&e._triggerBackdropTransition();})),n&&_(this._backdrop),this._backdrop.classList.add("show"),!n)return void t();var i=f(this._backdrop);U.one(this._backdrop,"transitionend",t),p(this._backdrop,i);}else if(!this._isShown&&this._backdrop){this._backdrop.classList.remove("show");var o=function(){e._removeBackdrop(),t();};if(this._element.classList.contains("fade")){var r=f(this._backdrop);U.one(this._backdrop,"transitionend",o),p(this._backdrop,r);}else o();}else t();},i._triggerBackdropTransition=function(){var t=this;if("static"===this._config.backdrop){if(U.trigger(this._element,"hidePrevented.bs.modal").defaultPrevented)return;var e=this._element.scrollHeight>document.documentElement.clientHeight;e||(this._element.style.overflowY="hidden"),this._element.classList.add("modal-static");var n=f(this._dialog);U.off(this._element,"transitionend"),U.one(this._element,"transitionend",(function(){t._element.classList.remove("modal-static"),e||(U.one(t._element,"transitionend",(function(){t._element.style.overflowY="";})),p(t._element,n));})),p(this._element,n),this._element.focus();}else this.hide();},i._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+"px");},i._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight="";},i._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=Math.round(t.left+t.right)<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth();},i._setScrollbar=function(){var t=this;if(this._isBodyOverflowing){J.find(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top").forEach((function(e){var n=e.style.paddingRight,i=window.getComputedStyle(e)["padding-right"];Z.setDataAttribute(e,"padding-right",n),e.style.paddingRight=parseFloat(i)+t._scrollbarWidth+"px";})),J.find(".sticky-top").forEach((function(e){var n=e.style.marginRight,i=window.getComputedStyle(e)["margin-right"];Z.setDataAttribute(e,"margin-right",n),e.style.marginRight=parseFloat(i)-t._scrollbarWidth+"px";}));var e=document.body.style.paddingRight,n=window.getComputedStyle(document.body)["padding-right"];Z.setDataAttribute(document.body,"padding-right",e),document.body.style.paddingRight=parseFloat(n)+this._scrollbarWidth+"px";}document.body.classList.add("modal-open");},i._resetScrollbar=function(){J.find(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top").forEach((function(t){var e=Z.getDataAttribute(t,"padding-right");void 0!==e&&(Z.removeDataAttribute(t,"padding-right"),t.style.paddingRight=e);})),J.find(".sticky-top").forEach((function(t){var e=Z.getDataAttribute(t,"margin-right");void 0!==e&&(Z.removeDataAttribute(t,"margin-right"),t.style.marginRight=e);}));var t=Z.getDataAttribute(document.body,"padding-right");void 0===t?document.body.style.paddingRight="":(Z.removeDataAttribute(document.body,"padding-right"),document.body.style.paddingRight=t);},i._getScrollbarWidth=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},t.jQueryInterface=function(e,i){return this.each((function(){var o=E(this,"bs.modal"),r=n({},Ce,Z.getDataAttributes(this),"object"==typeof e&&e?e:{});if(o||(o=new t(this,r)),"string"==typeof e){if(void 0===o[e])throw new TypeError('No method named "'+e+'"');o[e](i);}else r.show&&o.show(i);}))},t.getInstance=function(t){return E(t,"bs.modal")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return Ce}}]),t}();U.on(document,"click.bs.modal.data-api",'[data-toggle="modal"]',(function(t){var e=this,i=u(this);"A"!==this.tagName&&"AREA"!==this.tagName||t.preventDefault(),U.one(i,"show.bs.modal",(function(t){t.defaultPrevented||U.one(i,"hidden.bs.modal",(function(){m(e)&&e.focus();}));}));var o=E(i,"bs.modal");if(!o){var r=n({},Z.getDataAttributes(i),Z.getDataAttributes(this));o=new Oe(i,r);}o.show(this);}));var Se=b();if(Se){var De=Se.fn.modal;Se.fn.modal=Oe.jQueryInterface,Se.fn.modal.Constructor=Oe,Se.fn.modal.noConflict=function(){return Se.fn.modal=De,Oe.jQueryInterface};}var xe=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],Ne=/^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi,Ie=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,je={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]};function Pe(t,e,n){var i;if(!t.length)return t;if(n&&"function"==typeof n)return n(t);for(var o=(new window.DOMParser).parseFromString(t,"text/html"),r=Object.keys(e),s=(i=[]).concat.apply(i,o.body.querySelectorAll("*")),a=function(t,n){var i,o=s[t],a=o.nodeName.toLowerCase();if(-1===r.indexOf(a))return o.parentNode.removeChild(o),"continue";var l=(i=[]).concat.apply(i,o.attributes),c=[].concat(e["*"]||[],e[a]||[]);l.forEach((function(t){(function(t,e){var n=t.nodeName.toLowerCase();if(-1!==e.indexOf(n))return -1===xe.indexOf(n)||Boolean(t.nodeValue.match(Ne)||t.nodeValue.match(Ie));for(var i=e.filter((function(t){return t instanceof RegExp})),o=0,r=i.length;o<r;o++)if(n.match(i[o]))return !0;return !1})(t,c)||o.removeAttribute(t.nodeName);}));},l=0,c=s.length;l<c;l++)a(l);return o.body.innerHTML}var Me="tooltip",He=new RegExp("(^|\\s)bs-tooltip\\S+","g"),Be=["sanitize","allowList","sanitizeFn"],Re={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string|function)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)",sanitize:"boolean",sanitizeFn:"(null|function)",allowList:"object",popperConfig:"(null|object)"},Fe={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},We={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent",sanitize:!0,sanitizeFn:null,allowList:je,popperConfig:null},Ue={HIDE:"hide.bs.tooltip",HIDDEN:"hidden.bs.tooltip",SHOW:"show.bs.tooltip",SHOWN:"shown.bs.tooltip",INSERTED:"inserted.bs.tooltip",CLICK:"click.bs.tooltip",FOCUSIN:"focusin.bs.tooltip",FOCUSOUT:"focusout.bs.tooltip",MOUSEENTER:"mouseenter.bs.tooltip",MOUSELEAVE:"mouseleave.bs.tooltip"},Qe=function(){function t(t,e){if(void 0===_e)throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners(),w(t,this.constructor.DATA_KEY,this);}var i=t.prototype;return i.enable=function(){this._isEnabled=!0;},i.disable=function(){this._isEnabled=!1;},i.toggleEnabled=function(){this._isEnabled=!this._isEnabled;},i.toggle=function(t){if(this._isEnabled)if(t){var e=this.constructor.DATA_KEY,n=E(t.delegateTarget,e);n||(n=new this.constructor(t.delegateTarget,this._getDelegateConfig()),w(t.delegateTarget,e,n)),n._activeTrigger.click=!n._activeTrigger.click,n._isWithActiveTrigger()?n._enter(null,n):n._leave(null,n);}else {if(this.getTipElement().classList.contains("show"))return void this._leave(null,this);this._enter(null,this);}},i.dispose=function(){clearTimeout(this._timeout),T(this.element,this.constructor.DATA_KEY),U.off(this.element,this.constructor.EVENT_KEY),U.off(this.element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this.tip&&this.tip.parentNode.removeChild(this.tip),this._isEnabled=null,this._timeout=null,this._hoverState=null,this._activeTrigger=null,this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null;},i.show=function(){var t=this;if("none"===this.element.style.display)throw new Error("Please use show on visible elements");if(this.isWithContent()&&this._isEnabled){var e=U.trigger(this.element,this.constructor.Event.SHOW),n=function t(e){if(!document.documentElement.attachShadow)return null;if("function"==typeof e.getRootNode){var n=e.getRootNode();return n instanceof ShadowRoot?n:null}return e instanceof ShadowRoot?e:e.parentNode?t(e.parentNode):null}(this.element),i=null===n?this.element.ownerDocument.documentElement.contains(this.element):n.contains(this.element);if(e.defaultPrevented||!i)return;var o=this.getTipElement(),r=a(this.constructor.NAME);o.setAttribute("id",r),this.element.setAttribute("aria-describedby",r),this.setContent(),this.config.animation&&o.classList.add("fade");var s="function"==typeof this.config.placement?this.config.placement.call(this,o,this.element):this.config.placement,l=this._getAttachment(s);this._addAttachmentClass(l);var c,u=this._getContainer();if(w(o,this.constructor.DATA_KEY,this),this.element.ownerDocument.documentElement.contains(this.tip)||u.appendChild(o),U.trigger(this.element,this.constructor.Event.INSERTED),this._popper=new _e(this.element,o,this._getPopperConfig(l)),o.classList.add("show"),"ontouchstart"in document.documentElement)(c=[]).concat.apply(c,document.body.children).forEach((function(t){U.on(t,"mouseover",(function(){}));}));var h=function(){t.config.animation&&t._fixTransition();var e=t._hoverState;t._hoverState=null,U.trigger(t.element,t.constructor.Event.SHOWN),"out"===e&&t._leave(null,t);};if(this.tip.classList.contains("fade")){var d=f(this.tip);U.one(this.tip,"transitionend",h),p(this.tip,d);}else h();}},i.hide=function(){var t=this;if(this._popper){var e=this.getTipElement(),n=function(){"show"!==t._hoverState&&e.parentNode&&e.parentNode.removeChild(e),t._cleanTipClass(),t.element.removeAttribute("aria-describedby"),U.trigger(t.element,t.constructor.Event.HIDDEN),t._popper.destroy();};if(!U.trigger(this.element,this.constructor.Event.HIDE).defaultPrevented){var i;if(e.classList.remove("show"),"ontouchstart"in document.documentElement)(i=[]).concat.apply(i,document.body.children).forEach((function(t){return U.off(t,"mouseover",v)}));if(this._activeTrigger.click=!1,this._activeTrigger.focus=!1,this._activeTrigger.hover=!1,this.tip.classList.contains("fade")){var o=f(e);U.one(e,"transitionend",n),p(e,o);}else n();this._hoverState="";}}},i.update=function(){null!==this._popper&&this._popper.scheduleUpdate();},i.isWithContent=function(){return Boolean(this.getTitle())},i.getTipElement=function(){if(this.tip)return this.tip;var t=document.createElement("div");return t.innerHTML=this.config.template,this.tip=t.children[0],this.tip},i.setContent=function(){var t=this.getTipElement();this.setElementContent(J.findOne(".tooltip-inner",t),this.getTitle()),t.classList.remove("fade","show");},i.setElementContent=function(t,e){if(null!==t)return "object"==typeof e&&d(e)?(e.jquery&&(e=e[0]),void(this.config.html?e.parentNode!==t&&(t.innerHTML="",t.appendChild(e)):t.textContent=e.textContent)):void(this.config.html?(this.config.sanitize&&(e=Pe(e,this.config.allowList,this.config.sanitizeFn)),t.innerHTML=e):t.textContent=e)},i.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},i._getPopperConfig=function(t){var e=this;return n({},{placement:t,modifiers:{offset:this._getOffset(),flip:{behavior:this.config.fallbackPlacement},arrow:{element:"."+this.constructor.NAME+"-arrow"},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t);},onUpdate:function(t){return e._handlePopperPlacementChange(t)}},this.config.popperConfig)},i._addAttachmentClass=function(t){this.getTipElement().classList.add("bs-tooltip-"+t);},i._getOffset=function(){var t=this,e={};return "function"==typeof this.config.offset?e.fn=function(e){return e.offsets=n({},e.offsets,t.config.offset(e.offsets,t.element)||{}),e}:e.offset=this.config.offset,e},i._getContainer=function(){return !1===this.config.container?document.body:d(this.config.container)?this.config.container:J.findOne(this.config.container)},i._getAttachment=function(t){return Fe[t.toUpperCase()]},i._setListeners=function(){var t=this;this.config.trigger.split(" ").forEach((function(e){if("click"===e)U.on(t.element,t.constructor.Event.CLICK,t.config.selector,(function(e){return t.toggle(e)}));else if("manual"!==e){var n="hover"===e?t.constructor.Event.MOUSEENTER:t.constructor.Event.FOCUSIN,i="hover"===e?t.constructor.Event.MOUSELEAVE:t.constructor.Event.FOCUSOUT;U.on(t.element,n,t.config.selector,(function(e){return t._enter(e)})),U.on(t.element,i,t.config.selector,(function(e){return t._leave(e)}));}})),this._hideModalHandler=function(){t.element&&t.hide();},U.on(this.element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this.config.selector?this.config=n({},this.config,{trigger:"manual",selector:""}):this._fixTitle();},i._fixTitle=function(){var t=typeof this.element.getAttribute("data-original-title");(this.element.getAttribute("title")||"string"!==t)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""));},i._enter=function(t,e){var n=this.constructor.DATA_KEY;(e=e||E(t.delegateTarget,n))||(e=new this.constructor(t.delegateTarget,this._getDelegateConfig()),w(t.delegateTarget,n,e)),t&&(e._activeTrigger["focusin"===t.type?"focus":"hover"]=!0),e.getTipElement().classList.contains("show")||"show"===e._hoverState?e._hoverState="show":(clearTimeout(e._timeout),e._hoverState="show",e.config.delay&&e.config.delay.show?e._timeout=setTimeout((function(){"show"===e._hoverState&&e.show();}),e.config.delay.show):e.show());},i._leave=function(t,e){var n=this.constructor.DATA_KEY;(e=e||E(t.delegateTarget,n))||(e=new this.constructor(t.delegateTarget,this._getDelegateConfig()),w(t.delegateTarget,n,e)),t&&(e._activeTrigger["focusout"===t.type?"focus":"hover"]=!1),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState="out",e.config.delay&&e.config.delay.hide?e._timeout=setTimeout((function(){"out"===e._hoverState&&e.hide();}),e.config.delay.hide):e.hide());},i._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return !0;return !1},i._getConfig=function(t){var e=Z.getDataAttributes(this.element);return Object.keys(e).forEach((function(t){-1!==Be.indexOf(t)&&delete e[t];})),t&&"object"==typeof t.container&&t.container.jquery&&(t.container=t.container[0]),"number"==typeof(t=n({},this.constructor.Default,e,"object"==typeof t&&t?t:{})).delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),g(Me,t,this.constructor.DefaultType),t.sanitize&&(t.template=Pe(t.template,t.allowList,t.sanitizeFn)),t},i._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},i._cleanTipClass=function(){var t=this.getTipElement(),e=t.getAttribute("class").match(He);null!==e&&e.length>0&&e.map((function(t){return t.trim()})).forEach((function(e){return t.classList.remove(e)}));},i._handlePopperPlacementChange=function(t){this.tip=t.instance.popper,this._cleanTipClass(),this._addAttachmentClass(this._getAttachment(t.placement));},i._fixTransition=function(){var t=this.getTipElement(),e=this.config.animation;null===t.getAttribute("x-placement")&&(t.classList.remove("fade"),this.config.animation=!1,this.hide(),this.show(),this.config.animation=e);},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.tooltip"),i="object"==typeof e&&e;if((n||!/dispose|hide/.test(e))&&(n||(n=new t(this,i)),"string"==typeof e)){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]();}}))},t.getInstance=function(t){return E(t,"bs.tooltip")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return We}},{key:"NAME",get:function(){return Me}},{key:"DATA_KEY",get:function(){return "bs.tooltip"}},{key:"Event",get:function(){return Ue}},{key:"EVENT_KEY",get:function(){return ".bs.tooltip"}},{key:"DefaultType",get:function(){return Re}}]),t}(),Ve=b();if(Ve){var Ke=Ve.fn[Me];Ve.fn[Me]=Qe.jQueryInterface,Ve.fn[Me].Constructor=Qe,Ve.fn[Me].noConflict=function(){return Ve.fn[Me]=Ke,Qe.jQueryInterface};}var Ye="popover",qe=new RegExp("(^|\\s)bs-popover\\S+","g"),ze=n({},Qe.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),Xe=n({},Qe.DefaultType,{content:"(string|element|function)"}),Ge={HIDE:"hide.bs.popover",HIDDEN:"hidden.bs.popover",SHOW:"show.bs.popover",SHOWN:"shown.bs.popover",INSERTED:"inserted.bs.popover",CLICK:"click.bs.popover",FOCUSIN:"focusin.bs.popover",FOCUSOUT:"focusout.bs.popover",MOUSEENTER:"mouseenter.bs.popover",MOUSELEAVE:"mouseleave.bs.popover"},$e=function(t){var n,i;function o(){return t.apply(this,arguments)||this}i=t,(n=o).prototype=Object.create(i.prototype),n.prototype.constructor=n,n.__proto__=i;var r=o.prototype;return r.isWithContent=function(){return this.getTitle()||this._getContent()},r.setContent=function(){var t=this.getTipElement();this.setElementContent(J.findOne(".popover-header",t),this.getTitle());var e=this._getContent();"function"==typeof e&&(e=e.call(this.element)),this.setElementContent(J.findOne(".popover-body",t),e),t.classList.remove("fade","show");},r._addAttachmentClass=function(t){this.getTipElement().classList.add("bs-popover-"+t);},r._getContent=function(){return this.element.getAttribute("data-content")||this.config.content},r._cleanTipClass=function(){var t=this.getTipElement(),e=t.getAttribute("class").match(qe);null!==e&&e.length>0&&e.map((function(t){return t.trim()})).forEach((function(e){return t.classList.remove(e)}));},o.jQueryInterface=function(t){return this.each((function(){var e=E(this,"bs.popover"),n="object"==typeof t?t:null;if((e||!/dispose|hide/.test(t))&&(e||(e=new o(this,n),w(this,"bs.popover",e)),"string"==typeof t)){if(void 0===e[t])throw new TypeError('No method named "'+t+'"');e[t]();}}))},o.getInstance=function(t){return E(t,"bs.popover")},e(o,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return ze}},{key:"NAME",get:function(){return Ye}},{key:"DATA_KEY",get:function(){return "bs.popover"}},{key:"Event",get:function(){return Ge}},{key:"EVENT_KEY",get:function(){return ".bs.popover"}},{key:"DefaultType",get:function(){return Xe}}]),o}(Qe),Ze=b();if(Ze){var Je=Ze.fn[Ye];Ze.fn[Ye]=$e.jQueryInterface,Ze.fn[Ye].Constructor=$e,Ze.fn[Ye].noConflict=function(){return Ze.fn[Ye]=Je,$e.jQueryInterface};}var tn="scrollspy",en={offset:10,method:"auto",target:""},nn={offset:"number",method:"string",target:"(string|element)"},on=function(){function t(t,e){var n=this;this._element=t,this._scrollElement="BODY"===t.tagName?window:t,this._config=this._getConfig(e),this._selector=this._config.target+" .nav-link, "+this._config.target+" .list-group-item, "+this._config.target+" .dropdown-item",this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,U.on(this._scrollElement,"scroll.bs.scrollspy",(function(t){return n._process(t)})),this.refresh(),this._process(),w(t,"bs.scrollspy",this);}var i=t.prototype;return i.refresh=function(){var t=this,e=this._scrollElement===this._scrollElement.window?"offset":"position",n="auto"===this._config.method?e:this._config.method,i="position"===n?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),J.find(this._selector).map((function(t){var e=c(t),o=e?J.findOne(e):null;if(o){var r=o.getBoundingClientRect();if(r.width||r.height)return [Z[n](o).top+i,e]}return null})).filter((function(t){return t})).sort((function(t,e){return t[0]-e[0]})).forEach((function(e){t._offsets.push(e[0]),t._targets.push(e[1]);}));},i.dispose=function(){T(this._element,"bs.scrollspy"),U.off(this._scrollElement,".bs.scrollspy"),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null;},i._getConfig=function(t){if("string"!=typeof(t=n({},en,"object"==typeof t&&t?t:{})).target&&d(t.target)){var e=t.target.id;e||(e=a(tn),t.target.id=e),t.target="#"+e;}return g(tn,t,nn),t},i._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},i._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},i._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},i._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=n){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i);}else {if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(var o=this._offsets.length;o--;){this._activeTarget!==this._targets[o]&&t>=this._offsets[o]&&(void 0===this._offsets[o+1]||t<this._offsets[o+1])&&this._activate(this._targets[o]);}}},i._activate=function(t){this._activeTarget=t,this._clear();var e=this._selector.split(",").map((function(e){return e+'[data-target="'+t+'"],'+e+'[href="'+t+'"]'})),n=J.findOne(e.join(","));n.classList.contains("dropdown-item")?(J.findOne(".dropdown-toggle",n.closest(".dropdown")).classList.add("active"),n.classList.add("active")):(n.classList.add("active"),J.parents(n,".nav, .list-group").forEach((function(t){J.prev(t,".nav-link, .list-group-item").forEach((function(t){return t.classList.add("active")})),J.prev(t,".nav-item").forEach((function(t){J.children(t,".nav-link").forEach((function(t){return t.classList.add("active")}));}));}))),U.trigger(this._scrollElement,"activate.bs.scrollspy",{relatedTarget:t});},i._clear=function(){J.find(this._selector).filter((function(t){return t.classList.contains("active")})).forEach((function(t){return t.classList.remove("active")}));},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.scrollspy");if(n||(n=new t(this,"object"==typeof e&&e)),"string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]();}}))},t.getInstance=function(t){return E(t,"bs.scrollspy")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return en}}]),t}();U.on(window,"load.bs.scrollspy.data-api",(function(){J.find('[data-spy="scroll"]').forEach((function(t){return new on(t,Z.getDataAttributes(t))}));}));var rn=b();if(rn){var sn=rn.fn[tn];rn.fn[tn]=on.jQueryInterface,rn.fn[tn].Constructor=on,rn.fn[tn].noConflict=function(){return rn.fn[tn]=sn,on.jQueryInterface};}var an=function(){function t(t){this._element=t,w(this._element,"bs.tab",this);}var n=t.prototype;return n.show=function(){var t=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&this._element.classList.contains("active")||this._element.classList.contains("disabled"))){var e,n=u(this._element),i=this._element.closest(".nav, .list-group");if(i){var o="UL"===i.nodeName||"OL"===i.nodeName?":scope > li > .active":".active";e=(e=J.find(o,i))[e.length-1];}var r=null;if(e&&(r=U.trigger(e,"hide.bs.tab",{relatedTarget:this._element})),!(U.trigger(this._element,"show.bs.tab",{relatedTarget:e}).defaultPrevented||null!==r&&r.defaultPrevented)){this._activate(this._element,i);var s=function(){U.trigger(e,"hidden.bs.tab",{relatedTarget:t._element}),U.trigger(t._element,"shown.bs.tab",{relatedTarget:e});};n?this._activate(n,n.parentNode,s):s();}}},n.dispose=function(){T(this._element,"bs.tab"),this._element=null;},n._activate=function(t,e,n){var i=this,o=(!e||"UL"!==e.nodeName&&"OL"!==e.nodeName?J.children(e,".active"):J.find(":scope > li > .active",e))[0],r=n&&o&&o.classList.contains("fade"),s=function(){return i._transitionComplete(t,o,n)};if(o&&r){var a=f(o);o.classList.remove("show"),U.one(o,"transitionend",s),p(o,a);}else s();},n._transitionComplete=function(t,e,n){if(e){e.classList.remove("active");var i=J.findOne(":scope > .dropdown-menu .active",e.parentNode);i&&i.classList.remove("active"),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1);}(t.classList.add("active"),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),_(t),t.classList.contains("fade")&&t.classList.add("show"),t.parentNode&&t.parentNode.classList.contains("dropdown-menu"))&&(t.closest(".dropdown")&&J.find(".dropdown-toggle").forEach((function(t){return t.classList.add("active")})),t.setAttribute("aria-expanded",!0));n&&n();},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.tab")||new t(this);if("string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]();}}))},t.getInstance=function(t){return E(t,"bs.tab")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}}]),t}();U.on(document,"click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',(function(t){t.preventDefault(),(E(this,"bs.tab")||new an(this)).show();}));var ln=b();if(ln){var cn=ln.fn.tab;ln.fn.tab=an.jQueryInterface,ln.fn.tab.Constructor=an,ln.fn.tab.noConflict=function(){return ln.fn.tab=cn,an.jQueryInterface};}var un={animation:"boolean",autohide:"boolean",delay:"number"},fn={animation:!0,autohide:!0,delay:5e3},hn=function(){function t(t,e){this._element=t,this._config=this._getConfig(e),this._timeout=null,this._setListeners(),w(t,"bs.toast",this);}var i=t.prototype;return i.show=function(){var t=this;if(!U.trigger(this._element,"show.bs.toast").defaultPrevented){this._clearTimeout(),this._config.animation&&this._element.classList.add("fade");var e=function(){t._element.classList.remove("showing"),t._element.classList.add("show"),U.trigger(t._element,"shown.bs.toast"),t._config.autohide&&(t._timeout=setTimeout((function(){t.hide();}),t._config.delay));};if(this._element.classList.remove("hide"),_(this._element),this._element.classList.add("showing"),this._config.animation){var n=f(this._element);U.one(this._element,"transitionend",e),p(this._element,n);}else e();}},i.hide=function(){var t=this;if(this._element.classList.contains("show")&&!U.trigger(this._element,"hide.bs.toast").defaultPrevented){var e=function(){t._element.classList.add("hide"),U.trigger(t._element,"hidden.bs.toast");};if(this._element.classList.remove("show"),this._config.animation){var n=f(this._element);U.one(this._element,"transitionend",e),p(this._element,n);}else e();}},i.dispose=function(){this._clearTimeout(),this._element.classList.contains("show")&&this._element.classList.remove("show"),U.off(this._element,"click.dismiss.bs.toast"),T(this._element,"bs.toast"),this._element=null,this._config=null;},i._getConfig=function(t){return t=n({},fn,Z.getDataAttributes(this._element),"object"==typeof t&&t?t:{}),g("toast",t,this.constructor.DefaultType),t},i._setListeners=function(){var t=this;U.on(this._element,"click.dismiss.bs.toast",'[data-dismiss="toast"]',(function(){return t.hide()}));},i._clearTimeout=function(){clearTimeout(this._timeout),this._timeout=null;},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.toast");if(n||(n=new t(this,"object"==typeof e&&e)),"string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e](this);}}))},t.getInstance=function(t){return E(t,"bs.toast")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"DefaultType",get:function(){return un}},{key:"Default",get:function(){return fn}}]),t}(),dn=b();if(dn){var pn=dn.fn.toast;dn.fn.toast=hn.jQueryInterface,dn.fn.toast.Constructor=hn,dn.fn.toast.noConflict=function(){return dn.fn.toast=pn,hn.jQueryInterface};}return {Alert:V,Button:q,Carousel:rt,Collapse:ft,Dropdown:Te,Modal:Oe,Popover:$e,ScrollSpy:on,Tab:an,Toast:hn,Tooltip:Qe}}));

    });

    let katan = {
        message: '마을을 만들곳을 클릭하세요',
        dice: [6, 6],
        mode: 'ready',
        isReady: true,
        isStart: false,
        playerList: [
            {
                color: 'blue',
                name: '다은',
                turn: true,
                pickCastle: 0,
                pickRoad: 0,
                resource: {
                    tree: 0,
                    mud: 0,
                    wheat: 0,
                    sheep: 0,
                    iron: 0
                },
                index: 0
            },
            {
                color: 'red',
                name: '아빠',
                turn: false,
                pickCastle: 0,
                pickRoad: 0,
                resource: {
                    tree: 0,
                    mud: 0,
                    wheat: 0,
                    sheep: 0,
                    iron: 0
                },
                index: 1
            }
        ]
    };


    function random() {
        return () => Math.random() - 0.5;
    }

    function shuffle(list) {
        return list.sort(random());
    }

    katan.castleList = [];

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 11; j++) {
            if (i === 0 || i === 5) {
                if (j >= 2 && j <= 8) {
                    let top = 0;

                    if (i === 5) {
                        top = i * (3 * config.cell.height / 4);
                    }

                    if (j % 2 === i % 2) {
                        top += config.cell.height / 4;
                    }

                    katan.castleList.push({
                        left: j * (config.cell.width / 2) - config.castle.width / 2,
                        top: top - config.castle.height / 2,
                        ripple: false,
                        empty: true,
                        i,
                        j
                    });
                }
            } else if (i === 1 || i === 4) {
                if (j >= 1 && j <= 9) {
                    let top = (3 * config.cell.height / 4);

                    if (i === 4) {
                        top = i * (3 * config.cell.height / 4);
                    }

                    if (j % 2 === i % 2) {
                        top += config.cell.height / 4;
                    }

                    const ripple = j >= 3 && j <= 7;

                    katan.castleList.push({
                        left: j * (config.cell.width / 2) - config.castle.width / 2,
                        top: top - config.castle.height / 2,
                        ripple: ripple,
                        empty: true,
                        i,
                        j
                    });
                }
            } else if (i === 2 || i === 3) {
                let top = 2 * (3 * config.cell.height / 4);

                if (i === 3) {
                    top = i * (3 * config.cell.height / 4);
                }

                if (j % 2 === i % 2) {
                    top += config.cell.height / 4;
                }

                const ripple = j >= 2 && j <= 8;

                katan.castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    ripple: ripple,
                    empty: true,
                    i,
                    j
                });
            }
        }
    }

    katan.castleList.forEach((castle, index) => castle.index = index);
    katan.castleList.forEach((castle) => castle.playerIndex = -1);
    katan.castleList.forEach(castle => castle.hide = !castle.ripple);
    katan.castleList.forEach(castle => castle.show = castle.ripple);
    katan.castleList.forEach(castle => castle.constructable = castle.ripple);
    katan.castleList.forEach(castle => castle.title = '');

    katan.castleList[0].roadIndexList = [0, 6];
    katan.castleList[1].roadIndexList = [0, 1];
    katan.castleList[2].roadIndexList = [1, 2, 7];
    katan.castleList[3].roadIndexList = [2, 3];
    katan.castleList[4].roadIndexList = [3, 4, 8];
    katan.castleList[5].roadIndexList = [4, 5];
    katan.castleList[6].roadIndexList = [5, 9];

    katan.castleList[7].roadIndexList = [18, 10];
    katan.castleList[8].roadIndexList = [6, 10, 11];
    katan.castleList[9].roadIndexList = [11, 12, 19];
    katan.castleList[10].roadIndexList = [7, 12, 13];
    katan.castleList[11].roadIndexList = [13, 14, 20];
    katan.castleList[12].roadIndexList = [8, 14, 15];
    katan.castleList[13].roadIndexList = [15, 16, 21];
    katan.castleList[14].roadIndexList = [9, 16, 17];
    katan.castleList[15].roadIndexList = [17, 22];

    katan.castleList[16].roadIndexList = [23, 33];
    katan.castleList[17].roadIndexList = [18, 23, 24];
    katan.castleList[18].roadIndexList = [24, 25, 34];
    katan.castleList[19].roadIndexList = [19, 25, 26];
    katan.castleList[20].roadIndexList = [26, 27, 35];
    katan.castleList[21].roadIndexList = [20, 27, 28];
    katan.castleList[22].roadIndexList = [28, 29, 36];
    katan.castleList[23].roadIndexList = [21, 29, 30];
    katan.castleList[24].roadIndexList = [30, 31, 37];
    katan.castleList[25].roadIndexList = [22, 31, 32];
    katan.castleList[26].roadIndexList = [32, 38];

    katan.castleList[27].roadIndexList = [33, 39];
    katan.castleList[28].roadIndexList = [39, 40, 49];
    katan.castleList[29].roadIndexList = [34, 40, 41];
    katan.castleList[30].roadIndexList = [41, 42, 50];
    katan.castleList[31].roadIndexList = [35, 42, 43];
    katan.castleList[32].roadIndexList = [43, 44, 51];
    katan.castleList[33].roadIndexList = [36, 44, 45];
    katan.castleList[34].roadIndexList = [45, 46, 52];
    katan.castleList[35].roadIndexList = [37, 46, 47];
    katan.castleList[36].roadIndexList = [47, 48, 53];
    katan.castleList[37].roadIndexList = [38, 48];

    katan.castleList[38].roadIndexList = [49, 54];
    katan.castleList[39].roadIndexList = [54, 55, 62];
    katan.castleList[40].roadIndexList = [50, 55, 56];
    katan.castleList[41].roadIndexList = [56, 57, 63];
    katan.castleList[42].roadIndexList = [51, 57, 58];
    katan.castleList[43].roadIndexList = [58, 59, 64];
    katan.castleList[44].roadIndexList = [52, 59, 60];
    katan.castleList[45].roadIndexList = [60, 61, 65];
    katan.castleList[46].roadIndexList = [53, 61];

    katan.castleList[47].roadIndexList = [62, 66];
    katan.castleList[48].roadIndexList = [66, 67];
    katan.castleList[49].roadIndexList = [63, 67, 68];
    katan.castleList[50].roadIndexList = [68, 69];
    katan.castleList[51].roadIndexList = [64, 69, 70];
    katan.castleList[52].roadIndexList = [70, 71];
    katan.castleList[53].roadIndexList = [65, 71];

    katan.castleList[0].castleIndexList = [1, 8];
    katan.castleList[1].castleIndexList = [0, 2];
    katan.castleList[2].castleIndexList = [1, 3, 10];
    katan.castleList[3].castleIndexList = [2, 4];
    katan.castleList[4].castleIndexList = [3, 5, 12];
    katan.castleList[5].castleIndexList = [4, 6];
    katan.castleList[6].castleIndexList = [5, 14];

    katan.castleList[7].castleIndexList = [8, 17];
    katan.castleList[8].castleIndexList = [7, 9];
    katan.castleList[9].castleIndexList = [8, 10, 19];
    katan.castleList[10].castleIndexList = [2, 9, 11];
    katan.castleList[11].castleIndexList = [10, 12, 21];
    katan.castleList[12].castleIndexList = [4, 11 ,13];
    katan.castleList[13].castleIndexList = [12, 14, 23];
    katan.castleList[14].castleIndexList = [6, 13, 15];
    katan.castleList[15].castleIndexList = [14, 25];

    katan.castleList[16].castleIndexList = [17, 27];
    katan.castleList[17].castleIndexList = [7, 16, 18];
    katan.castleList[18].castleIndexList = [17, 19, 29];
    katan.castleList[19].castleIndexList = [9, 18, 20];
    katan.castleList[20].castleIndexList = [19, 21, 31];
    katan.castleList[21].castleIndexList = [11, 20, 22];
    katan.castleList[22].castleIndexList = [21, 23, 33];
    katan.castleList[23].castleIndexList = [13, 22, 24];
    katan.castleList[24].castleIndexList = [23, 25, 35];
    katan.castleList[25].castleIndexList = [15, 24, 26];
    katan.castleList[26].castleIndexList = [25, 37];

    katan.castleList[27].castleIndexList = [16, 28];
    katan.castleList[28].castleIndexList = [27, 29, 38];
    katan.castleList[29].castleIndexList = [18, 28, 30];
    katan.castleList[30].castleIndexList = [29, 31, 40];
    katan.castleList[31].castleIndexList = [20, 30, 30];
    katan.castleList[32].castleIndexList = [31, 33, 42];
    katan.castleList[33].castleIndexList = [22, 32, 34];
    katan.castleList[34].castleIndexList = [33, 35, 44];
    katan.castleList[35].castleIndexList = [24, 34, 36];
    katan.castleList[36].castleIndexList = [35, 37, 46];
    katan.castleList[37].castleIndexList = [26, 36];

    katan.castleList[38].castleIndexList = [28, 39];
    katan.castleList[39].castleIndexList = [38, 40, 47];
    katan.castleList[40].castleIndexList = [30, 39, 41];
    katan.castleList[41].castleIndexList = [40, 42, 49];
    katan.castleList[42].castleIndexList = [32, 41, 43];
    katan.castleList[43].castleIndexList = [42, 44, 51];
    katan.castleList[44].castleIndexList = [34, 43, 45];
    katan.castleList[45].castleIndexList = [44, 46, 53];
    katan.castleList[46].castleIndexList = [36, 45];

    katan.castleList[47].castleIndexList = [39, 48];
    katan.castleList[48].castleIndexList = [47, 49];
    katan.castleList[49].castleIndexList = [41, 48, 50];
    katan.castleList[50].castleIndexList = [49, 51];
    katan.castleList[51].castleIndexList = [43, 50, 52];
    katan.castleList[52].castleIndexList = [51, 53];
    katan.castleList[53].castleIndexList = [45, 52];

    katan.roadList = [];

    const getLoadTopBySingle = (multiple) => {
        return multiple * config.cell.height / 8 - config.load.width / 2 ;
    };

    const getLoadTop = (currentRow, targetRow, currentMultiple, targetMultiple) => {
        let multiple = currentMultiple;

        if (currentRow === targetRow) {
            multiple = targetMultiple;
        }

        return getLoadTopBySingle(multiple) ;
    };

    for (let i = 0; i <= 11; i++) {
        for (let j = 0; j <= 20; j++) {
            if (i === 0 || i === 11) {
                if (j === 5 || j === 7 || j === 9 || j === 11 || j === 13 || j === 15) {
                    let top = getLoadTop(i, 11, 1, 31);

                    katan.roadList.push({
                        left: j * (config.cell.width / 4) - config.load.width / 2,
                        top: top,
                        roadRipple: false,
                        constructable: false,
                        empty: true,
                        i,
                        j
                    });
                }
            } else if (i === 1 || i === 10) {
                if (j === 4 || j === 8 || j === 12 || j === 16) {
                    let top = getLoadTop(i, 10, 4, 28);

                    katan.roadList.push({
                        left: j * (config.cell.width / 4) - config.load.width / 2,
                        top: top,
                        roadRipple: false,
                        constructable: false,
                        empty: true,
                        i,
                        j

                    });
                }
            } else if (i === 2 || i === 9) {
                if (j === 3 || j === 5 || j === 7 || j === 9 ||
                    j === 11 || j === 13 || j === 15 || j === 17) {
                    let top = getLoadTop(i, 9, 7, 25);

                    katan.roadList.push({
                        left: j * (config.cell.width / 4) - config.load.width / 2,
                        top: top,
                        roadRipple: false,
                        constructable: false,
                        empty: true,
                        i,
                        j
                    });
                }
            } else if (i === 3 || i === 8) {
                if (j === 2 || j === 6 || j === 10 || j === 14 || j === 18) {

                    let top = getLoadTop(i, 8, 10, 22);

                    katan.roadList.push({
                        left: j * (config.cell.width / 4) - config.load.width / 2,
                        top: top,
                        roadRipple: false,
                        constructable: false,
                        empty: true,
                        i,
                        j
                    });
                }
            } else if (i === 4 || i === 7) {
                if (j === 1 || j === 3 || j === 5 || j === 7 || j === 9 ||
                    j === 11 || j === 13 || j === 15 || j === 17 || j === 19) {

                    let top = getLoadTop(i, 7, 13, 19);

                    katan.roadList.push({
                        left: j * (config.cell.width / 4) - config.load.width / 2,
                        top: top,
                        roadRipple: false,
                        constructable: false,
                        empty: true,
                        i,
                        j
                    });
                }
            } else if (i === 5) {
                if (j === 0 || j === 4 || j === 8 || j === 12 || j === 16 || j === 20) {
                    let top = getLoadTopBySingle(16);

                    katan.roadList.push({
                        left: j * (config.cell.width / 4) - config.load.width / 2,
                        top: top,
                        roadRipple: false,
                        constructable: false,
                        empty: true,
                        i,
                        j
                    });
                }
            }
        }
    }

    katan.roadList.forEach((road, index) => road.index = index);
    katan.roadList.forEach(road => road.hide = true);
    katan.roadList.forEach(road => road.show = false);
    katan.roadList.forEach(road => road.ripple = false);
    katan.roadList.forEach(road => road.playerIndex = -1);
    katan.roadList.forEach(road => road.title = '');

    katan.roadList[0].castleIndexList = [0, 1];
    katan.roadList[1].castleIndexList = [1, 2];
    katan.roadList[2].castleIndexList = [2, 3];
    katan.roadList[3].castleIndexList = [3, 4];
    katan.roadList[4].castleIndexList = [4, 5];
    katan.roadList[5].castleIndexList = [5, 6];

    katan.roadList[6].castleIndexList = [0, 8];
    katan.roadList[7].castleIndexList = [2, 10];
    katan.roadList[8].castleIndexList = [4, 12];
    katan.roadList[9].castleIndexList = [6, 14];

    katan.roadList[10].castleIndexList = [7, 8];
    katan.roadList[11].castleIndexList = [8, 9];
    katan.roadList[12].castleIndexList = [9, 10];
    katan.roadList[13].castleIndexList = [10, 11];
    katan.roadList[14].castleIndexList = [11, 12];
    katan.roadList[15].castleIndexList = [12, 13];
    katan.roadList[16].castleIndexList = [13, 14];
    katan.roadList[17].castleIndexList = [14, 15];

    katan.roadList[18].castleIndexList = [7, 17];
    katan.roadList[19].castleIndexList = [9, 19];
    katan.roadList[20].castleIndexList = [11, 21];
    katan.roadList[21].castleIndexList = [13, 23];
    katan.roadList[22].castleIndexList = [15, 25];

    katan.roadList[23].castleIndexList = [16, 17];
    katan.roadList[24].castleIndexList = [17, 18];
    katan.roadList[25].castleIndexList = [18, 19];
    katan.roadList[26].castleIndexList = [19, 20];
    katan.roadList[27].castleIndexList = [20, 21];
    katan.roadList[28].castleIndexList = [21, 22];
    katan.roadList[29].castleIndexList = [22, 23];
    katan.roadList[30].castleIndexList = [23, 24];
    katan.roadList[31].castleIndexList = [24, 25];
    katan.roadList[32].castleIndexList = [25, 26];

    katan.roadList[33].castleIndexList = [16, 27];
    katan.roadList[34].castleIndexList = [18, 29];
    katan.roadList[35].castleIndexList = [20, 31];
    katan.roadList[36].castleIndexList = [22, 33];
    katan.roadList[37].castleIndexList = [24, 35];
    katan.roadList[38].castleIndexList = [26, 37];

    katan.roadList[39].castleIndexList = [27, 28];
    katan.roadList[40].castleIndexList = [28, 29];
    katan.roadList[41].castleIndexList = [29, 30];
    katan.roadList[42].castleIndexList = [30, 31];
    katan.roadList[43].castleIndexList = [31, 32];
    katan.roadList[44].castleIndexList = [32, 33];
    katan.roadList[45].castleIndexList = [33, 34];
    katan.roadList[46].castleIndexList = [34, 35];
    katan.roadList[47].castleIndexList = [35, 36];
    katan.roadList[48].castleIndexList = [36, 37];

    katan.roadList[49].castleIndexList = [28, 38];
    katan.roadList[50].castleIndexList = [30, 40];
    katan.roadList[51].castleIndexList = [32, 42];
    katan.roadList[52].castleIndexList = [34, 44];
    katan.roadList[53].castleIndexList = [36, 46];

    katan.roadList[54].castleIndexList = [38, 39];
    katan.roadList[55].castleIndexList = [39, 40];
    katan.roadList[56].castleIndexList = [40, 41];
    katan.roadList[57].castleIndexList = [41, 42];
    katan.roadList[58].castleIndexList = [42, 43];
    katan.roadList[59].castleIndexList = [43, 44];
    katan.roadList[60].castleIndexList = [44, 45];
    katan.roadList[61].castleIndexList = [45, 46];

    katan.roadList[62].castleIndexList = [39, 47];
    katan.roadList[63].castleIndexList = [41, 49];
    katan.roadList[64].castleIndexList = [43, 51];
    katan.roadList[65].castleIndexList = [45, 53];

    katan.roadList[66].castleIndexList = [47, 48];
    katan.roadList[67].castleIndexList = [48, 49];
    katan.roadList[68].castleIndexList = [49, 50];
    katan.roadList[69].castleIndexList = [50, 51];
    katan.roadList[70].castleIndexList = [51, 52];
    katan.roadList[71].castleIndexList = [52, 53];

    let resourceList = [];

    resourceList.push({
        type: 'dessert'
    });

    for (let i = 0; i < 4; i++) {
        resourceList.push({
            type: 'tree'
        });

        resourceList.push({
            type: 'iron'
        });

        resourceList.push({
            type: 'sheep'
        });
    }

    for (let i = 0; i < 3; i++) {
        resourceList.push({
            type: 'mud'
        });

        resourceList.push({
            type: 'wheat'
        });
    }

    resourceList.forEach(resource => {
        resource.hide = true;
        resource.show = false;
        resource.numberRipple = false;
    });

    console.log('>>> resourceList', resourceList);

    katan.resourceList = resourceList;

    katan.turn = () => {
        katan.playerList
            .forEach(player => {
                player.turn = !player.turn;
            });
    };

    let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
    numberList = shuffle(numberList);

    katan.resourceList = katan.resourceList
        .map((resource, index) => {
            if (resource.type === 'dessert') {
                resource.number = 7;
            } else {
                resource.number = numberList.pop();
            }

            resource.buglar = false;

            if (resource.number === 7) {
                resource.buglar = true;
            }

            return resource;
        })
        .sort(random())
        .map((resource, index) => {
            let left = 0;
            let top = 0;

            if (0 <= index && index <= 2) {
                left = config.cell.width + config.cell.width * index;
            } else if (3 <= index && index <= 6) {
                left = config.cell.width / 2 + config.cell.width * (index - 3);
                top = 3 * config.cell.height / 4;
            } else if (7 <= index && index <= 11) {
                left = config.cell.width * (index - 7);
                top = 2 * (3 * config.cell.height / 4);
            } else if (12 <= index && index <= 15) {
                left = config.cell.width / 2 + config.cell.width * (index - 12);
                top = 3 * (3 * config.cell.height / 4);
            } else if (16 <= index && index <= 18) {
                left = config.cell.width * (index - 15);
                top = 4 * (3 * config.cell.height / 4);
            }

            resource.left = left;
            resource.top = top;
            resource.index = index;

            if (resource.index === 0) {
                resource.castleIndexList = [0, 1, 2, 8, 9, 10];
            } else if (resource.index === 1) {
                resource.castleIndexList = [2, 3, 4, 10, 11, 12];
            } else if (resource.index === 2) {
                resource.castleIndexList = [4, 5, 6, 12, 13, 14];
            } else if (resource.index === 3) {
                resource.castleIndexList = [7, 8, 9, 17, 18, 19];
            } else if (resource.index === 4) {
                resource.castleIndexList = [9, 10, 11, 19, 20, 21];
            } else if (resource.index === 5) {
                resource.castleIndexList = [11, 12, 13, 21, 22, 23];
            } else if (resource.index === 6) {
                resource.castleIndexList = [13, 14, 15, 23, 24, 25];
            } else if (resource.index === 7) {
                resource.castleIndexList = [16, 17, 18, 27, 28, 29];
            } else if (resource.index === 8) {
                resource.castleIndexList = [18, 19, 20, 29, 30, 31];
            } else if (resource.index === 9) {
                resource.castleIndexList = [20, 21, 22, 31, 32, 33];
            } else if (resource.index === 10) {
                resource.castleIndexList = [22, 23, 24, 33, 34, 35];
            } else if (resource.index === 11) {
                resource.castleIndexList = [24, 25, 26, 35, 36, 37];
            } else if (resource.index === 12) {
                resource.castleIndexList = [28, 29, 30, 38, 39, 40];
            } else if (resource.index === 13) {
                resource.castleIndexList = [30, 31, 32, 40, 41, 42];
            } else if (resource.index === 14) {
                resource.castleIndexList = [32, 33, 34, 42, 43, 44];
            } else if (resource.index === 15) {
                resource.castleIndexList = [34, 35, 36, 44, 45, 46];
            } else if (resource.index === 16) {
                resource.castleIndexList = [39, 40, 41, 47, 48, 49];
            } else if (resource.index === 17) {
                resource.castleIndexList = [41, 42, 43, 49, 50, 51];
            } else if (resource.index === 18) {
                resource.castleIndexList = [43, 44, 45, 51, 52, 53];
            }

            return resource;
        });

    const { subscribe: subscribe$1, set, update: update$1 } = writable(katan);

    const katanStore = {
        subscribe: subscribe$1,

        start: () => update$1(katan => {
            katan.mode = 'start';
            katan.isStart = true;
            katan.isReady = false;

            katanStore.setCastleRippleDisabled();
            katanStore.setRoadRippleDisabled();

            katan.castleList = katan.castleList
                .map(castle => {
                    if (castle.playerIndex === -1) {
                        castle.show = false;
                        castle.hide = true;
                    }

                    return castle;
                });
            return katan;
        }),

        transition: (resource, playerIndex) => update$1(katan => {
            resource.show = false;
            katan.playerList[playerIndex].resource[resource.type]++;
            return katan;
        }),

        clickMessage: () => {
            katanStore.setNumberRippleEnabled();
        },

        play: () => update$1(katan => {
            const a = Math.floor(Math.random() * 6) + 1;
            const b = Math.floor(Math.random() * 6) + 1;

            katanStore.roll(a, b);

            const number = a + b;

            const buglar = katan.resourceList
                .filter(resource => resource.number === number)
                .find(resource => resource.buglar);

            if (buglar) {
                katan.mode = 'moveBuglar';
                katan.bodyMessage = '도둑의 위치를 선택하세요.';
                katan.buttonMessage = '';
                const modal = new bootstrap_esm_min.Modal(document.getElementById('katanModal'), {});
                modal.show();

                setTimeout(() => {
                    modal.hide();
                    katanStore.setNumberRippleEnabled();
                }, 2000);
            } else {
                katan.resourceList
                    .filter(resource => resource.number === number)
                    .forEach(resource => {
                        resource.castleIndexList
                            .forEach(castleIndex => {
                                let playerIndex = katan.castleList[castleIndex].playerIndex;

                                if (playerIndex !== -1) {
                                    resource.show = true;

                                    const selector = `.player_${playerIndex}_${resource.type}`;
                                    const targetOffset = jQuery__default['default'](selector).offset();

                                    const resourceItem = jQuery__default['default'](`.resource_${resource.index}`).show();
                                    const offset = resourceItem.offset();

                                    const body = jQuery__default['default']('body');
                                    const newResourceItem = resourceItem.clone();

                                    newResourceItem.appendTo(body)
                                        .css({
                                            left: offset.left + 'px',
                                            top: offset.top + 'px'
                                        });

                                    resourceItem.remove();

                                    newResourceItem.addClass('ripple')
                                        .animate({
                                            left: targetOffset.left + 'px',
                                            top: targetOffset.top + 'px'
                                        }, 2000, () => {
                                            newResourceItem.offset(offset);
                                            newResourceItem.hide();
                                            katan.playerList[playerIndex].resource[resource.type]++;
                                        });
                                }
                            });
                    });

            }

            katan.turn();

            return katan;
        }),

        roll: (a, b) => update$1(katna => {
            katna.dice[0] = a;
            katna.dice[1] = b;
            return katan;
        }),

        getNumber: () => katan.dice[0] =  + katan.dice[1],

        isStartable: () => {
            let pickCompletePlayerLength = katan.playerList
                .filter(player => player.pickCastle === 2)
                .filter(player => player.pickRoad === 2)
                .length;

            return pickCompletePlayerLength === katan.playerList.length;
        },

        getActivePlayer: () => {
            return katan.playerList
                .find(player => player.turn);
        },

        getCurrentPlayer: (katan) => {
            return katan.playerList
                .find(player => player.turn);
        },

        turn: () => update$1(katan => {
            katan.playerList = katan.playerList
                .map(player => {
                    player.turn = !player.turn;
                    return player;
                });

            return katan;
        }),

        setCastle: (castleIndex, playerIndex) => update$1(katan => {
            let castle = katan.castleList[castleIndex];
            castle.playerIndex = playerIndex;
            castle.pick = false;
            castle.title = '마을';
            katan.playerList[playerIndex].pickCastle += 1;
            katan.time = new Date().getTime();
            return katan;
        }),

        setRoad: (roadIndex, playerIndex) => update$1(katan => {
            let road = katan.roadList[roadIndex];
            road.playerIndex = playerIndex;
            road.pick = false;
            road.title = '길';
            katan.playerList[playerIndex].pickRoad += 1;
            return katan;
        }),

        setPickRoadMode: () => update$1(katan => {
            katanStore.getCurrentPlayer(katan);
            return katan;
        }),

        setPickCastleMode: () => update$1(katan => {
            katanStore.getCurrentPlayer(katan);
            return katan;
        }),

        setRoadRippleEnabled: (castleIndex) => update$1(katan => {
            katan.message = '길을 만들곳을 선택하세요.';

            let roadIndexList = katan.castleList[castleIndex].roadIndexList;
            
            katan.roadList = katan.roadList
                .map(road => {

                    let linkLength = roadIndexList.filter(roadIndex => roadIndex === road.index)
                        .filter(roadIndex => katan.roadList[roadIndex].playerIndex === -1)
                        .length;

                    if (linkLength > 0) {
                        road.ripple = true;
                        road.hide = false;
                        road.show = true;
                    }

                    return road;
                });

            return katan;
        }),

        setRoadRippleDisabled: () => update$1(katan => {
            katan.roadList = katan.roadList
                .map(road => {
                    road.ripple = false;
                    return road;
                });

            return katan;
        }),

        setCastleRippleDisabled: () => update$1(katan => {
            katan.castleList = katan.castleList.map(castle => {
                castle.ripple = false;
                return castle;
            });

            return katan;
        }),

        setCastleRippleEnabled: () => update$1(katan => {
            katan.castleList = katan.castleList.map(castle => {
                if (castle.constructable && castle.playerIndex === -1) {
                    let linkedCastleLength = castle.castleIndexList
                        .filter(castleIndex => katan.castleList[castleIndex].playerIndex !== -1)
                        .length;

                    if (linkedCastleLength === 0) {
                        castle.ripple = true;
                    }
                }

                return castle;
            });

            return katan;
        }),

        setNumberRippleEnabled: () => update$1(katan => {
            katan.castleList = katan.resourceList
                .filter(resource => !resource.buglar)
                .map(resource => {
                    resource.numberRipple = true;
                return resource;
            });

            return katan;
        }),

        setHideCastle: () => update$1(katan => {
            katan.castleList =  katan.castleList
                .map(castle => {
                    if (castle.playerIndex === -1) {
                        castle.show = false;
                        castle.hide = true;
                    }

                    return castle;
                });

            return katan;
        }),

        setHideRoad: () => update$1( katan => {
            katan.roadList =  katan.roadList
                .map(road => {
                    if (road.playerIndex === -1) {
                        road.show = false;
                        road.hide = true;
                    }

                    return road;
                });

            return katan;
        }),

        setShowCastle: () => update$1(katan => {
            katan.castleList =  katan.castleList
                .map(castle => {
                    if (castle.constructable && castle.playerIndex === -1) {
                        castle.show = true;
                        castle.hide = false;
                    }

                    return castle;
                });

            return katan;
        })
    };

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\Cell.svelte generated by Svelte v3.32.3 */
    const file$1 = "src\\Cell.svelte";

    // (74:12) {#if resource.buglar}
    function create_if_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("(도둑)");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(74:12) {#if resource.buglar}",
    		ctx
    	});

    	return block;
    }

    // (78:12) {#if config.debug}
    function create_if_block_1(ctx) {
    	let t0;
    	let t1_value = /*resource*/ ctx[1].index + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(",");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*resource*/ 2 && t1_value !== (t1_value = /*resource*/ ctx[1].index + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(78:12) {#if config.debug}",
    		ctx
    	});

    	return block;
    }

    // (84:0) {#if resource.buglar===false}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;
    	let img_class_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*resourceImage*/ ctx[7])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "style", /*resourceImageStyle*/ ctx[8]);
    			attr_dev(img, "class", img_class_value = "resource_" + /*resourceIndex*/ ctx[0] + " resource hide" + " svelte-1t3jwt9");
    			add_location(img, file$1, 84, 4, 2554);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*resourceIndex*/ 1 && img_class_value !== (img_class_value = "resource_" + /*resourceIndex*/ ctx[0] + " resource hide" + " svelte-1t3jwt9")) {
    				attr_dev(img, "class", img_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(84:0) {#if resource.buglar===false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1_value = /*resource*/ ctx[1].number + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let if_block2_anchor;
    	let if_block0 = /*resource*/ ctx[1].buglar && create_if_block_2(ctx);
    	let if_block1 = config.debug && create_if_block_1(ctx);
    	let if_block2 = /*resource*/ ctx[1].buglar === false && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			if (img.src !== (img_src_value = /*imageSrc*/ ctx[6])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "style", /*imageStyle*/ ctx[5]);
    			attr_dev(img, "alt", /*imageSrc*/ ctx[6]);
    			add_location(img, file$1, 66, 8, 2080);
    			attr_dev(div0, "class", "number svelte-1t3jwt9");
    			attr_dev(div0, "style", /*numberStyle*/ ctx[2]);
    			toggle_class(div0, "ripple", /*resource*/ ctx[1].numberRipple);
    			toggle_class(div0, "buglar", /*resource*/ ctx[1].buglar);
    			add_location(div0, file$1, 68, 8, 2156);
    			attr_dev(div1, "class", "inner-cell");
    			attr_dev(div1, "style", /*innerCellStyle*/ ctx[4]);
    			add_location(div1, file$1, 65, 4, 2024);
    			attr_dev(div2, "class", "cell svelte-1t3jwt9");
    			attr_dev(div2, "style", /*cellStyle*/ ctx[3]);
    			add_location(div2, file$1, 64, 0, 1983);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t3);
    			if (if_block1) if_block1.m(div0, null);
    			insert_dev(target, t4, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*resource*/ 2 && t1_value !== (t1_value = /*resource*/ ctx[1].number + "")) set_data_dev(t1, t1_value);

    			if (/*resource*/ ctx[1].buglar) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div0, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (config.debug) if_block1.p(ctx, dirty);

    			if (dirty & /*numberStyle*/ 4) {
    				attr_dev(div0, "style", /*numberStyle*/ ctx[2]);
    			}

    			if (dirty & /*resource*/ 2) {
    				toggle_class(div0, "ripple", /*resource*/ ctx[1].numberRipple);
    			}

    			if (dirty & /*resource*/ 2) {
    				toggle_class(div0, "buglar", /*resource*/ ctx[1].buglar);
    			}

    			if (/*resource*/ ctx[1].buglar === false) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t4);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
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
    	let $katan;
    	validate_store(katanStore, "katan");
    	component_subscribe($$self, katanStore, $$value => $$invalidate(9, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cell", slots, []);
    	let { resourceIndex } = $$props;
    	let resource = $katan.resourceList[resourceIndex];
    	const margin = config.cell.margin;
    	const offset = 100 - config.cell.margin;

    	let cellStyle = toStyle({
    		left: resource.left + "px",
    		top: resource.top + "px",
    		width: config.cell.width + "px",
    		height: config.cell.height + "px"
    	});

    	let innerCellStyle = toStyle({
    		"clip-path": `polygon(50% ${margin}%, ${offset}% 25%, ${offset}% 75%, 50% ${offset}%, ${margin}% 75%, ${margin}% 25%)`
    	});

    	let imageStyle = toStyle({
    		width: config.cell.width + "px",
    		height: config.cell.height + "px"
    	});

    	const getNumberStyle = (width, height) => {
    		return toStyle({
    			left: (config.cell.width - width) / 2 + "px",
    			top: (config.cell.height - height) / 2 + "px",
    			width: width + "px",
    			height: height + "px",
    			"line-height": height + "px",
    			"border-radius": height / 2 + "px",
    			"font-size": "30px"
    		});
    	};

    	let numberStyle = getNumberStyle(config.number.width, config.number.height);

    	if (resource.buglar) {
    		numberStyle = getNumberStyle(config.buglar.width, config.buglar.height);
    	}

    	let imageSrc = `${resource.type}.png`;
    	let resourceImage = `${resource.type}_item.png`;

    	let resourceImageStyle = toStyle({
    		left: resource.left + config.number.width / 2 + "px",
    		top: resource.top + config.number.height / 2 + "px",
    		width: `${config.number.width}px`,
    		height: `${config.number.height}px`
    	});

    	const unsubscribe = katanStore.subscribe(currentKatan => {
    		$$invalidate(1, resource = currentKatan.resourceList[resourceIndex]);
    	});

    	onDestroy(unsubscribe);
    	const writable_props = ["resourceIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("resourceIndex" in $$props) $$invalidate(0, resourceIndex = $$props.resourceIndex);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		config,
    		toStyle,
    		katan: katanStore,
    		fly,
    		resourceIndex,
    		resource,
    		margin,
    		offset,
    		cellStyle,
    		innerCellStyle,
    		imageStyle,
    		getNumberStyle,
    		numberStyle,
    		imageSrc,
    		resourceImage,
    		resourceImageStyle,
    		unsubscribe,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("resourceIndex" in $$props) $$invalidate(0, resourceIndex = $$props.resourceIndex);
    		if ("resource" in $$props) $$invalidate(1, resource = $$props.resource);
    		if ("cellStyle" in $$props) $$invalidate(3, cellStyle = $$props.cellStyle);
    		if ("innerCellStyle" in $$props) $$invalidate(4, innerCellStyle = $$props.innerCellStyle);
    		if ("imageStyle" in $$props) $$invalidate(5, imageStyle = $$props.imageStyle);
    		if ("numberStyle" in $$props) $$invalidate(2, numberStyle = $$props.numberStyle);
    		if ("imageSrc" in $$props) $$invalidate(6, imageSrc = $$props.imageSrc);
    		if ("resourceImage" in $$props) $$invalidate(7, resourceImage = $$props.resourceImage);
    		if ("resourceImageStyle" in $$props) $$invalidate(8, resourceImageStyle = $$props.resourceImageStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		resourceIndex,
    		resource,
    		numberStyle,
    		cellStyle,
    		innerCellStyle,
    		imageStyle,
    		imageSrc,
    		resourceImage,
    		resourceImageStyle
    	];
    }

    class Cell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { resourceIndex: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*resourceIndex*/ ctx[0] === undefined && !("resourceIndex" in props)) {
    			console.warn("<Cell> was created without expected prop 'resourceIndex'");
    		}
    	}

    	get resourceIndex() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resourceIndex(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Castle.svelte generated by Svelte v3.32.3 */
    const file$2 = "src\\Castle.svelte";

    // (64:0) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let t_value = /*castle*/ ctx[0].title + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = text(t_value);
    			add_location(div0, file$2, 70, 4, 1914);
    			attr_dev(div1, "class", "castle svelte-q8xa7h");
    			attr_dev(div1, "style", /*castleStyle*/ ctx[1]);
    			toggle_class(div1, "ripple", /*castle*/ ctx[0].ripple);
    			toggle_class(div1, "hide", /*castle*/ ctx[0].hide);
    			toggle_class(div1, "show", /*castle*/ ctx[0].show);
    			add_location(div1, file$2, 64, 4, 1737);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*castle*/ 1 && t_value !== (t_value = /*castle*/ ctx[0].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*castleStyle*/ 2) {
    				attr_dev(div1, "style", /*castleStyle*/ ctx[1]);
    			}

    			if (dirty & /*castle*/ 1) {
    				toggle_class(div1, "ripple", /*castle*/ ctx[0].ripple);
    			}

    			if (dirty & /*castle*/ 1) {
    				toggle_class(div1, "hide", /*castle*/ ctx[0].hide);
    			}

    			if (dirty & /*castle*/ 1) {
    				toggle_class(div1, "show", /*castle*/ ctx[0].show);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(64:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (59:0) {#if config.debug}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*castle*/ ctx[0].i + "";
    	let t0;
    	let t1;
    	let t2_value = /*castle*/ ctx[0].j + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*castle*/ ctx[0].index + "";
    	let t4;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(",");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(t4_value);
    			add_location(div0, file$2, 60, 8, 1643);
    			add_location(div1, file$2, 61, 8, 1685);
    			attr_dev(div2, "class", "castle svelte-q8xa7h");
    			attr_dev(div2, "style", /*castleStyle*/ ctx[1]);
    			add_location(div2, file$2, 59, 4, 1593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*castle*/ 1 && t0_value !== (t0_value = /*castle*/ ctx[0].i + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*castle*/ 1 && t2_value !== (t2_value = /*castle*/ ctx[0].j + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*castle*/ 1 && t4_value !== (t4_value = /*castle*/ ctx[0].index + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*castleStyle*/ 2) {
    				attr_dev(div2, "style", /*castleStyle*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(59:0) {#if config.debug}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (config.debug) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type();
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let $katan;
    	validate_store(katanStore, "katan");
    	component_subscribe($$self, katanStore, $$value => $$invalidate(5, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Castle", slots, []);
    	let { castleIndex } = $$props;
    	let castle = $katan.castleList[castleIndex];
    	let castleStyle;

    	const pick = () => {
    		if (!castle.ripple) {
    			return;
    		}

    		const player = katanStore.getActivePlayer();
    		katanStore.setCastle(castleIndex, player.index);
    		katanStore.setHideCastle();
    		katanStore.setCastleRippleDisabled();
    		katanStore.setRoadRippleEnabled(castleIndex);
    	};

    	const createStyle = () => {
    		let styleObject = {
    			left: castle.left + "px",
    			top: castle.top + "px",
    			width: config.castle.width + "px",
    			height: config.castle.height + "px",
    			lineHeight: config.castle.height + "px",
    			borderRadius: config.castle.height + "px",
    			color: "white"
    		};

    		if (config.debug) {
    			delete styleObject.lineHeight;
    			styleObject.color = "black";
    		}

    		if (castle.playerIndex !== -1) {
    			styleObject.backgroundColor = $katan.playerList[castle.playerIndex].color;
    		}

    		return toStyle(styleObject);
    	};

    	const unsubscribe = katanStore.subscribe(currentKatan => {
    		$$invalidate(1, castleStyle = createStyle());
    		$$invalidate(0, castle = currentKatan.castleList[castleIndex]);
    	});

    	onDestroy(unsubscribe);
    	castleStyle = createStyle();
    	const writable_props = ["castleIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Castle> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => pick();

    	$$self.$$set = $$props => {
    		if ("castleIndex" in $$props) $$invalidate(3, castleIndex = $$props.castleIndex);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		katan: katanStore,
    		config,
    		toStyle,
    		castleIndex,
    		castle,
    		castleStyle,
    		pick,
    		createStyle,
    		unsubscribe,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("castleIndex" in $$props) $$invalidate(3, castleIndex = $$props.castleIndex);
    		if ("castle" in $$props) $$invalidate(0, castle = $$props.castle);
    		if ("castleStyle" in $$props) $$invalidate(1, castleStyle = $$props.castleStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [castle, castleStyle, pick, castleIndex, click_handler];
    }

    class Castle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { castleIndex: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Castle",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*castleIndex*/ ctx[3] === undefined && !("castleIndex" in props)) {
    			console.warn("<Castle> was created without expected prop 'castleIndex'");
    		}
    	}

    	get castleIndex() {
    		throw new Error("<Castle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set castleIndex(value) {
    		throw new Error("<Castle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Road.svelte generated by Svelte v3.32.3 */
    const file$3 = "src\\Road.svelte";

    // (72:0) {:else}
    function create_else_block$1(ctx) {
    	let div1;
    	let div0;
    	let t_value = /*road*/ ctx[0].title + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = text(t_value);
    			add_location(div0, file$3, 79, 8, 1985);
    			attr_dev(div1, "class", "road svelte-2zhhd2");
    			attr_dev(div1, "style", /*roadStyle*/ ctx[1]);
    			toggle_class(div1, "ripple", /*road*/ ctx[0].ripple);
    			toggle_class(div1, "pick", /*road*/ ctx[0].ripple);
    			toggle_class(div1, "hide", /*road*/ ctx[0].hide);
    			toggle_class(div1, "show", /*road*/ ctx[0].show);
    			add_location(div1, file$3, 72, 4, 1766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*road*/ 1 && t_value !== (t_value = /*road*/ ctx[0].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*roadStyle*/ 2) {
    				attr_dev(div1, "style", /*roadStyle*/ ctx[1]);
    			}

    			if (dirty & /*road*/ 1) {
    				toggle_class(div1, "ripple", /*road*/ ctx[0].ripple);
    			}

    			if (dirty & /*road*/ 1) {
    				toggle_class(div1, "pick", /*road*/ ctx[0].ripple);
    			}

    			if (dirty & /*road*/ 1) {
    				toggle_class(div1, "hide", /*road*/ ctx[0].hide);
    			}

    			if (dirty & /*road*/ 1) {
    				toggle_class(div1, "show", /*road*/ ctx[0].show);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(72:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:0) {#if config.debug}
    function create_if_block$2(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*road*/ ctx[0].i + "";
    	let t0;
    	let t1;
    	let t2_value = /*road*/ ctx[0].j + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*road*/ ctx[0].index + "";
    	let t4;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(",");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(t4_value);
    			add_location(div0, file$3, 68, 8, 1682);
    			add_location(div1, file$3, 69, 8, 1719);
    			attr_dev(div2, "class", "road svelte-2zhhd2");
    			attr_dev(div2, "style", /*roadStyle*/ ctx[1]);
    			add_location(div2, file$3, 67, 4, 1637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*road*/ 1 && t0_value !== (t0_value = /*road*/ ctx[0].i + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*road*/ 1 && t2_value !== (t2_value = /*road*/ ctx[0].j + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*road*/ 1 && t4_value !== (t4_value = /*road*/ ctx[0].index + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*roadStyle*/ 2) {
    				attr_dev(div2, "style", /*roadStyle*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(67:0) {#if config.debug}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (config.debug) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type();
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let $katan;
    	validate_store(katanStore, "katan");
    	component_subscribe($$self, katanStore, $$value => $$invalidate(5, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Road", slots, []);
    	let { roadIndex } = $$props;
    	let roadList = $katan.roadList;
    	let road = roadList[roadIndex];
    	let roadStyle;

    	const pick = () => {
    		if (!road.ripple) {
    			return;
    		}

    		let player = katanStore.getActivePlayer();
    		katanStore.setRoad(roadIndex, player.index);
    		katanStore.setHideRoad();
    		katanStore.setRoadRippleDisabled();
    		katanStore.setShowCastle();
    		katanStore.setCastleRippleEnabled();
    		katanStore.turn();

    		if (katanStore.isStartable()) {
    			katanStore.start();
    		}
    	};

    	const createStyle = () => {
    		let styleObject = {
    			left: road.left + "px",
    			top: road.top + "px",
    			width: config.load.width + "px",
    			height: config.load.height + "px",
    			lineHeight: config.castle.height + "px",
    			color: "white"
    		};

    		if (config.debug) {
    			delete styleObject.lineHeight;
    			styleObject.color = "black";
    			styleObject.backgroundColor = "lightblue";
    		}

    		if (road.playerIndex !== -1) {
    			styleObject.backgroundColor = $katan.playerList[road.playerIndex].color;
    		}

    		return toStyle(styleObject);
    	};

    	roadStyle = createStyle();

    	const unsubscribe = katanStore.subscribe(currentKatan => {
    		$$invalidate(1, roadStyle = createStyle());
    		$$invalidate(0, road = currentKatan.roadList[roadIndex]);
    	});

    	onDestroy(unsubscribe);
    	const writable_props = ["roadIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Road> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => pick();

    	$$self.$$set = $$props => {
    		if ("roadIndex" in $$props) $$invalidate(3, roadIndex = $$props.roadIndex);
    	};

    	$$self.$capture_state = () => ({
    		katan: katanStore,
    		config,
    		toStyle,
    		onDestroy,
    		roadIndex,
    		roadList,
    		road,
    		roadStyle,
    		pick,
    		createStyle,
    		unsubscribe,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("roadIndex" in $$props) $$invalidate(3, roadIndex = $$props.roadIndex);
    		if ("roadList" in $$props) roadList = $$props.roadList;
    		if ("road" in $$props) $$invalidate(0, road = $$props.road);
    		if ("roadStyle" in $$props) $$invalidate(1, roadStyle = $$props.roadStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [road, roadStyle, pick, roadIndex, click_handler];
    }

    class Road extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { roadIndex: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Road",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*roadIndex*/ ctx[3] === undefined && !("roadIndex" in props)) {
    			console.warn("<Road> was created without expected prop 'roadIndex'");
    		}
    	}

    	get roadIndex() {
    		throw new Error("<Road>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set roadIndex(value) {
    		throw new Error("<Road>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Board.svelte generated by Svelte v3.32.3 */
    const file$4 = "src\\Board.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (19:4) {#each resourceList as resource, i}
    function create_each_block_2(ctx) {
    	let cell;
    	let current;

    	cell = new Cell({
    			props: { resourceIndex: /*i*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(19:4) {#each resourceList as resource, i}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#each castleList as castle, i}
    function create_each_block_1(ctx) {
    	let castle;
    	let current;

    	castle = new Castle({
    			props: { castleIndex: /*i*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(castle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(castle, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(castle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(castle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(castle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(22:4) {#each castleList as castle, i}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#each $katan.roadList as road, i}
    function create_each_block(ctx) {
    	let road;
    	let current;

    	road = new Road({
    			props: { roadIndex: /*i*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(road.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(road, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(road.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(road.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(road, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(25:4) {#each $katan.roadList as road, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let current;
    	let each_value_2 = /*resourceList*/ ctx[0];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*castleList*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*$katan*/ ctx[2].roadList;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_2 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(main, "class", "board svelte-8f6y7b");
    			attr_dev(main, "style", /*boardStyle*/ ctx[3]);
    			add_location(main, file$4, 17, 0, 451);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(main, null);
    			}

    			append_dev(main, t0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(main, null);
    			}

    			append_dev(main, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*resourceList*/ 1) {
    				each_value_2 = /*resourceList*/ ctx[0];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(main, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*castleList*/ 2) {
    				each_value_1 = /*castleList*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(main, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*$katan*/ 4) {
    				each_value = /*$katan*/ ctx[2].roadList;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_2(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

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
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
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
    	let $katan;
    	validate_store(katanStore, "katan");
    	component_subscribe($$self, katanStore, $$value => $$invalidate(2, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Board", slots, []);
    	let { resourceList } = $$props;
    	let { castleList } = $$props;

    	let boardStyle = toStyle({
    		width: 5 * config.cell.width + "px",
    		height: 5 * config.cell.width + "px"
    	});

    	const writable_props = ["resourceList", "castleList"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Board> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("resourceList" in $$props) $$invalidate(0, resourceList = $$props.resourceList);
    		if ("castleList" in $$props) $$invalidate(1, castleList = $$props.castleList);
    	};

    	$$self.$capture_state = () => ({
    		config,
    		toStyle,
    		Cell,
    		Castle,
    		Road,
    		katan: katanStore,
    		resourceList,
    		castleList,
    		boardStyle,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("resourceList" in $$props) $$invalidate(0, resourceList = $$props.resourceList);
    		if ("castleList" in $$props) $$invalidate(1, castleList = $$props.castleList);
    		if ("boardStyle" in $$props) $$invalidate(3, boardStyle = $$props.boardStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [resourceList, castleList, $katan, boardStyle];
    }

    class Board extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { resourceList: 0, castleList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Board",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*resourceList*/ ctx[0] === undefined && !("resourceList" in props)) {
    			console.warn("<Board> was created without expected prop 'resourceList'");
    		}

    		if (/*castleList*/ ctx[1] === undefined && !("castleList" in props)) {
    			console.warn("<Board> was created without expected prop 'castleList'");
    		}
    	}

    	get resourceList() {
    		throw new Error("<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resourceList(value) {
    		throw new Error("<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get castleList() {
    		throw new Error("<Board>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set castleList(value) {
    		throw new Error("<Board>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Dice.svelte generated by Svelte v3.32.3 */

    const file$5 = "src\\Dice.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*number*/ ctx[0]);
    			attr_dev(div, "class", "dice svelte-108qkag");
    			add_location(div, file$5, 4, 0, 43);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*number*/ 1) set_data_dev(t, /*number*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Dice", slots, []);
    	let { number } = $$props;
    	const writable_props = ["number"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dice> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("number" in $$props) $$invalidate(0, number = $$props.number);
    	};

    	$$self.$capture_state = () => ({ number });

    	$$self.$inject_state = $$props => {
    		if ("number" in $$props) $$invalidate(0, number = $$props.number);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [number];
    }

    class Dice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { number: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dice",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*number*/ ctx[0] === undefined && !("number" in props)) {
    			console.warn("<Dice> was created without expected prop 'number'");
    		}
    	}

    	get number() {
    		throw new Error("<Dice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set number(value) {
    		throw new Error("<Dice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.32.3 */
    const file$6 = "src\\App.svelte";

    // (52:12) {#if $katan.buttonMessage!==''}
    function create_if_block$3(ctx) {
    	let div;
    	let button;
    	let t_value = /*$katan*/ ctx[0].buttonMessage + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$6, 53, 20, 1959);
    			attr_dev(div, "class", "modal-footer");
    			add_location(div, file$6, 52, 16, 1911);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$katan*/ 1 && t_value !== (t_value = /*$katan*/ ctx[0].buttonMessage + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(52:12) {#if $katan.buttonMessage!==''}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let table1;
    	let tr1;
    	let td0;
    	let t0;
    	let td4;
    	let table0;
    	let tr0;
    	let td1;
    	let t1_value = /*$katan*/ ctx[0].mode + "";
    	let t1;
    	let t2;
    	let td2;
    	let t3_value = /*$katan*/ ctx[0].message + "";
    	let t3;
    	let t4;
    	let td3;
    	let dice0;
    	let t5;
    	let dice1;
    	let t6;
    	let button0;
    	let t7;
    	let button0_disabled_value;
    	let t8;
    	let td5;
    	let t9;
    	let tr2;
    	let td6;
    	let player0;
    	let t10;
    	let td7;
    	let board;
    	let t11;
    	let td8;
    	let player1;
    	let t12;
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let button1;
    	let t13;
    	let div1;
    	let t14_value = /*$katan*/ ctx[0].bodyMessage + "";
    	let t14;
    	let t15;
    	let current;
    	let mounted;
    	let dispose;

    	dice0 = new Dice({
    			props: { number: /*$katan*/ ctx[0].dice[0] },
    			$$inline: true
    		});

    	dice1 = new Dice({
    			props: { number: /*$katan*/ ctx[0].dice[1] },
    			$$inline: true
    		});

    	player0 = new Player({
    			props: { player: /*$katan*/ ctx[0].playerList[0] },
    			$$inline: true
    		});

    	board = new Board({
    			props: {
    				resourceList: /*$katan*/ ctx[0].resourceList,
    				castleList: /*$katan*/ ctx[0].castleList
    			},
    			$$inline: true
    		});

    	player1 = new Player({
    			props: { player: /*$katan*/ ctx[0].playerList[1] },
    			$$inline: true
    		});

    	let if_block = /*$katan*/ ctx[0].buttonMessage !== "" && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			table1 = element("table");
    			tr1 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td4 = element("td");
    			table0 = element("table");
    			tr0 = element("tr");
    			td1 = element("td");
    			t1 = text(t1_value);
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = space();
    			td3 = element("td");
    			create_component(dice0.$$.fragment);
    			t5 = space();
    			create_component(dice1.$$.fragment);
    			t6 = space();
    			button0 = element("button");
    			t7 = text("주사위 굴리기");
    			t8 = space();
    			td5 = element("td");
    			t9 = space();
    			tr2 = element("tr");
    			td6 = element("td");
    			create_component(player0.$$.fragment);
    			t10 = space();
    			td7 = element("td");
    			create_component(board.$$.fragment);
    			t11 = space();
    			td8 = element("td");
    			create_component(player1.$$.fragment);
    			t12 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			button1 = element("button");
    			t13 = space();
    			div1 = element("div");
    			t14 = text(t14_value);
    			t15 = space();
    			if (if_block) if_block.c();
    			attr_dev(td0, "class", "svelte-fd1w91");
    			add_location(td0, file$6, 10, 12, 259);
    			attr_dev(td1, "class", "svelte-fd1w91");
    			add_location(td1, file$6, 14, 24, 363);
    			attr_dev(td2, "class", "svelte-fd1w91");
    			add_location(td2, file$6, 15, 24, 411);
    			attr_dev(button0, "class", "btn btn-primary");
    			button0.disabled = button0_disabled_value = /*$katan*/ ctx[0].isReady;
    			add_location(button0, file$6, 18, 28, 602);
    			attr_dev(td3, "class", "svelte-fd1w91");
    			add_location(td3, file$6, 16, 24, 462);
    			add_location(tr0, file$6, 13, 20, 333);
    			add_location(table0, file$6, 12, 16, 304);
    			attr_dev(td4, "class", "svelte-fd1w91");
    			add_location(td4, file$6, 11, 12, 282);
    			attr_dev(td5, "class", "svelte-fd1w91");
    			add_location(td5, file$6, 24, 12, 869);
    			add_location(tr1, file$6, 9, 8, 241);
    			attr_dev(td6, "valign", "top");
    			attr_dev(td6, "class", "player svelte-fd1w91");
    			add_location(td6, file$6, 27, 12, 921);
    			attr_dev(td7, "valign", "top");
    			attr_dev(td7, "class", "svelte-fd1w91");
    			add_location(td7, file$6, 30, 12, 1051);
    			attr_dev(td8, "valign", "top");
    			attr_dev(td8, "class", "player svelte-fd1w91");
    			add_location(td8, file$6, 35, 12, 1246);
    			add_location(tr2, file$6, 26, 8, 903);
    			add_location(table1, file$6, 8, 4, 224);
    			set_style(main, "margin", "auto");
    			set_style(main, "width", "80%");
    			add_location(main, file$6, 7, 0, 179);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn-close");
    			attr_dev(button1, "data-bs-dismiss", "modal");
    			attr_dev(button1, "aria-label", "Close");
    			add_location(button1, file$6, 45, 16, 1638);
    			attr_dev(div0, "class", "modal-header");
    			add_location(div0, file$6, 44, 12, 1594);
    			attr_dev(div1, "class", "modal-body");
    			add_location(div1, file$6, 47, 12, 1764);
    			attr_dev(div2, "class", "modal-content");
    			add_location(div2, file$6, 43, 8, 1553);
    			attr_dev(div3, "class", "modal-dialog");
    			add_location(div3, file$6, 42, 4, 1517);
    			attr_dev(div4, "class", "modal fade");
    			attr_dev(div4, "id", "katanModal");
    			attr_dev(div4, "tabindex", "-1");
    			attr_dev(div4, "aria-labelledby", "exampleModalLabel");
    			attr_dev(div4, "aria-hidden", "true");
    			add_location(div4, file$6, 41, 0, 1402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, table1);
    			append_dev(table1, tr1);
    			append_dev(tr1, td0);
    			append_dev(tr1, t0);
    			append_dev(tr1, td4);
    			append_dev(td4, table0);
    			append_dev(table0, tr0);
    			append_dev(tr0, td1);
    			append_dev(td1, t1);
    			append_dev(tr0, t2);
    			append_dev(tr0, td2);
    			append_dev(td2, t3);
    			append_dev(tr0, t4);
    			append_dev(tr0, td3);
    			mount_component(dice0, td3, null);
    			append_dev(td3, t5);
    			mount_component(dice1, td3, null);
    			append_dev(td3, t6);
    			append_dev(td3, button0);
    			append_dev(button0, t7);
    			append_dev(tr1, t8);
    			append_dev(tr1, td5);
    			append_dev(table1, t9);
    			append_dev(table1, tr2);
    			append_dev(tr2, td6);
    			mount_component(player0, td6, null);
    			append_dev(tr2, t10);
    			append_dev(tr2, td7);
    			mount_component(board, td7, null);
    			append_dev(tr2, t11);
    			append_dev(tr2, td8);
    			mount_component(player1, td8, null);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, button1);
    			append_dev(div2, t13);
    			append_dev(div2, div1);
    			append_dev(div1, t14);
    			append_dev(div2, t15);
    			if (if_block) if_block.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$katan*/ 1) && t1_value !== (t1_value = /*$katan*/ ctx[0].mode + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$katan*/ 1) && t3_value !== (t3_value = /*$katan*/ ctx[0].message + "")) set_data_dev(t3, t3_value);
    			const dice0_changes = {};
    			if (dirty & /*$katan*/ 1) dice0_changes.number = /*$katan*/ ctx[0].dice[0];
    			dice0.$set(dice0_changes);
    			const dice1_changes = {};
    			if (dirty & /*$katan*/ 1) dice1_changes.number = /*$katan*/ ctx[0].dice[1];
    			dice1.$set(dice1_changes);

    			if (!current || dirty & /*$katan*/ 1 && button0_disabled_value !== (button0_disabled_value = /*$katan*/ ctx[0].isReady)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			const player0_changes = {};
    			if (dirty & /*$katan*/ 1) player0_changes.player = /*$katan*/ ctx[0].playerList[0];
    			player0.$set(player0_changes);
    			const board_changes = {};
    			if (dirty & /*$katan*/ 1) board_changes.resourceList = /*$katan*/ ctx[0].resourceList;
    			if (dirty & /*$katan*/ 1) board_changes.castleList = /*$katan*/ ctx[0].castleList;

    			if (dirty & /*$$scope*/ 8) {
    				board_changes.$$scope = { dirty, ctx };
    			}

    			board.$set(board_changes);
    			const player1_changes = {};
    			if (dirty & /*$katan*/ 1) player1_changes.player = /*$katan*/ ctx[0].playerList[1];
    			player1.$set(player1_changes);
    			if ((!current || dirty & /*$katan*/ 1) && t14_value !== (t14_value = /*$katan*/ ctx[0].bodyMessage + "")) set_data_dev(t14, t14_value);

    			if (/*$katan*/ ctx[0].buttonMessage !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dice0.$$.fragment, local);
    			transition_in(dice1.$$.fragment, local);
    			transition_in(player0.$$.fragment, local);
    			transition_in(board.$$.fragment, local);
    			transition_in(player1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dice0.$$.fragment, local);
    			transition_out(dice1.$$.fragment, local);
    			transition_out(player0.$$.fragment, local);
    			transition_out(board.$$.fragment, local);
    			transition_out(player1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(dice0);
    			destroy_component(dice1);
    			destroy_component(player0);
    			destroy_component(board);
    			destroy_component(player1);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $katan;
    	validate_store(katanStore, "katan");
    	component_subscribe($$self, katanStore, $$value => $$invalidate(0, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => katanStore.play();
    	const click_handler_1 = () => katanStore.clickMessage();
    	$$self.$capture_state = () => ({ Player, Board, Dice, katan: katanStore, $katan });
    	return [$katan, click_handler, click_handler_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
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

}(jQuery));
//# sourceMappingURL=bundle.js.map
