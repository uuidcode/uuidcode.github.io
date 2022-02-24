import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import game from "./game"
import survivorList from "./survivorList";
import placeList from "./placeList";

const { subscribe, set, update } = writable(game);

let gameStore = {
    subscribe,
    set,
    update
};

gameStore = {
    ...gameStore,
    plusRound: () => {
        update(game => {
            game.round++;
            return game;
        });

        gameStore.updateAll();
    },

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
                .map(name => gameStore.createNewItemCard(name));
        });

        game.placeList.forEach(place => {
            place.itemCardList = place.itemCardList
                .sort((a, b) => 0.5 - Math.random());
        });
    },

    createNewItemCard: (name) => {
        let itemCard = game.itemCardList.find(item => item.name === name);

        return {
            ...itemCard
        };
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
            if (place.name === '피난기지') {
                place.trashCount = place.trashList.length;
            }

            place.survivorList.sort((a, b) => a.playerIndex - b.playerIndex);

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

        camp.foodList = [...Array(camp.foodCount).keys()]
            .map(index => game.campFoodIndex++);

        // camp.trashList = [...Array(camp.trashCount).keys()]
        //     .map(index => game.campTrashIndex++);

        camp.trashList = [];
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
            game.currentSurvivor.place = game.placeList.find(place => place.name === placeName);
            game.currentPlaceName = placeName;

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

    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    },

    showMessage: async (messageList) => {
        update(game => {
            game.messageList = messageList;
            return game;
        });

        await gameStore.sleep(2000);
    },

    showToastMessage: async (message) => {
        update(game => {
            game.toastMessage = message;
            return game;
        });

        await gameStore.sleep(2000);

        update(game => {
            game.toastMessage = null;
            return game;
        });
    },

    processFood: (messageList) => {
        const game = get(gameStore);
        const camp = gameStore.getCamp(game);

        if (camp.survivorList.length >= 2) {
            const foodCount = camp.survivorList.length / 2;

            if (foodCount > camp.foodCount) {
                update(game => {
                    camp.starvingTokenCount++;
                    return game;
                });

                gameStore.updateAll();

                messageList.push(`식량이 부족하여 굶주림 토큰이 추가되었습니다.`);
            } else {
                for (let i = 0; i < foodCount; i++) {
                    update(game => {
                        const camp = gameStore.getCamp(game);
                        gameStore.removeFood(camp);
                        return game;
                    });

                    gameStore.updateAll();
                }

                messageList.push(`식량을 ${foodCount}개 소모합니다.`);
            }

            gameStore.showMessage(messageList);
        }
    },

    processTrash: (messageList) => {
        const game = get(gameStore);
        const camp = gameStore.getCamp(game);

        if (camp.trashList.length < 10) {
            return;
        }

        const minusMoral = camp.trashList.length / 10;
        messageList.push(`쓰레기가 ${camp.trashList.length}에서 ${camp.trashList.length - (minusMoral * 10)}로 줄어들었으며 사기는 ${minusMoral} 하락합니다.`);
        gameStore.showMessage(messageList);

        update(game => {
            for (let i = 0; i < minusMoral; i++) {
                gameStore.minusMoral(game);
            }

            const currentCamp = gameStore.getCamp(game);

            for (let i = 0; i < minusMoral * 10; i++) {
                currentCamp.trashList.pop();
            }

            return game;
        });

        gameStore.updateAll();
    },

    processRisk: (messageList) => {
        const game = get(gameStore);

        if (game.successRiskCardList.length < 2) {
            messageList.push('위기상황을 해결하지 못하였습니다.');
            gameStore.showMessage(messageList);

            game.currentRiskCard.condition.fail.actionList.forEach(action => {
                if (action.name === 'minusMoral') {
                    for (let i = 0; i < action.targetCount; i++) {
                        gameStore.minusMoral();
                    }

                    messageList.push(`사기 ${action.targetCount} 하락합니다.`);
                    gameStore.showMessage(messageList);
                } else if (action.name === 'zombie') {
                    action.placeList
                        .map(placeName => game.placeList
                            .filter(place => place.name === placeName))
                        .forEach(place => {
                            gameStore.inviteZombie(place, undefined, action.targetCount);
                            messageList.push(`좀비가 ${place.name}에 ${action.targetCount}구 나타났습니다.`);
                            gameStore.showMessage(messageList);
                        });
                } else if (action.name === 'wound') {
                    const survivorList = game.playerList
                        .flatMap(player => player.survivorList)
                        .sort((a, b) => Math.random() - 0.5);

                    for (let i = 0; i < action.targetCount; i++) {
                        const survivor = survivorList.pop();

                        update(game => {
                            game.currentSurvivor = survivor;
                            return game;
                        });

                        gameStore.wound(messageList);
                    }
                } else if (action.name === 'barricade') {
                    gameStore.removeAllBarricade(messageList);
                } else if (action.name === 'dead') {
                    const survivorList = game.playerList
                        .flatMap(player => player.survivorList)
                        .sort((a, b) => Math.random() - 0.5);

                    for (let i = 0; i < action.targetCount; i++) {
                        const survivor = survivorList.pop();

                        update(game => {
                            game.currentSurvivor = survivor;
                            return game;
                        });

                        gameStore.dead(false, messageList);
                    }
                } else if (action.name === 'food') {
                    for (let i = 0; i < action.targetCount; i++) {
                        update(game => {
                            const camp = gameStore.getCamp(game);
                            gameStore.removeFood(camp);
                            return game;
                        });
                    }

                    messageList.push(`피난기지의 식량 ${action.targetCount}개가 제거되었습니다.`);
                    gameStore.showMessage(messageList);
                }
            });
        } else {
            messageList.push('위기상황을 해결하였습니다.');
            gameStore.showMessage(messageList);
        }

        update(game => {
            game.successRiskCardList = [];
            return game;
        });

        gameStore.updateAll();
    },

    turn: () => {
        update(game => {
            game.currentPlayer.actionTable = [];

            game.survivorList.forEach(survivor => survivor.actionTable = []);

            game.placeList.forEach(place => {
                place.survivorList.forEach(survivorList => survivorList.actionTable = []);
            });

            game.playerList.forEach(player => player.actionDiceList = []);

            game.turn++;
            game.canAction = false;
            game.canTurn = false;
            game.rollDice = true;

            return game;
        });

        gameStore.updateAll();

        const turn = get(gameStore).turn;

        if (turn > 0 && turn % 2 === 0) {
            const messageList = [];
            gameStore.processFood(messageList);
            gameStore.processTrash(messageList)
            gameStore.processRisk(messageList);
            gameStore.showZombie(messageList)
            gameStore.plusRound();
        }
    },

    removeAllBarricade: (messageList) => {
        update(game => {
            game.placeList
                .flatMap(place => place.entranceList)
                .forEach(entrance => {
                    entrance.barricadeCount = 0;
                })
            return game;
        });

        gameStore.updateAll();

        messageList.push('바라케이트가 제거되었습니다.');
        gameStore.showMessage(messageList);
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
        game.playerList.forEach(player => {
            player.survivorList = game.placeList
                .flatMap(place => place.survivorList)
                .filter(survivor => survivor.playerIndex === player.index);

            game.placeList
                .flatMap(place => place.survivorList)
                .forEach(survivor => {
                    survivor.woundList = [...Array(survivor.wound).keys()];
                })
        });

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

        let itemCardIndex = 0;

        game.playerList.forEach(player => {
            player.itemCardList.forEach(itemCard => {
                itemCard.index = itemCardIndex++;
            });

            game.playerList.forEach(player => {
                player.itemCardList.forEach(itemCard => {
                    itemCard.canAction = false;
                    itemCard.canPreventRisk = false;
                })
            });

            game.currentPlayer.itemCardList.forEach((itemCard) => {
                itemCard.canAction = game.canAction === true &&
                    game.selectedItemCardFeature === itemCard.feature;
            });

            if (game.currentRiskCard) {
                game.currentPlayer.itemCardList.forEach((itemCard) => {
                    itemCard.canPreventRisk =
                        game.dangerDice === false &&
                        game.selectedItemCardFeature === null &&
                        game.successRiskCardList.length < 2 &&
                        game.canAction &&
                        game.currentRiskCard.condition.itemCardList
                            .filter(name => name === itemCard.category)
                            .length > 0;
                });
            }
        })
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

        if (game.survivorCount === 0) {
            alert('실패');
        }
    },

    setDisabled: (value) => {
        if (value === true) {
            return '';
        }

        return 'disabled';
    },

    updateSurvivorActionTable: (game) => {
        const currentPlayer = gameStore.getCurrentPlayer(game);
        const camp = gameStore.getCamp(game);

        currentPlayer.survivorList.forEach(survivor => {
            let currentPlace = survivor.place;

            survivor.actionTable = currentPlayer
                .actionDiceList.map(dice => {
                    const attackItemList = currentPlayer.itemCardList
                        .filter(itemCard => itemCard.feature === 'attack')
                        .filter(itemCard => currentPlace.maxZombieCount > currentPlace.currentZombieCount + currentPlace.currentBarricadeCount)
                        .filter(itemCard => currentPlace.currentZombieCount > 0)

                    const searchItemList = currentPlayer.itemCardList
                        .filter(itemCard => itemCard.feature === 'search')
                        .filter(itemCard => currentPlace.itemCardList.length > 0)
                        .filter(itemCard => itemCard.placeList.filter(placeName => placeName === currentPlace.name).length > 0);

                    const careItemList =  currentPlayer.itemCardList
                        .filter(itemCard => itemCard.feature === 'care')
                        .filter(itemCard => survivor.wound > 0)

                    const foodItemList = currentPlayer.itemCardList
                        .filter(itemCard => itemCard.feature === 'food')

                    const barricadeItemList = currentPlayer.itemCardList
                        .filter(itemCard => itemCard.feature === 'barricade')
                        .filter(itemCard => currentPlace.maxZombieCount > currentPlace.zombieCount + currentPlace.barricadeCount)

                    return {
                        dice: dice,
                        ability: game.selectedItemCardFeature === null && !dice.done && !game.dangerDice && gameStore.canUseAbility(survivor),
                        food: game.selectedItemCardFeature === null && !dice.done && !game.dangerDice && dice.power < 6 && gameStore.getCamp(game).foodCount > 0,
                        attack: game.selectedItemCardFeature === null &&
                            !dice.done && !game.dangerDice &&
                            dice.power >= survivor.attack  &&
                            currentPlace.currentZombieCount > 0,
                        search: game.selectedItemCardFeature === null &&
                            dice.power >= survivor.search &&
                            !dice.done &&
                            !game.dangerDice &&
                            currentPlace.itemCardList.length > 0,
                        barricade: game.selectedItemCardFeature === null &&!dice.done && !game.dangerDice && currentPlace.maxZombieCount > currentPlace.currentZombieCount + currentPlace.currentBarricadeCount,
                        clean: game.selectedItemCardFeature === null &&!dice.done && !game.dangerDice && currentPlace.name === '피난기지' && currentPlace.trashCount > 0,
                        invite: game.selectedItemCardFeature === null &&
                            !dice.done && !game.dangerDice &&
                            currentPlace.maxZombieCount >= currentPlace.currentZombieCount + currentPlace.currentBarricadeCount + 2,
                        move: game.selectedItemCardFeature === null &&!dice.done && currentPlayer.itemCardList.filter(itemCard => itemCard.feature === 'safeMove'),
                        itemFood: game.selectedItemCardFeature === null &&!dice.done && !game.dangerDice && dice.power < 6 &&
                            currentPlayer.itemCardList.filter(itemCard => itemCard.feature === 'power').length > 0,
                        attackItemList,
                        searchItemList,
                        careItemList,
                        foodItemList,
                        barricadeItemList
                    };
                });

            const attackItemList = currentPlayer.itemCardList
                .filter(itemCard => itemCard.feature === 'attack')
                .filter(itemCard => currentPlace.maxZombieCount > currentPlace.currentZombieCount + currentPlace.currentBarricadeCount)
                .filter(itemCard => currentPlace.currentZombieCount > 0);

            const searchItemList = currentPlayer.itemCardList
                .filter(itemCard => itemCard.feature === 'search')
                .filter(itemCard => currentPlace.itemCardList.length > 0)
                .filter(itemCard => itemCard.placeList.filter(placeName => placeName === currentPlace.name).length > 0);

            const careItemList =  currentPlayer.itemCardList
                .filter(itemCard => itemCard.feature === 'care')
                .filter(itemCard => survivor.wound > 0)

            const cleanItemList =  currentPlayer.itemCardList
                .filter(itemCard => itemCard.feature === 'clean')
                .filter(itemCard => camp.trashCount > 0)

            const foodItemList = currentPlayer.itemCardList
                .filter(itemCard => itemCard.feature === 'food')

            const barricadeItemList = currentPlayer.itemCardList
                .filter(itemCard => itemCard.feature === 'barricade')
                .filter(itemCard => {
                    return currentPlace.entranceList
                        .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                        .length > 0
                });

            survivor.actionItemCard = {
                attack: game.selectedItemCardFeature === null && attackItemList.length > 0,
                search: game.selectedItemCardFeature === null && searchItemList.length > 0,
                care: game.selectedItemCardFeature === null && careItemList.length > 0,
                food: game.selectedItemCardFeature === null && foodItemList.length > 0,
                barricade: game.selectedItemCardFeature === null && barricadeItemList.length > 0,
                clean: game.selectedItemCardFeature === null && cleanItemList.length > 0
            };

            survivor.actionItemCard.enabled = Object.values(survivor.actionItemCard)
                .filter(item => item).length > 0;

            survivor.targetPlaceList = game.placeList
                .map(place => {
                    return {
                        ...place,
                        disabled: false
                    }
                })
                .map(targetPlace => {
                    targetPlace.disabled = game.dangerDice ||
                        currentPlace.name === targetPlace.name ||
                        targetPlace.survivorList.length >= targetPlace.maxSurvivorCount;

                    return targetPlace;
                })
        });

        const doneLength = currentPlayer.actionDiceList.filter(dice => dice.done).length;

        if (doneLength !== 0 &&
            doneLength === currentPlayer.actionDiceList.length &&
            game.dangerDice === false) {
            game.canTurn = true;
        }

        game.actionTable = [
            {
                name: '공격',
                dice: true,
                count: currentPlayer.survivorList
                    .filter(survivor => survivor.actionTable.filter(action => action.attack).length > 0)
                    .length
            },
            {
                name: '검색',
                dice: true,
                count: currentPlayer.survivorList
                    .filter(survivor => survivor.actionTable.filter(action => action.search).length > 0)
                    .length
            },
            {
                name: '바리게이트',
                dice: true,
                count: currentPlayer.survivorList
                    .filter(survivor => survivor.actionTable.filter(action => action.barricade).length > 0)
                    .length
            },
            {
                name: '청소',
                dice: true,
                count: currentPlayer.survivorList
                    .filter(survivor => survivor.actionTable.filter(action => action.clean).length > 0)
                    .length
            },
            {
                name: '유인',
                dice: true,
                count: currentPlayer.survivorList
                    .filter(survivor => survivor.actionTable.filter(action => action.invite).length > 0)
                    .length
            },
            {
                name: '식사',
                dice: false,
                count: currentPlayer.survivorList
                    .filter(survivor => survivor.actionTable.filter(action => action.food).length > 0)
                    .length
            }
        ];

        return game;
    },

    isCurrentPlayerOfSurvivor: (currentSurvivor) => {
        return gameStore.getCurrentPlayer()
            .survivorList
            .filter(survivor => survivor.name === currentSurvivor.name)
            .length > 0;
    },

    check: (game) => {
        if (game.moral === 0 || game.round === 0) {
            alert('실패');
        }
    },

    updateAll: () => update(game => {
        gameStore.check(game);
        game.currentPlayer = game.playerList[game.turn % 2];
        gameStore.updateSurvivorCount(game);
        gameStore.updateItemCardTable(game);
        gameStore.updateSurvivor(game);
        gameStore.updateItemCard(game);
        gameStore.updateZombie(game);
        gameStore.updatePlace(game);
        gameStore.updateSurvivorActionTable(game);

        return game;
    }),

    plusPower: (currentSurvivor, currentPlace, actionIndex) => {
        update(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);
            currentPlayer.actionDiceList[actionIndex].power++;

            const camp = gameStore.getCamp(game);

            gameStore.removeFood(camp, currentSurvivor);
            return game;
        });

        gameStore.updateAll();
    },

    removeFood: (camp, survivor) => {
        const food = camp.foodList.pop();
        camp.foodList = [...camp.foodList];
        camp.foodCount = camp.foodList.length;

        if (survivor !== undefined) {
            survivor.foodList = [...survivor.foodList, food];
        }
    },

    addFood: (game, camp, targetCount) => {
        for (let i = 0; i < targetCount; i++) {
            camp.foodList.push(game.campFoodIndex++);
        }

        camp.foodCount = camp.foodList.length;
    },

    selectItemCard: (currentPlace, actionIndex) => {
        update(game => {
            game.selectedItemCardFeature = 'power';
            game.selectedActionIndex = actionIndex;
            return game;
        });

        gameStore.updateAll();
    },

    selectItemCardWithoutDice: (currentPlace, survivor, feature) => {
        update(game => {
            game.currentPlace = currentPlace;
            game.selectedItemCardFeature = feature;
            game.currentSurvivor = survivor
            return game;
        });

        gameStore.updateAll();
    },

    preventRisk: (currentItemCard) => {
        update(game => {
            game.currentPlayer.itemCardList = game.currentPlayer.itemCardList
                .filter(itemCard => itemCard.index !== currentItemCard.index)

            game.successRiskCardList = [...game.successRiskCardList, currentItemCard];

            return game;
        });

        gameStore.updateAll();
    },

    search: (game, currentPlace, actionIndex) => {
        if (game === null) {
            update(game => {
                gameStore.searchInternal(game, currentPlace, actionIndex);
                return game;
            });

            gameStore.updateAll();
        } else {
            gameStore.searchInternal(game, currentPlace, actionIndex);
        }
    },

    searchInternal: (game, currentPlace, actionIndex) => {
        const itemCardName = currentPlace.itemCardList.pop();
        const newItemCard = gameStore.createNewItemCard(itemCardName);

        if (newItemCard.category === '외부인') {
            alert(`외부인 ${newItemCard.targetCount}명을 피난기지에 합류합니다.`);

            for (let i = 0; i < newItemCard.targetCount; i++) {
                const newSurvivor = game.survivorList.pop();
                newSurvivor.playerIndex = game.currentPlayer.index;
                newSurvivor.place = gameStore.getCamp(game);

                game.placeList
                    .find(place => place.name === '피난기지')
                    .survivorList
                    .push(newSurvivor);
            }
        } else {
            game.currentPlayer.itemCardList = [newItemCard, ...game.currentPlayer.itemCardList];
        }

        if (actionIndex !== undefined) {
            game.currentPlayer.actionDiceList[actionIndex].done = true;
        }
    },

    useAbility: (survivor, currentPlace, actionIndex) => {
        const currentPlaceName = currentPlace.name;
        const placeNameList = survivor.ability.placeNameList ?? [];
        const currentPlayer = gameStore.getCurrentPlayer();

        if (survivor.ability.type === 'killZombie') {
            update(game => {
                gameStore.killZombieWithGame(game, survivor, currentPlace, actionIndex);
                return game;
            });
        } else if (survivor.ability.type === 'get') {
            update(game => {
                const camp = gameStore.getCamp(game);
                gameStore.addFood(game, camp, 2);
                return game;
            });
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

    use:  async (currentItemCard) => {
        update(game => {
            game.currentPlayer.itemCardList = game.currentPlayer.itemCardList
                .filter(itemCard => itemCard.index !== currentItemCard.index);

            const camp = gameStore.getCamp(game);

            if (currentItemCard.feature === 'power') {
                game.currentPlayer.actionDiceList[game.selectedActionIndex].power++;
            } else if (currentItemCard.feature === 'food') {
                gameStore.addFood(game, camp, currentItemCard.targetCount);
            } else if (currentItemCard.feature === 'clean') {
                gameStore.clean(4);
            } else if (currentItemCard.feature === 'search') {
                const currentPlace = game.placeList
                    .find(place => place.name === currentItemCard.placeList[0]);

                gameStore.search(game, currentPlace);
            } else if (currentItemCard.feature === 'attack') {
                for (let i = 0; i < currentItemCard.targetCount; i++) {
                    gameStore.killZombieWithGame(game, game.currentSurvivor, game.currentPlace)
                }
            } else if (currentItemCard.feature === 'barricade') {
                gameStore.createBarricade(game.currentPlace);
            } else if (currentItemCard.feature === 'care') {
                for (let i = 0; i < currentItemCard.targetCount; i++) {
                    game.currentSurvivor.wound--;

                    if (game.currentSurvivor.wound === 0) {
                        break;
                    }
                }
            }

            return game;
        });

        // gameStore.updateAll();
        //
        // await tick();

        update(game => {
            const camp = gameStore.getCamp(game);
            camp.trashList = [...camp.trashList, currentItemCard];
            camp.trashCount = camp.trashList.length;
            game.campTrashIndex++

            game.selectedItemCardFeature = null;
            game.currentPlace = null;

            return game;
        });

        gameStore.updateAll();
    },

    cancel: (currentItemCard) => {
        update(game => {
            game.selectedItemCardFeature = null;
            return game;
        });

        gameStore.updateAll();
    },

    attack: (currentSurvivor, currentPlace, actionIndex) => {
        update(game => {
            gameStore.killZombieWithGame(game, currentSurvivor, currentPlace, actionIndex);
            return game;
        });

        gameStore.updateAll();
    },

    killZombieWithGame: (game, currentSurvivor, currentPlace, actionIndex) => {
        if (currentPlace.currentZombieCount > 0) {
            const currentPlayer = gameStore.getCurrentPlayer(game);

            if (actionIndex !== undefined) {
                currentPlayer.actionDiceList[actionIndex].done = true;
            }

            const currentEntrance = currentPlace.entranceList
                .filter(entrance => entrance.zombieCount > 0)
                .sort((a, b) => Math.random() - 0.5)[0];

            currentEntrance.zombieCount--;
            currentPlace.currentZombieCount--;
            game.deadZombieCount++;

            if (game.deadZombieCount === 20) {
                alert('목표를 완수하였습니다.');
            }

            if (actionIndex !== undefined) {
                game.dangerDice = true;
                game.currentSurvivor = currentSurvivor;
            }
        }
    },

    createBarricade: (currentPlace, actionIndex) => {
        update(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);

            if (actionIndex !== undefined) {
                currentPlayer.actionDiceList[actionIndex].done = true;
            }

            const currentEntrance = currentPlace.entranceList
                .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                .sort((a, b) => Math.random() - 0.5)[0];

            currentEntrance.barricadeCount++;

            return game;
        });

        gameStore.updateAll();
    },

    inviteZombie: (currentPlace, actionIndex, zombieCount) => {
        zombieCount = zombieCount || 2;

        update(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);

            if (actionIndex !== undefined) {
                currentPlayer.actionDiceList[actionIndex].done = true;
            }

            for (let i = 0; i < zombieCount; i++) {
                const currentEntrance = currentPlace.entranceList
                    .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                    .sort((a, b) => Math.random() - 0.5)[0];

                currentEntrance.zombieCount = currentEntrance.zombieCount + 1;
            }

            return game;
        });

        gameStore.updateAll();
    },

    showZombie: (messageList) => {
        update(game => {
            game.placeList.forEach(place => {
                let zombieCount = place.survivorList.length;

                if (place.name === '피난기지') {
                    zombieCount = place.foodCount;
                }

                const message = `${place.name}에 ${zombieCount}구가 출몰하였습니다.`;
                gameStore.showMessage(messageList);

                for (let i = 0; i < zombieCount; i++) {
                    const currentEntrance = place.entranceList
                        .sort((a, b) => Math.random() - 0.5)[0];

                    currentEntrance.zombieCount++;

                    if (currentEntrance.maxZombieCount < currentEntrance.zombieCount + currentEntrance.barricadeCount) {
                        if (currentEntrance.barricadeCount > 0) {
                            currentEntrance.barricadeCount--;

                            const message = `${place.name}에 바리케이트가 제거되었습니다.`;
                            gameStore.showMessage(messageList);
                        } else {
                            currentEntrance.zombieCount--;

                            if (place.survivorList.length > 0) {
                                gameStore.dead(true, messageList, place);
                            }
                        }
                    }
                }
            })

            return game;
        });

        gameStore.updateAll();
    },

    clean: (trashCount, actionIndex) => {
        update(game => {
            const camp = gameStore.getCamp(game);

            for (let i = 0; i < trashCount; i++) {
                camp.trashList.pop();
                camp.trashCount = camp.trashList.length;

                if (camp.trashCount === 0) {
                    break;
                }
            }

            if (actionIndex) {
                game.currentPlayer.actionDiceList[actionIndex].done = true;
            }

            return game;
        });

        gameStore.updateAll();
    },

    choiceRiskCard: () => {
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
            game.canAction = true;
            game.canTurn = false;
            return game;
        });

        gameStore.updateAll();
    },

    dead: (minusMoral, messageList, currentPlace) => {
        let oldMoral = 0;
        let newMoral = 0;
        let currentSurvivorName = '';

        update(game => {
            game.deadSurvivorCount++
            game.deadSurvivorList.push(game.currentSurvivor);

            game.placeList
                .filter(place => {
                    if (currentPlace === undefined) {
                        return true;
                    }

                    return place.name === currentPlace.name;
                })
                .forEach(place => {
                    place.survivorList = place.survivorList
                        .filter(survivor => survivor !== game.currentSurvivor)
                });

            if (minusMoral === true) {
                oldMoral = game.moral;
                game.moral--;
                newMoral = game.moral;
            }

            currentSurvivorName = game.currentSurvivor.name;
            game.currentSurvivor = null;

            return game;
        });

        const message = `${currentSurvivorName} 생존자가 죽었습니다.`;

        if (messageList !== undefined) {
            messageList.push(message);
            gameStore.showMessage(messageList);
        } else {
            alert(message);
        }

        if (minusMoral === true) {
            const message = `사기가 ${oldMoral}에서 ${newMoral}로 떨어졌습니다.`;

            if (messageList !== undefined) {
                messageList.push(message);
                gameStore.showMessage(messageList);
            } else {
                alert(message);
            }
        }
    },

    wound: (messageList) => {
        update(game => {
            console.log('>>> game.currentSurvivor', game.currentSurvivor);

            game.currentSurvivor.wound++;

            const message = `${game.currentSurvivor.name} 부상을 입었습니다.`;

            if (messageList !== undefined) {
                messageList.push(message);
                gameStore.showMessage(messageList);
            } else {
                alert(message);
            }

            if (game.currentSurvivor.wound >= 3) {
                const message = `${game.currentSurvivor.name} 부상을 3차례 입었습니다.'`;

                if (messageList !== undefined) {
                    messageList.push(message);
                    gameStore.showMessage(messageList);
                } else {
                    alert(message);
                }

                gameStore.dead(true);
            }

            game.currentSurvivor = null;

            return game;
        });
    },

    rollDangerActionDice: async (survivor) => {
        if (survivor == null) {
            return;
        }

        const dangerDice = ['', '', '', '', '', '', '부상', '부상', '부상', '부상', '부상', '죽음']
        const result = dangerDice.sort((a, b) => Math.random() - 0.5).pop();

        console.log('>>> result', result);

        const messageList = [];

        if (result === '') {
            messageList.push('아무런 일이 일어나지 않았습니다.');
            await gameStore.showMessage(messageList);
        } else if (result === '부상') {
            messageList.push('부상을 당하였습니다.');
            await gameStore.showMessage(messageList);
            gameStore.wound(messageList);
        } else if (result === '죽음') {
            messageList.push('좀비에게 물려서 죽었습니다.');
            await gameStore.showMessage(messageList);
            gameStore.dead(true, messageList);
        }

        update(game => {
            game.dangerDice = false;
            return game;
        });

        update(game => {
            game.messageList = [];
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
        const placeNameList = survivor.ability.placeNameList ?? [];
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

    canUseItemCard: (itemCared) => {
        if (itemCared.name === '약') {
            return game.survivorList
                .filter(survivor => survivor.wound > 0).length > 0;
        } else if (survivor.ability.type === '주사기') {
            return game.survivorList
                .filter(survivor => survivor.wound > 0).length > 0;
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