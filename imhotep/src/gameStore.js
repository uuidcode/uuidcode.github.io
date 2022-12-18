import {get, writable} from "svelte/store";
import game from "./game"

Number.prototype.range = function (start = 0) {
    if (!Number.isInteger(this)) {
        return [];
    }

    return Array(this).fill(start).map((x, y) => x + y)
}

const { subscribe, set, update } = writable(game);

const u = (callback) => {
    update(game => {
        callback(game);
        return game;
    });
};

let gameStore = {
    subscribe,
    set,
    update
};

gameStore = {
    ...gameStore,
    range: (size, start = 0) => {
        return Array(size).fill(start).map((x, y) => x + y)
    },
    getLoadableBoatList: (game) => {
        return game.boatList
            .filter(boat => boat.stoneCount < boat.maxStoneCount)
    },
    canGetStone: (game) => {
        return game.currentPlayer.stoneCount < 5;
    },
    getMovableBoatList: (game) => {
        return game.boatList
            .filter(boat => boat.stoneCount >= boat.minStoneCount);
    },
    updateGame: () => {
        u((game) => {
            game.currentPlayer = game.playerList[game.turn % 2];
            game.currentPlayer.canGetStone = gameStore.canGetStone(game);
            game.currentPlayer.loadableBoatList = gameStore.getLoadableBoatList(game);
            game.currentPlayer.movableBoatList = gameStore.getMovableBoatList(game);
            game.turn += 1;
        });
    }
}

export default gameStore;