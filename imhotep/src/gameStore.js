import {get, writable} from "svelte/store";
import { tick } from 'svelte';
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
            .pop()
            .map((boat, index) => {
                boat.index = index;
                boat.destinationList = [];
                boat.stoneCount = 0;
                return boat;
            });
    },
    load: (boat) => {
        u((game) => {
            game.currentPlayer.stoneList.pop();

            game.boatList
                .find(b => b === boat)
                .stoneCount++;

            gameStore.updateGame(game);
        });
    },
    getLoadableBoatList: (game, player) => {
        if (player.active) {
            return [];
        }

        if (player.stoneList.length === 0) {
            return [];
        }

        return game.boatList
            .filter(boat => boat.stoneCount < boat.maxStoneCount)
    },
    canGetStone: (game, player) => {
        return player.active
            && player.stoneList.length <= 2;
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

        game.destinationList = game.destinationList
            .map(destination => {
                destination.empty = true;
                return destination;
            });

        game.destinationBoatList = game.destinationList
            .map(destination => {
                return {
                    stoneCount: 0,
                    maxStoneCount: 0,
                    destinationList: []
                }
            });
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
    move: async (boat, destination) => {
        u((game) => {
            game.boatList[boat.index].arrived = true;
            gameStore.updateGame(game);
        });

        await tick();

        u((game) => {
            game.destinationBoatList[destination.index] = boat;
            game.destinationBoatList[destination.index].arrived = true;

            game.boatList[boat.index] = {
                arrived: true,
                stoneCount: 0,
                maxStoneCount: 0,
                destinationList: []
            }

            gameStore.updateGame(game);
        });
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

                game.boatList = game.boatList
                    .map(boat => {
                        boat.loadable = game.currentPlayer.stoneList.length > 0
                            && boat.stoneCount < boat.minStoneCount

                        if (boat.stoneCount < boat.minStoneCount) {
                            boat.destinationList = [];
                        } else {
                            boat.destinationList = game.destinationList
                                .filter(destination => {
                                    return destination.empty
                                });
                        }

                        return boat;
                    });

                if (game.boatList.length === 0) {
                    gameStore.startStage(game);
                }

                return player;
            });
    }
}

gameStore.start();

export default gameStore;