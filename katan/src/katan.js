import {writable} from "svelte/store";
import config from './config.js'
import { getDisplay } from './util.js'

let katan = {
    dice: [6, 6],
    mode: 'ready',
    playerList: [
        {
            color: 'lightblue',
            name: '다은',
            turn: true,
            pickCastle: true,
            pickRoad: false,
            resource: {
                tree: 0,
                mud: 0,
                wheat: 0,
                sheep: 0,
                iron: 0
            },
            index: 0
        },
        {
            color: 'lightcoral',
            name: '아빠',
            turn: false,
            pickCastle: false,
            pickRoad: false,
            resource: {
                tree: 0,
                mud: 0,
                wheat: 0,
                sheep: 0,
                iron: 0
            },
            index: 1
        }
    ]
};


function random() {
    return () => Math.random() - 0.5;
}

function shuffle(list) {
    return list.sort(random());
}

katan.castleList = [];

for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 11; j++) {
        if (i === 0 || i === 5) {
            if (j >= 2 && j <= 8) {
                let top = 0;

                if (i === 5) {
                    top = i * (3 * config.cell.height / 4);
                }

                if (j % 2 === i % 2) {
                    top += config.cell.height / 4
                }

                katan.castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    ripple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 1 || i === 4) {
            if (j >= 1 && j <= 9) {
                let top = (3 * config.cell.height / 4);

                if (i === 4) {
                    top = i * (3 * config.cell.height / 4);
                }

                if (j % 2 === i % 2) {
                    top += config.cell.height / 4
                }

                const constructable = j >= 3 && j <= 7;

                katan.castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    ripple: constructable,
                    constructable: constructable,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 2 || i === 3) {
            let top = 2 * (3 * config.cell.height / 4);

            if (i === 3) {
                top = i * (3 * config.cell.height / 4);
            }

            if (j % 2 === i % 2) {
                top += config.cell.height / 4
            }

            const constructable = j >= 2 && j <= 8;

            katan.castleList.push({
                left: j * (config.cell.width / 2) - config.castle.width / 2,
                top: top - config.castle.height / 2,
                ripple: constructable,
                constructable: constructable,
                empty: true,
                i,
                j
            });
        }
    }
}

katan.castleList.forEach((castle, index) => castle.index = index);
katan.castleList.forEach((castle) => castle.playerIndex = -1);

katan.castleList[0].roadList = [0, 6];
katan.castleList[1].roadList = [0, 1];
katan.castleList[2].roadList = [1, 2, 7];
katan.castleList[3].roadList = [2, 3];
katan.castleList[4].roadList = [3, 4, 8];
katan.castleList[5].roadList = [4, 5];
katan.castleList[6].roadList = [5, 9];

katan.castleList[7].roadList = [18, 10];
katan.castleList[8].roadList = [6, 10, 11];
katan.castleList[9].roadList = [11, 12, 19];
katan.castleList[10].roadList = [7, 12, 13];
katan.castleList[11].roadList = [13, 14, 20];
katan.castleList[12].roadList = [8, 14, 15];
katan.castleList[13].roadList = [15, 16, 21];
katan.castleList[14].roadList = [9, 16, 17];
katan.castleList[15].roadList = [17, 22];

katan.castleList[16].roadList = [23, 33];
katan.castleList[17].roadList = [18, 23, 24];
katan.castleList[18].roadList = [24, 25, 34];
katan.castleList[19].roadList = [19, 25, 26];
katan.castleList[20].roadList = [26, 27, 35];
katan.castleList[21].roadList = [20, 27, 28];
katan.castleList[22].roadList = [28, 29, 36];
katan.castleList[23].roadList = [21, 29, 30];
katan.castleList[24].roadList = [30, 31, 37];
katan.castleList[25].roadList = [22, 31, 32];
katan.castleList[26].roadList = [32, 38];

katan.castleList[27].roadList = [33, 39];
katan.castleList[28].roadList = [39, 40, 49];
katan.castleList[29].roadList = [34, 40, 41];
katan.castleList[30].roadList = [41, 42, 50];
katan.castleList[31].roadList = [35, 42, 43];
katan.castleList[32].roadList = [43, 44, 51];
katan.castleList[33].roadList = [36, 44, 45];
katan.castleList[34].roadList = [45, 46, 52];
katan.castleList[35].roadList = [37, 46, 47];
katan.castleList[36].roadList = [47, 48, 53];
katan.castleList[37].roadList = [38, 48];

katan.castleList[38].roadList = [49, 54];
katan.castleList[39].roadList = [54, 55, 62];
katan.castleList[40].roadList = [50, 55, 56];
katan.castleList[41].roadList = [56, 57, 63];
katan.castleList[42].roadList = [51, 57, 58];
katan.castleList[43].roadList = [58, 59, 64];
katan.castleList[44].roadList = [52, 59, 60];
katan.castleList[45].roadList = [60, 61, 65];
katan.castleList[46].roadList = [53, 61];

katan.castleList[47].roadList = [62, 66];
katan.castleList[48].roadList = [66, 67];
katan.castleList[49].roadList = [63, 67, 68];
katan.castleList[50].roadList = [68, 69];
katan.castleList[51].roadList = [64, 69, 70];
katan.castleList[52].roadList = [70, 71];
katan.castleList[53].roadList = [65, 71];

katan.roadList = [];

const getLoadTopBySingle = (multiple) => {
    return multiple * config.cell.height / 8 - config.load.width / 2 ;
};

const getLoadTop = (currentRow, targetRow, currentMultiple, targetMultiple) => {
    let multiple = currentMultiple;

    if (currentRow === targetRow) {
        multiple = targetMultiple;
    }

    return getLoadTopBySingle(multiple) ;
};

for (let i = 0; i <= 11; i++) {
    for (let j = 0; j <= 20; j++) {
        if (i === 0 || i === 11) {
            if (j === 5 || j === 7 || j === 9 || j === 11 || j === 13 || j === 15) {
                let top = getLoadTop(i, 11, 1, 31);

                katan.roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    roadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 1 || i === 10) {
            if (j === 4 || j === 8 || j === 12 || j === 16) {
                let top = getLoadTop(i, 10, 4, 28);

                katan.roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    roadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j

                });
            }
        } else if (i === 2 || i === 9) {
            if (j === 3 || j === 5 || j === 7 || j === 9 ||
                j === 11 || j === 13 || j === 15 || j === 17) {
                let top = getLoadTop(i, 9, 7, 25);

                katan.roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    roadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 3 || i === 8) {
            if (j === 2 || j === 6 || j === 10 || j === 14 || j === 18) {

                let top = getLoadTop(i, 8, 10, 22);

                katan.roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    roadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 4 || i === 7) {
            if (j === 1 || j === 3 || j === 5 || j === 7 || j === 9 ||
                j === 11 || j === 13 || j === 15 || j === 17 || j === 19) {

                let top = getLoadTop(i, 7, 13, 19);

                katan.roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    roadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        } else if (i === 5) {
            if (j === 0 || j === 4 || j === 8 || j === 12 || j === 16 || j === 20) {
                let top = getLoadTopBySingle(16);

                katan.roadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    roadRipple: false,
                    constructable: false,
                    empty: true,
                    i,
                    j
                });
            }
        }
    }
}

katan.roadList.forEach((road, index) => road.index = index);
katan.roadList.forEach(road => road.hide = true);
katan.roadList.forEach(road => road.show = false);
katan.roadList.forEach(road => road.ripple = false);
katan.roadList.forEach(road => road.playerIndex = -1);

katan.roadList[0].castleList = [0, 1];
katan.roadList[1].castleList = [1, 2];
katan.roadList[2].castleList = [2, 3];
katan.roadList[3].castleList = [3, 4];
katan.roadList[4].castleList = [4, 5];
katan.roadList[5].castleList = [5, 6];

katan.roadList[6].castleList = [0, 8];
katan.roadList[7].castleList = [2, 10];
katan.roadList[8].castleList = [4, 12];
katan.roadList[9].castleList = [6, 14];

katan.roadList[10].castleList = [7, 8];
katan.roadList[11].castleList = [8, 9];
katan.roadList[12].castleList = [9, 10];
katan.roadList[13].castleList = [10, 11];
katan.roadList[14].castleList = [11, 12];
katan.roadList[15].castleList = [12, 13];
katan.roadList[16].castleList = [13, 14];
katan.roadList[17].castleList = [14, 15];

katan.roadList[18].castleList = [7, 17];
katan.roadList[19].castleList = [9, 19];
katan.roadList[20].castleList = [11, 21];
katan.roadList[21].castleList = [13, 23];
katan.roadList[22].castleList = [15, 25];

katan.roadList[23].castleList = [16, 17];
katan.roadList[24].castleList = [17, 18];
katan.roadList[25].castleList = [18, 19];
katan.roadList[26].castleList = [19, 20];
katan.roadList[27].castleList = [20, 21];
katan.roadList[28].castleList = [21, 22];
katan.roadList[29].castleList = [22, 23];
katan.roadList[30].castleList = [23, 24];
katan.roadList[31].castleList = [24, 25];
katan.roadList[32].castleList = [25, 26];

katan.roadList[33].castleList = [16, 27];
katan.roadList[34].castleList = [18, 29];
katan.roadList[35].castleList = [20, 31];
katan.roadList[36].castleList = [22, 33];
katan.roadList[37].castleList = [24, 35];
katan.roadList[38].castleList = [26, 37];

katan.roadList[39].castleList = [27, 28];
katan.roadList[40].castleList = [28, 29];
katan.roadList[41].castleList = [29, 30];
katan.roadList[42].castleList = [30, 31];
katan.roadList[43].castleList = [31, 32];
katan.roadList[44].castleList = [32, 33];
katan.roadList[45].castleList = [33, 34];
katan.roadList[46].castleList = [34, 35];
katan.roadList[47].castleList = [35, 36];
katan.roadList[48].castleList = [36, 37];

katan.roadList[49].castleList = [28, 38];
katan.roadList[50].castleList = [30, 40];
katan.roadList[51].castleList = [32, 42];
katan.roadList[52].castleList = [34, 44];
katan.roadList[53].castleList = [36, 46];

katan.roadList[54].castleList = [38, 39];
katan.roadList[55].castleList = [39, 40];
katan.roadList[56].castleList = [40, 41];
katan.roadList[57].castleList = [41, 42];
katan.roadList[58].castleList = [42, 43];
katan.roadList[59].castleList = [43, 44];
katan.roadList[60].castleList = [44, 45];
katan.roadList[61].castleList = [45, 46];

katan.roadList[62].castleList = [39, 47];
katan.roadList[63].castleList = [41, 49];
katan.roadList[64].castleList = [43, 51];
katan.roadList[65].castleList = [45, 53];

katan.roadList[66].castleList = [47, 48];
katan.roadList[67].castleList = [48, 49];
katan.roadList[68].castleList = [49, 50];
katan.roadList[69].castleList = [50, 51];
katan.roadList[70].castleList = [51, 52];
katan.roadList[71].castleList = [52, 53];

let resourceList = [];

resourceList.push({
    type: 'dessert'
});

for (let i = 0; i < 4; i++) {
    resourceList.push({
        type: 'tree'
    });

    resourceList.push({
        type: 'iron'
    });

    resourceList.push({
        type: 'sheep'
    });
}

for (let i = 0; i < 3; i++) {
    resourceList.push({
        type: 'mud'
    });

    resourceList.push({
        type: 'wheat'
    });
}

katan.resourceList = resourceList;

katan.turn = () => {
    katan.playerList
        .forEach(player => {
            player.turn = !player.turn
        });
};

let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
numberList = shuffle(numberList);

katan.resourceList = katan.resourceList
    .map((resource, index) => {
        if (resource.type === 'dessert') {
            resource.number = 7;
        } else {
            resource.number = numberList.pop();
        }

        return resource;
    })
    .sort(random())
    .map((resource, index) => {
        let left = 0;
        let top = 0;

        if (0 <= index && index <= 2) {
            left = config.cell.width + config.cell.width * index;
        } else if (3 <= index && index <= 6) {
            left = config.cell.width / 2 + config.cell.width * (index - 3);
            top = 3 * config.cell.height / 4;
        } else if (7 <= index && index <= 11) {
            left = config.cell.width * (index - 7);
            top = 2 * (3 * config.cell.height / 4);
        } else if (12 <= index && index <= 15) {
            left = config.cell.width / 2 + config.cell.width * (index - 12);
            top = 3 * (3 * config.cell.height / 4);
        } else if (16 <= index && index <= 18) {
            left = config.cell.width * (index - 15);
            top = 4 * (3 * config.cell.height / 4);
        }

        resource.left = left;
        resource.top = top;

        return resource;
    });

const { subscribe, set, update } = writable(katan);

const katanStore = {
    subscribe,

    isReady: () => katan.mode === 'ready',

    isStart: () => katan.mode === 'start',

    start: () => update(katan => {
        katan.mode = 'start';
        return katan;
    }),

    roll: (a, b) => update(katna => {
        katna.dice[0] = a;
        katna.dice[1] = b;
        return katan;
    }),

    getNumber: () => katna.dice[0] =  + katna.dice[1],

    getActivePlayer: () => {
        return katan.playerList
            .find(player => player.turn);
    },

    turn: () => update(katan => {
        katan.playerList = katan.playerList
            .map(player => {
                player.turn = !player.turn
                return player;
            });

        return katan;
    }),

    setCastle: (castleIndex, playerIndex) => update(katan => {
        let castle = katan.castleList[castleIndex];
        castle.playerIndex = playerIndex;
        castle.pick = false;
        return katan;
    }),

    setRoad: (roadIndex, playerIndex) => update(katan => {
        let road = katan.roadList[roadIndex];
        road.playerIndex = playerIndex;
        road.pick = false;
        return katan;
    }),

    setPickRoadMode: () => update(katan => {
        let player = katanStore.getActivePlayer();
        player.pickCastle = false;
        player.pickRoad = true;

        return katanStore._setRoadRippleEnabled(katan);
    }),

    setRoadRippleEnabled: () => update(katanStore._setRoadRippleEnabled),

    _setRoadRippleEnabled: katan => {
        katan.roadList = katan.roadList
            .map(road => {
                let player = katanStore.getActivePlayer();
                let playerIndex = player.index;

                let castleIndexList = katan.castleList
                    .filter(castle => castle.playerIndex === playerIndex)
                    .map(castle => castle.index);

                let linkCount = road.castleList
                    .filter(castleIndex => castleIndexList.includes(castleIndex))
                    .length;

                if (linkCount > 0) {
                    road.ripple = true;
                    road.hide = false;
                    road.show = true;
                }

                return road;
            });

        return katan;
    },

    _setCastleRippleEnabled: katan => {
        katan.caList = katan.caList.map(castle => {
            castle.ripple = true;
            return castle;
        });

        return katan;
    },

    _setCastleRippleDisabled: katan => {
        katan.castleList =  katan.castleList.map(castle => {
            castle.ripple = false;
            return castle;
        });

        return katan;
    },

    setCastleRippleDisabled: () => update(katanStore._setCastleRippleDisabled),

    setShowRoad: () => update(katanStore._setShowRoad),

    _setShowRoad: katan => {
        katan.roadList = katan.roadList.map(road => {
            road.show = true;
            road.hide = false;
            return road;
        });

        return katan;
    },

    setHideCastle: () => update(katanStore._setHideCastle),

    _setHideCastle: katan => {
        katan.castleList =  katan.castleList
            .map(castle => {
                if (castle.playerIndex === -1) {
                    castle.show = false;
                    castle.hide = true;
                }

                return castle;
            });

        return katan;
    },

    setShowCastle: () => update(katanStore._setShowCastle),

    _setShowCastle: katan => {
        katan.castleList =  katan.castleList
            .map(castle => {
                if (castle.playerIndex === -1) {
                    castle.show = true;
                    castle.hide = false;
                }

                return castle;
            });

        return katan;
    },
};

export default katanStore;