import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import config from './config.js'
import jQuery from 'jquery';
import {recomputePlayer} from "./player";
import katanObject from "./katanObject"
import {random, sleep, move} from "./util";
import {openCard, knightCard, roadCard, takeResourceCard, getResourceCard, getPointCard} from "./card";
import {makeRoad, setRoadRippleDisabled, clickMakeRoad} from "./road";
import {setCastleRippleDisabled, makeCastle, makeCity, clickMakeCastle} from "./castle";
import {takeResource, moveResource} from "./resource";

const { subscribe, set, update } = writable(katanObject);

const katanStore = {
    subscribe,
    set,
    update,

    turn: () => update(katan => {
        const player = katanStore.getActivePlayer();

        if (katanStore.isStartable()) {
            katanStore.setDiceEnabled();
        }

        katanStore.unsetRollDice();
        recomputePlayer();

        katan.playerList = katan.playerList
            .map((player, i) => {
                player.turn = !player.turn;

                if (player.turn) {
                    katan.playerIndex = i;
                }

                return player;
            });

        katan.action = false;

        if (katan.isStartMode) {
            katan.message = '주사위를 굴리세요.';
            katan.diceDisabled = false;
        }

        return katan;
    }),

    start: () => update(katan => {
        katan.message = '주사위를 굴리세요.';

        katan.mode = 'start';
        katan.isStartMode = true;
        katan.isReady = false;

        setCastleRippleDisabled();
        setRoadRippleDisabled();

        katan.castleList = katan.castleList
            .map(castle => {
                if (castle.playerIndex === -1) {
                    castle.show = false;
                    castle.hide = true;
                }

                return castle;
            });

        katanStore.setDiceEnabled();

        return katan;
    }),

    moveBurglar: async (resourceIndex) => {
        const katan = get(katanStore);

        if (katan.resourceList[resourceIndex].burglar) {
            return;
        }

        await takeResource();

        katanStore.unsetBurglarMode();
        katanStore.unsetKnightMode();

        katanStore.setNumberRippleDisabled();

        update(katan => {
            katan.resourceList = katan.resourceList
                .map(resource => {
                    resource.burglar = resource.index === resourceIndex;
                    return resource;
                });

            return katan;
        });

        katanStore.doActionAndTurn();
    },

    setDiceDisabled: () => update(katan => {
        katan.diceDisabled = true;
        return katan;
    }),

    setDiceEnabled: () => update(katan => {
        katan.diceDisabled = false;
        return katan;
    }),

    isVisible: item => {
        return item.is(':visible')
    },

    doActionAndTurn: async () => {
        recomputePlayer();

        const hasAction = katanStore.hasAction();

        console.log('>>> hasAction', hasAction);

        if (hasAction) {
            katanStore.doAction();
        } else {
            katanStore.turn();
        }

        await tick();
    },

    doAction: () => update(katan => {
        katan.message = '자원을 교환하거나 건설하세요.';
        katanStore.setDiceDisabled();
        katan.action = true;
        return katan;
    }),

    hasAction: () => {
        const katan = get(katanStore);
        const player = katanStore.getActivePlayer();

        return katan.isKnightMode ||
            katan.isGetResource ||
            katan.isMakeRoad2Mode ||
            player.trade.tree.enable ||
            player.trade.mud.enable ||
            player.trade.wheat.enable ||
            player.trade.sheep.enable ||
            player.trade.iron.enable ||
            player.make.road ||
            player.make.castle ||
            player.make.city ||
            player.make.dev;
    },

    clickMakeRoad: (roadIndex) => clickMakeRoad(roadIndex),
    clickMakeCastle: (castleIndex) => clickMakeCastle(castleIndex),

    setRollDice: () => update(katan => {
        katan.rollDice = true;
        return katan;
    }),

    unsetRollDice: () => update(katan => {
        katan.rollDice = false;
        return katan;
    }),

    createMoveResourceAnimationOption : (number, numberIndex, numberCount) => {
        let sourceClass = `display-dice-number-${numberIndex}`;
        let targetClass = `number_${number}_${numberIndex}`;

        if (numberCount === 1) {
            targetClass = `number_${number}`;
        }

        return {
            sourceClass,
            targetClass,
            animationCss: {
                width: '70px',
                height: '70px',
                fontSize: '50px',
                lineHeight: '70px'
            }
        }
    },

    play: async () => {
        katanStore.roll();

        await tick();

        const katan = get(katanStore);
        const number = katan.sumDice;

        console.log('play', katan.playerIndex, number);

        let numberCount = 2;

        if (number === 2 || number === 7 || number === 12) {
            numberCount = 1;
        }

        if (numberCount === 1) {
            const animationPromiseList = [];

            for (let i = 1; i <= 2; i++) {
                const moveResourceAnimationOption = katanStore
                    .createMoveResourceAnimationOption(number, i, numberCount);

                animationPromiseList.push(move(moveResourceAnimationOption));
            }

            await Promise.all(animationPromiseList);

            katanStore.setSelectedNumberRippleEnabled(number);
            await sleep(1500);

            katanStore.setNumberRippleDisabled(number);

            if (number === 7) {
                await katanStore.takeResourceByBurglar();
                katanStore.setBurglarMode();
                katanStore.readyMoveBurglar();
                return;
            } else {
                await moveResource(number);
            }
        } else {
            for (let i = 1; i <= 2; i++) {
                const moveResourceAnimationOption = katanStore
                    .createMoveResourceAnimationOption(number, i, numberCount);

                await move(moveResourceAnimationOption);

                katanStore.setSelectedNumberRippleEnabled(number, i);
                await sleep(1500);

                katanStore.setNumberRippleDisabled(number, i);
                await moveResource(number, i);
            }
        }

        katanStore.doActionAndTurn();
    },

    sumResource: (katan, player) => {
        return katan.resourceTypeList
            .map(typeObject => player.resource[typeObject.type])
            .reduce((a, b) => a + b);
    },

    takeResourceByBurglar: async () => {
        const katan = get(katanStore);

        for (let i = 0; i < katan.playerList.length; i++) {
            const player = katan.playerList[i];
            const resourceSum = katanStore.sumResource(katan, player);

            if (resourceSum >= 8) {
                const resourceCount = Math.floor(resourceSum / 2);
                let targetResourceList = [];

                katan.resourceTypeList
                    .forEach(typeObject => {
                        const count = player.resource[typeObject.type];

                        for (let i = 0; i < count; i++) {
                            targetResourceList.push(typeObject.type);
                        }
                    });

                targetResourceList = targetResourceList.sort(random());

                for (let j = 0; j < resourceCount; j++) {
                    const type = targetResourceList.pop();
                    const sourceClass = `player_${player.index}_${type}`;
                    const targetClass = 'burglar';

                    await move({
                        sourceClass,
                        targetClass
                    });

                    katanStore.updatePlayerResource(player.index, type);
                    recomputePlayer();
                }
            }
        }
    },

    updatePlayerResource: (playerIndex, type) => update(katan => {
        const player = katan.playerList[playerIndex];
        player.resource[type] -= 1;
        return katan;
    }),

    readyMoveBurglar: () => update(katan => {
        katan.message = '도둑의 위치를 선택하세요.';
        katanStore.setNumberRippleEnabled();
        return katan;
    }),

    setKnightMode: () => update(katan => {
        katan.isKnightMode = true;
        return katan;
    }),

    unsetKnightMode: () => update(katan => {
        katan.isKnightMode = false;
        return katan;
    }),

    setMakeRoad2Mode: () => update(katan => {
        katan.isMakeRoad2Mode = true;
        return katan;
    }),

    unsetMakeRoad2Mode: () => update(katan => {
        katan.isMakeRoad2Mode = false;
        return katan;
    }),

    setBurglarMode: () => update(katan => {
        katan.isBurglarMode = true;
        return katan;
    }),

    unsetBurglarMode: () => update(katan => {
        katan.isBurglarMode = false;
        return katan;
    }),

    setTakeResourceMode: () => update(katan => {
        katan.isTakeResource = true;
        return katan;
    }),

    unsetTakeResourceMode: () => update(katan => {
        katan.isTakeResource = false;
        return katan;
    }),

    setGetResourceMode: () => update(katan => {
        katan.isGetResource = true;
        return katan;
    }),

    unsetGetResourceMode: () => update(katan => {
        katan.isGetResource = false;
        return katan;
    }),

    roll: () => update(katan => {
        katanStore.setDiceDisabled();
        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 6) + 1;

        let number = a + b;

        if (katan.testDice !== 0) {
            number = katan.testDice;
        }

        console.log('>>> number', number);

        katan.rollDice = true;

        console.log('>>> katan.rollDice', katan.rollDice);

        katan.dice[0] = a;
        katan.dice[1] = b;
        katan.sumDice = number;
        return katan;
    }),

    getNumber: () => katan.dice[0] =  + katan.dice[1],

    isStartable: () => {
        const katan = get(katanStore);

        let pickCompletePlayerLength = katan.playerList
            .filter(player => player.pickCastle === 2)
            .filter(player => player.pickRoad === 2)
            .length;

        return pickCompletePlayerLength === katan.playerList.length;
    },

    getActivePlayer: () => {
        const katan = get(katanStore);
        return katan.playerList[katan.playerIndex];
    },

    getCurrentPlayer: (katan) => {
        return katan.playerList
            .find(player => player.turn);
    },

    makeRoad: () => makeRoad(),

    openCard: () => openCard(),

    getResource: (resourceType) => {
        update(katan => {
            const player = katanStore.getActivePlayer();
            katan.getResourceCount += 1;
            player.resource[resourceType] += 1;

            if (katan.getResourceCount >= 2) {
                katan.isGetResource = false;
                katan.getResourceCount = 0;
            }

            return katan;
        });

        const katan = get(katanStore);

        if (!katan.isGetResource) {
            katanStore.doActionAndTurn();
        }
    },

    getOtherPlayer: (katan) => {
        let playerIndex = katan.playerIndex;

        if (playerIndex === 0) {
            playerIndex = 1;
        } else {
            playerIndex = 0;
        }

        return katan.playerList[playerIndex];
    },

    makeCastle: () => makeCastle(),

    makeCity: () => makeCity(),

    setRoadRippleDisabled: () => setRoadRippleDisabled(),

    setSelectedNumberRippleEnabled: (number, numberIndex = 1) => update(katan => {
        katan.resourceList = katan.resourceList
            .map(resource => {
                if (resource.number === number &&
                    resource.numberIndex === numberIndex) {
                    resource.numberRipple = true;
                }

                return resource;
            });

        return katan;
    }),

    setNumberRippleEnabled: () => update(katan => {
        katan.resourceList = katan.resourceList
            .map(resource => {
                if (!resource.burglar) {
                    resource.numberRipple = true;
                }

                return resource;
            });

        return katan;
    }),

    setNumberRippleDisabled: (number = 0, numberIndex = 1) => update(katan => {
        katan.resourceList = katan.resourceList
            .map(resource => {
                if (number === 0 ||
                    (resource.number === number && resource.numberIndex === numberIndex)) {
                    resource.numberRipple = false;
                }

                return resource;
            });

        return katan;
    }),

    exchange: (resourceType, targetResourceType) => {
        update(katan => {
            const player = katanStore.getCurrentPlayer(katan);
            player.resource[targetResourceType] += 1;
            player.resource[resourceType] -= player.trade[resourceType].count;
            return katan;
        });

        katanStore.doActionAndTurn();
    },

    isActive: (katan) => {
        return katan.isKnightMode === false &&
            katan.isMakeRoadMode === false &&
            katan.isMakeCastle === false &&
            katan.isMakeCity === false &&
            katan.rollDice;
    },

    test: () => {
        update(katan => {
            katan.playerList = katan.playerList
                .map(player => {
                    player.resource.tree = 5;
                    player.resource.mud = 5;
                    player.resource.wheat = 5;
                    player.resource.sheep = 5;
                    player.resource.iron = 5;

                    return player;
                });

            return katan;
        });

        recomputePlayer();
    },

    plusPoint: () => update(katan => {
        const player = katanStore.getActivePlayer();
        player.point.point += 1;
        return katan;
    }),

    testKnightCard: () => update(katan => {
        katan.cardList = [...katan.cardList, {type: 'knight'}];
        return katan;
    }),

    testRoadCard: () => update(katan => {
        katan.cardList = [...katan.cardList, {type: 'road'}];
        return katan;
    }),

    testTakeResourceCard: () => update(katan => {
        katan.cardList = [...katan.cardList, {type: 'takeResource'}];
        return katan;
    }),

    testGetPointCard: () => update(katan => {
        katan.cardList = [...katan.cardList, {type: 'point'}];
        return katan;
    }),

    testGetResourceCard: () => update(katan => {
        katan.cardList = [...katan.cardList, {type: 'getResource'}];
        return katan;
    })
};

recomputePlayer();

export default katanStore;