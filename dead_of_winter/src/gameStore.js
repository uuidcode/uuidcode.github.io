import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import game from "./game"

const { subscribe, set, update } = writable(game);

const gameStore = {
    subscribe,
    set,
    update,

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

    updateAll: () => update(game => {
        game.survivorCount = game.placeList
            .map(player => player.survivorIndexList.length)
            .reduce((a, b) => a + b, 0);

        game.playerList.forEach(player => {
            player.itemCardTable = player.itemCardList
                .reduce((previousValue, currentValue) => {
                    const row = previousValue.find(value => value.name === currentValue);

                    if (row) {
                        row.count++;
                    } else {
                        previousValue.push({
                            name: currentValue,
                            description: game.itemCardList
                                .find(item => item.name === currentValue).description,
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

        return game;
    })
}

export default gameStore;