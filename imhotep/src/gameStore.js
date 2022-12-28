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
    range: (size, start = 0) => {
        return Array(size).fill(start)
            .map((item, index) => item + index)
    },
    setNewBoatListList: (game) => {
        game.boatListList = Array(4).fill(1)
            .map((item, index) => {
                let boat = game.waitingBoatList.pop();
                boat.index = index;
                return [boat];
            });

    },
    getStone: async () => {
        u((game) => {
            game.actionType = 'getStone';
        });

        await tick();

        u((game) => {
            const newStoneListList = game.stoneListList.slice(0, 2);
            newStoneListList.map(stoneList => {
                stoneList[0].playerIndex = game.turn % 2;
                return stoneList;
            });

            game.stoneListList = game.stoneListList.slice(3, 5);

            for (let i = 0; i < newStoneListList.length; i++) {
                game.currentPlayer.stoneListList =
                    game.currentPlayer.stoneListList
                        .map(stoneList => {
                            if (stoneList.length === 0) {
                                stoneList = newStoneListList[i];
                            }

                            return stoneList;
                        });
            }

            gameStore.updateGame(game);

        });
    },
    load: async (boat) => {
        u((game) => {
            game.enable = false;
        });

        await tick();

        u((game) => {
            let color = gameStore.getCurrentPlayerColor();

            const stone = game.currentPlayer.stoneListList
                .findLast(stoneList => stoneList.length > 0)
                .pop();

            stone.color = color;

            for (let i = boat.stoneListList.length - 1; i >= 0; i--) {
                if (boat.stoneListList[i].length === 0) {
                    boat.stoneListList[i].push(stone);
                    break;
                }
            }

            boat.stoneCount++;
            game.enable = true;

            gameStore.updateGame(game);
        });
    },
    canGetStone: (game, player) => {
        return player.active
            && player.stoneListList
                .filter(stoneList => stoneList.length > 0)
                .length <= 2;
    },
    startStage: (game) => {
        if (game.start) {
            game.stage += 1;
        }

        gameStore.setNewBoatListList(game);

        game.destinationList = game.destinationList
            .map(destination => {
                destination.empty = true;
                return destination;
            });

        game.destinationBoatListList = game.destinationList
            .map(destination => {
                return []
            });
    },
    start: () => {
        u((game) => {
            gameStore.startStage(game);
            gameStore.turn(game);
            game.start = true;
            gameStore.updateGame(game);
        });
    },
    turn: (game) => {
        console.log('turn')

        if (game) {
            gameStore._turn(game);
        } else {
            u((game) => {
                gameStore._turn(game);
            });
        }
    },
    _turn: (game) => {
        if (game.animation === true) {
            return;
        }

        if (game.start) {
            game.turn += 1;
        }

        gameStore.updateGame(game);
    },
    move: async (boat, destination) => {
        u((game) => {
            game.actionType = 'move';
        });

        await tick();

        u((game) => {
            game.actionType = null;
            boat.arrived = true;
            game.boatListList[boat.index].pop();
            game.destinationBoatListList[destination.index].push(boat);
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

                game.boatListList = game.boatListList
                    .map((boatList, i) => {
                        if (boatList.length < 1) {
                            return boatList;
                        }

                        console.log(`>>> boatList[${i}]`, boatList);
                        let boat = boatList[0];
                        console.log('>>> boat', boat);

                        boat.loadable = game.currentPlayer.stoneListList
                                .filter(stoneList => stoneList.length > 0)
                                .length > 0
                                && boat.stoneCount < boat.maxStoneCount

                        if (boat.stoneCount < boat.minStoneCount) {
                            boat.destinationList = [];
                        } else {
                            boat.destinationList = game.destinationList
                                .filter(destination => {
                                    return destination.empty
                                });
                        }

                        return [boat];
                    });

                // if (game.boatListList.filter(boatList => boatList.length > 0).length === 0) {
                //     gameStore.startStage(game);
                // }

                return player;
            });

        console.log('>>> game', game);

    }
}

gameStore.start();

export default gameStore;