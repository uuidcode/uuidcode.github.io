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

            gameStore.refresh(game);

            return game;
        });
    },
    getStone: (player) => {
        update(game => {
            const stoneCount = Math.min(5 - game.activePlayer.stoneList.length, 3);
            player.stoneList = player.stoneList.concat(gameStore.createStoneList(game, player, stoneCount));
            return game;
        });

        gameStore.nextTurn();
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
                landed: false,
                maxStone,
                minStone,
                stoneList: []
            });
        }

        return boatList;
    },
    getMarket: () => {
        return get(gameStore).landList[0];
    },
    getTomb: () => {
        return get(gameStore).landList[1];
    },
    getPyramid: () => {
        return get(gameStore).landList[2];
    },
    getWall: () => {
        return get(gameStore).landList[3];
    },
    getObelisk: () => {
        return get(gameStore).landList[4];
    },
    move : (boat, land) => {
        update(game => {
            const top = 150 * land.index - boat.element.offsetTop + 20;
            boat.style = `transform: translate(400px, ${top}px)`
            land.landed = true;
            boat.landed = true;
            gameStore.refresh(game);
            return game;
        });

        if (land.index === 4) {
            setTimeout(() => {
                update(game => {
                    boat.stoneList.forEach(stone => {
                        game.playerList[stone.playerIndex].obeliskStoneCount++;
                    });

                    boat.stoneList = [];
                    gameStore.refresh(game);
                    return game;
                });
            }, 1000);
        }
    },
    refresh: (game) => {
        game.boatList = game.boatList.map(boat => {
            boat.canLoad = boat.stoneList.length < boat.maxStone
                && game.activePlayer.stoneList.length > 0
                && boat.landed === false;

            const canMove = boat.stoneList.length >= boat.minStone
                && boat.landed === false;

            boat.canMoveToMarket = canMove && gameStore.getMarket().landed === false;
            boat.canMoveToPyramid = canMove && gameStore.getPyramid().landed === false;
            boat.canMoveToTomb = canMove && gameStore.getTomb().landed === false;
            boat.canMoveToWall = canMove && gameStore.getWall().landed === false;
            boat.canMoveToObelisk = canMove && gameStore.getObelisk().landed === false;
            return boat;
        });

        game.playerList = game.playerList.map(player => {
            player.canGet = player.active && player.stoneList.length <= 4;
            return player;
        });
    },
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