import {writable} from "svelte/store";
import game from "./game"

const { subscribe, set, update } = writable(game);

let gameStore = {
    subscribe,
    set,
    update
};

gameStore = {
    ...gameStore,
    load: (boat) => {
        update(game => {
            const player = gameStore.currentPlayer(game);
            const stone = player.stoneList.pop();
            stone.color = player.color;
            boat.stoneList = [...boat.stoneList, stone]
            return game;
        });

        gameStore.nextTurn();
    },
    currentPlayer: (game) => {
        return game.playerList[game.turn % 2];
    },
    nextTurn: () => {
        update(game => {
            game.turn = game.turn + 1;
            game.playerList = game.playerList.map(player => {
                player.active = game.turn % 2 === player.index;
                return player;
            })
            return game;
        });
    },
}

export default gameStore;