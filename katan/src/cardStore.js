import { shuffle } from "./util";
import { writable } from "svelte/store";

let cardList = [];

for (let i = 0; i < 5; i++) {
    cardList.push('point')
}

for (let i = 0; i < 14; i++) {
    cardList.push('knight')
}

for (let i = 0; i < 2; i++) {
    cardList.push('road');
    cardList.push('resource');
    cardList.push('get');
}

cardList = shuffle(cardList);

const { subscribe, set, update } = writable(cardList);

export default {
    subscribe,
    set
}