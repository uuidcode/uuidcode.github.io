import {tick} from 'svelte'
import {writable, get} from "svelte/store";
import config from './config.js'
import { getDisplay, sleep } from './util.js'
import jQuery from 'jquery';

let katanObject = {
    testDice: 0,
    maxRoadLength: 0,
    resourceTypeList: [
        {
            type: 'tree'
        },
        {
            type: 'mud'
        },
        {
            type: 'wheat'
        },
        {
            type: 'sheep'
        },
        {
            type: 'iron'
        }
    ],
    rollDice: false,
    action: false,
    isGetResource: false,
    isGetResourceFormOtherPlayer: false,
    isMakeRoad: false,
    isMakeRoad2: false,
    makeRoadCount: 0,
    getResourceCount: 0,
    takeResourceFromBuglarCount: 0,
    takeResourceFromBuglarCompleCount: 0,
    isMakeCastle: false,
    isMakeCity: false,
    construction: false,
    isKnightMode: false,
    message: '마을을 만들곳을 클릭하세요',
    diceDisabled: true,
    dice: [6, 6],
    sumDice: 12,
    mode: 'ready',
    isReady: true,
    isStart: false,
    playerIndex: 0,
    showResourceModal: false,
    playerList: [
        {
            color: '#E4A2AE',
            name: '다은',
            turn: true,
            pickCastle: 0,
            pickRoad: 0,
            image: 'apeach.png',
            maxRoadLength: 0
        },
        {
            color: '#90CDEA',
            name: '아빠',
            turn: false,
            pickCastle: 0,
            pickRoad: 0,
            image: 'lion.png',
            maxRoadLength: 0
        }
    ]
};

katanObject.cardList = [];
katanObject.afterCardList = [];

for (let i = 0; i < 5; i++) {
    katanObject.cardList.push({
        type: 'point'
    })
}

for (let i = 0; i < 14; i++) {
    katanObject.cardList.push({
        type: 'knight'
    })
}

for (let i = 0; i < 2; i++) {
    katanObject.cardList.push({
        type: 'road'
    });
}

for (let i = 0; i < 2; i++) {
    katanObject.cardList.push({
        type: 'resource'
    });
}

for (let i = 0; i < 2; i++) {
    katanObject.cardList.push({
        type: 'get'
    });
}

katanObject.cardList = shuffle(katanObject.cardList);

katanObject.playerList.forEach((player, i) => {
    player.index = i;

    player.pickCastle =  0;
    player.pickRoad = 0;

    player.resource = {
        tree: 5,
        mud: 5,
        wheat: 5,
        sheep: 5,
        iron: 5
    };

    player.point = {
        knight: 0,
        road: 0,
        point: 0,
        castle: 0,
        city: 0,
        sum: 0
    };

    player.trade = {
        tree: {
            enable: false,
            action: false,
            count: 4
        },
        mud: {
            enable: false,
            action: false,
            count: 4
        },
        wheat: {
            enable: false,
            action: false,
            count: 4
        },
        sheep: {
            enable: false,
            action: false,
            count: 4
        },
        iron: {
            enable: false,
            action: false,
            count: 4
        }
    };

    player.construction = {
        castle: 5,
        city: 4,
        road: 15,
        knight: 0
    };

    player.make = {
        road: false,
        castle: false,
        city: false,
        dev: false
    };

    player.exchange = false;
});

function random() {
    return () => Math.random() - 0.5;
}

function shuffle(list) {
    return list.sort(random());
}

katanObject.castleList = [];

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

                katanObject.castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    show: false,
                    hide: true,
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

                const show = j >= 3 && j <= 7;

                katanObject.castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    show,
                    hide: !show,
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

            const show = j >= 2 && j <= 8;

            katanObject.castleList.push({
                left: j * (config.cell.width / 2) - config.castle.width / 2,
                top: top - config.castle.height / 2,
                show,
                hide: !show,
                empty: true,
                i,
                j
            });
        }
    }
}

katanObject.castleList.forEach((castle, index) => castle.index = index);
katanObject.castleList.forEach((castle) => castle.playerIndex = -1);
katanObject.castleList.forEach((castle) => castle.city = false);
katanObject.castleList.forEach(castle => castle.constructable = castle.show);
katanObject.castleList.forEach(castle => castle.title = '');
katanObject.castleList.forEach(castle => castle.tradable = false);

katanObject.castleList[0].port = {
    enabled: true,
    placement: 'top'
};

katanObject.castleList[1].port = {
    enabled: true,
    placement: 'top'
};

katanObject.castleList[2].port = {
    enabled: true,
    placement: 'top'
};

katanObject.castleList[3].port = {
    enabled: true,
    placement: 'top'
};

katanObject.castleList[4].port = {
    enabled: true,
    placement: 'top'
};

katanObject.castleList[5].port = {
    enabled: true,
    placement: 'top'
};

katanObject.castleList[6].port = {
    enabled: true,
    placement: 'top'
};

katanObject.castleList[7].port = {
    enabled: true,
    placement: 'left'
};

katanObject.castleList[8].port = {
    enabled: true,
    placement: 'left'
};

katanObject.castleList[9].port = {
    enabled: false
};

katanObject.castleList[10].port = {
    enabled: false
};

katanObject.castleList[11].port = {
    enabled: false
};

katanObject.castleList[12].port = {
    enabled: false
};

katanObject.castleList[13].port = {
    enabled: false
};

katanObject.castleList[14].port = {
    enabled: true,
    placement: 'right'
};

katanObject.castleList[15].port = {
    enabled: true,
    placement: 'right'
};

katanObject.castleList[16].port = {
    enabled: true,
    placement: 'left'
};

katanObject.castleList[17].port = {
    enabled: true,
    placement: 'left'
};

katanObject.castleList[18].port = {
    enabled: false
};

katanObject.castleList[19].port = {
    enabled: false
};

katanObject.castleList[20].port = {
    enabled: false
};

katanObject.castleList[21].port = {
    enabled: false
};

katanObject.castleList[22].port = {
    enabled: false
};

katanObject.castleList[23].port = {
    enabled: false
};

katanObject.castleList[24].port = {
    enabled: false
};

katanObject.castleList[25].port = {
    enabled: true,
    placement: 'right'
};

katanObject.castleList[26].port = {
    enabled: true,
    placement: 'right'
};

katanObject.castleList[27].port = {
    enabled: true,
    placement: 'left'
};

katanObject.castleList[28].port = {
    enabled: true,
    placement: 'left'
};

katanObject.castleList[29].port = {
    enabled: false
};

katanObject.castleList[30].port = {
    enabled: false
};

katanObject.castleList[31].port = {
    enabled: false
};

katanObject.castleList[32].port = {
    enabled: false
};

katanObject.castleList[33].port = {
    enabled: false
};

katanObject.castleList[34].port = {
    enabled: false
};

katanObject.castleList[35].port = {
    enabled: false
};

katanObject.castleList[36].port = {
    enabled: true,
    placement: 'right'
};

katanObject.castleList[37].port = {
    enabled: true,
    placement: 'right'
};

katanObject.castleList[38].port = {
    enabled: true,
    placement: 'left'
};

katanObject.castleList[39].port = {
    enabled: true,
    placement: 'left'
};

katanObject.castleList[40].port = {
    enabled: false
};

katanObject.castleList[41].port = {
    enabled: false
};

katanObject.castleList[42].port = {
    enabled: false
};

katanObject.castleList[43].port = {
    enabled: false
};

katanObject.castleList[44].port = {
    enabled: false
};

katanObject.castleList[45].port = {
    enabled: true,
    placement: 'right'
};

katanObject.castleList[46].port = {
    enabled: true,
    placement: 'right'
};

katanObject.castleList[47].port = {
    enabled: true,
    placement: 'bottom'
};

katanObject.castleList[48].port = {
    enabled: true,
    placement: 'bottom'
};

katanObject.castleList[49].port = {
    enabled: true,
    placement: 'bottom'
};

katanObject.castleList[50].port = {
    enabled: true,
    placement: 'bottom'
};

katanObject.castleList[51].port = {
    enabled: true,
    placement: 'bottom'
};

katanObject.castleList[52].port = {
    enabled: true,
    placement: 'bottom'
};
katanObject.castleList[53].port = {
    enabled: true,
    placement: 'bottom'
};

const portList = [];

for (let i = 0; i < 8; i++) {
    portList.push({
        trade: 3,
        type: 'all'
    });
}

for (let i = 0; i < 2; i++) {
    portList.push({
        trade: 2,
        type: 'tree'
    });

    portList.push({
        trade: 2,
        type: 'mud'
    });

    portList.push({
        trade: 2,
        type: 'wheat'
    });

    portList.push({
        trade: 2,
        type: 'sheep'
    });

    portList.push({
        trade: 2,
        type: 'iron'
    });
}

katanObject.castleList
    .filter(castle => castle.port.enabled)
    .map(castle => castle.index)
    .sort(random())
    .slice(0, portList.length)
    .forEach(i => {
        const port = portList.pop();

        katanObject.castleList[i].port = {
            ...katanObject.castleList[i].port,
            trade: port.trade,
            type: port.type,
            tradable: true
        }
    });

katanObject.castleList[0].roadIndexList = [0, 6];
katanObject.castleList[1].roadIndexList = [0, 1];
katanObject.castleList[2].roadIndexList = [1, 2, 7];
katanObject.castleList[3].roadIndexList = [2, 3];
katanObject.castleList[4].roadIndexList = [3, 4, 8];
katanObject.castleList[5].roadIndexList = [4, 5];
katanObject.castleList[6].roadIndexList = [5, 9];

katanObject.castleList[7].roadIndexList = [18, 10];
katanObject.castleList[8].roadIndexList = [6, 10, 11];
katanObject.castleList[9].roadIndexList = [11, 12, 19];
katanObject.castleList[10].roadIndexList = [7, 12, 13];
katanObject.castleList[11].roadIndexList = [13, 14, 20];
katanObject.castleList[12].roadIndexList = [8, 14, 15];
katanObject.castleList[13].roadIndexList = [15, 16, 21];
katanObject.castleList[14].roadIndexList = [9, 16, 17];
katanObject.castleList[15].roadIndexList = [17, 22];

katanObject.castleList[16].roadIndexList = [23, 33];
katanObject.castleList[17].roadIndexList = [18, 23, 24];
katanObject.castleList[18].roadIndexList = [24, 25, 34];
katanObject.castleList[19].roadIndexList = [19, 25, 26];
katanObject.castleList[20].roadIndexList = [26, 27, 35];
katanObject.castleList[21].roadIndexList = [20, 27, 28];
katanObject.castleList[22].roadIndexList = [28, 29, 36];
katanObject.castleList[23].roadIndexList = [21, 29, 30];
katanObject.castleList[24].roadIndexList = [30, 31, 37];
katanObject.castleList[25].roadIndexList = [22, 31, 32];
katanObject.castleList[26].roadIndexList = [32, 38];

katanObject.castleList[27].roadIndexList = [33, 39];
katanObject.castleList[28].roadIndexList = [39, 40, 49];
katanObject.castleList[29].roadIndexList = [34, 40, 41];
katanObject.castleList[30].roadIndexList = [41, 42, 50];
katanObject.castleList[31].roadIndexList = [35, 42, 43];
katanObject.castleList[32].roadIndexList = [43, 44, 51];
katanObject.castleList[33].roadIndexList = [36, 44, 45];
katanObject.castleList[34].roadIndexList = [45, 46, 52];
katanObject.castleList[35].roadIndexList = [37, 46, 47];
katanObject.castleList[36].roadIndexList = [47, 48, 53];
katanObject.castleList[37].roadIndexList = [38, 48];

katanObject.castleList[38].roadIndexList = [49, 54];
katanObject.castleList[39].roadIndexList = [54, 55, 62];
katanObject.castleList[40].roadIndexList = [50, 55, 56];
katanObject.castleList[41].roadIndexList = [56, 57, 63];
katanObject.castleList[42].roadIndexList = [51, 57, 58];
katanObject.castleList[43].roadIndexList = [58, 59, 64];
katanObject.castleList[44].roadIndexList = [52, 59, 60];
katanObject.castleList[45].roadIndexList = [60, 61, 65];
katanObject.castleList[46].roadIndexList = [53, 61];

katanObject.castleList[47].roadIndexList = [62, 66];
katanObject.castleList[48].roadIndexList = [66, 67];
katanObject.castleList[49].roadIndexList = [63, 67, 68];
katanObject.castleList[50].roadIndexList = [68, 69];
katanObject.castleList[51].roadIndexList = [64, 69, 70];
katanObject.castleList[52].roadIndexList = [70, 71];
katanObject.castleList[53].roadIndexList = [65, 71];

katanObject.castleList[0].castleIndexList = [1, 8];
katanObject.castleList[1].castleIndexList = [0, 2];
katanObject.castleList[2].castleIndexList = [1, 3, 10];
katanObject.castleList[3].castleIndexList = [2, 4];
katanObject.castleList[4].castleIndexList = [3, 5, 12];
katanObject.castleList[5].castleIndexList = [4, 6];
katanObject.castleList[6].castleIndexList = [5, 14];

katanObject.castleList[7].castleIndexList = [8, 17];
katanObject.castleList[8].castleIndexList = [7, 9];
katanObject.castleList[9].castleIndexList = [8, 10, 19];
katanObject.castleList[10].castleIndexList = [2, 9, 11];
katanObject.castleList[11].castleIndexList = [10, 12, 21];
katanObject.castleList[12].castleIndexList = [4, 11 ,13];
katanObject.castleList[13].castleIndexList = [12, 14, 23];
katanObject.castleList[14].castleIndexList = [6, 13, 15];
katanObject.castleList[15].castleIndexList = [14, 25];

katanObject.castleList[16].castleIndexList = [17, 27];
katanObject.castleList[17].castleIndexList = [7, 16, 18];
katanObject.castleList[18].castleIndexList = [17, 19, 29];
katanObject.castleList[19].castleIndexList = [9, 18, 20];
katanObject.castleList[20].castleIndexList = [19, 21, 31];
katanObject.castleList[21].castleIndexList = [11, 20, 22];
katanObject.castleList[22].castleIndexList = [21, 23, 33];
katanObject.castleList[23].castleIndexList = [13, 22, 24];
katanObject.castleList[24].castleIndexList = [23, 25, 35];
katanObject.castleList[25].castleIndexList = [15, 24, 26];
katanObject.castleList[26].castleIndexList = [25, 37];

katanObject.castleList[27].castleIndexList = [16, 28];
katanObject.castleList[28].castleIndexList = [27, 29, 38];
katanObject.castleList[29].castleIndexList = [18, 28, 30];
katanObject.castleList[30].castleIndexList = [29, 31, 40];
katanObject.castleList[31].castleIndexList = [20, 30, 32];
katanObject.castleList[32].castleIndexList = [31, 33, 42];
katanObject.castleList[33].castleIndexList = [22, 32, 34];
katanObject.castleList[34].castleIndexList = [33, 35, 44];
katanObject.castleList[35].castleIndexList = [24, 34, 36];
katanObject.castleList[36].castleIndexList = [35, 37, 46];
katanObject.castleList[37].castleIndexList = [26, 36];

katanObject.castleList[38].castleIndexList = [28, 39];
katanObject.castleList[39].castleIndexList = [38, 40, 47];
katanObject.castleList[40].castleIndexList = [30, 39, 41];
katanObject.castleList[41].castleIndexList = [40, 42, 49];
katanObject.castleList[42].castleIndexList = [32, 41, 43];
katanObject.castleList[43].castleIndexList = [42, 44, 51];
katanObject.castleList[44].castleIndexList = [34, 43, 45];
katanObject.castleList[45].castleIndexList = [44, 46, 53];
katanObject.castleList[46].castleIndexList = [36, 45];

katanObject.castleList[47].castleIndexList = [39, 48];
katanObject.castleList[48].castleIndexList = [47, 49];
katanObject.castleList[49].castleIndexList = [41, 48, 50];
katanObject.castleList[50].castleIndexList = [49, 51];
katanObject.castleList[51].castleIndexList = [43, 50, 52];
katanObject.castleList[52].castleIndexList = [51, 53];
katanObject.castleList[53].castleIndexList = [45, 52];

katanObject.roadList = [];

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

                katanObject.roadList.push({
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

                katanObject.roadList.push({
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

                katanObject.roadList.push({
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

                katanObject.roadList.push({
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

                katanObject.roadList.push({
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

                katanObject.roadList.push({
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

katanObject.roadList.forEach((road, index) => road.index = index);
katanObject.roadList.forEach(road => road.hide = true);
katanObject.roadList.forEach(road => road.show = false);
katanObject.roadList.forEach(road => road.ripple = false);
katanObject.roadList.forEach(road => road.playerIndex = -1);
katanObject.roadList.forEach(road => road.title = '');

katanObject.roadList[0].castleIndexList = [0, 1];
katanObject.roadList[1].castleIndexList = [1, 2];
katanObject.roadList[2].castleIndexList = [2, 3];
katanObject.roadList[3].castleIndexList = [3, 4];
katanObject.roadList[4].castleIndexList = [4, 5];
katanObject.roadList[5].castleIndexList = [5, 6];

katanObject.roadList[6].castleIndexList = [0, 8];
katanObject.roadList[7].castleIndexList = [2, 10];
katanObject.roadList[8].castleIndexList = [4, 12];
katanObject.roadList[9].castleIndexList = [6, 14];

katanObject.roadList[10].castleIndexList = [7, 8];
katanObject.roadList[11].castleIndexList = [8, 9];
katanObject.roadList[12].castleIndexList = [9, 10];
katanObject.roadList[13].castleIndexList = [10, 11];
katanObject.roadList[14].castleIndexList = [11, 12];
katanObject.roadList[15].castleIndexList = [12, 13];
katanObject.roadList[16].castleIndexList = [13, 14];
katanObject.roadList[17].castleIndexList = [14, 15];

katanObject.roadList[18].castleIndexList = [7, 17];
katanObject.roadList[19].castleIndexList = [9, 19];
katanObject.roadList[20].castleIndexList = [11, 21];
katanObject.roadList[21].castleIndexList = [13, 23];
katanObject.roadList[22].castleIndexList = [15, 25];

katanObject.roadList[23].castleIndexList = [16, 17];
katanObject.roadList[24].castleIndexList = [17, 18];
katanObject.roadList[25].castleIndexList = [18, 19];
katanObject.roadList[26].castleIndexList = [19, 20];
katanObject.roadList[27].castleIndexList = [20, 21];
katanObject.roadList[28].castleIndexList = [21, 22];
katanObject.roadList[29].castleIndexList = [22, 23];
katanObject.roadList[30].castleIndexList = [23, 24];
katanObject.roadList[31].castleIndexList = [24, 25];
katanObject.roadList[32].castleIndexList = [25, 26];

katanObject.roadList[33].castleIndexList = [16, 27];
katanObject.roadList[34].castleIndexList = [18, 29];
katanObject.roadList[35].castleIndexList = [20, 31];
katanObject.roadList[36].castleIndexList = [22, 33];
katanObject.roadList[37].castleIndexList = [24, 35];
katanObject.roadList[38].castleIndexList = [26, 37];

katanObject.roadList[39].castleIndexList = [27, 28];
katanObject.roadList[40].castleIndexList = [28, 29];
katanObject.roadList[41].castleIndexList = [29, 30];
katanObject.roadList[42].castleIndexList = [30, 31];
katanObject.roadList[43].castleIndexList = [31, 32];
katanObject.roadList[44].castleIndexList = [32, 33];
katanObject.roadList[45].castleIndexList = [33, 34];
katanObject.roadList[46].castleIndexList = [34, 35];
katanObject.roadList[47].castleIndexList = [35, 36];
katanObject.roadList[48].castleIndexList = [36, 37];

katanObject.roadList[49].castleIndexList = [28, 38];
katanObject.roadList[50].castleIndexList = [30, 40];
katanObject.roadList[51].castleIndexList = [32, 42];
katanObject.roadList[52].castleIndexList = [34, 44];
katanObject.roadList[53].castleIndexList = [36, 46];

katanObject.roadList[54].castleIndexList = [38, 39];
katanObject.roadList[55].castleIndexList = [39, 40];
katanObject.roadList[56].castleIndexList = [40, 41];
katanObject.roadList[57].castleIndexList = [41, 42];
katanObject.roadList[58].castleIndexList = [42, 43];
katanObject.roadList[59].castleIndexList = [43, 44];
katanObject.roadList[60].castleIndexList = [44, 45];
katanObject.roadList[61].castleIndexList = [45, 46];

katanObject.roadList[62].castleIndexList = [39, 47];
katanObject.roadList[63].castleIndexList = [41, 49];
katanObject.roadList[64].castleIndexList = [43, 51];
katanObject.roadList[65].castleIndexList = [45, 53];

katanObject.roadList[66].castleIndexList = [47, 48];
katanObject.roadList[67].castleIndexList = [48, 49];
katanObject.roadList[68].castleIndexList = [49, 50];
katanObject.roadList[69].castleIndexList = [50, 51];
katanObject.roadList[70].castleIndexList = [51, 52];
katanObject.roadList[71].castleIndexList = [52, 53];

katanObject.roadList[0].roadIndexList = [1, 6];
katanObject.roadList[1].roadIndexList = [0, 2, 7];
katanObject.roadList[2].roadIndexList = [1, 3, 7];
katanObject.roadList[3].roadIndexList = [2, 4, 8];
katanObject.roadList[4].roadIndexList = [3, 5, 8];
katanObject.roadList[5].roadIndexList = [4, 9];

katanObject.roadList[6].roadIndexList = [0, 10, 11];
katanObject.roadList[7].roadIndexList = [1, 2, 12 , 13];
katanObject.roadList[8].roadIndexList = [3, 4, 14, 15];
katanObject.roadList[9].roadIndexList = [5, 16, 17];

katanObject.roadList[10].roadIndexList = [6, 11, 18];
katanObject.roadList[11].roadIndexList = [6, 10, 12, 19];
katanObject.roadList[12].roadIndexList = [7, 11, 13, 19];
katanObject.roadList[13].roadIndexList = [7, 12, 14, 20];
katanObject.roadList[14].roadIndexList = [8, 13, 15, 20];
katanObject.roadList[15].roadIndexList = [8, 14, 16, 21];
katanObject.roadList[16].roadIndexList = [9, 15, 17, 21];
katanObject.roadList[17].roadIndexList = [9, 16, 22];

katanObject.roadList[18].roadIndexList = [10, 23, 24];
katanObject.roadList[19].roadIndexList = [11, 12, 25, 26];
katanObject.roadList[20].roadIndexList = [13, 14, 27, 28];
katanObject.roadList[21].roadIndexList = [15, 16, 29, 30];
katanObject.roadList[22].roadIndexList = [17, 31, 32];

katanObject.roadList[23].roadIndexList = [18, 24, 33];
katanObject.roadList[24].roadIndexList = [18, 23, 25, 34];
katanObject.roadList[25].roadIndexList = [19, 24, 26, 34];
katanObject.roadList[26].roadIndexList = [19, 25, 27, 35];
katanObject.roadList[27].roadIndexList = [20, 26, 28, 35];
katanObject.roadList[28].roadIndexList = [20, 27, 29, 36];
katanObject.roadList[29].roadIndexList = [21, 28, 30, 36];
katanObject.roadList[30].roadIndexList = [21, 29, 31, 37];
katanObject.roadList[31].roadIndexList = [22, 30, 32, 37];
katanObject.roadList[32].roadIndexList = [22, 31, 38];

katanObject.roadList[33].roadIndexList = [23, 39];
katanObject.roadList[34].roadIndexList = [24, 25, 40, 41];
katanObject.roadList[35].roadIndexList = [26, 27, 42, 43];
katanObject.roadList[36].roadIndexList = [28, 29, 44, 45];
katanObject.roadList[37].roadIndexList = [30, 31, 46, 47];
katanObject.roadList[38].roadIndexList = [32, 48];

katanObject.roadList[39].roadIndexList = [33, 40, 49];
katanObject.roadList[40].roadIndexList = [34, 39, 41, 49];
katanObject.roadList[41].roadIndexList = [34, 40, 42, 50];
katanObject.roadList[42].roadIndexList = [35, 41, 43, 50];
katanObject.roadList[43].roadIndexList = [35, 42, 44, 51];
katanObject.roadList[44].roadIndexList = [36, 43, 45, 51];
katanObject.roadList[45].roadIndexList = [36, 44, 46, 52];
katanObject.roadList[46].roadIndexList = [37, 45, 47, 52];
katanObject.roadList[47].roadIndexList = [37, 46, 48, 53];
katanObject.roadList[48].roadIndexList = [38, 47, 53];

katanObject.roadList[49].roadIndexList = [39, 40, 54];
katanObject.roadList[50].roadIndexList = [41, 42, 55, 56];
katanObject.roadList[51].roadIndexList = [43, 44, 57, 58];
katanObject.roadList[52].roadIndexList = [45, 46, 59, 60];
katanObject.roadList[53].roadIndexList = [47, 48, 61];

katanObject.roadList[54].roadIndexList = [49, 55, 62];
katanObject.roadList[55].roadIndexList = [50, 54, 56, 62];
katanObject.roadList[56].roadIndexList = [50, 55, 57, 63];
katanObject.roadList[57].roadIndexList = [51, 56, 58, 63];
katanObject.roadList[58].roadIndexList = [51, 57, 59, 64];
katanObject.roadList[59].roadIndexList = [52, 58, 60, 64];
katanObject.roadList[60].roadIndexList = [52, 59, 61, 65];
katanObject.roadList[61].roadIndexList = [53, 60, 65];

katanObject.roadList[62].roadIndexList = [54, 55, 66];
katanObject.roadList[63].roadIndexList = [56, 57, 66, 68];
katanObject.roadList[64].roadIndexList = [58, 59, 69, 70];
katanObject.roadList[65].roadIndexList = [60, 61, 71];

katanObject.roadList[66].roadIndexList = [62, 67];
katanObject.roadList[67].roadIndexList = [63, 66, 68];
katanObject.roadList[68].roadIndexList = [63, 67, 69];
katanObject.roadList[69].roadIndexList = [64, 68, 70];
katanObject.roadList[70].roadIndexList = [64, 69, 71];
katanObject.roadList[71].roadIndexList = [65, 70];

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

resourceList.forEach(resource => {
    resource.hide = true;
    resource.show = false;
    resource.numberRipple = false;
});

katanObject.resourceList = resourceList;

let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
numberList = shuffle(numberList);

katanObject.resourceList = katanObject.resourceList
    .map((resource, index) => {
        if (resource.type === 'dessert') {
            resource.number = 7;
            resource.numberIndex = 1;
        } else {
            resource.number = numberList.pop();

            if (resource.number === 2 || resource.number === 12) {
                resource.numberIndex = 1;
            } else {
                if (numberList.includes(resource.number)) {
                    resource.numberIndex = 1;
                } else {
                    resource.numberIndex = 2;
                }
            }
        }

        resource.buglar = false;

        if (resource.number === 7) {
            resource.buglar = true;
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
        resource.index = index;

        if (resource.index === 0) {
            resource.castleIndexList = [0, 1, 2, 8, 9, 10];
        } else if (resource.index === 1) {
            resource.castleIndexList = [2, 3, 4, 10, 11, 12];
        } else if (resource.index === 2) {
            resource.castleIndexList = [4, 5, 6, 12, 13, 14];
        } else if (resource.index === 3) {
            resource.castleIndexList = [7, 8, 9, 17, 18, 19];
        } else if (resource.index === 4) {
            resource.castleIndexList = [9, 10, 11, 19, 20, 21];
        } else if (resource.index === 5) {
            resource.castleIndexList = [11, 12, 13, 21, 22, 23];
        } else if (resource.index === 6) {
            resource.castleIndexList = [13, 14, 15, 23, 24, 25];
        } else if (resource.index === 7) {
            resource.castleIndexList = [16, 17, 18, 27, 28, 29];
        } else if (resource.index === 8) {
            resource.castleIndexList = [18, 19, 20, 29, 30, 31];
        } else if (resource.index === 9) {
            resource.castleIndexList = [20, 21, 22, 31, 32, 33];
        } else if (resource.index === 10) {
            resource.castleIndexList = [22, 23, 24, 33, 34, 35];
        } else if (resource.index === 11) {
            resource.castleIndexList = [24, 25, 26, 35, 36, 37];
        } else if (resource.index === 12) {
            resource.castleIndexList = [28, 29, 30, 38, 39, 40];
        } else if (resource.index === 13) {
            resource.castleIndexList = [30, 31, 32, 40, 41, 42];
        } else if (resource.index === 14) {
            resource.castleIndexList = [32, 33, 34, 42, 43, 44];
        } else if (resource.index === 15) {
            resource.castleIndexList = [34, 35, 36, 44, 45, 46];
        } else if (resource.index === 16) {
            resource.castleIndexList = [39, 40, 41, 47, 48, 49];
        } else if (resource.index === 17) {
            resource.castleIndexList = [41, 42, 43, 49, 50, 51];
        } else if (resource.index === 18) {
            resource.castleIndexList = [43, 44, 45, 51, 52, 53];
        }

        return resource;
    });

const { subscribe, set, update } = writable(katanObject);

const katanStore = {
    subscribe,
    set,

    turn: () => update(katan => {
        const player = katanStore.getActivePlayer();

        katanStore.setDiceEnabled();
        katanStore.unsetRollDice();
        katanStore.recomputePlayer();

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

        katanStore.setCastleRippleDisabled();
        katanStore.setRoadRippleDisabled();

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

    transition: (resource, playerIndex) => update(katan => {
        resource.show = false;
        katan.playerList[playerIndex].resource[resource.type]++;
        return katan;
    }),

    clickMessage: () => {
        katanStore.setNumberRippleEnabled();
    },

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
            katanStore.takeResource();
        } else {
            katanStore.doActionAndTurn();
        }

        katan.mode = 'start';

        return katan;
    }),

    takeResource: () => update(katan => {
        const other = katanStore.getOtherPlayer(katan);

        let resourceTypeList = katan.resourceTypeList
            .map(resourceType => {
                return {
                    type: resourceType.type,
                    count: other.resource[resourceType.type]
                }
            });

        resourceTypeList = resourceTypeList
            .filter(item => item.count > 0)
            .sort(random());

        if (resourceTypeList.length > 0) {
            const resource = resourceTypeList[0];
            const player = katanStore.getActivePlayer();

            const playerIndex = player.index;
            const otherPlayerIndex = other.index;

            const sourceClass = `player_${otherPlayerIndex}_${resource.type}`;
            const targetClass = `player_${playerIndex}_${resource.type}`;

            katanStore.animateMoveResource({
                sourceClass,
                targetClass,
                count: 1,
                callback: () => {
                    katanStore.updateTakeResource(resource);
                    katanStore.unsetKnightMode();

                    if (katan.isGetResourceFormOtherPlayer) {
                        katan.getResourceCount += 1;

                        if (katan.getResourceCount === 1) {
                            katanStore.takeResource();
                        } else if (katan.getResourceCount > 1) {
                            katan.isGetResourceFormOtherPlayer = false;
                            katan.getResourceCount = 0;
                            katanStore.doActionAndTurn();
                        }
                    } else {
                        katanStore.doActionAndTurn();
                    }
                }
            });
        } else {
            if (katan.isGetResourceFormOtherPlayer) {
                katan.isGetResourceFormOtherPlayer = false;
                katan.getResourceCount = 0;
            }

            katanStore.doActionAndTurn();
        }

        return katan;
    }),

    updateTakeResource: (resource) => update(katan => {
        const player = katanStore.getActivePlayer();
        const other = katanStore.getOtherPlayer(katan);

        other.resource[resource.type] = other.resource[resource.type] - 1;
        player.resource[resource.type] = player.resource[resource.type] + 1;

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

    animateMoveResource: (option) => {
        option = Object.assign({
            count: 1,
            speed: 1000,
            callback: () => {}
        }, option);

        console.log('>>> option', option);

        const sourceItem = jQuery('.' + option.sourceClass);
        const visible = katanStore.isVisible(sourceItem);

        if (!visible) {
            sourceItem.show();
        }

        const targetItem = jQuery('.' + option.targetClass);

        const sourceOffset = sourceItem.offset();
        const targetOffset = targetItem.offset();

        const body = jQuery('body');
        const newResourceItem = sourceItem.clone()
            .removeClass(option.sourceClass);

        newResourceItem.appendTo(body)
            .css({
                left: sourceOffset.left + 'px',
                top: sourceOffset.top + 'px',
                position: 'absolute'
            });

        if (!visible) {
            sourceItem.hide();
        }

        setTimeout(() => {
            const animationCss = Object.assign({
                left: targetOffset.left + 'px',
                top: targetOffset.top + 'px'
            }, option.animationCss);

            newResourceItem.animate(animationCss,
                option.speed,
                () => {
                    newResourceItem.remove();
                    option.callback();
                });
        }, option.count * 1000)
    },

    moveResource: (number) => update(katan => {
        let matchResourceCount = 0;
        let moveResourceCount = 0;

        katan.resourceList
            .filter(resource => resource.number === number)
            .filter(resource => !resource.buglar)
            .forEach(resource => {
                resource.castleIndexList.forEach(castleIndex => {
                    const playerIndex = katan.castleList[castleIndex].playerIndex;

                    if (playerIndex !== -1) {
                        matchResourceCount++;
                        resource.show = true;

                        katanStore.animateMoveResource({
                            sourceClass: `resource_${resource.index}`,
                            targetClass: `player_${playerIndex}_${resource.type}`,
                            count: matchResourceCount,
                            callback: () => {
                                katanStore.updateResource(playerIndex, resource);
                                moveResourceCount++;
                            }
                        });
                    }
                });
            });

        katanStore.log(`matchResourceCount ${matchResourceCount}`);

        if (matchResourceCount > 0) {
            const interval = setInterval(() => {
                if (moveResourceCount === matchResourceCount) {
                    clearInterval(interval);
                    katanStore.log(`move resource animation is complete.`);
                    katanStore.doActionAndTurn();
                }
            }, 100);
        } else {
            katanStore.log(`move resource animation is none.`);
            katanStore.doActionAndTurn();
        }

        return katan;
    }),

    doActionAndTurn: () => {
        katanStore.recomputePlayer();

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

    updateAndShowResourceModal: async() => {
        katanStore.setShowResourceModal();
        await tick();
        katanStore.showResourceModal();
    },

    showResourceModal: () => {
        const modal = new Modal(document.getElementById('resourceModal'), {});
        modal.show();
    },

    setShowResourceModal: () => update(katan => {
        katan.showResourceModal = true;
        return katan;
    }),

    hideResourceModal: () => update(katan => {
        katan.showResourceModal = false;
        return katan;
    }),

    clickMakeRoad: (roadIndex) => update(katan => {
        if (!katan.isMakeRoad) {
            return katan;
        }

        const player = katanStore.getActivePlayer();
        katanStore.setRoad(roadIndex, player.index);
        katanStore.setHideRoad();
        katanStore.setRoadRippleDisabled();

        if (katan.isStart) {
            katanStore.endMakeRoad();
        } else {
            katanStore.showConstructableCastle();
            katanStore.endMakeRoad();
            katanStore.turn();

            if (katanStore.isStartable()) {
                katanStore.start();
            }
        }

        return katan;
    }),

    castleClickable: (katan, castleIndex) => {
        const player = katanStore.getActivePlayer();
        const castle = katan.castleList[castleIndex];

        if (katan.isMakeCity) {
            if (castle.city || castle.playerIndex !== player.index) {
                return false;
            }
        } else {
            if (castle.playerIndex !== -1) {
                return false;
            }
        }

        return true;
    },

    clickMakeCastle: (castleIndex) => update(katan => {
        if (!katanStore.castleClickable(katan, castleIndex)) {
            return katan;
        }

        const player = katanStore.getActivePlayer();
        katanStore.setCastle(castleIndex, player.index);
        katanStore.setHideCastle();
        katanStore.setCastleRippleDisabled();

        if (katan.isMakeCastle) {
            katanStore.endMakeCastle();
        } else if (katan.isMakeCity){
            katanStore.endMakeCity(castleIndex);
        } else {
            katanStore.setRoadRippleEnabled(castleIndex);
        }

        return katan;
    }),

    endMakeRoad: () => update(katan => {
        if (katan.isMakeRoad2) {
            katan.makeRoadCount += 1;
        } else {
            katan.isMakeRoad = false;
        }

        if (katan.isStart) {
            if (katan.isMakeRoad2 && katan.makeRoadCount === 1) {
                katanStore.makeRoad();
            } else {
                katan.isMakeRoad2 = false;
                katan.makeRoadCount = 0;
                katanStore.doActionAndTurn();
            }
        }

        return katan;
    }),

    setRollDice: () => update(katan => {
        katan.rollDice = true;
        katanStore.dir('setRollDice katan.rollDice', katan.rollDice);
        return katan;
    }),

    unsetRollDice: () => update(katan => {
        katan.rollDice = false;
        katanStore.dir('unsetRollDice katan.rollDice', katan.rollDice);
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

                    console.log('>>> targetClass', targetClass);

                    katanStore.animateMoveResource({
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
                                    katanStore.moveResource(number);
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
            katanStore.moveResource(number);
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

                    katanStore.animateMoveResource({
                        sourceClass,
                        targetClass,
                        count: takeResourceFromBuglarCount + i,
                        callback: () => {
                            katanStore.updatePlayerResource(player.index, type);
                            katanStore.recomputePlayer();
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

    updateResource: (playerIndex, resource) => update(katan => {
        katan.playerList[playerIndex].resource[resource.type]++;
        katanStore.recomputePlayer();
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

    setCastle: (castleIndex, playerIndex) => update(katan => {
        let castle = katan.castleList[castleIndex];
        castle.playerIndex = playerIndex;
        castle.pick = false;

        if (katan.isMakeCity) {
            castle.title = '도시';
        } else {
            castle.title = '마을';
        }

        const player = katan.playerList[playerIndex];
        player.pickCastle += 1;
        katan.time = new Date().getTime();

        if (katan.isMakeCity) {
            player.resource.wheat -= 2;
            player.resource.iron -= 3;

            player.point.castle -= 1;
            player.point.city += 2;

            player.construction.castle += 1;
            player.construction.city -= 1;

            katan.castleList = katan.castleList
                .map(castle => {
                    if (castle.index === castleIndex) {
                        castle.city = true;
                    }

                    return castle;
                });
        } else {
            if (katan.isStart) {
                player.resource.tree -= 1;
                player.resource.mud -= 1;
                player.resource.sheep -= 1;
                player.resource.wheat -= 1;
            }

            player.point.castle += 1;

            player.construction.castle -= 1;
        }

        if (castle.port.tradable) {
            if (castle.port.type === 'all') {
                katan.resourceTypeList
                    .forEach(resourceType => {
                        if (player.trade[resourceType.type].count > castle.port.trade) {
                            player.trade[resourceType.type].count = castle.port.trade;
                        }
                    });
            } else {
                player.trade[castle.port.type].count = castle.port.trade;
            }
        }

        return katan;
    }),

    setRoad: (roadIndex, playerIndex) => update(katan => {
        let road = katan.roadList[roadIndex];
        road.playerIndex = playerIndex;
        road.pick = false;
        road.title = '도로';

        const player = katan.playerList[playerIndex];
        player.pickRoad += 1;
        player.construction.road -= 1;

        if (katan.isStart && katan.isMakeRoad) {
            player.resource.tree -= 1;
            player.resource.mud -= 1;
        }

        return katan;
    }),

    setPickRoadMode: () => update(katan => {
        let player = katanStore.getCurrentPlayer(katan);
        return katan;
    }),

    setPickCastleMode: () => update(katan => {
        let player = katanStore.getCurrentPlayer(katan);
        return katan;
    }),

    makeRoad: () => update(katan => {
        katan.isMakeRoad = true;

        katanStore.setNewRoadRippleEnabled();
        katanStore.recomputePlayer();

        return katan;
    }),

    makeDev: () => update(katan => {
        const card = katan.cardList.pop();
        katan.afterCardList = [...katan.afterCardList, card];

        const player = katanStore.getActivePlayer();

        player.resource.sheep -= 1;
        player.resource.wheat -= 1;
        player.resource.iron -= 1;

        if (card.type === 'point') {
            alert('1점을 얻었습니다.');
            player.point.point += 1;
        } else if (card.type === 'knight') {
            alert('기사\n도둑을 옮기고 자원하나를 빼았습니다.');
            katanStore.setKnightMode();
            katanStore.readyMoveBuglar();

            player.construction.knight += 1;

            if (player.construction.knight >= 3) {
                const other = katanStore.getOtherPlayer(katan);

                if (player.construction.knight > other.construction.knight) {
                    if (player.point.knight === 0) {
                        alert('최강 기사단을 달성하였습니다.\n2점을 회득합니다.');
                    }

                    player.point.knight = 2;

                    if (other.point.knight === 2) {
                        other.point.knight = 0;
                    }
                }
            }
        } else if (card.type === 'road') {
            alert('도로 2개를 만드세요.');
            katan.isMakeRoad2 = true;
            katanStore.makeRoad();
        } else if (card.type === 'resource') {
            alert('자원 2개를 받으세요.');
            katan.isGetResource = true;
        } else if (card.type === 'get') {
            alert('상대방의 자원 2개를 받습니다.');
            katan.isGetResourceFormOtherPlayer = true;
            katanStore.takeResource();
        }

        katanStore.recomputePlayer();

        return katan;
    }),

    getResource: (resourceType) => update(katan => {
        const player = katanStore.getActivePlayer();
        katan.getResourceCount += 1;
        player.resource[resourceType] += 1;

        if (katan.getResourceCount >= 2) {
            katan.isGetResource = false;
            katan.getResourceCount = 0;
        }

        katanStore.recomputePlayer();

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

    makeCastle: () => update(katan => {
        katan.isMakeCastle = true;
        katanStore.setNewCastleRippleEnabled();

        return katan;
    }),

    makeCity: () => update(katan => {
        katan.isMakeCity = true;
        katanStore.setNewCityRippleEnabled();

        return katan;
    }),

    getPossibleRoadTotalLength: (katan) => {
        return katan.roadList
            .map(road => katanStore.getPossibleRoadLength(katan, road))
            .reduce((a, b) => a + b);
    },

    getPossibleRoadLength: (katan, road) => {
        let length = 0;

        if (road.playerIndex === -1) {
            length = road.castleIndexList
                .map(castleIndex => katan.castleList[castleIndex])
                .filter(castle => castle.playerIndex === katan.playerIndex)
                .length;

            length += road.roadIndexList
                .map(roadIndex => katan.roadList[roadIndex])
                .filter(road => road.playerIndex === katan.playerIndex)
                .length;
        }

        return length;
    },

    setNewRoadRippleEnabled: () => update(katan => {
        katan.roadList = katan.roadList
            .map(road => {
                let length = katanStore.getPossibleRoadLength(katan, road);

                if (length > 0) {
                    road.hide = false;
                    road.show = true;
                }

                return road;
            });

        return katan;
    }),

    setRoadRippleEnabled: (castleIndex) => update(katan => {
        katan.isMakeRoad = true;
        katan.message = '도로을 만들곳을 선택하세요.';
        let roadIndexList = katan.castleList[castleIndex].roadIndexList;

        katan.roadList = katan.roadList
            .map(road => {

                let linkLength = roadIndexList.filter(roadIndex => roadIndex === road.index)
                    .filter(roadIndex => katan.roadList[roadIndex].playerIndex === -1)
                    .length;

                if (linkLength > 0) {
                    road.hide = false;
                    road.show = true;
                }

                return road;
            });

        return katan;
    }),

    setRoadRippleDisabled: () => update(katan => {
        katan.roadList = katan.roadList
            .map(road => {
                road.ripple = false;
                return road;
            });

        return katan;
    }),

    setCastleRippleDisabled: () => update(katan => {
        katan.castleList = katan.castleList.map(castle => {
            castle.ripple = false;
            return castle;
        });

        return katan;
    }),

    showConstructableCastle: () => update(katan => {
        katan.message = '마을을 만들곳을 클릭하세요';

        katan.castleList = katan.castleList.map(castle => {
            if (castle.constructable && castle.playerIndex === -1) {
                let linkedCastleLength = castle.castleIndexList
                    .filter(castleIndex => katan.castleList[castleIndex].playerIndex !== -1)
                    .length;

                if (linkedCastleLength === 0) {
                    castle.show = true;
                    castle.hide = false;
                }
            }

            return castle;
        });

        return katan;
    }),

    getPossibleCastleIndexList: (katan) => {
        return katan.castleList
            .filter(castle => castle.playerIndex === -1)
            .map(castle => {
                const castleLength = castle.castleIndexList
                    .filter(castleIndex => katan.castleList[castleIndex].playerIndex === -1)
                    .length;

                if (castleLength === castle.castleIndexList.length) {
                    const castleLength = castle.roadIndexList
                        .filter(roadIndex => {
                            const road = katan.roadList[roadIndex];
                            return road.playerIndex === katan.playerIndex
                        })
                        .length;

                    if (castleLength > 0) {
                        return castle.index;
                    }
                }

                return -1;
            })
            .filter(index => index >= 0);
    },

    setNewCastleRippleEnabled: () => update(katan => {
        const castleIndexList = katanStore.getPossibleCastleIndexList(katan);
        katan.castleList = katan.castleList.map(castle => {
            if (castleIndexList.includes(castle.index)) {
                castle.hide = false;
                castle.show = true;
            }

            return castle;
        });

        return katan;
    }),

    setNewCityRippleEnabled: () => update(katan => {
        const player = katanStore.getActivePlayer();

        katan.castleList = katan.castleList.map(castle => {
            if (castle.playerIndex === player.index &&
                castle.city === false) {
                castle.ripple = true;
                castle.hide = false;
                castle.show = true;
            }

            return castle;
        });

        return katan;
    }),

    endMakeCastle: () => update(katan => {
        katan.isMakeCastle = false;
        katanStore.doActionAndTurn();
        return katan;
    }),

    endMakeCity: (castleIndex) => update(katan => {
        katan.isMakeCity = false;
        katanStore.doActionAndTurn();
        return katan;
    }),

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

    setHideCastle: () => update(katan => {
        katan.castleList =  katan.castleList
            .map(castle => {
                if (castle.playerIndex === -1) {
                    castle.show = false;
                    castle.hide = true;
                }

                return castle;
            });

        return katan;
    }),

    setHideRoad: () => update( katan => {
        katan.roadList =  katan.roadList
            .map(road => {
                if (road.playerIndex === -1) {
                    road.show = false;
                    road.hide = true;
                }

                return road;
            });

        return katan;
    }),

    exchange: (player, resourceType, targetResourceType) => update(katan => {
        player.resource[targetResourceType] += 1;
        player.resource[resourceType] -= player.trade[resourceType].count;
        katanStore.recomputePlayer();
        return katan;
    }),

    log: (message) => {
        const date = new Date();
        console.log(`>>> ${date.toISOString()} ${message}`);
    },

    dir: (message, object) => {
        const date = new Date();
        console.log(`>>> ${date.toISOString()} ${message}`);
        console.log(object);
    },

    getLinkedRoadList: (katan, player, road, resultList) => {
        const roadIndex = road.index;

        return katan.roadList[roadIndex]
            .roadIndexList
            .map(index => katan.roadList[index])
            .filter(road => road.playerIndex === player.index);
    },

    getIntersectionCastle: (katan, roadIndexA, roadIndexB) => {
        const listA = katan.roadList[roadIndexA].castleIndexList;
        const listB = katan.roadList[roadIndexB].castleIndexList;
        return listA.find(index => listB.includes(index));
    },

    processLinkedRoadList: (katan, player, road, resultList) => {
        if (resultList.includes(road.index)) {
            return;
        }

        const resultListLength = resultList.length;

        if (resultListLength >= 2) {
            const a = katanStore.getIntersectionCastle(katan,
                resultList[resultListLength - 1],
                road.index);

            const b = katanStore.getIntersectionCastle(katan,
                resultList[resultListLength - 2],
                resultList[resultListLength - 1]);

            if (a === b) {
                return;
            }
        }

        resultList.push(road.index);

        if (road.playerIndex !== player.index) {
            return;
        }

        const roadList = katanStore
            .getLinkedRoadList(katan, player, road, resultList);

        if (resultList.length > player.maxRoadLength) {
            player.maxRoadLength = resultList.length;
        }

        if (roadList.length === 0) {
            return;
        }

        roadList.forEach(currentRoad => {
            katanStore.processLinkedRoadList(katan,
                player, currentRoad, [...resultList]);
        });
    },

    recomputeLongRoad: (katan, player) => {
        const list = katan.roadList
            .filter(road => road.playerIndex === player.index);

        list.forEach(road => {
            katanStore.processLinkedRoadList(katan, player, road, []);
        });
    },

    recomputeRoadPoint: () => update(katan => {
        const player = katanStore.getActivePlayer();
        const otherPlayer = katanStore.getOtherPlayer(katan);

        if (player.maxRoadLength >= 5) {
            if (player.point.road === 0) {
                if (player.maxRoadLength > otherPlayer.maxRoadLength) {
                    alert('최장 교역로를 달성하였습니다.\n2점을 회득합니다.');
                    player.point.road = 2;
                }
            }

            if (otherPlayer.point.road > 0) {
                if (player.maxRoadLength > otherPlayer.maxRoadLength) {
                    otherPlayer.point.road = 0;
                }
            }
        }

        return katan;
    }),

    isActive: (katan) => {
        return katan.isKnightMode === false &&
            katan.isMakeRoad === false &&
            katan.isMakeCastle === false &&
            katan.isMakeCity === false &&
            katan.rollDice;
    },

    recomputePlayer: () => {
        update(katan => {
            katan.playerList
                .forEach(player => {
                    return katanStore.recomputeLongRoad(katan, player);
                });

            return katan;
        });

        katanStore.recomputeRoadPoint();

        update(katan => {
            katan.playerList = katan.playerList
                .map(player => {
                    let sum = player.point.knight;
                    sum += player.point.road;
                    sum += player.point.point;
                    sum += player.point.castle;
                    sum += player.point.city;
                    player.point.sum = sum;

                    katan.resourceTypeList
                        .forEach(typeObject => {
                            const type = typeObject.type;
                            player.trade[type].action = 
                                katanStore.isActive(katan) &&
                                player.index === katan.playerIndex;

                            player.trade[type].enable =
                                player.resource[type] >= player.trade[type].count;
                        });
                    
                    player.make.road =
                        katanStore.isActive(katan) &&
                        player.index === katan.playerIndex &&
                        player.construction.road >= 1 &&
                        player.resource.tree >= 1 &&
                        player.resource.mud >= 1 &&
                        katanStore.getPossibleRoadTotalLength(katan) > 0;

                    const possibleCastleIndexList =
                        katanStore.getPossibleCastleIndexList(katan);

                    player.make.castle =
                        katanStore.isActive(katan) &&
                        player.index === katan.playerIndex &&
                        player.construction.castle >= 1 &&
                        player.resource.tree >= 1 &&
                        player.resource.mud >= 1 &&
                        player.resource.wheat >= 1 &&
                        player.resource.sheep >= 1 &&
                        possibleCastleIndexList.length > 0;

                    const castleLength = katan.castleList
                        .filter(castle => castle.playerIndex === katan.playerIndex)
                        .filter(castle => castle.city === false)
                        .length;

                    player.make.city =
                        katanStore.isActive(katan) &&
                        player.index === katan.playerIndex &&
                        castleLength > 0 &&
                        player.construction.city >= 1 &&
                        player.resource.iron >= 3 &&
                        player.resource.wheat >= 2;

                    player.make.dev =
                        katanStore.isActive(katan) &&
                        player.index === katan.playerIndex &&
                        player.resource.iron >= 1 &&
                        player.resource.sheep >= 1 &&
                        player.resource.wheat >= 1;

                    if (player.point.sum === 10) {
                        alert(`${player.name} 승리`);
                    }

                    return player;
                });

            return katan;
        });
    }
};

export default katanStore;