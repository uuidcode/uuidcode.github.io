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
    },

    getPlayerColorForSurvivor: (survivor) => {
        return get(gameStore).playerList
            .find(player => player.index === survivor.playerIndex)
            .color;
    },

    initSurvivor: function (game) {
        game.playerList.forEach((player, playerIndex) => {
            game.survivorList
                .sort((a, b) => 0.5 - Math.random());

            const survivorList = [];

            for (let i = 0; i < 4; i++) {
                const survivor = game.survivorList.pop();
                survivor.playerIndex = playerIndex;
                survivorList.push(survivor);
            }

            survivorList.sort((a, b) => a.index - b.index);

            player.survivorList = survivorList;

            game.survivorList = [...game.survivorList];
        });
    },

    updatePlace: function (game) {
        game.placeList.forEach(place => {
            const currentSurvivorList = [...place.survivorList];

            place.currentZombieCount = place.entranceList
                .map(entrance => entrance.currentZombieCount)
                .reduce((a, b) => a + b, 0);

            place.maxZombieCount = place.entranceList
                .map(entrance => entrance.maxZombieCount)
                .reduce((a, b) => a + b, 0);

            place.currentBarricadeCount = place.entranceList
                .map(entrance => entrance.barricadeCount)
                .reduce((a, b) => a + b, 0);

            place.survivorLocationList = place.entranceList
                .map(entrance => {
                    return [...Array(entrance.maxZombieCount).keys()]
                        .map(i => {
                            const survivor = currentSurvivorList.shift();

                            if (survivor) {
                                survivor.place = place;

                                if (survivor.active) {
                                    place.activeSurvivor = survivor;
                                }
                            }

                            return survivor;
                        });
                });
        });
    },

    getCamp: (game) => {
        return game.placeList.find(place => place.name === '피난기지');
    },

    getSurvivorList: (game) => {
        return game.playerList.flatMap(player => player.survivorList);
    },

    getCurrentPlayer: (game) => {
        game = game ?? get(gameStore);
        const playerList = game.playerList;
        return playerList[game.turn % 2];
    },

    getCurrentPlayerColor: () => {
        return get(gameStore).getCurrentPlayer().color;
    },

    getPlayerColor: (index) => {
        return get(gameStore).playerList[index].color;
    },

    initCamp: function (game) {
        const survivorList = gameStore.getSurvivorList(game);
        const camp = gameStore.getCamp(game);
        camp.survivorList = survivorList;
    },

    init: () => update(game => {
        gameStore.initItemCard(game);
        gameStore.initSurvivor(game);
        gameStore.initCamp(game);

        return game;
    }),

    updateSurvivor: game => {
        game.survivorCount = game.playerList
            .map(player => player.survivorList.length)
            .reduce((a, b) => a + b, 0);

        game.playerList = game.playerList.map(player => {
            player.active = false;
            return player;
        });
    },

    updateZombie: game => {
        game.zombieCount = game.placeList
            .flatMap(player => player.entranceList)
            .map(entrance => entrance.currentZombieCount)
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
        });
    },

    updateSurvivorCount: game => {
        game.survivorCount = game.placeList
            .map(player => player.survivorList.length)
            .reduce((a, b) => a + b, 0);
    },

    updateActionTable: (game) => {
        const currentPlayer = gameStore.getCurrentPlayer(game);

        currentPlayer.actionTable = currentPlayer.actionDiceList
            .map(dice => {
                return {
                    dice,
                    attackSurvivorList: currentPlayer.survivorList
                        .filter(survivor => survivor.attack <= dice)
                        .filter(survivor => survivor.place.currentZombieCount > 0),
                    searchSurvivorList: currentPlayer.survivorList
                        .filter(survivor => survivor.search >= dice)
                        .filter(survivor => survivor.place.cardList.length > 0),
                    barricadeSurvivorList: currentPlayer.survivorList
                        .filter(survivor => survivor.place.maxZombieCount > survivor.place.currentZombieCount),
                    trashSurvivorList: currentPlayer.survivorList
                        .filter(survivor => survivor.place.name === '피난기지')
                        .filter(survivor => survivor.place.trashCount > 0),
                    inviteZombieSurvivorList: currentPlayer.survivorList
                        .filter(survivor => survivor.place.maxZombieCount > survivor.place.currentZombieCount + survivor.place.currentBarricadeCount)
                }
            });
    },

    updateAll: () => update(game => {
        gameStore.updateSurvivorCount(game);
        gameStore.updateItemCardTable(game);
        gameStore.updateSurvivor(game);
        gameStore.updateItemCard(game);
        gameStore.updateZombie(game);
        gameStore.updatePlace(game);
        gameStore.updateActionTable(game);

        return game;
    }),

    rollActionDice: () => {
        update(game => {
            const player = game.playerList[game.turn % 2];

            player.actionDiceList = player.actionDiceList
                .map(i => 1 + Math.floor(Math.random() * 6))
                .sort((a, b) => b - a);

            return game;
        });

        gameStore.updateAll();
    },

    drag: (event, survivorIndex, oldPlaceName) => {
        const data = {
            survivorIndex,
            oldPlaceName
        };

        event.dataTransfer.setData('text/plain', JSON.stringify(data));
    },

    drop: (event, newPlaceName) => {
        update(game => {
            event.preventDefault();
            const json = event.dataTransfer.getData("text/plain");
            const data = JSON.parse(json);
            const {survivorIndex, oldPlaceName} = data;

            const oldPlace = game.placeList.find(place => place.name === oldPlaceName);
            const newPlace = game.placeList.find(place => place.name === newPlaceName);

            console.log('>>> oldPlace', oldPlace);
            console.log('>>> newPlace', newPlace);

            let currentSurvivor = null;

            oldPlace.survivorList = oldPlace.survivorList
                .filter(survivor => {
                    if (survivor.index === survivorIndex) {
                        currentSurvivor = survivor;
                        return false;
                    }

                    return true;
                });

            newPlace.survivorList = [...newPlace.survivorList, currentSurvivor];
            currentSurvivor.place = newPlace;

            return game;
        });

        gameStore.updateAll();
    }
}

gameStore.init();


export default gameStore;