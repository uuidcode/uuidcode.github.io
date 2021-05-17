import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import {cloneAndShuffle, shuffle, sleep, move} from "./util"
import gameObject from "./gameObject"

const { subscribe, set, update } = writable(gameObject);

const startCity = cloneAndShuffle(gameObject.cityList).pop();
let startCityIndex = startCity.index;

if (gameObject.startCityIndex != null) {
    startCityIndex = gameObject.startCityIndex;
}

gameObject.playerList.forEach(player => {
    player.cityIndex = startCityIndex;
});

gameObject.cityList.forEach(city => {
    city.lab = false;
});

gameObject.cityList[startCityIndex].lab = true;

const gameStore = {
    subscribe,
    set,
    update,

    isReady: () => {
        return get(gameStore).ready;
    },

    isNotReady: () => {
        return !gameStore.isReady();
    },

    activePlayerIsNoAction: () => {
        return gameStore.getActivePlayer().action === 0;
    },

    activePlayerIsAction: () => {
        return gameStore.getActivePlayer().action > 0;
    },

    recomputeCure: () => {
        const activePlayer = gameStore.getActivePlayer();

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    city.cure =
                        gameStore.activePlayerIsAction() &&
                        city.index === activePlayer.cityIndex &&
                        city.virusCount > 0;

                    return city;
                });

            return game;
        });
    },

    recomputeExchange: () => {
        const activePlayer = gameStore.getActivePlayer();
        const noneActivePlayer = gameStore.getNoneActivePlayer();

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    if (activePlayer.cityIndex === noneActivePlayer.cityIndex &&
                        gameStore.activePlayerIsAction() &&
                        activePlayer.cityIndexList.includes(city.index)) {
                        city.sendable = true;
                    } else {
                        city.sendable = false;
                    }

                    if (activePlayer.cityIndex === noneActivePlayer.cityIndex &&
                        gameStore.activePlayerIsAction() &&
                        noneActivePlayer.cityIndexList.includes(city.index)) {
                        city.receivable = true;
                        game.checkedCityIndex = city.index;
                    } else {
                        city.receivable = false;
                    }

                    return city;
                });

            return game;
        });
    },

    recomputeLab: () => {
        const activePlayer = gameStore.getActivePlayer();

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    city.buildLab =
                        gameStore.activePlayerIsAction() &&
                        game.labCount > 0 &&
                        !city.lab &&
                        city.index === activePlayer.cityIndex &&
                        activePlayer.cityIndexList.includes(city.index);

                    return city;
                });

            return game;
        });
    },

    recomputeVaccine: () => {
        const activePlayer = gameStore.getActivePlayer();

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    city.vaccine =
                        gameStore.activePlayerIsAction() &&
                        city.index === activePlayer.cityIndex &&
                        city.lab &&
                        game.virusList
                        .filter(virus => virus.active)
                        .find(virus => {
                            const sum = activePlayer.cityIndexList
                                .map(index => game.cityList.find(city => city.index === index))
                                .map(city => city[virus.type])
                                .reduce((a, b) => a + b, 0);

                            return sum >= 5;
                        });

                    return city;
                });

            return game;
        });
    },

    recomputeMoveCity: () => {
        const activePlayer = gameStore.getActivePlayer();

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    city.moveNext = gameStore.activePlayerIsAction() &&
                        game.cityList
                        .find(city => city.index === activePlayer.cityIndex)
                        .linkedCityIndexList.includes(city.index);

                    city.moveLab =
                        gameStore.activePlayerIsAction() &&
                        city.moveNext === false &&
                        city.lab &&
                        game.cityList[activePlayer.cityIndex].lab &&
                        activePlayer.cityIndex !== city.index;

                    city.moveDirect =
                        gameStore.activePlayerIsAction() &&
                        city.moveNext === false &&
                        city.moveLab === false &&
                        activePlayer.cityIndex !== city.index &&
                        activePlayer.cityIndexList.includes(city.index);

                    city.moveEveryWhere =
                        gameStore.activePlayerIsAction() &&
                        city.moveNext === false &&
                        city.moveDirect === false &&
                        city.moveLab === false &&
                        activePlayer.cityIndex !== city.index &&
                        activePlayer.cityIndexList.includes(activePlayer.cityIndex);

                    city.movable = city.moveNext ||
                        city.moveDirect ||
                        city.moveLab ||
                        city.moveEveryWhere;

                    return city;
                });

            return game;
        });
    },

    recompute : async () => {
        let message = null;
        let complete = false;

        update(game => {
            game.playerList = game.playerList
                .map(player => {
                    player.cityList = player.cityIndexList
                        .map(index => game.cityList.find(city => city.index === index));

                    for (let i = 0; i < game.virusList.length; i++) {
                        const virus = game.virusList[i];

                        const sum = player.cityIndexList
                            .map(index => game.cityList.find(city => city.index === index))
                            .map(city => city[virus.type])
                            .reduce((a, b) => a + b, 0);

                        if (sum >= 5 && game.cityList[player.cityIndex].lab) {
                            player.vaccine = virus.type
                        } else {
                            player.vaccine = null;
                        }
                    }

                    return player;
                });

            game.cityList.forEach(city => {
                if (city.virusCount === 0) {
                    city.displayVirusCount = '&nbsp;';
                } else {
                    city.displayVirusCount = city.virusCount;
                }
            });

            game.virusList = game.virusList.map(virus => {
                virus.count = game.cityList.map(city => {
                    if (city[virus.type]) {
                        return city.virusCount;
                    }

                    return 0;
                })
                .reduce((a, b) => a + b, 0);

                if (virus.count === 0) {
                    if (virus.active) {
                        message = `${virus.type} 치료완료`;
                    }

                    virus.active = false;
                }

                return virus;
            });

            const totalVirusCount = game.virusList
                .map(virus => virus.count)
                .reduce((a, b) => a + b);

            if (totalVirusCount === 0) {
                complete = true;
            }

            return game;
        });

        gameStore.recomputeMoveCity();
        gameStore.recomputeVaccine();
        gameStore.recomputeLab();
        gameStore.recomputeCure();
        gameStore.recomputeExchange();

        if (message) {
            await gameStore.showContagionMessage(message);
        }

        if (complete) {
            await gameStore.showContagionMessage("모든 바이러스 치료");
            location.reload();
        }
    },

    showPlayer: async (index) => {
        await move({
            sourceClass: `player-icon-${index}`,
            targetClass: `player-board-icon-${index}`
        })
    },

    removeVirus: async (vaccine) => {
        const activePlayer = gameStore.getActivePlayer();

        update(game => {
            gameStore.action(game);

            game.cityList = game.cityList
                .map(city => {
                    if (city[vaccine.type]) {
                        city.virusCount = 0;
                    }

                    return city;
                });

            game.playerList = game.playerList
                .map(player => {
                    if (player.index === activePlayer.index) {
                        player.vaccine = null;

                        let count = 0;

                        player.cityIndexList = player.cityIndexList
                            .filter(index => {
                                if (count > 5) {
                                    return true;
                                }

                                if (game.cityList[index][vaccine.type]) {
                                    count++;
                                    return false;
                                }

                                return true;
                            });
                    }

                    return player;
                });

            return game;
        });

        gameStore.turn(false);
    },

    getCheckedCityIndex: () => {
        return get(gameStore).checkedCityIndex;
    },

    exchange: async (cityIndex) => {
        const activePlayer = gameStore.getActivePlayer();
        const exchangeCityIndex = gameStore.getCheckedCityIndex();

        update(game => {
            gameStore.action(game);

            game.playerList = game.playerList
                .map(player => {
                    if (player.index === activePlayer.index) {
                        player.cityIndexList = player.cityIndexList
                            .map(index => {
                                if (index !== cityIndex) {
                                    return index;
                                } else {
                                    return exchangeCityIndex;
                                }
                            });
                    } else {
                        player.cityIndexList = player.cityIndexList
                            .map(index => {
                                if (index !== exchangeCityIndex) {
                                    return index;
                                } else {
                                    return cityIndex;
                                }
                            });
                    }

                    return player;
                });

            return game;
        });

        gameStore.turn(false);
    },

    toggleDebug: () => update(game => {
       game.debug = !game.debug;
       return game;
    }),

    vaccinable: () => {
        const game = get(gameStore);
        const activePlayer = gameStore.getActivePlayer();

        if (!game.cityList[activePlayer.cityIndex].lab) {
            return false;
        }

        return game.virusList
            .filter(virus => virus.active)
            .filter(virus => {
                const sum = activePlayer.cityIndexList
                    .map(index => game.cityList.find(city => city.index === index))
                    .map(city => city[virus.type])
                    .reduce((a, b) => a + b, 0);

                return sum >= 5;
            }).length > 0;
    },

    getRandomCityIndex: (virus) => {
        const game = get(gameStore);

        if (game.debug) {
            return gameStore.getRandomCityIndex2();
        }

        let cityIndex = [];

        for (let i = 0; i < 12; i++) {
            cityIndex[i] = i;
        }

        cityIndex = shuffle(cityIndex).slice(0, 3);

        return game.cityList
            .filter(city => city[virus.type])
            .filter((city, index) => cityIndex.includes(index))
            .map(city => city.index);
    },

    getRandomCityIndex2: (virus) => {
        if (virus.black) {
            return [31, 32, 33, 34];
        } else if (virus.red) {
            return [36, 37, 38, 39];
        } else if (virus.yellow) {
            return [20, 21, 22, 23];
        } else if (virus.blue) {
            return [0, 1, 2, 3];
        }
    },

    init: () => {
        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    city.active = true;
                    city.remove = false;
                    return city;
                });

            game.cardList = game.cityList
                .map(city => city.index);

            game.cardList = shuffle(game.cardList);

            return game;
        });

        const initCityCount = 3;
        gameStore.getCity(initCityCount);
        gameStore.changePlayer(false);
        gameStore.getCity(initCityCount);
        gameStore.changePlayer(false);

        update(game => {
            game.usedCardList = [];

            game.cardList = [...game.cardList, -1, -1, -1, -1, -1, -1];
            game.cardList = shuffle(game.cardList);

            game.virusList.forEach(virus => {
                virus[virus.type] = true;

                const cityIndexList = gameStore.getRandomCityIndex(virus);

                game.cityList = game.cityList.map(city => {
                    const indexOf = cityIndexList.indexOf(city.index);

                    if (indexOf >= 0) {
                        city.virusCount = indexOf + 1;
                        city.virusCount = 3;
                        virus.count += city.virusCount;
                    }

                    return city;
                });
            });

            return game;
        });
    },

    getActivePlayer: () => {
        const game = get(gameStore);
        return game.playerList.find(player => player.turn);
    },

    getNoneActivePlayer: () => {
        const game = get(gameStore);
        return game.playerList.find(player => !player.turn);
    },

    findActivePlayer: (game) => {
        return game.playerList.find(player => player.turn);
    },

    build: (currentCity) => {
        gameStore.removeCity(currentCity.index);
        const currentCityIndex = currentCity.index;

        update(game => {
            gameStore.action(game);

            game.labCount -= 1;
            game.cityList = game.cityList
                .map(city => {
                    if (city.index === currentCityIndex) {
                        city.lab = true;
                    }

                    return city;
                });

            return game;
        });

        gameStore.turn(false);
    },

    getCity: async (count) => {
        const cityIndexList = [];

        update(game => {
            for (let i = 0; i < count; i++) {
                if (game.cardList.length === 0) {
                    alert('플레이 모두 사용하였습니다.\n게임 종료되었습니다.');
                    location.reload();
                    return game;
                }

                const card = game.cardList.pop();
                game.usedCardList = [...game.usedCardList, card];
                cityIndexList.push(card);
            }

            return game;
        });

        for (let i = 0; i < cityIndexList.length; i++) {
            if (cityIndexList[i] === -1) {
                let contagionCount = 0;

                update(game => {
                    game.contagionCount = game.contagionCount + 1;
                    contagionCount = game.contagionCount;
                    return game;
                });

                await gameStore.showContagionMessage(`${contagionCount}번째 전염카드`);
                await gameStore.contagion();
            } else {
                update(game => {
                    game.playerList.map(player => {
                        if (player.turn) {
                            player.cityIndexList =
                                [cityIndexList[i], ...player.cityIndexList];
                        }

                        return player;
                    });

                    return game;
                });

                if (count === 2) {
                    await gameStore.recompute();
                    await tick();
                }
            }
        }
    },

    computeRemoveCity: () => {
        const activePlayer = gameStore.getActivePlayer();

        if (activePlayer.cityIndexList.length > 7) {
            update(game => {
                game.cityList = game.cityList
                    .map(city => {
                        city.remove = activePlayer.cityIndexList
                            .includes(city.index);
                        return city;
                    });

                game.removeCity = true;
                return game;
            });

            return false;
        }

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    city.remove = false;
                    return city;
                });

            game.removeCity = false;
            return game;
        });

        return true;

    },

    removeCity: (cityIndex) => {
        const activePlayer = gameStore.getActivePlayer();

        update(game => {
            game.playerList = game.playerList
                .map(player => {
                    player.cityIndexList =
                        player.cityIndexList
                            .filter(index => index !== cityIndex)

                    return player;
                });

            return game;
        });
    },

    removeCityAndTurn: (cityIndex) => {
        gameStore.removeCity(cityIndex);
        const removeComplete = gameStore.computeRemoveCity();
        gameStore.turn(removeComplete);
    },

    changePlayer: async (animation) => {
        update(game => {
            game.playerList = game.playerList
                .map(player => {
                    player.turn = !player.turn;

                    if (player.turn) {
                        player.action = 4;
                    } else {
                        player.action = 0;
                    }

                    return player;
                });

            return game;
        });

        if (animation) {
            const activePlayer = gameStore.getActivePlayer();
            await gameStore.showPlayer(activePlayer.index);
        }
    },

    spread: () => {
        update(game => {
            const activeSpread = game.spreadList
                .find(spread => spread.active);

            if (activeSpread.end) {
                alert('확산이 너무 많이 되었습니다.\n게임 종료되었습니다.');
                location.reload();
            }

            game.spreadList = game.spreadList
                .map((spread, index) => {
                    if (spread.active) {
                        spread.active = false;
                    }

                    if (index === activeSpread.index + 1) {
                        spread.active = true;
                    }

                    return spread;
                });

            return game;
        });
    },

    contagion: async () => {
        update(game => {
            const activeContagion = game.contagionList
                .find(contagion => contagion.active);

            game.contagionList = game.contagionList
                .map((contagion, index) => {
                    if (contagion.active) {
                        contagion.active = false;
                    }

                    if (index === activeContagion.index + 1) {
                        contagion.active = true;
                    }

                    return contagion;
                });

           return game;
        });

        await gameStore.contagionCard();
    },

    getVirus: (targetCity) => {
        const game = get(gameStore);
        return game.virusList.find(virus => targetCity[virus.type]);
    },

    setEnable: async () => {
        update(game => {
            game.ready = true;
            return game;
        });

        await tick();
    },

    setDisable: async () => {
        update(game => {
            game.ready = false;
            return game;
        });

        await tick();
    },

    showContagion: async (targetCity, count, contagionIndex, totalContagionCount) => {
        await gameStore.setDisable();

        const virus = gameStore.getVirus(targetCity);

        if (count === 3) {
            await gameStore.showContagionMessage(`${targetCity.name} 전염 되었습니다.`);
        } else {
            await gameStore.showContagionMessage(`[${contagionIndex}/${totalContagionCount}] ${targetCity.name} 감염 되었습니다.`);
        }

        const speed = 1000;

        await move({
            sourceClass: `virus-${virus.index}`,
            targetClass: `city-${targetCity.index}`,
            initCss: {
                border: '1px solid white'
            },
            speed: speed
        });

        let spread = false;

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    if (city.index === targetCity.index) {
                        city.contagion = true;

                        if (city.virusCount === 3) {
                            spread = true;
                        } else {
                            if (count === 3) {
                                if (city.virusCount > 0) {
                                    spread = true;
                                }

                                city.virusCount = count;
                            } else {
                                city.virusCount += count;
                            }
                        }
                    }

                    return city;
                });

            return game;
        });

        await sleep(1500);

        await gameStore.recompute();

        if (spread) {
            await gameStore.showContagionMessage(`${targetCity.name}의 바이러스가 확산 되었습니다.`);
            gameStore.spread();

            update(game => {
                game.cityList = gameStore.spreadCity(game, targetCity);
                return game;
            });

            await gameStore.recompute();

            await sleep(1500);
        }

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    city.contagion = false;
                    return city;
                });

            return game;
        });

        await sleep(500);

        update(game => {
            game.contagionMessage = '';
            game.ready = true;
            return game;
        });

        await gameStore.setEnable();
    },

    spreadCity: (game, targetCity) => {
        game.cityList = game.cityList
            .map(city => {
                if (targetCity.linkedCityIndexList.includes(city.index)) {
                    if (game.virusList.find(virus => city[virus.type]).active) {
                        if (city.virusCount !== 3) {
                            city.contagion = true;
                            city.virusCount += 1;
                        }
                    }
                }

                return city;
            });

        return game.cityList;
    },

    showContagionMessage: async (message) => {
        update(game => {
            game.contagionMessage = message;
            game.contagionMessageRipple = true;
            return game;
        });

        await sleep(1500);

        update(game => {
            game.contagionMessage = '';
            game.contagionMessageRipple = false;
            return game;
        });
    },

    contagionTurn: async () => {
        const cityList = [];
        const game = get(gameStore);
        const activeContagionCount = game.contagionList
            .find(contagion => contagion.active)
            .count;

        for (let i = 0; i < activeContagionCount; i++) {
            const targetCity = cloneAndShuffle(game.cityList).pop();

            for (let j = 0; j < game.virusList.length; j++) {
                const virus = game.virusList[j];

                if (targetCity[virus.type]) {
                    if (virus.active) {
                        await gameStore.showContagion(targetCity, 1, i + 1, activeContagionCount);
                    } else {
                        const message = `[${i + 1}/${activeContagionCount}] ${targetCity.name}의 ${virus.type} 바이러스는 이미 치료되었습니다.`;
                        await gameStore.showContagionMessage(message);
                    }
                }
            }
        }
    },

    contagionCard: async () => {
        const game = get(gameStore);
        const targetCity = cloneAndShuffle(game.cityList).pop();

        for (let i = 0; i < game.virusList.length; i++) {
            const virus = game.virusList[i];

            if (targetCity[virus.type]) {
                if (virus.active) {
                    await gameStore.showContagion(targetCity, 3);
                } else {
                    await gameStore.showContagionMessage(`${targetCity.name}의 ${virus.type} 바이러스는 이미 치료되었습니다.`);
                }

                break;
            }
        }
    },

    isRemoveCity: () => {
        return get(gameStore).removeCity;
    },

    turn: async (removeComplete) => {
        await gameStore.recompute();
        const activePlayer = gameStore.getActivePlayer();

        if (activePlayer.action === 0) {
            if (gameStore.isRemoveCity()) {
                return;
            }

            if (!removeComplete) {
                await gameStore.getCity(2);
                await sleep(1500);

                gameStore.computeRemoveCity();
                await tick();

                if (gameStore.isRemoveCity()) {
                    return;
                }
            }

            await gameStore.contagionTurn();
            await gameStore.changePlayer(true);
        }

        await gameStore.recompute();

        await tick();
    },

    action: game => {
        game.playerList = game.playerList
            .map(player => {
                if (player.turn) {
                    player.action -= 1;
                }

                return player;
            });
    },

    cure: (currentCity) => {
        const currentCityIndex = currentCity.index;

        update(game => {
            gameStore.action(game);

            game.cityList = game.cityList
                .map(city => {
                    if (city.index === currentCityIndex) {
                        city.virusCount -= 1;
                    }

                    return city;
                });

            return game;
        });

        gameStore.turn(false);
    },

    moveCity: (cityIndex) => {
        const activePlayer = gameStore.getActivePlayer();

        const city = get(gameStore).cityList[cityIndex];

        if (city.moveNext || city.moveLab) {
            gameStore.moveCityAndTurn(cityIndex);
        } else {
            gameStore.moveCityAndRemoveCard(cityIndex);
        }
    },

    moveCityAndTurn: (cityIndex, turn) => {
        update(game => {
            gameStore.action(game);

            game.playerList = game.playerList
                .map(player => {
                    if (player.turn) {
                        player.cityIndex = cityIndex;
                    }

                    return player;
                });

            return game;
        });

        gameStore.turn(false);
    },

    moveCityAndRemoveCard: (cityIndex) => {
        const city = get(gameStore).cityList[cityIndex];
        const activePlayer = gameStore.getActivePlayer();

        update(game => {
            game.playerList = game.playerList
                .map(player => {
                    if (city.moveDirect) {
                        gameStore.removeCity(cityIndex);
                    } else if (city.moveEveryWhere) {
                        gameStore.removeCity(activePlayer.cityIndex);
                    }

                    return player;
                });

            return game;
        });

        gameStore.moveCityAndTurn(cityIndex);
    }
};

gameStore.init();
gameStore.recompute();

export default gameStore;