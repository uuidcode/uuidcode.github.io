
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
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
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
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
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
    function tick() {
        schedule_update();
        return resolved_promise;
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
     * jQuery JavaScript Library v3.6.0
     * https://jquery.com/
     *
     * Includes Sizzle.js
     * https://sizzlejs.com/
     *
     * Copyright OpenJS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2021-03-02T17:08Z
     */

    var jquery = createCommonjsModule(function (module) {
    ( function( global, factory ) {

    	{

    		// For CommonJS and CommonJS-like environments where a proper `window`
    		// is present, execute the factory and get jQuery.
    		// For environments that do not have a `window` with a `document`
    		// (such as Node.js), expose a factory as module.exports.
    		// This accentuates the need for the creation of a real `window`.
    		// e.g. var jQuery = require("jquery")(window);
    		// See ticket #14549 for more info.
    		module.exports = global.document ?
    			factory( global, true ) :
    			function( w ) {
    				if ( !w.document ) {
    					throw new Error( "jQuery requires a window with a document" );
    				}
    				return factory( w );
    			};
    	}

    // Pass this if window is not defined yet
    } )( typeof window !== "undefined" ? window : commonjsGlobal, function( window, noGlobal ) {

    var arr = [];

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var flat = arr.flat ? function( array ) {
    	return arr.flat.call( array );
    } : function( array ) {
    	return arr.concat.apply( [], array );
    };


    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var fnToString = hasOwn.toString;

    var ObjectFunctionString = fnToString.call( Object );

    var support = {};

    var isFunction = function isFunction( obj ) {

    		// Support: Chrome <=57, Firefox <=52
    		// In some browsers, typeof returns "function" for HTML <object> elements
    		// (i.e., `typeof document.createElement( "object" ) === "function"`).
    		// We don't want to classify *any* DOM node as a function.
    		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
    		// Plus for old WebKit, typeof returns "function" for HTML collections
    		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
    		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
    			typeof obj.item !== "function";
    	};


    var isWindow = function isWindow( obj ) {
    		return obj != null && obj === obj.window;
    	};


    var document = window.document;



    	var preservedScriptAttributes = {
    		type: true,
    		src: true,
    		nonce: true,
    		noModule: true
    	};

    	function DOMEval( code, node, doc ) {
    		doc = doc || document;

    		var i, val,
    			script = doc.createElement( "script" );

    		script.text = code;
    		if ( node ) {
    			for ( i in preservedScriptAttributes ) {

    				// Support: Firefox 64+, Edge 18+
    				// Some browsers don't support the "nonce" property on scripts.
    				// On the other hand, just using `getAttribute` is not enough as
    				// the `nonce` attribute is reset to an empty string whenever it
    				// becomes browsing-context connected.
    				// See https://github.com/whatwg/html/issues/2369
    				// See https://html.spec.whatwg.org/#nonce-attributes
    				// The `node.getAttribute` check was added for the sake of
    				// `jQuery.globalEval` so that it can fake a nonce-containing node
    				// via an object.
    				val = node[ i ] || node.getAttribute && node.getAttribute( i );
    				if ( val ) {
    					script.setAttribute( i, val );
    				}
    			}
    		}
    		doc.head.appendChild( script ).parentNode.removeChild( script );
    	}


    function toType( obj ) {
    	if ( obj == null ) {
    		return obj + "";
    	}

    	// Support: Android <=2.3 only (functionish RegExp)
    	return typeof obj === "object" || typeof obj === "function" ?
    		class2type[ toString.call( obj ) ] || "object" :
    		typeof obj;
    }
    /* global Symbol */
    // Defining this global in .eslintrc.json would create a danger of using the global
    // unguarded in another place, it seems safer to define global only for this module



    var
    	version = "3.6.0",

    	// Define a local copy of jQuery
    	jQuery = function( selector, context ) {

    		// The jQuery object is actually just the init constructor 'enhanced'
    		// Need init if jQuery is called (just allow error to be thrown if not included)
    		return new jQuery.fn.init( selector, context );
    	};

    jQuery.fn = jQuery.prototype = {

    	// The current version of jQuery being used
    	jquery: version,

    	constructor: jQuery,

    	// The default length of a jQuery object is 0
    	length: 0,

    	toArray: function() {
    		return slice.call( this );
    	},

    	// Get the Nth element in the matched element set OR
    	// Get the whole matched element set as a clean array
    	get: function( num ) {

    		// Return all the elements in a clean array
    		if ( num == null ) {
    			return slice.call( this );
    		}

    		// Return just the one element from the set
    		return num < 0 ? this[ num + this.length ] : this[ num ];
    	},

    	// Take an array of elements and push it onto the stack
    	// (returning the new matched element set)
    	pushStack: function( elems ) {

    		// Build a new jQuery matched element set
    		var ret = jQuery.merge( this.constructor(), elems );

    		// Add the old object onto the stack (as a reference)
    		ret.prevObject = this;

    		// Return the newly-formed element set
    		return ret;
    	},

    	// Execute a callback for every element in the matched set.
    	each: function( callback ) {
    		return jQuery.each( this, callback );
    	},

    	map: function( callback ) {
    		return this.pushStack( jQuery.map( this, function( elem, i ) {
    			return callback.call( elem, i, elem );
    		} ) );
    	},

    	slice: function() {
    		return this.pushStack( slice.apply( this, arguments ) );
    	},

    	first: function() {
    		return this.eq( 0 );
    	},

    	last: function() {
    		return this.eq( -1 );
    	},

    	even: function() {
    		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
    			return ( i + 1 ) % 2;
    		} ) );
    	},

    	odd: function() {
    		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
    			return i % 2;
    		} ) );
    	},

    	eq: function( i ) {
    		var len = this.length,
    			j = +i + ( i < 0 ? len : 0 );
    		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
    	},

    	end: function() {
    		return this.prevObject || this.constructor();
    	},

    	// For internal use only.
    	// Behaves like an Array's method, not like a jQuery method.
    	push: push,
    	sort: arr.sort,
    	splice: arr.splice
    };

    jQuery.extend = jQuery.fn.extend = function() {
    	var options, name, src, copy, copyIsArray, clone,
    		target = arguments[ 0 ] || {},
    		i = 1,
    		length = arguments.length,
    		deep = false;

    	// Handle a deep copy situation
    	if ( typeof target === "boolean" ) {
    		deep = target;

    		// Skip the boolean and the target
    		target = arguments[ i ] || {};
    		i++;
    	}

    	// Handle case when target is a string or something (possible in deep copy)
    	if ( typeof target !== "object" && !isFunction( target ) ) {
    		target = {};
    	}

    	// Extend jQuery itself if only one argument is passed
    	if ( i === length ) {
    		target = this;
    		i--;
    	}

    	for ( ; i < length; i++ ) {

    		// Only deal with non-null/undefined values
    		if ( ( options = arguments[ i ] ) != null ) {

    			// Extend the base object
    			for ( name in options ) {
    				copy = options[ name ];

    				// Prevent Object.prototype pollution
    				// Prevent never-ending loop
    				if ( name === "__proto__" || target === copy ) {
    					continue;
    				}

    				// Recurse if we're merging plain objects or arrays
    				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
    					( copyIsArray = Array.isArray( copy ) ) ) ) {
    					src = target[ name ];

    					// Ensure proper type for the source value
    					if ( copyIsArray && !Array.isArray( src ) ) {
    						clone = [];
    					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
    						clone = {};
    					} else {
    						clone = src;
    					}
    					copyIsArray = false;

    					// Never move original objects, clone them
    					target[ name ] = jQuery.extend( deep, clone, copy );

    				// Don't bring in undefined values
    				} else if ( copy !== undefined ) {
    					target[ name ] = copy;
    				}
    			}
    		}
    	}

    	// Return the modified object
    	return target;
    };

    jQuery.extend( {

    	// Unique for each copy of jQuery on the page
    	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

    	// Assume jQuery is ready without the ready module
    	isReady: true,

    	error: function( msg ) {
    		throw new Error( msg );
    	},

    	noop: function() {},

    	isPlainObject: function( obj ) {
    		var proto, Ctor;

    		// Detect obvious negatives
    		// Use toString instead of jQuery.type to catch host objects
    		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
    			return false;
    		}

    		proto = getProto( obj );

    		// Objects with no prototype (e.g., `Object.create( null )`) are plain
    		if ( !proto ) {
    			return true;
    		}

    		// Objects with prototype are plain iff they were constructed by a global Object function
    		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
    		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
    	},

    	isEmptyObject: function( obj ) {
    		var name;

    		for ( name in obj ) {
    			return false;
    		}
    		return true;
    	},

    	// Evaluates a script in a provided context; falls back to the global one
    	// if not specified.
    	globalEval: function( code, options, doc ) {
    		DOMEval( code, { nonce: options && options.nonce }, doc );
    	},

    	each: function( obj, callback ) {
    		var length, i = 0;

    		if ( isArrayLike( obj ) ) {
    			length = obj.length;
    			for ( ; i < length; i++ ) {
    				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    					break;
    				}
    			}
    		} else {
    			for ( i in obj ) {
    				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    					break;
    				}
    			}
    		}

    		return obj;
    	},

    	// results is for internal usage only
    	makeArray: function( arr, results ) {
    		var ret = results || [];

    		if ( arr != null ) {
    			if ( isArrayLike( Object( arr ) ) ) {
    				jQuery.merge( ret,
    					typeof arr === "string" ?
    						[ arr ] : arr
    				);
    			} else {
    				push.call( ret, arr );
    			}
    		}

    		return ret;
    	},

    	inArray: function( elem, arr, i ) {
    		return arr == null ? -1 : indexOf.call( arr, elem, i );
    	},

    	// Support: Android <=4.0 only, PhantomJS 1 only
    	// push.apply(_, arraylike) throws on ancient WebKit
    	merge: function( first, second ) {
    		var len = +second.length,
    			j = 0,
    			i = first.length;

    		for ( ; j < len; j++ ) {
    			first[ i++ ] = second[ j ];
    		}

    		first.length = i;

    		return first;
    	},

    	grep: function( elems, callback, invert ) {
    		var callbackInverse,
    			matches = [],
    			i = 0,
    			length = elems.length,
    			callbackExpect = !invert;

    		// Go through the array, only saving the items
    		// that pass the validator function
    		for ( ; i < length; i++ ) {
    			callbackInverse = !callback( elems[ i ], i );
    			if ( callbackInverse !== callbackExpect ) {
    				matches.push( elems[ i ] );
    			}
    		}

    		return matches;
    	},

    	// arg is for internal usage only
    	map: function( elems, callback, arg ) {
    		var length, value,
    			i = 0,
    			ret = [];

    		// Go through the array, translating each of the items to their new values
    		if ( isArrayLike( elems ) ) {
    			length = elems.length;
    			for ( ; i < length; i++ ) {
    				value = callback( elems[ i ], i, arg );

    				if ( value != null ) {
    					ret.push( value );
    				}
    			}

    		// Go through every key on the object,
    		} else {
    			for ( i in elems ) {
    				value = callback( elems[ i ], i, arg );

    				if ( value != null ) {
    					ret.push( value );
    				}
    			}
    		}

    		// Flatten any nested arrays
    		return flat( ret );
    	},

    	// A global GUID counter for objects
    	guid: 1,

    	// jQuery.support is not used in Core but other projects attach their
    	// properties to it so it needs to exist.
    	support: support
    } );

    if ( typeof Symbol === "function" ) {
    	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
    }

    // Populate the class2type map
    jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
    	function( _i, name ) {
    		class2type[ "[object " + name + "]" ] = name.toLowerCase();
    	} );

    function isArrayLike( obj ) {

    	// Support: real iOS 8.2 only (not reproducible in simulator)
    	// `in` check used to prevent JIT error (gh-2145)
    	// hasOwn isn't used here due to false negatives
    	// regarding Nodelist length in IE
    	var length = !!obj && "length" in obj && obj.length,
    		type = toType( obj );

    	if ( isFunction( obj ) || isWindow( obj ) ) {
    		return false;
    	}

    	return type === "array" || length === 0 ||
    		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    }
    var Sizzle =
    /*!
     * Sizzle CSS Selector Engine v2.3.6
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://js.foundation/
     *
     * Date: 2021-02-16
     */
    ( function( window ) {
    var i,
    	support,
    	Expr,
    	getText,
    	isXML,
    	tokenize,
    	compile,
    	select,
    	outermostContext,
    	sortInput,
    	hasDuplicate,

    	// Local document vars
    	setDocument,
    	document,
    	docElem,
    	documentIsHTML,
    	rbuggyQSA,
    	rbuggyMatches,
    	matches,
    	contains,

    	// Instance-specific data
    	expando = "sizzle" + 1 * new Date(),
    	preferredDoc = window.document,
    	dirruns = 0,
    	done = 0,
    	classCache = createCache(),
    	tokenCache = createCache(),
    	compilerCache = createCache(),
    	nonnativeSelectorCache = createCache(),
    	sortOrder = function( a, b ) {
    		if ( a === b ) {
    			hasDuplicate = true;
    		}
    		return 0;
    	},

    	// Instance methods
    	hasOwn = ( {} ).hasOwnProperty,
    	arr = [],
    	pop = arr.pop,
    	pushNative = arr.push,
    	push = arr.push,
    	slice = arr.slice,

    	// Use a stripped-down indexOf as it's faster than native
    	// https://jsperf.com/thor-indexof-vs-for/5
    	indexOf = function( list, elem ) {
    		var i = 0,
    			len = list.length;
    		for ( ; i < len; i++ ) {
    			if ( list[ i ] === elem ) {
    				return i;
    			}
    		}
    		return -1;
    	},

    	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
    		"ismap|loop|multiple|open|readonly|required|scoped",

    	// Regular expressions

    	// http://www.w3.org/TR/css3-selectors/#whitespace
    	whitespace = "[\\x20\\t\\r\\n\\f]",

    	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
    	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
    		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

    	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

    		// Operator (capture 2)
    		"*([*^$|!~]?=)" + whitespace +

    		// "Attribute values must be CSS identifiers [capture 5]
    		// or strings [capture 3 or capture 4]"
    		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
    		whitespace + "*\\]",

    	pseudos = ":(" + identifier + ")(?:\\((" +

    		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
    		// 1. quoted (capture 3; capture 4 or capture 5)
    		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

    		// 2. simple (capture 6)
    		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

    		// 3. anything else (capture 2)
    		".*" +
    		")\\)|)",

    	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    	rwhitespace = new RegExp( whitespace + "+", "g" ),
    	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
    		whitespace + "+$", "g" ),

    	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
    		"*" ),
    	rdescend = new RegExp( whitespace + "|>" ),

    	rpseudo = new RegExp( pseudos ),
    	ridentifier = new RegExp( "^" + identifier + "$" ),

    	matchExpr = {
    		"ID": new RegExp( "^#(" + identifier + ")" ),
    		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
    		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
    		"ATTR": new RegExp( "^" + attributes ),
    		"PSEUDO": new RegExp( "^" + pseudos ),
    		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
    			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
    			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

    		// For use in libraries implementing .is()
    		// We use this for POS matching in `select`
    		"needsContext": new RegExp( "^" + whitespace +
    			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
    			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    	},

    	rhtml = /HTML$/i,
    	rinputs = /^(?:input|select|textarea|button)$/i,
    	rheader = /^h\d$/i,

    	rnative = /^[^{]+\{\s*\[native \w/,

    	// Easily-parseable/retrievable ID or TAG or CLASS selectors
    	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    	rsibling = /[+~]/,

    	// CSS escapes
    	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
    	funescape = function( escape, nonHex ) {
    		var high = "0x" + escape.slice( 1 ) - 0x10000;

    		return nonHex ?

    			// Strip the backslash prefix from a non-hex escape sequence
    			nonHex :

    			// Replace a hexadecimal escape sequence with the encoded Unicode code point
    			// Support: IE <=11+
    			// For values outside the Basic Multilingual Plane (BMP), manually construct a
    			// surrogate pair
    			high < 0 ?
    				String.fromCharCode( high + 0x10000 ) :
    				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    	},

    	// CSS string/identifier serialization
    	// https://drafts.csswg.org/cssom/#common-serializing-idioms
    	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
    	fcssescape = function( ch, asCodePoint ) {
    		if ( asCodePoint ) {

    			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
    			if ( ch === "\0" ) {
    				return "\uFFFD";
    			}

    			// Control characters and (dependent upon position) numbers get escaped as code points
    			return ch.slice( 0, -1 ) + "\\" +
    				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
    		}

    		// Other potentially-special ASCII characters get backslash-escaped
    		return "\\" + ch;
    	},

    	// Used for iframes
    	// See setDocument()
    	// Removing the function wrapper causes a "Permission Denied"
    	// error in IE
    	unloadHandler = function() {
    		setDocument();
    	},

    	inDisabledFieldset = addCombinator(
    		function( elem ) {
    			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
    		},
    		{ dir: "parentNode", next: "legend" }
    	);

    // Optimize for push.apply( _, NodeList )
    try {
    	push.apply(
    		( arr = slice.call( preferredDoc.childNodes ) ),
    		preferredDoc.childNodes
    	);

    	// Support: Android<4.0
    	// Detect silently failing push.apply
    	// eslint-disable-next-line no-unused-expressions
    	arr[ preferredDoc.childNodes.length ].nodeType;
    } catch ( e ) {
    	push = { apply: arr.length ?

    		// Leverage slice if possible
    		function( target, els ) {
    			pushNative.apply( target, slice.call( els ) );
    		} :

    		// Support: IE<9
    		// Otherwise append directly
    		function( target, els ) {
    			var j = target.length,
    				i = 0;

    			// Can't trust NodeList.length
    			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
    			target.length = j - 1;
    		}
    	};
    }

    function Sizzle( selector, context, results, seed ) {
    	var m, i, elem, nid, match, groups, newSelector,
    		newContext = context && context.ownerDocument,

    		// nodeType defaults to 9, since context defaults to document
    		nodeType = context ? context.nodeType : 9;

    	results = results || [];

    	// Return early from calls with invalid selector or context
    	if ( typeof selector !== "string" || !selector ||
    		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

    		return results;
    	}

    	// Try to shortcut find operations (as opposed to filters) in HTML documents
    	if ( !seed ) {
    		setDocument( context );
    		context = context || document;

    		if ( documentIsHTML ) {

    			// If the selector is sufficiently simple, try using a "get*By*" DOM method
    			// (excepting DocumentFragment context, where the methods don't exist)
    			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

    				// ID selector
    				if ( ( m = match[ 1 ] ) ) {

    					// Document context
    					if ( nodeType === 9 ) {
    						if ( ( elem = context.getElementById( m ) ) ) {

    							// Support: IE, Opera, Webkit
    							// TODO: identify versions
    							// getElementById can match elements by name instead of ID
    							if ( elem.id === m ) {
    								results.push( elem );
    								return results;
    							}
    						} else {
    							return results;
    						}

    					// Element context
    					} else {

    						// Support: IE, Opera, Webkit
    						// TODO: identify versions
    						// getElementById can match elements by name instead of ID
    						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
    							contains( context, elem ) &&
    							elem.id === m ) {

    							results.push( elem );
    							return results;
    						}
    					}

    				// Type selector
    				} else if ( match[ 2 ] ) {
    					push.apply( results, context.getElementsByTagName( selector ) );
    					return results;

    				// Class selector
    				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
    					context.getElementsByClassName ) {

    					push.apply( results, context.getElementsByClassName( m ) );
    					return results;
    				}
    			}

    			// Take advantage of querySelectorAll
    			if ( support.qsa &&
    				!nonnativeSelectorCache[ selector + " " ] &&
    				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

    				// Support: IE 8 only
    				// Exclude object elements
    				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

    				newSelector = selector;
    				newContext = context;

    				// qSA considers elements outside a scoping root when evaluating child or
    				// descendant combinators, which is not what we want.
    				// In such cases, we work around the behavior by prefixing every selector in the
    				// list with an ID selector referencing the scope context.
    				// The technique has to be used as well when a leading combinator is used
    				// as such selectors are not recognized by querySelectorAll.
    				// Thanks to Andrew Dupont for this technique.
    				if ( nodeType === 1 &&
    					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

    					// Expand context for sibling selectors
    					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
    						context;

    					// We can use :scope instead of the ID hack if the browser
    					// supports it & if we're not changing the context.
    					if ( newContext !== context || !support.scope ) {

    						// Capture the context ID, setting it first if necessary
    						if ( ( nid = context.getAttribute( "id" ) ) ) {
    							nid = nid.replace( rcssescape, fcssescape );
    						} else {
    							context.setAttribute( "id", ( nid = expando ) );
    						}
    					}

    					// Prefix every selector in the list
    					groups = tokenize( selector );
    					i = groups.length;
    					while ( i-- ) {
    						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
    							toSelector( groups[ i ] );
    					}
    					newSelector = groups.join( "," );
    				}

    				try {
    					push.apply( results,
    						newContext.querySelectorAll( newSelector )
    					);
    					return results;
    				} catch ( qsaError ) {
    					nonnativeSelectorCache( selector, true );
    				} finally {
    					if ( nid === expando ) {
    						context.removeAttribute( "id" );
    					}
    				}
    			}
    		}
    	}

    	// All others
    	return select( selector.replace( rtrim, "$1" ), context, results, seed );
    }

    /**
     * Create key-value caches of limited size
     * @returns {function(string, object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
    	var keys = [];

    	function cache( key, value ) {

    		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    		if ( keys.push( key + " " ) > Expr.cacheLength ) {

    			// Only keep the most recent entries
    			delete cache[ keys.shift() ];
    		}
    		return ( cache[ key + " " ] = value );
    	}
    	return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction( fn ) {
    	fn[ expando ] = true;
    	return fn;
    }

    /**
     * Support testing using an element
     * @param {Function} fn Passed the created element and returns a boolean result
     */
    function assert( fn ) {
    	var el = document.createElement( "fieldset" );

    	try {
    		return !!fn( el );
    	} catch ( e ) {
    		return false;
    	} finally {

    		// Remove from its parent by default
    		if ( el.parentNode ) {
    			el.parentNode.removeChild( el );
    		}

    		// release memory in IE
    		el = null;
    	}
    }

    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle( attrs, handler ) {
    	var arr = attrs.split( "|" ),
    		i = arr.length;

    	while ( i-- ) {
    		Expr.attrHandle[ arr[ i ] ] = handler;
    	}
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck( a, b ) {
    	var cur = b && a,
    		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
    			a.sourceIndex - b.sourceIndex;

    	// Use IE sourceIndex if available on both nodes
    	if ( diff ) {
    		return diff;
    	}

    	// Check if b follows a
    	if ( cur ) {
    		while ( ( cur = cur.nextSibling ) ) {
    			if ( cur === b ) {
    				return -1;
    			}
    		}
    	}

    	return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo( type ) {
    	return function( elem ) {
    		var name = elem.nodeName.toLowerCase();
    		return name === "input" && elem.type === type;
    	};
    }

    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo( type ) {
    	return function( elem ) {
    		var name = elem.nodeName.toLowerCase();
    		return ( name === "input" || name === "button" ) && elem.type === type;
    	};
    }

    /**
     * Returns a function to use in pseudos for :enabled/:disabled
     * @param {Boolean} disabled true for :disabled; false for :enabled
     */
    function createDisabledPseudo( disabled ) {

    	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
    	return function( elem ) {

    		// Only certain elements can match :enabled or :disabled
    		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
    		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
    		if ( "form" in elem ) {

    			// Check for inherited disabledness on relevant non-disabled elements:
    			// * listed form-associated elements in a disabled fieldset
    			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
    			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
    			// * option elements in a disabled optgroup
    			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
    			// All such elements have a "form" property.
    			if ( elem.parentNode && elem.disabled === false ) {

    				// Option elements defer to a parent optgroup if present
    				if ( "label" in elem ) {
    					if ( "label" in elem.parentNode ) {
    						return elem.parentNode.disabled === disabled;
    					} else {
    						return elem.disabled === disabled;
    					}
    				}

    				// Support: IE 6 - 11
    				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
    				return elem.isDisabled === disabled ||

    					// Where there is no isDisabled, check manually
    					/* jshint -W018 */
    					elem.isDisabled !== !disabled &&
    					inDisabledFieldset( elem ) === disabled;
    			}

    			return elem.disabled === disabled;

    		// Try to winnow out elements that can't be disabled before trusting the disabled property.
    		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
    		// even exist on them, let alone have a boolean value.
    		} else if ( "label" in elem ) {
    			return elem.disabled === disabled;
    		}

    		// Remaining elements are neither :enabled nor :disabled
    		return false;
    	};
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo( fn ) {
    	return markFunction( function( argument ) {
    		argument = +argument;
    		return markFunction( function( seed, matches ) {
    			var j,
    				matchIndexes = fn( [], seed.length, argument ),
    				i = matchIndexes.length;

    			// Match elements found at the specified indexes
    			while ( i-- ) {
    				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
    					seed[ j ] = !( matches[ j ] = seed[ j ] );
    				}
    			}
    		} );
    	} );
    }

    /**
     * Checks a node for validity as a Sizzle context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */
    function testContext( context ) {
    	return context && typeof context.getElementsByTagName !== "undefined" && context;
    }

    // Expose support vars for convenience
    support = Sizzle.support = {};

    /**
     * Detects XML nodes
     * @param {Element|Object} elem An element or a document
     * @returns {Boolean} True iff elem is a non-HTML XML node
     */
    isXML = Sizzle.isXML = function( elem ) {
    	var namespace = elem && elem.namespaceURI,
    		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

    	// Support: IE <=8
    	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
    	// https://bugs.jquery.com/ticket/4833
    	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
    };

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function( node ) {
    	var hasCompare, subWindow,
    		doc = node ? node.ownerDocument || node : preferredDoc;

    	// Return early if doc is invalid or already selected
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
    		return document;
    	}

    	// Update global variables
    	document = doc;
    	docElem = document.documentElement;
    	documentIsHTML = !isXML( document );

    	// Support: IE 9 - 11+, Edge 12 - 18+
    	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( preferredDoc != document &&
    		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

    		// Support: IE 11, Edge
    		if ( subWindow.addEventListener ) {
    			subWindow.addEventListener( "unload", unloadHandler, false );

    		// Support: IE 9 - 10 only
    		} else if ( subWindow.attachEvent ) {
    			subWindow.attachEvent( "onunload", unloadHandler );
    		}
    	}

    	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
    	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
    	// IE/Edge & older browsers don't support the :scope pseudo-class.
    	// Support: Safari 6.0 only
    	// Safari 6.0 supports :scope but it's an alias of :root there.
    	support.scope = assert( function( el ) {
    		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
    		return typeof el.querySelectorAll !== "undefined" &&
    			!el.querySelectorAll( ":scope fieldset div" ).length;
    	} );

    	/* Attributes
    	---------------------------------------------------------------------- */

    	// Support: IE<8
    	// Verify that getAttribute really returns attributes and not properties
    	// (excepting IE8 booleans)
    	support.attributes = assert( function( el ) {
    		el.className = "i";
    		return !el.getAttribute( "className" );
    	} );

    	/* getElement(s)By*
    	---------------------------------------------------------------------- */

    	// Check if getElementsByTagName("*") returns only elements
    	support.getElementsByTagName = assert( function( el ) {
    		el.appendChild( document.createComment( "" ) );
    		return !el.getElementsByTagName( "*" ).length;
    	} );

    	// Support: IE<9
    	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

    	// Support: IE<10
    	// Check if getElementById returns elements by name
    	// The broken getElementById methods don't pick up programmatically-set names,
    	// so use a roundabout getElementsByName test
    	support.getById = assert( function( el ) {
    		docElem.appendChild( el ).id = expando;
    		return !document.getElementsByName || !document.getElementsByName( expando ).length;
    	} );

    	// ID filter and find
    	if ( support.getById ) {
    		Expr.filter[ "ID" ] = function( id ) {
    			var attrId = id.replace( runescape, funescape );
    			return function( elem ) {
    				return elem.getAttribute( "id" ) === attrId;
    			};
    		};
    		Expr.find[ "ID" ] = function( id, context ) {
    			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    				var elem = context.getElementById( id );
    				return elem ? [ elem ] : [];
    			}
    		};
    	} else {
    		Expr.filter[ "ID" ] =  function( id ) {
    			var attrId = id.replace( runescape, funescape );
    			return function( elem ) {
    				var node = typeof elem.getAttributeNode !== "undefined" &&
    					elem.getAttributeNode( "id" );
    				return node && node.value === attrId;
    			};
    		};

    		// Support: IE 6 - 7 only
    		// getElementById is not reliable as a find shortcut
    		Expr.find[ "ID" ] = function( id, context ) {
    			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    				var node, i, elems,
    					elem = context.getElementById( id );

    				if ( elem ) {

    					// Verify the id attribute
    					node = elem.getAttributeNode( "id" );
    					if ( node && node.value === id ) {
    						return [ elem ];
    					}

    					// Fall back on getElementsByName
    					elems = context.getElementsByName( id );
    					i = 0;
    					while ( ( elem = elems[ i++ ] ) ) {
    						node = elem.getAttributeNode( "id" );
    						if ( node && node.value === id ) {
    							return [ elem ];
    						}
    					}
    				}

    				return [];
    			}
    		};
    	}

    	// Tag
    	Expr.find[ "TAG" ] = support.getElementsByTagName ?
    		function( tag, context ) {
    			if ( typeof context.getElementsByTagName !== "undefined" ) {
    				return context.getElementsByTagName( tag );

    			// DocumentFragment nodes don't have gEBTN
    			} else if ( support.qsa ) {
    				return context.querySelectorAll( tag );
    			}
    		} :

    		function( tag, context ) {
    			var elem,
    				tmp = [],
    				i = 0,

    				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
    				results = context.getElementsByTagName( tag );

    			// Filter out possible comments
    			if ( tag === "*" ) {
    				while ( ( elem = results[ i++ ] ) ) {
    					if ( elem.nodeType === 1 ) {
    						tmp.push( elem );
    					}
    				}

    				return tmp;
    			}
    			return results;
    		};

    	// Class
    	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
    		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
    			return context.getElementsByClassName( className );
    		}
    	};

    	/* QSA/matchesSelector
    	---------------------------------------------------------------------- */

    	// QSA and matchesSelector support

    	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
    	rbuggyMatches = [];

    	// qSa(:focus) reports false when true (Chrome 21)
    	// We allow this because of a bug in IE8/9 that throws an error
    	// whenever `document.activeElement` is accessed on an iframe
    	// So, we allow :focus to pass through QSA all the time to avoid the IE error
    	// See https://bugs.jquery.com/ticket/13378
    	rbuggyQSA = [];

    	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

    		// Build QSA regex
    		// Regex strategy adopted from Diego Perini
    		assert( function( el ) {

    			var input;

    			// Select is set to empty string on purpose
    			// This is to test IE's treatment of not explicitly
    			// setting a boolean content attribute,
    			// since its presence should be enough
    			// https://bugs.jquery.com/ticket/12359
    			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
    				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
    				"<option selected=''></option></select>";

    			// Support: IE8, Opera 11-12.16
    			// Nothing should be selected when empty strings follow ^= or $= or *=
    			// The test attribute must be unknown in Opera but "safe" for WinRT
    			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
    			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
    				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
    			}

    			// Support: IE8
    			// Boolean attributes and "value" are not treated correctly
    			if ( !el.querySelectorAll( "[selected]" ).length ) {
    				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
    			}

    			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
    			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
    				rbuggyQSA.push( "~=" );
    			}

    			// Support: IE 11+, Edge 15 - 18+
    			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
    			// Adding a temporary attribute to the document before the selection works
    			// around the issue.
    			// Interestingly, IE 10 & older don't seem to have the issue.
    			input = document.createElement( "input" );
    			input.setAttribute( "name", "" );
    			el.appendChild( input );
    			if ( !el.querySelectorAll( "[name='']" ).length ) {
    				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
    					whitespace + "*(?:''|\"\")" );
    			}

    			// Webkit/Opera - :checked should return selected option elements
    			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    			// IE8 throws error here and will not see later tests
    			if ( !el.querySelectorAll( ":checked" ).length ) {
    				rbuggyQSA.push( ":checked" );
    			}

    			// Support: Safari 8+, iOS 8+
    			// https://bugs.webkit.org/show_bug.cgi?id=136851
    			// In-page `selector#id sibling-combinator selector` fails
    			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
    				rbuggyQSA.push( ".#.+[+~]" );
    			}

    			// Support: Firefox <=3.6 - 5 only
    			// Old Firefox doesn't throw on a badly-escaped identifier.
    			el.querySelectorAll( "\\\f" );
    			rbuggyQSA.push( "[\\r\\n\\f]" );
    		} );

    		assert( function( el ) {
    			el.innerHTML = "<a href='' disabled='disabled'></a>" +
    				"<select disabled='disabled'><option/></select>";

    			// Support: Windows 8 Native Apps
    			// The type and name attributes are restricted during .innerHTML assignment
    			var input = document.createElement( "input" );
    			input.setAttribute( "type", "hidden" );
    			el.appendChild( input ).setAttribute( "name", "D" );

    			// Support: IE8
    			// Enforce case-sensitivity of name attribute
    			if ( el.querySelectorAll( "[name=d]" ).length ) {
    				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
    			}

    			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
    			// IE8 throws error here and will not see later tests
    			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
    				rbuggyQSA.push( ":enabled", ":disabled" );
    			}

    			// Support: IE9-11+
    			// IE's :disabled selector does not pick up the children of disabled fieldsets
    			docElem.appendChild( el ).disabled = true;
    			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
    				rbuggyQSA.push( ":enabled", ":disabled" );
    			}

    			// Support: Opera 10 - 11 only
    			// Opera 10-11 does not throw on post-comma invalid pseudos
    			el.querySelectorAll( "*,:x" );
    			rbuggyQSA.push( ",.*:" );
    		} );
    	}

    	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
    		docElem.webkitMatchesSelector ||
    		docElem.mozMatchesSelector ||
    		docElem.oMatchesSelector ||
    		docElem.msMatchesSelector ) ) ) ) {

    		assert( function( el ) {

    			// Check to see if it's possible to do matchesSelector
    			// on a disconnected node (IE 9)
    			support.disconnectedMatch = matches.call( el, "*" );

    			// This should fail with an exception
    			// Gecko does not error, returns false instead
    			matches.call( el, "[s!='']:x" );
    			rbuggyMatches.push( "!=", pseudos );
    		} );
    	}

    	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
    	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

    	/* Contains
    	---------------------------------------------------------------------- */
    	hasCompare = rnative.test( docElem.compareDocumentPosition );

    	// Element contains another
    	// Purposefully self-exclusive
    	// As in, an element does not contain itself
    	contains = hasCompare || rnative.test( docElem.contains ) ?
    		function( a, b ) {
    			var adown = a.nodeType === 9 ? a.documentElement : a,
    				bup = b && b.parentNode;
    			return a === bup || !!( bup && bup.nodeType === 1 && (
    				adown.contains ?
    					adown.contains( bup ) :
    					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
    			) );
    		} :
    		function( a, b ) {
    			if ( b ) {
    				while ( ( b = b.parentNode ) ) {
    					if ( b === a ) {
    						return true;
    					}
    				}
    			}
    			return false;
    		};

    	/* Sorting
    	---------------------------------------------------------------------- */

    	// Document order sorting
    	sortOrder = hasCompare ?
    	function( a, b ) {

    		// Flag for duplicate removal
    		if ( a === b ) {
    			hasDuplicate = true;
    			return 0;
    		}

    		// Sort on method existence if only one input has compareDocumentPosition
    		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
    		if ( compare ) {
    			return compare;
    		}

    		// Calculate position if both inputs belong to the same document
    		// Support: IE 11+, Edge 17 - 18+
    		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    		// two documents; shallow comparisons work.
    		// eslint-disable-next-line eqeqeq
    		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
    			a.compareDocumentPosition( b ) :

    			// Otherwise we know they are disconnected
    			1;

    		// Disconnected nodes
    		if ( compare & 1 ||
    			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

    			// Choose the first element that is related to our preferred document
    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			// eslint-disable-next-line eqeqeq
    			if ( a == document || a.ownerDocument == preferredDoc &&
    				contains( preferredDoc, a ) ) {
    				return -1;
    			}

    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			// eslint-disable-next-line eqeqeq
    			if ( b == document || b.ownerDocument == preferredDoc &&
    				contains( preferredDoc, b ) ) {
    				return 1;
    			}

    			// Maintain original order
    			return sortInput ?
    				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    				0;
    		}

    		return compare & 4 ? -1 : 1;
    	} :
    	function( a, b ) {

    		// Exit early if the nodes are identical
    		if ( a === b ) {
    			hasDuplicate = true;
    			return 0;
    		}

    		var cur,
    			i = 0,
    			aup = a.parentNode,
    			bup = b.parentNode,
    			ap = [ a ],
    			bp = [ b ];

    		// Parentless nodes are either documents or disconnected
    		if ( !aup || !bup ) {

    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			/* eslint-disable eqeqeq */
    			return a == document ? -1 :
    				b == document ? 1 :
    				/* eslint-enable eqeqeq */
    				aup ? -1 :
    				bup ? 1 :
    				sortInput ?
    				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    				0;

    		// If the nodes are siblings, we can do a quick check
    		} else if ( aup === bup ) {
    			return siblingCheck( a, b );
    		}

    		// Otherwise we need full lists of their ancestors for comparison
    		cur = a;
    		while ( ( cur = cur.parentNode ) ) {
    			ap.unshift( cur );
    		}
    		cur = b;
    		while ( ( cur = cur.parentNode ) ) {
    			bp.unshift( cur );
    		}

    		// Walk down the tree looking for a discrepancy
    		while ( ap[ i ] === bp[ i ] ) {
    			i++;
    		}

    		return i ?

    			// Do a sibling check if the nodes have a common ancestor
    			siblingCheck( ap[ i ], bp[ i ] ) :

    			// Otherwise nodes in our document sort first
    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			/* eslint-disable eqeqeq */
    			ap[ i ] == preferredDoc ? -1 :
    			bp[ i ] == preferredDoc ? 1 :
    			/* eslint-enable eqeqeq */
    			0;
    	};

    	return document;
    };

    Sizzle.matches = function( expr, elements ) {
    	return Sizzle( expr, null, null, elements );
    };

    Sizzle.matchesSelector = function( elem, expr ) {
    	setDocument( elem );

    	if ( support.matchesSelector && documentIsHTML &&
    		!nonnativeSelectorCache[ expr + " " ] &&
    		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
    		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

    		try {
    			var ret = matches.call( elem, expr );

    			// IE 9's matchesSelector returns false on disconnected nodes
    			if ( ret || support.disconnectedMatch ||

    				// As well, disconnected nodes are said to be in a document
    				// fragment in IE 9
    				elem.document && elem.document.nodeType !== 11 ) {
    				return ret;
    			}
    		} catch ( e ) {
    			nonnativeSelectorCache( expr, true );
    		}
    	}

    	return Sizzle( expr, document, null, [ elem ] ).length > 0;
    };

    Sizzle.contains = function( context, elem ) {

    	// Set document vars if needed
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( ( context.ownerDocument || context ) != document ) {
    		setDocument( context );
    	}
    	return contains( context, elem );
    };

    Sizzle.attr = function( elem, name ) {

    	// Set document vars if needed
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( ( elem.ownerDocument || elem ) != document ) {
    		setDocument( elem );
    	}

    	var fn = Expr.attrHandle[ name.toLowerCase() ],

    		// Don't get fooled by Object.prototype properties (jQuery #13807)
    		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
    			fn( elem, name, !documentIsHTML ) :
    			undefined;

    	return val !== undefined ?
    		val :
    		support.attributes || !documentIsHTML ?
    			elem.getAttribute( name ) :
    			( val = elem.getAttributeNode( name ) ) && val.specified ?
    				val.value :
    				null;
    };

    Sizzle.escape = function( sel ) {
    	return ( sel + "" ).replace( rcssescape, fcssescape );
    };

    Sizzle.error = function( msg ) {
    	throw new Error( "Syntax error, unrecognized expression: " + msg );
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function( results ) {
    	var elem,
    		duplicates = [],
    		j = 0,
    		i = 0;

    	// Unless we *know* we can detect duplicates, assume their presence
    	hasDuplicate = !support.detectDuplicates;
    	sortInput = !support.sortStable && results.slice( 0 );
    	results.sort( sortOrder );

    	if ( hasDuplicate ) {
    		while ( ( elem = results[ i++ ] ) ) {
    			if ( elem === results[ i ] ) {
    				j = duplicates.push( i );
    			}
    		}
    		while ( j-- ) {
    			results.splice( duplicates[ j ], 1 );
    		}
    	}

    	// Clear input after sorting to release objects
    	// See https://github.com/jquery/sizzle/pull/225
    	sortInput = null;

    	return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function( elem ) {
    	var node,
    		ret = "",
    		i = 0,
    		nodeType = elem.nodeType;

    	if ( !nodeType ) {

    		// If no nodeType, this is expected to be an array
    		while ( ( node = elem[ i++ ] ) ) {

    			// Do not traverse comment nodes
    			ret += getText( node );
    		}
    	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

    		// Use textContent for elements
    		// innerText usage removed for consistency of new lines (jQuery #11153)
    		if ( typeof elem.textContent === "string" ) {
    			return elem.textContent;
    		} else {

    			// Traverse its children
    			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    				ret += getText( elem );
    			}
    		}
    	} else if ( nodeType === 3 || nodeType === 4 ) {
    		return elem.nodeValue;
    	}

    	// Do not include comment or processing instruction nodes

    	return ret;
    };

    Expr = Sizzle.selectors = {

    	// Can be adjusted by the user
    	cacheLength: 50,

    	createPseudo: markFunction,

    	match: matchExpr,

    	attrHandle: {},

    	find: {},

    	relative: {
    		">": { dir: "parentNode", first: true },
    		" ": { dir: "parentNode" },
    		"+": { dir: "previousSibling", first: true },
    		"~": { dir: "previousSibling" }
    	},

    	preFilter: {
    		"ATTR": function( match ) {
    			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

    			// Move the given value to match[3] whether quoted or unquoted
    			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
    				match[ 5 ] || "" ).replace( runescape, funescape );

    			if ( match[ 2 ] === "~=" ) {
    				match[ 3 ] = " " + match[ 3 ] + " ";
    			}

    			return match.slice( 0, 4 );
    		},

    		"CHILD": function( match ) {

    			/* matches from matchExpr["CHILD"]
    				1 type (only|nth|...)
    				2 what (child|of-type)
    				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
    				4 xn-component of xn+y argument ([+-]?\d*n|)
    				5 sign of xn-component
    				6 x of xn-component
    				7 sign of y-component
    				8 y of y-component
    			*/
    			match[ 1 ] = match[ 1 ].toLowerCase();

    			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

    				// nth-* requires argument
    				if ( !match[ 3 ] ) {
    					Sizzle.error( match[ 0 ] );
    				}

    				// numeric x and y parameters for Expr.filter.CHILD
    				// remember that false/true cast respectively to 0/1
    				match[ 4 ] = +( match[ 4 ] ?
    					match[ 5 ] + ( match[ 6 ] || 1 ) :
    					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
    				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

    				// other types prohibit arguments
    			} else if ( match[ 3 ] ) {
    				Sizzle.error( match[ 0 ] );
    			}

    			return match;
    		},

    		"PSEUDO": function( match ) {
    			var excess,
    				unquoted = !match[ 6 ] && match[ 2 ];

    			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
    				return null;
    			}

    			// Accept quoted arguments as-is
    			if ( match[ 3 ] ) {
    				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

    			// Strip excess characters from unquoted arguments
    			} else if ( unquoted && rpseudo.test( unquoted ) &&

    				// Get excess from tokenize (recursively)
    				( excess = tokenize( unquoted, true ) ) &&

    				// advance to the next closing parenthesis
    				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

    				// excess is a negative index
    				match[ 0 ] = match[ 0 ].slice( 0, excess );
    				match[ 2 ] = unquoted.slice( 0, excess );
    			}

    			// Return only captures needed by the pseudo filter method (type and argument)
    			return match.slice( 0, 3 );
    		}
    	},

    	filter: {

    		"TAG": function( nodeNameSelector ) {
    			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
    			return nodeNameSelector === "*" ?
    				function() {
    					return true;
    				} :
    				function( elem ) {
    					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
    				};
    		},

    		"CLASS": function( className ) {
    			var pattern = classCache[ className + " " ];

    			return pattern ||
    				( pattern = new RegExp( "(^|" + whitespace +
    					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
    						className, function( elem ) {
    							return pattern.test(
    								typeof elem.className === "string" && elem.className ||
    								typeof elem.getAttribute !== "undefined" &&
    									elem.getAttribute( "class" ) ||
    								""
    							);
    				} );
    		},

    		"ATTR": function( name, operator, check ) {
    			return function( elem ) {
    				var result = Sizzle.attr( elem, name );

    				if ( result == null ) {
    					return operator === "!=";
    				}
    				if ( !operator ) {
    					return true;
    				}

    				result += "";

    				/* eslint-disable max-len */

    				return operator === "=" ? result === check :
    					operator === "!=" ? result !== check :
    					operator === "^=" ? check && result.indexOf( check ) === 0 :
    					operator === "*=" ? check && result.indexOf( check ) > -1 :
    					operator === "$=" ? check && result.slice( -check.length ) === check :
    					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
    					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
    					false;
    				/* eslint-enable max-len */

    			};
    		},

    		"CHILD": function( type, what, _argument, first, last ) {
    			var simple = type.slice( 0, 3 ) !== "nth",
    				forward = type.slice( -4 ) !== "last",
    				ofType = what === "of-type";

    			return first === 1 && last === 0 ?

    				// Shortcut for :nth-*(n)
    				function( elem ) {
    					return !!elem.parentNode;
    				} :

    				function( elem, _context, xml ) {
    					var cache, uniqueCache, outerCache, node, nodeIndex, start,
    						dir = simple !== forward ? "nextSibling" : "previousSibling",
    						parent = elem.parentNode,
    						name = ofType && elem.nodeName.toLowerCase(),
    						useCache = !xml && !ofType,
    						diff = false;

    					if ( parent ) {

    						// :(first|last|only)-(child|of-type)
    						if ( simple ) {
    							while ( dir ) {
    								node = elem;
    								while ( ( node = node[ dir ] ) ) {
    									if ( ofType ?
    										node.nodeName.toLowerCase() === name :
    										node.nodeType === 1 ) {

    										return false;
    									}
    								}

    								// Reverse direction for :only-* (if we haven't yet done so)
    								start = dir = type === "only" && !start && "nextSibling";
    							}
    							return true;
    						}

    						start = [ forward ? parent.firstChild : parent.lastChild ];

    						// non-xml :nth-child(...) stores cache data on `parent`
    						if ( forward && useCache ) {

    							// Seek `elem` from a previously-cached index

    							// ...in a gzip-friendly way
    							node = parent;
    							outerCache = node[ expando ] || ( node[ expando ] = {} );

    							// Support: IE <9 only
    							// Defend against cloned attroperties (jQuery gh-1709)
    							uniqueCache = outerCache[ node.uniqueID ] ||
    								( outerCache[ node.uniqueID ] = {} );

    							cache = uniqueCache[ type ] || [];
    							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    							diff = nodeIndex && cache[ 2 ];
    							node = nodeIndex && parent.childNodes[ nodeIndex ];

    							while ( ( node = ++nodeIndex && node && node[ dir ] ||

    								// Fallback to seeking `elem` from the start
    								( diff = nodeIndex = 0 ) || start.pop() ) ) {

    								// When found, cache indexes on `parent` and break
    								if ( node.nodeType === 1 && ++diff && node === elem ) {
    									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
    									break;
    								}
    							}

    						} else {

    							// Use previously-cached element index if available
    							if ( useCache ) {

    								// ...in a gzip-friendly way
    								node = elem;
    								outerCache = node[ expando ] || ( node[ expando ] = {} );

    								// Support: IE <9 only
    								// Defend against cloned attroperties (jQuery gh-1709)
    								uniqueCache = outerCache[ node.uniqueID ] ||
    									( outerCache[ node.uniqueID ] = {} );

    								cache = uniqueCache[ type ] || [];
    								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    								diff = nodeIndex;
    							}

    							// xml :nth-child(...)
    							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
    							if ( diff === false ) {

    								// Use the same loop as above to seek `elem` from the start
    								while ( ( node = ++nodeIndex && node && node[ dir ] ||
    									( diff = nodeIndex = 0 ) || start.pop() ) ) {

    									if ( ( ofType ?
    										node.nodeName.toLowerCase() === name :
    										node.nodeType === 1 ) &&
    										++diff ) {

    										// Cache the index of each encountered element
    										if ( useCache ) {
    											outerCache = node[ expando ] ||
    												( node[ expando ] = {} );

    											// Support: IE <9 only
    											// Defend against cloned attroperties (jQuery gh-1709)
    											uniqueCache = outerCache[ node.uniqueID ] ||
    												( outerCache[ node.uniqueID ] = {} );

    											uniqueCache[ type ] = [ dirruns, diff ];
    										}

    										if ( node === elem ) {
    											break;
    										}
    									}
    								}
    							}
    						}

    						// Incorporate the offset, then check against cycle size
    						diff -= last;
    						return diff === first || ( diff % first === 0 && diff / first >= 0 );
    					}
    				};
    		},

    		"PSEUDO": function( pseudo, argument ) {

    			// pseudo-class names are case-insensitive
    			// http://www.w3.org/TR/selectors/#pseudo-classes
    			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
    			// Remember that setFilters inherits from pseudos
    			var args,
    				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
    					Sizzle.error( "unsupported pseudo: " + pseudo );

    			// The user may use createPseudo to indicate that
    			// arguments are needed to create the filter function
    			// just as Sizzle does
    			if ( fn[ expando ] ) {
    				return fn( argument );
    			}

    			// But maintain support for old signatures
    			if ( fn.length > 1 ) {
    				args = [ pseudo, pseudo, "", argument ];
    				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
    					markFunction( function( seed, matches ) {
    						var idx,
    							matched = fn( seed, argument ),
    							i = matched.length;
    						while ( i-- ) {
    							idx = indexOf( seed, matched[ i ] );
    							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
    						}
    					} ) :
    					function( elem ) {
    						return fn( elem, 0, args );
    					};
    			}

    			return fn;
    		}
    	},

    	pseudos: {

    		// Potentially complex pseudos
    		"not": markFunction( function( selector ) {

    			// Trim the selector passed to compile
    			// to avoid treating leading and trailing
    			// spaces as combinators
    			var input = [],
    				results = [],
    				matcher = compile( selector.replace( rtrim, "$1" ) );

    			return matcher[ expando ] ?
    				markFunction( function( seed, matches, _context, xml ) {
    					var elem,
    						unmatched = matcher( seed, null, xml, [] ),
    						i = seed.length;

    					// Match elements unmatched by `matcher`
    					while ( i-- ) {
    						if ( ( elem = unmatched[ i ] ) ) {
    							seed[ i ] = !( matches[ i ] = elem );
    						}
    					}
    				} ) :
    				function( elem, _context, xml ) {
    					input[ 0 ] = elem;
    					matcher( input, null, xml, results );

    					// Don't keep the element (issue #299)
    					input[ 0 ] = null;
    					return !results.pop();
    				};
    		} ),

    		"has": markFunction( function( selector ) {
    			return function( elem ) {
    				return Sizzle( selector, elem ).length > 0;
    			};
    		} ),

    		"contains": markFunction( function( text ) {
    			text = text.replace( runescape, funescape );
    			return function( elem ) {
    				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
    			};
    		} ),

    		// "Whether an element is represented by a :lang() selector
    		// is based solely on the element's language value
    		// being equal to the identifier C,
    		// or beginning with the identifier C immediately followed by "-".
    		// The matching of C against the element's language value is performed case-insensitively.
    		// The identifier C does not have to be a valid language name."
    		// http://www.w3.org/TR/selectors/#lang-pseudo
    		"lang": markFunction( function( lang ) {

    			// lang value must be a valid identifier
    			if ( !ridentifier.test( lang || "" ) ) {
    				Sizzle.error( "unsupported lang: " + lang );
    			}
    			lang = lang.replace( runescape, funescape ).toLowerCase();
    			return function( elem ) {
    				var elemLang;
    				do {
    					if ( ( elemLang = documentIsHTML ?
    						elem.lang :
    						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

    						elemLang = elemLang.toLowerCase();
    						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
    					}
    				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
    				return false;
    			};
    		} ),

    		// Miscellaneous
    		"target": function( elem ) {
    			var hash = window.location && window.location.hash;
    			return hash && hash.slice( 1 ) === elem.id;
    		},

    		"root": function( elem ) {
    			return elem === docElem;
    		},

    		"focus": function( elem ) {
    			return elem === document.activeElement &&
    				( !document.hasFocus || document.hasFocus() ) &&
    				!!( elem.type || elem.href || ~elem.tabIndex );
    		},

    		// Boolean properties
    		"enabled": createDisabledPseudo( false ),
    		"disabled": createDisabledPseudo( true ),

    		"checked": function( elem ) {

    			// In CSS3, :checked should return both checked and selected elements
    			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    			var nodeName = elem.nodeName.toLowerCase();
    			return ( nodeName === "input" && !!elem.checked ) ||
    				( nodeName === "option" && !!elem.selected );
    		},

    		"selected": function( elem ) {

    			// Accessing this property makes selected-by-default
    			// options in Safari work properly
    			if ( elem.parentNode ) {
    				// eslint-disable-next-line no-unused-expressions
    				elem.parentNode.selectedIndex;
    			}

    			return elem.selected === true;
    		},

    		// Contents
    		"empty": function( elem ) {

    			// http://www.w3.org/TR/selectors/#empty-pseudo
    			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
    			//   but not by others (comment: 8; processing instruction: 7; etc.)
    			// nodeType < 6 works because attributes (2) do not appear as children
    			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    				if ( elem.nodeType < 6 ) {
    					return false;
    				}
    			}
    			return true;
    		},

    		"parent": function( elem ) {
    			return !Expr.pseudos[ "empty" ]( elem );
    		},

    		// Element/input types
    		"header": function( elem ) {
    			return rheader.test( elem.nodeName );
    		},

    		"input": function( elem ) {
    			return rinputs.test( elem.nodeName );
    		},

    		"button": function( elem ) {
    			var name = elem.nodeName.toLowerCase();
    			return name === "input" && elem.type === "button" || name === "button";
    		},

    		"text": function( elem ) {
    			var attr;
    			return elem.nodeName.toLowerCase() === "input" &&
    				elem.type === "text" &&

    				// Support: IE<8
    				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
    				( ( attr = elem.getAttribute( "type" ) ) == null ||
    					attr.toLowerCase() === "text" );
    		},

    		// Position-in-collection
    		"first": createPositionalPseudo( function() {
    			return [ 0 ];
    		} ),

    		"last": createPositionalPseudo( function( _matchIndexes, length ) {
    			return [ length - 1 ];
    		} ),

    		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
    			return [ argument < 0 ? argument + length : argument ];
    		} ),

    		"even": createPositionalPseudo( function( matchIndexes, length ) {
    			var i = 0;
    			for ( ; i < length; i += 2 ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"odd": createPositionalPseudo( function( matchIndexes, length ) {
    			var i = 1;
    			for ( ; i < length; i += 2 ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
    			var i = argument < 0 ?
    				argument + length :
    				argument > length ?
    					length :
    					argument;
    			for ( ; --i >= 0; ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
    			var i = argument < 0 ? argument + length : argument;
    			for ( ; ++i < length; ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} )
    	}
    };

    Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

    // Add button/input type pseudos
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    	Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
    	Expr.pseudos[ i ] = createButtonPseudo( i );
    }

    // Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
    	var matched, match, tokens, type,
    		soFar, groups, preFilters,
    		cached = tokenCache[ selector + " " ];

    	if ( cached ) {
    		return parseOnly ? 0 : cached.slice( 0 );
    	}

    	soFar = selector;
    	groups = [];
    	preFilters = Expr.preFilter;

    	while ( soFar ) {

    		// Comma and first run
    		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
    			if ( match ) {

    				// Don't consume trailing commas as valid
    				soFar = soFar.slice( match[ 0 ].length ) || soFar;
    			}
    			groups.push( ( tokens = [] ) );
    		}

    		matched = false;

    		// Combinators
    		if ( ( match = rcombinators.exec( soFar ) ) ) {
    			matched = match.shift();
    			tokens.push( {
    				value: matched,

    				// Cast descendant combinators to space
    				type: match[ 0 ].replace( rtrim, " " )
    			} );
    			soFar = soFar.slice( matched.length );
    		}

    		// Filters
    		for ( type in Expr.filter ) {
    			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
    				( match = preFilters[ type ]( match ) ) ) ) {
    				matched = match.shift();
    				tokens.push( {
    					value: matched,
    					type: type,
    					matches: match
    				} );
    				soFar = soFar.slice( matched.length );
    			}
    		}

    		if ( !matched ) {
    			break;
    		}
    	}

    	// Return the length of the invalid excess
    	// if we're just parsing
    	// Otherwise, throw an error or return tokens
    	return parseOnly ?
    		soFar.length :
    		soFar ?
    			Sizzle.error( selector ) :

    			// Cache the tokens
    			tokenCache( selector, groups ).slice( 0 );
    };

    function toSelector( tokens ) {
    	var i = 0,
    		len = tokens.length,
    		selector = "";
    	for ( ; i < len; i++ ) {
    		selector += tokens[ i ].value;
    	}
    	return selector;
    }

    function addCombinator( matcher, combinator, base ) {
    	var dir = combinator.dir,
    		skip = combinator.next,
    		key = skip || dir,
    		checkNonElements = base && key === "parentNode",
    		doneName = done++;

    	return combinator.first ?

    		// Check against closest ancestor/preceding element
    		function( elem, context, xml ) {
    			while ( ( elem = elem[ dir ] ) ) {
    				if ( elem.nodeType === 1 || checkNonElements ) {
    					return matcher( elem, context, xml );
    				}
    			}
    			return false;
    		} :

    		// Check against all ancestor/preceding elements
    		function( elem, context, xml ) {
    			var oldCache, uniqueCache, outerCache,
    				newCache = [ dirruns, doneName ];

    			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
    			if ( xml ) {
    				while ( ( elem = elem[ dir ] ) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						if ( matcher( elem, context, xml ) ) {
    							return true;
    						}
    					}
    				}
    			} else {
    				while ( ( elem = elem[ dir ] ) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

    						// Support: IE <9 only
    						// Defend against cloned attroperties (jQuery gh-1709)
    						uniqueCache = outerCache[ elem.uniqueID ] ||
    							( outerCache[ elem.uniqueID ] = {} );

    						if ( skip && skip === elem.nodeName.toLowerCase() ) {
    							elem = elem[ dir ] || elem;
    						} else if ( ( oldCache = uniqueCache[ key ] ) &&
    							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

    							// Assign to newCache so results back-propagate to previous elements
    							return ( newCache[ 2 ] = oldCache[ 2 ] );
    						} else {

    							// Reuse newcache so results back-propagate to previous elements
    							uniqueCache[ key ] = newCache;

    							// A match means we're done; a fail means we have to keep checking
    							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
    								return true;
    							}
    						}
    					}
    				}
    			}
    			return false;
    		};
    }

    function elementMatcher( matchers ) {
    	return matchers.length > 1 ?
    		function( elem, context, xml ) {
    			var i = matchers.length;
    			while ( i-- ) {
    				if ( !matchers[ i ]( elem, context, xml ) ) {
    					return false;
    				}
    			}
    			return true;
    		} :
    		matchers[ 0 ];
    }

    function multipleContexts( selector, contexts, results ) {
    	var i = 0,
    		len = contexts.length;
    	for ( ; i < len; i++ ) {
    		Sizzle( selector, contexts[ i ], results );
    	}
    	return results;
    }

    function condense( unmatched, map, filter, context, xml ) {
    	var elem,
    		newUnmatched = [],
    		i = 0,
    		len = unmatched.length,
    		mapped = map != null;

    	for ( ; i < len; i++ ) {
    		if ( ( elem = unmatched[ i ] ) ) {
    			if ( !filter || filter( elem, context, xml ) ) {
    				newUnmatched.push( elem );
    				if ( mapped ) {
    					map.push( i );
    				}
    			}
    		}
    	}

    	return newUnmatched;
    }

    function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    	if ( postFilter && !postFilter[ expando ] ) {
    		postFilter = setMatcher( postFilter );
    	}
    	if ( postFinder && !postFinder[ expando ] ) {
    		postFinder = setMatcher( postFinder, postSelector );
    	}
    	return markFunction( function( seed, results, context, xml ) {
    		var temp, i, elem,
    			preMap = [],
    			postMap = [],
    			preexisting = results.length,

    			// Get initial elements from seed or context
    			elems = seed || multipleContexts(
    				selector || "*",
    				context.nodeType ? [ context ] : context,
    				[]
    			),

    			// Prefilter to get matcher input, preserving a map for seed-results synchronization
    			matcherIn = preFilter && ( seed || !selector ) ?
    				condense( elems, preMap, preFilter, context, xml ) :
    				elems,

    			matcherOut = matcher ?

    				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
    				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

    					// ...intermediate processing is necessary
    					[] :

    					// ...otherwise use results directly
    					results :
    				matcherIn;

    		// Find primary matches
    		if ( matcher ) {
    			matcher( matcherIn, matcherOut, context, xml );
    		}

    		// Apply postFilter
    		if ( postFilter ) {
    			temp = condense( matcherOut, postMap );
    			postFilter( temp, [], context, xml );

    			// Un-match failing elements by moving them back to matcherIn
    			i = temp.length;
    			while ( i-- ) {
    				if ( ( elem = temp[ i ] ) ) {
    					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
    				}
    			}
    		}

    		if ( seed ) {
    			if ( postFinder || preFilter ) {
    				if ( postFinder ) {

    					// Get the final matcherOut by condensing this intermediate into postFinder contexts
    					temp = [];
    					i = matcherOut.length;
    					while ( i-- ) {
    						if ( ( elem = matcherOut[ i ] ) ) {

    							// Restore matcherIn since elem is not yet a final match
    							temp.push( ( matcherIn[ i ] = elem ) );
    						}
    					}
    					postFinder( null, ( matcherOut = [] ), temp, xml );
    				}

    				// Move matched elements from seed to results to keep them synchronized
    				i = matcherOut.length;
    				while ( i-- ) {
    					if ( ( elem = matcherOut[ i ] ) &&
    						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

    						seed[ temp ] = !( results[ temp ] = elem );
    					}
    				}
    			}

    		// Add elements to results, through postFinder if defined
    		} else {
    			matcherOut = condense(
    				matcherOut === results ?
    					matcherOut.splice( preexisting, matcherOut.length ) :
    					matcherOut
    			);
    			if ( postFinder ) {
    				postFinder( null, results, matcherOut, xml );
    			} else {
    				push.apply( results, matcherOut );
    			}
    		}
    	} );
    }

    function matcherFromTokens( tokens ) {
    	var checkContext, matcher, j,
    		len = tokens.length,
    		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
    		implicitRelative = leadingRelative || Expr.relative[ " " ],
    		i = leadingRelative ? 1 : 0,

    		// The foundational matcher ensures that elements are reachable from top-level context(s)
    		matchContext = addCombinator( function( elem ) {
    			return elem === checkContext;
    		}, implicitRelative, true ),
    		matchAnyContext = addCombinator( function( elem ) {
    			return indexOf( checkContext, elem ) > -1;
    		}, implicitRelative, true ),
    		matchers = [ function( elem, context, xml ) {
    			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
    				( checkContext = context ).nodeType ?
    					matchContext( elem, context, xml ) :
    					matchAnyContext( elem, context, xml ) );

    			// Avoid hanging onto element (issue #299)
    			checkContext = null;
    			return ret;
    		} ];

    	for ( ; i < len; i++ ) {
    		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
    			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
    		} else {
    			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

    			// Return special upon seeing a positional matcher
    			if ( matcher[ expando ] ) {

    				// Find the next relative operator (if any) for proper handling
    				j = ++i;
    				for ( ; j < len; j++ ) {
    					if ( Expr.relative[ tokens[ j ].type ] ) {
    						break;
    					}
    				}
    				return setMatcher(
    					i > 1 && elementMatcher( matchers ),
    					i > 1 && toSelector(

    					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
    					tokens
    						.slice( 0, i - 1 )
    						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
    					).replace( rtrim, "$1" ),
    					matcher,
    					i < j && matcherFromTokens( tokens.slice( i, j ) ),
    					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
    					j < len && toSelector( tokens )
    				);
    			}
    			matchers.push( matcher );
    		}
    	}

    	return elementMatcher( matchers );
    }

    function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    	var bySet = setMatchers.length > 0,
    		byElement = elementMatchers.length > 0,
    		superMatcher = function( seed, context, xml, results, outermost ) {
    			var elem, j, matcher,
    				matchedCount = 0,
    				i = "0",
    				unmatched = seed && [],
    				setMatched = [],
    				contextBackup = outermostContext,

    				// We must always have either seed elements or outermost context
    				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

    				// Use integer dirruns iff this is the outermost matcher
    				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
    				len = elems.length;

    			if ( outermost ) {

    				// Support: IE 11+, Edge 17 - 18+
    				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    				// two documents; shallow comparisons work.
    				// eslint-disable-next-line eqeqeq
    				outermostContext = context == document || context || outermost;
    			}

    			// Add elements passing elementMatchers directly to results
    			// Support: IE<9, Safari
    			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
    			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
    				if ( byElement && elem ) {
    					j = 0;

    					// Support: IE 11+, Edge 17 - 18+
    					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    					// two documents; shallow comparisons work.
    					// eslint-disable-next-line eqeqeq
    					if ( !context && elem.ownerDocument != document ) {
    						setDocument( elem );
    						xml = !documentIsHTML;
    					}
    					while ( ( matcher = elementMatchers[ j++ ] ) ) {
    						if ( matcher( elem, context || document, xml ) ) {
    							results.push( elem );
    							break;
    						}
    					}
    					if ( outermost ) {
    						dirruns = dirrunsUnique;
    					}
    				}

    				// Track unmatched elements for set filters
    				if ( bySet ) {

    					// They will have gone through all possible matchers
    					if ( ( elem = !matcher && elem ) ) {
    						matchedCount--;
    					}

    					// Lengthen the array for every element, matched or not
    					if ( seed ) {
    						unmatched.push( elem );
    					}
    				}
    			}

    			// `i` is now the count of elements visited above, and adding it to `matchedCount`
    			// makes the latter nonnegative.
    			matchedCount += i;

    			// Apply set filters to unmatched elements
    			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
    			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
    			// no element matchers and no seed.
    			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
    			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
    			// numerically zero.
    			if ( bySet && i !== matchedCount ) {
    				j = 0;
    				while ( ( matcher = setMatchers[ j++ ] ) ) {
    					matcher( unmatched, setMatched, context, xml );
    				}

    				if ( seed ) {

    					// Reintegrate element matches to eliminate the need for sorting
    					if ( matchedCount > 0 ) {
    						while ( i-- ) {
    							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
    								setMatched[ i ] = pop.call( results );
    							}
    						}
    					}

    					// Discard index placeholder values to get only actual matches
    					setMatched = condense( setMatched );
    				}

    				// Add matches to results
    				push.apply( results, setMatched );

    				// Seedless set matches succeeding multiple successful matchers stipulate sorting
    				if ( outermost && !seed && setMatched.length > 0 &&
    					( matchedCount + setMatchers.length ) > 1 ) {

    					Sizzle.uniqueSort( results );
    				}
    			}

    			// Override manipulation of globals by nested matchers
    			if ( outermost ) {
    				dirruns = dirrunsUnique;
    				outermostContext = contextBackup;
    			}

    			return unmatched;
    		};

    	return bySet ?
    		markFunction( superMatcher ) :
    		superMatcher;
    }

    compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
    	var i,
    		setMatchers = [],
    		elementMatchers = [],
    		cached = compilerCache[ selector + " " ];

    	if ( !cached ) {

    		// Generate a function of recursive functions that can be used to check each element
    		if ( !match ) {
    			match = tokenize( selector );
    		}
    		i = match.length;
    		while ( i-- ) {
    			cached = matcherFromTokens( match[ i ] );
    			if ( cached[ expando ] ) {
    				setMatchers.push( cached );
    			} else {
    				elementMatchers.push( cached );
    			}
    		}

    		// Cache the compiled function
    		cached = compilerCache(
    			selector,
    			matcherFromGroupMatchers( elementMatchers, setMatchers )
    		);

    		// Save selector and tokenization
    		cached.selector = selector;
    	}
    	return cached;
    };

    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */
    select = Sizzle.select = function( selector, context, results, seed ) {
    	var i, tokens, token, type, find,
    		compiled = typeof selector === "function" && selector,
    		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

    	results = results || [];

    	// Try to minimize operations if there is only one selector in the list and no seed
    	// (the latter of which guarantees us context)
    	if ( match.length === 1 ) {

    		// Reduce context if the leading compound selector is an ID
    		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
    		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
    			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

    			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
    				.replace( runescape, funescape ), context ) || [] )[ 0 ];
    			if ( !context ) {
    				return results;

    			// Precompiled matchers will still verify ancestry, so step up a level
    			} else if ( compiled ) {
    				context = context.parentNode;
    			}

    			selector = selector.slice( tokens.shift().value.length );
    		}

    		// Fetch a seed set for right-to-left matching
    		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
    		while ( i-- ) {
    			token = tokens[ i ];

    			// Abort if we hit a combinator
    			if ( Expr.relative[ ( type = token.type ) ] ) {
    				break;
    			}
    			if ( ( find = Expr.find[ type ] ) ) {

    				// Search, expanding context for leading sibling combinators
    				if ( ( seed = find(
    					token.matches[ 0 ].replace( runescape, funescape ),
    					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
    						context
    				) ) ) {

    					// If seed is empty or no tokens remain, we can return early
    					tokens.splice( i, 1 );
    					selector = seed.length && toSelector( tokens );
    					if ( !selector ) {
    						push.apply( results, seed );
    						return results;
    					}

    					break;
    				}
    			}
    		}
    	}

    	// Compile and execute a filtering function if one is not provided
    	// Provide `match` to avoid retokenization if we modified the selector above
    	( compiled || compile( selector, match ) )(
    		seed,
    		context,
    		!documentIsHTML,
    		results,
    		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
    	);
    	return results;
    };

    // One-time assignments

    // Sort stability
    support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

    // Support: Chrome 14-35+
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = !!hasDuplicate;

    // Initialize against the default document
    setDocument();

    // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*
    support.sortDetached = assert( function( el ) {

    	// Should return 1, but returns 4 (following)
    	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
    } );

    // Support: IE<8
    // Prevent attribute/property "interpolation"
    // https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !assert( function( el ) {
    	el.innerHTML = "<a href='#'></a>";
    	return el.firstChild.getAttribute( "href" ) === "#";
    } ) ) {
    	addHandle( "type|href|height|width", function( elem, name, isXML ) {
    		if ( !isXML ) {
    			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
    		}
    	} );
    }

    // Support: IE<9
    // Use defaultValue in place of getAttribute("value")
    if ( !support.attributes || !assert( function( el ) {
    	el.innerHTML = "<input/>";
    	el.firstChild.setAttribute( "value", "" );
    	return el.firstChild.getAttribute( "value" ) === "";
    } ) ) {
    	addHandle( "value", function( elem, _name, isXML ) {
    		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
    			return elem.defaultValue;
    		}
    	} );
    }

    // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies
    if ( !assert( function( el ) {
    	return el.getAttribute( "disabled" ) == null;
    } ) ) {
    	addHandle( booleans, function( elem, name, isXML ) {
    		var val;
    		if ( !isXML ) {
    			return elem[ name ] === true ? name.toLowerCase() :
    				( val = elem.getAttributeNode( name ) ) && val.specified ?
    					val.value :
    					null;
    		}
    	} );
    }

    return Sizzle;

    } )( window );



    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;

    // Deprecated
    jQuery.expr[ ":" ] = jQuery.expr.pseudos;
    jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    jQuery.escapeSelector = Sizzle.escape;




    var dir = function( elem, dir, until ) {
    	var matched = [],
    		truncate = until !== undefined;

    	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
    		if ( elem.nodeType === 1 ) {
    			if ( truncate && jQuery( elem ).is( until ) ) {
    				break;
    			}
    			matched.push( elem );
    		}
    	}
    	return matched;
    };


    var siblings = function( n, elem ) {
    	var matched = [];

    	for ( ; n; n = n.nextSibling ) {
    		if ( n.nodeType === 1 && n !== elem ) {
    			matched.push( n );
    		}
    	}

    	return matched;
    };


    var rneedsContext = jQuery.expr.match.needsContext;



    function nodeName( elem, name ) {

    	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

    }
    var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



    // Implement the identical functionality for filter and not
    function winnow( elements, qualifier, not ) {
    	if ( isFunction( qualifier ) ) {
    		return jQuery.grep( elements, function( elem, i ) {
    			return !!qualifier.call( elem, i, elem ) !== not;
    		} );
    	}

    	// Single element
    	if ( qualifier.nodeType ) {
    		return jQuery.grep( elements, function( elem ) {
    			return ( elem === qualifier ) !== not;
    		} );
    	}

    	// Arraylike of elements (jQuery, arguments, Array)
    	if ( typeof qualifier !== "string" ) {
    		return jQuery.grep( elements, function( elem ) {
    			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
    		} );
    	}

    	// Filtered directly for both simple and complex selectors
    	return jQuery.filter( qualifier, elements, not );
    }

    jQuery.filter = function( expr, elems, not ) {
    	var elem = elems[ 0 ];

    	if ( not ) {
    		expr = ":not(" + expr + ")";
    	}

    	if ( elems.length === 1 && elem.nodeType === 1 ) {
    		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
    	}

    	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
    		return elem.nodeType === 1;
    	} ) );
    };

    jQuery.fn.extend( {
    	find: function( selector ) {
    		var i, ret,
    			len = this.length,
    			self = this;

    		if ( typeof selector !== "string" ) {
    			return this.pushStack( jQuery( selector ).filter( function() {
    				for ( i = 0; i < len; i++ ) {
    					if ( jQuery.contains( self[ i ], this ) ) {
    						return true;
    					}
    				}
    			} ) );
    		}

    		ret = this.pushStack( [] );

    		for ( i = 0; i < len; i++ ) {
    			jQuery.find( selector, self[ i ], ret );
    		}

    		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
    	},
    	filter: function( selector ) {
    		return this.pushStack( winnow( this, selector || [], false ) );
    	},
    	not: function( selector ) {
    		return this.pushStack( winnow( this, selector || [], true ) );
    	},
    	is: function( selector ) {
    		return !!winnow(
    			this,

    			// If this is a positional/relative selector, check membership in the returned set
    			// so $("p:first").is("p:last") won't return true for a doc with two "p".
    			typeof selector === "string" && rneedsContext.test( selector ) ?
    				jQuery( selector ) :
    				selector || [],
    			false
    		).length;
    	}
    } );


    // Initialize a jQuery object


    // A central reference to the root jQuery(document)
    var rootjQuery,

    	// A simple way to check for HTML strings
    	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    	// Strict HTML recognition (#11290: must start with <)
    	// Shortcut simple #id case for speed
    	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

    	init = jQuery.fn.init = function( selector, context, root ) {
    		var match, elem;

    		// HANDLE: $(""), $(null), $(undefined), $(false)
    		if ( !selector ) {
    			return this;
    		}

    		// Method init() accepts an alternate rootjQuery
    		// so migrate can support jQuery.sub (gh-2101)
    		root = root || rootjQuery;

    		// Handle HTML strings
    		if ( typeof selector === "string" ) {
    			if ( selector[ 0 ] === "<" &&
    				selector[ selector.length - 1 ] === ">" &&
    				selector.length >= 3 ) {

    				// Assume that strings that start and end with <> are HTML and skip the regex check
    				match = [ null, selector, null ];

    			} else {
    				match = rquickExpr.exec( selector );
    			}

    			// Match html or make sure no context is specified for #id
    			if ( match && ( match[ 1 ] || !context ) ) {

    				// HANDLE: $(html) -> $(array)
    				if ( match[ 1 ] ) {
    					context = context instanceof jQuery ? context[ 0 ] : context;

    					// Option to run scripts is true for back-compat
    					// Intentionally let the error be thrown if parseHTML is not present
    					jQuery.merge( this, jQuery.parseHTML(
    						match[ 1 ],
    						context && context.nodeType ? context.ownerDocument || context : document,
    						true
    					) );

    					// HANDLE: $(html, props)
    					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
    						for ( match in context ) {

    							// Properties of context are called as methods if possible
    							if ( isFunction( this[ match ] ) ) {
    								this[ match ]( context[ match ] );

    							// ...and otherwise set as attributes
    							} else {
    								this.attr( match, context[ match ] );
    							}
    						}
    					}

    					return this;

    				// HANDLE: $(#id)
    				} else {
    					elem = document.getElementById( match[ 2 ] );

    					if ( elem ) {

    						// Inject the element directly into the jQuery object
    						this[ 0 ] = elem;
    						this.length = 1;
    					}
    					return this;
    				}

    			// HANDLE: $(expr, $(...))
    			} else if ( !context || context.jquery ) {
    				return ( context || root ).find( selector );

    			// HANDLE: $(expr, context)
    			// (which is just equivalent to: $(context).find(expr)
    			} else {
    				return this.constructor( context ).find( selector );
    			}

    		// HANDLE: $(DOMElement)
    		} else if ( selector.nodeType ) {
    			this[ 0 ] = selector;
    			this.length = 1;
    			return this;

    		// HANDLE: $(function)
    		// Shortcut for document ready
    		} else if ( isFunction( selector ) ) {
    			return root.ready !== undefined ?
    				root.ready( selector ) :

    				// Execute immediately if ready is not present
    				selector( jQuery );
    		}

    		return jQuery.makeArray( selector, this );
    	};

    // Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn;

    // Initialize central reference
    rootjQuery = jQuery( document );


    var rparentsprev = /^(?:parents|prev(?:Until|All))/,

    	// Methods guaranteed to produce a unique set when starting from a unique set
    	guaranteedUnique = {
    		children: true,
    		contents: true,
    		next: true,
    		prev: true
    	};

    jQuery.fn.extend( {
    	has: function( target ) {
    		var targets = jQuery( target, this ),
    			l = targets.length;

    		return this.filter( function() {
    			var i = 0;
    			for ( ; i < l; i++ ) {
    				if ( jQuery.contains( this, targets[ i ] ) ) {
    					return true;
    				}
    			}
    		} );
    	},

    	closest: function( selectors, context ) {
    		var cur,
    			i = 0,
    			l = this.length,
    			matched = [],
    			targets = typeof selectors !== "string" && jQuery( selectors );

    		// Positional selectors never match, since there's no _selection_ context
    		if ( !rneedsContext.test( selectors ) ) {
    			for ( ; i < l; i++ ) {
    				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

    					// Always skip document fragments
    					if ( cur.nodeType < 11 && ( targets ?
    						targets.index( cur ) > -1 :

    						// Don't pass non-elements to Sizzle
    						cur.nodeType === 1 &&
    							jQuery.find.matchesSelector( cur, selectors ) ) ) {

    						matched.push( cur );
    						break;
    					}
    				}
    			}
    		}

    		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
    	},

    	// Determine the position of an element within the set
    	index: function( elem ) {

    		// No argument, return index in parent
    		if ( !elem ) {
    			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
    		}

    		// Index in selector
    		if ( typeof elem === "string" ) {
    			return indexOf.call( jQuery( elem ), this[ 0 ] );
    		}

    		// Locate the position of the desired element
    		return indexOf.call( this,

    			// If it receives a jQuery object, the first element is used
    			elem.jquery ? elem[ 0 ] : elem
    		);
    	},

    	add: function( selector, context ) {
    		return this.pushStack(
    			jQuery.uniqueSort(
    				jQuery.merge( this.get(), jQuery( selector, context ) )
    			)
    		);
    	},

    	addBack: function( selector ) {
    		return this.add( selector == null ?
    			this.prevObject : this.prevObject.filter( selector )
    		);
    	}
    } );

    function sibling( cur, dir ) {
    	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
    	return cur;
    }

    jQuery.each( {
    	parent: function( elem ) {
    		var parent = elem.parentNode;
    		return parent && parent.nodeType !== 11 ? parent : null;
    	},
    	parents: function( elem ) {
    		return dir( elem, "parentNode" );
    	},
    	parentsUntil: function( elem, _i, until ) {
    		return dir( elem, "parentNode", until );
    	},
    	next: function( elem ) {
    		return sibling( elem, "nextSibling" );
    	},
    	prev: function( elem ) {
    		return sibling( elem, "previousSibling" );
    	},
    	nextAll: function( elem ) {
    		return dir( elem, "nextSibling" );
    	},
    	prevAll: function( elem ) {
    		return dir( elem, "previousSibling" );
    	},
    	nextUntil: function( elem, _i, until ) {
    		return dir( elem, "nextSibling", until );
    	},
    	prevUntil: function( elem, _i, until ) {
    		return dir( elem, "previousSibling", until );
    	},
    	siblings: function( elem ) {
    		return siblings( ( elem.parentNode || {} ).firstChild, elem );
    	},
    	children: function( elem ) {
    		return siblings( elem.firstChild );
    	},
    	contents: function( elem ) {
    		if ( elem.contentDocument != null &&

    			// Support: IE 11+
    			// <object> elements with no `data` attribute has an object
    			// `contentDocument` with a `null` prototype.
    			getProto( elem.contentDocument ) ) {

    			return elem.contentDocument;
    		}

    		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
    		// Treat the template element as a regular one in browsers that
    		// don't support it.
    		if ( nodeName( elem, "template" ) ) {
    			elem = elem.content || elem;
    		}

    		return jQuery.merge( [], elem.childNodes );
    	}
    }, function( name, fn ) {
    	jQuery.fn[ name ] = function( until, selector ) {
    		var matched = jQuery.map( this, fn, until );

    		if ( name.slice( -5 ) !== "Until" ) {
    			selector = until;
    		}

    		if ( selector && typeof selector === "string" ) {
    			matched = jQuery.filter( selector, matched );
    		}

    		if ( this.length > 1 ) {

    			// Remove duplicates
    			if ( !guaranteedUnique[ name ] ) {
    				jQuery.uniqueSort( matched );
    			}

    			// Reverse order for parents* and prev-derivatives
    			if ( rparentsprev.test( name ) ) {
    				matched.reverse();
    			}
    		}

    		return this.pushStack( matched );
    	};
    } );
    var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



    // Convert String-formatted options into Object-formatted ones
    function createOptions( options ) {
    	var object = {};
    	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
    		object[ flag ] = true;
    	} );
    	return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function( options ) {

    	// Convert options from String-formatted to Object-formatted if needed
    	// (we check in cache first)
    	options = typeof options === "string" ?
    		createOptions( options ) :
    		jQuery.extend( {}, options );

    	var // Flag to know if list is currently firing
    		firing,

    		// Last fire value for non-forgettable lists
    		memory,

    		// Flag to know if list was already fired
    		fired,

    		// Flag to prevent firing
    		locked,

    		// Actual callback list
    		list = [],

    		// Queue of execution data for repeatable lists
    		queue = [],

    		// Index of currently firing callback (modified by add/remove as needed)
    		firingIndex = -1,

    		// Fire callbacks
    		fire = function() {

    			// Enforce single-firing
    			locked = locked || options.once;

    			// Execute callbacks for all pending executions,
    			// respecting firingIndex overrides and runtime changes
    			fired = firing = true;
    			for ( ; queue.length; firingIndex = -1 ) {
    				memory = queue.shift();
    				while ( ++firingIndex < list.length ) {

    					// Run callback and check for early termination
    					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
    						options.stopOnFalse ) {

    						// Jump to end and forget the data so .add doesn't re-fire
    						firingIndex = list.length;
    						memory = false;
    					}
    				}
    			}

    			// Forget the data if we're done with it
    			if ( !options.memory ) {
    				memory = false;
    			}

    			firing = false;

    			// Clean up if we're done firing for good
    			if ( locked ) {

    				// Keep an empty list if we have data for future add calls
    				if ( memory ) {
    					list = [];

    				// Otherwise, this object is spent
    				} else {
    					list = "";
    				}
    			}
    		},

    		// Actual Callbacks object
    		self = {

    			// Add a callback or a collection of callbacks to the list
    			add: function() {
    				if ( list ) {

    					// If we have memory from a past run, we should fire after adding
    					if ( memory && !firing ) {
    						firingIndex = list.length - 1;
    						queue.push( memory );
    					}

    					( function add( args ) {
    						jQuery.each( args, function( _, arg ) {
    							if ( isFunction( arg ) ) {
    								if ( !options.unique || !self.has( arg ) ) {
    									list.push( arg );
    								}
    							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

    								// Inspect recursively
    								add( arg );
    							}
    						} );
    					} )( arguments );

    					if ( memory && !firing ) {
    						fire();
    					}
    				}
    				return this;
    			},

    			// Remove a callback from the list
    			remove: function() {
    				jQuery.each( arguments, function( _, arg ) {
    					var index;
    					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
    						list.splice( index, 1 );

    						// Handle firing indexes
    						if ( index <= firingIndex ) {
    							firingIndex--;
    						}
    					}
    				} );
    				return this;
    			},

    			// Check if a given callback is in the list.
    			// If no argument is given, return whether or not list has callbacks attached.
    			has: function( fn ) {
    				return fn ?
    					jQuery.inArray( fn, list ) > -1 :
    					list.length > 0;
    			},

    			// Remove all callbacks from the list
    			empty: function() {
    				if ( list ) {
    					list = [];
    				}
    				return this;
    			},

    			// Disable .fire and .add
    			// Abort any current/pending executions
    			// Clear all callbacks and values
    			disable: function() {
    				locked = queue = [];
    				list = memory = "";
    				return this;
    			},
    			disabled: function() {
    				return !list;
    			},

    			// Disable .fire
    			// Also disable .add unless we have memory (since it would have no effect)
    			// Abort any pending executions
    			lock: function() {
    				locked = queue = [];
    				if ( !memory && !firing ) {
    					list = memory = "";
    				}
    				return this;
    			},
    			locked: function() {
    				return !!locked;
    			},

    			// Call all callbacks with the given context and arguments
    			fireWith: function( context, args ) {
    				if ( !locked ) {
    					args = args || [];
    					args = [ context, args.slice ? args.slice() : args ];
    					queue.push( args );
    					if ( !firing ) {
    						fire();
    					}
    				}
    				return this;
    			},

    			// Call all the callbacks with the given arguments
    			fire: function() {
    				self.fireWith( this, arguments );
    				return this;
    			},

    			// To know if the callbacks have already been called at least once
    			fired: function() {
    				return !!fired;
    			}
    		};

    	return self;
    };


    function Identity( v ) {
    	return v;
    }
    function Thrower( ex ) {
    	throw ex;
    }

    function adoptValue( value, resolve, reject, noValue ) {
    	var method;

    	try {

    		// Check for promise aspect first to privilege synchronous behavior
    		if ( value && isFunction( ( method = value.promise ) ) ) {
    			method.call( value ).done( resolve ).fail( reject );

    		// Other thenables
    		} else if ( value && isFunction( ( method = value.then ) ) ) {
    			method.call( value, resolve, reject );

    		// Other non-thenables
    		} else {

    			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
    			// * false: [ value ].slice( 0 ) => resolve( value )
    			// * true: [ value ].slice( 1 ) => resolve()
    			resolve.apply( undefined, [ value ].slice( noValue ) );
    		}

    	// For Promises/A+, convert exceptions into rejections
    	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
    	// Deferred#then to conditionally suppress rejection.
    	} catch ( value ) {

    		// Support: Android 4.0 only
    		// Strict mode functions invoked without .call/.apply get global-object context
    		reject.apply( undefined, [ value ] );
    	}
    }

    jQuery.extend( {

    	Deferred: function( func ) {
    		var tuples = [

    				// action, add listener, callbacks,
    				// ... .then handlers, argument index, [final state]
    				[ "notify", "progress", jQuery.Callbacks( "memory" ),
    					jQuery.Callbacks( "memory" ), 2 ],
    				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
    					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
    				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
    					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
    			],
    			state = "pending",
    			promise = {
    				state: function() {
    					return state;
    				},
    				always: function() {
    					deferred.done( arguments ).fail( arguments );
    					return this;
    				},
    				"catch": function( fn ) {
    					return promise.then( null, fn );
    				},

    				// Keep pipe for back-compat
    				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
    					var fns = arguments;

    					return jQuery.Deferred( function( newDefer ) {
    						jQuery.each( tuples, function( _i, tuple ) {

    							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
    							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

    							// deferred.progress(function() { bind to newDefer or newDefer.notify })
    							// deferred.done(function() { bind to newDefer or newDefer.resolve })
    							// deferred.fail(function() { bind to newDefer or newDefer.reject })
    							deferred[ tuple[ 1 ] ]( function() {
    								var returned = fn && fn.apply( this, arguments );
    								if ( returned && isFunction( returned.promise ) ) {
    									returned.promise()
    										.progress( newDefer.notify )
    										.done( newDefer.resolve )
    										.fail( newDefer.reject );
    								} else {
    									newDefer[ tuple[ 0 ] + "With" ](
    										this,
    										fn ? [ returned ] : arguments
    									);
    								}
    							} );
    						} );
    						fns = null;
    					} ).promise();
    				},
    				then: function( onFulfilled, onRejected, onProgress ) {
    					var maxDepth = 0;
    					function resolve( depth, deferred, handler, special ) {
    						return function() {
    							var that = this,
    								args = arguments,
    								mightThrow = function() {
    									var returned, then;

    									// Support: Promises/A+ section 2.3.3.3.3
    									// https://promisesaplus.com/#point-59
    									// Ignore double-resolution attempts
    									if ( depth < maxDepth ) {
    										return;
    									}

    									returned = handler.apply( that, args );

    									// Support: Promises/A+ section 2.3.1
    									// https://promisesaplus.com/#point-48
    									if ( returned === deferred.promise() ) {
    										throw new TypeError( "Thenable self-resolution" );
    									}

    									// Support: Promises/A+ sections 2.3.3.1, 3.5
    									// https://promisesaplus.com/#point-54
    									// https://promisesaplus.com/#point-75
    									// Retrieve `then` only once
    									then = returned &&

    										// Support: Promises/A+ section 2.3.4
    										// https://promisesaplus.com/#point-64
    										// Only check objects and functions for thenability
    										( typeof returned === "object" ||
    											typeof returned === "function" ) &&
    										returned.then;

    									// Handle a returned thenable
    									if ( isFunction( then ) ) {

    										// Special processors (notify) just wait for resolution
    										if ( special ) {
    											then.call(
    												returned,
    												resolve( maxDepth, deferred, Identity, special ),
    												resolve( maxDepth, deferred, Thrower, special )
    											);

    										// Normal processors (resolve) also hook into progress
    										} else {

    											// ...and disregard older resolution values
    											maxDepth++;

    											then.call(
    												returned,
    												resolve( maxDepth, deferred, Identity, special ),
    												resolve( maxDepth, deferred, Thrower, special ),
    												resolve( maxDepth, deferred, Identity,
    													deferred.notifyWith )
    											);
    										}

    									// Handle all other returned values
    									} else {

    										// Only substitute handlers pass on context
    										// and multiple values (non-spec behavior)
    										if ( handler !== Identity ) {
    											that = undefined;
    											args = [ returned ];
    										}

    										// Process the value(s)
    										// Default process is resolve
    										( special || deferred.resolveWith )( that, args );
    									}
    								},

    								// Only normal processors (resolve) catch and reject exceptions
    								process = special ?
    									mightThrow :
    									function() {
    										try {
    											mightThrow();
    										} catch ( e ) {

    											if ( jQuery.Deferred.exceptionHook ) {
    												jQuery.Deferred.exceptionHook( e,
    													process.stackTrace );
    											}

    											// Support: Promises/A+ section 2.3.3.3.4.1
    											// https://promisesaplus.com/#point-61
    											// Ignore post-resolution exceptions
    											if ( depth + 1 >= maxDepth ) {

    												// Only substitute handlers pass on context
    												// and multiple values (non-spec behavior)
    												if ( handler !== Thrower ) {
    													that = undefined;
    													args = [ e ];
    												}

    												deferred.rejectWith( that, args );
    											}
    										}
    									};

    							// Support: Promises/A+ section 2.3.3.3.1
    							// https://promisesaplus.com/#point-57
    							// Re-resolve promises immediately to dodge false rejection from
    							// subsequent errors
    							if ( depth ) {
    								process();
    							} else {

    								// Call an optional hook to record the stack, in case of exception
    								// since it's otherwise lost when execution goes async
    								if ( jQuery.Deferred.getStackHook ) {
    									process.stackTrace = jQuery.Deferred.getStackHook();
    								}
    								window.setTimeout( process );
    							}
    						};
    					}

    					return jQuery.Deferred( function( newDefer ) {

    						// progress_handlers.add( ... )
    						tuples[ 0 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onProgress ) ?
    									onProgress :
    									Identity,
    								newDefer.notifyWith
    							)
    						);

    						// fulfilled_handlers.add( ... )
    						tuples[ 1 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onFulfilled ) ?
    									onFulfilled :
    									Identity
    							)
    						);

    						// rejected_handlers.add( ... )
    						tuples[ 2 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onRejected ) ?
    									onRejected :
    									Thrower
    							)
    						);
    					} ).promise();
    				},

    				// Get a promise for this deferred
    				// If obj is provided, the promise aspect is added to the object
    				promise: function( obj ) {
    					return obj != null ? jQuery.extend( obj, promise ) : promise;
    				}
    			},
    			deferred = {};

    		// Add list-specific methods
    		jQuery.each( tuples, function( i, tuple ) {
    			var list = tuple[ 2 ],
    				stateString = tuple[ 5 ];

    			// promise.progress = list.add
    			// promise.done = list.add
    			// promise.fail = list.add
    			promise[ tuple[ 1 ] ] = list.add;

    			// Handle state
    			if ( stateString ) {
    				list.add(
    					function() {

    						// state = "resolved" (i.e., fulfilled)
    						// state = "rejected"
    						state = stateString;
    					},

    					// rejected_callbacks.disable
    					// fulfilled_callbacks.disable
    					tuples[ 3 - i ][ 2 ].disable,

    					// rejected_handlers.disable
    					// fulfilled_handlers.disable
    					tuples[ 3 - i ][ 3 ].disable,

    					// progress_callbacks.lock
    					tuples[ 0 ][ 2 ].lock,

    					// progress_handlers.lock
    					tuples[ 0 ][ 3 ].lock
    				);
    			}

    			// progress_handlers.fire
    			// fulfilled_handlers.fire
    			// rejected_handlers.fire
    			list.add( tuple[ 3 ].fire );

    			// deferred.notify = function() { deferred.notifyWith(...) }
    			// deferred.resolve = function() { deferred.resolveWith(...) }
    			// deferred.reject = function() { deferred.rejectWith(...) }
    			deferred[ tuple[ 0 ] ] = function() {
    				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
    				return this;
    			};

    			// deferred.notifyWith = list.fireWith
    			// deferred.resolveWith = list.fireWith
    			// deferred.rejectWith = list.fireWith
    			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
    		} );

    		// Make the deferred a promise
    		promise.promise( deferred );

    		// Call given func if any
    		if ( func ) {
    			func.call( deferred, deferred );
    		}

    		// All done!
    		return deferred;
    	},

    	// Deferred helper
    	when: function( singleValue ) {
    		var

    			// count of uncompleted subordinates
    			remaining = arguments.length,

    			// count of unprocessed arguments
    			i = remaining,

    			// subordinate fulfillment data
    			resolveContexts = Array( i ),
    			resolveValues = slice.call( arguments ),

    			// the primary Deferred
    			primary = jQuery.Deferred(),

    			// subordinate callback factory
    			updateFunc = function( i ) {
    				return function( value ) {
    					resolveContexts[ i ] = this;
    					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
    					if ( !( --remaining ) ) {
    						primary.resolveWith( resolveContexts, resolveValues );
    					}
    				};
    			};

    		// Single- and empty arguments are adopted like Promise.resolve
    		if ( remaining <= 1 ) {
    			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
    				!remaining );

    			// Use .then() to unwrap secondary thenables (cf. gh-3000)
    			if ( primary.state() === "pending" ||
    				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

    				return primary.then();
    			}
    		}

    		// Multiple arguments are aggregated like Promise.all array elements
    		while ( i-- ) {
    			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
    		}

    		return primary.promise();
    	}
    } );


    // These usually indicate a programmer mistake during development,
    // warn about them ASAP rather than swallowing them by default.
    var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

    jQuery.Deferred.exceptionHook = function( error, stack ) {

    	// Support: IE 8 - 9 only
    	// Console exists when dev tools are open, which can happen at any time
    	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
    		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
    	}
    };




    jQuery.readyException = function( error ) {
    	window.setTimeout( function() {
    		throw error;
    	} );
    };




    // The deferred used on DOM ready
    var readyList = jQuery.Deferred();

    jQuery.fn.ready = function( fn ) {

    	readyList
    		.then( fn )

    		// Wrap jQuery.readyException in a function so that the lookup
    		// happens at the time of error handling instead of callback
    		// registration.
    		.catch( function( error ) {
    			jQuery.readyException( error );
    		} );

    	return this;
    };

    jQuery.extend( {

    	// Is the DOM ready to be used? Set to true once it occurs.
    	isReady: false,

    	// A counter to track how many items to wait for before
    	// the ready event fires. See #6781
    	readyWait: 1,

    	// Handle when the DOM is ready
    	ready: function( wait ) {

    		// Abort if there are pending holds or we're already ready
    		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
    			return;
    		}

    		// Remember that the DOM is ready
    		jQuery.isReady = true;

    		// If a normal DOM Ready event fired, decrement, and wait if need be
    		if ( wait !== true && --jQuery.readyWait > 0 ) {
    			return;
    		}

    		// If there are functions bound, to execute
    		readyList.resolveWith( document, [ jQuery ] );
    	}
    } );

    jQuery.ready.then = readyList.then;

    // The ready event handler and self cleanup method
    function completed() {
    	document.removeEventListener( "DOMContentLoaded", completed );
    	window.removeEventListener( "load", completed );
    	jQuery.ready();
    }

    // Catch cases where $(document).ready() is called
    // after the browser event has already occurred.
    // Support: IE <=9 - 10 only
    // Older IE sometimes signals "interactive" too soon
    if ( document.readyState === "complete" ||
    	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

    	// Handle it asynchronously to allow scripts the opportunity to delay ready
    	window.setTimeout( jQuery.ready );

    } else {

    	// Use the handy event callback
    	document.addEventListener( "DOMContentLoaded", completed );

    	// A fallback to window.onload, that will always work
    	window.addEventListener( "load", completed );
    }




    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
    	var i = 0,
    		len = elems.length,
    		bulk = key == null;

    	// Sets many values
    	if ( toType( key ) === "object" ) {
    		chainable = true;
    		for ( i in key ) {
    			access( elems, fn, i, key[ i ], true, emptyGet, raw );
    		}

    	// Sets one value
    	} else if ( value !== undefined ) {
    		chainable = true;

    		if ( !isFunction( value ) ) {
    			raw = true;
    		}

    		if ( bulk ) {

    			// Bulk operations run against the entire set
    			if ( raw ) {
    				fn.call( elems, value );
    				fn = null;

    			// ...except when executing function values
    			} else {
    				bulk = fn;
    				fn = function( elem, _key, value ) {
    					return bulk.call( jQuery( elem ), value );
    				};
    			}
    		}

    		if ( fn ) {
    			for ( ; i < len; i++ ) {
    				fn(
    					elems[ i ], key, raw ?
    						value :
    						value.call( elems[ i ], i, fn( elems[ i ], key ) )
    				);
    			}
    		}
    	}

    	if ( chainable ) {
    		return elems;
    	}

    	// Gets
    	if ( bulk ) {
    		return fn.call( elems );
    	}

    	return len ? fn( elems[ 0 ], key ) : emptyGet;
    };


    // Matches dashed string for camelizing
    var rmsPrefix = /^-ms-/,
    	rdashAlpha = /-([a-z])/g;

    // Used by camelCase as callback to replace()
    function fcamelCase( _all, letter ) {
    	return letter.toUpperCase();
    }

    // Convert dashed to camelCase; used by the css and data modules
    // Support: IE <=9 - 11, Edge 12 - 15
    // Microsoft forgot to hump their vendor prefix (#9572)
    function camelCase( string ) {
    	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    }
    var acceptData = function( owner ) {

    	// Accepts only:
    	//  - Node
    	//    - Node.ELEMENT_NODE
    	//    - Node.DOCUMENT_NODE
    	//  - Object
    	//    - Any
    	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
    };




    function Data() {
    	this.expando = jQuery.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.prototype = {

    	cache: function( owner ) {

    		// Check if the owner object already has a cache
    		var value = owner[ this.expando ];

    		// If not, create one
    		if ( !value ) {
    			value = {};

    			// We can accept data for non-element nodes in modern browsers,
    			// but we should not, see #8335.
    			// Always return an empty object.
    			if ( acceptData( owner ) ) {

    				// If it is a node unlikely to be stringify-ed or looped over
    				// use plain assignment
    				if ( owner.nodeType ) {
    					owner[ this.expando ] = value;

    				// Otherwise secure it in a non-enumerable property
    				// configurable must be true to allow the property to be
    				// deleted when data is removed
    				} else {
    					Object.defineProperty( owner, this.expando, {
    						value: value,
    						configurable: true
    					} );
    				}
    			}
    		}

    		return value;
    	},
    	set: function( owner, data, value ) {
    		var prop,
    			cache = this.cache( owner );

    		// Handle: [ owner, key, value ] args
    		// Always use camelCase key (gh-2257)
    		if ( typeof data === "string" ) {
    			cache[ camelCase( data ) ] = value;

    		// Handle: [ owner, { properties } ] args
    		} else {

    			// Copy the properties one-by-one to the cache object
    			for ( prop in data ) {
    				cache[ camelCase( prop ) ] = data[ prop ];
    			}
    		}
    		return cache;
    	},
    	get: function( owner, key ) {
    		return key === undefined ?
    			this.cache( owner ) :

    			// Always use camelCase key (gh-2257)
    			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
    	},
    	access: function( owner, key, value ) {

    		// In cases where either:
    		//
    		//   1. No key was specified
    		//   2. A string key was specified, but no value provided
    		//
    		// Take the "read" path and allow the get method to determine
    		// which value to return, respectively either:
    		//
    		//   1. The entire cache object
    		//   2. The data stored at the key
    		//
    		if ( key === undefined ||
    				( ( key && typeof key === "string" ) && value === undefined ) ) {

    			return this.get( owner, key );
    		}

    		// When the key is not a string, or both a key and value
    		// are specified, set or extend (existing objects) with either:
    		//
    		//   1. An object of properties
    		//   2. A key and value
    		//
    		this.set( owner, key, value );

    		// Since the "set" path can have two possible entry points
    		// return the expected data based on which path was taken[*]
    		return value !== undefined ? value : key;
    	},
    	remove: function( owner, key ) {
    		var i,
    			cache = owner[ this.expando ];

    		if ( cache === undefined ) {
    			return;
    		}

    		if ( key !== undefined ) {

    			// Support array or space separated string of keys
    			if ( Array.isArray( key ) ) {

    				// If key is an array of keys...
    				// We always set camelCase keys, so remove that.
    				key = key.map( camelCase );
    			} else {
    				key = camelCase( key );

    				// If a key with the spaces exists, use it.
    				// Otherwise, create an array by matching non-whitespace
    				key = key in cache ?
    					[ key ] :
    					( key.match( rnothtmlwhite ) || [] );
    			}

    			i = key.length;

    			while ( i-- ) {
    				delete cache[ key[ i ] ];
    			}
    		}

    		// Remove the expando if there's no more data
    		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

    			// Support: Chrome <=35 - 45
    			// Webkit & Blink performance suffers when deleting properties
    			// from DOM nodes, so set to undefined instead
    			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
    			if ( owner.nodeType ) {
    				owner[ this.expando ] = undefined;
    			} else {
    				delete owner[ this.expando ];
    			}
    		}
    	},
    	hasData: function( owner ) {
    		var cache = owner[ this.expando ];
    		return cache !== undefined && !jQuery.isEmptyObject( cache );
    	}
    };
    var dataPriv = new Data();

    var dataUser = new Data();



    //	Implementation Summary
    //
    //	1. Enforce API surface and semantic compatibility with 1.9.x branch
    //	2. Improve the module's maintainability by reducing the storage
    //		paths to a single mechanism.
    //	3. Use the same single mechanism to support "private" and "user" data.
    //	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
    //	5. Avoid exposing implementation details on user objects (eg. expando properties)
    //	6. Provide a clear path for implementation upgrade to WeakMap in 2014

    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    	rmultiDash = /[A-Z]/g;

    function getData( data ) {
    	if ( data === "true" ) {
    		return true;
    	}

    	if ( data === "false" ) {
    		return false;
    	}

    	if ( data === "null" ) {
    		return null;
    	}

    	// Only convert to a number if it doesn't change the string
    	if ( data === +data + "" ) {
    		return +data;
    	}

    	if ( rbrace.test( data ) ) {
    		return JSON.parse( data );
    	}

    	return data;
    }

    function dataAttr( elem, key, data ) {
    	var name;

    	// If nothing was found internally, try to fetch any
    	// data from the HTML5 data-* attribute
    	if ( data === undefined && elem.nodeType === 1 ) {
    		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
    		data = elem.getAttribute( name );

    		if ( typeof data === "string" ) {
    			try {
    				data = getData( data );
    			} catch ( e ) {}

    			// Make sure we set the data so it isn't changed later
    			dataUser.set( elem, key, data );
    		} else {
    			data = undefined;
    		}
    	}
    	return data;
    }

    jQuery.extend( {
    	hasData: function( elem ) {
    		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
    	},

    	data: function( elem, name, data ) {
    		return dataUser.access( elem, name, data );
    	},

    	removeData: function( elem, name ) {
    		dataUser.remove( elem, name );
    	},

    	// TODO: Now that all calls to _data and _removeData have been replaced
    	// with direct calls to dataPriv methods, these can be deprecated.
    	_data: function( elem, name, data ) {
    		return dataPriv.access( elem, name, data );
    	},

    	_removeData: function( elem, name ) {
    		dataPriv.remove( elem, name );
    	}
    } );

    jQuery.fn.extend( {
    	data: function( key, value ) {
    		var i, name, data,
    			elem = this[ 0 ],
    			attrs = elem && elem.attributes;

    		// Gets all values
    		if ( key === undefined ) {
    			if ( this.length ) {
    				data = dataUser.get( elem );

    				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
    					i = attrs.length;
    					while ( i-- ) {

    						// Support: IE 11 only
    						// The attrs elements can be null (#14894)
    						if ( attrs[ i ] ) {
    							name = attrs[ i ].name;
    							if ( name.indexOf( "data-" ) === 0 ) {
    								name = camelCase( name.slice( 5 ) );
    								dataAttr( elem, name, data[ name ] );
    							}
    						}
    					}
    					dataPriv.set( elem, "hasDataAttrs", true );
    				}
    			}

    			return data;
    		}

    		// Sets multiple values
    		if ( typeof key === "object" ) {
    			return this.each( function() {
    				dataUser.set( this, key );
    			} );
    		}

    		return access( this, function( value ) {
    			var data;

    			// The calling jQuery object (element matches) is not empty
    			// (and therefore has an element appears at this[ 0 ]) and the
    			// `value` parameter was not undefined. An empty jQuery object
    			// will result in `undefined` for elem = this[ 0 ] which will
    			// throw an exception if an attempt to read a data cache is made.
    			if ( elem && value === undefined ) {

    				// Attempt to get data from the cache
    				// The key will always be camelCased in Data
    				data = dataUser.get( elem, key );
    				if ( data !== undefined ) {
    					return data;
    				}

    				// Attempt to "discover" the data in
    				// HTML5 custom data-* attrs
    				data = dataAttr( elem, key );
    				if ( data !== undefined ) {
    					return data;
    				}

    				// We tried really hard, but the data doesn't exist.
    				return;
    			}

    			// Set the data...
    			this.each( function() {

    				// We always store the camelCased key
    				dataUser.set( this, key, value );
    			} );
    		}, null, value, arguments.length > 1, null, true );
    	},

    	removeData: function( key ) {
    		return this.each( function() {
    			dataUser.remove( this, key );
    		} );
    	}
    } );


    jQuery.extend( {
    	queue: function( elem, type, data ) {
    		var queue;

    		if ( elem ) {
    			type = ( type || "fx" ) + "queue";
    			queue = dataPriv.get( elem, type );

    			// Speed up dequeue by getting out quickly if this is just a lookup
    			if ( data ) {
    				if ( !queue || Array.isArray( data ) ) {
    					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
    				} else {
    					queue.push( data );
    				}
    			}
    			return queue || [];
    		}
    	},

    	dequeue: function( elem, type ) {
    		type = type || "fx";

    		var queue = jQuery.queue( elem, type ),
    			startLength = queue.length,
    			fn = queue.shift(),
    			hooks = jQuery._queueHooks( elem, type ),
    			next = function() {
    				jQuery.dequeue( elem, type );
    			};

    		// If the fx queue is dequeued, always remove the progress sentinel
    		if ( fn === "inprogress" ) {
    			fn = queue.shift();
    			startLength--;
    		}

    		if ( fn ) {

    			// Add a progress sentinel to prevent the fx queue from being
    			// automatically dequeued
    			if ( type === "fx" ) {
    				queue.unshift( "inprogress" );
    			}

    			// Clear up the last queue stop function
    			delete hooks.stop;
    			fn.call( elem, next, hooks );
    		}

    		if ( !startLength && hooks ) {
    			hooks.empty.fire();
    		}
    	},

    	// Not public - generate a queueHooks object, or return the current one
    	_queueHooks: function( elem, type ) {
    		var key = type + "queueHooks";
    		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
    			empty: jQuery.Callbacks( "once memory" ).add( function() {
    				dataPriv.remove( elem, [ type + "queue", key ] );
    			} )
    		} );
    	}
    } );

    jQuery.fn.extend( {
    	queue: function( type, data ) {
    		var setter = 2;

    		if ( typeof type !== "string" ) {
    			data = type;
    			type = "fx";
    			setter--;
    		}

    		if ( arguments.length < setter ) {
    			return jQuery.queue( this[ 0 ], type );
    		}

    		return data === undefined ?
    			this :
    			this.each( function() {
    				var queue = jQuery.queue( this, type, data );

    				// Ensure a hooks for this queue
    				jQuery._queueHooks( this, type );

    				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
    					jQuery.dequeue( this, type );
    				}
    			} );
    	},
    	dequeue: function( type ) {
    		return this.each( function() {
    			jQuery.dequeue( this, type );
    		} );
    	},
    	clearQueue: function( type ) {
    		return this.queue( type || "fx", [] );
    	},

    	// Get a promise resolved when queues of a certain type
    	// are emptied (fx is the type by default)
    	promise: function( type, obj ) {
    		var tmp,
    			count = 1,
    			defer = jQuery.Deferred(),
    			elements = this,
    			i = this.length,
    			resolve = function() {
    				if ( !( --count ) ) {
    					defer.resolveWith( elements, [ elements ] );
    				}
    			};

    		if ( typeof type !== "string" ) {
    			obj = type;
    			type = undefined;
    		}
    		type = type || "fx";

    		while ( i-- ) {
    			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
    			if ( tmp && tmp.empty ) {
    				count++;
    				tmp.empty.add( resolve );
    			}
    		}
    		resolve();
    		return defer.promise( obj );
    	}
    } );
    var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

    var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


    var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

    var documentElement = document.documentElement;



    	var isAttached = function( elem ) {
    			return jQuery.contains( elem.ownerDocument, elem );
    		},
    		composed = { composed: true };

    	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
    	// Check attachment across shadow DOM boundaries when possible (gh-3504)
    	// Support: iOS 10.0-10.2 only
    	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
    	// leading to errors. We need to check for `getRootNode`.
    	if ( documentElement.getRootNode ) {
    		isAttached = function( elem ) {
    			return jQuery.contains( elem.ownerDocument, elem ) ||
    				elem.getRootNode( composed ) === elem.ownerDocument;
    		};
    	}
    var isHiddenWithinTree = function( elem, el ) {

    		// isHiddenWithinTree might be called from jQuery#filter function;
    		// in that case, element will be second argument
    		elem = el || elem;

    		// Inline style trumps all
    		return elem.style.display === "none" ||
    			elem.style.display === "" &&

    			// Otherwise, check computed style
    			// Support: Firefox <=43 - 45
    			// Disconnected elements can have computed display: none, so first confirm that elem is
    			// in the document.
    			isAttached( elem ) &&

    			jQuery.css( elem, "display" ) === "none";
    	};



    function adjustCSS( elem, prop, valueParts, tween ) {
    	var adjusted, scale,
    		maxIterations = 20,
    		currentValue = tween ?
    			function() {
    				return tween.cur();
    			} :
    			function() {
    				return jQuery.css( elem, prop, "" );
    			},
    		initial = currentValue(),
    		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

    		// Starting value computation is required for potential unit mismatches
    		initialInUnit = elem.nodeType &&
    			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
    			rcssNum.exec( jQuery.css( elem, prop ) );

    	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

    		// Support: Firefox <=54
    		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
    		initial = initial / 2;

    		// Trust units reported by jQuery.css
    		unit = unit || initialInUnit[ 3 ];

    		// Iteratively approximate from a nonzero starting point
    		initialInUnit = +initial || 1;

    		while ( maxIterations-- ) {

    			// Evaluate and update our best guess (doubling guesses that zero out).
    			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
    			jQuery.style( elem, prop, initialInUnit + unit );
    			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
    				maxIterations = 0;
    			}
    			initialInUnit = initialInUnit / scale;

    		}

    		initialInUnit = initialInUnit * 2;
    		jQuery.style( elem, prop, initialInUnit + unit );

    		// Make sure we update the tween properties later on
    		valueParts = valueParts || [];
    	}

    	if ( valueParts ) {
    		initialInUnit = +initialInUnit || +initial || 0;

    		// Apply relative offset (+=/-=) if specified
    		adjusted = valueParts[ 1 ] ?
    			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
    			+valueParts[ 2 ];
    		if ( tween ) {
    			tween.unit = unit;
    			tween.start = initialInUnit;
    			tween.end = adjusted;
    		}
    	}
    	return adjusted;
    }


    var defaultDisplayMap = {};

    function getDefaultDisplay( elem ) {
    	var temp,
    		doc = elem.ownerDocument,
    		nodeName = elem.nodeName,
    		display = defaultDisplayMap[ nodeName ];

    	if ( display ) {
    		return display;
    	}

    	temp = doc.body.appendChild( doc.createElement( nodeName ) );
    	display = jQuery.css( temp, "display" );

    	temp.parentNode.removeChild( temp );

    	if ( display === "none" ) {
    		display = "block";
    	}
    	defaultDisplayMap[ nodeName ] = display;

    	return display;
    }

    function showHide( elements, show ) {
    	var display, elem,
    		values = [],
    		index = 0,
    		length = elements.length;

    	// Determine new display value for elements that need to change
    	for ( ; index < length; index++ ) {
    		elem = elements[ index ];
    		if ( !elem.style ) {
    			continue;
    		}

    		display = elem.style.display;
    		if ( show ) {

    			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
    			// check is required in this first loop unless we have a nonempty display value (either
    			// inline or about-to-be-restored)
    			if ( display === "none" ) {
    				values[ index ] = dataPriv.get( elem, "display" ) || null;
    				if ( !values[ index ] ) {
    					elem.style.display = "";
    				}
    			}
    			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
    				values[ index ] = getDefaultDisplay( elem );
    			}
    		} else {
    			if ( display !== "none" ) {
    				values[ index ] = "none";

    				// Remember what we're overwriting
    				dataPriv.set( elem, "display", display );
    			}
    		}
    	}

    	// Set the display of the elements in a second loop to avoid constant reflow
    	for ( index = 0; index < length; index++ ) {
    		if ( values[ index ] != null ) {
    			elements[ index ].style.display = values[ index ];
    		}
    	}

    	return elements;
    }

    jQuery.fn.extend( {
    	show: function() {
    		return showHide( this, true );
    	},
    	hide: function() {
    		return showHide( this );
    	},
    	toggle: function( state ) {
    		if ( typeof state === "boolean" ) {
    			return state ? this.show() : this.hide();
    		}

    		return this.each( function() {
    			if ( isHiddenWithinTree( this ) ) {
    				jQuery( this ).show();
    			} else {
    				jQuery( this ).hide();
    			}
    		} );
    	}
    } );
    var rcheckableType = ( /^(?:checkbox|radio)$/i );

    var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

    var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



    ( function() {
    	var fragment = document.createDocumentFragment(),
    		div = fragment.appendChild( document.createElement( "div" ) ),
    		input = document.createElement( "input" );

    	// Support: Android 4.0 - 4.3 only
    	// Check state lost if the name is set (#11217)
    	// Support: Windows Web Apps (WWA)
    	// `name` and `type` must use .setAttribute for WWA (#14901)
    	input.setAttribute( "type", "radio" );
    	input.setAttribute( "checked", "checked" );
    	input.setAttribute( "name", "t" );

    	div.appendChild( input );

    	// Support: Android <=4.1 only
    	// Older WebKit doesn't clone checked state correctly in fragments
    	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

    	// Support: IE <=11 only
    	// Make sure textarea (and checkbox) defaultValue is properly cloned
    	div.innerHTML = "<textarea>x</textarea>";
    	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

    	// Support: IE <=9 only
    	// IE <=9 replaces <option> tags with their contents when inserted outside of
    	// the select element.
    	div.innerHTML = "<option></option>";
    	support.option = !!div.lastChild;
    } )();


    // We have to close these tags to support XHTML (#13200)
    var wrapMap = {

    	// XHTML parsers do not magically insert elements in the
    	// same way that tag soup parsers do. So we cannot shorten
    	// this by omitting <tbody> or other required elements.
    	thead: [ 1, "<table>", "</table>" ],
    	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
    	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

    	_default: [ 0, "", "" ]
    };

    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    // Support: IE <=9 only
    if ( !support.option ) {
    	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
    }


    function getAll( context, tag ) {

    	// Support: IE <=9 - 11 only
    	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
    	var ret;

    	if ( typeof context.getElementsByTagName !== "undefined" ) {
    		ret = context.getElementsByTagName( tag || "*" );

    	} else if ( typeof context.querySelectorAll !== "undefined" ) {
    		ret = context.querySelectorAll( tag || "*" );

    	} else {
    		ret = [];
    	}

    	if ( tag === undefined || tag && nodeName( context, tag ) ) {
    		return jQuery.merge( [ context ], ret );
    	}

    	return ret;
    }


    // Mark scripts as having already been evaluated
    function setGlobalEval( elems, refElements ) {
    	var i = 0,
    		l = elems.length;

    	for ( ; i < l; i++ ) {
    		dataPriv.set(
    			elems[ i ],
    			"globalEval",
    			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
    		);
    	}
    }


    var rhtml = /<|&#?\w+;/;

    function buildFragment( elems, context, scripts, selection, ignored ) {
    	var elem, tmp, tag, wrap, attached, j,
    		fragment = context.createDocumentFragment(),
    		nodes = [],
    		i = 0,
    		l = elems.length;

    	for ( ; i < l; i++ ) {
    		elem = elems[ i ];

    		if ( elem || elem === 0 ) {

    			// Add nodes directly
    			if ( toType( elem ) === "object" ) {

    				// Support: Android <=4.0 only, PhantomJS 1 only
    				// push.apply(_, arraylike) throws on ancient WebKit
    				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

    			// Convert non-html into a text node
    			} else if ( !rhtml.test( elem ) ) {
    				nodes.push( context.createTextNode( elem ) );

    			// Convert html into DOM nodes
    			} else {
    				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

    				// Deserialize a standard representation
    				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
    				wrap = wrapMap[ tag ] || wrapMap._default;
    				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

    				// Descend through wrappers to the right content
    				j = wrap[ 0 ];
    				while ( j-- ) {
    					tmp = tmp.lastChild;
    				}

    				// Support: Android <=4.0 only, PhantomJS 1 only
    				// push.apply(_, arraylike) throws on ancient WebKit
    				jQuery.merge( nodes, tmp.childNodes );

    				// Remember the top-level container
    				tmp = fragment.firstChild;

    				// Ensure the created nodes are orphaned (#12392)
    				tmp.textContent = "";
    			}
    		}
    	}

    	// Remove wrapper from fragment
    	fragment.textContent = "";

    	i = 0;
    	while ( ( elem = nodes[ i++ ] ) ) {

    		// Skip elements already in the context collection (trac-4087)
    		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
    			if ( ignored ) {
    				ignored.push( elem );
    			}
    			continue;
    		}

    		attached = isAttached( elem );

    		// Append to fragment
    		tmp = getAll( fragment.appendChild( elem ), "script" );

    		// Preserve script evaluation history
    		if ( attached ) {
    			setGlobalEval( tmp );
    		}

    		// Capture executables
    		if ( scripts ) {
    			j = 0;
    			while ( ( elem = tmp[ j++ ] ) ) {
    				if ( rscriptType.test( elem.type || "" ) ) {
    					scripts.push( elem );
    				}
    			}
    		}
    	}

    	return fragment;
    }


    var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

    function returnTrue() {
    	return true;
    }

    function returnFalse() {
    	return false;
    }

    // Support: IE <=9 - 11+
    // focus() and blur() are asynchronous, except when they are no-op.
    // So expect focus to be synchronous when the element is already active,
    // and blur to be synchronous when the element is not already active.
    // (focus and blur are always synchronous in other supported browsers,
    // this just defines when we can count on it).
    function expectSync( elem, type ) {
    	return ( elem === safeActiveElement() ) === ( type === "focus" );
    }

    // Support: IE <=9 only
    // Accessing document.activeElement can throw unexpectedly
    // https://bugs.jquery.com/ticket/13393
    function safeActiveElement() {
    	try {
    		return document.activeElement;
    	} catch ( err ) { }
    }

    function on( elem, types, selector, data, fn, one ) {
    	var origFn, type;

    	// Types can be a map of types/handlers
    	if ( typeof types === "object" ) {

    		// ( types-Object, selector, data )
    		if ( typeof selector !== "string" ) {

    			// ( types-Object, data )
    			data = data || selector;
    			selector = undefined;
    		}
    		for ( type in types ) {
    			on( elem, type, selector, data, types[ type ], one );
    		}
    		return elem;
    	}

    	if ( data == null && fn == null ) {

    		// ( types, fn )
    		fn = selector;
    		data = selector = undefined;
    	} else if ( fn == null ) {
    		if ( typeof selector === "string" ) {

    			// ( types, selector, fn )
    			fn = data;
    			data = undefined;
    		} else {

    			// ( types, data, fn )
    			fn = data;
    			data = selector;
    			selector = undefined;
    		}
    	}
    	if ( fn === false ) {
    		fn = returnFalse;
    	} else if ( !fn ) {
    		return elem;
    	}

    	if ( one === 1 ) {
    		origFn = fn;
    		fn = function( event ) {

    			// Can use an empty set, since event contains the info
    			jQuery().off( event );
    			return origFn.apply( this, arguments );
    		};

    		// Use same guid so caller can remove using origFn
    		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    	}
    	return elem.each( function() {
    		jQuery.event.add( this, types, fn, data, selector );
    	} );
    }

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {

    	global: {},

    	add: function( elem, types, handler, data, selector ) {

    		var handleObjIn, eventHandle, tmp,
    			events, t, handleObj,
    			special, handlers, type, namespaces, origType,
    			elemData = dataPriv.get( elem );

    		// Only attach events to objects that accept data
    		if ( !acceptData( elem ) ) {
    			return;
    		}

    		// Caller can pass in an object of custom data in lieu of the handler
    		if ( handler.handler ) {
    			handleObjIn = handler;
    			handler = handleObjIn.handler;
    			selector = handleObjIn.selector;
    		}

    		// Ensure that invalid selectors throw exceptions at attach time
    		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
    		if ( selector ) {
    			jQuery.find.matchesSelector( documentElement, selector );
    		}

    		// Make sure that the handler has a unique ID, used to find/remove it later
    		if ( !handler.guid ) {
    			handler.guid = jQuery.guid++;
    		}

    		// Init the element's event structure and main handler, if this is the first
    		if ( !( events = elemData.events ) ) {
    			events = elemData.events = Object.create( null );
    		}
    		if ( !( eventHandle = elemData.handle ) ) {
    			eventHandle = elemData.handle = function( e ) {

    				// Discard the second event of a jQuery.event.trigger() and
    				// when an event is called after a page has unloaded
    				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
    					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
    			};
    		}

    		// Handle multiple events separated by a space
    		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
    		t = types.length;
    		while ( t-- ) {
    			tmp = rtypenamespace.exec( types[ t ] ) || [];
    			type = origType = tmp[ 1 ];
    			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

    			// There *must* be a type, no attaching namespace-only handlers
    			if ( !type ) {
    				continue;
    			}

    			// If event changes its type, use the special event handlers for the changed type
    			special = jQuery.event.special[ type ] || {};

    			// If selector defined, determine special event api type, otherwise given type
    			type = ( selector ? special.delegateType : special.bindType ) || type;

    			// Update special based on newly reset type
    			special = jQuery.event.special[ type ] || {};

    			// handleObj is passed to all event handlers
    			handleObj = jQuery.extend( {
    				type: type,
    				origType: origType,
    				data: data,
    				handler: handler,
    				guid: handler.guid,
    				selector: selector,
    				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
    				namespace: namespaces.join( "." )
    			}, handleObjIn );

    			// Init the event handler queue if we're the first
    			if ( !( handlers = events[ type ] ) ) {
    				handlers = events[ type ] = [];
    				handlers.delegateCount = 0;

    				// Only use addEventListener if the special events handler returns false
    				if ( !special.setup ||
    					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

    					if ( elem.addEventListener ) {
    						elem.addEventListener( type, eventHandle );
    					}
    				}
    			}

    			if ( special.add ) {
    				special.add.call( elem, handleObj );

    				if ( !handleObj.handler.guid ) {
    					handleObj.handler.guid = handler.guid;
    				}
    			}

    			// Add to the element's handler list, delegates in front
    			if ( selector ) {
    				handlers.splice( handlers.delegateCount++, 0, handleObj );
    			} else {
    				handlers.push( handleObj );
    			}

    			// Keep track of which events have ever been used, for event optimization
    			jQuery.event.global[ type ] = true;
    		}

    	},

    	// Detach an event or set of events from an element
    	remove: function( elem, types, handler, selector, mappedTypes ) {

    		var j, origCount, tmp,
    			events, t, handleObj,
    			special, handlers, type, namespaces, origType,
    			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

    		if ( !elemData || !( events = elemData.events ) ) {
    			return;
    		}

    		// Once for each type.namespace in types; type may be omitted
    		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
    		t = types.length;
    		while ( t-- ) {
    			tmp = rtypenamespace.exec( types[ t ] ) || [];
    			type = origType = tmp[ 1 ];
    			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

    			// Unbind all events (on this namespace, if provided) for the element
    			if ( !type ) {
    				for ( type in events ) {
    					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
    				}
    				continue;
    			}

    			special = jQuery.event.special[ type ] || {};
    			type = ( selector ? special.delegateType : special.bindType ) || type;
    			handlers = events[ type ] || [];
    			tmp = tmp[ 2 ] &&
    				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

    			// Remove matching events
    			origCount = j = handlers.length;
    			while ( j-- ) {
    				handleObj = handlers[ j ];

    				if ( ( mappedTypes || origType === handleObj.origType ) &&
    					( !handler || handler.guid === handleObj.guid ) &&
    					( !tmp || tmp.test( handleObj.namespace ) ) &&
    					( !selector || selector === handleObj.selector ||
    						selector === "**" && handleObj.selector ) ) {
    					handlers.splice( j, 1 );

    					if ( handleObj.selector ) {
    						handlers.delegateCount--;
    					}
    					if ( special.remove ) {
    						special.remove.call( elem, handleObj );
    					}
    				}
    			}

    			// Remove generic event handler if we removed something and no more handlers exist
    			// (avoids potential for endless recursion during removal of special event handlers)
    			if ( origCount && !handlers.length ) {
    				if ( !special.teardown ||
    					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

    					jQuery.removeEvent( elem, type, elemData.handle );
    				}

    				delete events[ type ];
    			}
    		}

    		// Remove data and the expando if it's no longer used
    		if ( jQuery.isEmptyObject( events ) ) {
    			dataPriv.remove( elem, "handle events" );
    		}
    	},

    	dispatch: function( nativeEvent ) {

    		var i, j, ret, matched, handleObj, handlerQueue,
    			args = new Array( arguments.length ),

    			// Make a writable jQuery.Event from the native event object
    			event = jQuery.event.fix( nativeEvent ),

    			handlers = (
    				dataPriv.get( this, "events" ) || Object.create( null )
    			)[ event.type ] || [],
    			special = jQuery.event.special[ event.type ] || {};

    		// Use the fix-ed jQuery.Event rather than the (read-only) native event
    		args[ 0 ] = event;

    		for ( i = 1; i < arguments.length; i++ ) {
    			args[ i ] = arguments[ i ];
    		}

    		event.delegateTarget = this;

    		// Call the preDispatch hook for the mapped type, and let it bail if desired
    		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
    			return;
    		}

    		// Determine handlers
    		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

    		// Run delegates first; they may want to stop propagation beneath us
    		i = 0;
    		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
    			event.currentTarget = matched.elem;

    			j = 0;
    			while ( ( handleObj = matched.handlers[ j++ ] ) &&
    				!event.isImmediatePropagationStopped() ) {

    				// If the event is namespaced, then each handler is only invoked if it is
    				// specially universal or its namespaces are a superset of the event's.
    				if ( !event.rnamespace || handleObj.namespace === false ||
    					event.rnamespace.test( handleObj.namespace ) ) {

    					event.handleObj = handleObj;
    					event.data = handleObj.data;

    					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
    						handleObj.handler ).apply( matched.elem, args );

    					if ( ret !== undefined ) {
    						if ( ( event.result = ret ) === false ) {
    							event.preventDefault();
    							event.stopPropagation();
    						}
    					}
    				}
    			}
    		}

    		// Call the postDispatch hook for the mapped type
    		if ( special.postDispatch ) {
    			special.postDispatch.call( this, event );
    		}

    		return event.result;
    	},

    	handlers: function( event, handlers ) {
    		var i, handleObj, sel, matchedHandlers, matchedSelectors,
    			handlerQueue = [],
    			delegateCount = handlers.delegateCount,
    			cur = event.target;

    		// Find delegate handlers
    		if ( delegateCount &&

    			// Support: IE <=9
    			// Black-hole SVG <use> instance trees (trac-13180)
    			cur.nodeType &&

    			// Support: Firefox <=42
    			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
    			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
    			// Support: IE 11 only
    			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
    			!( event.type === "click" && event.button >= 1 ) ) {

    			for ( ; cur !== this; cur = cur.parentNode || this ) {

    				// Don't check non-elements (#13208)
    				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
    				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
    					matchedHandlers = [];
    					matchedSelectors = {};
    					for ( i = 0; i < delegateCount; i++ ) {
    						handleObj = handlers[ i ];

    						// Don't conflict with Object.prototype properties (#13203)
    						sel = handleObj.selector + " ";

    						if ( matchedSelectors[ sel ] === undefined ) {
    							matchedSelectors[ sel ] = handleObj.needsContext ?
    								jQuery( sel, this ).index( cur ) > -1 :
    								jQuery.find( sel, this, null, [ cur ] ).length;
    						}
    						if ( matchedSelectors[ sel ] ) {
    							matchedHandlers.push( handleObj );
    						}
    					}
    					if ( matchedHandlers.length ) {
    						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
    					}
    				}
    			}
    		}

    		// Add the remaining (directly-bound) handlers
    		cur = this;
    		if ( delegateCount < handlers.length ) {
    			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
    		}

    		return handlerQueue;
    	},

    	addProp: function( name, hook ) {
    		Object.defineProperty( jQuery.Event.prototype, name, {
    			enumerable: true,
    			configurable: true,

    			get: isFunction( hook ) ?
    				function() {
    					if ( this.originalEvent ) {
    						return hook( this.originalEvent );
    					}
    				} :
    				function() {
    					if ( this.originalEvent ) {
    						return this.originalEvent[ name ];
    					}
    				},

    			set: function( value ) {
    				Object.defineProperty( this, name, {
    					enumerable: true,
    					configurable: true,
    					writable: true,
    					value: value
    				} );
    			}
    		} );
    	},

    	fix: function( originalEvent ) {
    		return originalEvent[ jQuery.expando ] ?
    			originalEvent :
    			new jQuery.Event( originalEvent );
    	},

    	special: {
    		load: {

    			// Prevent triggered image.load events from bubbling to window.load
    			noBubble: true
    		},
    		click: {

    			// Utilize native event to ensure correct state for checkable inputs
    			setup: function( data ) {

    				// For mutual compressibility with _default, replace `this` access with a local var.
    				// `|| data` is dead code meant only to preserve the variable through minification.
    				var el = this || data;

    				// Claim the first handler
    				if ( rcheckableType.test( el.type ) &&
    					el.click && nodeName( el, "input" ) ) {

    					// dataPriv.set( el, "click", ... )
    					leverageNative( el, "click", returnTrue );
    				}

    				// Return false to allow normal processing in the caller
    				return false;
    			},
    			trigger: function( data ) {

    				// For mutual compressibility with _default, replace `this` access with a local var.
    				// `|| data` is dead code meant only to preserve the variable through minification.
    				var el = this || data;

    				// Force setup before triggering a click
    				if ( rcheckableType.test( el.type ) &&
    					el.click && nodeName( el, "input" ) ) {

    					leverageNative( el, "click" );
    				}

    				// Return non-false to allow normal event-path propagation
    				return true;
    			},

    			// For cross-browser consistency, suppress native .click() on links
    			// Also prevent it if we're currently inside a leveraged native-event stack
    			_default: function( event ) {
    				var target = event.target;
    				return rcheckableType.test( target.type ) &&
    					target.click && nodeName( target, "input" ) &&
    					dataPriv.get( target, "click" ) ||
    					nodeName( target, "a" );
    			}
    		},

    		beforeunload: {
    			postDispatch: function( event ) {

    				// Support: Firefox 20+
    				// Firefox doesn't alert if the returnValue field is not set.
    				if ( event.result !== undefined && event.originalEvent ) {
    					event.originalEvent.returnValue = event.result;
    				}
    			}
    		}
    	}
    };

    // Ensure the presence of an event listener that handles manually-triggered
    // synthetic events by interrupting progress until reinvoked in response to
    // *native* events that it fires directly, ensuring that state changes have
    // already occurred before other listeners are invoked.
    function leverageNative( el, type, expectSync ) {

    	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
    	if ( !expectSync ) {
    		if ( dataPriv.get( el, type ) === undefined ) {
    			jQuery.event.add( el, type, returnTrue );
    		}
    		return;
    	}

    	// Register the controller as a special universal handler for all event namespaces
    	dataPriv.set( el, type, false );
    	jQuery.event.add( el, type, {
    		namespace: false,
    		handler: function( event ) {
    			var notAsync, result,
    				saved = dataPriv.get( this, type );

    			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

    				// Interrupt processing of the outer synthetic .trigger()ed event
    				// Saved data should be false in such cases, but might be a leftover capture object
    				// from an async native handler (gh-4350)
    				if ( !saved.length ) {

    					// Store arguments for use when handling the inner native event
    					// There will always be at least one argument (an event object), so this array
    					// will not be confused with a leftover capture object.
    					saved = slice.call( arguments );
    					dataPriv.set( this, type, saved );

    					// Trigger the native event and capture its result
    					// Support: IE <=9 - 11+
    					// focus() and blur() are asynchronous
    					notAsync = expectSync( this, type );
    					this[ type ]();
    					result = dataPriv.get( this, type );
    					if ( saved !== result || notAsync ) {
    						dataPriv.set( this, type, false );
    					} else {
    						result = {};
    					}
    					if ( saved !== result ) {

    						// Cancel the outer synthetic event
    						event.stopImmediatePropagation();
    						event.preventDefault();

    						// Support: Chrome 86+
    						// In Chrome, if an element having a focusout handler is blurred by
    						// clicking outside of it, it invokes the handler synchronously. If
    						// that handler calls `.remove()` on the element, the data is cleared,
    						// leaving `result` undefined. We need to guard against this.
    						return result && result.value;
    					}

    				// If this is an inner synthetic event for an event with a bubbling surrogate
    				// (focus or blur), assume that the surrogate already propagated from triggering the
    				// native event and prevent that from happening again here.
    				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
    				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
    				// less bad than duplication.
    				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
    					event.stopPropagation();
    				}

    			// If this is a native event triggered above, everything is now in order
    			// Fire an inner synthetic event with the original arguments
    			} else if ( saved.length ) {

    				// ...and capture the result
    				dataPriv.set( this, type, {
    					value: jQuery.event.trigger(

    						// Support: IE <=9 - 11+
    						// Extend with the prototype to reset the above stopImmediatePropagation()
    						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
    						saved.slice( 1 ),
    						this
    					)
    				} );

    				// Abort handling of the native event
    				event.stopImmediatePropagation();
    			}
    		}
    	} );
    }

    jQuery.removeEvent = function( elem, type, handle ) {

    	// This "if" is needed for plain objects
    	if ( elem.removeEventListener ) {
    		elem.removeEventListener( type, handle );
    	}
    };

    jQuery.Event = function( src, props ) {

    	// Allow instantiation without the 'new' keyword
    	if ( !( this instanceof jQuery.Event ) ) {
    		return new jQuery.Event( src, props );
    	}

    	// Event object
    	if ( src && src.type ) {
    		this.originalEvent = src;
    		this.type = src.type;

    		// Events bubbling up the document may have been marked as prevented
    		// by a handler lower down the tree; reflect the correct value.
    		this.isDefaultPrevented = src.defaultPrevented ||
    				src.defaultPrevented === undefined &&

    				// Support: Android <=2.3 only
    				src.returnValue === false ?
    			returnTrue :
    			returnFalse;

    		// Create target properties
    		// Support: Safari <=6 - 7 only
    		// Target should not be a text node (#504, #13143)
    		this.target = ( src.target && src.target.nodeType === 3 ) ?
    			src.target.parentNode :
    			src.target;

    		this.currentTarget = src.currentTarget;
    		this.relatedTarget = src.relatedTarget;

    	// Event type
    	} else {
    		this.type = src;
    	}

    	// Put explicitly provided properties onto the event object
    	if ( props ) {
    		jQuery.extend( this, props );
    	}

    	// Create a timestamp if incoming event doesn't have one
    	this.timeStamp = src && src.timeStamp || Date.now();

    	// Mark it as fixed
    	this[ jQuery.expando ] = true;
    };

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
    	constructor: jQuery.Event,
    	isDefaultPrevented: returnFalse,
    	isPropagationStopped: returnFalse,
    	isImmediatePropagationStopped: returnFalse,
    	isSimulated: false,

    	preventDefault: function() {
    		var e = this.originalEvent;

    		this.isDefaultPrevented = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.preventDefault();
    		}
    	},
    	stopPropagation: function() {
    		var e = this.originalEvent;

    		this.isPropagationStopped = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.stopPropagation();
    		}
    	},
    	stopImmediatePropagation: function() {
    		var e = this.originalEvent;

    		this.isImmediatePropagationStopped = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.stopImmediatePropagation();
    		}

    		this.stopPropagation();
    	}
    };

    // Includes all common event props including KeyEvent and MouseEvent specific props
    jQuery.each( {
    	altKey: true,
    	bubbles: true,
    	cancelable: true,
    	changedTouches: true,
    	ctrlKey: true,
    	detail: true,
    	eventPhase: true,
    	metaKey: true,
    	pageX: true,
    	pageY: true,
    	shiftKey: true,
    	view: true,
    	"char": true,
    	code: true,
    	charCode: true,
    	key: true,
    	keyCode: true,
    	button: true,
    	buttons: true,
    	clientX: true,
    	clientY: true,
    	offsetX: true,
    	offsetY: true,
    	pointerId: true,
    	pointerType: true,
    	screenX: true,
    	screenY: true,
    	targetTouches: true,
    	toElement: true,
    	touches: true,
    	which: true
    }, jQuery.event.addProp );

    jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
    	jQuery.event.special[ type ] = {

    		// Utilize native event if possible so blur/focus sequence is correct
    		setup: function() {

    			// Claim the first handler
    			// dataPriv.set( this, "focus", ... )
    			// dataPriv.set( this, "blur", ... )
    			leverageNative( this, type, expectSync );

    			// Return false to allow normal processing in the caller
    			return false;
    		},
    		trigger: function() {

    			// Force setup before trigger
    			leverageNative( this, type );

    			// Return non-false to allow normal event-path propagation
    			return true;
    		},

    		// Suppress native focus or blur as it's already being fired
    		// in leverageNative.
    		_default: function() {
    			return true;
    		},

    		delegateType: delegateType
    	};
    } );

    // Create mouseenter/leave events using mouseover/out and event-time checks
    // so that event delegation works in jQuery.
    // Do the same for pointerenter/pointerleave and pointerover/pointerout
    //
    // Support: Safari 7 only
    // Safari sends mouseenter too often; see:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=470258
    // for the description of the bug (it existed in older Chrome versions as well).
    jQuery.each( {
    	mouseenter: "mouseover",
    	mouseleave: "mouseout",
    	pointerenter: "pointerover",
    	pointerleave: "pointerout"
    }, function( orig, fix ) {
    	jQuery.event.special[ orig ] = {
    		delegateType: fix,
    		bindType: fix,

    		handle: function( event ) {
    			var ret,
    				target = this,
    				related = event.relatedTarget,
    				handleObj = event.handleObj;

    			// For mouseenter/leave call the handler if related is outside the target.
    			// NB: No relatedTarget if the mouse left/entered the browser window
    			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
    				event.type = handleObj.origType;
    				ret = handleObj.handler.apply( this, arguments );
    				event.type = fix;
    			}
    			return ret;
    		}
    	};
    } );

    jQuery.fn.extend( {

    	on: function( types, selector, data, fn ) {
    		return on( this, types, selector, data, fn );
    	},
    	one: function( types, selector, data, fn ) {
    		return on( this, types, selector, data, fn, 1 );
    	},
    	off: function( types, selector, fn ) {
    		var handleObj, type;
    		if ( types && types.preventDefault && types.handleObj ) {

    			// ( event )  dispatched jQuery.Event
    			handleObj = types.handleObj;
    			jQuery( types.delegateTarget ).off(
    				handleObj.namespace ?
    					handleObj.origType + "." + handleObj.namespace :
    					handleObj.origType,
    				handleObj.selector,
    				handleObj.handler
    			);
    			return this;
    		}
    		if ( typeof types === "object" ) {

    			// ( types-object [, selector] )
    			for ( type in types ) {
    				this.off( type, selector, types[ type ] );
    			}
    			return this;
    		}
    		if ( selector === false || typeof selector === "function" ) {

    			// ( types [, fn] )
    			fn = selector;
    			selector = undefined;
    		}
    		if ( fn === false ) {
    			fn = returnFalse;
    		}
    		return this.each( function() {
    			jQuery.event.remove( this, types, fn, selector );
    		} );
    	}
    } );


    var

    	// Support: IE <=10 - 11, Edge 12 - 13 only
    	// In IE/Edge using regex groups here causes severe slowdowns.
    	// See https://connect.microsoft.com/IE/feedback/details/1736512/
    	rnoInnerhtml = /<script|<style|<link/i,

    	// checked="checked" or checked
    	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    // Prefer a tbody over its parent table for containing new rows
    function manipulationTarget( elem, content ) {
    	if ( nodeName( elem, "table" ) &&
    		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

    		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
    	}

    	return elem;
    }

    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript( elem ) {
    	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
    	return elem;
    }
    function restoreScript( elem ) {
    	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
    		elem.type = elem.type.slice( 5 );
    	} else {
    		elem.removeAttribute( "type" );
    	}

    	return elem;
    }

    function cloneCopyEvent( src, dest ) {
    	var i, l, type, pdataOld, udataOld, udataCur, events;

    	if ( dest.nodeType !== 1 ) {
    		return;
    	}

    	// 1. Copy private data: events, handlers, etc.
    	if ( dataPriv.hasData( src ) ) {
    		pdataOld = dataPriv.get( src );
    		events = pdataOld.events;

    		if ( events ) {
    			dataPriv.remove( dest, "handle events" );

    			for ( type in events ) {
    				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
    					jQuery.event.add( dest, type, events[ type ][ i ] );
    				}
    			}
    		}
    	}

    	// 2. Copy user data
    	if ( dataUser.hasData( src ) ) {
    		udataOld = dataUser.access( src );
    		udataCur = jQuery.extend( {}, udataOld );

    		dataUser.set( dest, udataCur );
    	}
    }

    // Fix IE bugs, see support tests
    function fixInput( src, dest ) {
    	var nodeName = dest.nodeName.toLowerCase();

    	// Fails to persist the checked state of a cloned checkbox or radio button.
    	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
    		dest.checked = src.checked;

    	// Fails to return the selected option to the default selected state when cloning options
    	} else if ( nodeName === "input" || nodeName === "textarea" ) {
    		dest.defaultValue = src.defaultValue;
    	}
    }

    function domManip( collection, args, callback, ignored ) {

    	// Flatten any nested arrays
    	args = flat( args );

    	var fragment, first, scripts, hasScripts, node, doc,
    		i = 0,
    		l = collection.length,
    		iNoClone = l - 1,
    		value = args[ 0 ],
    		valueIsFunction = isFunction( value );

    	// We can't cloneNode fragments that contain checked, in WebKit
    	if ( valueIsFunction ||
    			( l > 1 && typeof value === "string" &&
    				!support.checkClone && rchecked.test( value ) ) ) {
    		return collection.each( function( index ) {
    			var self = collection.eq( index );
    			if ( valueIsFunction ) {
    				args[ 0 ] = value.call( this, index, self.html() );
    			}
    			domManip( self, args, callback, ignored );
    		} );
    	}

    	if ( l ) {
    		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
    		first = fragment.firstChild;

    		if ( fragment.childNodes.length === 1 ) {
    			fragment = first;
    		}

    		// Require either new content or an interest in ignored elements to invoke the callback
    		if ( first || ignored ) {
    			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
    			hasScripts = scripts.length;

    			// Use the original fragment for the last item
    			// instead of the first because it can end up
    			// being emptied incorrectly in certain situations (#8070).
    			for ( ; i < l; i++ ) {
    				node = fragment;

    				if ( i !== iNoClone ) {
    					node = jQuery.clone( node, true, true );

    					// Keep references to cloned scripts for later restoration
    					if ( hasScripts ) {

    						// Support: Android <=4.0 only, PhantomJS 1 only
    						// push.apply(_, arraylike) throws on ancient WebKit
    						jQuery.merge( scripts, getAll( node, "script" ) );
    					}
    				}

    				callback.call( collection[ i ], node, i );
    			}

    			if ( hasScripts ) {
    				doc = scripts[ scripts.length - 1 ].ownerDocument;

    				// Reenable scripts
    				jQuery.map( scripts, restoreScript );

    				// Evaluate executable scripts on first document insertion
    				for ( i = 0; i < hasScripts; i++ ) {
    					node = scripts[ i ];
    					if ( rscriptType.test( node.type || "" ) &&
    						!dataPriv.access( node, "globalEval" ) &&
    						jQuery.contains( doc, node ) ) {

    						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

    							// Optional AJAX dependency, but won't run scripts if not present
    							if ( jQuery._evalUrl && !node.noModule ) {
    								jQuery._evalUrl( node.src, {
    									nonce: node.nonce || node.getAttribute( "nonce" )
    								}, doc );
    							}
    						} else {
    							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
    						}
    					}
    				}
    			}
    		}
    	}

    	return collection;
    }

    function remove( elem, selector, keepData ) {
    	var node,
    		nodes = selector ? jQuery.filter( selector, elem ) : elem,
    		i = 0;

    	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
    		if ( !keepData && node.nodeType === 1 ) {
    			jQuery.cleanData( getAll( node ) );
    		}

    		if ( node.parentNode ) {
    			if ( keepData && isAttached( node ) ) {
    				setGlobalEval( getAll( node, "script" ) );
    			}
    			node.parentNode.removeChild( node );
    		}
    	}

    	return elem;
    }

    jQuery.extend( {
    	htmlPrefilter: function( html ) {
    		return html;
    	},

    	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    		var i, l, srcElements, destElements,
    			clone = elem.cloneNode( true ),
    			inPage = isAttached( elem );

    		// Fix IE cloning issues
    		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
    				!jQuery.isXMLDoc( elem ) ) {

    			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
    			destElements = getAll( clone );
    			srcElements = getAll( elem );

    			for ( i = 0, l = srcElements.length; i < l; i++ ) {
    				fixInput( srcElements[ i ], destElements[ i ] );
    			}
    		}

    		// Copy the events from the original to the clone
    		if ( dataAndEvents ) {
    			if ( deepDataAndEvents ) {
    				srcElements = srcElements || getAll( elem );
    				destElements = destElements || getAll( clone );

    				for ( i = 0, l = srcElements.length; i < l; i++ ) {
    					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
    				}
    			} else {
    				cloneCopyEvent( elem, clone );
    			}
    		}

    		// Preserve script evaluation history
    		destElements = getAll( clone, "script" );
    		if ( destElements.length > 0 ) {
    			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
    		}

    		// Return the cloned set
    		return clone;
    	},

    	cleanData: function( elems ) {
    		var data, elem, type,
    			special = jQuery.event.special,
    			i = 0;

    		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
    			if ( acceptData( elem ) ) {
    				if ( ( data = elem[ dataPriv.expando ] ) ) {
    					if ( data.events ) {
    						for ( type in data.events ) {
    							if ( special[ type ] ) {
    								jQuery.event.remove( elem, type );

    							// This is a shortcut to avoid jQuery.event.remove's overhead
    							} else {
    								jQuery.removeEvent( elem, type, data.handle );
    							}
    						}
    					}

    					// Support: Chrome <=35 - 45+
    					// Assign undefined instead of using delete, see Data#remove
    					elem[ dataPriv.expando ] = undefined;
    				}
    				if ( elem[ dataUser.expando ] ) {

    					// Support: Chrome <=35 - 45+
    					// Assign undefined instead of using delete, see Data#remove
    					elem[ dataUser.expando ] = undefined;
    				}
    			}
    		}
    	}
    } );

    jQuery.fn.extend( {
    	detach: function( selector ) {
    		return remove( this, selector, true );
    	},

    	remove: function( selector ) {
    		return remove( this, selector );
    	},

    	text: function( value ) {
    		return access( this, function( value ) {
    			return value === undefined ?
    				jQuery.text( this ) :
    				this.empty().each( function() {
    					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    						this.textContent = value;
    					}
    				} );
    		}, null, value, arguments.length );
    	},

    	append: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    				var target = manipulationTarget( this, elem );
    				target.appendChild( elem );
    			}
    		} );
    	},

    	prepend: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    				var target = manipulationTarget( this, elem );
    				target.insertBefore( elem, target.firstChild );
    			}
    		} );
    	},

    	before: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.parentNode ) {
    				this.parentNode.insertBefore( elem, this );
    			}
    		} );
    	},

    	after: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.parentNode ) {
    				this.parentNode.insertBefore( elem, this.nextSibling );
    			}
    		} );
    	},

    	empty: function() {
    		var elem,
    			i = 0;

    		for ( ; ( elem = this[ i ] ) != null; i++ ) {
    			if ( elem.nodeType === 1 ) {

    				// Prevent memory leaks
    				jQuery.cleanData( getAll( elem, false ) );

    				// Remove any remaining nodes
    				elem.textContent = "";
    			}
    		}

    		return this;
    	},

    	clone: function( dataAndEvents, deepDataAndEvents ) {
    		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    		return this.map( function() {
    			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    		} );
    	},

    	html: function( value ) {
    		return access( this, function( value ) {
    			var elem = this[ 0 ] || {},
    				i = 0,
    				l = this.length;

    			if ( value === undefined && elem.nodeType === 1 ) {
    				return elem.innerHTML;
    			}

    			// See if we can take a shortcut and just use innerHTML
    			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
    				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

    				value = jQuery.htmlPrefilter( value );

    				try {
    					for ( ; i < l; i++ ) {
    						elem = this[ i ] || {};

    						// Remove element nodes and prevent memory leaks
    						if ( elem.nodeType === 1 ) {
    							jQuery.cleanData( getAll( elem, false ) );
    							elem.innerHTML = value;
    						}
    					}

    					elem = 0;

    				// If using innerHTML throws an exception, use the fallback method
    				} catch ( e ) {}
    			}

    			if ( elem ) {
    				this.empty().append( value );
    			}
    		}, null, value, arguments.length );
    	},

    	replaceWith: function() {
    		var ignored = [];

    		// Make the changes, replacing each non-ignored context element with the new content
    		return domManip( this, arguments, function( elem ) {
    			var parent = this.parentNode;

    			if ( jQuery.inArray( this, ignored ) < 0 ) {
    				jQuery.cleanData( getAll( this ) );
    				if ( parent ) {
    					parent.replaceChild( elem, this );
    				}
    			}

    		// Force callback invocation
    		}, ignored );
    	}
    } );

    jQuery.each( {
    	appendTo: "append",
    	prependTo: "prepend",
    	insertBefore: "before",
    	insertAfter: "after",
    	replaceAll: "replaceWith"
    }, function( name, original ) {
    	jQuery.fn[ name ] = function( selector ) {
    		var elems,
    			ret = [],
    			insert = jQuery( selector ),
    			last = insert.length - 1,
    			i = 0;

    		for ( ; i <= last; i++ ) {
    			elems = i === last ? this : this.clone( true );
    			jQuery( insert[ i ] )[ original ]( elems );

    			// Support: Android <=4.0 only, PhantomJS 1 only
    			// .get() because push.apply(_, arraylike) throws on ancient WebKit
    			push.apply( ret, elems.get() );
    		}

    		return this.pushStack( ret );
    	};
    } );
    var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

    var getStyles = function( elem ) {

    		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    		// IE throws on elements created in popups
    		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    		var view = elem.ownerDocument.defaultView;

    		if ( !view || !view.opener ) {
    			view = window;
    		}

    		return view.getComputedStyle( elem );
    	};

    var swap = function( elem, options, callback ) {
    	var ret, name,
    		old = {};

    	// Remember the old values, and insert the new ones
    	for ( name in options ) {
    		old[ name ] = elem.style[ name ];
    		elem.style[ name ] = options[ name ];
    	}

    	ret = callback.call( elem );

    	// Revert the old values
    	for ( name in options ) {
    		elem.style[ name ] = old[ name ];
    	}

    	return ret;
    };


    var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



    ( function() {

    	// Executing both pixelPosition & boxSizingReliable tests require only one layout
    	// so they're executed at the same time to save the second computation.
    	function computeStyleTests() {

    		// This is a singleton, we need to execute it only once
    		if ( !div ) {
    			return;
    		}

    		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
    			"margin-top:1px;padding:0;border:0";
    		div.style.cssText =
    			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
    			"margin:auto;border:1px;padding:1px;" +
    			"width:60%;top:1%";
    		documentElement.appendChild( container ).appendChild( div );

    		var divStyle = window.getComputedStyle( div );
    		pixelPositionVal = divStyle.top !== "1%";

    		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
    		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

    		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
    		// Some styles come back with percentage values, even though they shouldn't
    		div.style.right = "60%";
    		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

    		// Support: IE 9 - 11 only
    		// Detect misreporting of content dimensions for box-sizing:border-box elements
    		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

    		// Support: IE 9 only
    		// Detect overflow:scroll screwiness (gh-3699)
    		// Support: Chrome <=64
    		// Don't get tricked when zoom affects offsetWidth (gh-4029)
    		div.style.position = "absolute";
    		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

    		documentElement.removeChild( container );

    		// Nullify the div so it wouldn't be stored in the memory and
    		// it will also be a sign that checks already performed
    		div = null;
    	}

    	function roundPixelMeasures( measure ) {
    		return Math.round( parseFloat( measure ) );
    	}

    	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
    		reliableTrDimensionsVal, reliableMarginLeftVal,
    		container = document.createElement( "div" ),
    		div = document.createElement( "div" );

    	// Finish early in limited (non-browser) environments
    	if ( !div.style ) {
    		return;
    	}

    	// Support: IE <=9 - 11 only
    	// Style of cloned element affects source element cloned (#8908)
    	div.style.backgroundClip = "content-box";
    	div.cloneNode( true ).style.backgroundClip = "";
    	support.clearCloneStyle = div.style.backgroundClip === "content-box";

    	jQuery.extend( support, {
    		boxSizingReliable: function() {
    			computeStyleTests();
    			return boxSizingReliableVal;
    		},
    		pixelBoxStyles: function() {
    			computeStyleTests();
    			return pixelBoxStylesVal;
    		},
    		pixelPosition: function() {
    			computeStyleTests();
    			return pixelPositionVal;
    		},
    		reliableMarginLeft: function() {
    			computeStyleTests();
    			return reliableMarginLeftVal;
    		},
    		scrollboxSize: function() {
    			computeStyleTests();
    			return scrollboxSizeVal;
    		},

    		// Support: IE 9 - 11+, Edge 15 - 18+
    		// IE/Edge misreport `getComputedStyle` of table rows with width/height
    		// set in CSS while `offset*` properties report correct values.
    		// Behavior in IE 9 is more subtle than in newer versions & it passes
    		// some versions of this test; make sure not to make it pass there!
    		//
    		// Support: Firefox 70+
    		// Only Firefox includes border widths
    		// in computed dimensions. (gh-4529)
    		reliableTrDimensions: function() {
    			var table, tr, trChild, trStyle;
    			if ( reliableTrDimensionsVal == null ) {
    				table = document.createElement( "table" );
    				tr = document.createElement( "tr" );
    				trChild = document.createElement( "div" );

    				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
    				tr.style.cssText = "border:1px solid";

    				// Support: Chrome 86+
    				// Height set through cssText does not get applied.
    				// Computed height then comes back as 0.
    				tr.style.height = "1px";
    				trChild.style.height = "9px";

    				// Support: Android 8 Chrome 86+
    				// In our bodyBackground.html iframe,
    				// display for all div elements is set to "inline",
    				// which causes a problem only in Android 8 Chrome 86.
    				// Ensuring the div is display: block
    				// gets around this issue.
    				trChild.style.display = "block";

    				documentElement
    					.appendChild( table )
    					.appendChild( tr )
    					.appendChild( trChild );

    				trStyle = window.getComputedStyle( tr );
    				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
    					parseInt( trStyle.borderTopWidth, 10 ) +
    					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

    				documentElement.removeChild( table );
    			}
    			return reliableTrDimensionsVal;
    		}
    	} );
    } )();


    function curCSS( elem, name, computed ) {
    	var width, minWidth, maxWidth, ret,

    		// Support: Firefox 51+
    		// Retrieving style before computed somehow
    		// fixes an issue with getting wrong values
    		// on detached elements
    		style = elem.style;

    	computed = computed || getStyles( elem );

    	// getPropertyValue is needed for:
    	//   .css('filter') (IE 9 only, #12537)
    	//   .css('--customProperty) (#3144)
    	if ( computed ) {
    		ret = computed.getPropertyValue( name ) || computed[ name ];

    		if ( ret === "" && !isAttached( elem ) ) {
    			ret = jQuery.style( elem, name );
    		}

    		// A tribute to the "awesome hack by Dean Edwards"
    		// Android Browser returns percentage for some values,
    		// but width seems to be reliably pixels.
    		// This is against the CSSOM draft spec:
    		// https://drafts.csswg.org/cssom/#resolved-values
    		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

    			// Remember the original values
    			width = style.width;
    			minWidth = style.minWidth;
    			maxWidth = style.maxWidth;

    			// Put in the new values to get a computed value out
    			style.minWidth = style.maxWidth = style.width = ret;
    			ret = computed.width;

    			// Revert the changed values
    			style.width = width;
    			style.minWidth = minWidth;
    			style.maxWidth = maxWidth;
    		}
    	}

    	return ret !== undefined ?

    		// Support: IE <=9 - 11 only
    		// IE returns zIndex value as an integer.
    		ret + "" :
    		ret;
    }


    function addGetHookIf( conditionFn, hookFn ) {

    	// Define the hook, we'll check on the first run if it's really needed.
    	return {
    		get: function() {
    			if ( conditionFn() ) {

    				// Hook not needed (or it's not possible to use it due
    				// to missing dependency), remove it.
    				delete this.get;
    				return;
    			}

    			// Hook needed; redefine it so that the support test is not executed again.
    			return ( this.get = hookFn ).apply( this, arguments );
    		}
    	};
    }


    var cssPrefixes = [ "Webkit", "Moz", "ms" ],
    	emptyStyle = document.createElement( "div" ).style,
    	vendorProps = {};

    // Return a vendor-prefixed property or undefined
    function vendorPropName( name ) {

    	// Check for vendor prefixed names
    	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
    		i = cssPrefixes.length;

    	while ( i-- ) {
    		name = cssPrefixes[ i ] + capName;
    		if ( name in emptyStyle ) {
    			return name;
    		}
    	}
    }

    // Return a potentially-mapped jQuery.cssProps or vendor prefixed property
    function finalPropName( name ) {
    	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

    	if ( final ) {
    		return final;
    	}
    	if ( name in emptyStyle ) {
    		return name;
    	}
    	return vendorProps[ name ] = vendorPropName( name ) || name;
    }


    var

    	// Swappable if display is none or starts with table
    	// except "table", "table-cell", or "table-caption"
    	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    	rcustomProp = /^--/,
    	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    	cssNormalTransform = {
    		letterSpacing: "0",
    		fontWeight: "400"
    	};

    function setPositiveNumber( _elem, value, subtract ) {

    	// Any relative (+/-) values have already been
    	// normalized at this point
    	var matches = rcssNum.exec( value );
    	return matches ?

    		// Guard against undefined "subtract", e.g., when used as in cssHooks
    		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
    		value;
    }

    function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
    	var i = dimension === "width" ? 1 : 0,
    		extra = 0,
    		delta = 0;

    	// Adjustment may not be necessary
    	if ( box === ( isBorderBox ? "border" : "content" ) ) {
    		return 0;
    	}

    	for ( ; i < 4; i += 2 ) {

    		// Both box models exclude margin
    		if ( box === "margin" ) {
    			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
    		}

    		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
    		if ( !isBorderBox ) {

    			// Add padding
    			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

    			// For "border" or "margin", add border
    			if ( box !== "padding" ) {
    				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

    			// But still keep track of it otherwise
    			} else {
    				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    			}

    		// If we get here with a border-box (content + padding + border), we're seeking "content" or
    		// "padding" or "margin"
    		} else {

    			// For "content", subtract padding
    			if ( box === "content" ) {
    				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
    			}

    			// For "content" or "padding", subtract border
    			if ( box !== "margin" ) {
    				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    			}
    		}
    	}

    	// Account for positive content-box scroll gutter when requested by providing computedVal
    	if ( !isBorderBox && computedVal >= 0 ) {

    		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
    		// Assuming integer scroll gutter, subtract the rest and round down
    		delta += Math.max( 0, Math.ceil(
    			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
    			computedVal -
    			delta -
    			extra -
    			0.5

    		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
    		// Use an explicit zero to avoid NaN (gh-3964)
    		) ) || 0;
    	}

    	return delta;
    }

    function getWidthOrHeight( elem, dimension, extra ) {

    	// Start with computed style
    	var styles = getStyles( elem ),

    		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
    		// Fake content-box until we know it's needed to know the true value.
    		boxSizingNeeded = !support.boxSizingReliable() || extra,
    		isBorderBox = boxSizingNeeded &&
    			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    		valueIsBorderBox = isBorderBox,

    		val = curCSS( elem, dimension, styles ),
    		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

    	// Support: Firefox <=54
    	// Return a confounding non-pixel value or feign ignorance, as appropriate.
    	if ( rnumnonpx.test( val ) ) {
    		if ( !extra ) {
    			return val;
    		}
    		val = "auto";
    	}


    	// Support: IE 9 - 11 only
    	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
    	// In those cases, the computed value can be trusted to be border-box.
    	if ( ( !support.boxSizingReliable() && isBorderBox ||

    		// Support: IE 10 - 11+, Edge 15 - 18+
    		// IE/Edge misreport `getComputedStyle` of table rows with width/height
    		// set in CSS while `offset*` properties report correct values.
    		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
    		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

    		// Fall back to offsetWidth/offsetHeight when value is "auto"
    		// This happens for inline elements with no explicit setting (gh-3571)
    		val === "auto" ||

    		// Support: Android <=4.1 - 4.3 only
    		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
    		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

    		// Make sure the element is visible & connected
    		elem.getClientRects().length ) {

    		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

    		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
    		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
    		// retrieved value as a content box dimension.
    		valueIsBorderBox = offsetProp in elem;
    		if ( valueIsBorderBox ) {
    			val = elem[ offsetProp ];
    		}
    	}

    	// Normalize "" and auto
    	val = parseFloat( val ) || 0;

    	// Adjust for the element's box model
    	return ( val +
    		boxModelAdjustment(
    			elem,
    			dimension,
    			extra || ( isBorderBox ? "border" : "content" ),
    			valueIsBorderBox,
    			styles,

    			// Provide the current computed size to request scroll gutter calculation (gh-3589)
    			val
    		)
    	) + "px";
    }

    jQuery.extend( {

    	// Add in style property hooks for overriding the default
    	// behavior of getting and setting a style property
    	cssHooks: {
    		opacity: {
    			get: function( elem, computed ) {
    				if ( computed ) {

    					// We should always get a number back from opacity
    					var ret = curCSS( elem, "opacity" );
    					return ret === "" ? "1" : ret;
    				}
    			}
    		}
    	},

    	// Don't automatically add "px" to these possibly-unitless properties
    	cssNumber: {
    		"animationIterationCount": true,
    		"columnCount": true,
    		"fillOpacity": true,
    		"flexGrow": true,
    		"flexShrink": true,
    		"fontWeight": true,
    		"gridArea": true,
    		"gridColumn": true,
    		"gridColumnEnd": true,
    		"gridColumnStart": true,
    		"gridRow": true,
    		"gridRowEnd": true,
    		"gridRowStart": true,
    		"lineHeight": true,
    		"opacity": true,
    		"order": true,
    		"orphans": true,
    		"widows": true,
    		"zIndex": true,
    		"zoom": true
    	},

    	// Add in properties whose names you wish to fix before
    	// setting or getting the value
    	cssProps: {},

    	// Get and set the style property on a DOM Node
    	style: function( elem, name, value, extra ) {

    		// Don't set styles on text and comment nodes
    		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
    			return;
    		}

    		// Make sure that we're working with the right name
    		var ret, type, hooks,
    			origName = camelCase( name ),
    			isCustomProp = rcustomProp.test( name ),
    			style = elem.style;

    		// Make sure that we're working with the right name. We don't
    		// want to query the value if it is a CSS custom property
    		// since they are user-defined.
    		if ( !isCustomProp ) {
    			name = finalPropName( origName );
    		}

    		// Gets hook for the prefixed version, then unprefixed version
    		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    		// Check if we're setting a value
    		if ( value !== undefined ) {
    			type = typeof value;

    			// Convert "+=" or "-=" to relative numbers (#7345)
    			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
    				value = adjustCSS( elem, name, ret );

    				// Fixes bug #9237
    				type = "number";
    			}

    			// Make sure that null and NaN values aren't set (#7116)
    			if ( value == null || value !== value ) {
    				return;
    			}

    			// If a number was passed in, add the unit (except for certain CSS properties)
    			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
    			// "px" to a few hardcoded values.
    			if ( type === "number" && !isCustomProp ) {
    				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
    			}

    			// background-* props affect original clone's values
    			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
    				style[ name ] = "inherit";
    			}

    			// If a hook was provided, use that value, otherwise just set the specified value
    			if ( !hooks || !( "set" in hooks ) ||
    				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

    				if ( isCustomProp ) {
    					style.setProperty( name, value );
    				} else {
    					style[ name ] = value;
    				}
    			}

    		} else {

    			// If a hook was provided get the non-computed value from there
    			if ( hooks && "get" in hooks &&
    				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

    				return ret;
    			}

    			// Otherwise just get the value from the style object
    			return style[ name ];
    		}
    	},

    	css: function( elem, name, extra, styles ) {
    		var val, num, hooks,
    			origName = camelCase( name ),
    			isCustomProp = rcustomProp.test( name );

    		// Make sure that we're working with the right name. We don't
    		// want to modify the value if it is a CSS custom property
    		// since they are user-defined.
    		if ( !isCustomProp ) {
    			name = finalPropName( origName );
    		}

    		// Try prefixed name followed by the unprefixed name
    		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    		// If a hook was provided get the computed value from there
    		if ( hooks && "get" in hooks ) {
    			val = hooks.get( elem, true, extra );
    		}

    		// Otherwise, if a way to get the computed value exists, use that
    		if ( val === undefined ) {
    			val = curCSS( elem, name, styles );
    		}

    		// Convert "normal" to computed value
    		if ( val === "normal" && name in cssNormalTransform ) {
    			val = cssNormalTransform[ name ];
    		}

    		// Make numeric if forced or a qualifier was provided and val looks numeric
    		if ( extra === "" || extra ) {
    			num = parseFloat( val );
    			return extra === true || isFinite( num ) ? num || 0 : val;
    		}

    		return val;
    	}
    } );

    jQuery.each( [ "height", "width" ], function( _i, dimension ) {
    	jQuery.cssHooks[ dimension ] = {
    		get: function( elem, computed, extra ) {
    			if ( computed ) {

    				// Certain elements can have dimension info if we invisibly show them
    				// but it must have a current display style that would benefit
    				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

    					// Support: Safari 8+
    					// Table columns in Safari have non-zero offsetWidth & zero
    					// getBoundingClientRect().width unless display is changed.
    					// Support: IE <=11 only
    					// Running getBoundingClientRect on a disconnected node
    					// in IE throws an error.
    					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
    					swap( elem, cssShow, function() {
    						return getWidthOrHeight( elem, dimension, extra );
    					} ) :
    					getWidthOrHeight( elem, dimension, extra );
    			}
    		},

    		set: function( elem, value, extra ) {
    			var matches,
    				styles = getStyles( elem ),

    				// Only read styles.position if the test has a chance to fail
    				// to avoid forcing a reflow.
    				scrollboxSizeBuggy = !support.scrollboxSize() &&
    					styles.position === "absolute",

    				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
    				boxSizingNeeded = scrollboxSizeBuggy || extra,
    				isBorderBox = boxSizingNeeded &&
    					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    				subtract = extra ?
    					boxModelAdjustment(
    						elem,
    						dimension,
    						extra,
    						isBorderBox,
    						styles
    					) :
    					0;

    			// Account for unreliable border-box dimensions by comparing offset* to computed and
    			// faking a content-box to get border and padding (gh-3699)
    			if ( isBorderBox && scrollboxSizeBuggy ) {
    				subtract -= Math.ceil(
    					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
    					parseFloat( styles[ dimension ] ) -
    					boxModelAdjustment( elem, dimension, "border", false, styles ) -
    					0.5
    				);
    			}

    			// Convert to pixels if value adjustment is needed
    			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
    				( matches[ 3 ] || "px" ) !== "px" ) {

    				elem.style[ dimension ] = value;
    				value = jQuery.css( elem, dimension );
    			}

    			return setPositiveNumber( elem, value, subtract );
    		}
    	};
    } );

    jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
    	function( elem, computed ) {
    		if ( computed ) {
    			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
    				elem.getBoundingClientRect().left -
    					swap( elem, { marginLeft: 0 }, function() {
    						return elem.getBoundingClientRect().left;
    					} )
    			) + "px";
    		}
    	}
    );

    // These hooks are used by animate to expand properties
    jQuery.each( {
    	margin: "",
    	padding: "",
    	border: "Width"
    }, function( prefix, suffix ) {
    	jQuery.cssHooks[ prefix + suffix ] = {
    		expand: function( value ) {
    			var i = 0,
    				expanded = {},

    				// Assumes a single number if not a string
    				parts = typeof value === "string" ? value.split( " " ) : [ value ];

    			for ( ; i < 4; i++ ) {
    				expanded[ prefix + cssExpand[ i ] + suffix ] =
    					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
    			}

    			return expanded;
    		}
    	};

    	if ( prefix !== "margin" ) {
    		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
    	}
    } );

    jQuery.fn.extend( {
    	css: function( name, value ) {
    		return access( this, function( elem, name, value ) {
    			var styles, len,
    				map = {},
    				i = 0;

    			if ( Array.isArray( name ) ) {
    				styles = getStyles( elem );
    				len = name.length;

    				for ( ; i < len; i++ ) {
    					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
    				}

    				return map;
    			}

    			return value !== undefined ?
    				jQuery.style( elem, name, value ) :
    				jQuery.css( elem, name );
    		}, name, value, arguments.length > 1 );
    	}
    } );


    function Tween( elem, options, prop, end, easing ) {
    	return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
    	constructor: Tween,
    	init: function( elem, options, prop, end, easing, unit ) {
    		this.elem = elem;
    		this.prop = prop;
    		this.easing = easing || jQuery.easing._default;
    		this.options = options;
    		this.start = this.now = this.cur();
    		this.end = end;
    		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
    	},
    	cur: function() {
    		var hooks = Tween.propHooks[ this.prop ];

    		return hooks && hooks.get ?
    			hooks.get( this ) :
    			Tween.propHooks._default.get( this );
    	},
    	run: function( percent ) {
    		var eased,
    			hooks = Tween.propHooks[ this.prop ];

    		if ( this.options.duration ) {
    			this.pos = eased = jQuery.easing[ this.easing ](
    				percent, this.options.duration * percent, 0, 1, this.options.duration
    			);
    		} else {
    			this.pos = eased = percent;
    		}
    		this.now = ( this.end - this.start ) * eased + this.start;

    		if ( this.options.step ) {
    			this.options.step.call( this.elem, this.now, this );
    		}

    		if ( hooks && hooks.set ) {
    			hooks.set( this );
    		} else {
    			Tween.propHooks._default.set( this );
    		}
    		return this;
    	}
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
    	_default: {
    		get: function( tween ) {
    			var result;

    			// Use a property on the element directly when it is not a DOM element,
    			// or when there is no matching style property that exists.
    			if ( tween.elem.nodeType !== 1 ||
    				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
    				return tween.elem[ tween.prop ];
    			}

    			// Passing an empty string as a 3rd parameter to .css will automatically
    			// attempt a parseFloat and fallback to a string if the parse fails.
    			// Simple values such as "10px" are parsed to Float;
    			// complex values such as "rotate(1rad)" are returned as-is.
    			result = jQuery.css( tween.elem, tween.prop, "" );

    			// Empty strings, null, undefined and "auto" are converted to 0.
    			return !result || result === "auto" ? 0 : result;
    		},
    		set: function( tween ) {

    			// Use step hook for back compat.
    			// Use cssHook if its there.
    			// Use .style if available and use plain properties where available.
    			if ( jQuery.fx.step[ tween.prop ] ) {
    				jQuery.fx.step[ tween.prop ]( tween );
    			} else if ( tween.elem.nodeType === 1 && (
    				jQuery.cssHooks[ tween.prop ] ||
    					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
    				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
    			} else {
    				tween.elem[ tween.prop ] = tween.now;
    			}
    		}
    	}
    };

    // Support: IE <=9 only
    // Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    	set: function( tween ) {
    		if ( tween.elem.nodeType && tween.elem.parentNode ) {
    			tween.elem[ tween.prop ] = tween.now;
    		}
    	}
    };

    jQuery.easing = {
    	linear: function( p ) {
    		return p;
    	},
    	swing: function( p ) {
    		return 0.5 - Math.cos( p * Math.PI ) / 2;
    	},
    	_default: "swing"
    };

    jQuery.fx = Tween.prototype.init;

    // Back compat <1.8 extension point
    jQuery.fx.step = {};




    var
    	fxNow, inProgress,
    	rfxtypes = /^(?:toggle|show|hide)$/,
    	rrun = /queueHooks$/;

    function schedule() {
    	if ( inProgress ) {
    		if ( document.hidden === false && window.requestAnimationFrame ) {
    			window.requestAnimationFrame( schedule );
    		} else {
    			window.setTimeout( schedule, jQuery.fx.interval );
    		}

    		jQuery.fx.tick();
    	}
    }

    // Animations created synchronously will run synchronously
    function createFxNow() {
    	window.setTimeout( function() {
    		fxNow = undefined;
    	} );
    	return ( fxNow = Date.now() );
    }

    // Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
    	var which,
    		i = 0,
    		attrs = { height: type };

    	// If we include width, step value is 1 to do all cssExpand values,
    	// otherwise step value is 2 to skip over Left and Right
    	includeWidth = includeWidth ? 1 : 0;
    	for ( ; i < 4; i += 2 - includeWidth ) {
    		which = cssExpand[ i ];
    		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
    	}

    	if ( includeWidth ) {
    		attrs.opacity = attrs.width = type;
    	}

    	return attrs;
    }

    function createTween( value, prop, animation ) {
    	var tween,
    		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
    		index = 0,
    		length = collection.length;
    	for ( ; index < length; index++ ) {
    		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

    			// We're done with this property
    			return tween;
    		}
    	}
    }

    function defaultPrefilter( elem, props, opts ) {
    	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
    		isBox = "width" in props || "height" in props,
    		anim = this,
    		orig = {},
    		style = elem.style,
    		hidden = elem.nodeType && isHiddenWithinTree( elem ),
    		dataShow = dataPriv.get( elem, "fxshow" );

    	// Queue-skipping animations hijack the fx hooks
    	if ( !opts.queue ) {
    		hooks = jQuery._queueHooks( elem, "fx" );
    		if ( hooks.unqueued == null ) {
    			hooks.unqueued = 0;
    			oldfire = hooks.empty.fire;
    			hooks.empty.fire = function() {
    				if ( !hooks.unqueued ) {
    					oldfire();
    				}
    			};
    		}
    		hooks.unqueued++;

    		anim.always( function() {

    			// Ensure the complete handler is called before this completes
    			anim.always( function() {
    				hooks.unqueued--;
    				if ( !jQuery.queue( elem, "fx" ).length ) {
    					hooks.empty.fire();
    				}
    			} );
    		} );
    	}

    	// Detect show/hide animations
    	for ( prop in props ) {
    		value = props[ prop ];
    		if ( rfxtypes.test( value ) ) {
    			delete props[ prop ];
    			toggle = toggle || value === "toggle";
    			if ( value === ( hidden ? "hide" : "show" ) ) {

    				// Pretend to be hidden if this is a "show" and
    				// there is still data from a stopped show/hide
    				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
    					hidden = true;

    				// Ignore all other no-op show/hide data
    				} else {
    					continue;
    				}
    			}
    			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
    		}
    	}

    	// Bail out if this is a no-op like .hide().hide()
    	propTween = !jQuery.isEmptyObject( props );
    	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
    		return;
    	}

    	// Restrict "overflow" and "display" styles during box animations
    	if ( isBox && elem.nodeType === 1 ) {

    		// Support: IE <=9 - 11, Edge 12 - 15
    		// Record all 3 overflow attributes because IE does not infer the shorthand
    		// from identically-valued overflowX and overflowY and Edge just mirrors
    		// the overflowX value there.
    		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

    		// Identify a display type, preferring old show/hide data over the CSS cascade
    		restoreDisplay = dataShow && dataShow.display;
    		if ( restoreDisplay == null ) {
    			restoreDisplay = dataPriv.get( elem, "display" );
    		}
    		display = jQuery.css( elem, "display" );
    		if ( display === "none" ) {
    			if ( restoreDisplay ) {
    				display = restoreDisplay;
    			} else {

    				// Get nonempty value(s) by temporarily forcing visibility
    				showHide( [ elem ], true );
    				restoreDisplay = elem.style.display || restoreDisplay;
    				display = jQuery.css( elem, "display" );
    				showHide( [ elem ] );
    			}
    		}

    		// Animate inline elements as inline-block
    		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
    			if ( jQuery.css( elem, "float" ) === "none" ) {

    				// Restore the original display value at the end of pure show/hide animations
    				if ( !propTween ) {
    					anim.done( function() {
    						style.display = restoreDisplay;
    					} );
    					if ( restoreDisplay == null ) {
    						display = style.display;
    						restoreDisplay = display === "none" ? "" : display;
    					}
    				}
    				style.display = "inline-block";
    			}
    		}
    	}

    	if ( opts.overflow ) {
    		style.overflow = "hidden";
    		anim.always( function() {
    			style.overflow = opts.overflow[ 0 ];
    			style.overflowX = opts.overflow[ 1 ];
    			style.overflowY = opts.overflow[ 2 ];
    		} );
    	}

    	// Implement show/hide animations
    	propTween = false;
    	for ( prop in orig ) {

    		// General show/hide setup for this element animation
    		if ( !propTween ) {
    			if ( dataShow ) {
    				if ( "hidden" in dataShow ) {
    					hidden = dataShow.hidden;
    				}
    			} else {
    				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
    			}

    			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
    			if ( toggle ) {
    				dataShow.hidden = !hidden;
    			}

    			// Show elements before animating them
    			if ( hidden ) {
    				showHide( [ elem ], true );
    			}

    			/* eslint-disable no-loop-func */

    			anim.done( function() {

    				/* eslint-enable no-loop-func */

    				// The final step of a "hide" animation is actually hiding the element
    				if ( !hidden ) {
    					showHide( [ elem ] );
    				}
    				dataPriv.remove( elem, "fxshow" );
    				for ( prop in orig ) {
    					jQuery.style( elem, prop, orig[ prop ] );
    				}
    			} );
    		}

    		// Per-property setup
    		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
    		if ( !( prop in dataShow ) ) {
    			dataShow[ prop ] = propTween.start;
    			if ( hidden ) {
    				propTween.end = propTween.start;
    				propTween.start = 0;
    			}
    		}
    	}
    }

    function propFilter( props, specialEasing ) {
    	var index, name, easing, value, hooks;

    	// camelCase, specialEasing and expand cssHook pass
    	for ( index in props ) {
    		name = camelCase( index );
    		easing = specialEasing[ name ];
    		value = props[ index ];
    		if ( Array.isArray( value ) ) {
    			easing = value[ 1 ];
    			value = props[ index ] = value[ 0 ];
    		}

    		if ( index !== name ) {
    			props[ name ] = value;
    			delete props[ index ];
    		}

    		hooks = jQuery.cssHooks[ name ];
    		if ( hooks && "expand" in hooks ) {
    			value = hooks.expand( value );
    			delete props[ name ];

    			// Not quite $.extend, this won't overwrite existing keys.
    			// Reusing 'index' because we have the correct "name"
    			for ( index in value ) {
    				if ( !( index in props ) ) {
    					props[ index ] = value[ index ];
    					specialEasing[ index ] = easing;
    				}
    			}
    		} else {
    			specialEasing[ name ] = easing;
    		}
    	}
    }

    function Animation( elem, properties, options ) {
    	var result,
    		stopped,
    		index = 0,
    		length = Animation.prefilters.length,
    		deferred = jQuery.Deferred().always( function() {

    			// Don't match elem in the :animated selector
    			delete tick.elem;
    		} ),
    		tick = function() {
    			if ( stopped ) {
    				return false;
    			}
    			var currentTime = fxNow || createFxNow(),
    				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

    				// Support: Android 2.3 only
    				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
    				temp = remaining / animation.duration || 0,
    				percent = 1 - temp,
    				index = 0,
    				length = animation.tweens.length;

    			for ( ; index < length; index++ ) {
    				animation.tweens[ index ].run( percent );
    			}

    			deferred.notifyWith( elem, [ animation, percent, remaining ] );

    			// If there's more to do, yield
    			if ( percent < 1 && length ) {
    				return remaining;
    			}

    			// If this was an empty animation, synthesize a final progress notification
    			if ( !length ) {
    				deferred.notifyWith( elem, [ animation, 1, 0 ] );
    			}

    			// Resolve the animation and report its conclusion
    			deferred.resolveWith( elem, [ animation ] );
    			return false;
    		},
    		animation = deferred.promise( {
    			elem: elem,
    			props: jQuery.extend( {}, properties ),
    			opts: jQuery.extend( true, {
    				specialEasing: {},
    				easing: jQuery.easing._default
    			}, options ),
    			originalProperties: properties,
    			originalOptions: options,
    			startTime: fxNow || createFxNow(),
    			duration: options.duration,
    			tweens: [],
    			createTween: function( prop, end ) {
    				var tween = jQuery.Tween( elem, animation.opts, prop, end,
    					animation.opts.specialEasing[ prop ] || animation.opts.easing );
    				animation.tweens.push( tween );
    				return tween;
    			},
    			stop: function( gotoEnd ) {
    				var index = 0,

    					// If we are going to the end, we want to run all the tweens
    					// otherwise we skip this part
    					length = gotoEnd ? animation.tweens.length : 0;
    				if ( stopped ) {
    					return this;
    				}
    				stopped = true;
    				for ( ; index < length; index++ ) {
    					animation.tweens[ index ].run( 1 );
    				}

    				// Resolve when we played the last frame; otherwise, reject
    				if ( gotoEnd ) {
    					deferred.notifyWith( elem, [ animation, 1, 0 ] );
    					deferred.resolveWith( elem, [ animation, gotoEnd ] );
    				} else {
    					deferred.rejectWith( elem, [ animation, gotoEnd ] );
    				}
    				return this;
    			}
    		} ),
    		props = animation.props;

    	propFilter( props, animation.opts.specialEasing );

    	for ( ; index < length; index++ ) {
    		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
    		if ( result ) {
    			if ( isFunction( result.stop ) ) {
    				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
    					result.stop.bind( result );
    			}
    			return result;
    		}
    	}

    	jQuery.map( props, createTween, animation );

    	if ( isFunction( animation.opts.start ) ) {
    		animation.opts.start.call( elem, animation );
    	}

    	// Attach callbacks from options
    	animation
    		.progress( animation.opts.progress )
    		.done( animation.opts.done, animation.opts.complete )
    		.fail( animation.opts.fail )
    		.always( animation.opts.always );

    	jQuery.fx.timer(
    		jQuery.extend( tick, {
    			elem: elem,
    			anim: animation,
    			queue: animation.opts.queue
    		} )
    	);

    	return animation;
    }

    jQuery.Animation = jQuery.extend( Animation, {

    	tweeners: {
    		"*": [ function( prop, value ) {
    			var tween = this.createTween( prop, value );
    			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
    			return tween;
    		} ]
    	},

    	tweener: function( props, callback ) {
    		if ( isFunction( props ) ) {
    			callback = props;
    			props = [ "*" ];
    		} else {
    			props = props.match( rnothtmlwhite );
    		}

    		var prop,
    			index = 0,
    			length = props.length;

    		for ( ; index < length; index++ ) {
    			prop = props[ index ];
    			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
    			Animation.tweeners[ prop ].unshift( callback );
    		}
    	},

    	prefilters: [ defaultPrefilter ],

    	prefilter: function( callback, prepend ) {
    		if ( prepend ) {
    			Animation.prefilters.unshift( callback );
    		} else {
    			Animation.prefilters.push( callback );
    		}
    	}
    } );

    jQuery.speed = function( speed, easing, fn ) {
    	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    		complete: fn || !fn && easing ||
    			isFunction( speed ) && speed,
    		duration: speed,
    		easing: fn && easing || easing && !isFunction( easing ) && easing
    	};

    	// Go to the end state if fx are off
    	if ( jQuery.fx.off ) {
    		opt.duration = 0;

    	} else {
    		if ( typeof opt.duration !== "number" ) {
    			if ( opt.duration in jQuery.fx.speeds ) {
    				opt.duration = jQuery.fx.speeds[ opt.duration ];

    			} else {
    				opt.duration = jQuery.fx.speeds._default;
    			}
    		}
    	}

    	// Normalize opt.queue - true/undefined/null -> "fx"
    	if ( opt.queue == null || opt.queue === true ) {
    		opt.queue = "fx";
    	}

    	// Queueing
    	opt.old = opt.complete;

    	opt.complete = function() {
    		if ( isFunction( opt.old ) ) {
    			opt.old.call( this );
    		}

    		if ( opt.queue ) {
    			jQuery.dequeue( this, opt.queue );
    		}
    	};

    	return opt;
    };

    jQuery.fn.extend( {
    	fadeTo: function( speed, to, easing, callback ) {

    		// Show any hidden elements after setting opacity to 0
    		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

    			// Animate to the value specified
    			.end().animate( { opacity: to }, speed, easing, callback );
    	},
    	animate: function( prop, speed, easing, callback ) {
    		var empty = jQuery.isEmptyObject( prop ),
    			optall = jQuery.speed( speed, easing, callback ),
    			doAnimation = function() {

    				// Operate on a copy of prop so per-property easing won't be lost
    				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

    				// Empty animations, or finishing resolves immediately
    				if ( empty || dataPriv.get( this, "finish" ) ) {
    					anim.stop( true );
    				}
    			};

    		doAnimation.finish = doAnimation;

    		return empty || optall.queue === false ?
    			this.each( doAnimation ) :
    			this.queue( optall.queue, doAnimation );
    	},
    	stop: function( type, clearQueue, gotoEnd ) {
    		var stopQueue = function( hooks ) {
    			var stop = hooks.stop;
    			delete hooks.stop;
    			stop( gotoEnd );
    		};

    		if ( typeof type !== "string" ) {
    			gotoEnd = clearQueue;
    			clearQueue = type;
    			type = undefined;
    		}
    		if ( clearQueue ) {
    			this.queue( type || "fx", [] );
    		}

    		return this.each( function() {
    			var dequeue = true,
    				index = type != null && type + "queueHooks",
    				timers = jQuery.timers,
    				data = dataPriv.get( this );

    			if ( index ) {
    				if ( data[ index ] && data[ index ].stop ) {
    					stopQueue( data[ index ] );
    				}
    			} else {
    				for ( index in data ) {
    					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
    						stopQueue( data[ index ] );
    					}
    				}
    			}

    			for ( index = timers.length; index--; ) {
    				if ( timers[ index ].elem === this &&
    					( type == null || timers[ index ].queue === type ) ) {

    					timers[ index ].anim.stop( gotoEnd );
    					dequeue = false;
    					timers.splice( index, 1 );
    				}
    			}

    			// Start the next in the queue if the last step wasn't forced.
    			// Timers currently will call their complete callbacks, which
    			// will dequeue but only if they were gotoEnd.
    			if ( dequeue || !gotoEnd ) {
    				jQuery.dequeue( this, type );
    			}
    		} );
    	},
    	finish: function( type ) {
    		if ( type !== false ) {
    			type = type || "fx";
    		}
    		return this.each( function() {
    			var index,
    				data = dataPriv.get( this ),
    				queue = data[ type + "queue" ],
    				hooks = data[ type + "queueHooks" ],
    				timers = jQuery.timers,
    				length = queue ? queue.length : 0;

    			// Enable finishing flag on private data
    			data.finish = true;

    			// Empty the queue first
    			jQuery.queue( this, type, [] );

    			if ( hooks && hooks.stop ) {
    				hooks.stop.call( this, true );
    			}

    			// Look for any active animations, and finish them
    			for ( index = timers.length; index--; ) {
    				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
    					timers[ index ].anim.stop( true );
    					timers.splice( index, 1 );
    				}
    			}

    			// Look for any animations in the old queue and finish them
    			for ( index = 0; index < length; index++ ) {
    				if ( queue[ index ] && queue[ index ].finish ) {
    					queue[ index ].finish.call( this );
    				}
    			}

    			// Turn off finishing flag
    			delete data.finish;
    		} );
    	}
    } );

    jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
    	var cssFn = jQuery.fn[ name ];
    	jQuery.fn[ name ] = function( speed, easing, callback ) {
    		return speed == null || typeof speed === "boolean" ?
    			cssFn.apply( this, arguments ) :
    			this.animate( genFx( name, true ), speed, easing, callback );
    	};
    } );

    // Generate shortcuts for custom animations
    jQuery.each( {
    	slideDown: genFx( "show" ),
    	slideUp: genFx( "hide" ),
    	slideToggle: genFx( "toggle" ),
    	fadeIn: { opacity: "show" },
    	fadeOut: { opacity: "hide" },
    	fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
    	jQuery.fn[ name ] = function( speed, easing, callback ) {
    		return this.animate( props, speed, easing, callback );
    	};
    } );

    jQuery.timers = [];
    jQuery.fx.tick = function() {
    	var timer,
    		i = 0,
    		timers = jQuery.timers;

    	fxNow = Date.now();

    	for ( ; i < timers.length; i++ ) {
    		timer = timers[ i ];

    		// Run the timer and safely remove it when done (allowing for external removal)
    		if ( !timer() && timers[ i ] === timer ) {
    			timers.splice( i--, 1 );
    		}
    	}

    	if ( !timers.length ) {
    		jQuery.fx.stop();
    	}
    	fxNow = undefined;
    };

    jQuery.fx.timer = function( timer ) {
    	jQuery.timers.push( timer );
    	jQuery.fx.start();
    };

    jQuery.fx.interval = 13;
    jQuery.fx.start = function() {
    	if ( inProgress ) {
    		return;
    	}

    	inProgress = true;
    	schedule();
    };

    jQuery.fx.stop = function() {
    	inProgress = null;
    };

    jQuery.fx.speeds = {
    	slow: 600,
    	fast: 200,

    	// Default speed
    	_default: 400
    };


    // Based off of the plugin by Clint Helfers, with permission.
    // https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function( time, type ) {
    	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    	type = type || "fx";

    	return this.queue( type, function( next, hooks ) {
    		var timeout = window.setTimeout( next, time );
    		hooks.stop = function() {
    			window.clearTimeout( timeout );
    		};
    	} );
    };


    ( function() {
    	var input = document.createElement( "input" ),
    		select = document.createElement( "select" ),
    		opt = select.appendChild( document.createElement( "option" ) );

    	input.type = "checkbox";

    	// Support: Android <=4.3 only
    	// Default value for a checkbox should be "on"
    	support.checkOn = input.value !== "";

    	// Support: IE <=11 only
    	// Must access selectedIndex to make default options select
    	support.optSelected = opt.selected;

    	// Support: IE <=11 only
    	// An input loses its value after becoming a radio
    	input = document.createElement( "input" );
    	input.value = "t";
    	input.type = "radio";
    	support.radioValue = input.value === "t";
    } )();


    var boolHook,
    	attrHandle = jQuery.expr.attrHandle;

    jQuery.fn.extend( {
    	attr: function( name, value ) {
    		return access( this, jQuery.attr, name, value, arguments.length > 1 );
    	},

    	removeAttr: function( name ) {
    		return this.each( function() {
    			jQuery.removeAttr( this, name );
    		} );
    	}
    } );

    jQuery.extend( {
    	attr: function( elem, name, value ) {
    		var ret, hooks,
    			nType = elem.nodeType;

    		// Don't get/set attributes on text, comment and attribute nodes
    		if ( nType === 3 || nType === 8 || nType === 2 ) {
    			return;
    		}

    		// Fallback to prop when attributes are not supported
    		if ( typeof elem.getAttribute === "undefined" ) {
    			return jQuery.prop( elem, name, value );
    		}

    		// Attribute hooks are determined by the lowercase version
    		// Grab necessary hook if one is defined
    		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
    			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
    				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
    		}

    		if ( value !== undefined ) {
    			if ( value === null ) {
    				jQuery.removeAttr( elem, name );
    				return;
    			}

    			if ( hooks && "set" in hooks &&
    				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    				return ret;
    			}

    			elem.setAttribute( name, value + "" );
    			return value;
    		}

    		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    			return ret;
    		}

    		ret = jQuery.find.attr( elem, name );

    		// Non-existent attributes return null, we normalize to undefined
    		return ret == null ? undefined : ret;
    	},

    	attrHooks: {
    		type: {
    			set: function( elem, value ) {
    				if ( !support.radioValue && value === "radio" &&
    					nodeName( elem, "input" ) ) {
    					var val = elem.value;
    					elem.setAttribute( "type", value );
    					if ( val ) {
    						elem.value = val;
    					}
    					return value;
    				}
    			}
    		}
    	},

    	removeAttr: function( elem, value ) {
    		var name,
    			i = 0,

    			// Attribute names can contain non-HTML whitespace characters
    			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
    			attrNames = value && value.match( rnothtmlwhite );

    		if ( attrNames && elem.nodeType === 1 ) {
    			while ( ( name = attrNames[ i++ ] ) ) {
    				elem.removeAttribute( name );
    			}
    		}
    	}
    } );

    // Hooks for boolean attributes
    boolHook = {
    	set: function( elem, value, name ) {
    		if ( value === false ) {

    			// Remove boolean attributes when set to false
    			jQuery.removeAttr( elem, name );
    		} else {
    			elem.setAttribute( name, name );
    		}
    		return name;
    	}
    };

    jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
    	var getter = attrHandle[ name ] || jQuery.find.attr;

    	attrHandle[ name ] = function( elem, name, isXML ) {
    		var ret, handle,
    			lowercaseName = name.toLowerCase();

    		if ( !isXML ) {

    			// Avoid an infinite loop by temporarily removing this function from the getter
    			handle = attrHandle[ lowercaseName ];
    			attrHandle[ lowercaseName ] = ret;
    			ret = getter( elem, name, isXML ) != null ?
    				lowercaseName :
    				null;
    			attrHandle[ lowercaseName ] = handle;
    		}
    		return ret;
    	};
    } );




    var rfocusable = /^(?:input|select|textarea|button)$/i,
    	rclickable = /^(?:a|area)$/i;

    jQuery.fn.extend( {
    	prop: function( name, value ) {
    		return access( this, jQuery.prop, name, value, arguments.length > 1 );
    	},

    	removeProp: function( name ) {
    		return this.each( function() {
    			delete this[ jQuery.propFix[ name ] || name ];
    		} );
    	}
    } );

    jQuery.extend( {
    	prop: function( elem, name, value ) {
    		var ret, hooks,
    			nType = elem.nodeType;

    		// Don't get/set properties on text, comment and attribute nodes
    		if ( nType === 3 || nType === 8 || nType === 2 ) {
    			return;
    		}

    		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

    			// Fix name and attach hooks
    			name = jQuery.propFix[ name ] || name;
    			hooks = jQuery.propHooks[ name ];
    		}

    		if ( value !== undefined ) {
    			if ( hooks && "set" in hooks &&
    				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    				return ret;
    			}

    			return ( elem[ name ] = value );
    		}

    		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    			return ret;
    		}

    		return elem[ name ];
    	},

    	propHooks: {
    		tabIndex: {
    			get: function( elem ) {

    				// Support: IE <=9 - 11 only
    				// elem.tabIndex doesn't always return the
    				// correct value when it hasn't been explicitly set
    				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
    				// Use proper attribute retrieval(#12072)
    				var tabindex = jQuery.find.attr( elem, "tabindex" );

    				if ( tabindex ) {
    					return parseInt( tabindex, 10 );
    				}

    				if (
    					rfocusable.test( elem.nodeName ) ||
    					rclickable.test( elem.nodeName ) &&
    					elem.href
    				) {
    					return 0;
    				}

    				return -1;
    			}
    		}
    	},

    	propFix: {
    		"for": "htmlFor",
    		"class": "className"
    	}
    } );

    // Support: IE <=11 only
    // Accessing the selectedIndex property
    // forces the browser to respect setting selected
    // on the option
    // The getter ensures a default option is selected
    // when in an optgroup
    // eslint rule "no-unused-expressions" is disabled for this code
    // since it considers such accessions noop
    if ( !support.optSelected ) {
    	jQuery.propHooks.selected = {
    		get: function( elem ) {

    			/* eslint no-unused-expressions: "off" */

    			var parent = elem.parentNode;
    			if ( parent && parent.parentNode ) {
    				parent.parentNode.selectedIndex;
    			}
    			return null;
    		},
    		set: function( elem ) {

    			/* eslint no-unused-expressions: "off" */

    			var parent = elem.parentNode;
    			if ( parent ) {
    				parent.selectedIndex;

    				if ( parent.parentNode ) {
    					parent.parentNode.selectedIndex;
    				}
    			}
    		}
    	};
    }

    jQuery.each( [
    	"tabIndex",
    	"readOnly",
    	"maxLength",
    	"cellSpacing",
    	"cellPadding",
    	"rowSpan",
    	"colSpan",
    	"useMap",
    	"frameBorder",
    	"contentEditable"
    ], function() {
    	jQuery.propFix[ this.toLowerCase() ] = this;
    } );




    	// Strip and collapse whitespace according to HTML spec
    	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
    	function stripAndCollapse( value ) {
    		var tokens = value.match( rnothtmlwhite ) || [];
    		return tokens.join( " " );
    	}


    function getClass( elem ) {
    	return elem.getAttribute && elem.getAttribute( "class" ) || "";
    }

    function classesToArray( value ) {
    	if ( Array.isArray( value ) ) {
    		return value;
    	}
    	if ( typeof value === "string" ) {
    		return value.match( rnothtmlwhite ) || [];
    	}
    	return [];
    }

    jQuery.fn.extend( {
    	addClass: function( value ) {
    		var classes, elem, cur, curValue, clazz, j, finalValue,
    			i = 0;

    		if ( isFunction( value ) ) {
    			return this.each( function( j ) {
    				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
    			} );
    		}

    		classes = classesToArray( value );

    		if ( classes.length ) {
    			while ( ( elem = this[ i++ ] ) ) {
    				curValue = getClass( elem );
    				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

    				if ( cur ) {
    					j = 0;
    					while ( ( clazz = classes[ j++ ] ) ) {
    						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
    							cur += clazz + " ";
    						}
    					}

    					// Only assign if different to avoid unneeded rendering.
    					finalValue = stripAndCollapse( cur );
    					if ( curValue !== finalValue ) {
    						elem.setAttribute( "class", finalValue );
    					}
    				}
    			}
    		}

    		return this;
    	},

    	removeClass: function( value ) {
    		var classes, elem, cur, curValue, clazz, j, finalValue,
    			i = 0;

    		if ( isFunction( value ) ) {
    			return this.each( function( j ) {
    				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
    			} );
    		}

    		if ( !arguments.length ) {
    			return this.attr( "class", "" );
    		}

    		classes = classesToArray( value );

    		if ( classes.length ) {
    			while ( ( elem = this[ i++ ] ) ) {
    				curValue = getClass( elem );

    				// This expression is here for better compressibility (see addClass)
    				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

    				if ( cur ) {
    					j = 0;
    					while ( ( clazz = classes[ j++ ] ) ) {

    						// Remove *all* instances
    						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
    							cur = cur.replace( " " + clazz + " ", " " );
    						}
    					}

    					// Only assign if different to avoid unneeded rendering.
    					finalValue = stripAndCollapse( cur );
    					if ( curValue !== finalValue ) {
    						elem.setAttribute( "class", finalValue );
    					}
    				}
    			}
    		}

    		return this;
    	},

    	toggleClass: function( value, stateVal ) {
    		var type = typeof value,
    			isValidValue = type === "string" || Array.isArray( value );

    		if ( typeof stateVal === "boolean" && isValidValue ) {
    			return stateVal ? this.addClass( value ) : this.removeClass( value );
    		}

    		if ( isFunction( value ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).toggleClass(
    					value.call( this, i, getClass( this ), stateVal ),
    					stateVal
    				);
    			} );
    		}

    		return this.each( function() {
    			var className, i, self, classNames;

    			if ( isValidValue ) {

    				// Toggle individual class names
    				i = 0;
    				self = jQuery( this );
    				classNames = classesToArray( value );

    				while ( ( className = classNames[ i++ ] ) ) {

    					// Check each className given, space separated list
    					if ( self.hasClass( className ) ) {
    						self.removeClass( className );
    					} else {
    						self.addClass( className );
    					}
    				}

    			// Toggle whole class name
    			} else if ( value === undefined || type === "boolean" ) {
    				className = getClass( this );
    				if ( className ) {

    					// Store className if set
    					dataPriv.set( this, "__className__", className );
    				}

    				// If the element has a class name or if we're passed `false`,
    				// then remove the whole classname (if there was one, the above saved it).
    				// Otherwise bring back whatever was previously saved (if anything),
    				// falling back to the empty string if nothing was stored.
    				if ( this.setAttribute ) {
    					this.setAttribute( "class",
    						className || value === false ?
    							"" :
    							dataPriv.get( this, "__className__" ) || ""
    					);
    				}
    			}
    		} );
    	},

    	hasClass: function( selector ) {
    		var className, elem,
    			i = 0;

    		className = " " + selector + " ";
    		while ( ( elem = this[ i++ ] ) ) {
    			if ( elem.nodeType === 1 &&
    				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
    				return true;
    			}
    		}

    		return false;
    	}
    } );




    var rreturn = /\r/g;

    jQuery.fn.extend( {
    	val: function( value ) {
    		var hooks, ret, valueIsFunction,
    			elem = this[ 0 ];

    		if ( !arguments.length ) {
    			if ( elem ) {
    				hooks = jQuery.valHooks[ elem.type ] ||
    					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

    				if ( hooks &&
    					"get" in hooks &&
    					( ret = hooks.get( elem, "value" ) ) !== undefined
    				) {
    					return ret;
    				}

    				ret = elem.value;

    				// Handle most common string cases
    				if ( typeof ret === "string" ) {
    					return ret.replace( rreturn, "" );
    				}

    				// Handle cases where value is null/undef or number
    				return ret == null ? "" : ret;
    			}

    			return;
    		}

    		valueIsFunction = isFunction( value );

    		return this.each( function( i ) {
    			var val;

    			if ( this.nodeType !== 1 ) {
    				return;
    			}

    			if ( valueIsFunction ) {
    				val = value.call( this, i, jQuery( this ).val() );
    			} else {
    				val = value;
    			}

    			// Treat null/undefined as ""; convert numbers to string
    			if ( val == null ) {
    				val = "";

    			} else if ( typeof val === "number" ) {
    				val += "";

    			} else if ( Array.isArray( val ) ) {
    				val = jQuery.map( val, function( value ) {
    					return value == null ? "" : value + "";
    				} );
    			}

    			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

    			// If set returns undefined, fall back to normal setting
    			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
    				this.value = val;
    			}
    		} );
    	}
    } );

    jQuery.extend( {
    	valHooks: {
    		option: {
    			get: function( elem ) {

    				var val = jQuery.find.attr( elem, "value" );
    				return val != null ?
    					val :

    					// Support: IE <=10 - 11 only
    					// option.text throws exceptions (#14686, #14858)
    					// Strip and collapse whitespace
    					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
    					stripAndCollapse( jQuery.text( elem ) );
    			}
    		},
    		select: {
    			get: function( elem ) {
    				var value, option, i,
    					options = elem.options,
    					index = elem.selectedIndex,
    					one = elem.type === "select-one",
    					values = one ? null : [],
    					max = one ? index + 1 : options.length;

    				if ( index < 0 ) {
    					i = max;

    				} else {
    					i = one ? index : 0;
    				}

    				// Loop through all the selected options
    				for ( ; i < max; i++ ) {
    					option = options[ i ];

    					// Support: IE <=9 only
    					// IE8-9 doesn't update selected after form reset (#2551)
    					if ( ( option.selected || i === index ) &&

    							// Don't return options that are disabled or in a disabled optgroup
    							!option.disabled &&
    							( !option.parentNode.disabled ||
    								!nodeName( option.parentNode, "optgroup" ) ) ) {

    						// Get the specific value for the option
    						value = jQuery( option ).val();

    						// We don't need an array for one selects
    						if ( one ) {
    							return value;
    						}

    						// Multi-Selects return an array
    						values.push( value );
    					}
    				}

    				return values;
    			},

    			set: function( elem, value ) {
    				var optionSet, option,
    					options = elem.options,
    					values = jQuery.makeArray( value ),
    					i = options.length;

    				while ( i-- ) {
    					option = options[ i ];

    					/* eslint-disable no-cond-assign */

    					if ( option.selected =
    						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
    					) {
    						optionSet = true;
    					}

    					/* eslint-enable no-cond-assign */
    				}

    				// Force browsers to behave consistently when non-matching value is set
    				if ( !optionSet ) {
    					elem.selectedIndex = -1;
    				}
    				return values;
    			}
    		}
    	}
    } );

    // Radios and checkboxes getter/setter
    jQuery.each( [ "radio", "checkbox" ], function() {
    	jQuery.valHooks[ this ] = {
    		set: function( elem, value ) {
    			if ( Array.isArray( value ) ) {
    				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
    			}
    		}
    	};
    	if ( !support.checkOn ) {
    		jQuery.valHooks[ this ].get = function( elem ) {
    			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
    		};
    	}
    } );




    // Return jQuery for attributes-only inclusion


    support.focusin = "onfocusin" in window;


    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    	stopPropagationCallback = function( e ) {
    		e.stopPropagation();
    	};

    jQuery.extend( jQuery.event, {

    	trigger: function( event, data, elem, onlyHandlers ) {

    		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
    			eventPath = [ elem || document ],
    			type = hasOwn.call( event, "type" ) ? event.type : event,
    			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

    		cur = lastElement = tmp = elem = elem || document;

    		// Don't do events on text and comment nodes
    		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
    			return;
    		}

    		// focus/blur morphs to focusin/out; ensure we're not firing them right now
    		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
    			return;
    		}

    		if ( type.indexOf( "." ) > -1 ) {

    			// Namespaced trigger; create a regexp to match event type in handle()
    			namespaces = type.split( "." );
    			type = namespaces.shift();
    			namespaces.sort();
    		}
    		ontype = type.indexOf( ":" ) < 0 && "on" + type;

    		// Caller can pass in a jQuery.Event object, Object, or just an event type string
    		event = event[ jQuery.expando ] ?
    			event :
    			new jQuery.Event( type, typeof event === "object" && event );

    		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
    		event.isTrigger = onlyHandlers ? 2 : 3;
    		event.namespace = namespaces.join( "." );
    		event.rnamespace = event.namespace ?
    			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
    			null;

    		// Clean up the event in case it is being reused
    		event.result = undefined;
    		if ( !event.target ) {
    			event.target = elem;
    		}

    		// Clone any incoming data and prepend the event, creating the handler arg list
    		data = data == null ?
    			[ event ] :
    			jQuery.makeArray( data, [ event ] );

    		// Allow special events to draw outside the lines
    		special = jQuery.event.special[ type ] || {};
    		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
    			return;
    		}

    		// Determine event propagation path in advance, per W3C events spec (#9951)
    		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

    			bubbleType = special.delegateType || type;
    			if ( !rfocusMorph.test( bubbleType + type ) ) {
    				cur = cur.parentNode;
    			}
    			for ( ; cur; cur = cur.parentNode ) {
    				eventPath.push( cur );
    				tmp = cur;
    			}

    			// Only add window if we got to document (e.g., not plain obj or detached DOM)
    			if ( tmp === ( elem.ownerDocument || document ) ) {
    				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
    			}
    		}

    		// Fire handlers on the event path
    		i = 0;
    		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
    			lastElement = cur;
    			event.type = i > 1 ?
    				bubbleType :
    				special.bindType || type;

    			// jQuery handler
    			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
    				dataPriv.get( cur, "handle" );
    			if ( handle ) {
    				handle.apply( cur, data );
    			}

    			// Native handler
    			handle = ontype && cur[ ontype ];
    			if ( handle && handle.apply && acceptData( cur ) ) {
    				event.result = handle.apply( cur, data );
    				if ( event.result === false ) {
    					event.preventDefault();
    				}
    			}
    		}
    		event.type = type;

    		// If nobody prevented the default action, do it now
    		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

    			if ( ( !special._default ||
    				special._default.apply( eventPath.pop(), data ) === false ) &&
    				acceptData( elem ) ) {

    				// Call a native DOM method on the target with the same name as the event.
    				// Don't do default actions on window, that's where global variables be (#6170)
    				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

    					// Don't re-trigger an onFOO event when we call its FOO() method
    					tmp = elem[ ontype ];

    					if ( tmp ) {
    						elem[ ontype ] = null;
    					}

    					// Prevent re-triggering of the same event, since we already bubbled it above
    					jQuery.event.triggered = type;

    					if ( event.isPropagationStopped() ) {
    						lastElement.addEventListener( type, stopPropagationCallback );
    					}

    					elem[ type ]();

    					if ( event.isPropagationStopped() ) {
    						lastElement.removeEventListener( type, stopPropagationCallback );
    					}

    					jQuery.event.triggered = undefined;

    					if ( tmp ) {
    						elem[ ontype ] = tmp;
    					}
    				}
    			}
    		}

    		return event.result;
    	},

    	// Piggyback on a donor event to simulate a different one
    	// Used only for `focus(in | out)` events
    	simulate: function( type, elem, event ) {
    		var e = jQuery.extend(
    			new jQuery.Event(),
    			event,
    			{
    				type: type,
    				isSimulated: true
    			}
    		);

    		jQuery.event.trigger( e, null, elem );
    	}

    } );

    jQuery.fn.extend( {

    	trigger: function( type, data ) {
    		return this.each( function() {
    			jQuery.event.trigger( type, data, this );
    		} );
    	},
    	triggerHandler: function( type, data ) {
    		var elem = this[ 0 ];
    		if ( elem ) {
    			return jQuery.event.trigger( type, data, elem, true );
    		}
    	}
    } );


    // Support: Firefox <=44
    // Firefox doesn't have focus(in | out) events
    // Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
    //
    // Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
    // focus(in | out) events fire after focus & blur events,
    // which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
    // Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
    if ( !support.focusin ) {
    	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    		// Attach a single capturing handler on the document while someone wants focusin/focusout
    		var handler = function( event ) {
    			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
    		};

    		jQuery.event.special[ fix ] = {
    			setup: function() {

    				// Handle: regular nodes (via `this.ownerDocument`), window
    				// (via `this.document`) & document (via `this`).
    				var doc = this.ownerDocument || this.document || this,
    					attaches = dataPriv.access( doc, fix );

    				if ( !attaches ) {
    					doc.addEventListener( orig, handler, true );
    				}
    				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
    			},
    			teardown: function() {
    				var doc = this.ownerDocument || this.document || this,
    					attaches = dataPriv.access( doc, fix ) - 1;

    				if ( !attaches ) {
    					doc.removeEventListener( orig, handler, true );
    					dataPriv.remove( doc, fix );

    				} else {
    					dataPriv.access( doc, fix, attaches );
    				}
    			}
    		};
    	} );
    }
    var location = window.location;

    var nonce = { guid: Date.now() };

    var rquery = ( /\?/ );



    // Cross-browser xml parsing
    jQuery.parseXML = function( data ) {
    	var xml, parserErrorElem;
    	if ( !data || typeof data !== "string" ) {
    		return null;
    	}

    	// Support: IE 9 - 11 only
    	// IE throws on parseFromString with invalid input.
    	try {
    		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
    	} catch ( e ) {}

    	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
    	if ( !xml || parserErrorElem ) {
    		jQuery.error( "Invalid XML: " + (
    			parserErrorElem ?
    				jQuery.map( parserErrorElem.childNodes, function( el ) {
    					return el.textContent;
    				} ).join( "\n" ) :
    				data
    		) );
    	}
    	return xml;
    };


    var
    	rbracket = /\[\]$/,
    	rCRLF = /\r?\n/g,
    	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    	rsubmittable = /^(?:input|select|textarea|keygen)/i;

    function buildParams( prefix, obj, traditional, add ) {
    	var name;

    	if ( Array.isArray( obj ) ) {

    		// Serialize array item.
    		jQuery.each( obj, function( i, v ) {
    			if ( traditional || rbracket.test( prefix ) ) {

    				// Treat each array item as a scalar.
    				add( prefix, v );

    			} else {

    				// Item is non-scalar (array or object), encode its numeric index.
    				buildParams(
    					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
    					v,
    					traditional,
    					add
    				);
    			}
    		} );

    	} else if ( !traditional && toType( obj ) === "object" ) {

    		// Serialize object item.
    		for ( name in obj ) {
    			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    		}

    	} else {

    		// Serialize scalar item.
    		add( prefix, obj );
    	}
    }

    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function( a, traditional ) {
    	var prefix,
    		s = [],
    		add = function( key, valueOrFunction ) {

    			// If value is a function, invoke it and use its return value
    			var value = isFunction( valueOrFunction ) ?
    				valueOrFunction() :
    				valueOrFunction;

    			s[ s.length ] = encodeURIComponent( key ) + "=" +
    				encodeURIComponent( value == null ? "" : value );
    		};

    	if ( a == null ) {
    		return "";
    	}

    	// If an array was passed in, assume that it is an array of form elements.
    	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

    		// Serialize the form elements
    		jQuery.each( a, function() {
    			add( this.name, this.value );
    		} );

    	} else {

    		// If traditional, encode the "old" way (the way 1.3.2 or older
    		// did it), otherwise encode params recursively.
    		for ( prefix in a ) {
    			buildParams( prefix, a[ prefix ], traditional, add );
    		}
    	}

    	// Return the resulting serialization
    	return s.join( "&" );
    };

    jQuery.fn.extend( {
    	serialize: function() {
    		return jQuery.param( this.serializeArray() );
    	},
    	serializeArray: function() {
    		return this.map( function() {

    			// Can add propHook for "elements" to filter or add form elements
    			var elements = jQuery.prop( this, "elements" );
    			return elements ? jQuery.makeArray( elements ) : this;
    		} ).filter( function() {
    			var type = this.type;

    			// Use .is( ":disabled" ) so that fieldset[disabled] works
    			return this.name && !jQuery( this ).is( ":disabled" ) &&
    				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
    				( this.checked || !rcheckableType.test( type ) );
    		} ).map( function( _i, elem ) {
    			var val = jQuery( this ).val();

    			if ( val == null ) {
    				return null;
    			}

    			if ( Array.isArray( val ) ) {
    				return jQuery.map( val, function( val ) {
    					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    				} );
    			}

    			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    		} ).get();
    	}
    } );


    var
    	r20 = /%20/g,
    	rhash = /#.*$/,
    	rantiCache = /([?&])_=[^&]*/,
    	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

    	// #7653, #8125, #8152: local protocol detection
    	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    	rnoContent = /^(?:GET|HEAD)$/,
    	rprotocol = /^\/\//,

    	/* Prefilters
    	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    	 * 2) These are called:
    	 *    - BEFORE asking for a transport
    	 *    - AFTER param serialization (s.data is a string if s.processData is true)
    	 * 3) key is the dataType
    	 * 4) the catchall symbol "*" can be used
    	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    	 */
    	prefilters = {},

    	/* Transports bindings
    	 * 1) key is the dataType
    	 * 2) the catchall symbol "*" can be used
    	 * 3) selection will start with transport dataType and THEN go to "*" if needed
    	 */
    	transports = {},

    	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    	allTypes = "*/".concat( "*" ),

    	// Anchor tag for parsing the document origin
    	originAnchor = document.createElement( "a" );

    originAnchor.href = location.href;

    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

    	// dataTypeExpression is optional and defaults to "*"
    	return function( dataTypeExpression, func ) {

    		if ( typeof dataTypeExpression !== "string" ) {
    			func = dataTypeExpression;
    			dataTypeExpression = "*";
    		}

    		var dataType,
    			i = 0,
    			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

    		if ( isFunction( func ) ) {

    			// For each dataType in the dataTypeExpression
    			while ( ( dataType = dataTypes[ i++ ] ) ) {

    				// Prepend if requested
    				if ( dataType[ 0 ] === "+" ) {
    					dataType = dataType.slice( 1 ) || "*";
    					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

    				// Otherwise append
    				} else {
    					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
    				}
    			}
    		}
    	};
    }

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

    	var inspected = {},
    		seekingTransport = ( structure === transports );

    	function inspect( dataType ) {
    		var selected;
    		inspected[ dataType ] = true;
    		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
    			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
    			if ( typeof dataTypeOrTransport === "string" &&
    				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

    				options.dataTypes.unshift( dataTypeOrTransport );
    				inspect( dataTypeOrTransport );
    				return false;
    			} else if ( seekingTransport ) {
    				return !( selected = dataTypeOrTransport );
    			}
    		} );
    		return selected;
    	}

    	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    }

    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend( target, src ) {
    	var key, deep,
    		flatOptions = jQuery.ajaxSettings.flatOptions || {};

    	for ( key in src ) {
    		if ( src[ key ] !== undefined ) {
    			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    		}
    	}
    	if ( deep ) {
    		jQuery.extend( true, target, deep );
    	}

    	return target;
    }

    /* Handles responses to an ajax request:
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {

    	var ct, type, finalDataType, firstDataType,
    		contents = s.contents,
    		dataTypes = s.dataTypes;

    	// Remove auto dataType and get content-type in the process
    	while ( dataTypes[ 0 ] === "*" ) {
    		dataTypes.shift();
    		if ( ct === undefined ) {
    			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
    		}
    	}

    	// Check if we're dealing with a known content-type
    	if ( ct ) {
    		for ( type in contents ) {
    			if ( contents[ type ] && contents[ type ].test( ct ) ) {
    				dataTypes.unshift( type );
    				break;
    			}
    		}
    	}

    	// Check to see if we have a response for the expected dataType
    	if ( dataTypes[ 0 ] in responses ) {
    		finalDataType = dataTypes[ 0 ];
    	} else {

    		// Try convertible dataTypes
    		for ( type in responses ) {
    			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
    				finalDataType = type;
    				break;
    			}
    			if ( !firstDataType ) {
    				firstDataType = type;
    			}
    		}

    		// Or just use first one
    		finalDataType = finalDataType || firstDataType;
    	}

    	// If we found a dataType
    	// We add the dataType to the list if needed
    	// and return the corresponding response
    	if ( finalDataType ) {
    		if ( finalDataType !== dataTypes[ 0 ] ) {
    			dataTypes.unshift( finalDataType );
    		}
    		return responses[ finalDataType ];
    	}
    }

    /* Chain conversions given the request and the original response
     * Also sets the responseXXX fields on the jqXHR instance
     */
    function ajaxConvert( s, response, jqXHR, isSuccess ) {
    	var conv2, current, conv, tmp, prev,
    		converters = {},

    		// Work with a copy of dataTypes in case we need to modify it for conversion
    		dataTypes = s.dataTypes.slice();

    	// Create converters map with lowercased keys
    	if ( dataTypes[ 1 ] ) {
    		for ( conv in s.converters ) {
    			converters[ conv.toLowerCase() ] = s.converters[ conv ];
    		}
    	}

    	current = dataTypes.shift();

    	// Convert to each sequential dataType
    	while ( current ) {

    		if ( s.responseFields[ current ] ) {
    			jqXHR[ s.responseFields[ current ] ] = response;
    		}

    		// Apply the dataFilter if provided
    		if ( !prev && isSuccess && s.dataFilter ) {
    			response = s.dataFilter( response, s.dataType );
    		}

    		prev = current;
    		current = dataTypes.shift();

    		if ( current ) {

    			// There's only work to do if current dataType is non-auto
    			if ( current === "*" ) {

    				current = prev;

    			// Convert response if prev dataType is non-auto and differs from current
    			} else if ( prev !== "*" && prev !== current ) {

    				// Seek a direct converter
    				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

    				// If none found, seek a pair
    				if ( !conv ) {
    					for ( conv2 in converters ) {

    						// If conv2 outputs current
    						tmp = conv2.split( " " );
    						if ( tmp[ 1 ] === current ) {

    							// If prev can be converted to accepted input
    							conv = converters[ prev + " " + tmp[ 0 ] ] ||
    								converters[ "* " + tmp[ 0 ] ];
    							if ( conv ) {

    								// Condense equivalence converters
    								if ( conv === true ) {
    									conv = converters[ conv2 ];

    								// Otherwise, insert the intermediate dataType
    								} else if ( converters[ conv2 ] !== true ) {
    									current = tmp[ 0 ];
    									dataTypes.unshift( tmp[ 1 ] );
    								}
    								break;
    							}
    						}
    					}
    				}

    				// Apply converter (if not an equivalence)
    				if ( conv !== true ) {

    					// Unless errors are allowed to bubble, catch and return them
    					if ( conv && s.throws ) {
    						response = conv( response );
    					} else {
    						try {
    							response = conv( response );
    						} catch ( e ) {
    							return {
    								state: "parsererror",
    								error: conv ? e : "No conversion from " + prev + " to " + current
    							};
    						}
    					}
    				}
    			}
    		}
    	}

    	return { state: "success", data: response };
    }

    jQuery.extend( {

    	// Counter for holding the number of active queries
    	active: 0,

    	// Last-Modified header cache for next request
    	lastModified: {},
    	etag: {},

    	ajaxSettings: {
    		url: location.href,
    		type: "GET",
    		isLocal: rlocalProtocol.test( location.protocol ),
    		global: true,
    		processData: true,
    		async: true,
    		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

    		/*
    		timeout: 0,
    		data: null,
    		dataType: null,
    		username: null,
    		password: null,
    		cache: null,
    		throws: false,
    		traditional: false,
    		headers: {},
    		*/

    		accepts: {
    			"*": allTypes,
    			text: "text/plain",
    			html: "text/html",
    			xml: "application/xml, text/xml",
    			json: "application/json, text/javascript"
    		},

    		contents: {
    			xml: /\bxml\b/,
    			html: /\bhtml/,
    			json: /\bjson\b/
    		},

    		responseFields: {
    			xml: "responseXML",
    			text: "responseText",
    			json: "responseJSON"
    		},

    		// Data converters
    		// Keys separate source (or catchall "*") and destination types with a single space
    		converters: {

    			// Convert anything to text
    			"* text": String,

    			// Text to html (true = no transformation)
    			"text html": true,

    			// Evaluate text as a json expression
    			"text json": JSON.parse,

    			// Parse text as xml
    			"text xml": jQuery.parseXML
    		},

    		// For options that shouldn't be deep extended:
    		// you can add your own custom options here if
    		// and when you create one that shouldn't be
    		// deep extended (see ajaxExtend)
    		flatOptions: {
    			url: true,
    			context: true
    		}
    	},

    	// Creates a full fledged settings object into target
    	// with both ajaxSettings and settings fields.
    	// If target is omitted, writes into ajaxSettings.
    	ajaxSetup: function( target, settings ) {
    		return settings ?

    			// Building a settings object
    			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

    			// Extending ajaxSettings
    			ajaxExtend( jQuery.ajaxSettings, target );
    	},

    	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    	ajaxTransport: addToPrefiltersOrTransports( transports ),

    	// Main method
    	ajax: function( url, options ) {

    		// If url is an object, simulate pre-1.5 signature
    		if ( typeof url === "object" ) {
    			options = url;
    			url = undefined;
    		}

    		// Force options to be an object
    		options = options || {};

    		var transport,

    			// URL without anti-cache param
    			cacheURL,

    			// Response headers
    			responseHeadersString,
    			responseHeaders,

    			// timeout handle
    			timeoutTimer,

    			// Url cleanup var
    			urlAnchor,

    			// Request state (becomes false upon send and true upon completion)
    			completed,

    			// To know if global events are to be dispatched
    			fireGlobals,

    			// Loop variable
    			i,

    			// uncached part of the url
    			uncached,

    			// Create the final options object
    			s = jQuery.ajaxSetup( {}, options ),

    			// Callbacks context
    			callbackContext = s.context || s,

    			// Context for global events is callbackContext if it is a DOM node or jQuery collection
    			globalEventContext = s.context &&
    				( callbackContext.nodeType || callbackContext.jquery ) ?
    				jQuery( callbackContext ) :
    				jQuery.event,

    			// Deferreds
    			deferred = jQuery.Deferred(),
    			completeDeferred = jQuery.Callbacks( "once memory" ),

    			// Status-dependent callbacks
    			statusCode = s.statusCode || {},

    			// Headers (they are sent all at once)
    			requestHeaders = {},
    			requestHeadersNames = {},

    			// Default abort message
    			strAbort = "canceled",

    			// Fake xhr
    			jqXHR = {
    				readyState: 0,

    				// Builds headers hashtable if needed
    				getResponseHeader: function( key ) {
    					var match;
    					if ( completed ) {
    						if ( !responseHeaders ) {
    							responseHeaders = {};
    							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
    								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
    									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
    										.concat( match[ 2 ] );
    							}
    						}
    						match = responseHeaders[ key.toLowerCase() + " " ];
    					}
    					return match == null ? null : match.join( ", " );
    				},

    				// Raw string
    				getAllResponseHeaders: function() {
    					return completed ? responseHeadersString : null;
    				},

    				// Caches the header
    				setRequestHeader: function( name, value ) {
    					if ( completed == null ) {
    						name = requestHeadersNames[ name.toLowerCase() ] =
    							requestHeadersNames[ name.toLowerCase() ] || name;
    						requestHeaders[ name ] = value;
    					}
    					return this;
    				},

    				// Overrides response content-type header
    				overrideMimeType: function( type ) {
    					if ( completed == null ) {
    						s.mimeType = type;
    					}
    					return this;
    				},

    				// Status-dependent callbacks
    				statusCode: function( map ) {
    					var code;
    					if ( map ) {
    						if ( completed ) {

    							// Execute the appropriate callbacks
    							jqXHR.always( map[ jqXHR.status ] );
    						} else {

    							// Lazy-add the new callbacks in a way that preserves old ones
    							for ( code in map ) {
    								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
    							}
    						}
    					}
    					return this;
    				},

    				// Cancel the request
    				abort: function( statusText ) {
    					var finalText = statusText || strAbort;
    					if ( transport ) {
    						transport.abort( finalText );
    					}
    					done( 0, finalText );
    					return this;
    				}
    			};

    		// Attach deferreds
    		deferred.promise( jqXHR );

    		// Add protocol if not provided (prefilters might expect it)
    		// Handle falsy url in the settings object (#10093: consistency with old signature)
    		// We also use the url parameter if available
    		s.url = ( ( url || s.url || location.href ) + "" )
    			.replace( rprotocol, location.protocol + "//" );

    		// Alias method option to type as per ticket #12004
    		s.type = options.method || options.type || s.method || s.type;

    		// Extract dataTypes list
    		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

    		// A cross-domain request is in order when the origin doesn't match the current origin.
    		if ( s.crossDomain == null ) {
    			urlAnchor = document.createElement( "a" );

    			// Support: IE <=8 - 11, Edge 12 - 15
    			// IE throws exception on accessing the href property if url is malformed,
    			// e.g. http://example.com:80x/
    			try {
    				urlAnchor.href = s.url;

    				// Support: IE <=8 - 11 only
    				// Anchor's host property isn't correctly set when s.url is relative
    				urlAnchor.href = urlAnchor.href;
    				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
    					urlAnchor.protocol + "//" + urlAnchor.host;
    			} catch ( e ) {

    				// If there is an error parsing the URL, assume it is crossDomain,
    				// it can be rejected by the transport if it is invalid
    				s.crossDomain = true;
    			}
    		}

    		// Convert data if not already a string
    		if ( s.data && s.processData && typeof s.data !== "string" ) {
    			s.data = jQuery.param( s.data, s.traditional );
    		}

    		// Apply prefilters
    		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    		// If request was aborted inside a prefilter, stop there
    		if ( completed ) {
    			return jqXHR;
    		}

    		// We can fire global events as of now if asked to
    		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
    		fireGlobals = jQuery.event && s.global;

    		// Watch for a new set of requests
    		if ( fireGlobals && jQuery.active++ === 0 ) {
    			jQuery.event.trigger( "ajaxStart" );
    		}

    		// Uppercase the type
    		s.type = s.type.toUpperCase();

    		// Determine if request has content
    		s.hasContent = !rnoContent.test( s.type );

    		// Save the URL in case we're toying with the If-Modified-Since
    		// and/or If-None-Match header later on
    		// Remove hash to simplify url manipulation
    		cacheURL = s.url.replace( rhash, "" );

    		// More options handling for requests with no content
    		if ( !s.hasContent ) {

    			// Remember the hash so we can put it back
    			uncached = s.url.slice( cacheURL.length );

    			// If data is available and should be processed, append data to url
    			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
    				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

    				// #9682: remove data so that it's not used in an eventual retry
    				delete s.data;
    			}

    			// Add or update anti-cache param if needed
    			if ( s.cache === false ) {
    				cacheURL = cacheURL.replace( rantiCache, "$1" );
    				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
    					uncached;
    			}

    			// Put hash and anti-cache on the URL that will be requested (gh-1732)
    			s.url = cacheURL + uncached;

    		// Change '%20' to '+' if this is encoded form body content (gh-2658)
    		} else if ( s.data && s.processData &&
    			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
    			s.data = s.data.replace( r20, "+" );
    		}

    		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    		if ( s.ifModified ) {
    			if ( jQuery.lastModified[ cacheURL ] ) {
    				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
    			}
    			if ( jQuery.etag[ cacheURL ] ) {
    				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
    			}
    		}

    		// Set the correct header, if data is being sent
    		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
    			jqXHR.setRequestHeader( "Content-Type", s.contentType );
    		}

    		// Set the Accepts header for the server, depending on the dataType
    		jqXHR.setRequestHeader(
    			"Accept",
    			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
    				s.accepts[ s.dataTypes[ 0 ] ] +
    					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
    				s.accepts[ "*" ]
    		);

    		// Check for headers option
    		for ( i in s.headers ) {
    			jqXHR.setRequestHeader( i, s.headers[ i ] );
    		}

    		// Allow custom headers/mimetypes and early abort
    		if ( s.beforeSend &&
    			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

    			// Abort if not done already and return
    			return jqXHR.abort();
    		}

    		// Aborting is no longer a cancellation
    		strAbort = "abort";

    		// Install callbacks on deferreds
    		completeDeferred.add( s.complete );
    		jqXHR.done( s.success );
    		jqXHR.fail( s.error );

    		// Get transport
    		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    		// If no transport, we auto-abort
    		if ( !transport ) {
    			done( -1, "No Transport" );
    		} else {
    			jqXHR.readyState = 1;

    			// Send global event
    			if ( fireGlobals ) {
    				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
    			}

    			// If request was aborted inside ajaxSend, stop there
    			if ( completed ) {
    				return jqXHR;
    			}

    			// Timeout
    			if ( s.async && s.timeout > 0 ) {
    				timeoutTimer = window.setTimeout( function() {
    					jqXHR.abort( "timeout" );
    				}, s.timeout );
    			}

    			try {
    				completed = false;
    				transport.send( requestHeaders, done );
    			} catch ( e ) {

    				// Rethrow post-completion exceptions
    				if ( completed ) {
    					throw e;
    				}

    				// Propagate others as results
    				done( -1, e );
    			}
    		}

    		// Callback for when everything is done
    		function done( status, nativeStatusText, responses, headers ) {
    			var isSuccess, success, error, response, modified,
    				statusText = nativeStatusText;

    			// Ignore repeat invocations
    			if ( completed ) {
    				return;
    			}

    			completed = true;

    			// Clear timeout if it exists
    			if ( timeoutTimer ) {
    				window.clearTimeout( timeoutTimer );
    			}

    			// Dereference transport for early garbage collection
    			// (no matter how long the jqXHR object will be used)
    			transport = undefined;

    			// Cache response headers
    			responseHeadersString = headers || "";

    			// Set readyState
    			jqXHR.readyState = status > 0 ? 4 : 0;

    			// Determine if successful
    			isSuccess = status >= 200 && status < 300 || status === 304;

    			// Get response data
    			if ( responses ) {
    				response = ajaxHandleResponses( s, jqXHR, responses );
    			}

    			// Use a noop converter for missing script but not if jsonp
    			if ( !isSuccess &&
    				jQuery.inArray( "script", s.dataTypes ) > -1 &&
    				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
    				s.converters[ "text script" ] = function() {};
    			}

    			// Convert no matter what (that way responseXXX fields are always set)
    			response = ajaxConvert( s, response, jqXHR, isSuccess );

    			// If successful, handle type chaining
    			if ( isSuccess ) {

    				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    				if ( s.ifModified ) {
    					modified = jqXHR.getResponseHeader( "Last-Modified" );
    					if ( modified ) {
    						jQuery.lastModified[ cacheURL ] = modified;
    					}
    					modified = jqXHR.getResponseHeader( "etag" );
    					if ( modified ) {
    						jQuery.etag[ cacheURL ] = modified;
    					}
    				}

    				// if no content
    				if ( status === 204 || s.type === "HEAD" ) {
    					statusText = "nocontent";

    				// if not modified
    				} else if ( status === 304 ) {
    					statusText = "notmodified";

    				// If we have data, let's convert it
    				} else {
    					statusText = response.state;
    					success = response.data;
    					error = response.error;
    					isSuccess = !error;
    				}
    			} else {

    				// Extract error from statusText and normalize for non-aborts
    				error = statusText;
    				if ( status || !statusText ) {
    					statusText = "error";
    					if ( status < 0 ) {
    						status = 0;
    					}
    				}
    			}

    			// Set data for the fake xhr object
    			jqXHR.status = status;
    			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

    			// Success/Error
    			if ( isSuccess ) {
    				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
    			} else {
    				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
    			}

    			// Status-dependent callbacks
    			jqXHR.statusCode( statusCode );
    			statusCode = undefined;

    			if ( fireGlobals ) {
    				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
    					[ jqXHR, s, isSuccess ? success : error ] );
    			}

    			// Complete
    			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

    			if ( fireGlobals ) {
    				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

    				// Handle the global AJAX counter
    				if ( !( --jQuery.active ) ) {
    					jQuery.event.trigger( "ajaxStop" );
    				}
    			}
    		}

    		return jqXHR;
    	},

    	getJSON: function( url, data, callback ) {
    		return jQuery.get( url, data, callback, "json" );
    	},

    	getScript: function( url, callback ) {
    		return jQuery.get( url, undefined, callback, "script" );
    	}
    } );

    jQuery.each( [ "get", "post" ], function( _i, method ) {
    	jQuery[ method ] = function( url, data, callback, type ) {

    		// Shift arguments if data argument was omitted
    		if ( isFunction( data ) ) {
    			type = type || callback;
    			callback = data;
    			data = undefined;
    		}

    		// The url can be an options object (which then must have .url)
    		return jQuery.ajax( jQuery.extend( {
    			url: url,
    			type: method,
    			dataType: type,
    			data: data,
    			success: callback
    		}, jQuery.isPlainObject( url ) && url ) );
    	};
    } );

    jQuery.ajaxPrefilter( function( s ) {
    	var i;
    	for ( i in s.headers ) {
    		if ( i.toLowerCase() === "content-type" ) {
    			s.contentType = s.headers[ i ] || "";
    		}
    	}
    } );


    jQuery._evalUrl = function( url, options, doc ) {
    	return jQuery.ajax( {
    		url: url,

    		// Make this explicit, since user can override this through ajaxSetup (#11264)
    		type: "GET",
    		dataType: "script",
    		cache: true,
    		async: false,
    		global: false,

    		// Only evaluate the response if it is successful (gh-4126)
    		// dataFilter is not invoked for failure responses, so using it instead
    		// of the default converter is kludgy but it works.
    		converters: {
    			"text script": function() {}
    		},
    		dataFilter: function( response ) {
    			jQuery.globalEval( response, options, doc );
    		}
    	} );
    };


    jQuery.fn.extend( {
    	wrapAll: function( html ) {
    		var wrap;

    		if ( this[ 0 ] ) {
    			if ( isFunction( html ) ) {
    				html = html.call( this[ 0 ] );
    			}

    			// The elements to wrap the target around
    			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

    			if ( this[ 0 ].parentNode ) {
    				wrap.insertBefore( this[ 0 ] );
    			}

    			wrap.map( function() {
    				var elem = this;

    				while ( elem.firstElementChild ) {
    					elem = elem.firstElementChild;
    				}

    				return elem;
    			} ).append( this );
    		}

    		return this;
    	},

    	wrapInner: function( html ) {
    		if ( isFunction( html ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).wrapInner( html.call( this, i ) );
    			} );
    		}

    		return this.each( function() {
    			var self = jQuery( this ),
    				contents = self.contents();

    			if ( contents.length ) {
    				contents.wrapAll( html );

    			} else {
    				self.append( html );
    			}
    		} );
    	},

    	wrap: function( html ) {
    		var htmlIsFunction = isFunction( html );

    		return this.each( function( i ) {
    			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
    		} );
    	},

    	unwrap: function( selector ) {
    		this.parent( selector ).not( "body" ).each( function() {
    			jQuery( this ).replaceWith( this.childNodes );
    		} );
    		return this;
    	}
    } );


    jQuery.expr.pseudos.hidden = function( elem ) {
    	return !jQuery.expr.pseudos.visible( elem );
    };
    jQuery.expr.pseudos.visible = function( elem ) {
    	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    };




    jQuery.ajaxSettings.xhr = function() {
    	try {
    		return new window.XMLHttpRequest();
    	} catch ( e ) {}
    };

    var xhrSuccessStatus = {

    		// File protocol always yields status code 0, assume 200
    		0: 200,

    		// Support: IE <=9 only
    		// #1450: sometimes IE returns 1223 when it should be 204
    		1223: 204
    	},
    	xhrSupported = jQuery.ajaxSettings.xhr();

    support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    support.ajax = xhrSupported = !!xhrSupported;

    jQuery.ajaxTransport( function( options ) {
    	var callback, errorCallback;

    	// Cross domain only allowed if supported through XMLHttpRequest
    	if ( support.cors || xhrSupported && !options.crossDomain ) {
    		return {
    			send: function( headers, complete ) {
    				var i,
    					xhr = options.xhr();

    				xhr.open(
    					options.type,
    					options.url,
    					options.async,
    					options.username,
    					options.password
    				);

    				// Apply custom fields if provided
    				if ( options.xhrFields ) {
    					for ( i in options.xhrFields ) {
    						xhr[ i ] = options.xhrFields[ i ];
    					}
    				}

    				// Override mime type if needed
    				if ( options.mimeType && xhr.overrideMimeType ) {
    					xhr.overrideMimeType( options.mimeType );
    				}

    				// X-Requested-With header
    				// For cross-domain requests, seeing as conditions for a preflight are
    				// akin to a jigsaw puzzle, we simply never set it to be sure.
    				// (it can always be set on a per-request basis or even using ajaxSetup)
    				// For same-domain requests, won't change header if already provided.
    				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
    					headers[ "X-Requested-With" ] = "XMLHttpRequest";
    				}

    				// Set headers
    				for ( i in headers ) {
    					xhr.setRequestHeader( i, headers[ i ] );
    				}

    				// Callback
    				callback = function( type ) {
    					return function() {
    						if ( callback ) {
    							callback = errorCallback = xhr.onload =
    								xhr.onerror = xhr.onabort = xhr.ontimeout =
    									xhr.onreadystatechange = null;

    							if ( type === "abort" ) {
    								xhr.abort();
    							} else if ( type === "error" ) {

    								// Support: IE <=9 only
    								// On a manual native abort, IE9 throws
    								// errors on any property access that is not readyState
    								if ( typeof xhr.status !== "number" ) {
    									complete( 0, "error" );
    								} else {
    									complete(

    										// File: protocol always yields status 0; see #8605, #14207
    										xhr.status,
    										xhr.statusText
    									);
    								}
    							} else {
    								complete(
    									xhrSuccessStatus[ xhr.status ] || xhr.status,
    									xhr.statusText,

    									// Support: IE <=9 only
    									// IE9 has no XHR2 but throws on binary (trac-11426)
    									// For XHR2 non-text, let the caller handle it (gh-2498)
    									( xhr.responseType || "text" ) !== "text"  ||
    									typeof xhr.responseText !== "string" ?
    										{ binary: xhr.response } :
    										{ text: xhr.responseText },
    									xhr.getAllResponseHeaders()
    								);
    							}
    						}
    					};
    				};

    				// Listen to events
    				xhr.onload = callback();
    				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

    				// Support: IE 9 only
    				// Use onreadystatechange to replace onabort
    				// to handle uncaught aborts
    				if ( xhr.onabort !== undefined ) {
    					xhr.onabort = errorCallback;
    				} else {
    					xhr.onreadystatechange = function() {

    						// Check readyState before timeout as it changes
    						if ( xhr.readyState === 4 ) {

    							// Allow onerror to be called first,
    							// but that will not handle a native abort
    							// Also, save errorCallback to a variable
    							// as xhr.onerror cannot be accessed
    							window.setTimeout( function() {
    								if ( callback ) {
    									errorCallback();
    								}
    							} );
    						}
    					};
    				}

    				// Create the abort callback
    				callback = callback( "abort" );

    				try {

    					// Do send the request (this may raise an exception)
    					xhr.send( options.hasContent && options.data || null );
    				} catch ( e ) {

    					// #14683: Only rethrow if this hasn't been notified as an error yet
    					if ( callback ) {
    						throw e;
    					}
    				}
    			},

    			abort: function() {
    				if ( callback ) {
    					callback();
    				}
    			}
    		};
    	}
    } );




    // Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
    jQuery.ajaxPrefilter( function( s ) {
    	if ( s.crossDomain ) {
    		s.contents.script = false;
    	}
    } );

    // Install script dataType
    jQuery.ajaxSetup( {
    	accepts: {
    		script: "text/javascript, application/javascript, " +
    			"application/ecmascript, application/x-ecmascript"
    	},
    	contents: {
    		script: /\b(?:java|ecma)script\b/
    	},
    	converters: {
    		"text script": function( text ) {
    			jQuery.globalEval( text );
    			return text;
    		}
    	}
    } );

    // Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter( "script", function( s ) {
    	if ( s.cache === undefined ) {
    		s.cache = false;
    	}
    	if ( s.crossDomain ) {
    		s.type = "GET";
    	}
    } );

    // Bind script tag hack transport
    jQuery.ajaxTransport( "script", function( s ) {

    	// This transport only deals with cross domain or forced-by-attrs requests
    	if ( s.crossDomain || s.scriptAttrs ) {
    		var script, callback;
    		return {
    			send: function( _, complete ) {
    				script = jQuery( "<script>" )
    					.attr( s.scriptAttrs || {} )
    					.prop( { charset: s.scriptCharset, src: s.url } )
    					.on( "load error", callback = function( evt ) {
    						script.remove();
    						callback = null;
    						if ( evt ) {
    							complete( evt.type === "error" ? 404 : 200, evt.type );
    						}
    					} );

    				// Use native DOM manipulation to avoid our domManip AJAX trickery
    				document.head.appendChild( script[ 0 ] );
    			},
    			abort: function() {
    				if ( callback ) {
    					callback();
    				}
    			}
    		};
    	}
    } );




    var oldCallbacks = [],
    	rjsonp = /(=)\?(?=&|$)|\?\?/;

    // Default jsonp settings
    jQuery.ajaxSetup( {
    	jsonp: "callback",
    	jsonpCallback: function() {
    		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
    		this[ callback ] = true;
    		return callback;
    	}
    } );

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    	var callbackName, overwritten, responseContainer,
    		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
    			"url" :
    			typeof s.data === "string" &&
    				( s.contentType || "" )
    					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
    				rjsonp.test( s.data ) && "data"
    		);

    	// Handle iff the expected data type is "jsonp" or we have a parameter to set
    	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

    		// Get callback name, remembering preexisting value associated with it
    		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
    			s.jsonpCallback() :
    			s.jsonpCallback;

    		// Insert callback into url or form data
    		if ( jsonProp ) {
    			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
    		} else if ( s.jsonp !== false ) {
    			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    		}

    		// Use data converter to retrieve json after script execution
    		s.converters[ "script json" ] = function() {
    			if ( !responseContainer ) {
    				jQuery.error( callbackName + " was not called" );
    			}
    			return responseContainer[ 0 ];
    		};

    		// Force json dataType
    		s.dataTypes[ 0 ] = "json";

    		// Install callback
    		overwritten = window[ callbackName ];
    		window[ callbackName ] = function() {
    			responseContainer = arguments;
    		};

    		// Clean-up function (fires after converters)
    		jqXHR.always( function() {

    			// If previous value didn't exist - remove it
    			if ( overwritten === undefined ) {
    				jQuery( window ).removeProp( callbackName );

    			// Otherwise restore preexisting value
    			} else {
    				window[ callbackName ] = overwritten;
    			}

    			// Save back as free
    			if ( s[ callbackName ] ) {

    				// Make sure that re-using the options doesn't screw things around
    				s.jsonpCallback = originalSettings.jsonpCallback;

    				// Save the callback name for future use
    				oldCallbacks.push( callbackName );
    			}

    			// Call if it was a function and we have a response
    			if ( responseContainer && isFunction( overwritten ) ) {
    				overwritten( responseContainer[ 0 ] );
    			}

    			responseContainer = overwritten = undefined;
    		} );

    		// Delegate to script
    		return "script";
    	}
    } );




    // Support: Safari 8 only
    // In Safari 8 documents created via document.implementation.createHTMLDocument
    // collapse sibling forms: the second one becomes a child of the first one.
    // Because of that, this security measure has to be disabled in Safari 8.
    // https://bugs.webkit.org/show_bug.cgi?id=137337
    support.createHTMLDocument = ( function() {
    	var body = document.implementation.createHTMLDocument( "" ).body;
    	body.innerHTML = "<form></form><form></form>";
    	return body.childNodes.length === 2;
    } )();


    // Argument "data" should be string of html
    // context (optional): If specified, the fragment will be created in this context,
    // defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function( data, context, keepScripts ) {
    	if ( typeof data !== "string" ) {
    		return [];
    	}
    	if ( typeof context === "boolean" ) {
    		keepScripts = context;
    		context = false;
    	}

    	var base, parsed, scripts;

    	if ( !context ) {

    		// Stop scripts or inline event handlers from being executed immediately
    		// by using document.implementation
    		if ( support.createHTMLDocument ) {
    			context = document.implementation.createHTMLDocument( "" );

    			// Set the base href for the created document
    			// so any parsed elements with URLs
    			// are based on the document's URL (gh-2965)
    			base = context.createElement( "base" );
    			base.href = document.location.href;
    			context.head.appendChild( base );
    		} else {
    			context = document;
    		}
    	}

    	parsed = rsingleTag.exec( data );
    	scripts = !keepScripts && [];

    	// Single tag
    	if ( parsed ) {
    		return [ context.createElement( parsed[ 1 ] ) ];
    	}

    	parsed = buildFragment( [ data ], context, scripts );

    	if ( scripts && scripts.length ) {
    		jQuery( scripts ).remove();
    	}

    	return jQuery.merge( [], parsed.childNodes );
    };


    /**
     * Load a url into a page
     */
    jQuery.fn.load = function( url, params, callback ) {
    	var selector, type, response,
    		self = this,
    		off = url.indexOf( " " );

    	if ( off > -1 ) {
    		selector = stripAndCollapse( url.slice( off ) );
    		url = url.slice( 0, off );
    	}

    	// If it's a function
    	if ( isFunction( params ) ) {

    		// We assume that it's the callback
    		callback = params;
    		params = undefined;

    	// Otherwise, build a param string
    	} else if ( params && typeof params === "object" ) {
    		type = "POST";
    	}

    	// If we have elements to modify, make the request
    	if ( self.length > 0 ) {
    		jQuery.ajax( {
    			url: url,

    			// If "type" variable is undefined, then "GET" method will be used.
    			// Make value of this field explicit since
    			// user can override it through ajaxSetup method
    			type: type || "GET",
    			dataType: "html",
    			data: params
    		} ).done( function( responseText ) {

    			// Save response for use in complete callback
    			response = arguments;

    			self.html( selector ?

    				// If a selector was specified, locate the right elements in a dummy div
    				// Exclude scripts to avoid IE 'Permission Denied' errors
    				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

    				// Otherwise use the full result
    				responseText );

    		// If the request succeeds, this function gets "data", "status", "jqXHR"
    		// but they are ignored because response was set above.
    		// If it fails, this function gets "jqXHR", "status", "error"
    		} ).always( callback && function( jqXHR, status ) {
    			self.each( function() {
    				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
    			} );
    		} );
    	}

    	return this;
    };




    jQuery.expr.pseudos.animated = function( elem ) {
    	return jQuery.grep( jQuery.timers, function( fn ) {
    		return elem === fn.elem;
    	} ).length;
    };




    jQuery.offset = {
    	setOffset: function( elem, options, i ) {
    		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
    			position = jQuery.css( elem, "position" ),
    			curElem = jQuery( elem ),
    			props = {};

    		// Set position first, in-case top/left are set even on static elem
    		if ( position === "static" ) {
    			elem.style.position = "relative";
    		}

    		curOffset = curElem.offset();
    		curCSSTop = jQuery.css( elem, "top" );
    		curCSSLeft = jQuery.css( elem, "left" );
    		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
    			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

    		// Need to be able to calculate position if either
    		// top or left is auto and position is either absolute or fixed
    		if ( calculatePosition ) {
    			curPosition = curElem.position();
    			curTop = curPosition.top;
    			curLeft = curPosition.left;

    		} else {
    			curTop = parseFloat( curCSSTop ) || 0;
    			curLeft = parseFloat( curCSSLeft ) || 0;
    		}

    		if ( isFunction( options ) ) {

    			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
    			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
    		}

    		if ( options.top != null ) {
    			props.top = ( options.top - curOffset.top ) + curTop;
    		}
    		if ( options.left != null ) {
    			props.left = ( options.left - curOffset.left ) + curLeft;
    		}

    		if ( "using" in options ) {
    			options.using.call( elem, props );

    		} else {
    			curElem.css( props );
    		}
    	}
    };

    jQuery.fn.extend( {

    	// offset() relates an element's border box to the document origin
    	offset: function( options ) {

    		// Preserve chaining for setter
    		if ( arguments.length ) {
    			return options === undefined ?
    				this :
    				this.each( function( i ) {
    					jQuery.offset.setOffset( this, options, i );
    				} );
    		}

    		var rect, win,
    			elem = this[ 0 ];

    		if ( !elem ) {
    			return;
    		}

    		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    		// Support: IE <=11 only
    		// Running getBoundingClientRect on a
    		// disconnected node in IE throws an error
    		if ( !elem.getClientRects().length ) {
    			return { top: 0, left: 0 };
    		}

    		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
    		rect = elem.getBoundingClientRect();
    		win = elem.ownerDocument.defaultView;
    		return {
    			top: rect.top + win.pageYOffset,
    			left: rect.left + win.pageXOffset
    		};
    	},

    	// position() relates an element's margin box to its offset parent's padding box
    	// This corresponds to the behavior of CSS absolute positioning
    	position: function() {
    		if ( !this[ 0 ] ) {
    			return;
    		}

    		var offsetParent, offset, doc,
    			elem = this[ 0 ],
    			parentOffset = { top: 0, left: 0 };

    		// position:fixed elements are offset from the viewport, which itself always has zero offset
    		if ( jQuery.css( elem, "position" ) === "fixed" ) {

    			// Assume position:fixed implies availability of getBoundingClientRect
    			offset = elem.getBoundingClientRect();

    		} else {
    			offset = this.offset();

    			// Account for the *real* offset parent, which can be the document or its root element
    			// when a statically positioned element is identified
    			doc = elem.ownerDocument;
    			offsetParent = elem.offsetParent || doc.documentElement;
    			while ( offsetParent &&
    				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
    				jQuery.css( offsetParent, "position" ) === "static" ) {

    				offsetParent = offsetParent.parentNode;
    			}
    			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

    				// Incorporate borders into its offset, since they are outside its content origin
    				parentOffset = jQuery( offsetParent ).offset();
    				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
    				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
    			}
    		}

    		// Subtract parent offsets and element margins
    		return {
    			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
    			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
    		};
    	},

    	// This method will return documentElement in the following cases:
    	// 1) For the element inside the iframe without offsetParent, this method will return
    	//    documentElement of the parent window
    	// 2) For the hidden or detached element
    	// 3) For body or html element, i.e. in case of the html node - it will return itself
    	//
    	// but those exceptions were never presented as a real life use-cases
    	// and might be considered as more preferable results.
    	//
    	// This logic, however, is not guaranteed and can change at any point in the future
    	offsetParent: function() {
    		return this.map( function() {
    			var offsetParent = this.offsetParent;

    			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
    				offsetParent = offsetParent.offsetParent;
    			}

    			return offsetParent || documentElement;
    		} );
    	}
    } );

    // Create scrollLeft and scrollTop methods
    jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
    	var top = "pageYOffset" === prop;

    	jQuery.fn[ method ] = function( val ) {
    		return access( this, function( elem, method, val ) {

    			// Coalesce documents and windows
    			var win;
    			if ( isWindow( elem ) ) {
    				win = elem;
    			} else if ( elem.nodeType === 9 ) {
    				win = elem.defaultView;
    			}

    			if ( val === undefined ) {
    				return win ? win[ prop ] : elem[ method ];
    			}

    			if ( win ) {
    				win.scrollTo(
    					!top ? val : win.pageXOffset,
    					top ? val : win.pageYOffset
    				);

    			} else {
    				elem[ method ] = val;
    			}
    		}, method, val, arguments.length );
    	};
    } );

    // Support: Safari <=7 - 9.1, Chrome <=37 - 49
    // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
    // getComputedStyle returns percent when specified for top/left/bottom/right;
    // rather than make the css module depend on the offset module, just check for it here
    jQuery.each( [ "top", "left" ], function( _i, prop ) {
    	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
    		function( elem, computed ) {
    			if ( computed ) {
    				computed = curCSS( elem, prop );

    				// If curCSS returns percentage, fallback to offset
    				return rnumnonpx.test( computed ) ?
    					jQuery( elem ).position()[ prop ] + "px" :
    					computed;
    			}
    		}
    	);
    } );


    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
    	jQuery.each( {
    		padding: "inner" + name,
    		content: type,
    		"": "outer" + name
    	}, function( defaultExtra, funcName ) {

    		// Margin is only for outerHeight, outerWidth
    		jQuery.fn[ funcName ] = function( margin, value ) {
    			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
    				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

    			return access( this, function( elem, type, value ) {
    				var doc;

    				if ( isWindow( elem ) ) {

    					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
    					return funcName.indexOf( "outer" ) === 0 ?
    						elem[ "inner" + name ] :
    						elem.document.documentElement[ "client" + name ];
    				}

    				// Get document width or height
    				if ( elem.nodeType === 9 ) {
    					doc = elem.documentElement;

    					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
    					// whichever is greatest
    					return Math.max(
    						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
    						elem.body[ "offset" + name ], doc[ "offset" + name ],
    						doc[ "client" + name ]
    					);
    				}

    				return value === undefined ?

    					// Get width or height on the element, requesting but not forcing parseFloat
    					jQuery.css( elem, type, extra ) :

    					// Set width or height on the element
    					jQuery.style( elem, type, value, extra );
    			}, type, chainable ? margin : undefined, chainable );
    		};
    	} );
    } );


    jQuery.each( [
    	"ajaxStart",
    	"ajaxStop",
    	"ajaxComplete",
    	"ajaxError",
    	"ajaxSuccess",
    	"ajaxSend"
    ], function( _i, type ) {
    	jQuery.fn[ type ] = function( fn ) {
    		return this.on( type, fn );
    	};
    } );




    jQuery.fn.extend( {

    	bind: function( types, data, fn ) {
    		return this.on( types, null, data, fn );
    	},
    	unbind: function( types, fn ) {
    		return this.off( types, null, fn );
    	},

    	delegate: function( selector, types, data, fn ) {
    		return this.on( types, selector, data, fn );
    	},
    	undelegate: function( selector, types, fn ) {

    		// ( namespace ) or ( selector, types [, fn] )
    		return arguments.length === 1 ?
    			this.off( selector, "**" ) :
    			this.off( types, selector || "**", fn );
    	},

    	hover: function( fnOver, fnOut ) {
    		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    	}
    } );

    jQuery.each(
    	( "blur focus focusin focusout resize scroll click dblclick " +
    	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
    	function( _i, name ) {

    		// Handle event binding
    		jQuery.fn[ name ] = function( data, fn ) {
    			return arguments.length > 0 ?
    				this.on( name, null, data, fn ) :
    				this.trigger( name );
    		};
    	}
    );




    // Support: Android <=4.0 only
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    // Bind a function to a context, optionally partially applying any
    // arguments.
    // jQuery.proxy is deprecated to promote standards (specifically Function#bind)
    // However, it is not slated for removal any time soon
    jQuery.proxy = function( fn, context ) {
    	var tmp, args, proxy;

    	if ( typeof context === "string" ) {
    		tmp = fn[ context ];
    		context = fn;
    		fn = tmp;
    	}

    	// Quick check to determine if target is callable, in the spec
    	// this throws a TypeError, but we will just return undefined.
    	if ( !isFunction( fn ) ) {
    		return undefined;
    	}

    	// Simulated bind
    	args = slice.call( arguments, 2 );
    	proxy = function() {
    		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
    	};

    	// Set the guid of unique handler to the same of original handler, so it can be removed
    	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    	return proxy;
    };

    jQuery.holdReady = function( hold ) {
    	if ( hold ) {
    		jQuery.readyWait++;
    	} else {
    		jQuery.ready( true );
    	}
    };
    jQuery.isArray = Array.isArray;
    jQuery.parseJSON = JSON.parse;
    jQuery.nodeName = nodeName;
    jQuery.isFunction = isFunction;
    jQuery.isWindow = isWindow;
    jQuery.camelCase = camelCase;
    jQuery.type = toType;

    jQuery.now = Date.now;

    jQuery.isNumeric = function( obj ) {

    	// As of jQuery 3.0, isNumeric is limited to
    	// strings and numbers (primitives or objects)
    	// that can be coerced to finite numbers (gh-2662)
    	var type = jQuery.type( obj );
    	return ( type === "number" || type === "string" ) &&

    		// parseFloat NaNs numeric-cast false positives ("")
    		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    		// subtraction forces infinities to NaN
    		!isNaN( obj - parseFloat( obj ) );
    };

    jQuery.trim = function( text ) {
    	return text == null ?
    		"" :
    		( text + "" ).replace( rtrim, "" );
    };




    var

    	// Map over jQuery in case of overwrite
    	_jQuery = window.jQuery,

    	// Map over the $ in case of overwrite
    	_$ = window.$;

    jQuery.noConflict = function( deep ) {
    	if ( window.$ === jQuery ) {
    		window.$ = _$;
    	}

    	if ( deep && window.jQuery === jQuery ) {
    		window.jQuery = _jQuery;
    	}

    	return jQuery;
    };

    // Expose jQuery and $ identifiers, even in AMD
    // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
    // and CommonJS for browser emulators (#13566)
    if ( typeof noGlobal === "undefined" ) {
    	window.jQuery = window.$ = jQuery;
    }




    return jQuery;
    } );
    });

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

    const shuffle = list => {
        return list.sort(random());
    };

    const random = () => {
        return () => Math.random() - 0.5;
    };

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    };

    const move = (option) => {
        return new Promise((resolve => {
            option = Object.assign({
                count: 1,
                speed: 1000,
                callback: () => {}
            }, option);

            const sourceItem = jquery('.' + option.sourceClass);
            const visible = katanStore.isVisible(sourceItem);

            if (!visible) {
                sourceItem.show();
            }

            const targetItem = jquery('.' + option.targetClass);
            const sourceOffset = sourceItem.offset();
            const targetOffset = targetItem.offset();

            const body = jquery('body');
            const newResourceItem = sourceItem.clone()
                .removeClass(option.sourceClass);

            newResourceItem.appendTo(body)
                .css({
                    left: sourceOffset.left + 'px',
                    top: sourceOffset.top + 'px',
                    position: 'absolute',
                    zIndex: 2000
                });

            if (!visible) {
                sourceItem.hide();
            }

            const animationCss = Object.assign({
                left: targetOffset.left + 'px',
                top: targetOffset.top + 'px'
            }, option.animationCss);

            newResourceItem.animate(animationCss,
                option.speed,
                () => {
                    newResourceItem.remove();
                    return resolve();
                });
        }));
    };

    const createCastleList = (katanObject) => {
        const castleList = [];

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 11; j++) {
                if (i === 0 || i === 5) {
                    if (j >= 2 && j <= 8) {
                        let top = 0;

                        if (i === 5) {
                            top = i * (3 * katanObject.config.cell.height / 4);
                        }

                        if (j % 2 === i % 2) {
                            top += katanObject.config.cell.height / 4;
                        }

                        castleList.push({
                            left: j * (katanObject.config.cell.width / 2) - katanObject.config.castle.width / 2,
                            top: top - katanObject.config.castle.height / 2,
                            show: false,
                            hide: true,
                            empty: true,
                            i,
                            j
                        });
                    }
                } else if (i === 1 || i === 4) {
                    if (j >= 1 && j <= 9) {
                        let top = (3 * katanObject.config.cell.height / 4);

                        if (i === 4) {
                            top = i * (3 * katanObject.config.cell.height / 4);
                        }

                        if (j % 2 === i % 2) {
                            top += katanObject.config.cell.height / 4;
                        }

                        const show = j >= 3 && j <= 7;

                        castleList.push({
                            left: j * (katanObject.config.cell.width / 2) - katanObject.config.castle.width / 2,
                            top: top - katanObject.config.castle.height / 2,
                            show,
                            hide: !show,
                            empty: true,
                            i,
                            j
                        });
                    }
                } else if (i === 2 || i === 3) {
                    let top = 2 * (3 * katanObject.config.cell.height / 4);

                    if (i === 3) {
                        top = i * (3 * katanObject.config.cell.height / 4);
                    }

                    if (j % 2 === i % 2) {
                        top += katanObject.config.cell.height / 4;
                    }

                    const show = j >= 2 && j <= 8;

                    castleList.push({
                        left: j * (katanObject.config.cell.width / 2) - katanObject.config.castle.width / 2,
                        top: top - katanObject.config.castle.height / 2,
                        show,
                        hide: !show,
                        empty: true,
                        i,
                        j
                    });
                }
            }
        }

        castleList.forEach((castle, index) => castle.index = index);
        castleList.forEach((castle) => castle.playerIndex = -1);
        castleList.forEach((castle) => castle.city = false);
        castleList.forEach(castle => castle.constructable = castle.show);
        castleList.forEach(castle => castle.title = '');
        castleList.forEach(castle => castle.tradable = false);
        castleList.forEach(castle => castle.port = {
            enabled: false
        });

        castleList[0].port = {
            enabled: true,
            placement: 'top'
        };

        castleList[1].port = {
            enabled: true,
            placement: 'top'
        };

        castleList[2].port = {
            enabled: true,
            placement: 'top'
        };

        castleList[3].port = {
            enabled: true,
            placement: 'top'
        };

        castleList[4].port = {
            enabled: true,
            placement: 'top'
        };

        castleList[5].port = {
            enabled: true,
            placement: 'top'
        };

        castleList[6].port = {
            enabled: true,
            placement: 'top'
        };

        castleList[7].port = {
            enabled: true,
            placement: 'left'
        };

        castleList[8].port = {
            enabled: true,
            placement: 'left'
        };

        castleList[14].port = {
            enabled: true,
            placement: 'right'
        };

        castleList[15].port = {
            enabled: true,
            placement: 'right'
        };

        castleList[16].port = {
            enabled: true,
            placement: 'left'
        };

        castleList[17].port = {
            enabled: true,
            placement: 'left'
        };

        castleList[25].port = {
            enabled: true,
            placement: 'right'
        };

        castleList[26].port = {
            enabled: true,
            placement: 'right'
        };

        castleList[27].port = {
            enabled: true,
            placement: 'left'
        };

        castleList[28].port = {
            enabled: true,
            placement: 'left'
        };

        castleList[36].port = {
            enabled: true,
            placement: 'right'
        };

        castleList[37].port = {
            enabled: true,
            placement: 'right'
        };

        castleList[38].port = {
            enabled: true,
            placement: 'left'
        };

        castleList[39].port = {
            enabled: true,
            placement: 'left'
        };

        castleList[45].port = {
            enabled: true,
            placement: 'right'
        };

        castleList[46].port = {
            enabled: true,
            placement: 'right'
        };

        castleList[47].port = {
            enabled: true,
            placement: 'bottom'
        };

        castleList[48].port = {
            enabled: true,
            placement: 'bottom'
        };

        castleList[49].port = {
            enabled: true,
            placement: 'bottom'
        };

        castleList[50].port = {
            enabled: true,
            placement: 'bottom'
        };

        castleList[51].port = {
            enabled: true,
            placement: 'bottom'
        };

        castleList[52].port = {
            enabled: true,
            placement: 'bottom'
        };

        castleList[53].port = {
            enabled: true,
            placement: 'bottom'
        };

        const portList = [];

        for (let i = 0; i < 8; i++) {
            portList.push({
                trade: 3,
                type: 'all'
            });
        }

        for (let i = 0; i < 2; i++) {
            katanObject.resourceTypeList
                .map(resourceType => ({
                    trade: 2,
                    type: resourceType.type
                }))
                .forEach(port => portList.push(port));
        }

        castleList
            .filter(castle => castle.port.enabled)
            .map(castle => castle.index)
            .sort(random())
            .slice(0, portList.length)
            .forEach(i => {
                const port = portList.pop();

                castleList[i].port = {
                    ...castleList[i].port,
                    trade: port.trade,
                    type: port.type,
                    tradable: true
                };
            });

        castleList[0].roadIndexList = [0, 6];
        castleList[1].roadIndexList = [0, 1];
        castleList[2].roadIndexList = [1, 2, 7];
        castleList[3].roadIndexList = [2, 3];
        castleList[4].roadIndexList = [3, 4, 8];
        castleList[5].roadIndexList = [4, 5];
        castleList[6].roadIndexList = [5, 9];

        castleList[7].roadIndexList = [18, 10];
        castleList[8].roadIndexList = [6, 10, 11];
        castleList[9].roadIndexList = [11, 12, 19];
        castleList[10].roadIndexList = [7, 12, 13];
        castleList[11].roadIndexList = [13, 14, 20];
        castleList[12].roadIndexList = [8, 14, 15];
        castleList[13].roadIndexList = [15, 16, 21];
        castleList[14].roadIndexList = [9, 16, 17];
        castleList[15].roadIndexList = [17, 22];

        castleList[16].roadIndexList = [23, 33];
        castleList[17].roadIndexList = [18, 23, 24];
        castleList[18].roadIndexList = [24, 25, 34];
        castleList[19].roadIndexList = [19, 25, 26];
        castleList[20].roadIndexList = [26, 27, 35];
        castleList[21].roadIndexList = [20, 27, 28];
        castleList[22].roadIndexList = [28, 29, 36];
        castleList[23].roadIndexList = [21, 29, 30];
        castleList[24].roadIndexList = [30, 31, 37];
        castleList[25].roadIndexList = [22, 31, 32];
        castleList[26].roadIndexList = [32, 38];

        castleList[27].roadIndexList = [33, 39];
        castleList[28].roadIndexList = [39, 40, 49];
        castleList[29].roadIndexList = [34, 40, 41];
        castleList[30].roadIndexList = [41, 42, 50];
        castleList[31].roadIndexList = [35, 42, 43];
        castleList[32].roadIndexList = [43, 44, 51];
        castleList[33].roadIndexList = [36, 44, 45];
        castleList[34].roadIndexList = [45, 46, 52];
        castleList[35].roadIndexList = [37, 46, 47];
        castleList[36].roadIndexList = [47, 48, 53];
        castleList[37].roadIndexList = [38, 48];

        castleList[38].roadIndexList = [49, 54];
        castleList[39].roadIndexList = [54, 55, 62];
        castleList[40].roadIndexList = [50, 55, 56];
        castleList[41].roadIndexList = [56, 57, 63];
        castleList[42].roadIndexList = [51, 57, 58];
        castleList[43].roadIndexList = [58, 59, 64];
        castleList[44].roadIndexList = [52, 59, 60];
        castleList[45].roadIndexList = [60, 61, 65];
        castleList[46].roadIndexList = [53, 61];

        castleList[47].roadIndexList = [62, 66];
        castleList[48].roadIndexList = [66, 67];
        castleList[49].roadIndexList = [63, 67, 68];
        castleList[50].roadIndexList = [68, 69];
        castleList[51].roadIndexList = [64, 69, 70];
        castleList[52].roadIndexList = [70, 71];
        castleList[53].roadIndexList = [65, 71];

        castleList[0].castleIndexList = [1, 8];
        castleList[1].castleIndexList = [0, 2];
        castleList[2].castleIndexList = [1, 3, 10];
        castleList[3].castleIndexList = [2, 4];
        castleList[4].castleIndexList = [3, 5, 12];
        castleList[5].castleIndexList = [4, 6];
        castleList[6].castleIndexList = [5, 14];

        castleList[7].castleIndexList = [8, 17];
        castleList[8].castleIndexList = [0, 7, 9];
        castleList[9].castleIndexList = [8, 10, 19];
        castleList[10].castleIndexList = [2, 9, 11];
        castleList[11].castleIndexList = [10, 12, 21];
        castleList[12].castleIndexList = [4, 11 ,13];
        castleList[13].castleIndexList = [12, 14, 23];
        castleList[14].castleIndexList = [6, 13, 15];
        castleList[15].castleIndexList = [14, 25];

        castleList[16].castleIndexList = [17, 27];
        castleList[17].castleIndexList = [7, 16, 18];
        castleList[18].castleIndexList = [17, 19, 29];
        castleList[19].castleIndexList = [9, 18, 20];
        castleList[20].castleIndexList = [19, 21, 31];
        castleList[21].castleIndexList = [11, 20, 22];
        castleList[22].castleIndexList = [21, 23, 33];
        castleList[23].castleIndexList = [13, 22, 24];
        castleList[24].castleIndexList = [23, 25, 35];
        castleList[25].castleIndexList = [15, 24, 26];
        castleList[26].castleIndexList = [25, 37];

        castleList[27].castleIndexList = [16, 28];
        castleList[28].castleIndexList = [27, 29, 38];
        castleList[29].castleIndexList = [18, 28, 30];
        castleList[30].castleIndexList = [29, 31, 40];
        castleList[31].castleIndexList = [20, 30, 32];
        castleList[32].castleIndexList = [31, 33, 42];
        castleList[33].castleIndexList = [22, 32, 34];
        castleList[34].castleIndexList = [33, 35, 44];
        castleList[35].castleIndexList = [24, 34, 36];
        castleList[36].castleIndexList = [35, 37, 46];
        castleList[37].castleIndexList = [26, 36];

        castleList[38].castleIndexList = [28, 39];
        castleList[39].castleIndexList = [38, 40, 47];
        castleList[40].castleIndexList = [30, 39, 41];
        castleList[41].castleIndexList = [40, 42, 49];
        castleList[42].castleIndexList = [32, 41, 43];
        castleList[43].castleIndexList = [42, 44, 51];
        castleList[44].castleIndexList = [34, 43, 45];
        castleList[45].castleIndexList = [44, 46, 53];
        castleList[46].castleIndexList = [36, 45];

        castleList[47].castleIndexList = [39, 48];
        castleList[48].castleIndexList = [47, 49];
        castleList[49].castleIndexList = [41, 48, 50];
        castleList[50].castleIndexList = [49, 51];
        castleList[51].castleIndexList = [43, 50, 52];
        castleList[52].castleIndexList = [51, 53];
        castleList[53].castleIndexList = [45, 52];

        return castleList;
    };

    const setHideCastle = () => katanStore.update(katan => {
        katan.castleList =  katan.castleList
            .map(castle => {
                if (castle.playerIndex === -1) {
                    castle.show = false;
                    castle.hide = true;
                }

                return castle;
            });

        return katan;
    });

    const setNewCityRippleEnabled = () => katanStore.update(katan => {
        const player = katanStore.getActivePlayer();

        katan.castleList = katan.castleList.map(castle => {
            if (castle.playerIndex === player.index &&
                castle.city === false) {
                castle.ripple = true;
                castle.hide = false;
                castle.show = true;
            }

            return castle;
        });

        return katan;
    });

    const endMakeCastle = () => katanStore.update(katan => {
        katan.isMakeCastle = false;
        katanStore.doActionAndTurn();
        return katan;
    });

    const endMakeCity = (castleIndex) => katanStore.update(katan => {
        katan.isMakeCity = false;
        katanStore.doActionAndTurn();
        return katan;
    });

    const getPossibleCastleIndexList = (katan) => {
        return katan.castleList
            .filter(castle => castle.playerIndex === -1)
            .map(castle => {
                const castleLength = castle.castleIndexList
                    .filter(castleIndex => katan.castleList[castleIndex].playerIndex === -1)
                    .length;

                if (castleLength === castle.castleIndexList.length) {
                    const castleLength = castle.roadIndexList
                        .filter(roadIndex => {
                            const road = katan.roadList[roadIndex];
                            return road.playerIndex === katan.playerIndex
                        })
                        .length;

                    if (castleLength > 0) {
                        return castle.index;
                    }
                }

                return -1;
            })
            .filter(index => index >= 0);
    };

    const makeCastle = () => katanStore.update(katan => {
        console.log('makeCastle', katan.playerIndex);
        katan.isMakeCastle = true;
        setNewCastleRippleEnabled();
        return katan;
    });

    const makeCity = () => katanStore.update(katan => {
        console.log('makeCity', katan.playerIndex);
        katan.isMakeCity = true;
        setNewCityRippleEnabled();
        return katan;
    });

    const setCastleRippleDisabled = () => katanStore.update(katan => {
        katan.castleList = katan.castleList.map(castle => {
            castle.ripple = false;
            return castle;
        });

        return katan;
    });

    const castleClickable = (katan, castleIndex) => {
        const player = katanStore.getActivePlayer();
        const castle = katan.castleList[castleIndex];

        if (katan.isMakeCity) {
            if (castle.city || castle.playerIndex !== player.index) {
                return false;
            }
        } else {
            if (castle.playerIndex !== -1) {
                return false;
            }
        }

        return true;
    };

    const clickMakeCastle = (castleIndex) =>  {
        const katan = get_store_value(katanStore);

        if (!castleClickable(katan, castleIndex)) {
            return katan;
        }

        const player = katanStore.getActivePlayer();
        setCastle(castleIndex, player.index);

        console.log('clickMakeCastle', player.index, castleIndex, katan.isMakeCastle);

        setHideCastle();
        setCastleRippleDisabled();

        if (katan.isMakeCastle) {
            endMakeCastle();
        } else if (katan.isMakeCity){
            endMakeCity();
        } else {
            setRoadRippleEnabled(castleIndex);
        }
    };

    const setCastle = (castleIndex, playerIndex) => katanStore.update(katan => {
        let castle = katan.castleList[castleIndex];
        castle.playerIndex = playerIndex;
        castle.pick = false;

        if (katan.isMakeCity) {
            castle.title = '도시';
        } else {
            castle.title = '마을';
        }

        const player = katan.playerList[playerIndex];
        player.pickCastle += 1;
        katan.time = new Date().getTime();

        if (katan.isMakeCity) {
            player.resource.wheat -= 2;
            player.resource.iron -= 3;

            player.point.castle -= 1;
            player.point.city += 2;

            player.construction.castle += 1;
            player.construction.city -= 1;

            katan.castleList = katan.castleList
                .map(castle => {
                    if (castle.index === castleIndex) {
                        castle.city = true;
                    }

                    return castle;
                });
        } else {
            if (katan.isStartMode) {
                player.resource.tree -= 1;
                player.resource.mud -= 1;
                player.resource.sheep -= 1;
                player.resource.wheat -= 1;
            }

            player.point.castle += 1;

            player.construction.castle -= 1;
        }

        if (castle.port.tradable) {
            if (castle.port.type === 'all') {
                katan.resourceTypeList
                    .forEach(resourceType => {
                        if (player.trade[resourceType.type].count > castle.port.trade) {
                            player.trade[resourceType.type].count = castle.port.trade;
                        }
                    });
            } else {
                player.trade[castle.port.type].count = castle.port.trade;
            }
        }

        return katan;
    });

    const showConstructableCastle = () => katanStore.update(katan => {
        katan.message = '마을을 만들곳을 클릭하세요';

        katan.castleList = katan.castleList.map(castle => {
            if (castle.constructable && castle.playerIndex === -1) {
                let linkedCastleLength = castle.castleIndexList
                    .filter(castleIndex => katan.castleList[castleIndex].playerIndex !== -1)
                    .length;

                if (linkedCastleLength === 0) {
                    castle.show = true;
                    castle.hide = false;
                }
            }

            return castle;
        });

        return katan;
    });

    const setNewCastleRippleEnabled = () => katanStore.update(katan => {
        const castleIndexList = getPossibleCastleIndexList(katan);

        katan.castleList = katan.castleList.map(castle => {
            if (castleIndexList.includes(castle.index)) {
                castle.hide = false;
                castle.show = true;
            }

            return castle;
        });

        return katan;
    });

    const getLoadTopBySingle = (katanObject, multiple) => {
        return multiple * katanObject.config.cell.height / 8 - katanObject.config.load.width / 2 ;
    };

    const getLoadTop = (katanObject, currentRow, targetRow, currentMultiple, targetMultiple) => {
        let multiple = currentMultiple;

        if (currentRow === targetRow) {
            multiple = targetMultiple;
        }

        return getLoadTopBySingle(katanObject, multiple) ;
    };

    const createRoadList = (katanObject) => {
        const roadList = [];

        for (let i = 0; i <= 11; i++) {
            for (let j = 0; j <= 20; j++) {
                if (i === 0 || i === 11) {
                    if (j === 5 || j === 7 || j === 9 || j === 11 || j === 13 || j === 15) {
                        let top = getLoadTop(katanObject, i, 11, 1, 31);

                        roadList.push({
                            left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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
                        let top = getLoadTop(katanObject, i, 10, 4, 28);

                        roadList.push({
                            left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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
                        let top = getLoadTop(katanObject, i, 9, 7, 25);

                        roadList.push({
                            left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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

                        let top = getLoadTop(katanObject, i, 8, 10, 22);

                        roadList.push({
                            left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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

                        let top = getLoadTop(katanObject, i, 7, 13, 19);

                        roadList.push({
                            left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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
                        let top = getLoadTopBySingle(katanObject, 16);

                        roadList.push({
                            left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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

        roadList.forEach((road, index) => road.index = index);
        roadList.forEach(road => road.hide = true);
        roadList.forEach(road => road.show = false);
        roadList.forEach(road => road.ripple = false);
        roadList.forEach(road => road.playerIndex = -1);
        roadList.forEach(road => road.title = '');

        roadList[0].castleIndexList = [0, 1];
        roadList[1].castleIndexList = [1, 2];
        roadList[2].castleIndexList = [2, 3];
        roadList[3].castleIndexList = [3, 4];
        roadList[4].castleIndexList = [4, 5];
        roadList[5].castleIndexList = [5, 6];

        roadList[6].castleIndexList = [0, 8];
        roadList[7].castleIndexList = [2, 10];
        roadList[8].castleIndexList = [4, 12];
        roadList[9].castleIndexList = [6, 14];

        roadList[10].castleIndexList = [7, 8];
        roadList[11].castleIndexList = [8, 9];
        roadList[12].castleIndexList = [9, 10];
        roadList[13].castleIndexList = [10, 11];
        roadList[14].castleIndexList = [11, 12];
        roadList[15].castleIndexList = [12, 13];
        roadList[16].castleIndexList = [13, 14];
        roadList[17].castleIndexList = [14, 15];

        roadList[18].castleIndexList = [7, 17];
        roadList[19].castleIndexList = [9, 19];
        roadList[20].castleIndexList = [11, 21];
        roadList[21].castleIndexList = [13, 23];
        roadList[22].castleIndexList = [15, 25];

        roadList[23].castleIndexList = [16, 17];
        roadList[24].castleIndexList = [17, 18];
        roadList[25].castleIndexList = [18, 19];
        roadList[26].castleIndexList = [19, 20];
        roadList[27].castleIndexList = [20, 21];
        roadList[28].castleIndexList = [21, 22];
        roadList[29].castleIndexList = [22, 23];
        roadList[30].castleIndexList = [23, 24];
        roadList[31].castleIndexList = [24, 25];
        roadList[32].castleIndexList = [25, 26];

        roadList[33].castleIndexList = [16, 27];
        roadList[34].castleIndexList = [18, 29];
        roadList[35].castleIndexList = [20, 31];
        roadList[36].castleIndexList = [22, 33];
        roadList[37].castleIndexList = [24, 35];
        roadList[38].castleIndexList = [26, 37];

        roadList[39].castleIndexList = [27, 28];
        roadList[40].castleIndexList = [28, 29];
        roadList[41].castleIndexList = [29, 30];
        roadList[42].castleIndexList = [30, 31];
        roadList[43].castleIndexList = [31, 32];
        roadList[44].castleIndexList = [32, 33];
        roadList[45].castleIndexList = [33, 34];
        roadList[46].castleIndexList = [34, 35];
        roadList[47].castleIndexList = [35, 36];
        roadList[48].castleIndexList = [36, 37];

        roadList[49].castleIndexList = [28, 38];
        roadList[50].castleIndexList = [30, 40];
        roadList[51].castleIndexList = [32, 42];
        roadList[52].castleIndexList = [34, 44];
        roadList[53].castleIndexList = [36, 46];

        roadList[54].castleIndexList = [38, 39];
        roadList[55].castleIndexList = [39, 40];
        roadList[56].castleIndexList = [40, 41];
        roadList[57].castleIndexList = [41, 42];
        roadList[58].castleIndexList = [42, 43];
        roadList[59].castleIndexList = [43, 44];
        roadList[60].castleIndexList = [44, 45];
        roadList[61].castleIndexList = [45, 46];

        roadList[62].castleIndexList = [39, 47];
        roadList[63].castleIndexList = [41, 49];
        roadList[64].castleIndexList = [43, 51];
        roadList[65].castleIndexList = [45, 53];

        roadList[66].castleIndexList = [47, 48];
        roadList[67].castleIndexList = [48, 49];
        roadList[68].castleIndexList = [49, 50];
        roadList[69].castleIndexList = [50, 51];
        roadList[70].castleIndexList = [51, 52];
        roadList[71].castleIndexList = [52, 53];

        roadList[0].roadIndexList = [1, 6];
        roadList[1].roadIndexList = [0, 2, 7];
        roadList[2].roadIndexList = [1, 3, 7];
        roadList[3].roadIndexList = [2, 4, 8];
        roadList[4].roadIndexList = [3, 5, 8];
        roadList[5].roadIndexList = [4, 9];

        roadList[6].roadIndexList = [0, 10, 11];
        roadList[7].roadIndexList = [1, 2, 12 , 13];
        roadList[8].roadIndexList = [3, 4, 14, 15];
        roadList[9].roadIndexList = [5, 16, 17];

        roadList[10].roadIndexList = [6, 11, 18];
        roadList[11].roadIndexList = [6, 10, 12, 19];
        roadList[12].roadIndexList = [7, 11, 13, 19];
        roadList[13].roadIndexList = [7, 12, 14, 20];
        roadList[14].roadIndexList = [8, 13, 15, 20];
        roadList[15].roadIndexList = [8, 14, 16, 21];
        roadList[16].roadIndexList = [9, 15, 17, 21];
        roadList[17].roadIndexList = [9, 16, 22];

        roadList[18].roadIndexList = [10, 23, 24];
        roadList[19].roadIndexList = [11, 12, 25, 26];
        roadList[20].roadIndexList = [13, 14, 27, 28];
        roadList[21].roadIndexList = [15, 16, 29, 30];
        roadList[22].roadIndexList = [17, 31, 32];

        roadList[23].roadIndexList = [18, 24, 33];
        roadList[24].roadIndexList = [18, 23, 25, 34];
        roadList[25].roadIndexList = [19, 24, 26, 34];
        roadList[26].roadIndexList = [19, 25, 27, 35];
        roadList[27].roadIndexList = [20, 26, 28, 35];
        roadList[28].roadIndexList = [20, 27, 29, 36];
        roadList[29].roadIndexList = [21, 28, 30, 36];
        roadList[30].roadIndexList = [21, 29, 31, 37];
        roadList[31].roadIndexList = [22, 30, 32, 37];
        roadList[32].roadIndexList = [22, 31, 38];

        roadList[33].roadIndexList = [23, 39];
        roadList[34].roadIndexList = [24, 25, 40, 41];
        roadList[35].roadIndexList = [26, 27, 42, 43];
        roadList[36].roadIndexList = [28, 29, 44, 45];
        roadList[37].roadIndexList = [30, 31, 46, 47];
        roadList[38].roadIndexList = [32, 48];

        roadList[39].roadIndexList = [33, 40, 49];
        roadList[40].roadIndexList = [34, 39, 41, 49];
        roadList[41].roadIndexList = [34, 40, 42, 50];
        roadList[42].roadIndexList = [35, 41, 43, 50];
        roadList[43].roadIndexList = [35, 42, 44, 51];
        roadList[44].roadIndexList = [36, 43, 45, 51];
        roadList[45].roadIndexList = [36, 44, 46, 52];
        roadList[46].roadIndexList = [37, 45, 47, 52];
        roadList[47].roadIndexList = [37, 46, 48, 53];
        roadList[48].roadIndexList = [38, 47, 53];

        roadList[49].roadIndexList = [39, 40, 54];
        roadList[50].roadIndexList = [41, 42, 55, 56];
        roadList[51].roadIndexList = [43, 44, 57, 58];
        roadList[52].roadIndexList = [45, 46, 59, 60];
        roadList[53].roadIndexList = [47, 48, 61];

        roadList[54].roadIndexList = [49, 55, 62];
        roadList[55].roadIndexList = [50, 54, 56, 62];
        roadList[56].roadIndexList = [50, 55, 57, 63];
        roadList[57].roadIndexList = [51, 56, 58, 63];
        roadList[58].roadIndexList = [51, 57, 59, 64];
        roadList[59].roadIndexList = [52, 58, 60, 64];
        roadList[60].roadIndexList = [52, 59, 61, 65];
        roadList[61].roadIndexList = [53, 60, 65];

        roadList[62].roadIndexList = [54, 55, 66];
        roadList[63].roadIndexList = [56, 57, 66, 68];
        roadList[64].roadIndexList = [58, 59, 69, 70];
        roadList[65].roadIndexList = [60, 61, 71];

        roadList[66].roadIndexList = [62, 67];
        roadList[67].roadIndexList = [63, 66, 68];
        roadList[68].roadIndexList = [63, 67, 69];
        roadList[69].roadIndexList = [64, 68, 70];
        roadList[70].roadIndexList = [64, 69, 71];
        roadList[71].roadIndexList = [65, 70];
        
        return roadList;
    };

    const recomputeRoad = () =>  {
        recomputeLongRoad();
        recomputeRoadPoint();
    };

    const recomputeRoadPoint = () => katanStore.update(katan => {
        const player = katanStore.getActivePlayer();
        const otherPlayer = katanStore.getOtherPlayer(katan);

        if (player.maxRoadLength >= 5) {
            if (player.point.road === 0) {
                if (player.maxRoadLength > otherPlayer.maxRoadLength) {
                    alert('최장 교역로를 달성하였습니다.\n2점을 회득합니다.');
                    player.point.road = 2;
                }
            }

            if (otherPlayer.point.road > 0) {
                if (player.maxRoadLength > otherPlayer.maxRoadLength) {
                    otherPlayer.point.road = 0;
                }
            }
        }

        return katan;
    });

    const recomputeLongRoad = () => {
        katanStore.update(katan => {
            katan.playerList
                .forEach(player => {
                    const list = katan.roadList
                        .filter(road => road.playerIndex === player.index);

                    list.forEach(road => {
                        processLinkedRoadList(katan, player, road, []);
                    });
                });

            return katan;
        });
    };

    const processLinkedRoadList = (katan, player, road, resultList) => {
        if (resultList.includes(road.index)) {
            return;
        }

        const resultListLength = resultList.length;

        if (resultListLength >= 2) {
            const a = getIntersectionCastle(katan,
                resultList[resultListLength - 1],
                road.index);

            const b = getIntersectionCastle(katan,
                resultList[resultListLength - 2],
                resultList[resultListLength - 1]);

            if (a === b) {
                return;
            }
        }

        resultList.push(road.index);

        if (road.playerIndex !== player.index) {
            return;
        }

        const roadList = getLinkedRoadList(katan, player, road);

        if (resultList.length > player.maxRoadLength) {
            player.maxRoadLength = resultList.length;
        }

        if (roadList.length === 0) {
            return;
        }

        roadList.forEach(currentRoad => {
            processLinkedRoadList(katan, player, currentRoad, [...resultList]);
        });
    };

    const getIntersectionCastle = (katan, roadIndexA, roadIndexB) => {
        const listA = katan.roadList[roadIndexA].castleIndexList;
        const listB = katan.roadList[roadIndexB].castleIndexList;
        return listA.find(index => listB.includes(index));
    };

    const getLinkedRoadList = (katan, player, road) => {
        const roadIndex = road.index;

        return katan.roadList[roadIndex]
            .roadIndexList
            .map(index => katan.roadList[index])
            .filter(road => road.playerIndex === player.index);
    };

    const setHideRoad = () => katanStore.update(katan => {
        katan.roadList =  katan.roadList
            .map(road => {
                if (road.playerIndex === -1) {
                    road.show = false;
                    road.hide = true;
                }

                return road;
            });

        return katan;
    });

    const setRoadRippleDisabled = () => katanStore.update(katan => {
        katan.roadList = katan.roadList
            .map(road => {
                road.ripple = false;
                return road;
            });

        return katan;
    });

    const clickMakeRoad = (roadIndex) =>{
        const katan = get_store_value(katanStore);
        const player = katanStore.getActivePlayer();

        console.log('clickMakeRoad', player.index, roadIndex);

        if (katan.roadList[roadIndex].playerIndex !== -1) {
            return;
        }

        setRoad(roadIndex, player.index);
        setHideRoad();
        setRoadRippleDisabled();

        if (katan.isStartMode) {
            endMakeRoad();
            return;
        }

        showConstructableCastle();
        endMakeRoad();
        katanStore.turn();

        if (katanStore.isStartable()) {
            katanStore.start();
        }
    };

    const getPossibleRoadTotalLength = (katan) => {
        return katan.roadList
            .map(road => getPossibleRoadLength(katan, road))
            .reduce((a, b) => a + b);
    };

    const getPossibleRoadLength = (katan, road) => {
        if (road.playerIndex === -1) {
            return road.roadIndexList
                .map(roadIndex => katan.roadList[roadIndex])
                .filter(currentRoad => {
                    const castleListA = road.castleIndexList;
                    const castleListB = currentRoad.castleIndexList;
                    const currentCastleIndex = castleListA
                        .find(castleIndex => castleListB.includes(castleIndex));

                    if (currentCastleIndex) {
                        const castle = katan.castleList[currentCastleIndex];

                        return currentRoad.playerIndex === katan.playerIndex &&
                            (castle.playerIndex === -1 || castle.playerIndex === katan.playerIndex)
                    }

                    return currentRoad.playerIndex === katan.playerIndex;
                })
                .length;
        }

        return 0;
    };

    const setNewRoadRippleEnabled = () => {
        katanStore.update(katan => {
            katan.roadList = katan.roadList
                .map(road => {
                    let length = getPossibleRoadLength(katan, road);

                    if (length > 0) {
                        road.hide = false;
                        road.show = true;
                    }

                    return road;
                });

            return katan;
        });

        const katan = get_store_value(katanStore);
        const roadLength = katan.roadList.filter(road => road.show).length;
        const player = katanStore.getActivePlayer();

        if (katan.isMakeRoad2Mode) {
            if (player.construction.road === 0 || roadLength === 0) {
                alert('도로를 만들수 없습니다.');
                katanStore.unsetMakeRoad2Mode();
                katanStore.unsetMakeRoadMode();
                setHideRoad();
                return;
            }

            if (player.construction.road === 1 || roadLength === 1) {
                alert('도로를 1개만 만들 수 있습니다.');
                katanStore.unsetMakeRoad2Mode();
                katanStore.update(katan => {
                    katan.makeRoadCount = 1;
                    return katan;
                });
            }
        }
    };

    const makeRoad = () => {
        katanStore.update(katan => {
            console.log('makeRoad', katan.playerIndex);
            katan.isMakeRoadMode = true;
            return katan;
        });

        setNewRoadRippleEnabled();
    };

    const setRoadRippleEnabled = (castleIndex) => katanStore.update(katan => {
        katan.message = '도로을 만들곳을 선택하세요.';
        let roadIndexList = katan.castleList[castleIndex].roadIndexList;

        katan.roadList = katan.roadList
            .map(road => {

                let linkLength = roadIndexList.filter(roadIndex => roadIndex === road.index)
                    .filter(roadIndex => katan.roadList[roadIndex].playerIndex === -1)
                    .length;

                if (linkLength > 0) {
                    road.hide = false;
                    road.show = true;
                }

                return road;
            });

        return katan;
    });

    const endMakeRoad = () => katanStore.update(katan => {
        if (katan.isMakeRoad2Mode) {
            katan.makeRoadCount += 1;
        } else {
            katan.isMakeRoadMode = false;
        }

        if (katan.isStartMode) {
            if (katan.isMakeRoad2Mode && katan.makeRoadCount === 1) {
                makeRoad();
            } else {
                katan.isMakeRoad2Mode = false;
                katan.isMakeRoadMode = false;
                katan.makeRoadCount = 0;
                katanStore.doActionAndTurn();
            }
        }

        return katan;
    });

    const setRoad = (roadIndex, playerIndex) => katanStore.update(katan => {
        let road = katan.roadList[roadIndex];
        road.playerIndex = playerIndex;
        road.pick = false;
        road.title = '도로';

        const player = katan.playerList[playerIndex];
        player.pickRoad += 1;
        player.construction.road -= 1;

        if (katan.isStartMode &&
            katan.isMakeRoadMode &&
            katan.isMakeRoad2Mode === false) {
            player.resource.tree -= 1;
            player.resource.mud -= 1;
        }

        return katan;
    });

    const createPlayerList = () => {
        const playerList = [
            {
                color: '#E4A2AE',
                name: '다은',
                turn: true,
                pickCastle: 0,
                pickRoad: 0,
                image: 'apeach.png',
                maxRoadLength: 0,
                resourceSum: 0
            },
            {
                color: '#90CDEA',
                name: '아빠',
                turn: false,
                pickCastle: 0,
                pickRoad: 0,
                image: 'lion.png',
                maxRoadLength: 0,
                resourceSum: 0
            }
        ];

        playerList.forEach((player, i) => {
            player.index = i;

            player.pickCastle =  0;
            player.pickRoad = 0;

            player.resource = {
                tree: 0,
                mud: 0,
                wheat: 0,
                sheep: 0,
                iron: 0
            };

            player.point = {
                knight: 0,
                road: 0,
                point: 0,
                castle: 0,
                city: 0,
                sum: 0
            };

            player.trade = {
                tree: {
                    enable: false,
                    action: false,
                    count: 4
                },
                mud: {
                    enable: false,
                    action: false,
                    count: 4
                },
                wheat: {
                    enable: false,
                    action: false,
                    count: 4
                },
                sheep: {
                    enable: false,
                    action: false,
                    count: 4
                },
                iron: {
                    enable: false,
                    action: false,
                    count: 4
                }
            };

            player.construction = {
                castle: 5,
                city: 4,
                road: 15,
                knight: 0
            };

            player.make = {
                road: false,
                castle: false,
                city: false,
                dev: false
            };

            player.exchange = false;
        });

        return playerList;
    };

    const recomputePlayer = () => {
        recomputeRoad();

        katanStore.update(katan => {
            katan.playerList = katan.playerList
                .map(player => {
                    let sum = player.point.knight;
                    sum += player.point.road;
                    sum += player.point.point;
                    sum += player.point.castle;
                    sum += player.point.city;

                    player.point.sum = sum;
                    player.resourceSum = katanStore.sumResource(katan, player);

                    katan.resourceTypeList
                        .forEach(typeObject => {
                            const type = typeObject.type;
                            player.trade[type].action =
                                katanStore.isActive(katan) &&
                                player.index === katan.playerIndex;

                            player.trade[type].enable =
                                player.resource[type] >= player.trade[type].count;
                        });

                    player.make.road =
                        katanStore.isActive(katan) &&
                        player.index === katan.playerIndex &&
                        player.construction.road >= 1 &&
                        player.resource.tree >= 1 &&
                        player.resource.mud >= 1 &&
                        getPossibleRoadTotalLength(katan) > 0;

                    player.make.castle =
                        katanStore.isActive(katan) &&
                        player.index === katan.playerIndex &&
                        player.construction.castle >= 1 &&
                        player.resource.tree >= 1 &&
                        player.resource.mud >= 1 &&
                        player.resource.wheat >= 1 &&
                        player.resource.sheep >= 1 &&
                        getPossibleCastleIndexList(katan).length > 0;

                    const castleLength = katan.castleList
                        .filter(castle => castle.playerIndex === katan.playerIndex)
                        .filter(castle => castle.city === false)
                        .length;

                    player.make.city =
                        katanStore.isActive(katan) &&
                        player.index === katan.playerIndex &&
                        castleLength > 0 &&
                        player.construction.city >= 1 &&
                        player.resource.iron >= 3 &&
                        player.resource.wheat >= 2;

                    player.make.dev =
                        katanStore.isActive(katan) &&
                        player.index === katan.playerIndex &&
                        player.resource.iron >= 1 &&
                        player.resource.sheep >= 1 &&
                        player.resource.wheat >= 1;

                    if (player.point.sum === 10) {
                        katan.isEnd = true;
                        alert(`${player.name} 승리`);
                        return player;
                    }

                    return player;
                });

            return katan;
        });
    };

    const createResourceList = (katanObject) => {
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

        let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
        numberList = shuffle(numberList);

        resourceList = resourceList
            .map((resource, index) => {
                if (resource.type === 'dessert') {
                    resource.number = 7;
                    resource.numberIndex = 1;
                } else {
                    resource.number = numberList.pop();

                    if (resource.number === 2 || resource.number === 12) {
                        resource.numberIndex = 1;
                    } else {
                        if (numberList.includes(resource.number)) {
                            resource.numberIndex = 1;
                        } else {
                            resource.numberIndex = 2;
                        }
                    }
                }

                resource.burglar = false;

                if (resource.number === 7) {
                    resource.burglar = true;
                }

                return resource;
            })
            .sort(random())
            .map((resource, index) => {
                let left = 0;
                let top = 0;

                if (0 <= index && index <= 2) {
                    left = katanObject.config.cell.width + katanObject.config.cell.width * index;
                } else if (3 <= index && index <= 6) {
                    left = katanObject.config.cell.width / 2 + katanObject.config.cell.width * (index - 3);
                    top = 3 * katanObject.config.cell.height / 4;
                } else if (7 <= index && index <= 11) {
                    left = katanObject.config.cell.width * (index - 7);
                    top = 2 * (3 * katanObject.config.cell.height / 4);
                } else if (12 <= index && index <= 15) {
                    left = katanObject.config.cell.width / 2 + katanObject.config.cell.width * (index - 12);
                    top = 3 * (3 * katanObject.config.cell.height / 4);
                } else if (16 <= index && index <= 18) {
                    left = katanObject.config.cell.width * (index - 15);
                    top = 4 * (3 * katanObject.config.cell.height / 4);
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
        
        return resourceList;
    };

    const moveResource = async (number, numberIndex = 1) => {
        const katan = get_store_value(katanStore);

        const resourceList = katan.resourceList
            .filter(resource => resource.number === number)
            .filter(resource => !resource.burglar)
            .filter(resource => resource.numberIndex === numberIndex);

        for (let playerIndex = 0; playerIndex < katan.playerList.length; playerIndex++) {
            const currentPlayerIndex = katan.playerList[playerIndex].index;

            for (let resourceIndex = 0; resourceIndex < resourceList.length; resourceIndex++) {
                const resource = resourceList[resourceIndex];

                for (let castleIndex = 0; castleIndex < resource.castleIndexList.length; castleIndex++) {
                    const currentCastleIndex = resource.castleIndexList[castleIndex];
                    const castle = katan.castleList[currentCastleIndex];
                    const castlePlayerIndex = castle.playerIndex;

                    if (castlePlayerIndex === currentPlayerIndex) {
                        let resourceCount = 1;

                        if (castle.city) {
                            resourceCount = 2;
                        }

                        for (let k = 0; k < resourceCount; k++) {
                            await move({
                                sourceClass: `resource_${resource.index}`,
                                targetClass: `player_${castlePlayerIndex}_${resource.type}`
                            });

                            updateResource(castle, castlePlayerIndex, resource);
                        }
                    }
                }
            }
        }
    };

    const updateResource = (castle, playerIndex, resource) => katanStore.update(katan => {
        katan.playerList[playerIndex].resource[resource.type] += 1;
        recomputePlayer();
        return katan;
    });

    const takeResource = async () => {
        const katan = get_store_value(katanStore);
        const other = katanStore.getOtherPlayer(katan);

        let resourceTypeList = katan.resourceTypeList
            .map(resourceType => {
                return {
                    type: resourceType.type,
                    count: other.resource[resourceType.type]
                }
            });

        resourceTypeList = resourceTypeList
            .filter(item => item.count > 0)
            .sort(random());

        if (resourceTypeList.length > 0) {
            const resource = resourceTypeList[0];
            const player = katanStore.getActivePlayer();

            const playerIndex = player.index;
            const otherPlayerIndex = other.index;

            const sourceClass = `player_${otherPlayerIndex}_${resource.type}`;
            const targetClass = `player_${playerIndex}_${resource.type}`;

            await move({
                sourceClass,
                targetClass
            });

            updateTakeResource(resource);
        }
    };

    const updateTakeResource = (resource) => katanStore.update(katan => {
        const player = katanStore.getActivePlayer();
        const other = katanStore.getOtherPlayer(katan);

        player.resource[resource.type] = player.resource[resource.type] + 1;
        other.resource[resource.type] = other.resource[resource.type] - 1;

        return katan;
    });

    const knightCard = () => {
        alert('기사\n도둑을 옮기고 자원하나를 빼았습니다.');

        const katan = get_store_value(katanStore);
        const player = katanStore.getCurrentPlayer(katan);
        katanStore.setKnightMode();
        katanStore.readyMoveBurglar();

        player.construction.knight += 1;

        if (player.construction.knight >= 3) {
            const other = katanStore.getOtherPlayer(katan);

            if (player.construction.knight > other.construction.knight) {
                if (player.point.knight === 0) {
                    alert('최강 기사단을 달성하였습니다.\n2점을 회득합니다.');
                }

                player.point.knight = 2;

                if (other.point.knight === 2) {
                    other.point.knight = 0;
                }
            }
        }

        recomputePlayer();
    };

    const roadCard = () => {
        alert('도로 2개를 만드세요.');
        katanStore.setMakeRoad2Mode();
        katanStore.makeRoad();
    };

    const takeResourceCard = async () => {
        alert('상대방의 자원 2개를 받습니다.');
        katanStore.setTakeResourceMode();
        await takeResource();
        await takeResource();
        katanStore.unsetTakeResourceMode();
    };

    const getResourceCard = () => {
        alert('자원 2개를 받으세요.');
        katanStore.setGetResourceMode();
    };

    const getPointCard = () => {
        alert('1점을 얻었습니다.');
        katanStore.plusPoint();
    };

    const openCard = async () => {
        let cardType;

        katanStore.update(katan => {
            const card = katan.cardList.pop();
            katan.afterCardList = [...katan.afterCardList, card];

            cardType = card.type;

            console.log('openCard', katan.playerIndex, card.type);

            const player = katanStore.getActivePlayer();

            player.resource.sheep -= 1;
            player.resource.wheat -= 1;
            player.resource.iron -= 1;

            return katan;
        });

        if (cardType === 'point') {
            getPointCard();
        } else if (cardType === 'knight') {
            knightCard();
        } else if (cardType === 'road') {
            roadCard();
        } else if (cardType === 'getResource') {
            getResourceCard();
        } else if (cardType === 'takeResource') {
            await takeResourceCard();
        }

        katanStore.doActionAndTurn();
    };

    const createCardList = () => {
        const cardList = [];

        for (let i = 0; i < 5; i++) {
            cardList.push({
                type: 'point'
            });
        }

        for (let i = 0; i < 14; i++) {
            cardList.push({
                type: 'knight'
            });
        }

        for (let i = 0; i < 2; i++) {
            cardList.push({
                type: 'road'
            });
        }

        for (let i = 0; i < 2; i++) {
            cardList.push({
                type: 'getResource'
            });
        }

        for (let i = 0; i < 2; i++) {
            cardList.push({
                type: 'takeResource'
            });
        }

        return shuffle(cardList);
    };

    const katanObject = {
        testDice: 0,
        maxRoadLength: 0,
        resourceTypeList: [
            {
                type: 'tree'
            },
            {
                type: 'mud'
            },
            {
                type: 'wheat'
            },
            {
                type: 'sheep'
            },
            {
                type: 'iron'
            }
        ],
        rollDice: false,
        action: false,
        isGetResource: false,
        isTakeResource: false,
        isMakeRoadMode: false,
        isMakeRoad2Mode: false,
        makeRoadCount: 0,
        getResourceCount: 0,
        takeResourceFromBurglarCount: 0,
        takeResourceFromBurglarCompleteCount: 0,
        isMakeCastle: false,
        isMakeCity: false,
        construction: false,
        isKnightMode: false,
        isBurglarMode: false,
        message: '마을을 만들곳을 클릭하세요',
        diceDisabled: true,
        dice: [6, 6],
        sumDice: 12,
        mode: 'ready',
        isReady: true,
        isStartMode: false,
        playerIndex: 0,
        showResourceModal: false,
        isEnd: false,
        config: {
            debug: false,
            cell: {
                width: 130,
                height: 130,
                margin: 2
            },
            castle: {
                width: 32,
                height: 32,
            },
            load: {
                width: 32,
                height: 32,
            },
            number: {
                width: 60,
                height: 60,
            },
            resource: {
                width: 60,
                height: 60,
            },
            burglar: {
                width: 90,
                height: 90,
            },
            selectedColor: 'blueviolet'
        }

    };

    katanObject.cardList = createCardList();
    katanObject.afterCardList = [];

    katanObject.playerList = createPlayerList();
    katanObject.castleList = createCastleList(katanObject);
    katanObject.roadList = createRoadList(katanObject);
    katanObject.resourceList = createResourceList(katanObject);

    const { subscribe: subscribe$1, set, update: update$1 } = writable(katanObject);

    const katanStore = {
        subscribe: subscribe$1,
        set,
        update: update$1,

        plus: (playerIndex, resourceType) => {
            update$1(katan => {
                katan.playerList[playerIndex].resource[resourceType]++;
                return katan;
            });

            recomputePlayer();
        },

        turn: () => update$1(katan => {
            katanStore.getActivePlayer();

            if (katanStore.isStartable()) {
                katanStore.setDiceEnabled();
            }

            katanStore.unsetRollDice();
            recomputePlayer();

            katan.playerList = katan.playerList
                .map((player, i) => {
                    player.turn = !player.turn;

                    if (player.turn) {
                        katan.playerIndex = i;
                    }

                    return player;
                });

            katan.action = false;

            if (katan.isStartMode) {
                katan.message = '주사위를 굴리세요.';
                katan.diceDisabled = false;
            }

            return katan;
        }),

        start: () => update$1(katan => {
            katan.message = '주사위를 굴리세요.';

            katan.mode = 'start';
            katan.isStartMode = true;
            katan.isReady = false;

            setCastleRippleDisabled();
            setRoadRippleDisabled();

            katan.castleList = katan.castleList
                .map(castle => {
                    if (castle.playerIndex === -1) {
                        castle.show = false;
                        castle.hide = true;
                    }

                    return castle;
                });

            katanStore.setDiceEnabled();

            return katan;
        }),

        moveBurglar: async (resourceIndex) => {
            const katan = get_store_value(katanStore);

            if (katan.resourceList[resourceIndex].burglar) {
                return;
            }

            await takeResource();

            katanStore.unsetBurglarMode();
            katanStore.unsetKnightMode();

            katanStore.setNumberRippleDisabled();

            update$1(katan => {
                katan.resourceList = katan.resourceList
                    .map(resource => {
                        resource.burglar = resource.index === resourceIndex;
                        return resource;
                    });

                return katan;
            });

            katanStore.doActionAndTurn();
        },

        setDiceDisabled: () => update$1(katan => {
            katan.diceDisabled = true;
            return katan;
        }),

        setDiceEnabled: () => update$1(katan => {
            katan.diceDisabled = false;
            return katan;
        }),

        isVisible: item => {
            return item.is(':visible')
        },

        doActionAndTurn: async () => {
            recomputePlayer();

            const katan = get_store_value(katanStore);

            if (katan.isEnd) {
                return;
            }

            const hasAction = katanStore.hasAction();

            console.log('>>> hasAction', hasAction);

            if (hasAction) {
                katanStore.doAction();
            } else {
                katanStore.turn();
            }

            await tick();
        },

        doAction: () => update$1(katan => {
            katan.message = '자원을 교환하거나 건설하세요.';
            katanStore.setDiceDisabled();
            katan.action = true;
            return katan;
        }),

        hasAction: () => {
            const katan = get_store_value(katanStore);
            const player = katanStore.getActivePlayer();

            return katan.isKnightMode ||
                katan.isGetResource ||
                katan.isMakeRoad2Mode ||
                player.trade.tree.enable ||
                player.trade.mud.enable ||
                player.trade.wheat.enable ||
                player.trade.sheep.enable ||
                player.trade.iron.enable ||
                player.make.road ||
                player.make.castle ||
                player.make.city ||
                player.make.dev;
        },

        clickMakeRoad: (roadIndex) => clickMakeRoad(roadIndex),
        clickMakeCastle: (castleIndex) => clickMakeCastle(castleIndex),

        setRollDice: () => update$1(katan => {
            katan.rollDice = true;
            return katan;
        }),

        unsetRollDice: () => update$1(katan => {
            katan.rollDice = false;
            return katan;
        }),

        createMoveResourceAnimationOption : (number, numberIndex, numberCount) => {
            let sourceClass = `display-dice-number-${numberIndex}`;
            let targetClass = `number_${number}_${numberIndex}`;

            if (numberCount === 1) {
                targetClass = `number_${number}`;
            }

            return {
                sourceClass,
                targetClass,
                animationCss: {
                    width: '70px',
                    height: '70px',
                    fontSize: '50px',
                    lineHeight: '70px'
                }
            }
        },

        play: async () => {
            katanStore.roll();

            await tick();

            const katan = get_store_value(katanStore);
            const number = katan.sumDice;

            console.log('play', katan.playerIndex, number);

            let numberCount = 2;

            if (number === 2 || number === 7 || number === 12) {
                numberCount = 1;
            }

            if (numberCount === 1) {
                const animationPromiseList = [];

                for (let i = 1; i <= 2; i++) {
                    const moveResourceAnimationOption = katanStore
                        .createMoveResourceAnimationOption(number, i, numberCount);

                    animationPromiseList.push(move(moveResourceAnimationOption));
                }

                await Promise.all(animationPromiseList);

                katanStore.setSelectedNumberRippleEnabled(number);
                await sleep(1500);

                katanStore.setNumberRippleDisabled(number);

                if (number === 7) {
                    await katanStore.takeResourceByBurglar();
                    katanStore.setBurglarMode();
                    katanStore.readyMoveBurglar();
                    return;
                } else {
                    await moveResource(number);
                }
            } else {
                for (let i = 1; i <= 2; i++) {
                    const moveResourceAnimationOption = katanStore
                        .createMoveResourceAnimationOption(number, i, numberCount);

                    await move(moveResourceAnimationOption);

                    katanStore.setSelectedNumberRippleEnabled(number, i);
                    await sleep(1500);

                    katanStore.setNumberRippleDisabled(number, i);
                    await moveResource(number, i);
                }
            }

            katanStore.doActionAndTurn();
        },

        sumResource: (katan, player) => {
            return katan.resourceTypeList
                .map(typeObject => player.resource[typeObject.type])
                .reduce((a, b) => a + b);
        },

        takeResourceByBurglar: async () => {
            const katan = get_store_value(katanStore);

            for (let i = 0; i < katan.playerList.length; i++) {
                const player = katan.playerList[i];
                const resourceSum = katanStore.sumResource(katan, player);

                if (resourceSum >= 8) {
                    const resourceCount = Math.floor(resourceSum / 2);
                    let targetResourceList = [];

                    katan.resourceTypeList
                        .forEach(typeObject => {
                            const count = player.resource[typeObject.type];

                            for (let i = 0; i < count; i++) {
                                targetResourceList.push(typeObject.type);
                            }
                        });

                    targetResourceList = targetResourceList.sort(random());

                    for (let j = 0; j < resourceCount; j++) {
                        const type = targetResourceList.pop();
                        const sourceClass = `player_${player.index}_${type}`;
                        const targetClass = 'burglar';

                        await move({
                            sourceClass,
                            targetClass
                        });

                        katanStore.updatePlayerResource(player.index, type);
                        recomputePlayer();
                    }
                }
            }
        },

        updatePlayerResource: (playerIndex, type) => update$1(katan => {
            const player = katan.playerList[playerIndex];
            player.resource[type] -= 1;
            return katan;
        }),

        readyMoveBurglar: () => update$1(katan => {
            katan.message = '도둑의 위치를 선택하세요.';
            katanStore.setNumberRippleEnabled();
            return katan;
        }),

        setKnightMode: () => update$1(katan => {
            katan.isKnightMode = true;
            return katan;
        }),

        unsetKnightMode: () => update$1(katan => {
            katan.isKnightMode = false;
            return katan;
        }),

        setMakeRoad2Mode: () => update$1(katan => {
            katan.isMakeRoad2Mode = true;
            return katan;
        }),

        unsetMakeRoad2Mode: () => update$1(katan => {
            katan.isMakeRoad2Mode = false;
            return katan;
        }),

        setMakeRoadMode: () => update$1(katan => {
            katan.isMakeRoadMode = true;
            return katan;
        }),

        unsetMakeRoadMode: () => update$1(katan => {
            katan.isMakeRoadMode = false;
            return katan;
        }),

        setBurglarMode: () => update$1(katan => {
            katan.isBurglarMode = true;
            return katan;
        }),

        unsetBurglarMode: () => update$1(katan => {
            katan.isBurglarMode = false;
            return katan;
        }),

        setTakeResourceMode: () => update$1(katan => {
            katan.isTakeResource = true;
            return katan;
        }),

        unsetTakeResourceMode: () => update$1(katan => {
            katan.isTakeResource = false;
            return katan;
        }),

        setGetResourceMode: () => update$1(katan => {
            katan.isGetResource = true;
            return katan;
        }),

        unsetGetResourceMode: () => update$1(katan => {
            katan.isGetResource = false;
            return katan;
        }),

        roll: () => update$1(katan => {
            katanStore.setDiceDisabled();
            const a = Math.floor(Math.random() * 6) + 1;
            const b = Math.floor(Math.random() * 6) + 1;

            let number = a + b;

            if (katan.testDice !== 0) {
                number = katan.testDice;
            }

            console.log('>>> number', number);

            katan.rollDice = true;

            console.log('>>> katan.rollDice', katan.rollDice);

            katan.dice[0] = a;
            katan.dice[1] = b;
            katan.sumDice = number;
            return katan;
        }),

        getNumber: () => katan.dice[0] =  + katan.dice[1],

        isStartable: () => {
            const katan = get_store_value(katanStore);

            let pickCompletePlayerLength = katan.playerList
                .filter(player => player.pickCastle === 2)
                .filter(player => player.pickRoad === 2)
                .length;

            return pickCompletePlayerLength === katan.playerList.length;
        },

        getActivePlayer: () => {
            const katan = get_store_value(katanStore);
            return katan.playerList[katan.playerIndex];
        },

        getCurrentPlayer: (katan) => {
            return katan.playerList
                .find(player => player.turn);
        },

        makeRoad: () => makeRoad(),

        openCard: () => openCard(),

        getResource: (resourceType) => {
            update$1(katan => {
                const player = katanStore.getActivePlayer();
                katan.getResourceCount += 1;
                player.resource[resourceType] += 1;

                if (katan.getResourceCount >= 2) {
                    katan.isGetResource = false;
                    katan.getResourceCount = 0;
                }

                return katan;
            });

            const katan = get_store_value(katanStore);

            if (!katan.isGetResource) {
                katanStore.doActionAndTurn();
            }
        },

        getOtherPlayer: (katan) => {
            let playerIndex = katan.playerIndex;

            if (playerIndex === 0) {
                playerIndex = 1;
            } else {
                playerIndex = 0;
            }

            return katan.playerList[playerIndex];
        },

        makeCastle: () => makeCastle(),

        makeCity: () => makeCity(),

        setRoadRippleDisabled: () => setRoadRippleDisabled(),

        setSelectedNumberRippleEnabled: (number, numberIndex = 1) => update$1(katan => {
            katan.resourceList = katan.resourceList
                .map(resource => {
                    if (resource.number === number &&
                        resource.numberIndex === numberIndex) {
                        resource.numberRipple = true;
                    }

                    return resource;
                });

            return katan;
        }),

        setNumberRippleEnabled: () => update$1(katan => {
            katan.resourceList = katan.resourceList
                .map(resource => {
                    if (!resource.burglar) {
                        resource.numberRipple = true;
                    }

                    return resource;
                });

            return katan;
        }),

        setNumberRippleDisabled: (number = 0, numberIndex = 1) => update$1(katan => {
            katan.resourceList = katan.resourceList
                .map(resource => {
                    if (number === 0 ||
                        (resource.number === number && resource.numberIndex === numberIndex)) {
                        resource.numberRipple = false;
                    }

                    return resource;
                });

            return katan;
        }),

        exchange: (resourceType, targetResourceType) => {
            update$1(katan => {
                const player = katanStore.getCurrentPlayer(katan);
                player.resource[targetResourceType] += 1;
                player.resource[resourceType] -= player.trade[resourceType].count;
                return katan;
            });

            katanStore.doActionAndTurn();
        },

        isActive: (katan) => {
            return katan.isKnightMode === false &&
                katan.isMakeRoadMode === false &&
                katan.isMakeCastle === false &&
                katan.isMakeCity === false &&
                katan.rollDice;
        },

        test: () => {
            update$1(katan => {
                katan.playerList = katan.playerList
                    .map(player => {
                        player.resource.tree = 5;
                        player.resource.mud = 5;
                        player.resource.wheat = 5;
                        player.resource.sheep = 5;
                        player.resource.iron = 5;

                        return player;
                    });

                return katan;
            });

            recomputePlayer();
        },

        plusPoint: () => update$1(katan => {
            const player = katanStore.getActivePlayer();
            player.point.point += 1;
            return katan;
        }),

        testKnightCard: () => update$1(katan => {
            katan.cardList = [...katan.cardList, {type: 'knight'}];
            return katan;
        }),

        testRoadCard: () => update$1(katan => {
            katan.cardList = [...katan.cardList, {type: 'road'}];
            return katan;
        }),

        testTakeResourceCard: () => update$1(katan => {
            katan.cardList = [...katan.cardList, {type: 'takeResource'}];
            return katan;
        }),

        testGetPointCard: () => update$1(katan => {
            katan.cardList = [...katan.cardList, {type: 'point'}];
            return katan;
        }),

        testGetResourceCard: () => update$1(katan => {
            katan.cardList = [...katan.cardList, {type: 'getResource'}];
            return katan;
        })
    };

    recomputePlayer();

    /* src\Cell.svelte generated by Svelte v3.32.3 */
    const file = "src\\Cell.svelte";

    // (80:12) {#if resource.burglar}
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
    		source: "(80:12) {#if resource.burglar}",
    		ctx
    	});

    	return block;
    }

    // (84:12) {#if $katan.config.debug}
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
    		source: "(84:12) {#if $katan.config.debug}",
    		ctx
    	});

    	return block;
    }

    // (91:0) {#if resource.burglar===false}
    function create_if_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (img.src !== (img_src_value = /*resourceImage*/ ctx[7])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "style", /*resourceImageStyle*/ ctx[5]);
    			attr_dev(img, "class", img_class_value = "resource_" + /*resourceIndex*/ ctx[0] + " resource hide" + " svelte-k89u53");
    			add_location(img, file, 92, 4, 3039);
    			add_location(div, file, 91, 4, 3028);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*resourceImage*/ 128 && img.src !== (img_src_value = /*resourceImage*/ ctx[7])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*resourceImageStyle*/ 32) {
    				attr_dev(img, "style", /*resourceImageStyle*/ ctx[5]);
    			}

    			if (dirty & /*resourceIndex*/ 1 && img_class_value !== (img_class_value = "resource_" + /*resourceIndex*/ ctx[0] + " resource hide" + " svelte-k89u53")) {
    				attr_dev(img, "class", img_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(91:0) {#if resource.burglar===false}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
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
    	let div0_class_value;
    	let t4;
    	let if_block2_anchor;
    	let mounted;
    	let dispose;
    	let if_block0 = /*resource*/ ctx[1].burglar && create_if_block_2(ctx);
    	let if_block1 = /*$katan*/ ctx[2].config.debug && create_if_block_1(ctx);
    	let if_block2 = /*resource*/ ctx[1].burglar === false && create_if_block(ctx);

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
    			attr_dev(img, "style", /*imageStyle*/ ctx[9]);
    			attr_dev(img, "alt", /*imageSrc*/ ctx[6]);
    			add_location(img, file, 70, 8, 2338);
    			attr_dev(div0, "class", div0_class_value = "number number_" + /*resource*/ ctx[1].number + " number_" + /*resource*/ ctx[1].number + "_" + /*resource*/ ctx[1].numberIndex + " svelte-k89u53");
    			attr_dev(div0, "style", /*numberStyle*/ ctx[3]);
    			toggle_class(div0, "pick", /*resource*/ ctx[1].numberRipple);
    			toggle_class(div0, "ripple", /*resource*/ ctx[1].numberRipple);
    			toggle_class(div0, "burglar", /*resource*/ ctx[1].burglar);
    			add_location(div0, file, 72, 8, 2416);
    			attr_dev(div1, "class", "inner-cell");
    			attr_dev(div1, "style", /*innerCellStyle*/ ctx[8]);
    			add_location(div1, file, 69, 4, 2281);
    			attr_dev(div2, "class", "cell svelte-k89u53");
    			attr_dev(div2, "style", /*cellStyle*/ ctx[4]);
    			add_location(div2, file, 68, 0, 2239);
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

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imageSrc*/ 64 && img.src !== (img_src_value = /*imageSrc*/ ctx[6])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*imageSrc*/ 64) {
    				attr_dev(img, "alt", /*imageSrc*/ ctx[6]);
    			}

    			if (dirty & /*resource*/ 2 && t1_value !== (t1_value = /*resource*/ ctx[1].number + "")) set_data_dev(t1, t1_value);

    			if (/*resource*/ ctx[1].burglar) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div0, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$katan*/ ctx[2].config.debug) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*resource*/ 2 && div0_class_value !== (div0_class_value = "number number_" + /*resource*/ ctx[1].number + " number_" + /*resource*/ ctx[1].number + "_" + /*resource*/ ctx[1].numberIndex + " svelte-k89u53")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*numberStyle*/ 8) {
    				attr_dev(div0, "style", /*numberStyle*/ ctx[3]);
    			}

    			if (dirty & /*resource, resource*/ 2) {
    				toggle_class(div0, "pick", /*resource*/ ctx[1].numberRipple);
    			}

    			if (dirty & /*resource, resource*/ 2) {
    				toggle_class(div0, "ripple", /*resource*/ ctx[1].numberRipple);
    			}

    			if (dirty & /*resource, resource*/ 2) {
    				toggle_class(div0, "burglar", /*resource*/ ctx[1].burglar);
    			}

    			if (dirty & /*cellStyle*/ 16) {
    				attr_dev(div2, "style", /*cellStyle*/ ctx[4]);
    			}

    			if (/*resource*/ ctx[1].burglar === false) {
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
    	let $katan;
    	validate_store(katanStore, "katan");
    	component_subscribe($$self, katanStore, $$value => $$invalidate(2, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Cell", slots, []);
    	let { resourceIndex } = $$props;
    	const margin = $katan.config.cell.margin;
    	const offset = 100 - $katan.config.cell.margin;

    	let innerCellStyle = toStyle({
    		"clip-path": `polygon(50% ${margin}%, ${offset}% 25%, ${offset}% 75%, 50% ${offset}%, ${margin}% 75%, ${margin}% 25%)`
    	});

    	let imageStyle = toStyle({
    		width: $katan.config.cell.width + "px",
    		height: $katan.config.cell.height + "px"
    	});

    	const getNumberStyle = (width, height) => {
    		return toStyle({
    			left: ($katan.config.cell.width - width) / 2 + "px",
    			top: ($katan.config.cell.height - height) / 2 + "px",
    			width: width + "px",
    			height: height + "px",
    			"line-height": height + "px",
    			"border-radius": height / 2 + "px",
    			"font-size": "20px"
    		});
    	};

    	const getNumberStyleByResource = () => {
    		if (resource.burglar) {
    			return getNumberStyle($katan.config.burglar.width, $katan.config.burglar.height);
    		}

    		return getNumberStyle($katan.config.number.width, $katan.config.number.height);
    	};

    	let resource;
    	let numberStyle;
    	let cellStyle;
    	let resourceImageStyle;
    	let imageSrc;
    	let resourceImage;
    	const writable_props = ["resourceIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cell> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => katanStore.moveBurglar(resource.index);

    	$$self.$$set = $$props => {
    		if ("resourceIndex" in $$props) $$invalidate(0, resourceIndex = $$props.resourceIndex);
    	};

    	$$self.$capture_state = () => ({
    		toStyle,
    		katan: katanStore,
    		resourceIndex,
    		margin,
    		offset,
    		innerCellStyle,
    		imageStyle,
    		getNumberStyle,
    		getNumberStyleByResource,
    		resource,
    		numberStyle,
    		cellStyle,
    		resourceImageStyle,
    		imageSrc,
    		resourceImage,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("resourceIndex" in $$props) $$invalidate(0, resourceIndex = $$props.resourceIndex);
    		if ("innerCellStyle" in $$props) $$invalidate(8, innerCellStyle = $$props.innerCellStyle);
    		if ("imageStyle" in $$props) $$invalidate(9, imageStyle = $$props.imageStyle);
    		if ("resource" in $$props) $$invalidate(1, resource = $$props.resource);
    		if ("numberStyle" in $$props) $$invalidate(3, numberStyle = $$props.numberStyle);
    		if ("cellStyle" in $$props) $$invalidate(4, cellStyle = $$props.cellStyle);
    		if ("resourceImageStyle" in $$props) $$invalidate(5, resourceImageStyle = $$props.resourceImageStyle);
    		if ("imageSrc" in $$props) $$invalidate(6, imageSrc = $$props.imageSrc);
    		if ("resourceImage" in $$props) $$invalidate(7, resourceImage = $$props.resourceImage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$katan, resourceIndex, resource*/ 7) {
    			{
    				$$invalidate(1, resource = $katan.resourceList[resourceIndex]);
    				$$invalidate(3, numberStyle = getNumberStyleByResource());

    				$$invalidate(4, cellStyle = toStyle({
    					left: resource.left + "px",
    					top: resource.top + "px",
    					width: $katan.config.cell.width + "px",
    					height: $katan.config.cell.height + "px"
    				}));

    				$$invalidate(5, resourceImageStyle = toStyle({
    					left: resource.left + ($katan.config.cell.width - $katan.config.resource.width) / 2 + "px",
    					top: resource.top + ($katan.config.cell.height - $katan.config.resource.height) / 2 + "px",
    					width: `${$katan.config.resource.width}px`,
    					height: `${$katan.config.resource.height}px`
    				}));

    				$$invalidate(6, imageSrc = `${resource.type}.png`);
    				$$invalidate(7, resourceImage = `${resource.type}_item.png`);
    			}
    		}
    	};

    	return [
    		resourceIndex,
    		resource,
    		$katan,
    		numberStyle,
    		cellStyle,
    		resourceImageStyle,
    		imageSrc,
    		resourceImage,
    		innerCellStyle,
    		imageStyle,
    		click_handler
    	];
    }

    class Cell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { resourceIndex: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell",
    			options,
    			id: create_fragment.name
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
    const file$1 = "src\\Castle.svelte";

    // (51:0) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let t_value = /*castle*/ ctx[2].title + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = text(t_value);
    			add_location(div0, file$1, 57, 4, 1622);
    			attr_dev(div1, "class", "castle svelte-voh75m");
    			attr_dev(div1, "style", /*castleStyle*/ ctx[3]);
    			toggle_class(div1, "ripple", /*castle*/ ctx[2].ripple);
    			toggle_class(div1, "hide", /*castle*/ ctx[2].hide);
    			toggle_class(div1, "show", /*castle*/ ctx[2].show);
    			add_location(div1, file$1, 51, 4, 1417);
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
    			if (dirty & /*castle*/ 4 && t_value !== (t_value = /*castle*/ ctx[2].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*castleStyle*/ 8) {
    				attr_dev(div1, "style", /*castleStyle*/ ctx[3]);
    			}

    			if (dirty & /*castle*/ 4) {
    				toggle_class(div1, "ripple", /*castle*/ ctx[2].ripple);
    			}

    			if (dirty & /*castle*/ 4) {
    				toggle_class(div1, "hide", /*castle*/ ctx[2].hide);
    			}

    			if (dirty & /*castle*/ 4) {
    				toggle_class(div1, "show", /*castle*/ ctx[2].show);
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
    		source: "(51:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:0) {#if $katan.config.debug}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*castle*/ ctx[2].i + "";
    	let t0;
    	let t1;
    	let t2_value = /*castle*/ ctx[2].j + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*castle*/ ctx[2].index + "";
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
    			add_location(div0, file$1, 47, 8, 1323);
    			add_location(div1, file$1, 48, 8, 1365);
    			attr_dev(div2, "class", "castle svelte-voh75m");
    			attr_dev(div2, "style", /*castleStyle*/ ctx[3]);
    			add_location(div2, file$1, 46, 4, 1273);
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
    			if (dirty & /*castle*/ 4 && t0_value !== (t0_value = /*castle*/ ctx[2].i + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*castle*/ 4 && t2_value !== (t2_value = /*castle*/ ctx[2].j + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*castle*/ 4 && t4_value !== (t4_value = /*castle*/ ctx[2].index + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*castleStyle*/ 8) {
    				attr_dev(div2, "style", /*castleStyle*/ ctx[3]);
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
    		source: "(46:0) {#if $katan.config.debug}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$katan*/ ctx[1].config.debug) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
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
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
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
    	component_subscribe($$self, katanStore, $$value => $$invalidate(1, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Castle", slots, []);
    	let { castleIndex } = $$props;

    	const createStyle = () => {
    		const player = katanStore.getActivePlayer();

    		let styleObject = {
    			left: castle.left + "px",
    			top: castle.top + "px",
    			width: $katan.config.castle.width + "px",
    			height: $katan.config.castle.height + "px",
    			lineHeight: $katan.config.castle.height + "px",
    			borderRadius: $katan.config.castle.height + "px",
    			backgroundColor: player.color
    		};

    		if (!castleClickable($katan, castleIndex)) {
    			styleObject.cursor = "default";
    		}

    		if ($katan.config.debug) {
    			delete styleObject.lineHeight;
    			styleObject.color = "black";
    		}

    		if (castle.playerIndex !== -1) {
    			styleObject.backgroundColor = $katan.playerList[castle.playerIndex].color;
    		}

    		return toStyle(styleObject);
    	};

    	let castle;
    	let castleStyle;
    	const writable_props = ["castleIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Castle> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => katanStore.clickMakeCastle(castleIndex);

    	$$self.$$set = $$props => {
    		if ("castleIndex" in $$props) $$invalidate(0, castleIndex = $$props.castleIndex);
    	};

    	$$self.$capture_state = () => ({
    		katan: katanStore,
    		toStyle,
    		castleClickable,
    		castleIndex,
    		createStyle,
    		castle,
    		castleStyle,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("castleIndex" in $$props) $$invalidate(0, castleIndex = $$props.castleIndex);
    		if ("castle" in $$props) $$invalidate(2, castle = $$props.castle);
    		if ("castleStyle" in $$props) $$invalidate(3, castleStyle = $$props.castleStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$katan, castleIndex*/ 3) {
    			{
    				$$invalidate(2, castle = $katan.castleList[castleIndex]);
    				$$invalidate(3, castleStyle = createStyle());
    			}
    		}
    	};

    	return [castleIndex, $katan, castle, castleStyle, click_handler];
    }

    class Castle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { castleIndex: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Castle",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*castleIndex*/ ctx[0] === undefined && !("castleIndex" in props)) {
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

    /* src\Port.svelte generated by Svelte v3.32.3 */
    const file$2 = "src\\Port.svelte";

    // (32:0) {#if port.tradable}
    function create_if_block$2(ctx) {
    	let div;
    	let div_placement_value;
    	let div_trade_value;
    	let div_type_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "port svelte-1bsbhul");
    			attr_dev(div, "data-bs-toggle", "tooltip");
    			attr_dev(div, "placement", div_placement_value = /*port*/ ctx[1].placement);
    			attr_dev(div, "trade", div_trade_value = /*port*/ ctx[1].trade);
    			attr_dev(div, "type", div_type_value = /*port*/ ctx[1].type);
    			attr_dev(div, "style", /*portStyle*/ ctx[0]);
    			add_location(div, file$2, 32, 0, 766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*port*/ 2 && div_placement_value !== (div_placement_value = /*port*/ ctx[1].placement)) {
    				attr_dev(div, "placement", div_placement_value);
    			}

    			if (dirty & /*port*/ 2 && div_trade_value !== (div_trade_value = /*port*/ ctx[1].trade)) {
    				attr_dev(div, "trade", div_trade_value);
    			}

    			if (dirty & /*port*/ 2 && div_type_value !== (div_type_value = /*port*/ ctx[1].type)) {
    				attr_dev(div, "type", div_type_value);
    			}

    			if (dirty & /*portStyle*/ 1) {
    				attr_dev(div, "style", /*portStyle*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(32:0) {#if port.tradable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*port*/ ctx[1].tradable && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*port*/ ctx[1].tradable) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
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
    	validate_slots("Port", slots, []);
    	let { castleIndex } = $$props;

    	const createStyle = () => {
    		let styleObject = {
    			left: castle.left + "px",
    			top: castle.top + "px",
    			width: $katan.config.castle.width + "px",
    			height: $katan.config.castle.height + "px",
    			borderRadius: $katan.config.castle.height + "px"
    		};

    		return toStyle(styleObject);
    	};

    	let castleList;
    	let castle;
    	let portStyle;
    	let port;
    	const writable_props = ["castleIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Port> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("castleIndex" in $$props) $$invalidate(2, castleIndex = $$props.castleIndex);
    	};

    	$$self.$capture_state = () => ({
    		katan: katanStore,
    		toStyle,
    		castleIndex,
    		createStyle,
    		castleList,
    		castle,
    		portStyle,
    		port,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("castleIndex" in $$props) $$invalidate(2, castleIndex = $$props.castleIndex);
    		if ("castleList" in $$props) $$invalidate(3, castleList = $$props.castleList);
    		if ("castle" in $$props) $$invalidate(4, castle = $$props.castle);
    		if ("portStyle" in $$props) $$invalidate(0, portStyle = $$props.portStyle);
    		if ("port" in $$props) $$invalidate(1, port = $$props.port);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$katan, castleList, castleIndex, castle*/ 60) {
    			{
    				$$invalidate(3, castleList = $katan.castleList);
    				$$invalidate(4, castle = castleList[castleIndex]);
    				$$invalidate(0, portStyle = createStyle());
    				$$invalidate(1, port = castle.port);
    			}
    		}
    	};

    	return [portStyle, port, castleIndex, castleList, castle, $katan];
    }

    class Port extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { castleIndex: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Port",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*castleIndex*/ ctx[2] === undefined && !("castleIndex" in props)) {
    			console.warn("<Port> was created without expected prop 'castleIndex'");
    		}
    	}

    	get castleIndex() {
    		throw new Error("<Port>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set castleIndex(value) {
    		throw new Error("<Port>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Road.svelte generated by Svelte v3.32.3 */
    const file$3 = "src\\Road.svelte";

    // (51:0) {:else}
    function create_else_block$1(ctx) {
    	let div1;
    	let div0;
    	let t_value = /*road*/ ctx[2].title + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = text(t_value);
    			add_location(div0, file$3, 58, 8, 1585);
    			attr_dev(div1, "class", "road svelte-1mp7gxw");
    			attr_dev(div1, "style", /*roadStyle*/ ctx[3]);
    			toggle_class(div1, "ripple1", /*road*/ ctx[2].ripple);
    			toggle_class(div1, "pick", /*road*/ ctx[2].ripple);
    			toggle_class(div1, "hide", /*road*/ ctx[2].hide);
    			toggle_class(div1, "show", /*road*/ ctx[2].show);
    			add_location(div1, file$3, 51, 4, 1334);
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
    			if (dirty & /*road*/ 4 && t_value !== (t_value = /*road*/ ctx[2].title + "")) set_data_dev(t, t_value);

    			if (dirty & /*roadStyle*/ 8) {
    				attr_dev(div1, "style", /*roadStyle*/ ctx[3]);
    			}

    			if (dirty & /*road*/ 4) {
    				toggle_class(div1, "ripple1", /*road*/ ctx[2].ripple);
    			}

    			if (dirty & /*road*/ 4) {
    				toggle_class(div1, "pick", /*road*/ ctx[2].ripple);
    			}

    			if (dirty & /*road*/ 4) {
    				toggle_class(div1, "hide", /*road*/ ctx[2].hide);
    			}

    			if (dirty & /*road*/ 4) {
    				toggle_class(div1, "show", /*road*/ ctx[2].show);
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
    		source: "(51:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:0) {#if $katan.config.debug}
    function create_if_block$3(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*road*/ ctx[2].i + "";
    	let t0;
    	let t1;
    	let t2_value = /*road*/ ctx[2].j + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = /*road*/ ctx[2].index + "";
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
    			add_location(div0, file$3, 47, 8, 1246);
    			add_location(div1, file$3, 48, 8, 1284);
    			attr_dev(div2, "class", "road svelte-1mp7gxw");
    			attr_dev(div2, "style", /*roadStyle*/ ctx[3]);
    			add_location(div2, file$3, 46, 4, 1200);
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
    			if (dirty & /*road*/ 4 && t0_value !== (t0_value = /*road*/ ctx[2].i + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*road*/ 4 && t2_value !== (t2_value = /*road*/ ctx[2].j + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*road*/ 4 && t4_value !== (t4_value = /*road*/ ctx[2].index + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*roadStyle*/ 8) {
    				attr_dev(div2, "style", /*roadStyle*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(46:0) {#if $katan.config.debug}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$katan*/ ctx[1].config.debug) return create_if_block$3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
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
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
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
    	component_subscribe($$self, katanStore, $$value => $$invalidate(1, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Road", slots, []);
    	let { roadIndex } = $$props;

    	const createStyle = () => {
    		const player = katanStore.getActivePlayer();

    		let styleObject = {
    			left: road.left + "px",
    			top: road.top + "px",
    			width: $katan.config.load.width + "px",
    			height: $katan.config.load.height + "px",
    			lineHeight: $katan.config.castle.height + "px",
    			backgroundColor: player.color
    		};

    		if (!$katan.isMakeRoadMode) {
    			styleObject.cursor = "default";
    		}

    		if ($katan.config.debug) {
    			delete styleObject.lineHeight;
    			styleObject.color = "black";
    			styleObject.backgroundColor = "lightblue";
    		}

    		if (road.playerIndex !== -1) {
    			styleObject.backgroundColor = $katan.playerList[road.playerIndex].color;
    		}

    		return toStyle(styleObject);
    	};

    	let road;
    	let roadStyle;
    	const writable_props = ["roadIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Road> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => katanStore.clickMakeRoad(roadIndex);

    	$$self.$$set = $$props => {
    		if ("roadIndex" in $$props) $$invalidate(0, roadIndex = $$props.roadIndex);
    	};

    	$$self.$capture_state = () => ({
    		katan: katanStore,
    		toStyle,
    		roadIndex,
    		createStyle,
    		road,
    		roadStyle,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("roadIndex" in $$props) $$invalidate(0, roadIndex = $$props.roadIndex);
    		if ("road" in $$props) $$invalidate(2, road = $$props.road);
    		if ("roadStyle" in $$props) $$invalidate(3, roadStyle = $$props.roadStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$katan, roadIndex*/ 3) {
    			{
    				$$invalidate(2, road = $katan.roadList[roadIndex]);
    				$$invalidate(3, roadStyle = createStyle());
    			}
    		}
    	};

    	return [roadIndex, $katan, road, roadStyle, click_handler];
    }

    class Road extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { roadIndex: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Road",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*roadIndex*/ ctx[0] === undefined && !("roadIndex" in props)) {
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

    // (23:4) {#each resourceList as resource, i}
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
    		source: "(23:4) {#each resourceList as resource, i}",
    		ctx
    	});

    	return block;
    }

    // (26:4) {#each castleList as castle, i}
    function create_each_block_1(ctx) {
    	let castle;
    	let t;
    	let port;
    	let current;

    	castle = new Castle({
    			props: { castleIndex: /*i*/ ctx[6] },
    			$$inline: true
    		});

    	port = new Port({
    			props: { castleIndex: /*i*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(castle.$$.fragment);
    			t = space();
    			create_component(port.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(castle, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(port, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(castle.$$.fragment, local);
    			transition_in(port.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(castle.$$.fragment, local);
    			transition_out(port.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(castle, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(port, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(26:4) {#each castleList as castle, i}",
    		ctx
    	});

    	return block;
    }

    // (30:4) {#each $katan.roadList as road, i}
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
    		source: "(30:4) {#each $katan.roadList as road, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div0;
    	let t0_value = /*$katan*/ ctx[2].sumDice + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*$katan*/ ctx[2].sumDice + "";
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let br0;
    	let t5;
    	let br1;
    	let t6_value = /*$katan*/ ctx[2].cardList.length + "";
    	let t6;
    	let t7;
    	let div3;
    	let t8;
    	let br2;
    	let t9;
    	let br3;
    	let t10_value = /*$katan*/ ctx[2].afterCardList.length + "";
    	let t10;
    	let t11;
    	let t12;
    	let t13;
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
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text("발전카드");
    			br0 = element("br");
    			t5 = text("사용전");
    			br1 = element("br");
    			t6 = text(t6_value);
    			t7 = space();
    			div3 = element("div");
    			t8 = text("발전카드");
    			br2 = element("br");
    			t9 = text("사용후");
    			br3 = element("br");
    			t10 = text(t10_value);
    			t11 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t12 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t13 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "display-dice-number display-dice-number-1 dice-left svelte-swjckl");
    			add_location(div0, file$4, 18, 4, 511);
    			attr_dev(div1, "class", "display-dice-number display-dice-number-2 dice-right svelte-swjckl");
    			add_location(div1, file$4, 19, 4, 604);
    			add_location(br0, file$4, 20, 52, 746);
    			add_location(br1, file$4, 20, 59, 753);
    			attr_dev(div2, "class", "display-card display-card-left svelte-swjckl");
    			add_location(div2, file$4, 20, 4, 698);
    			add_location(br2, file$4, 21, 53, 842);
    			add_location(br3, file$4, 21, 60, 849);
    			attr_dev(div3, "class", "display-card display-card-right svelte-swjckl");
    			add_location(div3, file$4, 21, 4, 793);
    			attr_dev(main, "class", "board svelte-swjckl");
    			attr_dev(main, "style", /*boardStyle*/ ctx[3]);
    			add_location(main, file$4, 17, 0, 466);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, t0);
    			append_dev(main, t1);
    			append_dev(main, div1);
    			append_dev(div1, t2);
    			append_dev(main, t3);
    			append_dev(main, div2);
    			append_dev(div2, t4);
    			append_dev(div2, br0);
    			append_dev(div2, t5);
    			append_dev(div2, br1);
    			append_dev(div2, t6);
    			append_dev(main, t7);
    			append_dev(main, div3);
    			append_dev(div3, t8);
    			append_dev(div3, br2);
    			append_dev(div3, t9);
    			append_dev(div3, br3);
    			append_dev(div3, t10);
    			append_dev(main, t11);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(main, null);
    			}

    			append_dev(main, t12);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(main, null);
    			}

    			append_dev(main, t13);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$katan*/ 4) && t0_value !== (t0_value = /*$katan*/ ctx[2].sumDice + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*$katan*/ 4) && t2_value !== (t2_value = /*$katan*/ ctx[2].sumDice + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*$katan*/ 4) && t6_value !== (t6_value = /*$katan*/ ctx[2].cardList.length + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*$katan*/ 4) && t10_value !== (t10_value = /*$katan*/ ctx[2].afterCardList.length + "")) set_data_dev(t10, t10_value);

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
    						each_blocks_2[i].m(main, t12);
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
    						each_blocks_1[i].m(main, t13);
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
    		width: 4 * $katan.config.cell.width + "px",
    		height: 4 * $katan.config.cell.height + "px"
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
    		toStyle,
    		Cell,
    		Castle,
    		Port,
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
    			attr_dev(div, "class", "dice svelte-1rtrnw9");
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

    /* src\Construction.svelte generated by Svelte v3.32.3 */
    const file$6 = "src\\Construction.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let table;
    	let tr0;
    	let td0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let td1;
    	let button0;
    	let t2;
    	let button0_disabled_value;
    	let t3;
    	let tr1;
    	let td2;
    	let img2;
    	let img2_src_value;
    	let t4;
    	let img3;
    	let img3_src_value;
    	let t5;
    	let img4;
    	let img4_src_value;
    	let t6;
    	let img5;
    	let img5_src_value;
    	let t7;
    	let td3;
    	let button1;
    	let t8;
    	let button1_disabled_value;
    	let t9;
    	let tr2;
    	let td4;
    	let img6;
    	let img6_src_value;
    	let t10;
    	let img7;
    	let img7_src_value;
    	let t11;
    	let img8;
    	let img8_src_value;
    	let t12;
    	let img9;
    	let img9_src_value;
    	let t13;
    	let img10;
    	let img10_src_value;
    	let t14;
    	let td5;
    	let button2;
    	let t15;
    	let button2_disabled_value;
    	let t16;
    	let tr3;
    	let td6;
    	let img11;
    	let img11_src_value;
    	let t17;
    	let img12;
    	let img12_src_value;
    	let t18;
    	let img13;
    	let img13_src_value;
    	let t19;
    	let td7;
    	let button3;
    	let t20;
    	let button3_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			table = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			td1 = element("td");
    			button0 = element("button");
    			t2 = text("도로 만들기");
    			t3 = space();
    			tr1 = element("tr");
    			td2 = element("td");
    			img2 = element("img");
    			t4 = space();
    			img3 = element("img");
    			t5 = space();
    			img4 = element("img");
    			t6 = space();
    			img5 = element("img");
    			t7 = space();
    			td3 = element("td");
    			button1 = element("button");
    			t8 = text("마을 만들기");
    			t9 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			img6 = element("img");
    			t10 = space();
    			img7 = element("img");
    			t11 = space();
    			img8 = element("img");
    			t12 = space();
    			img9 = element("img");
    			t13 = space();
    			img10 = element("img");
    			t14 = space();
    			td5 = element("td");
    			button2 = element("button");
    			t15 = text("도시 만들기");
    			t16 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			img11 = element("img");
    			t17 = space();
    			img12 = element("img");
    			t18 = space();
    			img13 = element("img");
    			t19 = space();
    			td7 = element("td");
    			button3 = element("button");
    			t20 = text("발전카드");
    			if (img0.src !== (img0_src_value = "tree_item.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-137w15p");
    			add_location(img0, file$6, 16, 16, 274);
    			if (img1.src !== (img1_src_value = "mud_item.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-137w15p");
    			add_location(img1, file$6, 17, 16, 317);
    			attr_dev(td0, "class", "svelte-137w15p");
    			add_location(td0, file$6, 15, 12, 252);
    			attr_dev(button0, "class", "btn btn-primary btn-sm svelte-137w15p");
    			button0.disabled = button0_disabled_value = !/*player*/ ctx[0].make.road;
    			add_location(button0, file$6, 20, 16, 396);
    			attr_dev(td1, "class", "svelte-137w15p");
    			add_location(td1, file$6, 19, 12, 374);
    			add_location(tr0, file$6, 14, 8, 234);
    			if (img2.src !== (img2_src_value = "tree_item.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "svelte-137w15p");
    			add_location(img2, file$6, 27, 16, 645);
    			if (img3.src !== (img3_src_value = "mud_item.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-137w15p");
    			add_location(img3, file$6, 28, 16, 688);
    			if (img4.src !== (img4_src_value = "wheat_item.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "svelte-137w15p");
    			add_location(img4, file$6, 29, 16, 730);
    			if (img5.src !== (img5_src_value = "sheep_item.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "class", "svelte-137w15p");
    			add_location(img5, file$6, 30, 16, 774);
    			attr_dev(td2, "class", "svelte-137w15p");
    			add_location(td2, file$6, 26, 12, 623);
    			attr_dev(button1, "class", "btn btn-primary btn-sm svelte-137w15p");
    			button1.disabled = button1_disabled_value = !/*player*/ ctx[0].make.castle;
    			add_location(button1, file$6, 33, 16, 855);
    			attr_dev(td3, "class", "svelte-137w15p");
    			add_location(td3, file$6, 32, 12, 833);
    			add_location(tr1, file$6, 25, 8, 605);
    			if (img6.src !== (img6_src_value = "wheat_item.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "class", "svelte-137w15p");
    			add_location(img6, file$6, 40, 16, 1108);
    			if (img7.src !== (img7_src_value = "wheat_item.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "class", "svelte-137w15p");
    			add_location(img7, file$6, 41, 16, 1152);
    			if (img8.src !== (img8_src_value = "iron_item.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "class", "svelte-137w15p");
    			add_location(img8, file$6, 42, 16, 1196);
    			if (img9.src !== (img9_src_value = "iron_item.png")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "class", "svelte-137w15p");
    			add_location(img9, file$6, 43, 16, 1239);
    			if (img10.src !== (img10_src_value = "iron_item.png")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "class", "svelte-137w15p");
    			add_location(img10, file$6, 44, 16, 1282);
    			attr_dev(td4, "class", "svelte-137w15p");
    			add_location(td4, file$6, 39, 12, 1086);
    			attr_dev(button2, "class", "btn btn-primary btn-sm svelte-137w15p");
    			button2.disabled = button2_disabled_value = !/*player*/ ctx[0].make.city;
    			add_location(button2, file$6, 47, 16, 1362);
    			attr_dev(td5, "class", "svelte-137w15p");
    			add_location(td5, file$6, 46, 12, 1340);
    			add_location(tr2, file$6, 38, 8, 1068);
    			if (img11.src !== (img11_src_value = "wheat_item.png")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "class", "svelte-137w15p");
    			add_location(img11, file$6, 54, 16, 1611);
    			if (img12.src !== (img12_src_value = "sheep_item.png")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "class", "svelte-137w15p");
    			add_location(img12, file$6, 55, 16, 1655);
    			if (img13.src !== (img13_src_value = "iron_item.png")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "class", "svelte-137w15p");
    			add_location(img13, file$6, 56, 16, 1699);
    			attr_dev(td6, "class", "svelte-137w15p");
    			add_location(td6, file$6, 53, 12, 1589);
    			attr_dev(button3, "class", "btn btn-primary btn-sm svelte-137w15p");
    			button3.disabled = button3_disabled_value = !/*player*/ ctx[0].make.dev;
    			add_location(button3, file$6, 59, 16, 1779);
    			attr_dev(td7, "class", "svelte-137w15p");
    			add_location(td7, file$6, 58, 12, 1757);
    			add_location(tr3, file$6, 52, 8, 1571);
    			attr_dev(table, "class", "construction-resource svelte-137w15p");
    			add_location(table, file$6, 13, 4, 187);
    			add_location(main, file$6, 12, 0, 175);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, table);
    			append_dev(table, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, img0);
    			append_dev(td0, t0);
    			append_dev(td0, img1);
    			append_dev(tr0, t1);
    			append_dev(tr0, td1);
    			append_dev(td1, button0);
    			append_dev(button0, t2);
    			append_dev(table, t3);
    			append_dev(table, tr1);
    			append_dev(tr1, td2);
    			append_dev(td2, img2);
    			append_dev(td2, t4);
    			append_dev(td2, img3);
    			append_dev(td2, t5);
    			append_dev(td2, img4);
    			append_dev(td2, t6);
    			append_dev(td2, img5);
    			append_dev(tr1, t7);
    			append_dev(tr1, td3);
    			append_dev(td3, button1);
    			append_dev(button1, t8);
    			append_dev(table, t9);
    			append_dev(table, tr2);
    			append_dev(tr2, td4);
    			append_dev(td4, img6);
    			append_dev(td4, t10);
    			append_dev(td4, img7);
    			append_dev(td4, t11);
    			append_dev(td4, img8);
    			append_dev(td4, t12);
    			append_dev(td4, img9);
    			append_dev(td4, t13);
    			append_dev(td4, img10);
    			append_dev(tr2, t14);
    			append_dev(tr2, td5);
    			append_dev(td5, button2);
    			append_dev(button2, t15);
    			append_dev(table, t16);
    			append_dev(table, tr3);
    			append_dev(tr3, td6);
    			append_dev(td6, img11);
    			append_dev(td6, t17);
    			append_dev(td6, img12);
    			append_dev(td6, t18);
    			append_dev(td6, img13);
    			append_dev(tr3, t19);
    			append_dev(tr3, td7);
    			append_dev(td7, button3);
    			append_dev(button3, t20);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*player*/ 1 && button0_disabled_value !== (button0_disabled_value = !/*player*/ ctx[0].make.road)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*player*/ 1 && button1_disabled_value !== (button1_disabled_value = !/*player*/ ctx[0].make.castle)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*player*/ 1 && button2_disabled_value !== (button2_disabled_value = !/*player*/ ctx[0].make.city)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty & /*player*/ 1 && button3_disabled_value !== (button3_disabled_value = !/*player*/ ctx[0].make.dev)) {
    				prop_dev(button3, "disabled", button3_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
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
    	component_subscribe($$self, katanStore, $$value => $$invalidate(2, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Construction", slots, []);
    	let { playerIndex } = $$props;
    	let player;
    	const writable_props = ["playerIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Construction> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => katanStore.makeRoad();
    	const click_handler_1 = () => katanStore.makeCastle();
    	const click_handler_2 = () => katanStore.makeCity();
    	const click_handler_3 = () => katanStore.openCard();

    	$$self.$$set = $$props => {
    		if ("playerIndex" in $$props) $$invalidate(1, playerIndex = $$props.playerIndex);
    	};

    	$$self.$capture_state = () => ({ katan: katanStore, playerIndex, player, $katan });

    	$$self.$inject_state = $$props => {
    		if ("playerIndex" in $$props) $$invalidate(1, playerIndex = $$props.playerIndex);
    		if ("player" in $$props) $$invalidate(0, player = $$props.player);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$katan, playerIndex*/ 6) {
    			{
    				$$invalidate(0, player = $katan.playerList[playerIndex]);
    			}
    		}
    	};

    	return [
    		player,
    		playerIndex,
    		$katan,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Construction extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { playerIndex: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Construction",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*playerIndex*/ ctx[1] === undefined && !("playerIndex" in props)) {
    			console.warn("<Construction> was created without expected prop 'playerIndex'");
    		}
    	}

    	get playerIndex() {
    		throw new Error("<Construction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playerIndex(value) {
    		throw new Error("<Construction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Player.svelte generated by Svelte v3.32.3 */
    const file$7 = "src\\Player.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (126:36) {#if player.trade[resource.type].enable}
    function create_if_block_1$1(ctx) {
    	let table;
    	let tr;
    	let each_value_1 = /*resourceList*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$7, 127, 44, 5170);
    			attr_dev(table, "class", "trade-target-resource svelte-zrpzlp");
    			add_location(table, file$7, 126, 40, 5087);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*player, resourceList, katan*/ 18) {
    				each_value_1 = /*resourceList*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(126:36) {#if player.trade[resource.type].enable}",
    		ctx
    	});

    	return block;
    }

    // (120:32) {#if $katan.isGetResource && $katan.playerIndex === playerIndex}
    function create_if_block$4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[7](/*resource*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "받기";
    			attr_dev(button, "class", "get-resource-button btn btn-primary btn-sm svelte-zrpzlp");
    			add_location(button, file$7, 120, 36, 4683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(120:32) {#if $katan.isGetResource && $katan.playerIndex === playerIndex}",
    		ctx
    	});

    	return block;
    }

    // (130:52) {#if resource.type!==tradeResource.type}
    function create_if_block_2$1(ctx) {
    	let td;
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let button;
    	let t1_value = /*player*/ ctx[1].trade[/*resource*/ ctx[12].type].count + "";
    	let t1;
    	let t2;
    	let button_disabled_value;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[8](/*resource*/ ctx[12], /*tradeResource*/ ctx[15]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			button = element("button");
    			t1 = text(t1_value);
    			t2 = text(":1교환");
    			t3 = space();
    			attr_dev(img, "class", "trade-resource svelte-zrpzlp");
    			if (img.src !== (img_src_value = "" + (/*tradeResource*/ ctx[15].type + "_item.png"))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$7, 132, 64, 5550);
    			attr_dev(button, "class", "trade-button btn btn-primary btn-sm svelte-zrpzlp");
    			button.disabled = button_disabled_value = !/*player*/ ctx[1].trade[/*resource*/ ctx[12].type].action;
    			add_location(button, file$7, 133, 64, 5687);
    			add_location(div, file$7, 131, 60, 5479);
    			attr_dev(td, "class", "svelte-zrpzlp");
    			add_location(td, file$7, 130, 56, 5413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, div);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, button);
    			append_dev(button, t1);
    			append_dev(button, t2);
    			append_dev(td, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*resourceList*/ 16 && img.src !== (img_src_value = "" + (/*tradeResource*/ ctx[15].type + "_item.png"))) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*player, resourceList*/ 18 && t1_value !== (t1_value = /*player*/ ctx[1].trade[/*resource*/ ctx[12].type].count + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*player, resourceList*/ 18 && button_disabled_value !== (button_disabled_value = !/*player*/ ctx[1].trade[/*resource*/ ctx[12].type].action)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(130:52) {#if resource.type!==tradeResource.type}",
    		ctx
    	});

    	return block;
    }

    // (129:48) {#each resourceList as tradeResource}
    function create_each_block_1$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*resource*/ ctx[12].type !== /*tradeResource*/ ctx[15].type && create_if_block_2$1(ctx);

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
    			if (/*resource*/ ctx[12].type !== /*tradeResource*/ ctx[15].type) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(129:48) {#each resourceList as tradeResource}",
    		ctx
    	});

    	return block;
    }

    // (108:20) {#each resourceList as resource}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let div1;
    	let img;
    	let img_src_value;
    	let img_class_value;
    	let t0;
    	let div0;
    	let t1_value = /*player*/ ctx[1].trade[/*resource*/ ctx[12].type].count + "";
    	let t1;
    	let t2;
    	let t3;
    	let td1;
    	let t4_value = /*resource*/ ctx[12].count + "";
    	let t4;
    	let t5;
    	let td2;
    	let t6;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*resource*/ ctx[12]);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*$katan*/ ctx[2].isGetResource && /*$katan*/ ctx[2].playerIndex === /*playerIndex*/ ctx[0]) return create_if_block$4;
    		if (/*player*/ ctx[1].trade[/*resource*/ ctx[12].type].enable) return create_if_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = text(":1");
    			t3 = space();
    			td1 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td2 = element("td");
    			if (if_block) if_block.c();
    			t6 = space();
    			if (img.src !== (img_src_value = "" + (/*resource*/ ctx[12].type + "_item.png"))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", img_class_value = "resource player_" + /*player*/ ctx[1].index + "_" + /*resource*/ ctx[12].type + " svelte-zrpzlp");
    			add_location(img, file$7, 111, 36, 4026);
    			attr_dev(div0, "class", "trade-ratio svelte-zrpzlp");
    			add_location(div0, file$7, 114, 36, 4300);
    			attr_dev(div1, "class", "resource-item svelte-zrpzlp");
    			add_location(div1, file$7, 110, 32, 3961);
    			attr_dev(td0, "width", "80");
    			attr_dev(td0, "class", "svelte-zrpzlp");
    			add_location(td0, file$7, 109, 28, 3912);
    			attr_dev(td1, "class", "number svelte-zrpzlp");
    			add_location(td1, file$7, 117, 28, 4473);
    			attr_dev(td2, "class", "svelte-zrpzlp");
    			add_location(td2, file$7, 118, 28, 4543);
    			add_location(tr, file$7, 108, 24, 3878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(td1, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td2);
    			if (if_block) if_block.m(td2, null);
    			append_dev(tr, t6);

    			if (!mounted) {
    				dispose = listen_dev(img, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*resourceList*/ 16 && img.src !== (img_src_value = "" + (/*resource*/ ctx[12].type + "_item.png"))) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*player, resourceList*/ 18 && img_class_value !== (img_class_value = "resource player_" + /*player*/ ctx[1].index + "_" + /*resource*/ ctx[12].type + " svelte-zrpzlp")) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*player, resourceList*/ 18 && t1_value !== (t1_value = /*player*/ ctx[1].trade[/*resource*/ ctx[12].type].count + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*resourceList*/ 16 && t4_value !== (t4_value = /*resource*/ ctx[12].count + "")) set_data_dev(t4, t4_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(td2, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(108:20) {#each resourceList as resource}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let table3;
    	let tr0;
    	let td0;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let t1;
    	let t2_value = /*player*/ ctx[1].point.sum + "";
    	let t2;
    	let t3;
    	let t4_value = /*player*/ ctx[1].resourceSum + "";
    	let t4;
    	let t5;
    	let tr10;
    	let td26;
    	let table2;
    	let tr1;
    	let td1;
    	let t7;
    	let tr4;
    	let td12;
    	let table0;
    	let tr2;
    	let td2;
    	let t9;
    	let td3;
    	let t11;
    	let td4;
    	let t13;
    	let td5;
    	let t15;
    	let td6;
    	let t17;
    	let tr3;
    	let td7;
    	let t18_value = /*player*/ ctx[1].point.castle + "";
    	let t18;
    	let t19;
    	let td8;
    	let t20_value = /*player*/ ctx[1].point.city + "";
    	let t20;
    	let t21;
    	let td9;
    	let t22_value = /*player*/ ctx[1].point.point + "";
    	let t22;
    	let t23;
    	let td10;
    	let t24_value = /*player*/ ctx[1].point.road + "";
    	let t24;
    	let t25;
    	let td11;
    	let t26_value = /*player*/ ctx[1].point.knight + "";
    	let t26;
    	let t27;
    	let tr5;
    	let td13;
    	let t29;
    	let tr8;
    	let td24;
    	let table1;
    	let tr6;
    	let td14;
    	let t31;
    	let td15;
    	let t33;
    	let td16;
    	let t35;
    	let td17;
    	let t37;
    	let td18;
    	let t39;
    	let tr7;
    	let td19;
    	let t40_value = /*player*/ ctx[1].construction.castle + "";
    	let t40;
    	let t41;
    	let t42;
    	let td20;
    	let t43_value = /*player*/ ctx[1].construction.city + "";
    	let t43;
    	let t44;
    	let t45;
    	let td21;
    	let t46_value = /*player*/ ctx[1].construction.road + "";
    	let t46;
    	let t47;
    	let t48;
    	let td22;
    	let t49_value = /*player*/ ctx[1].construction.knight + "";
    	let t49;
    	let t50;
    	let td23;
    	let t51_value = /*player*/ ctx[1].maxRoadLength + "";
    	let t51;
    	let t52;
    	let tr9;
    	let td25;
    	let t54;
    	let t55;
    	let tr11;
    	let td27;
    	let t57;
    	let tr12;
    	let td28;
    	let construction;
    	let current;
    	let each_value = /*resourceList*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	construction = new Construction({
    			props: { playerIndex: /*playerIndex*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			table3 = element("table");
    			tr0 = element("tr");
    			td0 = element("td");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			t1 = text("점수 ");
    			t2 = text(t2_value);
    			t3 = text(" 자원 ");
    			t4 = text(t4_value);
    			t5 = space();
    			tr10 = element("tr");
    			td26 = element("td");
    			table2 = element("table");
    			tr1 = element("tr");
    			td1 = element("td");
    			td1.textContent = "점수";
    			t7 = space();
    			tr4 = element("tr");
    			td12 = element("td");
    			table0 = element("table");
    			tr2 = element("tr");
    			td2 = element("td");
    			td2.textContent = "마을";
    			t9 = space();
    			td3 = element("td");
    			td3.textContent = "도시";
    			t11 = space();
    			td4 = element("td");
    			td4.textContent = "발전";
    			t13 = space();
    			td5 = element("td");
    			td5.textContent = "최장 교역로";
    			t15 = space();
    			td6 = element("td");
    			td6.textContent = "최강 기사단";
    			t17 = space();
    			tr3 = element("tr");
    			td7 = element("td");
    			t18 = text(t18_value);
    			t19 = space();
    			td8 = element("td");
    			t20 = text(t20_value);
    			t21 = space();
    			td9 = element("td");
    			t22 = text(t22_value);
    			t23 = space();
    			td10 = element("td");
    			t24 = text(t24_value);
    			t25 = space();
    			td11 = element("td");
    			t26 = text(t26_value);
    			t27 = space();
    			tr5 = element("tr");
    			td13 = element("td");
    			td13.textContent = "건설";
    			t29 = space();
    			tr8 = element("tr");
    			td24 = element("td");
    			table1 = element("table");
    			tr6 = element("tr");
    			td14 = element("td");
    			td14.textContent = "마을";
    			t31 = space();
    			td15 = element("td");
    			td15.textContent = "도시";
    			t33 = space();
    			td16 = element("td");
    			td16.textContent = "도로";
    			t35 = space();
    			td17 = element("td");
    			td17.textContent = "기사";
    			t37 = space();
    			td18 = element("td");
    			td18.textContent = "최장도로";
    			t39 = space();
    			tr7 = element("tr");
    			td19 = element("td");
    			t40 = text(t40_value);
    			t41 = text(" / 5");
    			t42 = space();
    			td20 = element("td");
    			t43 = text(t43_value);
    			t44 = text(" / 4");
    			t45 = space();
    			td21 = element("td");
    			t46 = text(t46_value);
    			t47 = text(" / 15");
    			t48 = space();
    			td22 = element("td");
    			t49 = text(t49_value);
    			t50 = space();
    			td23 = element("td");
    			t51 = text(t51_value);
    			t52 = space();
    			tr9 = element("tr");
    			td25 = element("td");
    			td25.textContent = "자원";
    			t54 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t55 = space();
    			tr11 = element("tr");
    			td27 = element("td");
    			td27.textContent = "건설";
    			t57 = space();
    			tr12 = element("tr");
    			td28 = element("td");
    			create_component(construction.$$.fragment);
    			if (img.src !== (img_src_value = /*player*/ ctx[1].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-zrpzlp");
    			add_location(img, file$7, 47, 43, 1197);
    			attr_dev(div0, "class", "player-header svelte-zrpzlp");
    			add_location(div0, file$7, 47, 16, 1170);
    			attr_dev(div1, "class", "player-header player-sum svelte-zrpzlp");
    			add_location(div1, file$7, 48, 16, 1252);
    			attr_dev(td0, "class", "name svelte-zrpzlp");
    			set_style(td0, "background-color", /*player*/ ctx[1].color);
    			add_location(td0, file$7, 45, 12, 1078);
    			add_location(tr0, file$7, 44, 8, 1060);
    			attr_dev(td1, "colspan", "3");
    			attr_dev(td1, "class", "header svelte-zrpzlp");
    			add_location(td1, file$7, 55, 24, 1507);
    			add_location(tr1, file$7, 54, 20, 1477);
    			attr_dev(td2, "class", "svelte-zrpzlp");
    			add_location(td2, file$7, 62, 36, 1782);
    			attr_dev(td3, "class", "svelte-zrpzlp");
    			add_location(td3, file$7, 63, 36, 1831);
    			attr_dev(td4, "class", "svelte-zrpzlp");
    			add_location(td4, file$7, 64, 36, 1880);
    			attr_dev(td5, "class", "svelte-zrpzlp");
    			add_location(td5, file$7, 65, 36, 1929);
    			attr_dev(td6, "class", "svelte-zrpzlp");
    			add_location(td6, file$7, 66, 36, 1982);
    			attr_dev(tr2, "class", "point");
    			add_location(tr2, file$7, 61, 32, 1726);
    			attr_dev(td7, "class", "svelte-zrpzlp");
    			add_location(td7, file$7, 69, 36, 2112);
    			attr_dev(td8, "class", "svelte-zrpzlp");
    			add_location(td8, file$7, 70, 36, 2180);
    			attr_dev(td9, "class", "svelte-zrpzlp");
    			add_location(td9, file$7, 71, 36, 2246);
    			attr_dev(td10, "class", "svelte-zrpzlp");
    			add_location(td10, file$7, 72, 36, 2313);
    			attr_dev(td11, "class", "svelte-zrpzlp");
    			add_location(td11, file$7, 73, 36, 2379);
    			add_location(tr3, file$7, 68, 32, 2070);
    			attr_dev(table0, "width", "100%");
    			add_location(table0, file$7, 59, 28, 1670);
    			attr_dev(td12, "colspan", "3");
    			attr_dev(td12, "class", "svelte-zrpzlp");
    			add_location(td12, file$7, 58, 24, 1624);
    			add_location(tr4, file$7, 57, 20, 1594);
    			attr_dev(td13, "colspan", "3");
    			attr_dev(td13, "class", "header svelte-zrpzlp");
    			add_location(td13, file$7, 80, 24, 2598);
    			add_location(tr5, file$7, 79, 20, 2568);
    			attr_dev(td14, "class", "svelte-zrpzlp");
    			add_location(td14, file$7, 86, 36, 2878);
    			attr_dev(td15, "class", "svelte-zrpzlp");
    			add_location(td15, file$7, 87, 36, 2927);
    			attr_dev(td16, "class", "svelte-zrpzlp");
    			add_location(td16, file$7, 88, 36, 2976);
    			attr_dev(td17, "class", "svelte-zrpzlp");
    			add_location(td17, file$7, 89, 36, 3025);
    			attr_dev(td18, "class", "svelte-zrpzlp");
    			add_location(td18, file$7, 90, 36, 3074);
    			add_location(tr6, file$7, 85, 32, 2836);
    			attr_dev(td19, "class", "svelte-zrpzlp");
    			add_location(td19, file$7, 93, 36, 3202);
    			attr_dev(td20, "class", "svelte-zrpzlp");
    			add_location(td20, file$7, 94, 36, 3281);
    			attr_dev(td21, "class", "svelte-zrpzlp");
    			add_location(td21, file$7, 95, 36, 3358);
    			attr_dev(td22, "class", "svelte-zrpzlp");
    			add_location(td22, file$7, 96, 36, 3436);
    			attr_dev(td23, "class", "svelte-zrpzlp");
    			add_location(td23, file$7, 97, 36, 3511);
    			add_location(tr7, file$7, 92, 32, 3160);
    			attr_dev(table1, "class", "construction svelte-zrpzlp");
    			attr_dev(table1, "width", "100%");
    			add_location(table1, file$7, 84, 28, 2761);
    			attr_dev(td24, "colspan", "3");
    			attr_dev(td24, "class", "svelte-zrpzlp");
    			add_location(td24, file$7, 83, 24, 2715);
    			add_location(tr8, file$7, 82, 20, 2685);
    			attr_dev(td25, "colspan", "3");
    			attr_dev(td25, "class", "header svelte-zrpzlp");
    			add_location(td25, file$7, 104, 24, 3731);
    			add_location(tr9, file$7, 103, 20, 3701);
    			attr_dev(table2, "class", "inner-resource svelte-zrpzlp");
    			add_location(table2, file$7, 53, 16, 1425);
    			attr_dev(td26, "class", "svelte-zrpzlp");
    			add_location(td26, file$7, 52, 12, 1403);
    			add_location(tr10, file$7, 51, 8, 1385);
    			attr_dev(td27, "class", "header svelte-zrpzlp");
    			add_location(td27, file$7, 153, 12, 6794);
    			add_location(tr11, file$7, 152, 8, 6776);
    			attr_dev(td28, "class", "svelte-zrpzlp");
    			add_location(td28, file$7, 156, 12, 6863);
    			add_location(tr12, file$7, 155, 8, 6845);
    			attr_dev(table3, "class", "trade-resource svelte-zrpzlp");
    			attr_dev(table3, "style", /*playerStyle*/ ctx[3]);
    			add_location(table3, file$7, 43, 4, 1000);
    			add_location(main, file$7, 42, 0, 988);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, table3);
    			append_dev(table3, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, div0);
    			append_dev(div0, img);
    			append_dev(td0, t0);
    			append_dev(td0, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(table3, t5);
    			append_dev(table3, tr10);
    			append_dev(tr10, td26);
    			append_dev(td26, table2);
    			append_dev(table2, tr1);
    			append_dev(tr1, td1);
    			append_dev(table2, t7);
    			append_dev(table2, tr4);
    			append_dev(tr4, td12);
    			append_dev(td12, table0);
    			append_dev(table0, tr2);
    			append_dev(tr2, td2);
    			append_dev(tr2, t9);
    			append_dev(tr2, td3);
    			append_dev(tr2, t11);
    			append_dev(tr2, td4);
    			append_dev(tr2, t13);
    			append_dev(tr2, td5);
    			append_dev(tr2, t15);
    			append_dev(tr2, td6);
    			append_dev(table0, t17);
    			append_dev(table0, tr3);
    			append_dev(tr3, td7);
    			append_dev(td7, t18);
    			append_dev(tr3, t19);
    			append_dev(tr3, td8);
    			append_dev(td8, t20);
    			append_dev(tr3, t21);
    			append_dev(tr3, td9);
    			append_dev(td9, t22);
    			append_dev(tr3, t23);
    			append_dev(tr3, td10);
    			append_dev(td10, t24);
    			append_dev(tr3, t25);
    			append_dev(tr3, td11);
    			append_dev(td11, t26);
    			append_dev(table2, t27);
    			append_dev(table2, tr5);
    			append_dev(tr5, td13);
    			append_dev(table2, t29);
    			append_dev(table2, tr8);
    			append_dev(tr8, td24);
    			append_dev(td24, table1);
    			append_dev(table1, tr6);
    			append_dev(tr6, td14);
    			append_dev(tr6, t31);
    			append_dev(tr6, td15);
    			append_dev(tr6, t33);
    			append_dev(tr6, td16);
    			append_dev(tr6, t35);
    			append_dev(tr6, td17);
    			append_dev(tr6, t37);
    			append_dev(tr6, td18);
    			append_dev(table1, t39);
    			append_dev(table1, tr7);
    			append_dev(tr7, td19);
    			append_dev(td19, t40);
    			append_dev(td19, t41);
    			append_dev(tr7, t42);
    			append_dev(tr7, td20);
    			append_dev(td20, t43);
    			append_dev(td20, t44);
    			append_dev(tr7, t45);
    			append_dev(tr7, td21);
    			append_dev(td21, t46);
    			append_dev(td21, t47);
    			append_dev(tr7, t48);
    			append_dev(tr7, td22);
    			append_dev(td22, t49);
    			append_dev(tr7, t50);
    			append_dev(tr7, td23);
    			append_dev(td23, t51);
    			append_dev(table2, t52);
    			append_dev(table2, tr9);
    			append_dev(tr9, td25);
    			append_dev(table2, t54);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table2, null);
    			}

    			append_dev(table3, t55);
    			append_dev(table3, tr11);
    			append_dev(tr11, td27);
    			append_dev(table3, t57);
    			append_dev(table3, tr12);
    			append_dev(tr12, td28);
    			mount_component(construction, td28, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*player*/ 2 && img.src !== (img_src_value = /*player*/ ctx[1].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*player*/ 2) && t2_value !== (t2_value = /*player*/ ctx[1].point.sum + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*player*/ 2) && t4_value !== (t4_value = /*player*/ ctx[1].resourceSum + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*player*/ 2) {
    				set_style(td0, "background-color", /*player*/ ctx[1].color);
    			}

    			if ((!current || dirty & /*player*/ 2) && t18_value !== (t18_value = /*player*/ ctx[1].point.castle + "")) set_data_dev(t18, t18_value);
    			if ((!current || dirty & /*player*/ 2) && t20_value !== (t20_value = /*player*/ ctx[1].point.city + "")) set_data_dev(t20, t20_value);
    			if ((!current || dirty & /*player*/ 2) && t22_value !== (t22_value = /*player*/ ctx[1].point.point + "")) set_data_dev(t22, t22_value);
    			if ((!current || dirty & /*player*/ 2) && t24_value !== (t24_value = /*player*/ ctx[1].point.road + "")) set_data_dev(t24, t24_value);
    			if ((!current || dirty & /*player*/ 2) && t26_value !== (t26_value = /*player*/ ctx[1].point.knight + "")) set_data_dev(t26, t26_value);
    			if ((!current || dirty & /*player*/ 2) && t40_value !== (t40_value = /*player*/ ctx[1].construction.castle + "")) set_data_dev(t40, t40_value);
    			if ((!current || dirty & /*player*/ 2) && t43_value !== (t43_value = /*player*/ ctx[1].construction.city + "")) set_data_dev(t43, t43_value);
    			if ((!current || dirty & /*player*/ 2) && t46_value !== (t46_value = /*player*/ ctx[1].construction.road + "")) set_data_dev(t46, t46_value);
    			if ((!current || dirty & /*player*/ 2) && t49_value !== (t49_value = /*player*/ ctx[1].construction.knight + "")) set_data_dev(t49, t49_value);
    			if ((!current || dirty & /*player*/ 2) && t51_value !== (t51_value = /*player*/ ctx[1].maxRoadLength + "")) set_data_dev(t51, t51_value);

    			if (dirty & /*katan, resourceList, $katan, playerIndex, player*/ 23) {
    				each_value = /*resourceList*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const construction_changes = {};
    			if (dirty & /*playerIndex*/ 1) construction_changes.playerIndex = /*playerIndex*/ ctx[0];
    			construction.$set(construction_changes);

    			if (!current || dirty & /*playerStyle*/ 8) {
    				attr_dev(table3, "style", /*playerStyle*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(construction.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(construction.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			destroy_component(construction);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $katan;
    	validate_store(katanStore, "katan");
    	component_subscribe($$self, katanStore, $$value => $$invalidate(2, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Player", slots, []);
    	let { playerIndex } = $$props;

    	const getResourceList = player => {
    		return $katan.resourceTypeList.map(typeObject => ({
    			type: typeObject.type,
    			count: player.resource[typeObject.type]
    		}));
    	};

    	const getPlayerColor = () => {
    		if (player.turn) {
    			return player.color;
    		}

    		return "white";
    	};

    	const getPlayerStyle = () => {
    		return toStyle({ border: "10px solid " + getPlayerColor() });
    	};

    	let player;
    	let playerList;
    	let playerStyle;
    	let resourceList;
    	const writable_props = ["playerIndex"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	const click_handler = resource => katanStore.plus(playerIndex, resource.type);
    	const click_handler_1 = resource => katanStore.getResource(resource.type);
    	const click_handler_2 = (resource, tradeResource) => katanStore.exchange(resource.type, tradeResource.type);

    	$$self.$$set = $$props => {
    		if ("playerIndex" in $$props) $$invalidate(0, playerIndex = $$props.playerIndex);
    	};

    	$$self.$capture_state = () => ({
    		katan: katanStore,
    		Construction,
    		toStyle,
    		playerIndex,
    		getResourceList,
    		getPlayerColor,
    		getPlayerStyle,
    		player,
    		playerList,
    		playerStyle,
    		resourceList,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("playerIndex" in $$props) $$invalidate(0, playerIndex = $$props.playerIndex);
    		if ("player" in $$props) $$invalidate(1, player = $$props.player);
    		if ("playerList" in $$props) $$invalidate(5, playerList = $$props.playerList);
    		if ("playerStyle" in $$props) $$invalidate(3, playerStyle = $$props.playerStyle);
    		if ("resourceList" in $$props) $$invalidate(4, resourceList = $$props.resourceList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$katan, playerList, playerIndex, player*/ 39) {
    			{
    				$$invalidate(5, playerList = $katan.playerList);
    				$$invalidate(1, player = playerList[playerIndex]);
    				$$invalidate(3, playerStyle = getPlayerStyle());
    				$$invalidate(4, resourceList = getResourceList(player));
    			}
    		}
    	};

    	return [
    		playerIndex,
    		player,
    		$katan,
    		playerStyle,
    		resourceList,
    		playerList,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { playerIndex: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*playerIndex*/ ctx[0] === undefined && !("playerIndex" in props)) {
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

    /*!
      * Bootstrap v5.0.0-alpha2 (https://getbootstrap.com/)
      * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    var bootstrap_esm_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}function e(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}function n(){return (n=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i]);}return t}).apply(this,arguments)}var i,o,r,s,a=function(t){do{t+=Math.floor(1e6*Math.random());}while(document.getElementById(t));return t},l=function(t){var e=t.getAttribute("data-target");if(!e||"#"===e){var n=t.getAttribute("href");e=n&&"#"!==n?n.trim():null;}return e},c=function(t){var e=l(t);return e&&document.querySelector(e)?e:null},u=function(t){var e=l(t);return e?document.querySelector(e):null},f=function(t){if(!t)return 0;var e=window.getComputedStyle(t),n=e.transitionDuration,i=e.transitionDelay,o=parseFloat(n),r=parseFloat(i);return o||r?(n=n.split(",")[0],i=i.split(",")[0],1e3*(parseFloat(n)+parseFloat(i))):0},h=function(t){t.dispatchEvent(new Event("transitionend"));},d=function(t){return (t[0]||t).nodeType},p=function(t,e){var n=!1,i=e+5;t.addEventListener("transitionend",(function e(){n=!0,t.removeEventListener("transitionend",e);})),setTimeout((function(){n||h(t);}),i);},g=function(t,e,n){Object.keys(n).forEach((function(i){var o,r=n[i],s=e[i],a=s&&d(s)?"element":null==(o=s)?""+o:{}.toString.call(o).match(/\s([a-z]+)/i)[1].toLowerCase();if(!new RegExp(r).test(a))throw new Error(t.toUpperCase()+': Option "'+i+'" provided type "'+a+'" but expected type "'+r+'".')}));},m=function(t){if(!t)return !1;if(t.style&&t.parentNode&&t.parentNode.style){var e=getComputedStyle(t),n=getComputedStyle(t.parentNode);return "none"!==e.display&&"none"!==n.display&&"hidden"!==e.visibility}return !1},v=function(){return function(){}},_=function(t){return t.offsetHeight},b=function(){var t=window.jQuery;return t&&!document.body.hasAttribute("data-no-jquery")?t:null},y=(i={},o=1,{set:function(t,e,n){void 0===t.bsKey&&(t.bsKey={key:e,id:o},o++),i[t.bsKey.id]=n;},get:function(t,e){if(!t||void 0===t.bsKey)return null;var n=t.bsKey;return n.key===e?i[n.id]:null},delete:function(t,e){if(void 0!==t.bsKey){var n=t.bsKey;n.key===e&&(delete i[n.id],delete t.bsKey);}}}),w=function(t,e,n){y.set(t,e,n);},E=function(t,e){return y.get(t,e)},T=function(t,e){y.delete(t,e);},L=Element.prototype.querySelectorAll,k=Element.prototype.querySelector,C=(r=new CustomEvent("Bootstrap",{cancelable:!0}),(s=document.createElement("div")).addEventListener("Bootstrap",(function(){return null})),r.preventDefault(),s.dispatchEvent(r),r.defaultPrevented),A=/:scope\b/;(function(){var t=document.createElement("div");try{t.querySelectorAll(":scope *");}catch(t){return !1}return !0})()||(L=function(t){if(!A.test(t))return this.querySelectorAll(t);var e=Boolean(this.id);e||(this.id=a("scope"));var n=null;try{t=t.replace(A,"#"+this.id),n=this.querySelectorAll(t);}finally{e||this.removeAttribute("id");}return n},k=function(t){if(!A.test(t))return this.querySelector(t);var e=L.call(this,t);return void 0!==e[0]?e[0]:null});var O=b(),S=/[^.]*(?=\..*)\.|.*/,D=/\..*/,x=/::\d+$/,N={},I=1,j={mouseenter:"mouseover",mouseleave:"mouseout"},P=["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"];function M(t,e){return e&&e+"::"+I++||t.uidEvent||I++}function H(t){var e=M(t);return t.uidEvent=e,N[e]=N[e]||{},N[e]}function B(t,e,n){void 0===n&&(n=null);for(var i=Object.keys(t),o=0,r=i.length;o<r;o++){var s=t[i[o]];if(s.originalHandler===e&&s.delegationSelector===n)return s}return null}function R(t,e,n){var i="string"==typeof e,o=i?n:e,r=t.replace(D,""),s=j[r];return s&&(r=s),P.indexOf(r)>-1||(r=t),[i,o,r]}function F(t,e,n,i,o){if("string"==typeof e&&t){n||(n=i,i=null);var r=R(e,n,i),s=r[0],a=r[1],l=r[2],c=H(t),u=c[l]||(c[l]={}),f=B(u,a,s?n:null);if(f)f.oneOff=f.oneOff&&o;else {var h=M(a,e.replace(S,"")),d=s?function(t,e,n){return function i(o){for(var r=t.querySelectorAll(e),s=o.target;s&&s!==this;s=s.parentNode)for(var a=r.length;a--;)if(r[a]===s)return o.delegateTarget=s,i.oneOff&&U.off(t,o.type,n),n.apply(s,[o]);return null}}(t,n,i):function(t,e){return function n(i){return i.delegateTarget=t,n.oneOff&&U.off(t,i.type,e),e.apply(t,[i])}}(t,n);d.delegationSelector=s?n:null,d.originalHandler=a,d.oneOff=o,d.uidEvent=h,u[h]=d,t.addEventListener(l,d,s);}}}function W(t,e,n,i,o){var r=B(e[n],i,o);r&&(t.removeEventListener(n,r,Boolean(o)),delete e[n][r.uidEvent]);}var U={on:function(t,e,n,i){F(t,e,n,i,!1);},one:function(t,e,n,i){F(t,e,n,i,!0);},off:function(t,e,n,i){if("string"==typeof e&&t){var o=R(e,n,i),r=o[0],s=o[1],a=o[2],l=a!==e,c=H(t),u="."===e.charAt(0);if(void 0===s){u&&Object.keys(c).forEach((function(n){!function(t,e,n,i){var o=e[n]||{};Object.keys(o).forEach((function(r){if(r.indexOf(i)>-1){var s=o[r];W(t,e,n,s.originalHandler,s.delegationSelector);}}));}(t,c,n,e.slice(1));}));var f=c[a]||{};Object.keys(f).forEach((function(n){var i=n.replace(x,"");if(!l||e.indexOf(i)>-1){var o=f[n];W(t,c,a,o.originalHandler,o.delegationSelector);}}));}else {if(!c||!c[a])return;W(t,c,a,s,r?n:null);}}},trigger:function(t,e,n){if("string"!=typeof e||!t)return null;var i,o=e.replace(D,""),r=e!==o,s=P.indexOf(o)>-1,a=!0,l=!0,c=!1,u=null;return r&&O&&(i=O.Event(e,n),O(t).trigger(i),a=!i.isPropagationStopped(),l=!i.isImmediatePropagationStopped(),c=i.isDefaultPrevented()),s?(u=document.createEvent("HTMLEvents")).initEvent(o,a,!0):u=new CustomEvent(e,{bubbles:a,cancelable:!0}),void 0!==n&&Object.keys(n).forEach((function(t){Object.defineProperty(u,t,{get:function(){return n[t]}});})),c&&(u.preventDefault(),C||Object.defineProperty(u,"defaultPrevented",{get:function(){return !0}})),l&&t.dispatchEvent(u),u.defaultPrevented&&void 0!==i&&i.preventDefault(),u}},Q="alert",V=function(){function t(t){this._element=t,this._element&&w(t,"bs.alert",this);}var n=t.prototype;return n.close=function(t){var e=t?this._getRootElement(t):this._element,n=this._triggerCloseEvent(e);null===n||n.defaultPrevented||this._removeElement(e);},n.dispose=function(){T(this._element,"bs.alert"),this._element=null;},n._getRootElement=function(t){return u(t)||t.closest(".alert")},n._triggerCloseEvent=function(t){return U.trigger(t,"close.bs.alert")},n._removeElement=function(t){var e=this;if(t.classList.remove("show"),t.classList.contains("fade")){var n=f(t);U.one(t,"transitionend",(function(){return e._destroyElement(t)})),p(t,n);}else this._destroyElement(t);},n._destroyElement=function(t){t.parentNode&&t.parentNode.removeChild(t),U.trigger(t,"closed.bs.alert");},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.alert");n||(n=new t(this)),"close"===e&&n[e](this);}))},t.handleDismiss=function(t){return function(e){e&&e.preventDefault(),t.close(this);}},t.getInstance=function(t){return E(t,"bs.alert")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}}]),t}();U.on(document,"click.bs.alert.data-api",'[data-dismiss="alert"]',V.handleDismiss(new V));var K=b();if(K){var Y=K.fn[Q];K.fn[Q]=V.jQueryInterface,K.fn[Q].Constructor=V,K.fn[Q].noConflict=function(){return K.fn[Q]=Y,V.jQueryInterface};}var q=function(){function t(t){this._element=t,w(t,"bs.button",this);}var n=t.prototype;return n.toggle=function(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"));},n.dispose=function(){T(this._element,"bs.button"),this._element=null;},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.button");n||(n=new t(this)),"toggle"===e&&n[e]();}))},t.getInstance=function(t){return E(t,"bs.button")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}}]),t}();U.on(document,"click.bs.button.data-api",'[data-toggle="button"]',(function(t){t.preventDefault();var e=t.target.closest('[data-toggle="button"]'),n=E(e,"bs.button");n||(n=new q(e)),n.toggle();}));var z=b();if(z){var X=z.fn.button;z.fn.button=q.jQueryInterface,z.fn.button.Constructor=q,z.fn.button.noConflict=function(){return z.fn.button=X,q.jQueryInterface};}function G(t){return "true"===t||"false"!==t&&(t===Number(t).toString()?Number(t):""===t||"null"===t?null:t)}function $(t){return t.replace(/[A-Z]/g,(function(t){return "-"+t.toLowerCase()}))}var Z={setDataAttribute:function(t,e,n){t.setAttribute("data-"+$(e),n);},removeDataAttribute:function(t,e){t.removeAttribute("data-"+$(e));},getDataAttributes:function(t){if(!t)return {};var e=n({},t.dataset);return Object.keys(e).forEach((function(t){e[t]=G(e[t]);})),e},getDataAttribute:function(t,e){return G(t.getAttribute("data-"+$(e)))},offset:function(t){var e=t.getBoundingClientRect();return {top:e.top+document.body.scrollTop,left:e.left+document.body.scrollLeft}},position:function(t){return {top:t.offsetTop,left:t.offsetLeft}},toggleClass:function(t,e){t&&(t.classList.contains(e)?t.classList.remove(e):t.classList.add(e));}},J={matches:function(t,e){return t.matches(e)},find:function(t,e){var n;return void 0===e&&(e=document.documentElement),(n=[]).concat.apply(n,L.call(e,t))},findOne:function(t,e){return void 0===e&&(e=document.documentElement),k.call(e,t)},children:function(t,e){var n,i=(n=[]).concat.apply(n,t.children);return i.filter((function(t){return t.matches(e)}))},parents:function(t,e){for(var n=[],i=t.parentNode;i&&i.nodeType===Node.ELEMENT_NODE&&3!==i.nodeType;)this.matches(i,e)&&n.push(i),i=i.parentNode;return n},prev:function(t,e){for(var n=t.previousElementSibling;n;){if(n.matches(e))return [n];n=n.previousElementSibling;}return []},next:function(t,e){for(var n=t.nextElementSibling;n;){if(this.matches(n,e))return [n];n=n.nextElementSibling;}return []}},tt="carousel",et=".bs.carousel",nt={interval:5e3,keyboard:!0,slide:!1,pause:"hover",wrap:!0,touch:!0},it={interval:"(number|boolean)",keyboard:"boolean",slide:"(boolean|string)",pause:"(string|boolean)",wrap:"boolean",touch:"boolean"},ot={TOUCH:"touch",PEN:"pen"},rt=function(){function t(t,e){this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this.touchStartX=0,this.touchDeltaX=0,this._config=this._getConfig(e),this._element=t,this._indicatorsElement=J.findOne(".carousel-indicators",this._element),this._touchSupported="ontouchstart"in document.documentElement||navigator.maxTouchPoints>0,this._pointerEvent=Boolean(window.PointerEvent),this._addEventListeners(),w(t,"bs.carousel",this);}var i=t.prototype;return i.next=function(){this._isSliding||this._slide("next");},i.nextWhenVisible=function(){!document.hidden&&m(this._element)&&this.next();},i.prev=function(){this._isSliding||this._slide("prev");},i.pause=function(t){t||(this._isPaused=!0),J.findOne(".carousel-item-next, .carousel-item-prev",this._element)&&(h(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null;},i.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config&&this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval));},i.to=function(t){var e=this;this._activeElement=J.findOne(".active.carousel-item",this._element);var n=this._getItemIndex(this._activeElement);if(!(t>this._items.length-1||t<0))if(this._isSliding)U.one(this._element,"slid.bs.carousel",(function(){return e.to(t)}));else {if(n===t)return this.pause(),void this.cycle();var i=t>n?"next":"prev";this._slide(i,this._items[t]);}},i.dispose=function(){U.off(this._element,et),T(this._element,"bs.carousel"),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null;},i._getConfig=function(t){return t=n({},nt,t),g(tt,t,it),t},i._handleSwipe=function(){var t=Math.abs(this.touchDeltaX);if(!(t<=40)){var e=t/this.touchDeltaX;this.touchDeltaX=0,e>0&&this.prev(),e<0&&this.next();}},i._addEventListeners=function(){var t=this;this._config.keyboard&&U.on(this._element,"keydown.bs.carousel",(function(e){return t._keydown(e)})),"hover"===this._config.pause&&(U.on(this._element,"mouseenter.bs.carousel",(function(e){return t.pause(e)})),U.on(this._element,"mouseleave.bs.carousel",(function(e){return t.cycle(e)}))),this._config.touch&&this._touchSupported&&this._addTouchEventListeners();},i._addTouchEventListeners=function(){var t=this,e=function(e){t._pointerEvent&&ot[e.pointerType.toUpperCase()]?t.touchStartX=e.clientX:t._pointerEvent||(t.touchStartX=e.touches[0].clientX);},n=function(e){t._pointerEvent&&ot[e.pointerType.toUpperCase()]&&(t.touchDeltaX=e.clientX-t.touchStartX),t._handleSwipe(),"hover"===t._config.pause&&(t.pause(),t.touchTimeout&&clearTimeout(t.touchTimeout),t.touchTimeout=setTimeout((function(e){return t.cycle(e)}),500+t._config.interval));};J.find(".carousel-item img",this._element).forEach((function(t){U.on(t,"dragstart.bs.carousel",(function(t){return t.preventDefault()}));})),this._pointerEvent?(U.on(this._element,"pointerdown.bs.carousel",(function(t){return e(t)})),U.on(this._element,"pointerup.bs.carousel",(function(t){return n(t)})),this._element.classList.add("pointer-event")):(U.on(this._element,"touchstart.bs.carousel",(function(t){return e(t)})),U.on(this._element,"touchmove.bs.carousel",(function(e){return function(e){e.touches&&e.touches.length>1?t.touchDeltaX=0:t.touchDeltaX=e.touches[0].clientX-t.touchStartX;}(e)})),U.on(this._element,"touchend.bs.carousel",(function(t){return n(t)})));},i._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.key){case"ArrowLeft":t.preventDefault(),this.prev();break;case"ArrowRight":t.preventDefault(),this.next();}},i._getItemIndex=function(t){return this._items=t&&t.parentNode?J.find(".carousel-item",t.parentNode):[],this._items.indexOf(t)},i._getItemByDirection=function(t,e){var n="next"===t,i="prev"===t,o=this._getItemIndex(e),r=this._items.length-1;if((i&&0===o||n&&o===r)&&!this._config.wrap)return e;var s=(o+("prev"===t?-1:1))%this._items.length;return -1===s?this._items[this._items.length-1]:this._items[s]},i._triggerSlideEvent=function(t,e){var n=this._getItemIndex(t),i=this._getItemIndex(J.findOne(".active.carousel-item",this._element));return U.trigger(this._element,"slide.bs.carousel",{relatedTarget:t,direction:e,from:i,to:n})},i._setActiveIndicatorElement=function(t){if(this._indicatorsElement){for(var e=J.find(".active",this._indicatorsElement),n=0;n<e.length;n++)e[n].classList.remove("active");var i=this._indicatorsElement.children[this._getItemIndex(t)];i&&i.classList.add("active");}},i._slide=function(t,e){var n,i,o,r=this,s=J.findOne(".active.carousel-item",this._element),a=this._getItemIndex(s),l=e||s&&this._getItemByDirection(t,s),c=this._getItemIndex(l),u=Boolean(this._interval);if("next"===t?(n="carousel-item-left",i="carousel-item-next",o="left"):(n="carousel-item-right",i="carousel-item-prev",o="right"),l&&l.classList.contains("active"))this._isSliding=!1;else if(!this._triggerSlideEvent(l,o).defaultPrevented&&s&&l){if(this._isSliding=!0,u&&this.pause(),this._setActiveIndicatorElement(l),this._element.classList.contains("slide")){l.classList.add(i),_(l),s.classList.add(n),l.classList.add(n);var h=parseInt(l.getAttribute("data-interval"),10);h?(this._config.defaultInterval=this._config.defaultInterval||this._config.interval,this._config.interval=h):this._config.interval=this._config.defaultInterval||this._config.interval;var d=f(s);U.one(s,"transitionend",(function(){l.classList.remove(n,i),l.classList.add("active"),s.classList.remove("active",i,n),r._isSliding=!1,setTimeout((function(){U.trigger(r._element,"slid.bs.carousel",{relatedTarget:l,direction:o,from:a,to:c});}),0);})),p(s,d);}else s.classList.remove("active"),l.classList.add("active"),this._isSliding=!1,U.trigger(this._element,"slid.bs.carousel",{relatedTarget:l,direction:o,from:a,to:c});u&&this.cycle();}},t.carouselInterface=function(e,i){var o=E(e,"bs.carousel"),r=n({},nt,Z.getDataAttributes(e));"object"==typeof i&&(r=n({},r,i));var s="string"==typeof i?i:r.slide;if(o||(o=new t(e,r)),"number"==typeof i)o.to(i);else if("string"==typeof s){if(void 0===o[s])throw new TypeError('No method named "'+s+'"');o[s]();}else r.interval&&r.ride&&(o.pause(),o.cycle());},t.jQueryInterface=function(e){return this.each((function(){t.carouselInterface(this,e);}))},t.dataApiClickHandler=function(e){var i=u(this);if(i&&i.classList.contains("carousel")){var o=n({},Z.getDataAttributes(i),Z.getDataAttributes(this)),r=this.getAttribute("data-slide-to");r&&(o.interval=!1),t.carouselInterface(i,o),r&&E(i,"bs.carousel").to(r),e.preventDefault();}},t.getInstance=function(t){return E(t,"bs.carousel")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return nt}}]),t}();U.on(document,"click.bs.carousel.data-api","[data-slide], [data-slide-to]",rt.dataApiClickHandler),U.on(window,"load.bs.carousel.data-api",(function(){for(var t=J.find('[data-ride="carousel"]'),e=0,n=t.length;e<n;e++)rt.carouselInterface(t[e],E(t[e],"bs.carousel"));}));var st=b();if(st){var at=st.fn[tt];st.fn[tt]=rt.jQueryInterface,st.fn[tt].Constructor=rt,st.fn[tt].noConflict=function(){return st.fn[tt]=at,rt.jQueryInterface};}var lt="collapse",ct={toggle:!0,parent:""},ut={toggle:"boolean",parent:"(string|element)"},ft=function(){function t(t,e){this._isTransitioning=!1,this._element=t,this._config=this._getConfig(e),this._triggerArray=J.find('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]');for(var n=J.find('[data-toggle="collapse"]'),i=0,o=n.length;i<o;i++){var r=n[i],s=c(r),a=J.find(s).filter((function(e){return e===t}));null!==s&&a.length&&(this._selector=s,this._triggerArray.push(r));}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle(),w(t,"bs.collapse",this);}var i=t.prototype;return i.toggle=function(){this._element.classList.contains("show")?this.hide():this.show();},i.show=function(){var e=this;if(!this._isTransitioning&&!this._element.classList.contains("show")){var n,i;this._parent&&0===(n=J.find(".show, .collapsing",this._parent).filter((function(t){return "string"==typeof e._config.parent?t.getAttribute("data-parent")===e._config.parent:t.classList.contains("collapse")}))).length&&(n=null);var o=J.findOne(this._selector);if(n){var r=n.filter((function(t){return o!==t}));if((i=r[0]?E(r[0],"bs.collapse"):null)&&i._isTransitioning)return}if(!U.trigger(this._element,"show.bs.collapse").defaultPrevented){n&&n.forEach((function(e){o!==e&&t.collapseInterface(e,"hide"),i||w(e,"bs.collapse",null);}));var s=this._getDimension();this._element.classList.remove("collapse"),this._element.classList.add("collapsing"),this._element.style[s]=0,this._triggerArray.length&&this._triggerArray.forEach((function(t){t.classList.remove("collapsed"),t.setAttribute("aria-expanded",!0);})),this.setTransitioning(!0);var a="scroll"+(s[0].toUpperCase()+s.slice(1)),l=f(this._element);U.one(this._element,"transitionend",(function(){e._element.classList.remove("collapsing"),e._element.classList.add("collapse","show"),e._element.style[s]="",e.setTransitioning(!1),U.trigger(e._element,"shown.bs.collapse");})),p(this._element,l),this._element.style[s]=this._element[a]+"px";}}},i.hide=function(){var t=this;if(!this._isTransitioning&&this._element.classList.contains("show")&&!U.trigger(this._element,"hide.bs.collapse").defaultPrevented){var e=this._getDimension();this._element.style[e]=this._element.getBoundingClientRect()[e]+"px",_(this._element),this._element.classList.add("collapsing"),this._element.classList.remove("collapse","show");var n=this._triggerArray.length;if(n>0)for(var i=0;i<n;i++){var o=this._triggerArray[i],r=u(o);r&&!r.classList.contains("show")&&(o.classList.add("collapsed"),o.setAttribute("aria-expanded",!1));}this.setTransitioning(!0);this._element.style[e]="";var s=f(this._element);U.one(this._element,"transitionend",(function(){t.setTransitioning(!1),t._element.classList.remove("collapsing"),t._element.classList.add("collapse"),U.trigger(t._element,"hidden.bs.collapse");})),p(this._element,s);}},i.setTransitioning=function(t){this._isTransitioning=t;},i.dispose=function(){T(this._element,"bs.collapse"),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null;},i._getConfig=function(t){return (t=n({},ct,t)).toggle=Boolean(t.toggle),g(lt,t,ut),t},i._getDimension=function(){return this._element.classList.contains("width")?"width":"height"},i._getParent=function(){var t=this,e=this._config.parent;d(e)?void 0===e.jquery&&void 0===e[0]||(e=e[0]):e=J.findOne(e);var n='[data-toggle="collapse"][data-parent="'+e+'"]';return J.find(n,e).forEach((function(e){var n=u(e);t._addAriaAndCollapsedClass(n,[e]);})),e},i._addAriaAndCollapsedClass=function(t,e){if(t&&e.length){var n=t.classList.contains("show");e.forEach((function(t){n?t.classList.remove("collapsed"):t.classList.add("collapsed"),t.setAttribute("aria-expanded",n);}));}},t.collapseInterface=function(e,i){var o=E(e,"bs.collapse"),r=n({},ct,Z.getDataAttributes(e),"object"==typeof i&&i?i:{});if(!o&&r.toggle&&"string"==typeof i&&/show|hide/.test(i)&&(r.toggle=!1),o||(o=new t(e,r)),"string"==typeof i){if(void 0===o[i])throw new TypeError('No method named "'+i+'"');o[i]();}},t.jQueryInterface=function(e){return this.each((function(){t.collapseInterface(this,e);}))},t.getInstance=function(t){return E(t,"bs.collapse")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return ct}}]),t}();U.on(document,"click.bs.collapse.data-api",'[data-toggle="collapse"]',(function(t){"A"===t.target.tagName&&t.preventDefault();var e=Z.getDataAttributes(this),n=c(this);J.find(n).forEach((function(t){var n,i=E(t,"bs.collapse");i?(null===i._parent&&"string"==typeof e.parent&&(i._config.parent=e.parent,i._parent=i._getParent()),n="toggle"):n=e,ft.collapseInterface(t,n);}));}));var ht=b();if(ht){var dt=ht.fn[lt];ht.fn[lt]=ft.jQueryInterface,ht.fn[lt].Constructor=ft,ht.fn[lt].noConflict=function(){return ht.fn[lt]=dt,ft.jQueryInterface};}var pt="undefined"!=typeof window&&"undefined"!=typeof document&&"undefined"!=typeof navigator,gt=function(){for(var t=["Edge","Trident","Firefox"],e=0;e<t.length;e+=1)if(pt&&navigator.userAgent.indexOf(t[e])>=0)return 1;return 0}();var mt=pt&&window.Promise?function(t){var e=!1;return function(){e||(e=!0,window.Promise.resolve().then((function(){e=!1,t();})));}}:function(t){var e=!1;return function(){e||(e=!0,setTimeout((function(){e=!1,t();}),gt));}};function vt(t){return t&&"[object Function]"==={}.toString.call(t)}function _t(t,e){if(1!==t.nodeType)return [];var n=t.ownerDocument.defaultView.getComputedStyle(t,null);return e?n[e]:n}function bt(t){return "HTML"===t.nodeName?t:t.parentNode||t.host}function yt(t){if(!t)return document.body;switch(t.nodeName){case"HTML":case"BODY":return t.ownerDocument.body;case"#document":return t.body}var e=_t(t),n=e.overflow,i=e.overflowX,o=e.overflowY;return /(auto|scroll|overlay)/.test(n+o+i)?t:yt(bt(t))}function wt(t){return t&&t.referenceNode?t.referenceNode:t}var Et=pt&&!(!window.MSInputMethodContext||!document.documentMode),Tt=pt&&/MSIE 10/.test(navigator.userAgent);function Lt(t){return 11===t?Et:10===t?Tt:Et||Tt}function kt(t){if(!t)return document.documentElement;for(var e=Lt(10)?document.body:null,n=t.offsetParent||null;n===e&&t.nextElementSibling;)n=(t=t.nextElementSibling).offsetParent;var i=n&&n.nodeName;return i&&"BODY"!==i&&"HTML"!==i?-1!==["TH","TD","TABLE"].indexOf(n.nodeName)&&"static"===_t(n,"position")?kt(n):n:t?t.ownerDocument.documentElement:document.documentElement}function Ct(t){return null!==t.parentNode?Ct(t.parentNode):t}function At(t,e){if(!(t&&t.nodeType&&e&&e.nodeType))return document.documentElement;var n=t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING,i=n?t:e,o=n?e:t,r=document.createRange();r.setStart(i,0),r.setEnd(o,0);var s=r.commonAncestorContainer;if(t!==s&&e!==s||i.contains(o))return function(t){var e=t.nodeName;return "BODY"!==e&&("HTML"===e||kt(t.firstElementChild)===t)}(s)?s:kt(s);var a=Ct(t);return a.host?At(a.host,e):At(t,Ct(e).host)}function Ot(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"top",n="top"===e?"scrollTop":"scrollLeft",i=t.nodeName;if("BODY"===i||"HTML"===i){var o=t.ownerDocument.documentElement,r=t.ownerDocument.scrollingElement||o;return r[n]}return t[n]}function St(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=Ot(e,"top"),o=Ot(e,"left"),r=n?-1:1;return t.top+=i*r,t.bottom+=i*r,t.left+=o*r,t.right+=o*r,t}function Dt(t,e){var n="x"===e?"Left":"Top",i="Left"===n?"Right":"Bottom";return parseFloat(t["border"+n+"Width"])+parseFloat(t["border"+i+"Width"])}function xt(t,e,n,i){return Math.max(e["offset"+t],e["scroll"+t],n["client"+t],n["offset"+t],n["scroll"+t],Lt(10)?parseInt(n["offset"+t])+parseInt(i["margin"+("Height"===t?"Top":"Left")])+parseInt(i["margin"+("Height"===t?"Bottom":"Right")]):0)}function Nt(t){var e=t.body,n=t.documentElement,i=Lt(10)&&getComputedStyle(n);return {height:xt("Height",e,n,i),width:xt("Width",e,n,i)}}var It=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},jt=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),Pt=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t},Mt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i]);}return t};function Ht(t){return Mt({},t,{right:t.left+t.width,bottom:t.top+t.height})}function Bt(t){var e={};try{if(Lt(10)){e=t.getBoundingClientRect();var n=Ot(t,"top"),i=Ot(t,"left");e.top+=n,e.left+=i,e.bottom+=n,e.right+=i;}else e=t.getBoundingClientRect();}catch(t){}var o={left:e.left,top:e.top,width:e.right-e.left,height:e.bottom-e.top},r="HTML"===t.nodeName?Nt(t.ownerDocument):{},s=r.width||t.clientWidth||o.width,a=r.height||t.clientHeight||o.height,l=t.offsetWidth-s,c=t.offsetHeight-a;if(l||c){var u=_t(t);l-=Dt(u,"x"),c-=Dt(u,"y"),o.width-=l,o.height-=c;}return Ht(o)}function Rt(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=Lt(10),o="HTML"===e.nodeName,r=Bt(t),s=Bt(e),a=yt(t),l=_t(e),c=parseFloat(l.borderTopWidth),u=parseFloat(l.borderLeftWidth);n&&o&&(s.top=Math.max(s.top,0),s.left=Math.max(s.left,0));var f=Ht({top:r.top-s.top-c,left:r.left-s.left-u,width:r.width,height:r.height});if(f.marginTop=0,f.marginLeft=0,!i&&o){var h=parseFloat(l.marginTop),d=parseFloat(l.marginLeft);f.top-=c-h,f.bottom-=c-h,f.left-=u-d,f.right-=u-d,f.marginTop=h,f.marginLeft=d;}return (i&&!n?e.contains(a):e===a&&"BODY"!==a.nodeName)&&(f=St(f,e)),f}function Ft(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=t.ownerDocument.documentElement,i=Rt(t,n),o=Math.max(n.clientWidth,window.innerWidth||0),r=Math.max(n.clientHeight,window.innerHeight||0),s=e?0:Ot(n),a=e?0:Ot(n,"left"),l={top:s-i.top+i.marginTop,left:a-i.left+i.marginLeft,width:o,height:r};return Ht(l)}function Wt(t){var e=t.nodeName;if("BODY"===e||"HTML"===e)return !1;if("fixed"===_t(t,"position"))return !0;var n=bt(t);return !!n&&Wt(n)}function Ut(t){if(!t||!t.parentElement||Lt())return document.documentElement;for(var e=t.parentElement;e&&"none"===_t(e,"transform");)e=e.parentElement;return e||document.documentElement}function Qt(t,e,n,i){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],r={top:0,left:0},s=o?Ut(t):At(t,wt(e));if("viewport"===i)r=Ft(s,o);else {var a=void 0;"scrollParent"===i?"BODY"===(a=yt(bt(e))).nodeName&&(a=t.ownerDocument.documentElement):a="window"===i?t.ownerDocument.documentElement:i;var l=Rt(a,s,o);if("HTML"!==a.nodeName||Wt(s))r=l;else {var c=Nt(t.ownerDocument),u=c.height,f=c.width;r.top+=l.top-l.marginTop,r.bottom=u+l.top,r.left+=l.left-l.marginLeft,r.right=f+l.left;}}var h="number"==typeof(n=n||0);return r.left+=h?n:n.left||0,r.top+=h?n:n.top||0,r.right-=h?n:n.right||0,r.bottom-=h?n:n.bottom||0,r}function Vt(t){return t.width*t.height}function Kt(t,e,n,i,o){var r=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0;if(-1===t.indexOf("auto"))return t;var s=Qt(n,i,r,o),a={top:{width:s.width,height:e.top-s.top},right:{width:s.right-e.right,height:s.height},bottom:{width:s.width,height:s.bottom-e.bottom},left:{width:e.left-s.left,height:s.height}},l=Object.keys(a).map((function(t){return Mt({key:t},a[t],{area:Vt(a[t])})})).sort((function(t,e){return e.area-t.area})),c=l.filter((function(t){var e=t.width,i=t.height;return e>=n.clientWidth&&i>=n.clientHeight})),u=c.length>0?c[0].key:l[0].key,f=t.split("-")[1];return u+(f?"-"+f:"")}function Yt(t,e,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,o=i?Ut(e):At(e,wt(n));return Rt(n,o,i)}function qt(t){var e=t.ownerDocument.defaultView.getComputedStyle(t),n=parseFloat(e.marginTop||0)+parseFloat(e.marginBottom||0),i=parseFloat(e.marginLeft||0)+parseFloat(e.marginRight||0);return {width:t.offsetWidth+i,height:t.offsetHeight+n}}function zt(t){var e={left:"right",right:"left",bottom:"top",top:"bottom"};return t.replace(/left|right|bottom|top/g,(function(t){return e[t]}))}function Xt(t,e,n){n=n.split("-")[0];var i=qt(t),o={width:i.width,height:i.height},r=-1!==["right","left"].indexOf(n),s=r?"top":"left",a=r?"left":"top",l=r?"height":"width",c=r?"width":"height";return o[s]=e[s]+e[l]/2-i[l]/2,o[a]=n===a?e[a]-i[c]:e[zt(a)],o}function Gt(t,e){return Array.prototype.find?t.find(e):t.filter(e)[0]}function $t(t,e,n){return (void 0===n?t:t.slice(0,function(t,e,n){if(Array.prototype.findIndex)return t.findIndex((function(t){return t[e]===n}));var i=Gt(t,(function(t){return t[e]===n}));return t.indexOf(i)}(t,"name",n))).forEach((function(t){t.function&&console.warn("`modifier.function` is deprecated, use `modifier.fn`!");var n=t.function||t.fn;t.enabled&&vt(n)&&(e.offsets.popper=Ht(e.offsets.popper),e.offsets.reference=Ht(e.offsets.reference),e=n(e,t));})),e}function Zt(){if(!this.state.isDestroyed){var t={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};t.offsets.reference=Yt(this.state,this.popper,this.reference,this.options.positionFixed),t.placement=Kt(this.options.placement,t.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),t.originalPlacement=t.placement,t.positionFixed=this.options.positionFixed,t.offsets.popper=Xt(this.popper,t.offsets.reference,t.placement),t.offsets.popper.position=this.options.positionFixed?"fixed":"absolute",t=$t(this.modifiers,t),this.state.isCreated?this.options.onUpdate(t):(this.state.isCreated=!0,this.options.onCreate(t));}}function Jt(t,e){return t.some((function(t){var n=t.name;return t.enabled&&n===e}))}function te(t){for(var e=[!1,"ms","Webkit","Moz","O"],n=t.charAt(0).toUpperCase()+t.slice(1),i=0;i<e.length;i++){var o=e[i],r=o?""+o+n:t;if(void 0!==document.body.style[r])return r}return null}function ee(){return this.state.isDestroyed=!0,Jt(this.modifiers,"applyStyle")&&(this.popper.removeAttribute("x-placement"),this.popper.style.position="",this.popper.style.top="",this.popper.style.left="",this.popper.style.right="",this.popper.style.bottom="",this.popper.style.willChange="",this.popper.style[te("transform")]=""),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function ne(t){var e=t.ownerDocument;return e?e.defaultView:window}function ie(t,e,n,i){n.updateBound=i,ne(t).addEventListener("resize",n.updateBound,{passive:!0});var o=yt(t);return function t(e,n,i,o){var r="BODY"===e.nodeName,s=r?e.ownerDocument.defaultView:e;s.addEventListener(n,i,{passive:!0}),r||t(yt(s.parentNode),n,i,o),o.push(s);}(o,"scroll",n.updateBound,n.scrollParents),n.scrollElement=o,n.eventsEnabled=!0,n}function oe(){this.state.eventsEnabled||(this.state=ie(this.reference,this.options,this.state,this.scheduleUpdate));}function re(){var t,e;this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=(t=this.reference,e=this.state,ne(t).removeEventListener("resize",e.updateBound),e.scrollParents.forEach((function(t){t.removeEventListener("scroll",e.updateBound);})),e.updateBound=null,e.scrollParents=[],e.scrollElement=null,e.eventsEnabled=!1,e));}function se(t){return ""!==t&&!isNaN(parseFloat(t))&&isFinite(t)}function ae(t,e){Object.keys(e).forEach((function(n){var i="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&se(e[n])&&(i="px"),t.style[n]=e[n]+i;}));}var le=pt&&/Firefox/i.test(navigator.userAgent);function ce(t,e,n){var i=Gt(t,(function(t){return t.name===e})),o=!!i&&t.some((function(t){return t.name===n&&t.enabled&&t.order<i.order}));if(!o){var r="`"+e+"`",s="`"+n+"`";console.warn(s+" modifier is required by "+r+" modifier in order to work, be sure to include it before "+r+"!");}return o}var ue=["auto-start","auto","auto-end","top-start","top","top-end","right-start","right","right-end","bottom-end","bottom","bottom-start","left-end","left","left-start"],fe=ue.slice(3);function he(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=fe.indexOf(t),i=fe.slice(n+1).concat(fe.slice(0,n));return e?i.reverse():i}var de="flip",pe="clockwise",ge="counterclockwise";function me(t,e,n,i){var o=[0,0],r=-1!==["right","left"].indexOf(i),s=t.split(/(\+|\-)/).map((function(t){return t.trim()})),a=s.indexOf(Gt(s,(function(t){return -1!==t.search(/,|\s/)})));s[a]&&-1===s[a].indexOf(",")&&console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");var l=/\s*,\s*|\s+/,c=-1!==a?[s.slice(0,a).concat([s[a].split(l)[0]]),[s[a].split(l)[1]].concat(s.slice(a+1))]:[s];return (c=c.map((function(t,i){var o=(1===i?!r:r)?"height":"width",s=!1;return t.reduce((function(t,e){return ""===t[t.length-1]&&-1!==["+","-"].indexOf(e)?(t[t.length-1]=e,s=!0,t):s?(t[t.length-1]+=e,s=!1,t):t.concat(e)}),[]).map((function(t){return function(t,e,n,i){var o=t.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+o[1],s=o[2];if(!r)return t;if(0===s.indexOf("%")){var a=void 0;switch(s){case"%p":a=n;break;case"%":case"%r":default:a=i;}return Ht(a)[e]/100*r}if("vh"===s||"vw"===s)return ("vh"===s?Math.max(document.documentElement.clientHeight,window.innerHeight||0):Math.max(document.documentElement.clientWidth,window.innerWidth||0))/100*r;return r}(t,o,e,n)}))}))).forEach((function(t,e){t.forEach((function(n,i){se(n)&&(o[e]+=n*("-"===t[i-1]?-1:1));}));})),o}var ve={placement:"bottom",positionFixed:!1,eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:function(t){var e=t.placement,n=e.split("-")[0],i=e.split("-")[1];if(i){var o=t.offsets,r=o.reference,s=o.popper,a=-1!==["bottom","top"].indexOf(n),l=a?"left":"top",c=a?"width":"height",u={start:Pt({},l,r[l]),end:Pt({},l,r[l]+r[c]-s[c])};t.offsets.popper=Mt({},s,u[i]);}return t}},offset:{order:200,enabled:!0,fn:function(t,e){var n=e.offset,i=t.placement,o=t.offsets,r=o.popper,s=o.reference,a=i.split("-")[0],l=void 0;return l=se(+n)?[+n,0]:me(n,r,s,a),"left"===a?(r.top+=l[0],r.left-=l[1]):"right"===a?(r.top+=l[0],r.left+=l[1]):"top"===a?(r.left+=l[0],r.top-=l[1]):"bottom"===a&&(r.left+=l[0],r.top+=l[1]),t.popper=r,t},offset:0},preventOverflow:{order:300,enabled:!0,fn:function(t,e){var n=e.boundariesElement||kt(t.instance.popper);t.instance.reference===n&&(n=kt(n));var i=te("transform"),o=t.instance.popper.style,r=o.top,s=o.left,a=o[i];o.top="",o.left="",o[i]="";var l=Qt(t.instance.popper,t.instance.reference,e.padding,n,t.positionFixed);o.top=r,o.left=s,o[i]=a,e.boundaries=l;var c=e.priority,u=t.offsets.popper,f={primary:function(t){var n=u[t];return u[t]<l[t]&&!e.escapeWithReference&&(n=Math.max(u[t],l[t])),Pt({},t,n)},secondary:function(t){var n="right"===t?"left":"top",i=u[n];return u[t]>l[t]&&!e.escapeWithReference&&(i=Math.min(u[n],l[t]-("right"===t?u.width:u.height))),Pt({},n,i)}};return c.forEach((function(t){var e=-1!==["left","top"].indexOf(t)?"primary":"secondary";u=Mt({},u,f[e](t));})),t.offsets.popper=u,t},priority:["left","right","top","bottom"],padding:5,boundariesElement:"scrollParent"},keepTogether:{order:400,enabled:!0,fn:function(t){var e=t.offsets,n=e.popper,i=e.reference,o=t.placement.split("-")[0],r=Math.floor,s=-1!==["top","bottom"].indexOf(o),a=s?"right":"bottom",l=s?"left":"top",c=s?"width":"height";return n[a]<r(i[l])&&(t.offsets.popper[l]=r(i[l])-n[c]),n[l]>r(i[a])&&(t.offsets.popper[l]=r(i[a])),t}},arrow:{order:500,enabled:!0,fn:function(t,e){var n;if(!ce(t.instance.modifiers,"arrow","keepTogether"))return t;var i=e.element;if("string"==typeof i){if(!(i=t.instance.popper.querySelector(i)))return t}else if(!t.instance.popper.contains(i))return console.warn("WARNING: `arrow.element` must be child of its popper element!"),t;var o=t.placement.split("-")[0],r=t.offsets,s=r.popper,a=r.reference,l=-1!==["left","right"].indexOf(o),c=l?"height":"width",u=l?"Top":"Left",f=u.toLowerCase(),h=l?"left":"top",d=l?"bottom":"right",p=qt(i)[c];a[d]-p<s[f]&&(t.offsets.popper[f]-=s[f]-(a[d]-p)),a[f]+p>s[d]&&(t.offsets.popper[f]+=a[f]+p-s[d]),t.offsets.popper=Ht(t.offsets.popper);var g=a[f]+a[c]/2-p/2,m=_t(t.instance.popper),v=parseFloat(m["margin"+u]),_=parseFloat(m["border"+u+"Width"]),b=g-t.offsets.popper[f]-v-_;return b=Math.max(Math.min(s[c]-p,b),0),t.arrowElement=i,t.offsets.arrow=(Pt(n={},f,Math.round(b)),Pt(n,h,""),n),t},element:"[x-arrow]"},flip:{order:600,enabled:!0,fn:function(t,e){if(Jt(t.instance.modifiers,"inner"))return t;if(t.flipped&&t.placement===t.originalPlacement)return t;var n=Qt(t.instance.popper,t.instance.reference,e.padding,e.boundariesElement,t.positionFixed),i=t.placement.split("-")[0],o=zt(i),r=t.placement.split("-")[1]||"",s=[];switch(e.behavior){case de:s=[i,o];break;case pe:s=he(i);break;case ge:s=he(i,!0);break;default:s=e.behavior;}return s.forEach((function(a,l){if(i!==a||s.length===l+1)return t;i=t.placement.split("-")[0],o=zt(i);var c=t.offsets.popper,u=t.offsets.reference,f=Math.floor,h="left"===i&&f(c.right)>f(u.left)||"right"===i&&f(c.left)<f(u.right)||"top"===i&&f(c.bottom)>f(u.top)||"bottom"===i&&f(c.top)<f(u.bottom),d=f(c.left)<f(n.left),p=f(c.right)>f(n.right),g=f(c.top)<f(n.top),m=f(c.bottom)>f(n.bottom),v="left"===i&&d||"right"===i&&p||"top"===i&&g||"bottom"===i&&m,_=-1!==["top","bottom"].indexOf(i),b=!!e.flipVariations&&(_&&"start"===r&&d||_&&"end"===r&&p||!_&&"start"===r&&g||!_&&"end"===r&&m),y=!!e.flipVariationsByContent&&(_&&"start"===r&&p||_&&"end"===r&&d||!_&&"start"===r&&m||!_&&"end"===r&&g),w=b||y;(h||v||w)&&(t.flipped=!0,(h||v)&&(i=s[l+1]),w&&(r=function(t){return "end"===t?"start":"start"===t?"end":t}(r)),t.placement=i+(r?"-"+r:""),t.offsets.popper=Mt({},t.offsets.popper,Xt(t.instance.popper,t.offsets.reference,t.placement)),t=$t(t.instance.modifiers,t,"flip"));})),t},behavior:"flip",padding:5,boundariesElement:"viewport",flipVariations:!1,flipVariationsByContent:!1},inner:{order:700,enabled:!1,fn:function(t){var e=t.placement,n=e.split("-")[0],i=t.offsets,o=i.popper,r=i.reference,s=-1!==["left","right"].indexOf(n),a=-1===["top","left"].indexOf(n);return o[s?"left":"top"]=r[n]-(a?o[s?"width":"height"]:0),t.placement=zt(e),t.offsets.popper=Ht(o),t}},hide:{order:800,enabled:!0,fn:function(t){if(!ce(t.instance.modifiers,"hide","preventOverflow"))return t;var e=t.offsets.reference,n=Gt(t.instance.modifiers,(function(t){return "preventOverflow"===t.name})).boundaries;if(e.bottom<n.top||e.left>n.right||e.top>n.bottom||e.right<n.left){if(!0===t.hide)return t;t.hide=!0,t.attributes["x-out-of-boundaries"]="";}else {if(!1===t.hide)return t;t.hide=!1,t.attributes["x-out-of-boundaries"]=!1;}return t}},computeStyle:{order:850,enabled:!0,fn:function(t,e){var n=e.x,i=e.y,o=t.offsets.popper,r=Gt(t.instance.modifiers,(function(t){return "applyStyle"===t.name})).gpuAcceleration;void 0!==r&&console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");var s=void 0!==r?r:e.gpuAcceleration,a=kt(t.instance.popper),l=Bt(a),c={position:o.position},u=function(t,e){var n=t.offsets,i=n.popper,o=n.reference,r=Math.round,s=Math.floor,a=function(t){return t},l=r(o.width),c=r(i.width),u=-1!==["left","right"].indexOf(t.placement),f=-1!==t.placement.indexOf("-"),h=e?u||f||l%2==c%2?r:s:a,d=e?r:a;return {left:h(l%2==1&&c%2==1&&!f&&e?i.left-1:i.left),top:d(i.top),bottom:d(i.bottom),right:h(i.right)}}(t,window.devicePixelRatio<2||!le),f="bottom"===n?"top":"bottom",h="right"===i?"left":"right",d=te("transform"),p=void 0,g=void 0;if(g="bottom"===f?"HTML"===a.nodeName?-a.clientHeight+u.bottom:-l.height+u.bottom:u.top,p="right"===h?"HTML"===a.nodeName?-a.clientWidth+u.right:-l.width+u.right:u.left,s&&d)c[d]="translate3d("+p+"px, "+g+"px, 0)",c[f]=0,c[h]=0,c.willChange="transform";else {var m="bottom"===f?-1:1,v="right"===h?-1:1;c[f]=g*m,c[h]=p*v,c.willChange=f+", "+h;}var _={"x-placement":t.placement};return t.attributes=Mt({},_,t.attributes),t.styles=Mt({},c,t.styles),t.arrowStyles=Mt({},t.offsets.arrow,t.arrowStyles),t},gpuAcceleration:!0,x:"bottom",y:"right"},applyStyle:{order:900,enabled:!0,fn:function(t){return ae(t.instance.popper,t.styles),function(t,e){Object.keys(e).forEach((function(n){!1!==e[n]?t.setAttribute(n,e[n]):t.removeAttribute(n);}));}(t.instance.popper,t.attributes),t.arrowElement&&Object.keys(t.arrowStyles).length&&ae(t.arrowElement,t.arrowStyles),t},onLoad:function(t,e,n,i,o){var r=Yt(o,e,t,n.positionFixed),s=Kt(n.placement,r,e,t,n.modifiers.flip.boundariesElement,n.modifiers.flip.padding);return e.setAttribute("x-placement",s),ae(e,{position:n.positionFixed?"fixed":"absolute"}),n},gpuAcceleration:void 0}}},_e=function(){function t(e,n){var i=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};It(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(i.update)},this.update=mt(this.update.bind(this)),this.options=Mt({},t.Defaults,o),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=e&&e.jquery?e[0]:e,this.popper=n&&n.jquery?n[0]:n,this.options.modifiers={},Object.keys(Mt({},t.Defaults.modifiers,o.modifiers)).forEach((function(e){i.options.modifiers[e]=Mt({},t.Defaults.modifiers[e]||{},o.modifiers?o.modifiers[e]:{});})),this.modifiers=Object.keys(this.options.modifiers).map((function(t){return Mt({name:t},i.options.modifiers[t])})).sort((function(t,e){return t.order-e.order})),this.modifiers.forEach((function(t){t.enabled&&vt(t.onLoad)&&t.onLoad(i.reference,i.popper,i.options,t,i.state);})),this.update();var r=this.options.eventsEnabled;r&&this.enableEventListeners(),this.state.eventsEnabled=r;}return jt(t,[{key:"update",value:function(){return Zt.call(this)}},{key:"destroy",value:function(){return ee.call(this)}},{key:"enableEventListeners",value:function(){return oe.call(this)}},{key:"disableEventListeners",value:function(){return re.call(this)}}]),t}();_e.Utils=("undefined"!=typeof window?window:commonjsGlobal).PopperUtils,_e.placements=ue,_e.Defaults=ve;var be="dropdown",ye=new RegExp("ArrowUp|ArrowDown|Escape"),we={offset:0,flip:!0,boundary:"scrollParent",reference:"toggle",display:"dynamic",popperConfig:null},Ee={offset:"(number|string|function)",flip:"boolean",boundary:"(string|element)",reference:"(string|element)",display:"string",popperConfig:"(null|object)"},Te=function(){function t(t,e){this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners(),w(t,"bs.dropdown",this);}var i=t.prototype;return i.toggle=function(){if(!this._element.disabled&&!this._element.classList.contains("disabled")){var e=this._element.classList.contains("show");t.clearMenus(),e||this.show();}},i.show=function(){if(!(this._element.disabled||this._element.classList.contains("disabled")||this._menu.classList.contains("show"))){var e=t.getParentFromElement(this._element),n={relatedTarget:this._element};if(!U.trigger(this._element,"show.bs.dropdown",n).defaultPrevented){if(!this._inNavbar){if(void 0===_e)throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org)");var i=this._element;"parent"===this._config.reference?i=e:d(this._config.reference)&&(i=this._config.reference,void 0!==this._config.reference.jquery&&(i=this._config.reference[0])),"scrollParent"!==this._config.boundary&&e.classList.add("position-static"),this._popper=new _e(i,this._menu,this._getPopperConfig());}var o;if("ontouchstart"in document.documentElement&&!e.closest(".navbar-nav"))(o=[]).concat.apply(o,document.body.children).forEach((function(t){return U.on(t,"mouseover",null,(function(){}))}));this._element.focus(),this._element.setAttribute("aria-expanded",!0),Z.toggleClass(this._menu,"show"),Z.toggleClass(this._element,"show"),U.trigger(e,"shown.bs.dropdown",n);}}},i.hide=function(){if(!this._element.disabled&&!this._element.classList.contains("disabled")&&this._menu.classList.contains("show")){var e=t.getParentFromElement(this._element),n={relatedTarget:this._element};U.trigger(e,"hide.bs.dropdown",n).defaultPrevented||(this._popper&&this._popper.destroy(),Z.toggleClass(this._menu,"show"),Z.toggleClass(this._element,"show"),U.trigger(e,"hidden.bs.dropdown",n));}},i.dispose=function(){T(this._element,"bs.dropdown"),U.off(this._element,".bs.dropdown"),this._element=null,this._menu=null,this._popper&&(this._popper.destroy(),this._popper=null);},i.update=function(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.scheduleUpdate();},i._addEventListeners=function(){var t=this;U.on(this._element,"click.bs.dropdown",(function(e){e.preventDefault(),e.stopPropagation(),t.toggle();}));},i._getConfig=function(t){return t=n({},this.constructor.Default,Z.getDataAttributes(this._element),t),g(be,t,this.constructor.DefaultType),t},i._getMenuElement=function(){return J.next(this._element,".dropdown-menu")[0]},i._getPlacement=function(){var t=this._element.parentNode,e="bottom-start";return t.classList.contains("dropup")?(e="top-start",this._menu.classList.contains("dropdown-menu-right")&&(e="top-end")):t.classList.contains("dropright")?e="right-start":t.classList.contains("dropleft")?e="left-start":this._menu.classList.contains("dropdown-menu-right")&&(e="bottom-end"),e},i._detectNavbar=function(){return Boolean(this._element.closest(".navbar"))},i._getOffset=function(){var t=this,e={};return "function"==typeof this._config.offset?e.fn=function(e){return e.offsets=n({},e.offsets,t._config.offset(e.offsets,t._element)||{}),e}:e.offset=this._config.offset,e},i._getPopperConfig=function(){var t={placement:this._getPlacement(),modifiers:{offset:this._getOffset(),flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return "static"===this._config.display&&(t.modifiers.applyStyle={enabled:!1}),n({},t,this._config.popperConfig)},t.dropdownInterface=function(e,n){var i=E(e,"bs.dropdown");if(i||(i=new t(e,"object"==typeof n?n:null)),"string"==typeof n){if(void 0===i[n])throw new TypeError('No method named "'+n+'"');i[n]();}},t.jQueryInterface=function(e){return this.each((function(){t.dropdownInterface(this,e);}))},t.clearMenus=function(e){if(!e||2!==e.button&&("keyup"!==e.type||"Tab"===e.key))for(var n=J.find('[data-toggle="dropdown"]'),i=0,o=n.length;i<o;i++){var r=t.getParentFromElement(n[i]),s=E(n[i],"bs.dropdown"),a={relatedTarget:n[i]};if(e&&"click"===e.type&&(a.clickEvent=e),s){var l=s._menu;if(n[i].classList.contains("show"))if(!(e&&("click"===e.type&&/input|textarea/i.test(e.target.tagName)||"keyup"===e.type&&"Tab"===e.key)&&l.contains(e.target)))if(!U.trigger(r,"hide.bs.dropdown",a).defaultPrevented){var c;if("ontouchstart"in document.documentElement)(c=[]).concat.apply(c,document.body.children).forEach((function(t){return U.off(t,"mouseover",null,(function(){}))}));n[i].setAttribute("aria-expanded","false"),s._popper&&s._popper.destroy(),l.classList.remove("show"),n[i].classList.remove("show"),U.trigger(r,"hidden.bs.dropdown",a);}}}},t.getParentFromElement=function(t){return u(t)||t.parentNode},t.dataApiKeydownHandler=function(e){if(!(/input|textarea/i.test(e.target.tagName)?"Space"===e.key||"Escape"!==e.key&&("ArrowDown"!==e.key&&"ArrowUp"!==e.key||e.target.closest(".dropdown-menu")):!ye.test(e.key))&&(e.preventDefault(),e.stopPropagation(),!this.disabled&&!this.classList.contains("disabled"))){var n=t.getParentFromElement(this),i=this.classList.contains("show");if("Escape"===e.key)return (this.matches('[data-toggle="dropdown"]')?this:J.prev(this,'[data-toggle="dropdown"]')[0]).focus(),void t.clearMenus();if(i&&"Space"!==e.key){var o=J.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",n).filter(m);if(o.length){var r=o.indexOf(e.target);"ArrowUp"===e.key&&r>0&&r--,"ArrowDown"===e.key&&r<o.length-1&&r++,o[r=-1===r?0:r].focus();}}else t.clearMenus();}},t.getInstance=function(t){return E(t,"bs.dropdown")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return we}},{key:"DefaultType",get:function(){return Ee}}]),t}();U.on(document,"keydown.bs.dropdown.data-api",'[data-toggle="dropdown"]',Te.dataApiKeydownHandler),U.on(document,"keydown.bs.dropdown.data-api",".dropdown-menu",Te.dataApiKeydownHandler),U.on(document,"click.bs.dropdown.data-api",Te.clearMenus),U.on(document,"keyup.bs.dropdown.data-api",Te.clearMenus),U.on(document,"click.bs.dropdown.data-api",'[data-toggle="dropdown"]',(function(t){t.preventDefault(),t.stopPropagation(),Te.dropdownInterface(this,"toggle");})),U.on(document,"click.bs.dropdown.data-api",".dropdown form",(function(t){return t.stopPropagation()}));var Le=b();if(Le){var ke=Le.fn[be];Le.fn[be]=Te.jQueryInterface,Le.fn[be].Constructor=Te,Le.fn[be].noConflict=function(){return Le.fn[be]=ke,Te.jQueryInterface};}var Ce={backdrop:!0,keyboard:!0,focus:!0,show:!0},Ae={backdrop:"(boolean|string)",keyboard:"boolean",focus:"boolean",show:"boolean"},Oe=function(){function t(t,e){this._config=this._getConfig(e),this._element=t,this._dialog=J.findOne(".modal-dialog",t),this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._isTransitioning=!1,this._scrollbarWidth=0,w(t,"bs.modal",this);}var i=t.prototype;return i.toggle=function(t){return this._isShown?this.hide():this.show(t)},i.show=function(t){var e=this;if(!this._isShown&&!this._isTransitioning){this._element.classList.contains("fade")&&(this._isTransitioning=!0);var n=U.trigger(this._element,"show.bs.modal",{relatedTarget:t});this._isShown||n.defaultPrevented||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),this._setEscapeEvent(),this._setResizeEvent(),U.on(this._element,"click.dismiss.bs.modal",'[data-dismiss="modal"]',(function(t){return e.hide(t)})),U.on(this._dialog,"mousedown.dismiss.bs.modal",(function(){U.one(e._element,"mouseup.dismiss.bs.modal",(function(t){t.target===e._element&&(e._ignoreBackdropClick=!0);}));})),this._showBackdrop((function(){return e._showElement(t)})));}},i.hide=function(t){var e=this;if((t&&t.preventDefault(),this._isShown&&!this._isTransitioning)&&!U.trigger(this._element,"hide.bs.modal").defaultPrevented){this._isShown=!1;var n=this._element.classList.contains("fade");if(n&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),U.off(document,"focusin.bs.modal"),this._element.classList.remove("show"),U.off(this._element,"click.dismiss.bs.modal"),U.off(this._dialog,"mousedown.dismiss.bs.modal"),n){var i=f(this._element);U.one(this._element,"transitionend",(function(t){return e._hideModal(t)})),p(this._element,i);}else this._hideModal();}},i.dispose=function(){[window,this._element,this._dialog].forEach((function(t){return U.off(t,".bs.modal")})),U.off(document,"focusin.bs.modal"),T(this._element,"bs.modal"),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._isTransitioning=null,this._scrollbarWidth=null;},i.handleUpdate=function(){this._adjustDialog();},i._getConfig=function(t){return t=n({},Ce,t),g("modal",t,Ae),t},i._showElement=function(t){var e=this,n=this._element.classList.contains("fade"),i=J.findOne(".modal-body",this._dialog);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0,i&&(i.scrollTop=0),n&&_(this._element),this._element.classList.add("show"),this._config.focus&&this._enforceFocus();var o=function(){e._config.focus&&e._element.focus(),e._isTransitioning=!1,U.trigger(e._element,"shown.bs.modal",{relatedTarget:t});};if(n){var r=f(this._dialog);U.one(this._dialog,"transitionend",o),p(this._dialog,r);}else o();},i._enforceFocus=function(){var t=this;U.off(document,"focusin.bs.modal"),U.on(document,"focusin.bs.modal",(function(e){document===e.target||t._element===e.target||t._element.contains(e.target)||t._element.focus();}));},i._setEscapeEvent=function(){var t=this;this._isShown?U.on(this._element,"keydown.dismiss.bs.modal",(function(e){t._config.keyboard&&"Escape"===e.key?(e.preventDefault(),t.hide()):t._config.keyboard||"Escape"!==e.key||t._triggerBackdropTransition();})):U.off(this._element,"keydown.dismiss.bs.modal");},i._setResizeEvent=function(){var t=this;this._isShown?U.on(window,"resize.bs.modal",(function(){return t._adjustDialog()})):U.off(window,"resize.bs.modal");},i._hideModal=function(){var t=this;this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._showBackdrop((function(){document.body.classList.remove("modal-open"),t._resetAdjustments(),t._resetScrollbar(),U.trigger(t._element,"hidden.bs.modal");}));},i._removeBackdrop=function(){this._backdrop.parentNode.removeChild(this._backdrop),this._backdrop=null;},i._showBackdrop=function(t){var e=this,n=this._element.classList.contains("fade")?"fade":"";if(this._isShown&&this._config.backdrop){if(this._backdrop=document.createElement("div"),this._backdrop.className="modal-backdrop",n&&this._backdrop.classList.add(n),document.body.appendChild(this._backdrop),U.on(this._element,"click.dismiss.bs.modal",(function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&e._triggerBackdropTransition();})),n&&_(this._backdrop),this._backdrop.classList.add("show"),!n)return void t();var i=f(this._backdrop);U.one(this._backdrop,"transitionend",t),p(this._backdrop,i);}else if(!this._isShown&&this._backdrop){this._backdrop.classList.remove("show");var o=function(){e._removeBackdrop(),t();};if(this._element.classList.contains("fade")){var r=f(this._backdrop);U.one(this._backdrop,"transitionend",o),p(this._backdrop,r);}else o();}else t();},i._triggerBackdropTransition=function(){var t=this;if("static"===this._config.backdrop){if(U.trigger(this._element,"hidePrevented.bs.modal").defaultPrevented)return;var e=this._element.scrollHeight>document.documentElement.clientHeight;e||(this._element.style.overflowY="hidden"),this._element.classList.add("modal-static");var n=f(this._dialog);U.off(this._element,"transitionend"),U.one(this._element,"transitionend",(function(){t._element.classList.remove("modal-static"),e||(U.one(t._element,"transitionend",(function(){t._element.style.overflowY="";})),p(t._element,n));})),p(this._element,n),this._element.focus();}else this.hide();},i._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+"px"),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+"px");},i._resetAdjustments=function(){this._element.style.paddingLeft="",this._element.style.paddingRight="";},i._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=Math.round(t.left+t.right)<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth();},i._setScrollbar=function(){var t=this;if(this._isBodyOverflowing){J.find(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top").forEach((function(e){var n=e.style.paddingRight,i=window.getComputedStyle(e)["padding-right"];Z.setDataAttribute(e,"padding-right",n),e.style.paddingRight=parseFloat(i)+t._scrollbarWidth+"px";})),J.find(".sticky-top").forEach((function(e){var n=e.style.marginRight,i=window.getComputedStyle(e)["margin-right"];Z.setDataAttribute(e,"margin-right",n),e.style.marginRight=parseFloat(i)-t._scrollbarWidth+"px";}));var e=document.body.style.paddingRight,n=window.getComputedStyle(document.body)["padding-right"];Z.setDataAttribute(document.body,"padding-right",e),document.body.style.paddingRight=parseFloat(n)+this._scrollbarWidth+"px";}document.body.classList.add("modal-open");},i._resetScrollbar=function(){J.find(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top").forEach((function(t){var e=Z.getDataAttribute(t,"padding-right");void 0!==e&&(Z.removeDataAttribute(t,"padding-right"),t.style.paddingRight=e);})),J.find(".sticky-top").forEach((function(t){var e=Z.getDataAttribute(t,"margin-right");void 0!==e&&(Z.removeDataAttribute(t,"margin-right"),t.style.marginRight=e);}));var t=Z.getDataAttribute(document.body,"padding-right");void 0===t?document.body.style.paddingRight="":(Z.removeDataAttribute(document.body,"padding-right"),document.body.style.paddingRight=t);},i._getScrollbarWidth=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},t.jQueryInterface=function(e,i){return this.each((function(){var o=E(this,"bs.modal"),r=n({},Ce,Z.getDataAttributes(this),"object"==typeof e&&e?e:{});if(o||(o=new t(this,r)),"string"==typeof e){if(void 0===o[e])throw new TypeError('No method named "'+e+'"');o[e](i);}else r.show&&o.show(i);}))},t.getInstance=function(t){return E(t,"bs.modal")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return Ce}}]),t}();U.on(document,"click.bs.modal.data-api",'[data-toggle="modal"]',(function(t){var e=this,i=u(this);"A"!==this.tagName&&"AREA"!==this.tagName||t.preventDefault(),U.one(i,"show.bs.modal",(function(t){t.defaultPrevented||U.one(i,"hidden.bs.modal",(function(){m(e)&&e.focus();}));}));var o=E(i,"bs.modal");if(!o){var r=n({},Z.getDataAttributes(i),Z.getDataAttributes(this));o=new Oe(i,r);}o.show(this);}));var Se=b();if(Se){var De=Se.fn.modal;Se.fn.modal=Oe.jQueryInterface,Se.fn.modal.Constructor=Oe,Se.fn.modal.noConflict=function(){return Se.fn.modal=De,Oe.jQueryInterface};}var xe=["background","cite","href","itemtype","longdesc","poster","src","xlink:href"],Ne=/^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi,Ie=/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,je={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],div:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]};function Pe(t,e,n){var i;if(!t.length)return t;if(n&&"function"==typeof n)return n(t);for(var o=(new window.DOMParser).parseFromString(t,"text/html"),r=Object.keys(e),s=(i=[]).concat.apply(i,o.body.querySelectorAll("*")),a=function(t,n){var i,o=s[t],a=o.nodeName.toLowerCase();if(-1===r.indexOf(a))return o.parentNode.removeChild(o),"continue";var l=(i=[]).concat.apply(i,o.attributes),c=[].concat(e["*"]||[],e[a]||[]);l.forEach((function(t){(function(t,e){var n=t.nodeName.toLowerCase();if(-1!==e.indexOf(n))return -1===xe.indexOf(n)||Boolean(t.nodeValue.match(Ne)||t.nodeValue.match(Ie));for(var i=e.filter((function(t){return t instanceof RegExp})),o=0,r=i.length;o<r;o++)if(n.match(i[o]))return !0;return !1})(t,c)||o.removeAttribute(t.nodeName);}));},l=0,c=s.length;l<c;l++)a(l);return o.body.innerHTML}var Me="tooltip",He=new RegExp("(^|\\s)bs-tooltip\\S+","g"),Be=["sanitize","allowList","sanitizeFn"],Re={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(number|string|function)",container:"(string|element|boolean)",fallbackPlacement:"(string|array)",boundary:"(string|element)",sanitize:"boolean",sanitizeFn:"(null|function)",allowList:"object",popperConfig:"(null|object)"},Fe={AUTO:"auto",TOP:"top",RIGHT:"right",BOTTOM:"bottom",LEFT:"left"},We={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:0,container:!1,fallbackPlacement:"flip",boundary:"scrollParent",sanitize:!0,sanitizeFn:null,allowList:je,popperConfig:null},Ue={HIDE:"hide.bs.tooltip",HIDDEN:"hidden.bs.tooltip",SHOW:"show.bs.tooltip",SHOWN:"shown.bs.tooltip",INSERTED:"inserted.bs.tooltip",CLICK:"click.bs.tooltip",FOCUSIN:"focusin.bs.tooltip",FOCUSOUT:"focusout.bs.tooltip",MOUSEENTER:"mouseenter.bs.tooltip",MOUSELEAVE:"mouseleave.bs.tooltip"},Qe=function(){function t(t,e){if(void 0===_e)throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org)");this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners(),w(t,this.constructor.DATA_KEY,this);}var i=t.prototype;return i.enable=function(){this._isEnabled=!0;},i.disable=function(){this._isEnabled=!1;},i.toggleEnabled=function(){this._isEnabled=!this._isEnabled;},i.toggle=function(t){if(this._isEnabled)if(t){var e=this.constructor.DATA_KEY,n=E(t.delegateTarget,e);n||(n=new this.constructor(t.delegateTarget,this._getDelegateConfig()),w(t.delegateTarget,e,n)),n._activeTrigger.click=!n._activeTrigger.click,n._isWithActiveTrigger()?n._enter(null,n):n._leave(null,n);}else {if(this.getTipElement().classList.contains("show"))return void this._leave(null,this);this._enter(null,this);}},i.dispose=function(){clearTimeout(this._timeout),T(this.element,this.constructor.DATA_KEY),U.off(this.element,this.constructor.EVENT_KEY),U.off(this.element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this.tip&&this.tip.parentNode.removeChild(this.tip),this._isEnabled=null,this._timeout=null,this._hoverState=null,this._activeTrigger=null,this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null;},i.show=function(){var t=this;if("none"===this.element.style.display)throw new Error("Please use show on visible elements");if(this.isWithContent()&&this._isEnabled){var e=U.trigger(this.element,this.constructor.Event.SHOW),n=function t(e){if(!document.documentElement.attachShadow)return null;if("function"==typeof e.getRootNode){var n=e.getRootNode();return n instanceof ShadowRoot?n:null}return e instanceof ShadowRoot?e:e.parentNode?t(e.parentNode):null}(this.element),i=null===n?this.element.ownerDocument.documentElement.contains(this.element):n.contains(this.element);if(e.defaultPrevented||!i)return;var o=this.getTipElement(),r=a(this.constructor.NAME);o.setAttribute("id",r),this.element.setAttribute("aria-describedby",r),this.setContent(),this.config.animation&&o.classList.add("fade");var s="function"==typeof this.config.placement?this.config.placement.call(this,o,this.element):this.config.placement,l=this._getAttachment(s);this._addAttachmentClass(l);var c,u=this._getContainer();if(w(o,this.constructor.DATA_KEY,this),this.element.ownerDocument.documentElement.contains(this.tip)||u.appendChild(o),U.trigger(this.element,this.constructor.Event.INSERTED),this._popper=new _e(this.element,o,this._getPopperConfig(l)),o.classList.add("show"),"ontouchstart"in document.documentElement)(c=[]).concat.apply(c,document.body.children).forEach((function(t){U.on(t,"mouseover",(function(){}));}));var h=function(){t.config.animation&&t._fixTransition();var e=t._hoverState;t._hoverState=null,U.trigger(t.element,t.constructor.Event.SHOWN),"out"===e&&t._leave(null,t);};if(this.tip.classList.contains("fade")){var d=f(this.tip);U.one(this.tip,"transitionend",h),p(this.tip,d);}else h();}},i.hide=function(){var t=this;if(this._popper){var e=this.getTipElement(),n=function(){"show"!==t._hoverState&&e.parentNode&&e.parentNode.removeChild(e),t._cleanTipClass(),t.element.removeAttribute("aria-describedby"),U.trigger(t.element,t.constructor.Event.HIDDEN),t._popper.destroy();};if(!U.trigger(this.element,this.constructor.Event.HIDE).defaultPrevented){var i;if(e.classList.remove("show"),"ontouchstart"in document.documentElement)(i=[]).concat.apply(i,document.body.children).forEach((function(t){return U.off(t,"mouseover",v)}));if(this._activeTrigger.click=!1,this._activeTrigger.focus=!1,this._activeTrigger.hover=!1,this.tip.classList.contains("fade")){var o=f(e);U.one(e,"transitionend",n),p(e,o);}else n();this._hoverState="";}}},i.update=function(){null!==this._popper&&this._popper.scheduleUpdate();},i.isWithContent=function(){return Boolean(this.getTitle())},i.getTipElement=function(){if(this.tip)return this.tip;var t=document.createElement("div");return t.innerHTML=this.config.template,this.tip=t.children[0],this.tip},i.setContent=function(){var t=this.getTipElement();this.setElementContent(J.findOne(".tooltip-inner",t),this.getTitle()),t.classList.remove("fade","show");},i.setElementContent=function(t,e){if(null!==t)return "object"==typeof e&&d(e)?(e.jquery&&(e=e[0]),void(this.config.html?e.parentNode!==t&&(t.innerHTML="",t.appendChild(e)):t.textContent=e.textContent)):void(this.config.html?(this.config.sanitize&&(e=Pe(e,this.config.allowList,this.config.sanitizeFn)),t.innerHTML=e):t.textContent=e)},i.getTitle=function(){var t=this.element.getAttribute("data-original-title");return t||(t="function"==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},i._getPopperConfig=function(t){var e=this;return n({},{placement:t,modifiers:{offset:this._getOffset(),flip:{behavior:this.config.fallbackPlacement},arrow:{element:"."+this.constructor.NAME+"-arrow"},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t);},onUpdate:function(t){return e._handlePopperPlacementChange(t)}},this.config.popperConfig)},i._addAttachmentClass=function(t){this.getTipElement().classList.add("bs-tooltip-"+t);},i._getOffset=function(){var t=this,e={};return "function"==typeof this.config.offset?e.fn=function(e){return e.offsets=n({},e.offsets,t.config.offset(e.offsets,t.element)||{}),e}:e.offset=this.config.offset,e},i._getContainer=function(){return !1===this.config.container?document.body:d(this.config.container)?this.config.container:J.findOne(this.config.container)},i._getAttachment=function(t){return Fe[t.toUpperCase()]},i._setListeners=function(){var t=this;this.config.trigger.split(" ").forEach((function(e){if("click"===e)U.on(t.element,t.constructor.Event.CLICK,t.config.selector,(function(e){return t.toggle(e)}));else if("manual"!==e){var n="hover"===e?t.constructor.Event.MOUSEENTER:t.constructor.Event.FOCUSIN,i="hover"===e?t.constructor.Event.MOUSELEAVE:t.constructor.Event.FOCUSOUT;U.on(t.element,n,t.config.selector,(function(e){return t._enter(e)})),U.on(t.element,i,t.config.selector,(function(e){return t._leave(e)}));}})),this._hideModalHandler=function(){t.element&&t.hide();},U.on(this.element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this.config.selector?this.config=n({},this.config,{trigger:"manual",selector:""}):this._fixTitle();},i._fixTitle=function(){var t=typeof this.element.getAttribute("data-original-title");(this.element.getAttribute("title")||"string"!==t)&&(this.element.setAttribute("data-original-title",this.element.getAttribute("title")||""),this.element.setAttribute("title",""));},i._enter=function(t,e){var n=this.constructor.DATA_KEY;(e=e||E(t.delegateTarget,n))||(e=new this.constructor(t.delegateTarget,this._getDelegateConfig()),w(t.delegateTarget,n,e)),t&&(e._activeTrigger["focusin"===t.type?"focus":"hover"]=!0),e.getTipElement().classList.contains("show")||"show"===e._hoverState?e._hoverState="show":(clearTimeout(e._timeout),e._hoverState="show",e.config.delay&&e.config.delay.show?e._timeout=setTimeout((function(){"show"===e._hoverState&&e.show();}),e.config.delay.show):e.show());},i._leave=function(t,e){var n=this.constructor.DATA_KEY;(e=e||E(t.delegateTarget,n))||(e=new this.constructor(t.delegateTarget,this._getDelegateConfig()),w(t.delegateTarget,n,e)),t&&(e._activeTrigger["focusout"===t.type?"focus":"hover"]=!1),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState="out",e.config.delay&&e.config.delay.hide?e._timeout=setTimeout((function(){"out"===e._hoverState&&e.hide();}),e.config.delay.hide):e.hide());},i._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return !0;return !1},i._getConfig=function(t){var e=Z.getDataAttributes(this.element);return Object.keys(e).forEach((function(t){-1!==Be.indexOf(t)&&delete e[t];})),t&&"object"==typeof t.container&&t.container.jquery&&(t.container=t.container[0]),"number"==typeof(t=n({},this.constructor.Default,e,"object"==typeof t&&t?t:{})).delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),g(Me,t,this.constructor.DefaultType),t.sanitize&&(t.template=Pe(t.template,t.allowList,t.sanitizeFn)),t},i._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},i._cleanTipClass=function(){var t=this.getTipElement(),e=t.getAttribute("class").match(He);null!==e&&e.length>0&&e.map((function(t){return t.trim()})).forEach((function(e){return t.classList.remove(e)}));},i._handlePopperPlacementChange=function(t){this.tip=t.instance.popper,this._cleanTipClass(),this._addAttachmentClass(this._getAttachment(t.placement));},i._fixTransition=function(){var t=this.getTipElement(),e=this.config.animation;null===t.getAttribute("x-placement")&&(t.classList.remove("fade"),this.config.animation=!1,this.hide(),this.show(),this.config.animation=e);},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.tooltip"),i="object"==typeof e&&e;if((n||!/dispose|hide/.test(e))&&(n||(n=new t(this,i)),"string"==typeof e)){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]();}}))},t.getInstance=function(t){return E(t,"bs.tooltip")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return We}},{key:"NAME",get:function(){return Me}},{key:"DATA_KEY",get:function(){return "bs.tooltip"}},{key:"Event",get:function(){return Ue}},{key:"EVENT_KEY",get:function(){return ".bs.tooltip"}},{key:"DefaultType",get:function(){return Re}}]),t}(),Ve=b();if(Ve){var Ke=Ve.fn[Me];Ve.fn[Me]=Qe.jQueryInterface,Ve.fn[Me].Constructor=Qe,Ve.fn[Me].noConflict=function(){return Ve.fn[Me]=Ke,Qe.jQueryInterface};}var Ye="popover",qe=new RegExp("(^|\\s)bs-popover\\S+","g"),ze=n({},Qe.Default,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),Xe=n({},Qe.DefaultType,{content:"(string|element|function)"}),Ge={HIDE:"hide.bs.popover",HIDDEN:"hidden.bs.popover",SHOW:"show.bs.popover",SHOWN:"shown.bs.popover",INSERTED:"inserted.bs.popover",CLICK:"click.bs.popover",FOCUSIN:"focusin.bs.popover",FOCUSOUT:"focusout.bs.popover",MOUSEENTER:"mouseenter.bs.popover",MOUSELEAVE:"mouseleave.bs.popover"},$e=function(t){var n,i;function o(){return t.apply(this,arguments)||this}i=t,(n=o).prototype=Object.create(i.prototype),n.prototype.constructor=n,n.__proto__=i;var r=o.prototype;return r.isWithContent=function(){return this.getTitle()||this._getContent()},r.setContent=function(){var t=this.getTipElement();this.setElementContent(J.findOne(".popover-header",t),this.getTitle());var e=this._getContent();"function"==typeof e&&(e=e.call(this.element)),this.setElementContent(J.findOne(".popover-body",t),e),t.classList.remove("fade","show");},r._addAttachmentClass=function(t){this.getTipElement().classList.add("bs-popover-"+t);},r._getContent=function(){return this.element.getAttribute("data-content")||this.config.content},r._cleanTipClass=function(){var t=this.getTipElement(),e=t.getAttribute("class").match(qe);null!==e&&e.length>0&&e.map((function(t){return t.trim()})).forEach((function(e){return t.classList.remove(e)}));},o.jQueryInterface=function(t){return this.each((function(){var e=E(this,"bs.popover"),n="object"==typeof t?t:null;if((e||!/dispose|hide/.test(t))&&(e||(e=new o(this,n),w(this,"bs.popover",e)),"string"==typeof t)){if(void 0===e[t])throw new TypeError('No method named "'+t+'"');e[t]();}}))},o.getInstance=function(t){return E(t,"bs.popover")},e(o,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return ze}},{key:"NAME",get:function(){return Ye}},{key:"DATA_KEY",get:function(){return "bs.popover"}},{key:"Event",get:function(){return Ge}},{key:"EVENT_KEY",get:function(){return ".bs.popover"}},{key:"DefaultType",get:function(){return Xe}}]),o}(Qe),Ze=b();if(Ze){var Je=Ze.fn[Ye];Ze.fn[Ye]=$e.jQueryInterface,Ze.fn[Ye].Constructor=$e,Ze.fn[Ye].noConflict=function(){return Ze.fn[Ye]=Je,$e.jQueryInterface};}var tn="scrollspy",en={offset:10,method:"auto",target:""},nn={offset:"number",method:"string",target:"(string|element)"},on=function(){function t(t,e){var n=this;this._element=t,this._scrollElement="BODY"===t.tagName?window:t,this._config=this._getConfig(e),this._selector=this._config.target+" .nav-link, "+this._config.target+" .list-group-item, "+this._config.target+" .dropdown-item",this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,U.on(this._scrollElement,"scroll.bs.scrollspy",(function(t){return n._process(t)})),this.refresh(),this._process(),w(t,"bs.scrollspy",this);}var i=t.prototype;return i.refresh=function(){var t=this,e=this._scrollElement===this._scrollElement.window?"offset":"position",n="auto"===this._config.method?e:this._config.method,i="position"===n?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),J.find(this._selector).map((function(t){var e=c(t),o=e?J.findOne(e):null;if(o){var r=o.getBoundingClientRect();if(r.width||r.height)return [Z[n](o).top+i,e]}return null})).filter((function(t){return t})).sort((function(t,e){return t[0]-e[0]})).forEach((function(e){t._offsets.push(e[0]),t._targets.push(e[1]);}));},i.dispose=function(){T(this._element,"bs.scrollspy"),U.off(this._scrollElement,".bs.scrollspy"),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null;},i._getConfig=function(t){if("string"!=typeof(t=n({},en,"object"==typeof t&&t?t:{})).target&&d(t.target)){var e=t.target.id;e||(e=a(tn),t.target.id=e),t.target="#"+e;}return g(tn,t,nn),t},i._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},i._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},i._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},i._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),t>=n){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i);}else {if(this._activeTarget&&t<this._offsets[0]&&this._offsets[0]>0)return this._activeTarget=null,void this._clear();for(var o=this._offsets.length;o--;){this._activeTarget!==this._targets[o]&&t>=this._offsets[o]&&(void 0===this._offsets[o+1]||t<this._offsets[o+1])&&this._activate(this._targets[o]);}}},i._activate=function(t){this._activeTarget=t,this._clear();var e=this._selector.split(",").map((function(e){return e+'[data-target="'+t+'"],'+e+'[href="'+t+'"]'})),n=J.findOne(e.join(","));n.classList.contains("dropdown-item")?(J.findOne(".dropdown-toggle",n.closest(".dropdown")).classList.add("active"),n.classList.add("active")):(n.classList.add("active"),J.parents(n,".nav, .list-group").forEach((function(t){J.prev(t,".nav-link, .list-group-item").forEach((function(t){return t.classList.add("active")})),J.prev(t,".nav-item").forEach((function(t){J.children(t,".nav-link").forEach((function(t){return t.classList.add("active")}));}));}))),U.trigger(this._scrollElement,"activate.bs.scrollspy",{relatedTarget:t});},i._clear=function(){J.find(this._selector).filter((function(t){return t.classList.contains("active")})).forEach((function(t){return t.classList.remove("active")}));},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.scrollspy");if(n||(n=new t(this,"object"==typeof e&&e)),"string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]();}}))},t.getInstance=function(t){return E(t,"bs.scrollspy")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"Default",get:function(){return en}}]),t}();U.on(window,"load.bs.scrollspy.data-api",(function(){J.find('[data-spy="scroll"]').forEach((function(t){return new on(t,Z.getDataAttributes(t))}));}));var rn=b();if(rn){var sn=rn.fn[tn];rn.fn[tn]=on.jQueryInterface,rn.fn[tn].Constructor=on,rn.fn[tn].noConflict=function(){return rn.fn[tn]=sn,on.jQueryInterface};}var an=function(){function t(t){this._element=t,w(this._element,"bs.tab",this);}var n=t.prototype;return n.show=function(){var t=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&this._element.classList.contains("active")||this._element.classList.contains("disabled"))){var e,n=u(this._element),i=this._element.closest(".nav, .list-group");if(i){var o="UL"===i.nodeName||"OL"===i.nodeName?":scope > li > .active":".active";e=(e=J.find(o,i))[e.length-1];}var r=null;if(e&&(r=U.trigger(e,"hide.bs.tab",{relatedTarget:this._element})),!(U.trigger(this._element,"show.bs.tab",{relatedTarget:e}).defaultPrevented||null!==r&&r.defaultPrevented)){this._activate(this._element,i);var s=function(){U.trigger(e,"hidden.bs.tab",{relatedTarget:t._element}),U.trigger(t._element,"shown.bs.tab",{relatedTarget:e});};n?this._activate(n,n.parentNode,s):s();}}},n.dispose=function(){T(this._element,"bs.tab"),this._element=null;},n._activate=function(t,e,n){var i=this,o=(!e||"UL"!==e.nodeName&&"OL"!==e.nodeName?J.children(e,".active"):J.find(":scope > li > .active",e))[0],r=n&&o&&o.classList.contains("fade"),s=function(){return i._transitionComplete(t,o,n)};if(o&&r){var a=f(o);o.classList.remove("show"),U.one(o,"transitionend",s),p(o,a);}else s();},n._transitionComplete=function(t,e,n){if(e){e.classList.remove("active");var i=J.findOne(":scope > .dropdown-menu .active",e.parentNode);i&&i.classList.remove("active"),"tab"===e.getAttribute("role")&&e.setAttribute("aria-selected",!1);}(t.classList.add("active"),"tab"===t.getAttribute("role")&&t.setAttribute("aria-selected",!0),_(t),t.classList.contains("fade")&&t.classList.add("show"),t.parentNode&&t.parentNode.classList.contains("dropdown-menu"))&&(t.closest(".dropdown")&&J.find(".dropdown-toggle").forEach((function(t){return t.classList.add("active")})),t.setAttribute("aria-expanded",!0));n&&n();},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.tab")||new t(this);if("string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e]();}}))},t.getInstance=function(t){return E(t,"bs.tab")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}}]),t}();U.on(document,"click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',(function(t){t.preventDefault(),(E(this,"bs.tab")||new an(this)).show();}));var ln=b();if(ln){var cn=ln.fn.tab;ln.fn.tab=an.jQueryInterface,ln.fn.tab.Constructor=an,ln.fn.tab.noConflict=function(){return ln.fn.tab=cn,an.jQueryInterface};}var un={animation:"boolean",autohide:"boolean",delay:"number"},fn={animation:!0,autohide:!0,delay:5e3},hn=function(){function t(t,e){this._element=t,this._config=this._getConfig(e),this._timeout=null,this._setListeners(),w(t,"bs.toast",this);}var i=t.prototype;return i.show=function(){var t=this;if(!U.trigger(this._element,"show.bs.toast").defaultPrevented){this._clearTimeout(),this._config.animation&&this._element.classList.add("fade");var e=function(){t._element.classList.remove("showing"),t._element.classList.add("show"),U.trigger(t._element,"shown.bs.toast"),t._config.autohide&&(t._timeout=setTimeout((function(){t.hide();}),t._config.delay));};if(this._element.classList.remove("hide"),_(this._element),this._element.classList.add("showing"),this._config.animation){var n=f(this._element);U.one(this._element,"transitionend",e),p(this._element,n);}else e();}},i.hide=function(){var t=this;if(this._element.classList.contains("show")&&!U.trigger(this._element,"hide.bs.toast").defaultPrevented){var e=function(){t._element.classList.add("hide"),U.trigger(t._element,"hidden.bs.toast");};if(this._element.classList.remove("show"),this._config.animation){var n=f(this._element);U.one(this._element,"transitionend",e),p(this._element,n);}else e();}},i.dispose=function(){this._clearTimeout(),this._element.classList.contains("show")&&this._element.classList.remove("show"),U.off(this._element,"click.dismiss.bs.toast"),T(this._element,"bs.toast"),this._element=null,this._config=null;},i._getConfig=function(t){return t=n({},fn,Z.getDataAttributes(this._element),"object"==typeof t&&t?t:{}),g("toast",t,this.constructor.DefaultType),t},i._setListeners=function(){var t=this;U.on(this._element,"click.dismiss.bs.toast",'[data-dismiss="toast"]',(function(){return t.hide()}));},i._clearTimeout=function(){clearTimeout(this._timeout),this._timeout=null;},t.jQueryInterface=function(e){return this.each((function(){var n=E(this,"bs.toast");if(n||(n=new t(this,"object"==typeof e&&e)),"string"==typeof e){if(void 0===n[e])throw new TypeError('No method named "'+e+'"');n[e](this);}}))},t.getInstance=function(t){return E(t,"bs.toast")},e(t,null,[{key:"VERSION",get:function(){return "5.0.0-alpha2"}},{key:"DefaultType",get:function(){return un}},{key:"Default",get:function(){return fn}}]),t}(),dn=b();if(dn){var pn=dn.fn.toast;dn.fn.toast=hn.jQueryInterface,dn.fn.toast.Constructor=hn,dn.fn.toast.noConflict=function(){return dn.fn.toast=pn,hn.jQueryInterface};}return {Alert:V,Button:q,Carousel:rt,Collapse:ft,Dropdown:Te,Modal:Oe,Popover:$e,ScrollSpy:on,Tab:an,Toast:hn,Tooltip:Qe}}));

    });

    /* src\App.svelte generated by Svelte v3.32.3 */
    const file$8 = "src\\App.svelte";

    // (81:20) {#if showDebugUi}
    function create_if_block$5(ctx) {
    	let input;
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let t6;
    	let button3;
    	let t8;
    	let button4;
    	let t10;
    	let button5;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "추가";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "기사";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "도로";
    			t6 = space();
    			button3 = element("button");
    			button3.textContent = "뺏기";
    			t8 = space();
    			button4 = element("button");
    			button4.textContent = "얻기";
    			t10 = space();
    			button5 = element("button");
    			button5.textContent = "점수";
    			attr_dev(input, "type", "number");
    			set_style(input, "width", "50px");
    			attr_dev(input, "class", "test-dice svelte-165vs91");
    			add_location(input, file$8, 81, 20, 2932);
    			attr_dev(button0, "class", "btn btn-primary svelte-165vs91");
    			add_location(button0, file$8, 85, 20, 3100);
    			attr_dev(button1, "class", "btn btn-primary svelte-165vs91");
    			add_location(button1, file$8, 87, 20, 3222);
    			attr_dev(button2, "class", "btn btn-primary svelte-165vs91");
    			add_location(button2, file$8, 89, 20, 3354);
    			attr_dev(button3, "class", "btn btn-primary svelte-165vs91");
    			add_location(button3, file$8, 91, 20, 3484);
    			attr_dev(button4, "class", "btn btn-primary svelte-165vs91");
    			add_location(button4, file$8, 93, 20, 3622);
    			attr_dev(button5, "class", "btn btn-primary svelte-165vs91");
    			add_location(button5, file$8, 95, 20, 3759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*$katan*/ ctx[0].testDice);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button2, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, button3, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, button4, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, button5, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7]),
    					listen_dev(button0, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[9], false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[10], false, false, false),
    					listen_dev(button3, "click", /*click_handler_5*/ ctx[11], false, false, false),
    					listen_dev(button4, "click", /*click_handler_6*/ ctx[12], false, false, false),
    					listen_dev(button5, "click", /*click_handler_7*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$katan*/ 1 && to_number(input.value) !== /*$katan*/ ctx[0].testDice) {
    				set_input_value(input, /*$katan*/ ctx[0].testDice);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(button3);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(button4);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(button5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(81:20) {#if showDebugUi}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let table;
    	let tr;
    	let td0;
    	let player0;
    	let t0;
    	let td1;
    	let h1;
    	let img;
    	let img_src_value;
    	let t1;
    	let t2_value = /*$katan*/ ctx[0].message + "";
    	let t2;
    	let t3;
    	let div0;
    	let dice0;
    	let t4;
    	let dice1;
    	let t5;
    	let button0;
    	let t6;
    	let button0_disabled_value;
    	let t7;
    	let button1;
    	let t8;
    	let button1_disabled_value;
    	let t9;
    	let t10;
    	let board;
    	let t11;
    	let td2;
    	let player1;
    	let current;
    	let mounted;
    	let dispose;

    	player0 = new Player({
    			props: { playerIndex: 0 },
    			$$inline: true
    		});

    	dice0 = new Dice({
    			props: { number: /*$katan*/ ctx[0].dice[0] },
    			$$inline: true
    		});

    	dice1 = new Dice({
    			props: { number: /*$katan*/ ctx[0].dice[1] },
    			$$inline: true
    		});

    	let if_block = /*showDebugUi*/ ctx[3] && create_if_block$5(ctx);

    	board = new Board({
    			props: {
    				resourceList: /*$katan*/ ctx[0].resourceList,
    				castleList: /*$katan*/ ctx[0].castleList
    			},
    			$$inline: true
    		});

    	player1 = new Player({
    			props: { playerIndex: 1 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			table = element("table");
    			tr = element("tr");
    			td0 = element("td");
    			create_component(player0.$$.fragment);
    			t0 = space();
    			td1 = element("td");
    			h1 = element("h1");
    			img = element("img");
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			create_component(dice0.$$.fragment);
    			t4 = space();
    			create_component(dice1.$$.fragment);
    			t5 = space();
    			button0 = element("button");
    			t6 = text("주사위");
    			t7 = space();
    			button1 = element("button");
    			t8 = text("완료");
    			t9 = space();
    			if (if_block) if_block.c();
    			t10 = space();
    			create_component(board.$$.fragment);
    			t11 = space();
    			td2 = element("td");
    			create_component(player1.$$.fragment);
    			attr_dev(td0, "valign", "top");
    			attr_dev(td0, "class", "player svelte-165vs91");
    			add_location(td0, file$8, 66, 12, 2072);
    			if (img.src !== (img_src_value = /*player*/ ctx[1].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-165vs91");
    			add_location(img, file$8, 70, 63, 2305);
    			attr_dev(h1, "class", "message-header svelte-165vs91");
    			attr_dev(h1, "style", /*headerStyle*/ ctx[2]);
    			add_location(h1, file$8, 70, 16, 2258);
    			attr_dev(button0, "class", "btn btn-primary svelte-165vs91");
    			button0.disabled = button0_disabled_value = /*$katan*/ ctx[0].diceDisabled;
    			add_location(button0, file$8, 74, 20, 2537);
    			attr_dev(button1, "class", "btn btn-primary svelte-165vs91");
    			button1.disabled = button1_disabled_value = !/*$katan*/ ctx[0].action;
    			add_location(button1, file$8, 77, 20, 2720);
    			attr_dev(div0, "class", "dice-container svelte-165vs91");
    			add_location(div0, file$8, 71, 16, 2369);
    			attr_dev(td1, "valign", "top");
    			attr_dev(td1, "class", "text-center svelte-165vs91");
    			attr_dev(td1, "width", "1000px");
    			add_location(td1, file$8, 69, 12, 2188);
    			attr_dev(td2, "valign", "top");
    			attr_dev(td2, "class", "player svelte-165vs91");
    			add_location(td2, file$8, 103, 12, 4100);
    			attr_dev(tr, "class", "svelte-165vs91");
    			add_location(tr, file$8, 65, 8, 2054);
    			attr_dev(table, "class", "header svelte-165vs91");
    			add_location(table, file$8, 64, 4, 2022);
    			attr_dev(div1, "class", "katan svelte-165vs91");
    			add_location(div1, file$8, 63, 0, 1997);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, table);
    			append_dev(table, tr);
    			append_dev(tr, td0);
    			mount_component(player0, td0, null);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, h1);
    			append_dev(h1, img);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(td1, t3);
    			append_dev(td1, div0);
    			mount_component(dice0, div0, null);
    			append_dev(div0, t4);
    			mount_component(dice1, div0, null);
    			append_dev(div0, t5);
    			append_dev(div0, button0);
    			append_dev(button0, t6);
    			append_dev(div0, t7);
    			append_dev(div0, button1);
    			append_dev(button1, t8);
    			append_dev(div0, t9);
    			if (if_block) if_block.m(div0, null);
    			append_dev(td1, t10);
    			mount_component(board, td1, null);
    			append_dev(tr, t11);
    			append_dev(tr, td2);
    			mount_component(player1, td2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*player*/ 2 && img.src !== (img_src_value = /*player*/ ctx[1].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*$katan*/ 1) && t2_value !== (t2_value = /*$katan*/ ctx[0].message + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty & /*headerStyle*/ 4) {
    				attr_dev(h1, "style", /*headerStyle*/ ctx[2]);
    			}

    			const dice0_changes = {};
    			if (dirty & /*$katan*/ 1) dice0_changes.number = /*$katan*/ ctx[0].dice[0];
    			dice0.$set(dice0_changes);
    			const dice1_changes = {};
    			if (dirty & /*$katan*/ 1) dice1_changes.number = /*$katan*/ ctx[0].dice[1];
    			dice1.$set(dice1_changes);

    			if (!current || dirty & /*$katan*/ 1 && button0_disabled_value !== (button0_disabled_value = /*$katan*/ ctx[0].diceDisabled)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (!current || dirty & /*$katan*/ 1 && button1_disabled_value !== (button1_disabled_value = !/*$katan*/ ctx[0].action)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (/*showDebugUi*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const board_changes = {};
    			if (dirty & /*$katan*/ 1) board_changes.resourceList = /*$katan*/ ctx[0].resourceList;
    			if (dirty & /*$katan*/ 1) board_changes.castleList = /*$katan*/ ctx[0].castleList;

    			if (dirty & /*$$scope*/ 32768) {
    				board_changes.$$scope = { dirty, ctx };
    			}

    			board.$set(board_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player0.$$.fragment, local);
    			transition_in(dice0.$$.fragment, local);
    			transition_in(dice1.$$.fragment, local);
    			transition_in(board.$$.fragment, local);
    			transition_in(player1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player0.$$.fragment, local);
    			transition_out(dice0.$$.fragment, local);
    			transition_out(dice1.$$.fragment, local);
    			transition_out(board.$$.fragment, local);
    			transition_out(player1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(player0);
    			destroy_component(dice0);
    			destroy_component(dice1);
    			if (if_block) if_block.d();
    			destroy_component(board);
    			destroy_component(player1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $katan;
    	validate_store(katanStore, "katan");
    	component_subscribe($$self, katanStore, $$value => $$invalidate(0, $katan = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	const getHeaderStyle = () => {
    		return toStyle({ backgroundColor: player.color });
    	};

    	let player;
    	let playerList;
    	let headerStyle;
    	let showDebugUi = false;

    	jquery(() => {
    		jquery("body").on("keydown", e => {
    			if (e.keyCode === 121) {
    				$$invalidate(3, showDebugUi = !showDebugUi);
    			}
    		});

    		setTimeout(
    			() => {
    				const element = document.querySelectorAll("[data-bs-toggle=\"tooltip\"]");
    				const tooltipTriggerList = [].slice.call(element);

    				tooltipTriggerList.map(function (tooltipTriggerEl) {
    					const trade = tooltipTriggerEl.getAttribute("trade");
    					const type = tooltipTriggerEl.getAttribute("type");
    					const placement = tooltipTriggerEl.getAttribute("placement");
    					let title = `<strong>${trade}:1</strong> `;

    					if (type !== "all") {
    						title += `<img class="port-resource" src="${type}_item.png">`;
    					} else {
    						title += `<div class="port-resource">ALL</div>`;
    					}

    					const tooltip = new bootstrap_esm_min.Tooltip(tooltipTriggerEl,
    					{
    							html: true,
    							placement,
    							trigger: "manual",
    							title
    						});

    					tooltip.show();
    					return tooltip;
    				});
    			},
    			1000
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => katanStore.play();
    	const click_handler_1 = () => katanStore.turn();

    	function input_input_handler() {
    		$katan.testDice = to_number(this.value);
    		katanStore.set($katan);
    	}

    	const click_handler_2 = () => katanStore.test();
    	const click_handler_3 = () => katanStore.testKnightCard();
    	const click_handler_4 = () => katanStore.testRoadCard();
    	const click_handler_5 = () => katanStore.testTakeResourceCard();
    	const click_handler_6 = () => katanStore.testGetResourceCard();
    	const click_handler_7 = () => katanStore.testGetPointCard();

    	$$self.$capture_state = () => ({
    		katan: katanStore,
    		Board,
    		Dice,
    		Player,
    		toStyle,
    		Tooltip: bootstrap_esm_min.Tooltip,
    		jQuery: jquery,
    		getHeaderStyle,
    		player,
    		playerList,
    		headerStyle,
    		showDebugUi,
    		$katan
    	});

    	$$self.$inject_state = $$props => {
    		if ("player" in $$props) $$invalidate(1, player = $$props.player);
    		if ("playerList" in $$props) $$invalidate(4, playerList = $$props.playerList);
    		if ("headerStyle" in $$props) $$invalidate(2, headerStyle = $$props.headerStyle);
    		if ("showDebugUi" in $$props) $$invalidate(3, showDebugUi = $$props.showDebugUi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$katan, playerList*/ 17) {
    			{
    				$$invalidate(4, playerList = $katan.playerList);
    				$$invalidate(1, player = playerList[$katan.playerIndex]);
    				$$invalidate(2, headerStyle = getHeaderStyle());
    			}
    		}
    	};

    	return [
    		$katan,
    		player,
    		headerStyle,
    		showDebugUi,
    		playerList,
    		click_handler,
    		click_handler_1,
    		input_input_handler,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$8.name
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
