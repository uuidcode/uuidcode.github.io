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
    getLoadableBoatList: (game, player) => {
        if (player.active) {
            return [];
        }

        if (player.stoneCount === 0) {
            return [];
        }

        return game.boatList
            .filter(boat => boat.stoneCount < boat.maxStoneCount)
    },
    canGetStone: (game, player) => {
        return player.active
            && player.stoneCount <= 2;
    },
    getMovableBoatList: (game, player) => {
        return player.active
            && game.boatList.filter(boat => boat.stoneCount >= boat.minStoneCount);
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

        gameStore.updateGame(game);
    },
    template: () => {
        u((game) => {

        });
    },
    updateGame: (game) => {
        game.currentPlayer = game.playerList[game.turn % 2];

        game.playerList = game.playerList
            .map(player => {
                player.active = player.index === game.turn % 2;
                return player;
            })
            .map(player => {
                player.canGetStone = gameStore.canGetStone(game, player);
                player.loadableBoatList = gameStore.getLoadableBoatList(game, player);
                player.movableBoatList = gameStore.getMovableBoatList(game, player);

                if (game.boatList.length === 0) {
                    gameStore.startStage(game);
                }

                return player;
            });
    }
}

gameStore.start();

export default gameStore;