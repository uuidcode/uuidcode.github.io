import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import {cloneAndShuffle, shuffle, sleep, move} from "./util"
import gameObject from "./gameObject"

const { subscribe, set, update } = writable(gameObject);

const startCity = cloneAndShuffle(gameObject.cityList).pop();

gameObject.playerList.forEach(player => {
    player.cityIndex = startCity.index;
});

gameObject.cityList.forEach(city => {
    city.lab = false;
});

gameObject.cityList[startCity.index].lab = true;

const gameStore = {
    subscribe,
    set,
    update,
    recompute : async () => {
        let message1 = null;
        let message2 = null;

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
                        message1 = `${virus.type} 치료완료`;
                    }

                    virus.active = false;
                }

                return virus;
            });

            const totalVirusCount = game.virusList
                .map(virus => virus.count)
                .reduce((a, b) => a + b);

            if (totalVirusCount === 0) {
                message2 = '모든 바이러스 치료';
            }

            return game;
        });

        if (message1) {
            await gameStore.showContagionMessage(message1);
        }

        if (message2) {
            await gameStore.showContagionMessage(message2);
        }
    },

    removeVirus: async (vaccine) => {
        const activePlayer = gameStore.getActivePlayer();

        update(game => {
            game.cityList = game.cityList
                .map(city => {
                    if (city[vaccine]) {
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

                                if (game.cityList[index][vaccine]) {
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

        await gameStore.recompute();
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
        let cityIndex = [];

        for (let i = 0; i < 12; i++) {
            cityIndex[i] = i;
        }

        cityIndex = shuffle(cityIndex).slice(0, 3);

        return get(gameStore).cityList
            .filter(city => city[virus.type])
            .filter((city, index) => cityIndex.includes(index))
            .map(city => city.index);
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
        gameStore.changePlayer();
        gameStore.getCity(initCityCount);
        gameStore.changePlayer();

        update(game => {
            game.usedCardList = [];

            game.cardList = [...game.cardList, -1, -1, -1, -1, -1, -1];

            // game.cardList = [...game.cardList];
            game.cardList = shuffle(game.cardList);

            game.virusList.forEach(virus => {
                virus.black = virus.type === 'black';
                virus.red = virus.type === 'red';
                virus.blue = virus.type === 'blue';
                virus.yellow = virus.type === 'yellow';

                const cityIndexList = gameStore.getRandomCityIndex(virus);

                game.cityList = game.cityList.map(city => {
                    const indexOf = cityIndexList.indexOf(city.index);

                    if (indexOf >= 0) {
                        city.virusCount = indexOf + 1;
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

    findActivePlayer: (game) => {
        return game.playerList.find(player => player.turn);
    },

    movable: (currentCity) => {
        const game = get(gameStore);
        const activePlayer = gameStore.getActivePlayer();

        if (activePlayer.action === 0) {
            return false;
        }

        if (activePlayer.cityIndex === currentCity.index) {
            return false;
        }

        if (!game.ready) {
            return false;
        }

        return game.cityList
            .find(city => city.index === activePlayer.cityIndex)
            .linkedCityIndexList.includes(currentCity.index) ||
            activePlayer.cityList
                .find(city => city.index === currentCity.index);
    },

    buildable: (currentCity) => {
        const game = get(gameStore);
        const activePlayer = gameStore.getActivePlayer();

        if (activePlayer.action === 0) {
            return false;
        }

        return game.ready &&
            game.labCount > 0 &&
            !game.cityList[currentCity.index].lab &&
            currentCity.index === activePlayer.cityIndex;
    },

    build: (currentCity) => {
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

    curable: (currentCity) => {
        const game = get(gameStore);
        const activePlayer = gameStore.getActivePlayer();

        if (activePlayer.action === 0) {
            return false;
        }

        return game.ready &&
            currentCity.index === activePlayer.cityIndex &&
            currentCity.virusCount > 0
    },

    getCity: async (count) => {
        const cityIndexList = [];

        update(game => {
            for (let i = 0; i < count; i++) {
                if (game.cardList.length === 0) {
                    alert('플레이 모두 사용하였습니다.\n게임 종료되었습니다.');
                    return game;
                }

                const card = game.cardList.pop();
                game.usedCardList = [...game.usedCardList, card];
                cityIndexList.push(card);
            }

            return game;
        });

        console.log('>>> getCity cityIndexList', cityIndexList);

        for (let i = 0; i < cityIndexList.length; i++) {
            if (cityIndexList[i] === -1) {
                await gameStore.showContagionMessage('전염카드');
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
                    if (player.index === activePlayer.index) {
                        player.cityIndexList =
                            player.cityIndexList
                                .filter(index => index !== cityIndex)
                    }

                    return player;
                });

            return game;
        });

        const removeComplete = gameStore.computeRemoveCity();
        gameStore.turn(removeComplete);
    },

    changePlayer: () => {
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
    },

    spread: () => {
        update(game => {
            const activeSpread = game.spreadList
                .find(spread => spread.active);

            if (activeSpread.end) {
                alert('확산이 너무 많이 되었습니다.\n게임 종료되었습니다.');
                return game;
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

    showContagion: async (targetCity, count) => {
        console.log('>>> showContagion', targetCity, count);

        await gameStore.setDisable();

        const virus = gameStore.getVirus(targetCity);

        await gameStore.showContagionMessage(`${targetCity.name} 감염되었습니다.`);

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
        let spread = true;

        // game.cityList = game.cityList
        //     .map(city => {
        //         if (targetCity.index === city.index) {
        //             if (game.virusList.find(virus => city[virus.type]).active) {
        //                 if (city.virusCount === 3) {
        //                     spread = true;
        //                     gameStore.spread();
        //                 } else {
        //                     city.virusCount += 1;
        //                 }
        //             }
        //         }
        //
        //         return city;
        //     });

        if (spread) {
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
        }

        return game.cityList;
    },

    showContagionMessage: async (message) => {
        update(game => {
            game.contagionMessage = message;
            game.contagionMessageRipple = true;
            return game;
        });

        await sleep(1000);

        update(game => {
            game.contagionMessage = '';
            game.contagionMessageRipple = false;
            return game;
        });
    },

    contagionTurn: async () => {
        console.log('>>> contagionTurn');

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
                        await gameStore.showContagion(targetCity, 1);
                    } else {
                        gameStore.showContagionMessage(`${targetCity.name}의 ${virus.type} 바이러스는 이미 치료되었습니다.`);
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
            gameStore.changePlayer();
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

        const neighbor = get(gameStore).cityList[activePlayer.cityIndex]
            .linkedCityIndexList.includes(cityIndex);

        if (neighbor) {
            gameStore.moveCityAndTurn(cityIndex, true);
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

        if (turn) {
            gameStore.turn(false);
        }
    },

    moveCityAndRemoveCard: (cityIndex) => {
        gameStore.moveCityAndTurn(cityIndex, false);

        const activePlayer = gameStore.getActivePlayer();

        update(game => {
           game.playerList = game.playerList
               .map(player => {
                   if (player.index === activePlayer.index) {
                       player.cityIndexList = player.cityIndexList
                           .filter(index => index !== cityIndex)
                   }

                   return player;
               });

           return game;
        });

        gameStore.turn(false);
    }
};

gameStore.init();
gameStore.recompute();

export default gameStore;