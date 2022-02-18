import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import game from "./game"
import survivorList from "./survivorList";

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

    initRiskCard: function (game) {
        game.riskCardList = game.riskCardList
            .sort((a, b) => 0.5 - Math.random());
    },

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

            if (place.name === game.currentPlaceName) {
                place.activeClassName = 'active';
            } else {
                place.activeClassName = 'inactive';
            }

            place.currentZombieCount = place.entranceList
                .map(entrance => entrance.zombieCount)
                .reduce((a, b) => a + b, 0);

            place.maxZombieCount = place.entranceList
                .map(entrance => entrance.maxZombieCount)
                .reduce((a, b) => a + b, 0);

            place.currentBarricadeCount = place.entranceList
                .map(entrance => entrance.barricadeCount)
                .reduce((a, b) => a + b, 0);

            place.survivorLocationList = [...Array(place.maxSurvivorCount).keys()]
                .map(index => {
                    if (place.survivorList.length > index) {
                        return place.survivorList[index];
                    }

                    return null;
                });

            console.log('>>> place.survivorLocationList', place.survivorLocationList);
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
        return gameStore.getCurrentPlayer().color;
    },

    getPlayerColor: (index) => {
        return get(gameStore).playerList[index].color;
    },

    initCamp: function (game) {
        const survivorList = gameStore.getSurvivorList(game);
        const camp = gameStore.getCamp(game);
        camp.survivorList = survivorList;
        camp.survivorList.forEach(survivor => survivor.place = camp);
    },

    move: (currentSurvivor, placeName) => {
        update(game => {
            game.placeList.forEach(place => {
                if (place.name === placeName) {
                    place.survivorList = [...place.survivorList, currentSurvivor];
                } else {
                    place.survivorList = place.survivorList
                        .filter(survivor => survivor.index !== currentSurvivor.index);
                }
            })

            game.currentSurvivor = currentSurvivor;
            game.currentPlaceName = placeName;
            game.dangerDice= true;
            return game;
        });

        gameStore.updateAll();
    },

    changePlaceByName: (currentPlaceName) => {
        if (currentPlaceName === null) {
            return;
        }

        update(game => {
            game.currentPlaceName = currentPlaceName;
            return game;
        });

        gameStore.updateAll();
    },

    turn: () => {
        update(game => {
            game.turen = game.turn++;
            return game;
        });

        gameStore.updateAll();
    },

    changePlace: (event) => {
        let currentPlaceName = null;

        if (event.keyCode === 49 || event.keyCode === 97) {
            currentPlaceName = '피난기지';
        } else if (event.keyCode === 50 || event.keyCode === 98) {
            currentPlaceName = '경찰서';
        } else if (event.keyCode === 51 || event.keyCode === 99) {
            currentPlaceName = '병원';
        } else if (event.keyCode === 52 || event.keyCode === 100) {
            currentPlaceName = '학교';
        } else if (event.keyCode === 53 || event.keyCode === 101) {
            currentPlaceName = '마트';
        } else if (event.keyCode === 54 || event.keyCode === 102) {
            currentPlaceName = '도서관';
        } else if (event.keyCode === 55 || event.keyCode === 103) {
            currentPlaceName = '주유소';
        }

        gameStore.changePlaceByName(currentPlaceName);
    },

    init: () => update(game => {
        gameStore.initRiskCard(game);
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
            .map(entrance => entrance.zombieCount)
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

    setDisabled: (value) => {
        if (value === true) {
            return '';
        }

        return 'disabled';
    },


    updateSurvivorActionTable: (game) => {
        const currentPlayer = gameStore.getCurrentPlayer(game);

        currentPlayer.survivorList.forEach(survivor => {
            survivor.actionTable = currentPlayer
                .actionDiceList.map(dice => {
                    return {
                        dice: dice,
                        food: !dice.done && !game.dangerDice && dice.power < 6 && gameStore.getCamp(game).foodCount > 0,
                        attack: !dice.done && !game.dangerDice&& survivor.place.currentZombieCount > 0,
                        search: !dice.done && !game.dangerDice&& survivor.place.itemCardList.length > 0,
                        barricade: !dice.done && !game.dangerDice&& survivor.place.maxZombieCount > survivor.place.currentZombieCount + survivor.place.currentBarricadeCount,
                        clean: !dice.done && !game.dangerDice&& survivor.place.name === '피난기지' && survivor.place.trashCount >= 3,
                        invite: !dice.done && !game.dangerDice&& survivor.place.maxZombieCount > survivor.place.currentZombieCount + survivor.place.currentBarricadeCount + 2
                    };
                });
        });

        if (currentPlayer.actionDiceList.filter(dice => dice.done).length === currentPlayer.actionDiceList.length) {
            game.canTurn = true;
        }

        return game;
    },

    isCurrentPlayerOfSurvivor: (currentSurvivor) => {
        return gameStore.getCurrentPlayer()
            .survivorList
            .filter(survivor => survivor.name === currentSurvivor.name)
            .length > 0;
    },

    updateActionTable: (game) => {
        const currentPlayer = gameStore.getCurrentPlayer(game);

        currentPlayer.actionTable = currentPlayer.actionDiceList
            .map(dice => {
                return {
                    power: dice.power,
                    attackSurvivorList: currentPlayer.survivorList
                            .filter(survivor => dice.done === false)
                            .filter(survivor => survivor.attack <= dice)
                            .filter(survivor => survivor.place.currentZombieCount > 0),
                    searchSurvivorList: currentPlayer.survivorList
                            .filter(survivor => dice.done === false)
                            .filter(survivor => survivor.search >= dice)
                            .filter(survivor => survivor.place.itemCardList.length > 0),
                    barricadeSurvivorList: currentPlayer.survivorList
                            .filter(survivor => dice.done === false)
                            .filter(survivor => {
                                console.log('>>> survivor', survivor);
                                return survivor.place.maxZombieCount >= survivor.place.currentZombieCount + survivor.place.currentBarricadeCount + 1;
                            }),
                    trashSurvivorList: currentPlayer.survivorList
                            .filter(survivor => dice.done === false)
                            .filter(survivor => survivor.place.name === '피난기지')
                            .filter(survivor => survivor.place.trashCount > 0),
                    inviteZombieSurvivorList: currentPlayer.survivorList
                            .filter(survivor => dice.done === false)
                            .filter(survivor => survivor.place.maxZombieCount >= survivor.place.currentZombieCount + survivor.place.currentBarricadeCount + 2)
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
        gameStore.updateSurvivorActionTable(game);

        return game;
    }),

    plusPower: (currentPlace, actionIndex) => {
        update(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);
            currentPlayer.actionDiceList[actionIndex].power++;
            gameStore.getCamp(game).foodCount--;
            return game;
        });

        gameStore.updateAll();
    },

    attack: (currentSurvivor, currentPlace, actionIndex) => {
        update(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);
            currentPlayer.actionDiceList[actionIndex].done = true;

            const currentEntrance = currentPlace.entranceList
                .filter(entrance => entrance.zombieCount > 0)
                .sort((a, b) => Math.random() - 0.5)[0];

            currentEntrance.zombieCount--;
            game.deadZombieCount++;
            game.dangerDice = true;
            game.currentSurvivor = currentSurvivor;

            return game;
        });

        gameStore.updateAll();
    },

    createBarricade: (currentPlace, actionIndex) => {
        update(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);
            currentPlayer.actionDiceList[actionIndex].done = true;

            const currentEntrance = currentPlace.entranceList
                .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                .sort((a, b) => Math.random() - 0.5)[0];

            currentEntrance.barricadeCount = currentEntrance.barricadeCount + 1;

            return game;
        });

        gameStore.updateAll();
    },

    inviteZombie: (currentPlace, actionIndex) => {
        update(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);
            console.log('>>> currentPlayer', currentPlayer);
            console.log('>>> actionIndex', actionIndex);
            currentPlayer.actionDiceList[actionIndex].done = true;

            for (let i = 0; i < 2; i++) {
                const currentEntrance = currentPlace.entranceList
                    .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                    .sort((a, b) => Math.random() - 0.5)[0];

                currentEntrance.zombieCount = currentEntrance.zombieCount + 1;
            }

            return game;
        });

        gameStore.updateAll();
    },

    choiceRiskCard: () => {
        console.log('>>> choiceRiskCard');

        update(game => {
            game.currentRiskCard = game.riskCardList.pop();
            game.riskCardList = [...game.riskCardList, game.currentRiskCard];

            if (game.turn % 20 === 0) {
                gameStore.initRiskCard(game);
            }

            game.riskCard = false;
            game.rollDice = true;
            return game;
        });

        gameStore.updateAll();
    },

    rollActionDice: () => {
        update(game => {
            const player = gameStore.getCurrentPlayer(game);

            player.actionDiceList = [...Array(player.survivorList.length + 1).keys()]
                .map(i => {
                    return {
                        power: 1 + Math.floor(Math.random() * 6),
                        done: false
                    };

                })
                .sort((a, b) => b.power - a.power);

            game.rollDice = false;
            game.canTurn = false;
            return game;
        });

        gameStore.updateAll();
    },

    dead: () => {
        let oldMoral = 0;
        let newMoral = 0;
        let currentSurvivorName = '';

        update(game => {
            game.deadSurvivorCount++;
            game.placeList.forEach(place => {
                place.survivorList = place.survivorList
                    .filter(survivor => survivor !== game.currentSurvivor)
            })

            oldMoral = game.moral;
            game.moral--;
            newMoral = game.moral;

            currentSurvivorName = game.currentSurvivor.name;
            game.currentSurvivor = null;

            return game;
        });

        alert(`${currentSurvivorName} 죽었습니다.`);
        alert(`사기가 ${oldMoral}에서 ${newMoral}로 떨어졌습니다.`);
    },

    wound: () => {
        update(game => {
            game.currentSurvivor.wound++;

            alert(get(gameStore).currentSurvivor.name + ' 부상을 입었습니다.');

            if (game.currentSurvivor.wound >= 3) {
                alert(get(gameStore).currentSurvivor.name + ' 부상을 3차례 입었습니다.');
                gameStore.dead();
            }

            game.currentSurvivor = null;
            return game;
        });
    },

    rollDangerActionDice: () => {
        update(game => {
            // const dangerDice = ['','','','','','','부상','부상','부상','부상','부상', '연쇄물림']
            const dangerDice = ['연쇄물림']
            const result = dangerDice.sort((a, b) => Math.random() - 0.5).pop();

            if (result === '') {
                alert('아무런 일이 일어나지 않았습니다.');
            } else if (result === '부상') {
                alert('부상을 당하였습니다.');
                gameStore.wound();
            } else if (result === '연쇄물림') {
                alert('연쇄물림이 발생하였습니다.');
                gameStore.dead();
            }

            game.dangerDice = false;
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
    },

    canUseAbility: (survivor) => {
        const currentPlace = survivor.place;
        const currentPlaceName = currentPlace.name;
        const placeNameList = survivor.ability.placeNameList;
        const currentPlayer = gameStore.getCurrentPlayer();

        if (survivor.ability.type === 'killZombie') {
            if (placeNameList.find(name => name === currentPlaceName)) {
                return currentPlace.currentZombieCount > 0;
            }

            return false;
        } else if (survivor.ability.type === 'get') {
            if (placeNameList.find(name => name === currentPlaceName)) {
                return currentPlace.itemCardList.length > 0;
            }

            return false;
        } else if (survivor.ability.type === 'plusPower') {
            if (currentPlayer.actionTable) {
                const diceCount = currentPlayer.actionDiceList
                    .filter(dice => dice.power <= 5)
                    .filter(dice => dice.done === false).length;

                return true;
            }

            return false;
        } else if (survivor.ability.type === 'move') {
            return get(gameStore).placeList
                .filter(place => place.name !== survivor.place.name)
                .filter(place => place.maxSurviveCount > place.survivorList.length)
                .length > 0
        } else if (survivor.ability.type === 'care') {
            return currentPlace.survivorList
                .filter(survivor => survivor.wound > 0)
                .length > 0;
        } else if (survivor.ability.type === 'food') {
            return true;
        } else if (survivor.ability.type === 'plusMoral') {
            return true;
        } else if (survivor.ability.type === 'rescue') {
            return currentPlace.itemCardList
                .filter(item => item.name.startsWith("외부인")).length > 0;
        } else if (survivor.ability.type === 'clean') {
            return true;
        } else if (survivor.ability.type === 'barricade') {
            return currentPlace.maxZombieCount >
                currentPlace.currentZombieCount + currentPlace.currentBarricadeCount;
        }
    },

    getPlaceClassName: (currentPlace) => {
        if (currentPlace.name === get(gameStore).currentPlaceName) {
            return "current-place";
        }

        return '';
    }
}

gameStore.init();

export default gameStore;