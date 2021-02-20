
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
    	let t2;
    	let td2;
    	let t3_value = /*player*/ ctx[0].resource.tree + "";
    	let t3;
    	let t4;
    	let tr2;
    	let td3;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let td4;
    	let t6_value = /*player*/ ctx[0].resource.mud + "";
    	let t6;
    	let t7;
    	let tr3;
    	let td5;
    	let img2;
    	let img2_src_value;
    	let t8;
    	let td6;
    	let t9_value = /*player*/ ctx[0].resource.wheat + "";
    	let t9;
    	let t10;
    	let tr4;
    	let td7;
    	let img3;
    	let img3_src_value;
    	let t11;
    	let td8;
    	let t12_value = /*player*/ ctx[0].resource.sheep + "";
    	let t12;
    	let t13;
    	let tr5;
    	let td9;
    	let img4;
    	let img4_src_value;
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
    			attr_dev(td0, "class", "name svelte-1yq5kr");
    			set_style(td0, "background-color", /*player*/ ctx[0].color);
    			add_location(td0, file, 7, 12, 129);
    			add_location(tr0, file, 6, 8, 112);
    			if (img0.src !== (img0_src_value = "tree_item.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-1yq5kr");
    			add_location(img0, file, 12, 16, 292);
    			attr_dev(td1, "class", "svelte-1yq5kr");
    			add_location(td1, file, 12, 12, 288);
    			attr_dev(td2, "class", "number svelte-1yq5kr");
    			add_location(td2, file, 13, 12, 335);
    			add_location(tr1, file, 11, 8, 271);
    			if (img1.src !== (img1_src_value = "mud_item.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-1yq5kr");
    			add_location(img1, file, 16, 16, 425);
    			attr_dev(td3, "class", "svelte-1yq5kr");
    			add_location(td3, file, 16, 12, 421);
    			attr_dev(td4, "class", "number svelte-1yq5kr");
    			add_location(td4, file, 17, 12, 467);
    			add_location(tr2, file, 15, 8, 404);
    			if (img2.src !== (img2_src_value = "wheat_item.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-1yq5kr");
    			add_location(img2, file, 20, 16, 556);
    			attr_dev(td5, "class", "svelte-1yq5kr");
    			add_location(td5, file, 20, 12, 552);
    			attr_dev(td6, "class", "number svelte-1yq5kr");
    			add_location(td6, file, 21, 12, 600);
    			add_location(tr3, file, 19, 8, 535);
    			if (img3.src !== (img3_src_value = "sheep_item.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-1yq5kr");
    			add_location(img3, file, 24, 16, 691);
    			attr_dev(td7, "class", "svelte-1yq5kr");
    			add_location(td7, file, 24, 12, 687);
    			attr_dev(td8, "class", "number svelte-1yq5kr");
    			add_location(td8, file, 25, 12, 735);
    			add_location(tr4, file, 23, 8, 670);
    			if (img4.src !== (img4_src_value = "iron_item.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-1yq5kr");
    			add_location(img4, file, 28, 16, 826);
    			attr_dev(td9, "class", "svelte-1yq5kr");
    			add_location(td9, file, 28, 12, 822);
    			attr_dev(td10, "class", "number svelte-1yq5kr");
    			add_location(td10, file, 29, 12, 869);
    			add_location(tr5, file, 27, 8, 805);
    			attr_dev(table, "class", "resource svelte-1yq5kr");
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

    			if (dirty & /*player*/ 1 && t3_value !== (t3_value = /*player*/ ctx[0].resource.tree + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*player*/ 1 && t6_value !== (t6_value = /*player*/ ctx[0].resource.mud + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*player*/ 1 && t9_value !== (t9_value = /*player*/ ctx[0].resource.wheat + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*player*/ 1 && t12_value !== (t12_value = /*player*/ ctx[0].resource.sheep + "")) set_data_dev(t12, t12_value);
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

    /* src\Cell.svelte generated by Svelte v3.32.3 */
    const file$1 = "src\\Cell.svelte";

    function create_fragment$1(ctx) {
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1_value = /*resource*/ ctx[0].number + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			if (img.src !== (img_src_value = /*imageSrc*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "style", /*imageStyle*/ ctx[3]);
    			attr_dev(img, "alt", /*imageSrc*/ ctx[5]);
    			add_location(img, file$1, 39, 8, 1268);
    			attr_dev(div0, "class", "number svelte-1h966hm");
    			attr_dev(div0, "style", /*numberStyle*/ ctx[4]);
    			add_location(div0, file$1, 40, 8, 1331);
    			attr_dev(div1, "class", "inner-cell");
    			attr_dev(div1, "style", /*innerCellStyle*/ ctx[2]);
    			add_location(div1, file$1, 38, 4, 1212);
    			attr_dev(div2, "class", "cell svelte-1h966hm");
    			attr_dev(div2, "style", /*cellStyle*/ ctx[1]);
    			add_location(div2, file$1, 37, 0, 1171);
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
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*resource*/ 1 && t1_value !== (t1_value = /*resource*/ ctx[0].number + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cell", slots, []);
    	let { resource } = $$props;
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

    	let numberStyle = toStyle({
    		left: (config.cell.width - config.number.width) / 2 + "px",
    		top: (config.cell.height - config.number.height) / 2 + "px",
    		width: config.number.width + "px",
    		height: config.number.height + "px",
    		"line-height": config.number.height + "px",
    		"border-radius": config.number.height / 2 + "px",
    		"font-size": 2 * config.number.height / 5 + "px"
    	});

    	let imageSrc = `${resource.type}.png`;
    	const writable_props = ["resource"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("resource" in $$props) $$invalidate(0, resource = $$props.resource);
    	};

    	$$self.$capture_state = () => ({
    		config,
    		toStyle,
    		resource,
    		margin,
    		offset,
    		cellStyle,
    		innerCellStyle,
    		imageStyle,
    		numberStyle,
    		imageSrc
    	});

    	$$self.$inject_state = $$props => {
    		if ("resource" in $$props) $$invalidate(0, resource = $$props.resource);
    		if ("cellStyle" in $$props) $$invalidate(1, cellStyle = $$props.cellStyle);
    		if ("innerCellStyle" in $$props) $$invalidate(2, innerCellStyle = $$props.innerCellStyle);
    		if ("imageStyle" in $$props) $$invalidate(3, imageStyle = $$props.imageStyle);
    		if ("numberStyle" in $$props) $$invalidate(4, numberStyle = $$props.numberStyle);
    		if ("imageSrc" in $$props) $$invalidate(5, imageSrc = $$props.imageSrc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [resource, cellStyle, innerCellStyle, imageStyle, numberStyle, imageSrc];
    }

    class Cell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { resource: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*resource*/ ctx[0] === undefined && !("resource" in props)) {
    			console.warn("<Cell> was created without expected prop 'resource'");
    		}
    	}

    	get resource() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resource(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
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

    let katan = {
        message: '마을을 만들곳을 클릭하세요',
        dice: [6, 6],
        mode: 'ready',
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

            return resource;
        });

    const { subscribe: subscribe$1, set, update: update$1 } = writable(katan);

    const katanStore = {
        subscribe: subscribe$1,

        isReady: () => katan.mode === 'ready',

        isStart: () => katan.mode === 'start',

        start: () => update$1(katan => {
            katan.mode = 'start';
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

        roll: (a, b) => update$1(katna => {
            katna.dice[0] = a;
            katna.dice[1] = b;
            return katan;
        }),

        getNumber: () => katna.dice[0] =  + katna.dice[1],

        isStartable: () => {
            let pickCompletePlayerLength = katan.playerList
                .filter(player => player.pickCastle === 2)
                .filter(player => player.pickRoad === 2)
                .length;

            debugger;

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

        setHideCastle: () => update$1( katan => {
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

    /* src\Castle.svelte generated by Svelte v3.32.3 */
    const file$2 = "src\\Castle.svelte";

    // (64:0) {:else}
    function create_else_block(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let if_block = /*castle*/ ctx[0].title !== undefined && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "castle svelte-k5k0y7");
    			attr_dev(div, "style", /*castleStyle*/ ctx[1]);
    			toggle_class(div, "ripple", /*castle*/ ctx[0].ripple);
    			toggle_class(div, "hide", /*castle*/ ctx[0].hide);
    			toggle_class(div, "show", /*castle*/ ctx[0].show);
    			add_location(div, file$2, 64, 4, 1721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*castle*/ ctx[0].title !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*castleStyle*/ 2) {
    				attr_dev(div, "style", /*castleStyle*/ ctx[1]);
    			}

    			if (dirty & /*castle*/ 1) {
    				toggle_class(div, "ripple", /*castle*/ ctx[0].ripple);
    			}

    			if (dirty & /*castle*/ 1) {
    				toggle_class(div, "hide", /*castle*/ ctx[0].hide);
    			}

    			if (dirty & /*castle*/ 1) {
    				toggle_class(div, "show", /*castle*/ ctx[0].show);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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
    function create_if_block(ctx) {
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
    			add_location(div0, file$2, 60, 4, 1635);
    			add_location(div1, file$2, 61, 4, 1673);
    			attr_dev(div2, "class", "castle svelte-k5k0y7");
    			attr_dev(div2, "style", /*castleStyle*/ ctx[1]);
    			add_location(div2, file$2, 59, 4, 1589);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(59:0) {#if config.debug}",
    		ctx
    	});

    	return block;
    }

    // (71:4) {#if castle.title !== undefined}
    function create_if_block_1(ctx) {
    	let div;
    	let t_value = /*castle*/ ctx[0].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$2, 71, 8, 1942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*castle*/ 1 && t_value !== (t_value = /*castle*/ ctx[0].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(71:4) {#if castle.title !== undefined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (config.debug) return create_if_block;
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
    	let div;
    	let mounted;
    	let dispose;
    	let if_block = /*road*/ ctx[0].title !== undefined && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "road svelte-175ndjm");
    			attr_dev(div, "style", /*roadStyle*/ ctx[1]);
    			toggle_class(div, "ripple", /*road*/ ctx[0].ripple);
    			toggle_class(div, "pick", /*road*/ ctx[0].ripple);
    			toggle_class(div, "hide", /*road*/ ctx[0].hide);
    			toggle_class(div, "show", /*road*/ ctx[0].show);
    			add_location(div, file$3, 72, 4, 1766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*road*/ ctx[0].title !== undefined) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*roadStyle*/ 2) {
    				attr_dev(div, "style", /*roadStyle*/ ctx[1]);
    			}

    			if (dirty & /*road*/ 1) {
    				toggle_class(div, "ripple", /*road*/ ctx[0].ripple);
    			}

    			if (dirty & /*road*/ 1) {
    				toggle_class(div, "pick", /*road*/ ctx[0].ripple);
    			}

    			if (dirty & /*road*/ 1) {
    				toggle_class(div, "hide", /*road*/ ctx[0].hide);
    			}

    			if (dirty & /*road*/ 1) {
    				toggle_class(div, "show", /*road*/ ctx[0].show);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
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
    function create_if_block$1(ctx) {
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
    			attr_dev(div2, "class", "road svelte-175ndjm");
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(67:0) {#if config.debug}",
    		ctx
    	});

    	return block;
    }

    // (80:4) {#if road.title !== undefined}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t_value = /*road*/ ctx[0].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			add_location(div, file$3, 80, 8, 2022);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*road*/ 1 && t_value !== (t_value = /*road*/ ctx[0].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(80:4) {#if road.title !== undefined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (config.debug) return create_if_block$1;
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
    	return child_ctx;
    }

    // (19:4) {#each resourceList as resource}
    function create_each_block_2(ctx) {
    	let cell;
    	let current;

    	cell = new Cell({
    			props: { resource: /*resource*/ ctx[9] },
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
    		p: function update(ctx, dirty) {
    			const cell_changes = {};
    			if (dirty & /*resourceList*/ 1) cell_changes.resource = /*resource*/ ctx[9];
    			cell.$set(cell_changes);
    		},
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
    		source: "(19:4) {#each resourceList as resource}",
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

    function create_fragment$6(ctx) {
    	let main;
    	let table;
    	let tr0;
    	let td0;
    	let t0;
    	let td1;
    	let div0;
    	let t1_value = /*$katan*/ ctx[0].mode + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = /*$katan*/ ctx[0].message + "";
    	let t3;
    	let t4;
    	let div2;
    	let dice0;
    	let t5;
    	let dice1;
    	let t6;
    	let button;
    	let t8;
    	let td2;
    	let t9;
    	let tr1;
    	let td3;
    	let player0;
    	let t10;
    	let td4;
    	let board;
    	let t11;
    	let td5;
    	let player1;
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

    	const block = {
    		c: function create() {
    			main = element("main");
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			create_component(dice0.$$.fragment);
    			t5 = space();
    			create_component(dice1.$$.fragment);
    			t6 = space();
    			button = element("button");
    			button.textContent = "주사위 굴리기";
    			t8 = space();
    			td2 = element("td");
    			t9 = space();
    			tr1 = element("tr");
    			td3 = element("td");
    			create_component(player0.$$.fragment);
    			t10 = space();
    			td4 = element("td");
    			create_component(board.$$.fragment);
    			t11 = space();
    			td5 = element("td");
    			create_component(player1.$$.fragment);
    			attr_dev(td0, "class", "svelte-fd1w91");
    			add_location(td0, file$6, 30, 12, 813);
    			add_location(div0, file$6, 32, 16, 858);
    			add_location(div1, file$6, 33, 16, 900);
    			attr_dev(button, "class", "btn btn-primary");
    			add_location(button, file$6, 37, 20, 1119);
    			toggle_class(div2, "hide", katanStore.isReady());
    			add_location(div2, file$6, 34, 16, 945);
    			attr_dev(td1, "class", "svelte-fd1w91");
    			add_location(td1, file$6, 31, 12, 836);
    			attr_dev(td2, "class", "svelte-fd1w91");
    			add_location(td2, file$6, 40, 12, 1248);
    			add_location(tr0, file$6, 29, 8, 795);
    			attr_dev(td3, "valign", "top");
    			attr_dev(td3, "class", "player svelte-fd1w91");
    			add_location(td3, file$6, 43, 12, 1300);
    			attr_dev(td4, "valign", "top");
    			attr_dev(td4, "class", "svelte-fd1w91");
    			add_location(td4, file$6, 46, 12, 1430);
    			attr_dev(td5, "valign", "top");
    			attr_dev(td5, "class", "player svelte-fd1w91");
    			add_location(td5, file$6, 51, 12, 1625);
    			add_location(tr1, file$6, 42, 8, 1282);
    			add_location(table, file$6, 28, 4, 778);
    			set_style(main, "margin", "auto");
    			set_style(main, "width", "80%");
    			add_location(main, file$6, 27, 0, 733);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, table);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(tr0, t0);
    			append_dev(tr0, td1);
    			append_dev(td1, div0);
    			append_dev(div0, t1);
    			append_dev(td1, t2);
    			append_dev(td1, div1);
    			append_dev(div1, t3);
    			append_dev(td1, t4);
    			append_dev(td1, div2);
    			mount_component(dice0, div2, null);
    			append_dev(div2, t5);
    			mount_component(dice1, div2, null);
    			append_dev(div2, t6);
    			append_dev(div2, button);
    			append_dev(tr0, t8);
    			append_dev(tr0, td2);
    			append_dev(table, t9);
    			append_dev(table, tr1);
    			append_dev(tr1, td3);
    			mount_component(player0, td3, null);
    			append_dev(tr1, t10);
    			append_dev(tr1, td4);
    			mount_component(board, td4, null);
    			append_dev(tr1, t11);
    			append_dev(tr1, td5);
    			mount_component(player1, td5, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
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

    	function play() {
    		const a = Math.floor(Math.random() * 6) + 1;
    		const b = Math.floor(Math.random() * 6) + 1;
    		katanStore.roll(a, b);
    		const number = katanStore.getNumber();

    		$katan.resourceList.filter(resouce => resouce.number === number).forEach(resouce => {
    			const player = $katan.playerList.find(play => play.turn);
    			player.resource[resouce.type]++;
    		});

    		katanStore.turn();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => play();
    	$$self.$capture_state = () => ({ Player, Board, Dice, katan: katanStore, play, $katan });
    	return [$katan, play, click_handler];
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

}());
//# sourceMappingURL=bundle.js.map
