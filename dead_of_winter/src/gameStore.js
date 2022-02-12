import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import game from "./game"

const { subscribe, set, update } = writable(game);

let gameStore = {
    subscribe,
    set,
    update
};

gameStore = {
    ...gameStore,
    plusRound: () => update(game => {
        game.round = game.round + 1;
        return game;
    }),

    minusRound: () => update(game => {
        game.round = game.round - 1;
        return game;
    }),

    plusMoral: () => update(game => {
        game.moral = game.moral + 1;
        return game;
    }),

    minusMoral: () => update(game => {
        game.moral = game.moral - 1;
        return game;
    }),

    initItemCard: function (game) {
        game.playerList.forEach(player => {
            player.itemCardList = game.initItemCardList
                .sort((a, b) => 0.5 - Math.random())
                .slice(0, 7)
                .map(name => game.itemCardList.find(item => item.name === name));
        });

        gameStore.updateSurvivor(game);
    },

    initSurvivor: function (game) {
        game.playerList.forEach(player => {
            game.survivorList
                .sort((a, b) => 0.5 - Math.random());

            const survivorList = [];

            for (let i = 0; i < 4; i++) {
                survivorList.push(game.survivorList.pop());
            }

            survivorList.sort((a, b) => b.power - a.power);

            player.survivorList = survivorList;

            game.survivorList = [...game.survivorList];
        });

        gameStore.updateSurvivor(game);
    },

    init: () => update(game => {
        gameStore.initItemCard(game);
        gameStore.initSurvivor(game);
        return game;
    }),

    updateSurvivor: game => {
        game.survivorCount = game.playerList
            .map(player => player.survivorList.length)
            .reduce((a, b) => a + b, 0);
    },

    updateItemCard: game => {
        game.itemCardCount = game.playerList
            .map(player => player.itemCardList.length)
            .reduce((a, b) => a + b, 0);
    },

    updateItemCardTable: game => {
        game.playerList.forEach(player => {
            player.itemCardTable = player.itemCardList
                .reduce((previousValue, itemCard) => {
                    const row = previousValue.find(value => value.name === itemCard.name);

                    if (row) {
                        row.count++;
                    } else {
                        previousValue.push({
                            name: itemCard.name,
                            description: itemCard.description,
                            category: itemCard.category,
                            count: 1
                        });
                    }

                    return previousValue;
                }, [])
                .sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    }

                    if (a.name < b.name) {
                        return -1;
                    }

                    return 0;
                });

            console.log('>>> player.itemCardTable', player.itemCardTable);
        });
    },

    updateAll: () => update(game => {
        game.survivorCount = game.placeList
            .map(player => player.survivorIndexList.length)
            .reduce((a, b) => a + b, 0);

        gameStore.updateItemCardTable(game);
        gameStore.updateSurvivor(game);
        gameStore.updateItemCard(game);

        return game;
    })
}

gameStore.init();

export default gameStore;