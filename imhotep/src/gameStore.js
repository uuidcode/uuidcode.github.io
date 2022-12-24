import {get, writable} from "svelte/store";
import { tick } from 'svelte';
import game from "./game"
import {listen_dev} from "svelte/internal";

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
    range: (size, start = 0) => {
        return Array(size).fill(start)
            .map((item, index) => item + index)
    },
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
    load: async (boat) => {
        u((game) => {
            game.disabled = true;
        });

        await tick();

        u((game) => {
            let color = gameStore.getCurrentPlayerColor();
            const stone = game.currentPlayer.stoneList.pop();
            let loaded = false;

            boat.stoneList = boat.stoneList
                .map(currentStone => {
                    if (loaded) {
                        return currentStone;
                    }

                    if (currentStone.empty) {
                        loaded = true;
                        stone.color = color;
                        return stone;
                    }

                    return currentStone;
                });

            boat.stoneCount++;
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
                    empty: true,
                    destination: true,
                    stoneCount: 0,
                    stoneList: [],
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
        if (game) {
            gameStore._turn(game);
        } else {
            u((game) => {
                gameStore._turn(game);
            });
        }
    },
    _turn: (game) => {
        if (game.start) {
            game.turn += 1;
        }

        gameStore.updateGame(game);
    },
    move: (boat, destination) => {
        u((game) => {
            game.boatList[boat.index] = {
                empty: true,
                stoneCount: 0,
                stoneList: [],
                maxStoneCount: 0,
                destinationList: [],
                destination: false
            }

            boat.arrived = true;
            boat.destination = true;
            boat.destinationList = [];
            game.destinationBoatList[destination.index] = boat;

            gameStore.updateGame(game);
        });
    },
    getStoneColor: (stone) => {
        if (stone.empty) {
            return 'lightgrey';
        }

        return get(gameStore)
            .playerList[stone.playerIndex]
            .color;
    },
    getCurrentPlayerColor: () => {
        return get(gameStore).currentPlayer.color;
    },
    updateGame: (game) => {
        if (game) {
            gameStore._updateGame(game);
        } else {
            u((game) => {
                gameStore._updateGame(game);
            });
        }
    },
    _updateGame: (game) => {
        game.disabled = false;
        game.currentPlayer = game.playerList[game.turn % 2];

        game.playerList = game.playerList
            .map(player => {
                player.active = player.index === game.turn % 2;
                return player;
            })
            .map(player => {
                player.canGetStone = gameStore.canGetStone(game, player);

                game.boatList = game.boatList
                    .map(boat => {
                        boat.loadable = game.currentPlayer.stoneList.length > 0
                            && boat.stoneCount < boat.maxStoneCount

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