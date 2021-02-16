import {writable} from "svelte/store";

const playerList = [
    {
        color: 'lightblue',
        name: '다은',
        turn: true,
        pickTown: true,
        pickLoad: false,
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
        color: 'lightcoral',
        name: '아빠',
        turn: false,
        pickTown: false,
        pickLoad: false,
        resource: {
            tree: 0,
            mud: 0,
            wheat: 0,
            sheep: 0,
            iron: 0
        },
        index: 1
    }
];

const { subscribe, set, update } = writable(playerList);

const playerListStore = {
    subscribe,
    turn: () => {
        update(list => list.map(player => {
            player.turn = !player.turn
        }));
    },
    getActivePlayer: () => {
        return playerList
            .find(player => player.turn);
    }
};

export default playerListStore;