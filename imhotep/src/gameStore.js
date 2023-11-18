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
    refresh: (game) => {
        game.boatList = game.boatList.map(boat => {
            boat.canLoad = boat.stoneList.length < boat.maxStone
                && game.activePlayer.stoneList.length > 0;
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