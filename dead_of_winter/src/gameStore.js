import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import game from "./game"

const { subscribe, set, update } = writable(game);

const gameStore = {
    subscribe,
    set,
    update,

    plusRound: () => update(game => {
        game.round = game.round + 1;
        return game;
    }),

    minusRound: () => update(game => {
        game.round = game.round - 1;
        return game;
    }),

    plusMoral: () => update(game => {
        game.moral = game.moral + 1;
        return game;
    }),

    minusMoral: () => update(game => {
        game.moral = game.moral - 1;
        return game;
    })
}

export default gameStore;