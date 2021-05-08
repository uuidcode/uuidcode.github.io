import {writable} from "svelte/store";

const gameObject = {
    cityList: [
        {
            name: 'San Francisco',
            x: 58,
            y: 270,
            count: 3,
            type: 'blue'
        }
    ]
};

const { subscribe, set, update } = writable(gameObject);

const gameStore = {
    subscribe,
    set,
    update
};

export default gameStore;