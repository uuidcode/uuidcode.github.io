
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
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
    const outroing = new Set();
    let outros;
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

    const game = {
        turn: 0,
        stoneIndex: 0,
        activePlayer: null,
        landList: [
            {
                name: '장터',
                itemList: []
            },
            {
                name: '피라미드',
                currentStoneRow: 0,
                currentStoneColumn: 0
            },
            {
                name: '묘실',
                currentStoneRow: 0,
                currentStoneColumn: 0
            },
            {
                name: '성벽',
                currentStoneIndex: 0,
                stoneList: [
                    {
                        playerIndex: -1,
                        color: 'white'
                    },
                    {
                        playerIndex: -1,
                        color: 'white'
                    },
                    {
                        playerIndex: -1,
                        color: 'white'
                    },
                    {
                        playerIndex: -1,
                        color: 'white'
                    }
                ]
            },
            {
                name: '오빌리스크'
            }
        ],
        boatList: [
            {
                index: 0,
                maxStone: 3,
                minStone: 2,
                stoneList: []
            },
            {
                index: 1,
                maxStone: 4,
                minStone: 3,
                stoneList: []
            }
        ],
        playerList: [
            {
                index: 0,
                active: true,
                name: '테드',
                color: 'sandybrown',
                stoneList: [],
                obeliskStoneCount: 0,
                wallStoneCount: 0,
                tombStoneCount: 0,
                hammerCount: 0,
                chiselCount: 0,
                leverCount: 0,
                sailCount: 0
            },
            {
                index: 1,
                name: '다은',
                color: 'darkgray',
                stoneList: [],
                obeliskStoneCount: 0,
                wallStoneCount: 0,
                tombStoneCount: 0,
                hammerCount: 0,
                chiselCount: 0,
                leverCount: 0,
                sailCount: 0
            }
        ]
    };

    game.landList.forEach((land, i) => {
        land.index = i;
        land.landed = false;

        if (i === 2) {
            land.stoneList = [];
            for (let j = 0; j < 3; j++) {
                const stoneList = [];

                for (let k = 0; k < 8; k++) {
                    stoneList.push({
                        playerIndex: -1,
                        color: 'white'
                    });
                }

                land.stoneList.push(stoneList);
            }
        } else if (i === 1) {
            land.stoneList = [];
            for (let j = 0; j < 3; j++) {
                const stoneList = [];

                let column = 6;

                if (j === 1) {
                    column = 5;
                } else if (j === 2) {
                    column = 3;
                }

                for (let k = 0; k < column; k++) {
                    stoneList.push({
                        playerIndex: -1,
                        color: 'white'
                    });
                }

                land.stoneList.push(stoneList);
            }
        }
    });

    game.itemList = [];

    for (let i = 0; i < 5; i++) {
        game.itemList.push({
            name: '지렛대',
            description: '배 한척을 빈 항구로 옮깁니다. 석재 내리는 순서를 마음대로 바꿉니다.'
        });

        game.itemList.push({
            name: '끌',
            description: '배 1척에 석재 2개를 싣습니다. 배 2척에 각각 석재 1개를 싣습니다.'
        });

        game.itemList.push({
            name: '돛',
            description: '배 1척에 석재 1개를 싣고 그 배를 항구로 보냅니다.'
        });

        game.itemList.push({
            name: '망치',
            description: '석재 3개를 받고 석재 1개를 배 1척에 싣습니다.'
        });
    }

    game.itemList = game.itemList.sort(i => Math.random() - 0.5);

    const { subscribe, set, update } = writable(game);

    let gameStore = {
        subscribe,
        set,
        update
    };

    gameStore = {
        ...gameStore,
        init: () => {
            update(game => {
                game.activePlayer = game.playerList[game.turn % 2];
                game.playerList = game.playerList
                    .map(player => {
                        player.stoneList = gameStore.createStoneList(game, player, 3);
                        return player;
                    });

                game.boatList = gameStore.createBoat();

                for (let i = 0; i < 4; i++) {
                    gameStore.getMarket(game).itemList.push(game.itemList.pop());
                }

                gameStore.refresh(game);

                return game;
            });
        },
        getStone: (player) => {
            update(game => {
                const stoneCount = Math.min(5 - game.activePlayer.stoneList.length, 3);
                player.stoneList = player.stoneList.concat(gameStore.createStoneList(game, player, stoneCount));
                return game;
            });

            gameStore.nextTurn();
        },
        createStoneList: (game, player, count) => {
            const stoneList = [];

            for (let i = 0; i < count; i++) {
                stoneList.push({
                    index: game.stoneIndex++,
                    playerIndex: player.index,
                    color: player.color
                });
            }

            return stoneList;
        },
        createList: (size) => {
            return Array(size).fill(0).map((item, i) => i);
        },
        random : (list) => {
            return list.sort(() => Math.random() - 0.5).pop();
        },
        randomWithSize : (start, end) => {
            const list = Array(end - start + 1)
                .fill(0)
                .map((item, i) => start + i);

            return gameStore.random(list);
        },
        createBoat : () => {
            const boatList = [];

            for (let i = 0; i < 4; i++) {
                const maxStone = gameStore.random([2, 3, 4]);
                const minStone = gameStore.randomWithSize(1, maxStone);

                boatList.push({
                    landed: false,
                    maxStone,
                    minStone,
                    stoneList: []
                });
            }

            return boatList;
        },
        getMarket: (game) => {
            if (game) {
                return game.landList[0];
            }

            return get_store_value(gameStore).landList[0];
        },
        getPyramid: (game) => {
            if (game) {
                return game.landList[1];
            }

            return get_store_value(gameStore).landList[1];
        },
        getTomb: (game) => {
            if (game) {
                return game.landList[2];
            }

            return get_store_value(gameStore).landList[2];
        },
        getWall: (game) => {
            if (game) {
                return game.landList[3];
            }

            return get_store_value(gameStore).landList[3];
        },
        getObelisk: (game) => {
            if (game) {
                return game.landList[4];
            }

            return get_store_value(gameStore).landList[4];
        },
        sleep: (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms))
        },
        move : (boat, land) => {
            update(game => {
                const top = 170 * land.index - boat.element.offsetTop + 20;
                boat.style = `transform: translate(400px, ${top}px)`;
                land.landed = true;
                boat.landed = true;
                gameStore.refresh(game);
                return game;
            });

            if (land.index === 4) {
                setTimeout(() => {
                    update(game => {
                        boat.stoneList.forEach(stone => {
                            game.playerList[stone.playerIndex].obeliskStoneCount++;
                        });

                        boat.stoneList = [];
                        gameStore.refresh(game);
                        return game;
                    });

                    gameStore.nextTurn();
                }, 1000);
            } else if (land.index === 3) {
                setTimeout(() => {
                    update(game => {
                        boat.stoneList.forEach(stone => {
                            const landStone = land.stoneList[land.currentStoneIndex];
                            const currentPlayer = game.playerList[stone.playerIndex];

                            landStone.playerIndex = stone.playerIndex;
                            landStone.color = currentPlayer.color;
                            currentPlayer.wallStoneCount++;
                            land.currentStoneIndex++;
                            land.currentStoneIndex = land.currentStoneIndex % 4;

                            if (land.currentStoneIndex === 0) {
                                land.stoneList.forEach(i => {
                                    i.playerIndex = -1;
                                    i.color = 'white';
                                });
                            }
                        });

                        boat.stoneList = [];
                        gameStore.refresh(game);
                        return game;
                    });

                    gameStore.nextTurn();
                }, 1000);
            } else if (land.index === 2) {
                setTimeout(() => {
                    update(game => {
                        boat.stoneList.forEach(stone => {
                            const landStone = land.stoneList[land.currentStoneRow][land.currentStoneColumn];
                            const currentPlayer = game.playerList[stone.playerIndex];
                            landStone.playerIndex = stone.playerIndex;
                            landStone.color = currentPlayer.color;
                            currentPlayer.tombStoneCount++;
                            land.currentStoneRow++;
                            land.currentStoneRow = land.currentStoneRow % 3;

                            if (land.currentStoneRow === 0) {
                                land.currentStoneColumn++;
                            }
                        });

                        boat.stoneList = [];
                        gameStore.refresh(game);
                        return game;
                    });

                    gameStore.nextTurn();
                }, 1000);
            } else if (land.index === 1) {
                setTimeout(() => {
                    update(game => {
                        boat.stoneList.forEach(stone => {
                            const landStone = land.stoneList[land.currentStoneRow][land.currentStoneColumn];
                            const currentPlayer = game.playerList[stone.playerIndex];
                            landStone.playerIndex = stone.playerIndex;
                            landStone.color = currentPlayer.color;
                            currentPlayer.tombStoneCount++;
                            land.currentStoneRow++;

                            if (land.currentStoneColumn < 3) {
                                land.currentStoneRow = land.currentStoneRow % 3;
                            } else if (land.currentStoneColumn === 3 && land.currentStoneColumn === 4) {
                                land.currentStoneRow = land.currentStoneRow % 2;
                            }

                            if (land.currentStoneRow === 0) {
                                land.currentStoneColumn++;
                            }
                        });

                        boat.stoneList = [];
                        gameStore.refresh(game);
                        return game;
                    });

                    gameStore.nextTurn();
                }, 1000);
            } else if (land.index === 0) {
                setTimeout(() => {
                    update(game => {
                        boat.stoneList.forEach(stone => {
                            const item = gameStore.getMarket(game)
                                .itemList.shift();

                            const currentPlayer = game.playerList[stone.playerIndex];

                            if (item.name === '망치') {
                                currentPlayer.hammerCount++;
                            } else if (item.name === '돛') {
                                currentPlayer.sailCount++;
                            } else if (item.name === '끌') {
                                currentPlayer.chiselCount++;
                            } else if (item.name === '지렛대') {
                                currentPlayer.leverCount++;
                            }
                        });

                        gameStore.refresh(game);
                        return game;
                    });

                    gameStore.nextTurn();
                }, 1000);
            }
        },
        refresh: (game) => {
            game.boatList = game.boatList.map(boat => {
                boat.canLoad = boat.stoneList.length < boat.maxStone
                    && game.activePlayer.stoneList.length > 0
                    && boat.landed === false;

                const canMove = boat.stoneList.length >= boat.minStone
                    && boat.landed === false;

                boat.canMoveToMarket = canMove && gameStore.getMarket().landed === false;
                boat.canMoveToPyramid = canMove && gameStore.getPyramid().landed === false;
                boat.canMoveToTomb = canMove && gameStore.getTomb().landed === false;
                boat.canMoveToWall = canMove && gameStore.getWall().landed === false;
                boat.canMoveToObelisk = canMove && gameStore.getObelisk().landed === false;
                return boat;
            });

            game.playerList = game.playerList.map(player => {
                player.canGet = player.active && player.stoneList.length <= 4;
                return player;
            });
        },
        load: (boat) => {
            update(game => {
                const player = gameStore.currentPlayer(game);
                const stone = player.stoneList.pop();
                stone.color = player.color;
                boat.stoneList = [...boat.stoneList, stone];

                return game;
            });

            gameStore.nextTurn();
        },
        currentPlayer: (game) => {
            return game.playerList[game.turn % 2];
        },
        nextTurn: () => {
            update(game => {
                if (game.boatList.filter(boat => !boat.landed).length === 0) {
                    game.boatList = gameStore.createBoat();

                    game.landList.forEach(land => land.landed = false);
                }

                game.turn = game.turn + 1;
                game.playerList = game.playerList.map(player => {
                    player.active = game.turn % 2 === player.index;

                    if (player.active) {
                        game.activePlayer = player;
                    }

                    return player;
                });

                gameStore.refresh(game);
                return game;
            });
        },
    };

    var gameStore$1 = gameStore;

    /* src/Land.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/Land.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_5$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (50:26) 
    function create_if_block_4$1(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*land*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let each_value_6 = /*land*/ ctx[1].itemList;
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			add_location(div0, file$1, 51, 16, 2145);
    			attr_dev(div1, "class", "land");
    			add_location(div1, file$1, 50, 12, 2110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*land*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$gameStore*/ 1) {
    				each_value_6 = /*land*/ ctx[1].itemList;
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_6.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(50:26) ",
    		ctx
    	});

    	return block;
    }

    // (39:26) 
    function create_if_block_3$1(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*land*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let each_value_4 = /*land*/ ctx[1].stoneList;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			add_location(div0, file$1, 40, 16, 1702);
    			attr_dev(div1, "class", "land");
    			add_location(div1, file$1, 39, 12, 1667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*land*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$gameStore*/ 1) {
    				each_value_4 = /*land*/ ctx[1].stoneList;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(39:26) ",
    		ctx
    	});

    	return block;
    }

    // (28:26) 
    function create_if_block_2$1(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*land*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let each_value_2 = /*land*/ ctx[1].stoneList;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			add_location(div0, file$1, 29, 16, 1259);
    			attr_dev(div1, "class", "land");
    			add_location(div1, file$1, 28, 12, 1224);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*land*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$gameStore*/ 1) {
    				each_value_2 = /*land*/ ctx[1].stoneList;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(28:26) ",
    		ctx
    	});

    	return block;
    }

    // (15:26) 
    function create_if_block_1$1(ctx) {
    	let div5;
    	let div0;
    	let t0_value = /*land*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let div4;
    	let div2;
    	let t3_value = /*$gameStore*/ ctx[0].playerList[0].name + "";
    	let t3;
    	let t4;
    	let t5_value = /*$gameStore*/ ctx[0].playerList[0].wallStoneCount + "";
    	let t5;
    	let t6;
    	let div3;
    	let t7_value = /*$gameStore*/ ctx[0].playerList[1].name + "";
    	let t7;
    	let t8;
    	let t9_value = /*$gameStore*/ ctx[0].playerList[1].wallStoneCount + "";
    	let t9;
    	let t10;
    	let each_value_1 = /*land*/ ctx[1].stoneList;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div4 = element("div");
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = text(" : ");
    			t5 = text(t5_value);
    			t6 = space();
    			div3 = element("div");
    			t7 = text(t7_value);
    			t8 = text(" : ");
    			t9 = text(t9_value);
    			t10 = space();
    			add_location(div0, file$1, 16, 16, 630);
    			add_location(div1, file$1, 17, 16, 669);
    			attr_dev(div2, "class", "wall_stone");
    			add_location(div2, file$1, 23, 20, 911);
    			attr_dev(div3, "class", "wall_stone");
    			add_location(div3, file$1, 24, 20, 1037);
    			add_location(div4, file$1, 22, 16, 885);
    			attr_dev(div5, "class", "land");
    			add_location(div5, file$1, 15, 12, 595);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, t0);
    			append_dev(div5, t1);
    			append_dev(div5, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, t3);
    			append_dev(div2, t4);
    			append_dev(div2, t5);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, t7);
    			append_dev(div3, t8);
    			append_dev(div3, t9);
    			append_dev(div5, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*land*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*$gameStore*/ 1) {
    				each_value_1 = /*land*/ ctx[1].stoneList;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*$gameStore*/ 1 && t3_value !== (t3_value = /*$gameStore*/ ctx[0].playerList[0].name + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$gameStore*/ 1 && t5_value !== (t5_value = /*$gameStore*/ ctx[0].playerList[0].wallStoneCount + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*$gameStore*/ 1 && t7_value !== (t7_value = /*$gameStore*/ ctx[0].playerList[1].name + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*$gameStore*/ 1 && t9_value !== (t9_value = /*$gameStore*/ ctx[0].playerList[1].wallStoneCount + "")) set_data_dev(t9, t9_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(15:26) ",
    		ctx
    	});

    	return block;
    }

    // (7:8) {#if i === 4}
    function create_if_block$1(ctx) {
    	let div4;
    	let div0;
    	let t0_value = /*land*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let div3;
    	let div1;
    	let t2_value = /*$gameStore*/ ctx[0].playerList[0].name + "";
    	let t2;
    	let t3;
    	let t4_value = /*$gameStore*/ ctx[0].playerList[0].obeliskStoneCount + "";
    	let t4;
    	let t5;
    	let div2;
    	let t6_value = /*$gameStore*/ ctx[0].playerList[1].name + "";
    	let t6;
    	let t7;
    	let t8_value = /*$gameStore*/ ctx[0].playerList[1].obeliskStoneCount + "";
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = text(" : ");
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			t6 = text(t6_value);
    			t7 = text(" :  ");
    			t8 = text(t8_value);
    			t9 = space();
    			add_location(div0, file$1, 8, 16, 204);
    			attr_dev(div1, "class", "obelisk_stone");
    			add_location(div1, file$1, 10, 20, 269);
    			attr_dev(div2, "class", "obelisk_stone");
    			add_location(div2, file$1, 11, 20, 401);
    			add_location(div3, file$1, 9, 16, 243);
    			attr_dev(div4, "class", "land");
    			add_location(div4, file$1, 7, 12, 169);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, t0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, t6);
    			append_dev(div2, t7);
    			append_dev(div2, t8);
    			append_dev(div4, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*land*/ ctx[1].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$gameStore*/ 1 && t2_value !== (t2_value = /*$gameStore*/ ctx[0].playerList[0].name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$gameStore*/ 1 && t4_value !== (t4_value = /*$gameStore*/ ctx[0].playerList[0].obeliskStoneCount + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$gameStore*/ 1 && t6_value !== (t6_value = /*$gameStore*/ ctx[0].playerList[1].name + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$gameStore*/ 1 && t8_value !== (t8_value = /*$gameStore*/ ctx[0].playerList[1].obeliskStoneCount + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(7:8) {#if i === 4}",
    		ctx
    	});

    	return block;
    }

    // (53:16) {#each land.itemList as item}
    function create_each_block_6(ctx) {
    	let div;
    	let t0_value = /*item*/ ctx[13].name + "";
    	let t0;
    	let br;
    	let t1;
    	let t2_value = /*item*/ ctx[13].description + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			br = element("br");
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(br, file$1, 54, 35, 2288);
    			attr_dev(div, "class", "item");
    			add_location(div, file$1, 53, 20, 2234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, br);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*item*/ ctx[13].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$gameStore*/ 1 && t2_value !== (t2_value = /*item*/ ctx[13].description + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(53:16) {#each land.itemList as item}",
    		ctx
    	});

    	return block;
    }

    // (44:24) {#each stoneList as stone, i}
    function create_each_block_5$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "wall_stone");
    			set_style(div, "background", /*stone*/ ctx[4].color);
    			add_location(div, file$1, 44, 28, 1905);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1) {
    				set_style(div, "background", /*stone*/ ctx[4].color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$1.name,
    		type: "each",
    		source: "(44:24) {#each stoneList as stone, i}",
    		ctx
    	});

    	return block;
    }

    // (42:16) {#each land.stoneList as stoneList}
    function create_each_block_4$1(ctx) {
    	let div;
    	let each_value_5 = /*stoneList*/ ctx[6];
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5$1(get_each_context_5$1(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div, "height", "50px");
    			add_location(div, file$1, 42, 20, 1797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1) {
    				each_value_5 = /*stoneList*/ ctx[6];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5$1(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(42:16) {#each land.stoneList as stoneList}",
    		ctx
    	});

    	return block;
    }

    // (33:24) {#each stoneList as stone, i}
    function create_each_block_3$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "wall_stone");
    			set_style(div, "background", /*stone*/ ctx[4].color);
    			add_location(div, file$1, 33, 28, 1462);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1) {
    				set_style(div, "background", /*stone*/ ctx[4].color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(33:24) {#each stoneList as stone, i}",
    		ctx
    	});

    	return block;
    }

    // (31:16) {#each land.stoneList as stoneList}
    function create_each_block_2$1(ctx) {
    	let div;
    	let each_value_3 = /*stoneList*/ ctx[6];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div, "height", "50px");
    			add_location(div, file$1, 31, 20, 1354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1) {
    				each_value_3 = /*stoneList*/ ctx[6];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(31:16) {#each land.stoneList as stoneList}",
    		ctx
    	});

    	return block;
    }

    // (19:20) {#each land.stoneList as stone, i}
    function create_each_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "wall_stone");
    			set_style(div, "background", /*stone*/ ctx[4].color);
    			add_location(div, file$1, 19, 24, 754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1) {
    				set_style(div, "background", /*stone*/ ctx[4].color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(19:20) {#each land.stoneList as stone, i}",
    		ctx
    	});

    	return block;
    }

    // (6:4) {#each $gameStore.landList as land, i}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[3] === 4) return create_if_block$1;
    		if (/*i*/ ctx[3] === 3) return create_if_block_1$1;
    		if (/*i*/ ctx[3] === 2) return create_if_block_2$1;
    		if (/*i*/ ctx[3] === 1) return create_if_block_3$1;
    		if (/*i*/ ctx[3] === 0) return create_if_block_4$1;
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
    			if (if_block) if_block.p(ctx, dirty);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(6:4) {#each $gameStore.landList as land, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let each_value = /*$gameStore*/ ctx[0].landList;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "part land-part");
    			add_location(div, file$1, 4, 0, 63);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gameStore*/ 1) {
    				each_value = /*$gameStore*/ ctx[0].landList;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
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
    			if (detaching) detach_dev(div);
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
    	component_subscribe($$self, gameStore$1, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Land', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Land> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ gameStore: gameStore$1, $gameStore });
    	return [$gameStore];
    }

    class Land extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Land",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[10] = list;
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	child_ctx[14] = i;
    	return child_ctx;
    }

    // (19:20) {#each player.stoneList as stone, i}
    function create_each_block_5(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "player-stone");
    			attr_dev(div, "style", div_style_value = /*stone*/ ctx[12].style);
    			set_style(div, "background", /*player*/ ctx[17].color, false);
    			add_location(div, file, 19, 24, 650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && div_style_value !== (div_style_value = /*stone*/ ctx[12].style)) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty & /*$gameStore*/ 1) {
    				set_style(div, "background", /*player*/ ctx[17].color, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(19:20) {#each player.stoneList as stone, i}",
    		ctx
    	});

    	return block;
    }

    // (26:20) {#if player.canGet}
    function create_if_block_6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[1](/*player*/ ctx[17], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "가져오기";
    			add_location(button, file, 26, 24, 932);
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(26:20) {#if player.canGet}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each $gameStore.playerList as player}
    function create_each_block_4(ctx) {
    	let div7;
    	let div0;
    	let t0_value = /*player*/ ctx[17].name + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let t3_value = /*player*/ ctx[17].hammerCount + "";
    	let t3;
    	let t4;
    	let div2;
    	let t5;
    	let t6_value = /*player*/ ctx[17].chiselCount + "";
    	let t6;
    	let t7;
    	let div3;
    	let t8;
    	let t9_value = /*player*/ ctx[17].sailCount + "";
    	let t9;
    	let t10;
    	let div4;
    	let t11;
    	let t12_value = /*player*/ ctx[17].leverCount + "";
    	let t12;
    	let t13;
    	let div5;
    	let t14;
    	let div6;
    	let t15;
    	let each_value_5 = /*player*/ ctx[17].stoneList;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	let if_block = /*player*/ ctx[17].canGet && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text("망치 : ");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			t5 = text("끌 : ");
    			t6 = text(t6_value);
    			t7 = space();
    			div3 = element("div");
    			t8 = text("돛 : ");
    			t9 = text(t9_value);
    			t10 = space();
    			div4 = element("div");
    			t11 = text("지렛대 : ");
    			t12 = text(t12_value);
    			t13 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t14 = space();
    			div6 = element("div");
    			if (if_block) if_block.c();
    			t15 = space();
    			attr_dev(div0, "class", "player-name");
    			add_location(div0, file, 12, 16, 294);
    			add_location(div1, file, 13, 16, 355);
    			add_location(div2, file, 14, 16, 408);
    			add_location(div3, file, 15, 16, 460);
    			add_location(div4, file, 16, 16, 510);
    			add_location(div5, file, 17, 16, 563);
    			add_location(div6, file, 24, 16, 862);
    			attr_dev(div7, "class", "player");
    			toggle_class(div7, "active", /*player*/ ctx[17].active);
    			add_location(div7, file, 11, 12, 228);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, t0);
    			append_dev(div7, t1);
    			append_dev(div7, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div7, t4);
    			append_dev(div7, div2);
    			append_dev(div2, t5);
    			append_dev(div2, t6);
    			append_dev(div7, t7);
    			append_dev(div7, div3);
    			append_dev(div3, t8);
    			append_dev(div3, t9);
    			append_dev(div7, t10);
    			append_dev(div7, div4);
    			append_dev(div4, t11);
    			append_dev(div4, t12);
    			append_dev(div7, t13);
    			append_dev(div7, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			if (if_block) if_block.m(div6, null);
    			append_dev(div7, t15);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && t0_value !== (t0_value = /*player*/ ctx[17].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$gameStore*/ 1 && t3_value !== (t3_value = /*player*/ ctx[17].hammerCount + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$gameStore*/ 1 && t6_value !== (t6_value = /*player*/ ctx[17].chiselCount + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$gameStore*/ 1 && t9_value !== (t9_value = /*player*/ ctx[17].sailCount + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*$gameStore*/ 1 && t12_value !== (t12_value = /*player*/ ctx[17].leverCount + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*$gameStore*/ 1) {
    				each_value_5 = /*player*/ ctx[17].stoneList;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}

    			if (/*player*/ ctx[17].canGet) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(div6, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$gameStore*/ 1) {
    				toggle_class(div7, "active", /*player*/ ctx[17].active);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(11:8) {#each $gameStore.playerList as player}",
    		ctx
    	});

    	return block;
    }

    // (37:20) {#each gameStore.createList(boat.maxStone) as stone, i}
    function create_each_block_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "boat-stone");
    			add_location(div, file, 37, 24, 1389);
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
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(37:20) {#each gameStore.createList(boat.maxStone) as stone, i}",
    		ctx
    	});

    	return block;
    }

    // (42:20) {#each gameStore.createList(boat.minStone) as stone, i}
    function create_each_block_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "boat-min-stone");
    			add_location(div, file, 42, 24, 1615);
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
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(42:20) {#each gameStore.createList(boat.minStone) as stone, i}",
    		ctx
    	});

    	return block;
    }

    // (47:20) {#each boat.stoneList as stone, i}
    function create_each_block_1(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "player-stone");
    			attr_dev(div, "style", div_style_value = /*stone*/ ctx[12].style);
    			set_style(div, "background", /*stone*/ ctx[12].color, false);
    			add_location(div, file, 47, 24, 1820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$gameStore*/ 1 && div_style_value !== (div_style_value = /*stone*/ ctx[12].style)) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty & /*$gameStore*/ 1) {
    				set_style(div, "background", /*stone*/ ctx[12].color, false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(47:20) {#each boat.stoneList as stone, i}",
    		ctx
    	});

    	return block;
    }

    // (54:20) {#if boat.canLoad}
    function create_if_block_5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[2](/*boat*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "싣기";
    			add_location(button, file, 54, 24, 2124);
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(54:20) {#if boat.canLoad}",
    		ctx
    	});

    	return block;
    }

    // (57:20) {#if boat.canMoveToMarket}
    function create_if_block_4(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[3](/*boat*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "장터";
    			add_location(button, file, 57, 24, 2278);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(57:20) {#if boat.canMoveToMarket}",
    		ctx
    	});

    	return block;
    }

    // (61:20) {#if boat.canMoveToPyramid}
    function create_if_block_3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_3(...args) {
    		return /*click_handler_3*/ ctx[4](/*boat*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "피라미드";
    			add_location(button, file, 61, 24, 2457);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_3, false, false, false);
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(61:20) {#if boat.canMoveToPyramid}",
    		ctx
    	});

    	return block;
    }

    // (65:20) {#if boat.canMoveToTomb}
    function create_if_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_4(...args) {
    		return /*click_handler_4*/ ctx[5](/*boat*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "묘실";
    			add_location(button, file, 65, 24, 2636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_4, false, false, false);
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(65:20) {#if boat.canMoveToTomb}",
    		ctx
    	});

    	return block;
    }

    // (69:20) {#if boat.canMoveToWall}
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_5(...args) {
    		return /*click_handler_5*/ ctx[6](/*boat*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "성벽";
    			add_location(button, file, 69, 24, 2810);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_5, false, false, false);
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(69:20) {#if boat.canMoveToWall}",
    		ctx
    	});

    	return block;
    }

    // (73:20) {#if boat.canMoveToObelisk}
    function create_if_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler_6(...args) {
    		return /*click_handler_6*/ ctx[7](/*boat*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "오빌리스크";
    			add_location(button, file, 73, 24, 2987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_6, false, false, false);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(73:20) {#if boat.canMoveToObelisk}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#each $gameStore.boatList as boat}
    function create_each_block(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let div4_style_value;
    	let each_value = /*each_value*/ ctx[10];
    	let boat_index = /*boat_index*/ ctx[11];
    	let each_value_3 = gameStore$1.createList(/*boat*/ ctx[9].maxStone);
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = gameStore$1.createList(/*boat*/ ctx[9].minStone);
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*boat*/ ctx[9].stoneList;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block0 = /*boat*/ ctx[9].canLoad && create_if_block_5(ctx);
    	let if_block1 = /*boat*/ ctx[9].canMoveToMarket && create_if_block_4(ctx);
    	let if_block2 = /*boat*/ ctx[9].canMoveToPyramid && create_if_block_3(ctx);
    	let if_block3 = /*boat*/ ctx[9].canMoveToTomb && create_if_block_2(ctx);
    	let if_block4 = /*boat*/ ctx[9].canMoveToWall && create_if_block_1(ctx);
    	let if_block5 = /*boat*/ ctx[9].canMoveToObelisk && create_if_block(ctx);
    	const assign_div4 = () => /*div4_binding*/ ctx[8](div4, each_value, boat_index);
    	const unassign_div4 = () => /*div4_binding*/ ctx[8](null, each_value, boat_index);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t0 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			if (if_block3) if_block3.c();
    			t6 = space();
    			if (if_block4) if_block4.c();
    			t7 = space();
    			if (if_block5) if_block5.c();
    			t8 = space();
    			attr_dev(div0, "class", "boat-load-max");
    			add_location(div0, file, 35, 16, 1261);
    			attr_dev(div1, "class", "boat-load-min");
    			add_location(div1, file, 40, 16, 1487);
    			attr_dev(div2, "class", "boat-load");
    			add_location(div2, file, 45, 16, 1717);
    			attr_dev(div3, "class", "boat-controller");
    			add_location(div3, file, 52, 16, 2031);
    			attr_dev(div4, "class", "boat");
    			attr_dev(div4, "style", div4_style_value = /*boat*/ ctx[9].style);
    			add_location(div4, file, 34, 12, 1180);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div0, null);
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div4, t1);
    			append_dev(div4, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t4);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t5);
    			if (if_block3) if_block3.m(div3, null);
    			append_dev(div3, t6);
    			if (if_block4) if_block4.m(div3, null);
    			append_dev(div3, t7);
    			if (if_block5) if_block5.m(div3, null);
    			append_dev(div4, t8);
    			assign_div4();
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$gameStore*/ 1) {
    				const old_length = each_value_3.length;
    				each_value_3 = gameStore$1.createList(/*boat*/ ctx[9].maxStone);
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = old_length; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (!each_blocks_2[i]) {
    						each_blocks_2[i] = create_each_block_3(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div0, null);
    					}
    				}

    				for (i = each_value_3.length; i < old_length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_3.length;
    			}

    			if (dirty & /*$gameStore*/ 1) {
    				const old_length = each_value_2.length;
    				each_value_2 = gameStore$1.createList(/*boat*/ ctx[9].minStone);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = old_length; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (!each_blocks_1[i]) {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div1, null);
    					}
    				}

    				for (i = each_value_2.length; i < old_length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*$gameStore*/ 1) {
    				each_value_1 = /*boat*/ ctx[9].stoneList;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*boat*/ ctx[9].canLoad) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div3, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*boat*/ ctx[9].canMoveToMarket) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(div3, t4);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*boat*/ ctx[9].canMoveToPyramid) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					if_block2.m(div3, t5);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*boat*/ ctx[9].canMoveToTomb) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2(ctx);
    					if_block3.c();
    					if_block3.m(div3, t6);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*boat*/ ctx[9].canMoveToWall) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_1(ctx);
    					if_block4.c();
    					if_block4.m(div3, t7);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*boat*/ ctx[9].canMoveToObelisk) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block(ctx);
    					if_block5.c();
    					if_block5.m(div3, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (dirty & /*$gameStore*/ 1 && div4_style_value !== (div4_style_value = /*boat*/ ctx[9].style)) {
    				attr_dev(div4, "style", div4_style_value);
    			}

    			if (each_value !== /*each_value*/ ctx[10] || boat_index !== /*boat_index*/ ctx[11]) {
    				unassign_div4();
    				each_value = /*each_value*/ ctx[10];
    				boat_index = /*boat_index*/ ctx[11];
    				assign_div4();
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			unassign_div4();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(34:8) {#each $gameStore.boatList as boat}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let land;
    	let current;
    	let each_value_4 = /*$gameStore*/ ctx[0].playerList;
    	validate_each_argument(each_value_4);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_1[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value = /*$gameStore*/ ctx[0].boatList;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	land = new Land({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(land.$$.fragment);
    			attr_dev(div0, "class", "part player-part");
    			add_location(div0, file, 9, 4, 137);
    			attr_dev(div1, "class", "part sea-part");
    			add_location(div1, file, 32, 4, 1096);
    			attr_dev(div2, "class", "board");
    			add_location(div2, file, 8, 0, 113);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div2, t1);
    			mount_component(land, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gameStore, gameStore*/ 1) {
    				each_value_4 = /*$gameStore*/ ctx[0].playerList;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_4(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_4.length;
    			}

    			if (dirty & /*$gameStore, gameStore*/ 1) {
    				each_value = /*$gameStore*/ ctx[0].boatList;
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(land.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(land.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(land);
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
    	component_subscribe($$self, gameStore$1, $$value => $$invalidate(0, $gameStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	gameStore$1.init();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (player, e) => gameStore$1.getStone(player);
    	const click_handler_1 = (boat, e) => gameStore$1.load(boat);
    	const click_handler_2 = (boat, e) => gameStore$1.move(boat, gameStore$1.getMarket());
    	const click_handler_3 = (boat, e) => gameStore$1.move(boat, gameStore$1.getPyramid());
    	const click_handler_4 = (boat, e) => gameStore$1.move(boat, gameStore$1.getTomb());
    	const click_handler_5 = (boat, e) => gameStore$1.move(boat, gameStore$1.getWall());
    	const click_handler_6 = (boat, e) => gameStore$1.move(boat, gameStore$1.getObelisk());

    	function div4_binding($$value, each_value, boat_index) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			each_value[boat_index].element = $$value;
    			gameStore$1.set($gameStore);
    		});
    	}

    	$$self.$capture_state = () => ({ gameStore: gameStore$1, Land, $gameStore });

    	return [
    		$gameStore,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		div4_binding
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
