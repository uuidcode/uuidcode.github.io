import {get, writable} from "svelte/store";
import game from "./game"

Number.prototype.range = function (start = 0) {
    if (!Number.isInteger(this)) {
        return [];
    }

    return Array(this).fill(start)
        .map((x, y) => x + y)
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
    setNewBoatList: (game) => {
        game.boatList = game.boatGroup
            .sort(() => 0.5 - Math.random())
            .pop();
    },
    getLoadableBoatList: (game) => {
        if (game.currentPlayer.stoneCount === 0) {
            return [];
        }

        return game.boatList
            .filter(boat => boat.stoneCount < boat.maxStoneCount)
    },
    canGetStone: (game) => {
        return game.currentPlayer.stoneCount <= 2;
    },
    getMovableBoatList: (game) => {
        return game.boatList
            .filter(boat => boat.stoneCount >= boat.minStoneCount);
    },
    startStage: (game) => {
        if (game.start) {
            game.stage += 1;
        }

        gameStore.setNewBoatList(game);
    },
    start: () => {
        u((game) => {
            gameStore.startStage(game);
            gameStore.turn(game);
            game.start = true;
        });
    },
    turn: (game) => {
        if (game.start) {
            game.turn += 1;
        }

        game.currentPlayer = game.playerList[game.turn % 2];
        game.currentPlayer.canGetStone = gameStore.canGetStone(game);
        game.currentPlayer.loadableBoatList = gameStore.getLoadableBoatList(game);
        game.currentPlayer.movableBoatList = gameStore.getMovableBoatList(game);

        if (game.boatList.length === 0) {
            gameStore.startStage(game);
        }
    }
}

gameStore.start();

export default gameStore;