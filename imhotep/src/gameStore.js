import {get, writable} from "svelte/store";
import game from "./game"

const { subscribe, set, update } = writable(game);

let gameStore = {
    subscribe,
    set,
    update
};

gameStore = {
    ...gameStore,
    init: () => {
        update(game => {
            game.activePlayer = game.playerList[game.turn % 2];
            game.playerList = game.playerList
                .map(player => {
                    player.stoneList = gameStore.createStoneList(game, player, 3);
                    return player;
                })

            game.boatList = gameStore.createBoat();
            gameStore.resetItem(game);
            gameStore.refresh(game);

            return game;
        });
    },
    resetItem: (game) => {
        const market = gameStore.getMarket(game);

        market.itemList = [];

        for (let i = 0; i < 4; i++) {
            market.itemList.push(game.itemList.pop());
        }
    },
    sortStone: (e, boatIndex) => {
        update(game => {
            const boat = game.boatList.find(boat => boat.index === boatIndex);
            const stoneList = Array.from(e.to.children)
                .map(child => child.getAttribute('stoneIndex'))
                .map(index => Number(index))
                .map(stoneIndex => boat.stoneList.find(stone => stone.index === stoneIndex))
                .reverse();

            boat.stoneList = stoneList;

            return game;
        })
    },
    getStoneAndNextTure: (player) => {
        gameStore.getStone(player, true);
    },
    createStoneList: (game, player, count) => {
        const stoneList = [];

        for (let i = 0; i < count; i++) {
            stoneList.push({
                index: game.stoneIndex++,
                playerIndex: player.index,
                color: player.color
            });
        }

        return stoneList;
    },
    createList: (size) => {
        return Array(size).fill(0).map((item, i) => i);
    },
    getStone: (player, nextTure) => {
        update(game => {
            const stoneCount = Math.min(5 - game.activePlayer.stoneList.length, 3);
            const newStoneList = gameStore.createStoneList(game, player, stoneCount);
            player.stoneList = player.stoneList.concat(newStoneList);
            return game;
        });

        if (nextTure === true) {
            gameStore.nextTurn();
        }
    },
    random : (list) => {
        return list.sort(() => Math.random() - 0.5).pop();
    },
    randomWithSize : (start, end) => {
        const list = Array(end - start + 1)
            .fill(0)
            .map((item, i) => start + i);

        return gameStore.random(list);
    },
    createBoat : () => {
        const boatList = [];

        for (let i = 0; i < 4; i++) {
            const maxStone = gameStore.random([2, 3, 4]);
            const minStone = gameStore.randomWithSize(1, maxStone);

            boatList.push({
                index: game.boatIndex++,
                landed: false,
                maxStone,
                minStone,
                stoneList: []
            });
        }

        return boatList;
    },
    getMarket: (game) => {
        if (game) {
            return game.landList[0];
        }

        return get(gameStore).landList[0];
    },
    getPyramid: (game) => {
        if (game) {
            return game.landList[1];
        }

        return get(gameStore).landList[1];
    },
    getTomb: (game) => {
        if (game) {
            return game.landList[2];
        }

        return get(gameStore).landList[2];
    },
    getWall: (game) => {
        if (game) {
            return game.landList[3];
        }

        return get(gameStore).landList[3];
    },
    getObelisk: (game) => {
        if (game) {
            return game.landList[4];
        }

        return get(gameStore).landList[4];
    },
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    },
    move : (boat, element, land) => {
        update(game => {
            const top = 170 * land.index - element.offsetTop + 70;
            const left = 800 - boat.maxStone * 50;
            boat.style = `transform: translate(${left}px, ${top}px)`
            land.landed = true;
            boat.landed = true;
            gameStore.refresh(game);
            return game;
        });

        if (land.name === '오벨리스크') {
            setTimeout(() => {
                update(game => {
                    boat.stoneList.forEach(stone => {
                        gameStore.addStoneAtObelisk(stone);
                    });

                    boat.stoneList = [];
                    gameStore.refresh(game);
                    return game;
                });

                gameStore.nextTurn();
            }, 1000);
        } else if (land.name === '성벽') {
            setTimeout(() => {
                update(game => {
                    boat.stoneList.forEach(stone => {
                        const landStone = land.stoneList[land.currentStoneIndex];
                        const currentPlayer = game.playerList[stone.playerIndex];

                        landStone.playerIndex = stone.playerIndex;
                        landStone.color = currentPlayer.color;
                        currentPlayer.wallStoneCount++;
                        land.currentStoneIndex++;
                        land.currentStoneIndex = land.currentStoneIndex % 4;

                        if (land.currentStoneIndex === 0) {
                            land.stoneList.forEach(i => {
                                i.playerIndex = -1;
                                i.color = 'white';
                            })
                        }
                    });

                    boat.stoneList = [];
                    gameStore.refresh(game);
                    return game;
                });

                gameStore.nextTurn();
            }, 1000);
        } else if (land.name === '묘실') {
            setTimeout(() => {
                update(game => {
                    boat.stoneList.forEach(stone => {
                        gameStore.addStoneAtTomb(stone);
                    });

                    boat.stoneList = [];
                    gameStore.refresh(game);
                    return game;
                });

                gameStore.nextTurn();
            }, 1000);
        } else if (land.name === '피라미드') {
            setTimeout(() => {
                update(game => {
                    boat.stoneList.forEach(stone => {
                        const landStone = land.stoneList[land.currentStoneRow][land.currentStoneColumn];
                        const currentPlayer = game.playerList[stone.playerIndex];
                        landStone.playerIndex = stone.playerIndex;
                        landStone.color = currentPlayer.color;
                        land.currentStoneRow++;

                        if (land.currentStoneColumn < 3) {
                            land.currentStoneRow = land.currentStoneRow % 3;
                        } else if (land.currentStoneColumn === 3
                            && land.currentStoneColumn === 4) {
                            land.currentStoneRow = land.currentStoneRow % 2;
                        }

                        if (land.currentStoneRow === 0) {
                            land.currentStoneColumn++;
                        }
                    });

                    boat.stoneList = [];
                    gameStore.refresh(game);
                    return game;
                });

                gameStore.nextTurn();
            }, 1000);
        } else if (land.name === '장터') {
            setTimeout(() => {
                update(game => {
                    boat.stoneList.forEach(stone => {
                        const item = gameStore.getMarket(game)
                            .itemList.shift();

                        const currentPlayer = game.playerList[stone.playerIndex];

                        if (item.name === '망치') {
                            currentPlayer.hammerCount++;
                        } else if (item.name === '돛') {
                            currentPlayer.sailCount++;
                        } else if (item.name === '끌') {
                            currentPlayer.chiselCount++;
                        } else if (item.name === '지렛대') {
                            currentPlayer.leverCount++;
                        } else if (item.name === '오빌리스크 장식') {
                            currentPlayer.obeliskDecorationCount++;
                        } else if (item.name === '묘실 장식') {
                            currentPlayer.tombDecorationCount++;
                        } else if (item.name === '성벽 장식') {
                            currentPlayer.wallDecorationCount++;
                        } else if (item.name === '피라미드 장식') {
                            currentPlayer.pyramidDecorationCount++;
                        } else if (item.name === '석관') {
                            const stoneList = gameStore.createStoneList(game, currentPlayer, 1);
                            gameStore.addStoneAtTomb(stoneList[0]);
                        } else if (item.name === '포장도로') {
                            const stoneList = gameStore.createStoneList(game, currentPlayer, 1);
                            gameStore.addStoneAtObelisk(stoneList[0]);
                        }
                    });


                    boat.stoneList = [];
                    gameStore.refresh(game);
                    return game;
                });

                gameStore.nextTurn();
            }, 1000);
        }
    },
    addStoneAtObelisk: (stone) => {
        update(game => {
            const player = game.playerList[stone.playerIndex];
            player.obeliskStoneCount++;
            return game;
        })
    },
    addStoneAtTomb: (stone) => {
        update(game => {
            const tomb = gameStore.getTomb(game);
            const landStone = tomb.stoneList[tomb.currentStoneRow][tomb.currentStoneColumn];
            landStone.playerIndex = stone.playerIndex;
            const player = game.playerList[stone.playerIndex];
            landStone.color = player.color;
            player.tombStoneCount++;
            tomb.currentStoneRow++;
            tomb.currentStoneRow = tomb.currentStoneRow % 3;

            if (tomb.currentStoneRow === 0) {
                tomb.currentStoneColumn++;
            }

            return game;
        });
    },
    refresh: (game) => {
        game.boatList = game.boatList.map(boat => {
            const player = game.activePlayer;

            const canMoveUsingSail = player.useTool === true
                && player.useToolName === '돛'
                && player.loadCount === 1;

            const canMoveUsingLever = player.useTool === true
                && player.useToolName === '지렛대'
                && boat.stoneList.length > 1

            boat.canLoad = boat.stoneList.length < boat.maxStone
                && game.activePlayer.stoneList.length > 0
                && boat.landed === false
                && canMoveUsingLever === false;

            if (canMoveUsingSail) {
                boat.canLoad = false;
            }

            let canMove = boat.stoneList.length >= boat.minStone
                && boat.landed === false;

            canMove = canMove || canMoveUsingSail || canMoveUsingLever;

            boat.canMoveToMarket = canMove && gameStore.getMarket().landed === false;
            boat.canMoveToPyramid = canMove && gameStore.getPyramid().landed === false;
            boat.canMoveToTomb = canMove && gameStore.getTomb().landed === false;
            boat.canMoveToWall = canMove && gameStore.getWall().landed === false;
            boat.canMoveToObelisk = canMove && gameStore.getObelisk().landed === false;

            if (canMoveUsingSail && boat !== game.boatUsingSail) {
                boat.canMoveToMarket = false;
                boat.canMoveToPyramid = false;
                boat.canMoveToTomb = false;
                boat.canMoveToWall = false;
                boat.canMoveToObelisk = false;
            }

            return boat;
        });

        game.playerList = game.playerList.map(player => {
            player.canGetStone = player.active
                && player.stoneList.length <= 4
                && player.useTool === false;

            player.canUseHammer = player.active
                && player.useTool === false
                && player.hammerCount > 0;

            player.canUseChisel = player.active
                && player.useTool === false
                && player.chiselCount > 0
                && player.stoneList.length >= 2;

            player.canUseSail = player.active
                && player.useTool === false
                && player.sailCount > 0
                && player.stoneList.length >= 1;

            player.canUseLever = player.active
                && player.useTool === false
                && player.leverCount > 0
                && game.boatList.some(boat => boat.stoneList.length > 0);

            return player;
        });
    },
    useHammer: () => {
        gameStore.getStone(game.activePlayer, false);

        update(game => {
            game.activePlayer.useTool = true;
            game.activePlayer.useToolName = '망치';
            gameStore.refresh(game);
            return game;
        });
    },
    useChisel: () => {
        update(game => {
            game.activePlayer.useTool = true;
            game.activePlayer.useToolName = '끌';
            gameStore.refresh(game);
            return game;
        });
    },
    useSail: () => {
        update(game => {
            game.activePlayer.useTool = true;
            game.activePlayer.useToolName = '돛';
            gameStore.refresh(game);
            return game;
        });
    },
    useLever: () => {
        update(game => {
            game.activePlayer.useTool = true;
            game.activePlayer.useToolName = '지렛대';
            gameStore.refresh(game);
            return game;
        });
    },
    load: (boat) => {
        let nextTurn = true;

        update(game => {
            const player = game.activePlayer;
            const stone = player.stoneList.pop();
            stone.color = player.color;
            boat.stoneList = [...boat.stoneList, stone]

            if (player.useTool === true) {
                if (player.useToolName === '망치') {
                    player.useTool = false;
                    player.useToolName = '';
                    player.hammerCount--;
                } else if (player.useToolName === '돛') {
                    game.boatUsingSail = boat;
                    player.loadCount++;
                    nextTurn = false;
                } else if (player.useToolName === '끌') {
                    if (player.loadCount === 0) {
                        player.loadCount++;
                        nextTurn = false;
                    } else if (player.loadCount === 1) {
                        player.chiselCount--;
                        player.loadCount = 0;
                        player.useTool = false;
                        player.useToolName = '';
                    }
                }
            }

            gameStore.refresh(game);

            return game;
        });

        if (nextTurn === true) {
            gameStore.nextTurn();
        }
    },
    currentPlayer: (game) => {
        return game.playerList[game.turn % 2];
    },
    nextTurn: () => {
        update(game => {
            if (game.boatList.filter(boat => !boat.landed).length === 0) {
                game.boatList = gameStore.createBoat();
                game.landList.forEach(land => land.landed = false);
                gameStore.resetItem(game);
            }

            game.turn = game.turn + 1;
            game.playerList = game.playerList.map(player => {
                player.active = game.turn % 2 === player.index;

                if (player.active) {
                    game.activePlayer = player;
                }

                return player;
            });

            gameStore.refresh(game);
            return game;
        });
    },
}

export default gameStore;