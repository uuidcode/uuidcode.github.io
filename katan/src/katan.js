import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import config from './config.js'
import jQuery from 'jquery';
import {recomputePlayer} from "./player";
import katanObject from "./katanObject"
import {random} from "./util";
import {makeDev} from "./card";
import {makeRoad, setRoadRippleDisabled, clickMakeRoad} from "./road";
import {setCastleRippleDisabled, makeCastle, makeCity, clickMakeCastle} from "./castle";
import {animateMoveResource, takeResource, moveResource} from "./resource";

const { subscribe, set, update } = writable(katanObject);

const katanStore = {
    subscribe,
    set,
    update,

    turn: () => update(katan => {
        const player = katanStore.getActivePlayer();

        katanStore.setDiceEnabled();
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

        if (katan.isStart) {
            katan.message = '주사위를 굴리세요.';
            katan.diceDisabled = false;
        }

        return katan;
    }),

    start: () => update(katan => {
        katan.message = '주사위를 굴리세요.';

        katan.mode = 'start';
        katan.isStart = true;
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

    moveBuglar: (resourceIndex) => update(katan => {
        if (katan.isKnightMode) {
        } else {
            if (katan.mode !== 'moveBuglar') {
                return katan;
            }
        }

        if (katan.resourceList[resourceIndex].buglar) {
            return katan;
        }

        katan.resourceList = katan.resourceList
            .map(resource => {
                resource.buglar = resource.index === resourceIndex;
                return resource;
            });

        katanStore.setNumberRippleDisabled();

        if (katan.isKnightMode) {
            takeResource();
        } else {
            katanStore.doActionAndTurn();
        }

        katan.mode = 'start';

        return katan;
    }),

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

    doActionAndTurn: () => {
        recomputePlayer();

        if (katanStore.hasAction()) {
            katanStore.doAction();
        } else {
            katanStore.turn();
        }
    },

    doAction: () => update(katan => {
        katan.message = '자원을 교환하거나 건설하세요.';
        katanStore.setDiceDisabled();
        katan.action = true;
        return katan;
    }),

    hasAction: () => {
        const player = katanStore.getActivePlayer();

        return player.trade.tree.enable ||
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

    play: () => update(katan => {
        katanStore.setDiceDisabled();

        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 6) + 1;

        katanStore.roll(a, b);

        let number = a + b;

        if (katan.testDice !== 0) {
            number = katan.testDice;
        }

        console.log('>>> number', number);

        katan.rollDice = true;

        console.log('>>> katan.rollDice', katan.rollDice);

        if (number === 7) {
            katanStore.readyMoveBuglar();
        } else {
            setTimeout(() => {
                let numberCount = 2;

                if (number === 2 || number === 12) {
                    numberCount = 1;
                }

                for (let i = 1; i <= 2; i++) {
                    let sourceClass =  `display-dice-number-${i}`;
                    let targetClass =  `number_${number}_${i}`;

                    if (numberCount === 1) {
                        targetClass =  `number_${number}`;
                    }

                    animateMoveResource({
                        sourceClass,
                        targetClass,
                        width: '172px',
                        height: '172px',
                        lineHeight: '172px',
                        fontSize: '140px',
                        count: 1,
                        animationCss: {
                            width: '70px',
                            height: '70px',
                            fontSize: '50px',
                            lineHeight: '70px'
                        },
                        callback: () => {
                            if (i === 2) {
                                katanStore.setSelectedNumberRippleEnabled(number);

                                setTimeout(() => {
                                    katanStore.setNumberRippleDisabled(number);
                                    moveResource(number);
                                }, 2000);
                            }
                        }
                    });
                }
            }, 500);
        }

        return katan;
    }),

    internalPlay: (number) => {
        katanStore.setSelectedNumberRippleEnabled(number);

        setTimeout(() => {
            katanStore.setNumberRippleDisabled(number);
            moveResource(number);
        }, 2000);
    },

    sumResource: (katan, player) => {
        return katan.resourceTypeList
            .map(typeObject => player.resource[typeObject.type])
            .reduce((a, b) => a + b);
    },

    takeResourceByBuglar: (katan) => {
        katan.playerList.forEach(player => {
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
                const takeResourceFromBuglarCount = katan.takeResourceFromBuglarCount;
                katan.takeResourceFromBuglarCount += resourceCount;

                for (let i = 0; i < resourceCount; i++) {
                    const type = targetResourceList.pop();
                    const sourceClass = `player_${player.index}_${type}`;
                    const targetClass = 'buglar';

                    animateMoveResource({
                        sourceClass,
                        targetClass,
                        count: takeResourceFromBuglarCount + i,
                        callback: () => {
                            katanStore.updatePlayerResource(player.index, type);
                            recomputePlayer();
                        }
                    });
                }
            }
        });
    },

    updatePlayerResource: (playerIndex, type) => update(katan => {
        katan.playerList[playerIndex].resource[type] -= 1;
        katan.takeResourceFromBuglarCompleCount += 1;
        return katan;
    }),

    readyMoveBuglar: () => update(katan => {
        if (katan.isKnightMode) {
            katanStore.internalReadyMoveBuglar(katan);
        } else {
            katanStore.takeResourceByBuglar(katan);

            if (katan.takeResourceFromBuglarCount > 0) {
                const interval = setInterval(() => {
                    if (katan.takeResourceFromBuglarCount ===
                        katan.takeResourceFromBuglarCompleCount ) {
                        katan.takeResourceFromBuglarCount = 0;
                        katan.takeResourceFromBuglarCompleCount = 0;
                        clearInterval(interval);
                        katanStore.internalReadyMoveBuglar(katan);
                    }
                }, 100);
            } else {
                katanStore.internalReadyMoveBuglar(katan);
            }
        }

        return katan;
    }),

    internalReadyMoveBuglar: (katan) => {
        katan.mode = 'moveBuglar';
        katan.message = '도둑의 위치를 선택하세요.';
        katanStore.setNumberRippleEnabled();
        return katan;
    },

    setKnightMode: () => update(katan => {
        katan.isKnightMode = true;
        return katan;
    }),

    unsetKnightMode: () => update(katan => {
        katan.isKnightMode = false;
        return katan;
    }),

    roll: (a, b) => {
        update(katan => {
            katan.dice[0] = a;
            katan.dice[1] = b;
            katan.sumDice = a + b;
            return katan;
        });
    },

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

    makeDev: () => makeDev(),

    getResource: (resourceType) => update(katan => {
        const player = katanStore.getActivePlayer();
        katan.getResourceCount += 1;
        player.resource[resourceType] += 1;

        if (katan.getResourceCount >= 2) {
            katan.isGetResource = false;
            katan.getResourceCount = 0;
        }

        recomputePlayer();

        return katan;
    }),

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

    setSelectedNumberRippleEnabled: (number) => update(katan => {
        katan.resourceList = katan.resourceList
            .map(resource => {
                if (resource.number === number) {
                    resource.numberRipple = true;
                }

                return resource;
            });

        return katan;
    }),

    setNumberRippleEnabled: () => update(katan => {
        katan.resourceList = katan.resourceList
            .map(resource => {
                if (!resource.buglar) {
                    resource.numberRipple = true;
                }

                return resource;
            });

        return katan;
    }),

    setNumberRippleDisabled: () => update(katan => {
        katan.resourceList = katan.resourceList
            .map(resource => {
                resource.numberRipple = false;
                return resource;
            });

        return katan;
    }),

    exchange: (player, resourceType, targetResourceType) => update(katan => {
        player.resource[targetResourceType] += 1;
        player.resource[resourceType] -= player.trade[resourceType].count;
        recomputePlayer();
        return katan;
    }),

    log: (message) => {
        const date = new Date();
        console.log(`>>> ${date.toISOString()} ${message}`);
    },

    isActive: (katan) => {
        return katan.isKnightMode === false &&
            katan.isMakeRoad === false &&
            katan.isMakeCastle === false &&
            katan.isMakeCity === false &&
            katan.rollDice;
    }
};

recomputePlayer();

export default katanStore;