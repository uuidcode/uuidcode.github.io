import {writable} from "svelte/store";
import config from './config.js'
import { getDisplay } from './util.js'
import resourceListStore from './resourceListStore'
import playListStore from './playListStore'

const katan = {
    dice: [6, 6],
    mode: 'ready'
};

const { subscribe, set, update } = writable(katan);

const katanStore = {
    subscribe,

    isReady: () => katanStore.mode === 'ready',

    isStart: () => katanStore.mode === 'start',

    start: () => update(katan => {
        katan.mode = 'start';
        return katan;
    }),

    roll: (a, b) => update(katna => {
        katan.dice[0] = a;
        katan.dice[1] = b;
        return katanStore;
    }),

    getNumber: () => katan.dice[0] + katan.dice[1],

    play: () => {
        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 6) + 1;

        katanStore.roll(a, b);

        const number = a + b;

        $resourceListStore
            .filter(resouce => resouce.number === number)
            .forEach(resouce => {
                const player = $playListStore
                    .find(play => play.turn);

                player.resource[resouce.type]++;
            });

        katan.turn();
    },

    turn: () => {
        playListStore.turn();
    }
};

export default katanStore;