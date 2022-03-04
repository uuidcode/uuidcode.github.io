import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import game from "./game"
import survivorList from "./survivorList";
import placeList from "./placeList";
import itemCardList from "./itemCardList";

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
        if (game.moral > 0) {
            game.moral--;
        }

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
                .sort((a, b) => 0.5 - Math.random())
                .map(name => gameStore.createNewItemCard(name));
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

    getSurvivor: (game, type) => {
        const survivor = game.survivorList.find(survivor => survivor.ability.type === type);
        game.survivorList = game.survivorList.filter(survivor => survivor.ability.type !== type);
        return survivor;
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

            // const testSurvivor = gameStore.getSurvivor(game, 'plusPower');
            //
            // if (testSurvivor) {
            //     survivorList.push(testSurvivor);
            // }

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

            const initPlayerSurvivorMap = {}

            game.playerList.forEach(player => {
                initPlayerSurvivorMap[player.name] = [];
            });

            place.playerSurvivorMap = place.survivorList.reduce((group, survivor) => {
                const playerName = game.playerList[survivor.playerIndex].name;
                group[playerName] = group[playerName] ?? [];
                group[playerName].push(survivor);
                return group;
            }, initPlayerSurvivorMap);

            console.log('>>> place.playerSurvivorMap', place.playerSurvivorMap);

            const currentSurvivorList = [...place.survivorList];

            if (place.name === game.currentPlaceName) {
                place.activeClassName = 'active';
            } else {
                place.activeClassName = 'inactive';
            }

            place.currentZombieCount = place.entranceList
                .map(entrance => entrance.zombieCount)
                .reduce((a, b) => a + b, 0);

            place.currentZombieList = [];

            for (let i = 0; i < place.currentZombieCount; i++) {
                place.currentZombieList.push(game.zombieIndex++);
            }

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

    care: (woundSurvivor) => {
        update(game => {
            game.currentSurvivor.canUseAbility = false;

            if (game.currentActionIndex >= 0) {
                game.currentPlayer.actionDiceList[game.currentActionIndex].done = true;
            }

            woundSurvivor.wound--;
            game.modalClass = '';
            game.modalType = '';
            return game;
        });

        gameStore.updateAll();

        alert(`${woundSurvivor.name} 부상토큰 하나가 제거되었습니다.`);
    },

    move: (currentSurvivor, placeName) => {
        update(game => {
            game.modalClass = '';
            game.modalType = '';
            game.actionType = 'move';
            return game;
        });

        update(game => {
            game.placeList.forEach(place => {
                if (place.name === placeName) {
                    place.survivorList = [...place.survivorList, currentSurvivor];
                } else {
                    place.survivorList = place.survivorList
                        .filter(survivor => survivor.index !== currentSurvivor.index);
                }
            });

            game.currentSurvivor = currentSurvivor;
            game.currentSurvivor.place = game.placeList.find(place => place.name === placeName);
            game.currentPlaceName = placeName;

            if (game.currentActionIndex >= 0) {
                game.currentPlayer.actionDiceList[game.currentActionIndex].done = true;
            }

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

    processFood: (messageList) => {
        const game = get(gameStore);
        const camp = gameStore.getCamp(game);

        if (camp.survivorList.length >= 2) {
            const foodCount = Math.floor(camp.survivorList.length / 2);

            if (foodCount > camp.foodCount) {
                let starvingTokenCount = 0;
                let oldMoral = 0;

                update(game => {
                    oldMoral = game.moral;
                    camp.starvingTokenCount++;
                    starvingTokenCount = camp.starvingTokenCount;
                    return game;
                });

                gameStore.updateAll();

                messageList.push(`식량이 부족하여 굶주림 토큰이 추가되었습니다.`);

                if (starvingTokenCount > 0) {
                    for (let i = 0; i < starvingTokenCount; i++) {
                        gameStore.minusMoral();
                    }

                    let newMoral = 0;

                    update(game => {
                        newMoral = game.moral;
                        return game;
                    });

                    messageList.push(`굶주림 토큰이 ${starvingTokenCount}개가 있어서 사기가 ${oldMoral}에서 ${newMoral}로 하락 하였습니다.`);
                }
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

        const minusMoral = Math.floor(camp.trashList.length / 10);
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
                            .find(place => place.name === placeName))
                        .forEach(place => {
                            gameStore.inviteZombie(place, undefined, action.targetCount);
                            messageList.push(`좀비가 ${place.name}에 ${action.targetCount}구 출몰하였습니다.`);
                            gameStore.showMessage(messageList);
                        });
                } else if (action.name === 'wound') {
                    const survivorList = game.playerList
                        .flatMap(player => player.survivorList)
                        .sort((a, b) => Math.random() - 0.5);

                    for (let i = 0; i < action.targetCount; i++) {
                        const survivor = survivorList.pop();

                        if (survivor) {
                            update(game => {
                                game.currentSurvivor = survivor;
                                return game;
                            });

                            gameStore.wound(messageList);
                        }
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
    },

    turn: () => {
        update(game => {
            game.currentPlayer.actionTable = [];

            game.survivorList.forEach(survivor => {
                survivor.actionTable = [];
            });

            game.placeList.forEach(place => {
                place.survivorList.forEach(survivor => {
                    survivor.actionTable = [];
                    survivor.canUseAbility = true;
                });
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

            update(game => {
                game.riskCard = true;
                game.rollDice = false;
                game.messageList = messageList;
                return game;
            });

            gameStore.minusRound();
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

    getPlayerSurvivorList: (game, player) => {
        return game.placeList
            .flatMap(place => place.survivorList)
            .filter(survivor => survivor.playerIndex === player.index);
    },

    updateSurvivor: game => {
        game.playerList.forEach(player => {
            player.survivorList = gameStore.getPlayerSurvivorList(game, player);

            game.placeList
                .flatMap(place => place.survivorList)
                .forEach(survivor => {
                    survivor.woundList = [...Array(survivor.wound).keys()];
                    survivor.playerName = game.playerList[survivor.playerIndex].name;
                    survivor.noRollDangerDice = false;
                });
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
            alert('생존자가 모두 죽었습니다. 실패하였습니다.');
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
                        .filter(itemCard => itemCard.placeNameList.filter(placeName => placeName === currentPlace.name).length > 0);

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
                        ability: game.selectedItemCardFeature === null &&
                            !dice.done &&
                            !game.dangerDice &&
                            gameStore.canUseAbility(survivor),
                        food: game.selectedItemCardFeature === null &&
                            !dice.done &&
                            !game.dangerDice &&
                            dice.power < 6 &&
                            gameStore.getCamp(game).foodCount > 0,
                        attack: game.selectedItemCardFeature === null &&
                            !dice.done && !game.dangerDice &&
                            dice.power >= survivor.attack  &&
                            currentPlace.currentZombieCount > 0,
                        search: game.selectedItemCardFeature === null &&
                            dice.power >= survivor.search &&
                            !dice.done &&
                            !game.dangerDice &&
                            currentPlace.itemCardList.length > 0,
                        barricade: game.selectedItemCardFeature === null &&
                            !dice.done &&
                            !game.dangerDice &&
                            currentPlace.maxZombieCount > currentPlace.currentZombieCount + currentPlace.currentBarricadeCount,
                        clean: game.selectedItemCardFeature === null &&
                            !dice.done &&
                            !game.dangerDice &&
                            currentPlace.name === '피난기지' &&
                            currentPlace.trashCount > 0,
                        invite: game.selectedItemCardFeature === null &&
                            !dice.done && !game.dangerDice &&
                            currentPlace.maxZombieCount >= currentPlace.currentZombieCount + currentPlace.currentBarricadeCount + 2,
                        move: game.selectedItemCardFeature === null &&
                            !dice.done &&
                            currentPlayer.itemCardList.filter(itemCard => itemCard.feature === 'safeMove'),
                        itemFood: game.selectedItemCardFeature === null &&
                            !dice.done &&
                            !game.dangerDice &&
                            dice.power < 6 &&
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
                // .filter(itemCard => currentPlace.maxZombieCount > currentPlace.currentZombieCount + currentPlace.currentBarricadeCount)
                .filter(itemCard => currentPlace.currentZombieCount > 0);

            const searchItemList = currentPlayer.itemCardList
                .filter(itemCard => itemCard.feature === 'search')
                .filter(itemCard => currentPlace.itemCardList.length > 0)
                .filter(itemCard => itemCard.placeNameList.filter(placeName => placeName === currentPlace.name).length > 0);

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
                    targetPlace.disabled = game.selectedItemCardFeature != null ||
                        game.dangerDice ||
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
        if (game.moral === 0) {
            alert('사기가 0입니다. 실패하였습니다.');
            return false;
        }

        if (game.round === 0) {
            alert('라운드가 0입니다. 실패하였습니다.');
            return false;
        }

        game.playerList.forEach(player => {
            if (gameStore.getPlayerSurvivorList(game, player).length === 0) {
                alert(`${player.name}의 생존자가 모두 죽었습니다. 실패하였습니다.`);
                return false;
            }
        });

        if (game.deadZombieCount === 30) {
            alert('목표를 완수하였습니다.');
            return false;
        }

        return true
    },

    updateAll: () => update(game => {
        const ok = gameStore.check(game);

        if (!ok) {
            return game;
        }

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

    done: (currentSurvivor, actionIndex) => {
        update(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);
            currentPlayer.actionDiceList[actionIndex].done = true;
            return game;
        });

        gameStore.updateAll();
    },

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
        // update(game => {
        //     game.itemCardAnimationType = 'risk';
        //     return game;
        // });

        update(game => {
            game.itemCardAnimationType = 'risk';
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

    addSurvivor: (game, itemCard) => {
        alert(`외부인 ${itemCard.targetCount}명을 피난기지에 합류합니다.`);

        for (let i = 0; i < itemCard.targetCount; i++) {
            const newSurvivor = game.survivorList.pop();
            newSurvivor.playerIndex = game.currentPlayer.index;
            newSurvivor.place = gameStore.getCamp(game);

            game.placeList
                .find(place => place.name === '피난기지')
                .survivorList
                .push(newSurvivor);
        }
    },

    searchInternal: (game, currentPlace, actionIndex) => {
        game.itemCardAnimationType = 'get';

        const newItemCard = currentPlace.itemCardList.pop();

        if (newItemCard.category === '외부인') {
            gameStore.addSurvivor(game, newItemCard);
        } else {
            game.currentPlayer.itemCardList = [newItemCard, ...game.currentPlayer.itemCardList];
        }

        if (actionIndex !== undefined) {
            game.currentPlayer.actionDiceList[actionIndex].done = true;
        }
    },

    setUseAbility: (game, currentSurvivor) => {
        const targetSurvivor = game.placeList.flatMap(place => place.survivorList)
            .find(survivor => survivor.index === currentSurvivor.index);

        targetSurvivor.canUseAbility = false;

        return targetSurvivor;
    },

    useAbility: (currentSurvivor, currentPlace, actionIndex) => {
        console.log('>>> currentSurvivor.ability.type', currentSurvivor.ability.type);

        const currentPlaceName = currentPlace.name;
        const placeNameList = currentSurvivor.ability.placeNameList ?? [];
        const currentPlayer = gameStore.getCurrentPlayer();
        currentSurvivor.noRollDangerDice = true;

        if (currentSurvivor.ability.type === 'killZombie') {
            update(game => {
                gameStore.killZombieWithGame(game, currentSurvivor, currentPlace, actionIndex);
                const targetSurvivor = gameStore.setUseAbility(game, currentSurvivor);
                targetSurvivor.noRollDangerDice = false;
                return game;
            });

            gameStore.updateAll();
        } else if (currentSurvivor.ability.type === 'get') {
            update(game => {
                gameStore.searchInternal(game, currentPlace, actionIndex);
                gameStore.setUseAbility(game, currentSurvivor);
                return game;
            });

            gameStore.updateAll();
        } else if (currentSurvivor.ability.type === 'plusPower') {
            update(game => {
                currentSurvivor.canUseAbility = false;
                return game;
            });

            gameStore.plusPower(currentSurvivor, currentPlace, actionIndex);
        } else if (currentSurvivor.ability.type === 'move') {
            update(game => {
                game.modalClass = 'show';
                game.modalType = 'move';
                game.currentSurvivor = currentSurvivor;
                game.currentActionIndex = actionIndex;
                currentSurvivor.canUseAbility = false;
                return game;
            });

            gameStore.updateAll();
        } else if (currentSurvivor.ability.type === 'care') {
            update(game => {
                game.currentSurvivor = currentSurvivor;
                game.currentPlace = currentPlace;
                game.modalClass = 'show';
                game.modalType = 'care';
                game.currentActionIndex = actionIndex;
                return game;
            });

            gameStore.updateAll();
        } else if (currentSurvivor.ability.type === 'food') {
            update(game => {
                const camp = gameStore.getCamp(game);
                gameStore.addFood(game, camp, 2);
                currentSurvivor.canUseAbility = false;
                game.currentPlayer.actionDiceList[actionIndex].done = true;
                return game;
            });

            gameStore.updateAll();
        } else if (currentSurvivor.ability.type === 'plusMoral') {
            update(game => {
                game.currentSurvivor = currentSurvivor;
                currentSurvivor.canUseAbility = false;
                game.currentPlayer.actionDiceList[actionIndex].done = true;
                return game;
            });

            gameStore.dead(false, undefined, currentPlace);
            gameStore.plusMoral();
            gameStore.updateAll();

            alert('사기가 상승하였습니다.');
        } else if (currentSurvivor.ability.type === 'rescue') {
            update(game => {
                const targetPlace = game.placeList
                    .find(place => place.name === currentPlace.name);

                let rescued = false;
                let rescueItemCard = null;

                targetPlace.itemCardList =
                    targetPlace.itemCardList
                        .filter(itemCard => {
                            if (rescued === false && itemCard.category === '외부인') {
                                rescueItemCard = itemCard;
                                rescued = true;
                                return false;
                            }

                            return true;
                        });

                gameStore.addSurvivor(game, rescueItemCard)
                game.currentSurvivor = currentSurvivor;
                currentSurvivor.canUseAbility = false;
                game.currentPlayer.actionDiceList[actionIndex].done = true;
                return game;
            });

            gameStore.updateAll();
        } else if (currentSurvivor.ability.type === 'clean') {
            update(game => {
                game.currentSurvivor = currentSurvivor;
                game.currentSurvivor.canUseAbility = false;
                return game;
            });

            gameStore.clean(5, actionIndex);
        } else if (currentSurvivor.ability.type === 'barricade') {
            update(game => {
                game.currentSurvivor = currentSurvivor;
                game.currentSurvivor.canUseAbility = false;
                return game;
            });

            for (let i = 0; i < 2; i++) {
                gameStore.createBarricade(currentPlace, actionIndex);
            }
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
            gameStore.actionType = 'attack';
            return game;
        });

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
            game.deadZombieList.push(game.deadZombieCount);

            if (currentSurvivor.noRollDangerDice === true) {
                return;
            }

            if (actionIndex !== undefined) {
                game.currentSurvivor = currentSurvivor;
                gameStore.rollDangerActionDice(currentSurvivor, true);
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

                currentEntrance.zombieCount += 1;
                currentEntrance.zombieList.push(game.entranceZombieIndex++);
            }

            return game;
        });

        gameStore.updateAll();
    },

    showZombie: (messageList) => {
        let showZombieCount = 0;

        update(game => {
            game.placeList.forEach(place => {
                let zombieCount = place.survivorList.length;

                if (place.name === '피난기지') {
                    zombieCount = place.foodCount;
                }

                if (zombieCount > 0) {
                    if (showZombieCount === 0) {
                        messageList.push('라운드가 종료될때 마다 좀비가 타나납니다.');
                        showZombieCount++;
                    }

                    const message = `좀비가 ${place.name}에 ${zombieCount}구가 출몰하였습니다.`;
                    messageList.push(message);

                    for (let i = 0; i < zombieCount; i++) {
                        const currentEntrance = place.entranceList
                            .sort((a, b) => Math.random() - 0.5)[0];

                        currentEntrance.zombieCount++;
                        let currentZombieCount = currentEntrance.zombieCount;


                        if (currentEntrance.maxZombieCount < currentEntrance.zombieCount + currentEntrance.barricadeCount) {
                            if (currentEntrance.barricadeCount > 0) {
                                currentEntrance.barricadeCount--;

                                const message = `${place.name}에 바리케이트가 제거되었습니다.`;
                                messageList.push(message);
                            } else {
                                currentEntrance.zombieCount--;

                                if (place.survivorList.length > 0) {
                                    gameStore.dead(true, messageList, place);
                                }
                            }
                        }

                        if (currentZombieCount > currentEntrance.zombieCount ) {
                            currentEntrance.zombieList.push(game.entranceZombieIndex++);
                        }
                    }
                }
            });

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

            if (actionIndex !== undefined) {
                game.playerList[game.turn % 2].actionDiceList[actionIndex].done = true;
            }

            return game;
        });

        gameStore.updateAll();
    },

    choiceRiskCard: () => {
        update(game => {
            game.successRiskCardList = [];
            game.currentRiskCard = game.riskCardList.pop();
            game.riskCardList = [...game.riskCardList, game.currentRiskCard];

            gameStore.initRiskCard(game);

            game.riskCard = false;
            game.rollDice = true;
            return game;
        });

        gameStore.updateAll();
    },

    rollActionDice: () => {
        update(game => {
            game.messageList = [];
            return game;
        });

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

            minusMoral = minusMoral && game.moral > 0;

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

    rollDangerActionDice: (survivor, killZombie) => {
        const currentSurvivor = get(gameStore).currentSurvivor;

        if (currentSurvivor === null || survivor == null ||
            currentSurvivor.name !== survivor.name) {
            return;
        }

        const currentActionIndex = get(gameStore).currentActionIndex;

        if (currentActionIndex >= 0) {
            update(game => {
                game.currentActionIndex = -1;
                return game;
            });

            return;
        }

        const saveMoveCount = get(gameStore).currentPlayer.itemCardList
            .filter(itemCard => itemCard.feature === 'safeMove')
            .length;

        let rollDangerDice = true;

        if (killZombie === undefined && saveMoveCount > 0) {
            rollDangerDice = !confirm(`연료 아이템이 ${saveMoveCount}개가 있으며 하나를 사용하여 위험노출 주사위를 굴리지 않고 이동할까요?`);
        }

        if (!rollDangerDice) {
            update(game => {
                let use = false;

                game.playerList
                    .filter(player => player.index === game.currentPlayer.index)
                    .forEach(player => {
                        player.itemCardList = player.itemCardList
                            .filter(itemCard => {
                                if (use === false && itemCard.feature === 'safeMove') {
                                    use = true;
                                    return false;
                                }

                                return true;
                            });
                    });

                return game;
            });

            gameStore.updateAll();

            return;
        }

        alert('위험노출 주사위를 던집니다.');

        update(game => {
            const dangerDice = ['', '', '', '', '', '', '부상', '부상', '부상', '부상', '부상', '연쇄물림']
            const result = dangerDice.sort((a, b) => Math.random() - 0.5).pop();

            if (result === '') {
                alert('아무런 일이 일어나지 않았습니다.');
            } else if (result === '부상') {
                alert('부상을 당하였습니다.');
                gameStore.wound();
            } else if (result === '연쇄물림') {
                alert('연쇄물림이 발생하였습니다.');

                const currentPlace = currentSurvivor.place;

                gameStore.dead(true);

                currentPlace.survivorList.forEach(survivor => {
                    game.currentSurvivor = survivor;
                    gameStore.wound();
                })
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

        if (survivor.canUseAbility === false) {
            return false;
        }

        if (survivor.ability.type === 'killZombie') {
            if (placeNameList.find(name => name === currentPlaceName)) {
                return survivor.canUseAbility === true &&
                    currentPlace.currentZombieCount > 0;
            }

            return false;
        } else if (survivor.ability.type === 'get') {
            if (placeNameList.find(name => name === currentPlaceName)) {
                return currentPlace.itemCardList.length > 0;
            }

            return false;
        } else if (survivor.ability.type === 'plusPower') {
            if (currentPlayer.actionTable) {
                return currentPlayer.actionDiceList
                    .filter(dice => dice.power <= 5)
                    .filter(dice => dice.done === false).length > 0;
            }

            return false;
        } else if (survivor.ability.type === 'move') {
            return get(gameStore).placeList
                .filter(place => place.name !== survivor.place.name)
                .filter(place => place.maxSurvivorCount > place.survivorList.length)
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