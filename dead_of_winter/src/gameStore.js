import {get, writable} from "svelte/store";
import game from "./game"

const { subscribe, set, update } = writable(game);

let updateAll = () => {};
let g = game;

const u2 = (callback) => {
    update(game => {
        g = game;
        callback(game);
        return game;
    });
};

const u = (callback) => {
    u2(callback);
    updateAll();
};


let gameStore = {
    subscribe,
    set,
    update
};

gameStore = {
    ...gameStore,

    minusRound: () => u(game => {
        g.round -= 1;
    }),

    plusMoral: () => u(game => {
        g.moral += 1
    }),

    minusMoral: () => u(game => {
        if (g.moral > 0) {
            g.moral--;
        }
    }),

    initRiskCard: () => {
        g.riskCardList = g.riskCardList
            .sort(gameStore.random);
    },

    initItemCard: () => {
        g.playerList.forEach(player => {
            player.itemCardList = game.initItemCardList
                .sort(gameStore.random)
                .slice(0, 7)
                .map(name => gameStore.createNewItemCard(name));
        });

        g.placeList.forEach(place => {
            place.itemCardList = place.itemCardList
                .sort(gameStore.random)
                .map(name => gameStore.createNewItemCard(name));
        });
    },

    createNewItemCard: (name) => {
        let itemCard = g.itemCardList.find(item => item.name === name);

        return {
            ...itemCard
        };
    },

    getPlayerColorForSurvivor: (survivor) => {
        return g.playerList
            .find(player => player.index === survivor.playerIndex)
            .color;
    },

    initSurvivor: (game) => {
        g.playerList.forEach((player, playerIndex) => {
            g.survivorList
                .sort(gameStore.random);

            const survivorList = [];

            for (let i = 0; i < 4; i++) {
                const survivor = g.survivorList.pop();
                survivor.playerIndex = playerIndex;
                survivorList.push(survivor);
            }

            survivorList.sort((a, b) => a.index - b.index);

            player.survivorList = survivorList;

            g.survivorList = [...g.survivorList];
        });
    },

    updatePlace: () => {
        g.placeList.forEach(place => {
            if (place.name === '피난기지') {
                place.trashCount = place.trashList.length;
            }

            place.survivorList.sort((a, b) => a.playerIndex - b.playerIndex);

            const initPlayerSurvivorMap = {}

            g.playerList.forEach(player => {
                initPlayerSurvivorMap[player.name] = [];
            });

            place.playerSurvivorMap = place.survivorList.reduce((group, survivor) => {
                const playerName = g.playerList[survivor.playerIndex].name;
                group[playerName] = group[playerName] ?? [];
                group[playerName].push(survivor);
                return group;
            }, initPlayerSurvivorMap);

            const currentSurvivorList = [...place.survivorList];

            if (place.name === g.currentPlaceName) {
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

    getCamp: () => {
        return g.placeList.find(place => place.name === '피난기지');
    },

    getSurvivorList: () => {
        return g.playerList.flatMap(player => player.survivorList);
    },

    getCurrentPlayer: () => {
        const playerList = g.playerList;
        return playerList[g.turn % 2];
    },

    getCurrentPlayerColor: () => {
        return gameStore.getCurrentPlayer().color;
    },

    getPlayerColor: (index) => {
        return g.playerList[index].color;
    },

    initCamp: () => {
        const survivorList = gameStore.getSurvivorList();
        const camp = gameStore.getCamp();

        camp.survivorList = survivorList;
        camp.survivorList.forEach(survivor => survivor.place = camp);

        camp.foodList = [...Array(camp.foodCount).keys()]
            .map(index => g.campFoodIndex++);

        camp.trashList = [];
    },

    care: (woundSurvivor) => {
        u(game => {
            g.currentSurvivor.canUseAbility = false;

            if (g.currentActionIndex >= 0) {
                g.currentPlayer.actionDiceList[g.currentActionIndex].done = true;
            }

            woundSurvivor.wound--;
            g.modalClass = '';
            g.modalType = '';
        });

        alert(`${woundSurvivor.name} 부상토큰 하나가 제거되었습니다.`);
    },

    move: (currentSurvivor, placeName) => {
        u(game => {
            g.modalClass = '';
            g.modalType = '';
            g.actionType = 'move';
            g.placeList.forEach(place => {
                if (place.name === placeName) {
                    place.survivorList = [...place.survivorList, currentSurvivor];
                } else {
                    place.survivorList = place.survivorList
                        .filter(survivor => survivor.index !== currentSurvivor.index);
                }
            });

            g.currentSurvivor = currentSurvivor;
            g.currentSurvivor.place = g.placeList.find(place => place.name === placeName);

            g.currentPlaceName = placeName;

            if (g.currentActionIndex >= 0) {
                g.currentPlayer.actionDiceList[g.currentActionIndex].done = true;
            }
        });
    },

    changePlaceByName: (currentPlaceName) => {
        if (currentPlaceName === null) {
            return;
        }

        u(game => game.currentPlaceName = currentPlaceName);
    },

    showMessage: (messageList) => {
        u(game => game.messageList = messageList);
    },

    processFood: (messageList) => {
        const camp = gameStore.getCamp();

        if (camp.survivorList.length >= 2) {
            const foodCount = Math.floor(camp.survivorList.length / 2);

            if (foodCount > camp.foodCount) {
                let starvingTokenCount = 0;
                let oldMoral = 0;

                u(game => {
                    oldMoral = g.moral;
                    camp.starvingTokenCount++;
                    starvingTokenCount = camp.starvingTokenCount;
                });

                messageList.push(`식량이 부족하여 굶주림 토큰이 추가되었습니다.`);

                if (starvingTokenCount > 0) {
                    for (let i = 0; i < starvingTokenCount; i++) {
                        gameStore.minusMoral();
                    }

                    let newMoral = 0;

                    u(game => {
                        newMoral = g.moral;
                    });

                    messageList.push(`굶주림 토큰이 ${starvingTokenCount}개가 있어서 사기가 ${oldMoral}에서 ${newMoral}로 하락 하였습니다.`);
                }
            } else {
                for (let i = 0; i < foodCount; i++) {
                    u(game => {
                        const camp = gameStore.getCamp();
                        gameStore.removeFood(camp);
                    });
                }

                messageList.push(`식량을 ${foodCount}개 소모합니다.`);
            }

            gameStore.showMessage(messageList);
        }
    },

    processTrash: (messageList) => {
        const camp = gameStore.getCamp();

        if (camp.trashList.length < 10) {
            return;
        }

        const minusMoral = Math.floor(camp.trashList.length / 10);
        messageList.push(`쓰레기가 ${camp.trashList.length}에서 ${camp.trashList.length - (minusMoral * 10)}로 줄어들었으며 사기는 ${minusMoral} 하락합니다.`);
        gameStore.showMessage(messageList);

        u(game => {
            for (let i = 0; i < minusMoral; i++) {
                gameStore.minusMoral(g);
            }

            const currentCamp = gameStore.getCamp();

            for (let i = 0; i < minusMoral * 10; i++) {
                currentCamp.trashList.pop();
            }
        });
    },

    processRisk: (messageList) => {
        if (g.successRiskCardList.length < 2) {
            messageList.push('위기상황을 해결하지 못하였습니다.');
            gameStore.showMessage(messageList);

            g.currentRiskCard.condition.fail.actionList.forEach(action => {
                if (action.name === 'minusMoral') {
                    for (let i = 0; i < action.targetCount; i++) {
                        gameStore.minusMoral();
                    }

                    messageList.push(`사기 ${action.targetCount} 하락합니다.`);
                    gameStore.showMessage(messageList);
                } else if (action.name === 'zombie') {
                    action.placeList
                        .map(placeName => g.placeList
                            .find(place => place.name === placeName))
                        .forEach(place => {
                            gameStore.inviteZombie(place, undefined, action.targetCount);
                            messageList.push(`좀비가 ${place.name}에 ${action.targetCount}구 출몰하였습니다.`);
                            gameStore.showMessage(messageList);
                        });
                } else if (action.name === 'wound') {
                    const survivorList = g.playerList
                        .flatMap(player => player.survivorList)
                        .sort(gameStore.random);

                    for (let i = 0; i < action.targetCount; i++) {
                        const survivor = survivorList.pop();

                        if (survivor) {
                            u(game => {
                                g.currentSurvivor = survivor;
                            });

                            gameStore.wound(messageList);
                        }
                    }
                } else if (action.name === 'barricade') {
                    gameStore.removeAllBarricade(messageList);
                } else if (action.name === 'dead') {
                    const survivorList = g.playerList
                        .flatMap(player => player.survivorList)
                        .sort(gameStore.random);

                    for (let i = 0; i < action.targetCount; i++) {
                        const survivor = survivorList.pop();
                        let currentPlace = null;

                        u(game => {
                            g.currentSurvivor = survivor;
                            currentPlace = g.placeList.find(place => {
                                return place.survivorList.filter(currentSurvivor => currentSurvivor.index === survivor.index) > 0;
                            });
                        });


                        gameStore.dead(false, messageList, currentPlace);
                    }
                } else if (action.name === 'food') {
                    for (let i = 0; i < action.targetCount; i++) {
                        u(game => {
                            const camp = gameStore.getCamp();
                            gameStore.removeFood(camp);
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
        u(game => {
            g.currentPlayer.actionTable = [];

            g.survivorList.forEach(survivor => {
                survivor.actionTable = [];
            });

            g.placeList.forEach(place => {
                place.survivorList.forEach(survivor => {
                    survivor.actionTable = [];
                    survivor.canUseAbility = true;
                });
            });

            g.playerList.forEach(player => player.actionDiceList = []);

            g.turn++;
            g.canAction = false;
            g.canTurn = false;
            g.rollDice = true;
        });

        const turn = g.turn;

        if (turn > 0 && turn % 2 === 0) {
            const messageList = [];
            gameStore.processFood(messageList);
            gameStore.processTrash(messageList)
            gameStore.processRisk(messageList);
            gameStore.showZombie(messageList)

            u(game => {
                g.riskCard = true;
                g.rollDice = false;
                g.messageList = messageList;
            });

            gameStore.minusRound();
        }
    },

    removeAllBarricade: (messageList) => {
        u(game => {
            g.placeList
                .flatMap(place => place.entranceList)
                .forEach(entrance => {
                    entrance.barricadeCount = 0;
                })
        });

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
        } else if (event.keyCode === 56) {
            console.log(g);
        }

        gameStore.changePlaceByName(currentPlaceName);
    },

    init: () => u(game => {
        gameStore.initRiskCard();
        gameStore.initItemCard();
        gameStore.initSurvivor();
        gameStore.initCamp();
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

    sum: (a, b) => {
        return a + b;
    },

    updateZombie: game => {
        game.zombieCount = game.placeList
            .flatMap(player => player.entranceList)
            .map(entrance => entrance.zombieCount)
            .reduce(gameStore.sum);
    },

    updateItemCard: game => {
        game.itemCardCount = game.playerList
            .map(player => player.itemCardList.length)
            .reduce(gameStore.sum);

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
                let placeMatch = true;

                if (itemCard.placeNameList && itemCard.feature === 'search') {
                    placeMatch = game.currentSurvivor.place.name === itemCard.placeNameList[0];
                }

                itemCard.canAction = game.canAction === true &&
                    game.selectedItemCardFeature === itemCard.feature &&
                    placeMatch;
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

    updateSurvivorCount: () => {
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

    check: () => {
        if (g.fail === true) {
            return false;
        }

        if (g.moral === 0) {
            alert('사기가 0입니다. 실패하였습니다.');
            return false;
        }

        if (g.round === 0) {
            alert('라운드가 0입니다. 실패하였습니다.');
            return false;
        }

        g.playerList.forEach(player => {
            if (gameStore.getPlayerSurvivorList(g, player).length === 0) {
                alert(`${player.name}의 생존자가 모두 죽었습니다. 실패하였습니다.`);
                return false;
            }
        });

        if (g.deadZombieCount === 40) {
            alert('목표를 완수하였습니다.');
            return false;
        }

        return true
    },

    updateAll: () => u2(game => {
        const ok = gameStore.check();

        if (!ok) {
            g.fail = true;
            return;
        }

        g.currentPlayer = g.playerList[game.turn % 2];
        gameStore.updateSurvivorCount(g);
        gameStore.updateItemCardTable(g);
        gameStore.updateSurvivor(g);
        gameStore.updateItemCard(g);
        gameStore.updateZombie(g);
        gameStore.updatePlace();
        gameStore.updateSurvivorActionTable(g);
    }),

    done: (currentSurvivor, actionIndex) => {
        u(game => {
            const currentPlayer = gameStore.getCurrentPlayer();
            currentPlayer.actionDiceList[actionIndex].done = true;
        });
    },

    plusPower: (currentSurvivor, currentPlace, actionIndex) => {
        u(game => {
            const currentPlayer = gameStore.getCurrentPlayer();
            currentPlayer.actionDiceList[actionIndex].power++;
            const camp = gameStore.getCamp();
            gameStore.removeFood(camp, currentSurvivor);
        });
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
        u(game => {
            g.selectedItemCardFeature = 'power';
            g.selectedActionIndex = actionIndex;
        });
    },

    selectItemCardWithoutDice: (currentPlace, survivor, feature) => {
        u(game => {
            g.currentPlace = currentPlace;
            g.selectedItemCardFeature = feature;
            g.currentSurvivor = survivor
            g.currentSurvivor.place = currentPlace;
        });
    },

    preventRisk: (currentItemCard) => {
        u(game => {
            g.itemCardAnimationType = 'risk';
            g.currentPlayer.itemCardList = g.currentPlayer.itemCardList
                .filter(itemCard => itemCard.index !== currentItemCard.index)

            g.successRiskCardList = [...g.successRiskCardList, currentItemCard];
        });
    },

    search: (game, survivor, currentPlace, actionIndex) => {
        if (game === null) {
            u(game => {
                gameStore.searchInternal(g, survivor, currentPlace, actionIndex);
            });
        } else {
            gameStore.searchInternal(game, survivor, currentPlace, actionIndex);
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

    searchInternal: (game, currentSurvivor, currentPlace, actionIndex) => {
        game.itemCardAnimationType = 'get';
        game.currentSurvivor = currentSurvivor;
        game.currentSurvivor.place = currentPlace;

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
        const currentPlaceName = currentPlace.name;
        const placeNameList = currentSurvivor.ability.placeNameList ?? [];
        const currentPlayer = gameStore.getCurrentPlayer();
        currentSurvivor.noRollDangerDice = true;

        if (currentSurvivor.ability.type === 'killZombie') {
            u(game => {
                gameStore.killZombieWithGame(currentSurvivor, currentPlace, actionIndex);
                const targetSurvivor = gameStore.setUseAbility(g, currentSurvivor);
                targetSurvivor.noRollDangerDice = false;
            });
        } else if (currentSurvivor.ability.type === 'get') {
            u(game => {
                gameStore.searchInternal(g, currentSurvivor, currentPlace, actionIndex);
                gameStore.setUseAbility(g, currentSurvivor);
            });
        } else if (currentSurvivor.ability.type === 'move') {
            u(game => {
                g.modalClass = 'show';
                g.modalType = 'move';
                g.currentSurvivor = currentSurvivor;
                g.currentSurvivor.place = currentPlace;
                g.currentActionIndex = actionIndex;
                currentSurvivor.canUseAbility = false;
            });
        } else if (currentSurvivor.ability.type === 'care') {
            u(game => {
                g.currentSurvivor = currentSurvivor;
                g.currentSurvivor.place = currentPlace;
                g.currentPlace = currentPlace;
                g.modalClass = 'show';
                g.modalType = 'care';
                g.currentActionIndex = actionIndex;
            });
        } else if (currentSurvivor.ability.type === 'food') {
            u(game => {
                const camp = gameStore.getCamp();
                gameStore.addFood(game, camp, 2);
                currentSurvivor.canUseAbility = false;
                g.currentPlayer.actionDiceList[actionIndex].done = true;
                return g;
            });
        } else if (currentSurvivor.ability.type === 'plusMoral') {
            u(game => {
                g.currentSurvivor = currentSurvivor;
                g.currentSurvivor.place = currentPlace;
                currentSurvivor.canUseAbility = false;
                g.currentPlayer.actionDiceList[actionIndex].done = true;
            });

            gameStore.dead(false, undefined, currentPlace);
            gameStore.plusMoral();

            alert('사기가 상승하였습니다.');
        } else if (currentSurvivor.ability.type === 'rescue') {
            u(game => {
                const targetPlace = g.placeList
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

                gameStore.addSurvivor(g, rescueItemCard)
                g.currentSurvivor = currentSurvivor;
                g.currentSurvivor.place = currentPlace;
                currentSurvivor.canUseAbility = false;
                g.currentPlayer.actionDiceList[actionIndex].done = true;
            });
        } else if (currentSurvivor.ability.type === 'clean') {
            update(game => {
                game.currentSurvivor = currentSurvivor;
                g.currentSurvivor.place = currentPlace;
                game.currentSurvivor.canUseAbility = false;
                return game;
            });

            gameStore.clean(5, actionIndex);
        } else if (currentSurvivor.ability.type === 'barricade') {
            update(game => {
                game.currentSurvivor = currentSurvivor;
                g.currentSurvivor.place = currentPlace;
                game.currentSurvivor.canUseAbility = false;
                return game;
            });

            for (let i = 0; i < 2; i++) {
                gameStore.createBarricade(currentPlace, actionIndex);
            }
        }
    },

    use:  async (currentItemCard) => {
        u(game => {
            g.currentPlayer.itemCardList = g.currentPlayer.itemCardList
                .filter(itemCard => itemCard.index !== currentItemCard.index);

            const camp = gameStore.getCamp();

            if (currentItemCard.feature === 'power') {
                g.currentPlayer.actionDiceList[g.selectedActionIndex].power++;
            } else if (currentItemCard.feature === 'food') {
                gameStore.addFood(g, camp, currentItemCard.targetCount);
            } else if (currentItemCard.feature === 'clean') {
                gameStore.clean(4);
            } else if (currentItemCard.feature === 'search') {
                const currentPlace = g.placeList
                    .find(place => place.name === currentItemCard.placeNameList[0]);

                gameStore.search(g, g.currentSurvivor, currentPlace);
            } else if (currentItemCard.feature === 'attack') {
                for (let i = 0; i < currentItemCard.targetCount; i++) {
                    gameStore.killZombieWithGame(g.currentSurvivor, g.currentPlace)
                }
            } else if (currentItemCard.feature === 'barricade') {
                gameStore.createBarricade(g.currentPlace);
            } else if (currentItemCard.feature === 'care') {
                for (let i = 0; i < currentItemCard.targetCount; i++) {
                    g.currentSurvivor.wound--;

                    if (g.currentSurvivor.wound === 0) {
                        break;
                    }
                }
            }
        });

        u(game => {
            const camp = gameStore.getCamp();
            camp.trashList = [...camp.trashList, currentItemCard];
            camp.trashCount = camp.trashList.length;
            g.campTrashIndex++

            g.selectedItemCardFeature = null;
            g.currentPlace = null;
        });
    },

    cancel: (currentItemCard) => {
        u(game => {
            g.selectedItemCardFeature = null;
        });
    },

    attack: (currentSurvivor, currentPlace, actionIndex) => {
        u(game => {
            g.actionType = 'attack';
            gameStore.killZombieWithGame(currentSurvivor, currentPlace, actionIndex);
        });
    },

    random: (a, b) => {
        return Math.random() - 0.5;
    },
    
    killZombieWithGame: (currentSurvivor, currentPlace, actionIndex) => {
        g.currentSurvivor = currentSurvivor;
        g.currentSurvivor.place = currentPlace;

        if (currentPlace.currentZombieCount > 0) {
            const currentPlayer = gameStore.getCurrentPlayer(game);

            if (actionIndex !== undefined) {
                currentPlayer.actionDiceList[actionIndex].done = true;
            }

            const currentEntrance = currentPlace.entranceList
                .filter(entrance => entrance.zombieCount > 0)
                .sort(gameStore.random)[0];

            currentEntrance.zombieCount--;
            currentPlace.currentZombieCount--;
            game.deadZombieCount++;
            game.deadZombieList.push(game.deadZombieCount);

            if (currentSurvivor.noRollDangerDice === true) {
                return;
            }

            if (actionIndex !== undefined) {
                game.currentSurvivor = currentSurvivor;
                game.currentSurvivor.place = currentPlace;
                gameStore.rollDangerActionDice(currentSurvivor, true);
            }
        }
    },

    createBarricade: (currentPlace, actionIndex) => {
        u(game => {
            const currentPlayer = gameStore.getCurrentPlayer(g);

            if (actionIndex !== undefined) {
                currentPlayer.actionDiceList[actionIndex].done = true;
            }

            const currentEntrance = currentPlace.entranceList
                .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                .sort(gameStore.random)[0];

            currentEntrance.barricadeCount++;
        });
    },

    inviteZombie: (currentPlace, actionIndex, zombieCount) => {
        zombieCount = zombieCount || 2;

        u(game => {
            const currentPlayer = gameStore.getCurrentPlayer(game);

            if (actionIndex !== undefined) {
                currentPlayer.actionDiceList[actionIndex].done = true;
            }

            for (let i = 0; i < zombieCount; i++) {
                const entranceList = currentPlace.entranceList
                    .filter(entrance => entrance.maxZombieCount > entrance.zombieCount + entrance.barricadeCount)
                    .sort(gameStore.random);

                if (entranceList.length > 0) {
                    const currentEntrance = entranceList[0];

                    currentEntrance.zombieCount += 1;
                    currentEntrance.zombieList.push(g.entranceZombieIndex++);
                }
            }
        });
    },

    showZombie: (messageList) => {
        let showZombieCount = 0;

        u(game => {
            g.placeList.forEach(place => {
                const zombieCount = place.survivorList.length;

                if (zombieCount > 0) {
                    if (showZombieCount === 0) {
                        messageList.push('라운드가 종료될때 마다 좀비가 타나납니다.');
                        showZombieCount++;
                    }

                    const message = `좀비가 ${place.name}에 ${zombieCount}구가 출몰하였습니다.`;
                    messageList.push(message);

                    for (let i = 0; i < zombieCount; i++) {
                        const currentEntrance = place.entranceList
                            .sort(gameStore.random)[0];

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
                                    const randomIndex = Math.floor(Math.random() * place.survivorList.length);
                                    g.currentSurvivor = place.survivorList[randomIndex];
                                    g.currentSurvivor.place = place;
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
        });
    },

    clean: (trashCount, actionIndex) => {
        u(game => {
            const camp = gameStore.getCamp(g);

            for (let i = 0; i < trashCount; i++) {
                camp.trashList.pop();
                camp.trashCount = camp.trashList.length;

                if (camp.trashCount === 0) {
                    break;
                }
            }

            if (actionIndex !== undefined) {
                g.playerList[g.turn % 2].actionDiceList[actionIndex].done = true;
            }
        });
    },

    choiceRiskCard: () => {
        u(game => {
            g.successRiskCardList = [];
            g.currentRiskCard = g.riskCardList.pop();
            g.riskCardList = [...g.riskCardList, g.currentRiskCard];

            gameStore.initRiskCard();

            g.riskCard = false;
            game.rollDice = true;
        });
    },

    rollActionDice: () => {
        u(game => {
            game.messageList = [];
        });

        u(game => {
            const player = gameStore.getCurrentPlayer(g);

            player.actionDiceList = [...Array(player.survivorList.length + 1).keys()]
                .map(i => {
                    return {
                        power: 1 + Math.floor(Math.random() * 6),
                        done: false
                    };
                })
                .sort((a, b) => b.power - a.power);

            g.rollDice = false;
            g.canAction = true;
            g.canTurn = false;
        });
    },

    dead: (minusMoral, messageList, currentPlace) => {
        let oldMoral = 0;
        let newMoral = 0;
        let currentSurvivorName = '';

        u(game => {
            g.deadSurvivorCount++
            g.deadSurvivorList.push(g.currentSurvivor);

            g.placeList
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
            g.currentSurvivor = null;
        });

        const message = `${currentPlace.name}에 있던 ${currentSurvivorName} 생존자가 죽었습니다.`;

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
        u(game => {
            g.currentSurvivor.wound++;

            const message = `${g.currentSurvivor.name} 부상을 입었습니다.`;

            if (messageList !== undefined) {
                messageList.push(message);
                gameStore.showMessage(messageList);
            } else {
                alert(message);
            }

            if (g.currentSurvivor.wound >= 3) {
                const message = `${g.currentSurvivor.name} 부상을 3차례 입었습니다.'`;

                if (messageList !== undefined) {
                    messageList.push(message);
                    gameStore.showMessage(messageList);
                } else {
                    alert(message);
                }

                gameStore.dead(true, undefined, g.currentSurvivor.place);
            }

            g.currentSurvivor = null;
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
            u(game => {
                g.currentActionIndex = -1;
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
            u(game => {
                let use = false;

                g.playerList
                    .filter(player => player.index === g.currentPlayer.index)
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
            });

            return;
        }

        alert('위험노출 주사위를 던집니다.');

        u(game => {
            const dangerDice = ['', '', '', '', '', '', '부상', '부상', '부상', '부상', '부상', '연쇄물림']
            const result = dangerDice.sort(gameStore.random).pop();

            if (result === '') {
                alert('아무런 일이 일어나지 않았습니다.');
            } else if (result === '부상') {
                alert('부상을 당하였습니다.');
                gameStore.wound();
            } else if (result === '연쇄물림') {
                alert('연쇄물림이 발생하였습니다.');

                const currentPlace = currentSurvivor.place;

                gameStore.dead(true, undefined, currentPlace);

                currentPlace.survivorList.forEach(survivor => {
                    g.currentSurvivor = survivor;
                    g.currentSurvivor.place = currentPlace;
                    gameStore.wound();
                })
            }

            g.dangerDice = false;
        });
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

    getPlaceClassName: (currentPlace) => {
        if (currentPlace.name === get(gameStore).currentPlaceName) {
            return "current-place";
        }

        return '';
    }
}

updateAll = gameStore.updateAll;

gameStore.init();

export default gameStore;