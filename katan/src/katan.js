import {tick} from 'svelte'
import {writable} from "svelte/store";
import config from './config.js'
import { getDisplay, sleep } from './util.js'
import jQuery from 'jquery';
import { Modal } from './bootstrap.esm.min.js'

let katan = {
    rollDice: false,
    action: false,
    isMakeRoad: false,
    isMakeCastle: false,
    construction: false,
    message: '마을을 만들곳을 클릭하세요',
    diceDisabled: true,
    dice: [6, 6],
    mode: 'ready',
    isReady: true,
    isStart: false,
    playerIndex: 0,
    showResourceModal: false,
    playerList: [
        {
            color: 'blue',
            name: '다은',
            turn: true,
            pickCastle: 0,
            pickRoad: 0
        },
        {
            color: 'red',
            name: '아빠',
            turn: false,
            pickCastle: 0,
            pickRoad: 0
        }
    ]
};

katan.playerList.forEach((player, i) => {
    player.index = i;

    player.pickCastle =  0;
    player.pickRoad = 0;

    player.resource = {
        tree: 0,
        mud: 0,
        wheat: 0,
        sheep: 0,
        iron: 0
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
        road: 15
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

                const ripple = j >= 3 && j <= 7;

                katan.castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    ripple: ripple,
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

            const ripple = j >= 2 && j <= 8;

            katan.castleList.push({
                left: j * (config.cell.width / 2) - config.castle.width / 2,
                top: top - config.castle.height / 2,
                ripple: ripple,
                empty: true,
                i,
                j
            });
        }
    }
}

katan.castleList.forEach((castle, index) => castle.index = index);
katan.castleList.forEach((castle) => castle.playerIndex = -1);
katan.castleList.forEach(castle => castle.hide = !castle.ripple);
katan.castleList.forEach(castle => castle.show = castle.ripple);
katan.castleList.forEach(castle => castle.constructable = castle.ripple);
katan.castleList.forEach(castle => castle.title = '');

katan.castleList[0].roadIndexList = [0, 6];
katan.castleList[1].roadIndexList = [0, 1];
katan.castleList[2].roadIndexList = [1, 2, 7];
katan.castleList[3].roadIndexList = [2, 3];
katan.castleList[4].roadIndexList = [3, 4, 8];
katan.castleList[5].roadIndexList = [4, 5];
katan.castleList[6].roadIndexList = [5, 9];

katan.castleList[7].roadIndexList = [18, 10];
katan.castleList[8].roadIndexList = [6, 10, 11];
katan.castleList[9].roadIndexList = [11, 12, 19];
katan.castleList[10].roadIndexList = [7, 12, 13];
katan.castleList[11].roadIndexList = [13, 14, 20];
katan.castleList[12].roadIndexList = [8, 14, 15];
katan.castleList[13].roadIndexList = [15, 16, 21];
katan.castleList[14].roadIndexList = [9, 16, 17];
katan.castleList[15].roadIndexList = [17, 22];

katan.castleList[16].roadIndexList = [23, 33];
katan.castleList[17].roadIndexList = [18, 23, 24];
katan.castleList[18].roadIndexList = [24, 25, 34];
katan.castleList[19].roadIndexList = [19, 25, 26];
katan.castleList[20].roadIndexList = [26, 27, 35];
katan.castleList[21].roadIndexList = [20, 27, 28];
katan.castleList[22].roadIndexList = [28, 29, 36];
katan.castleList[23].roadIndexList = [21, 29, 30];
katan.castleList[24].roadIndexList = [30, 31, 37];
katan.castleList[25].roadIndexList = [22, 31, 32];
katan.castleList[26].roadIndexList = [32, 38];

katan.castleList[27].roadIndexList = [33, 39];
katan.castleList[28].roadIndexList = [39, 40, 49];
katan.castleList[29].roadIndexList = [34, 40, 41];
katan.castleList[30].roadIndexList = [41, 42, 50];
katan.castleList[31].roadIndexList = [35, 42, 43];
katan.castleList[32].roadIndexList = [43, 44, 51];
katan.castleList[33].roadIndexList = [36, 44, 45];
katan.castleList[34].roadIndexList = [45, 46, 52];
katan.castleList[35].roadIndexList = [37, 46, 47];
katan.castleList[36].roadIndexList = [47, 48, 53];
katan.castleList[37].roadIndexList = [38, 48];

katan.castleList[38].roadIndexList = [49, 54];
katan.castleList[39].roadIndexList = [54, 55, 62];
katan.castleList[40].roadIndexList = [50, 55, 56];
katan.castleList[41].roadIndexList = [56, 57, 63];
katan.castleList[42].roadIndexList = [51, 57, 58];
katan.castleList[43].roadIndexList = [58, 59, 64];
katan.castleList[44].roadIndexList = [52, 59, 60];
katan.castleList[45].roadIndexList = [60, 61, 65];
katan.castleList[46].roadIndexList = [53, 61];

katan.castleList[47].roadIndexList = [62, 66];
katan.castleList[48].roadIndexList = [66, 67];
katan.castleList[49].roadIndexList = [63, 67, 68];
katan.castleList[50].roadIndexList = [68, 69];
katan.castleList[51].roadIndexList = [64, 69, 70];
katan.castleList[52].roadIndexList = [70, 71];
katan.castleList[53].roadIndexList = [65, 71];

katan.castleList[0].castleIndexList = [1, 8];
katan.castleList[1].castleIndexList = [0, 2];
katan.castleList[2].castleIndexList = [1, 3, 10];
katan.castleList[3].castleIndexList = [2, 4];
katan.castleList[4].castleIndexList = [3, 5, 12];
katan.castleList[5].castleIndexList = [4, 6];
katan.castleList[6].castleIndexList = [5, 14];

katan.castleList[7].castleIndexList = [8, 17];
katan.castleList[8].castleIndexList = [7, 9];
katan.castleList[9].castleIndexList = [8, 10, 19];
katan.castleList[10].castleIndexList = [2, 9, 11];
katan.castleList[11].castleIndexList = [10, 12, 21];
katan.castleList[12].castleIndexList = [4, 11 ,13];
katan.castleList[13].castleIndexList = [12, 14, 23];
katan.castleList[14].castleIndexList = [6, 13, 15];
katan.castleList[15].castleIndexList = [14, 25];

katan.castleList[16].castleIndexList = [17, 27];
katan.castleList[17].castleIndexList = [7, 16, 18];
katan.castleList[18].castleIndexList = [17, 19, 29];
katan.castleList[19].castleIndexList = [9, 18, 20];
katan.castleList[20].castleIndexList = [19, 21, 31];
katan.castleList[21].castleIndexList = [11, 20, 22];
katan.castleList[22].castleIndexList = [21, 23, 33];
katan.castleList[23].castleIndexList = [13, 22, 24];
katan.castleList[24].castleIndexList = [23, 25, 35];
katan.castleList[25].castleIndexList = [15, 24, 26];
katan.castleList[26].castleIndexList = [25, 37];

katan.castleList[27].castleIndexList = [16, 28];
katan.castleList[28].castleIndexList = [27, 29, 38];
katan.castleList[29].castleIndexList = [18, 28, 30];
katan.castleList[30].castleIndexList = [29, 31, 40];
katan.castleList[31].castleIndexList = [20, 30, 30];
katan.castleList[32].castleIndexList = [31, 33, 42];
katan.castleList[33].castleIndexList = [22, 32, 34];
katan.castleList[34].castleIndexList = [33, 35, 44];
katan.castleList[35].castleIndexList = [24, 34, 36];
katan.castleList[36].castleIndexList = [35, 37, 46];
katan.castleList[37].castleIndexList = [26, 36];

katan.castleList[38].castleIndexList = [28, 39];
katan.castleList[39].castleIndexList = [38, 40, 47];
katan.castleList[40].castleIndexList = [30, 39, 41];
katan.castleList[41].castleIndexList = [40, 42, 49];
katan.castleList[42].castleIndexList = [32, 41, 43];
katan.castleList[43].castleIndexList = [42, 44, 51];
katan.castleList[44].castleIndexList = [34, 43, 45];
katan.castleList[45].castleIndexList = [44, 46, 53];
katan.castleList[46].castleIndexList = [36, 45];

katan.castleList[47].castleIndexList = [39, 48];
katan.castleList[48].castleIndexList = [47, 49];
katan.castleList[49].castleIndexList = [41, 48, 50];
katan.castleList[50].castleIndexList = [49, 51];
katan.castleList[51].castleIndexList = [43, 50, 52];
katan.castleList[52].castleIndexList = [51, 53];
katan.castleList[53].castleIndexList = [45, 52];

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
katan.roadList.forEach(road => road.title = '');

katan.roadList[0].castleIndexList = [0, 1];
katan.roadList[1].castleIndexList = [1, 2];
katan.roadList[2].castleIndexList = [2, 3];
katan.roadList[3].castleIndexList = [3, 4];
katan.roadList[4].castleIndexList = [4, 5];
katan.roadList[5].castleIndexList = [5, 6];

katan.roadList[6].castleIndexList = [0, 8];
katan.roadList[7].castleIndexList = [2, 10];
katan.roadList[8].castleIndexList = [4, 12];
katan.roadList[9].castleIndexList = [6, 14];

katan.roadList[10].castleIndexList = [7, 8];
katan.roadList[11].castleIndexList = [8, 9];
katan.roadList[12].castleIndexList = [9, 10];
katan.roadList[13].castleIndexList = [10, 11];
katan.roadList[14].castleIndexList = [11, 12];
katan.roadList[15].castleIndexList = [12, 13];
katan.roadList[16].castleIndexList = [13, 14];
katan.roadList[17].castleIndexList = [14, 15];

katan.roadList[18].castleIndexList = [7, 17];
katan.roadList[19].castleIndexList = [9, 19];
katan.roadList[20].castleIndexList = [11, 21];
katan.roadList[21].castleIndexList = [13, 23];
katan.roadList[22].castleIndexList = [15, 25];

katan.roadList[23].castleIndexList = [16, 17];
katan.roadList[24].castleIndexList = [17, 18];
katan.roadList[25].castleIndexList = [18, 19];
katan.roadList[26].castleIndexList = [19, 20];
katan.roadList[27].castleIndexList = [20, 21];
katan.roadList[28].castleIndexList = [21, 22];
katan.roadList[29].castleIndexList = [22, 23];
katan.roadList[30].castleIndexList = [23, 24];
katan.roadList[31].castleIndexList = [24, 25];
katan.roadList[32].castleIndexList = [25, 26];

katan.roadList[33].castleIndexList = [16, 27];
katan.roadList[34].castleIndexList = [18, 29];
katan.roadList[35].castleIndexList = [20, 31];
katan.roadList[36].castleIndexList = [22, 33];
katan.roadList[37].castleIndexList = [24, 35];
katan.roadList[38].castleIndexList = [26, 37];

katan.roadList[39].castleIndexList = [27, 28];
katan.roadList[40].castleIndexList = [28, 29];
katan.roadList[41].castleIndexList = [29, 30];
katan.roadList[42].castleIndexList = [30, 31];
katan.roadList[43].castleIndexList = [31, 32];
katan.roadList[44].castleIndexList = [32, 33];
katan.roadList[45].castleIndexList = [33, 34];
katan.roadList[46].castleIndexList = [34, 35];
katan.roadList[47].castleIndexList = [35, 36];
katan.roadList[48].castleIndexList = [36, 37];

katan.roadList[49].castleIndexList = [28, 38];
katan.roadList[50].castleIndexList = [30, 40];
katan.roadList[51].castleIndexList = [32, 42];
katan.roadList[52].castleIndexList = [34, 44];
katan.roadList[53].castleIndexList = [36, 46];

katan.roadList[54].castleIndexList = [38, 39];
katan.roadList[55].castleIndexList = [39, 40];
katan.roadList[56].castleIndexList = [40, 41];
katan.roadList[57].castleIndexList = [41, 42];
katan.roadList[58].castleIndexList = [42, 43];
katan.roadList[59].castleIndexList = [43, 44];
katan.roadList[60].castleIndexList = [44, 45];
katan.roadList[61].castleIndexList = [45, 46];

katan.roadList[62].castleIndexList = [39, 47];
katan.roadList[63].castleIndexList = [41, 49];
katan.roadList[64].castleIndexList = [43, 51];
katan.roadList[65].castleIndexList = [45, 53];

katan.roadList[66].castleIndexList = [47, 48];
katan.roadList[67].castleIndexList = [48, 49];
katan.roadList[68].castleIndexList = [49, 50];
katan.roadList[69].castleIndexList = [50, 51];
katan.roadList[70].castleIndexList = [51, 52];
katan.roadList[71].castleIndexList = [52, 53];

katan.roadList[0].roadIndexList = [1, 6];
katan.roadList[1].roadIndexList = [0, 2, 7];
katan.roadList[2].roadIndexList = [1, 3, 7];
katan.roadList[3].roadIndexList = [2, 4, 8];
katan.roadList[4].roadIndexList = [3, 5, 8];
katan.roadList[5].roadIndexList = [4, 9];

katan.roadList[6].roadIndexList = [0, 10, 11];
katan.roadList[7].roadIndexList = [1, 2, 12 , 13];
katan.roadList[8].roadIndexList = [3, 4, 14, 15];
katan.roadList[9].roadIndexList = [5, 16, 17];

katan.roadList[10].roadIndexList = [6, 11, 18];
katan.roadList[11].roadIndexList = [6, 10, 12, 19];
katan.roadList[12].roadIndexList = [7, 11, 13, 19];
katan.roadList[13].roadIndexList = [7, 12, 14, 20];
katan.roadList[14].roadIndexList = [8, 13, 15, 20];
katan.roadList[15].roadIndexList = [8, 14, 16, 21];
katan.roadList[16].roadIndexList = [9, 15, 17, 21];
katan.roadList[17].roadIndexList = [9, 16, 22];

katan.roadList[18].roadIndexList = [10, 23, 24];
katan.roadList[19].roadIndexList = [11, 12, 25, 26];
katan.roadList[20].roadIndexList = [13, 14, 27, 28];
katan.roadList[21].roadIndexList = [15, 16, 29, 30];
katan.roadList[22].roadIndexList = [17, 31, 32];

katan.roadList[23].roadIndexList = [18, 24, 33];
katan.roadList[24].roadIndexList = [18, 23, 25, 34];
katan.roadList[25].roadIndexList = [19, 24, 26, 34];
katan.roadList[26].roadIndexList = [19, 25, 27, 35];
katan.roadList[27].roadIndexList = [20, 26, 28, 35];
katan.roadList[28].roadIndexList = [20, 27, 29, 36];
katan.roadList[29].roadIndexList = [21, 28, 30, 36];
katan.roadList[30].roadIndexList = [21, 29, 31, 37];
katan.roadList[31].roadIndexList = [22, 30, 32, 37];
katan.roadList[32].roadIndexList = [22, 31, 38];

katan.roadList[33].roadIndexList = [23, 39];
katan.roadList[34].roadIndexList = [24, 25, 40, 41];
katan.roadList[35].roadIndexList = [26, 27, 42, 43];
katan.roadList[36].roadIndexList = [28, 29, 44, 45];
katan.roadList[37].roadIndexList = [30, 31, 46, 47];
katan.roadList[38].roadIndexList = [32, 48];

katan.roadList[39].roadIndexList = [33, 40, 49];
katan.roadList[40].roadIndexList = [34, 39, 41, 49];
katan.roadList[41].roadIndexList = [34, 40, 42, 50];
katan.roadList[42].roadIndexList = [35, 41, 43, 50];
katan.roadList[43].roadIndexList = [35, 42, 44, 51];
katan.roadList[44].roadIndexList = [36, 43, 45, 51];
katan.roadList[45].roadIndexList = [36, 44, 46, 52];
katan.roadList[46].roadIndexList = [37, 45, 47, 52];
katan.roadList[47].roadIndexList = [37, 46, 48, 53];
katan.roadList[48].roadIndexList = [38, 47, 53];

katan.roadList[49].roadIndexList = [39, 40, 54];
katan.roadList[50].roadIndexList = [41, 42, 55, 56];
katan.roadList[51].roadIndexList = [43, 44, 57, 58];
katan.roadList[52].roadIndexList = [45, 46, 59, 60];
katan.roadList[53].roadIndexList = [47, 48, 61];

katan.roadList[54].roadIndexList = [49, 55, 62];
katan.roadList[55].roadIndexList = [50, 54, 56, 62];
katan.roadList[56].roadIndexList = [50, 55, 57, 63];
katan.roadList[57].roadIndexList = [51, 46, 58, 63];
katan.roadList[58].roadIndexList = [51, 57, 59, 64];
katan.roadList[59].roadIndexList = [52, 58, 60, 64];
katan.roadList[60].roadIndexList = [52, 59, 61, 65];
katan.roadList[61].roadIndexList = [53, 60, 65];

katan.roadList[62].roadIndexList = [54, 55, 66];
katan.roadList[63].roadIndexList = [56, 57, 67, 68];
katan.roadList[64].roadIndexList = [58, 59, 69, 70];
katan.roadList[65].roadIndexList = [60, 61, 71];

katan.roadList[66].roadIndexList = [62, 67];
katan.roadList[67].roadIndexList = [63, 66, 68];
katan.roadList[68].roadIndexList = [63, 67, 69];
katan.roadList[69].roadIndexList = [64, 68, 70];
katan.roadList[70].roadIndexList = [64, 69, 71];
katan.roadList[71].roadIndexList = [65, 70];

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

katan.resourceList = resourceList;

let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
numberList = shuffle(numberList);

katan.resourceList = katan.resourceList
    .map((resource, index) => {
        if (resource.type === 'dessert') {
            resource.number = 7;
        } else {
            resource.number = numberList.pop();
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

const { subscribe, set, update } = writable(katan);

const katanStore = {
    subscribe,

    turn: () => update(katan => {
        katan.rollDice = false;
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
        if (katan.mode !== 'moveBuglar') {
            return katan;
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
        katanStore.setDiceEnabled();
        katanStore.doActionAndTurn();

        katan.mode = 'start';

        return katan;
    }),

    setDiceDisabled: () => update(katan => {
        katan.diceDisabled = true;
        return katan;
    }),

    setDiceEnabled: () => update(katan => {
        katan.diceDisabled = false;

        console.log('>>> katan', katan);

        return katan;
    }),

    moveResource: (number) => {
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

                        const selector = `.player_${playerIndex}_${resource.type}`;
                        const targetOffset = jQuery(selector).offset();

                        const resourceClass = `resource_${resource.index}`;
                        const resourceSelector = '.' + resourceClass;

                        const resourceItem = jQuery(resourceSelector).show();
                        const offset = resourceItem.offset();

                        const body = jQuery('body');
                        const newResourceItem = resourceItem.clone()
                            .removeClass(resourceClass);

                        newResourceItem.appendTo(body)
                            .css({
                                left: offset.left + 'px',
                                top: offset.top + 'px'
                            });

                        resourceItem.hide();

                        setTimeout(() => {
                            newResourceItem.addClass('ripple')
                                .animate({
                                    left: targetOffset.left + 'px',
                                    top: targetOffset.top + 'px'
                                }, 1000, () => {
                                    newResourceItem.offset(offset);
                                    newResourceItem.remove();
                                    katanStore.updateResource(playerIndex, resource);
                                    moveResourceCount++;
                                });
                        }, matchResourceCount * 1000)

                    }
                });
            });

        if (matchResourceCount > 0) {
            const interval = setInterval(() => {
                if (moveResourceCount === matchResourceCount) {
                    clearInterval(interval);

                    katanStore.doActionAndTurn();
                }
            }, 100);
        } else {
            katanStore.setDiceEnabled();
            katanStore.doActionAndTurn();
        }
    },

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
            player.make.tree ||
            player.make.mud ||
            player.make.wheat ||
            player.make.sheep ||
            player.make.iron;
    },

    closeResourceModalAndTurn: () => {
        katan.turn();
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

    endMakeRoad: () => update(katan => {
        katan.isMakeRoad = false;

        if (!katanStore.hasAction()) {
            katanStore.turn();
        }

        return katan;
    }),

    play: () => update(katan => {
        katanStore.setDiceDisabled();

        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 6) + 1;

        katanStore.roll(a, b);

        let number = a + b;

        if (window.targetNumber || -1 !== -1) {
            number = window.targetNumber;
        }

        if (number === 7) {
            katan.mode = 'moveBuglar';
            katan.message = '도둑의 위치를 선택하세요.';
            katanStore.setNumberRippleEnabled();
            katanStore.enableRollDice();
        } else {
            katanStore.setSelectedNumberRippleEnabled(number);

            setTimeout(() => {
                katanStore.setNumberRippleDisabled(number);
                katanStore.enableRollDice();
                katanStore.moveResource(number);
            }, 1000);
        }

        return katan;
    }),

    enableRollDice: () => update(katan => {
        katan.rollDice = true;
        return katan;
    }),

    disableRollDice: () => update(katan => {
        katan.rollDice = false;
        return katan;
    }),

    updateResource: (playerIndex, resource) => update(katan => {
        katan.playerList[playerIndex].resource[resource.type]++;
        katanStore.recomputePlayer();
        return katan;
    }),

    roll: (a, b) => update(katna => {
        katna.dice[0] = a;
        katna.dice[1] = b;
        return katan;
    }),

    getNumber: () => katan.dice[0] =  + katan.dice[1],

    isStartable: () => {
        let pickCompletePlayerLength = katan.playerList
            .filter(player => player.pickCastle === 2)
            .filter(player => player.pickRoad === 2)
            .length;

        return pickCompletePlayerLength === katan.playerList.length;
    },

    getActivePlayer: () => {
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
        castle.title = '마을';

        const player = katan.playerList[playerIndex];
        player.pickCastle += 1;
        katan.time = new Date().getTime();

        player.point.castle += 1;
        player.point.sum += 1;
        player.construction.castle -= 1;

        return katan;
    }),

    setRoad: (roadIndex, playerIndex) => update(katan => {
        let road = katan.roadList[roadIndex];
        road.playerIndex = playerIndex;
        road.pick = false;
        road.title = '길';

        const player = katan.playerList[playerIndex];
        player.pickRoad += 1;
        player.construction.road -= 1;

        if (katan.isMakeRoad) {
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

        return katan;
    }),

    makeCastle: () => update(katan => {
        katan.isMakeCastle = true;
        katanStore.setNewCastleRippleEnabled();

        return katan;
    }),

    setNewRoadRippleEnabled: () => update(katan => {
        katan.roadList = katan.roadList
            .map(road => {
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

                if (length > 0) {
                    road.ripple = true;
                    road.hide = false;
                    road.show = true;
                }

                return road;
            });

        return katan;
    }),

    setRoadRippleEnabled: (castleIndex) => update(katan => {
        katan.message = '길을 만들곳을 선택하세요.';

        let roadIndexList = katan.castleList[castleIndex].roadIndexList;
        
        katan.roadList = katan.roadList
            .map(road => {

                let linkLength = roadIndexList.filter(roadIndex => roadIndex === road.index)
                    .filter(roadIndex => katan.roadList[roadIndex].playerIndex === -1)
                    .length;

                if (linkLength > 0) {
                    road.ripple = true;
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

    setCastleRippleEnabled: () => update(katan => {
        katan.message = '마을을 만들곳을 클릭하세요';

        katan.castleList = katan.castleList.map(castle => {
            if (castle.constructable && castle.playerIndex === -1) {
                let linkedCastleLength = castle.castleIndexList
                    .filter(castleIndex => katan.castleList[castleIndex].playerIndex !== -1)
                    .length;

                if (linkedCastleLength === 0) {
                    castle.ripple = true;
                }
            }

            return castle;
        });

        return katan;
    }),

    setNewCastleRippleEnabled: () => update(katan => {
        katan.castleList = katan.castleList.map(castle => {
            if (castle.playerIndex === -1) {
                const castleLength = castle.castleIndexList
                    .filter(castleIndex => katan.castleList[castleIndex].playerIndex === -1)
                    .length;

                if (castleLength === castle.castleIndexList.length) {
                    castle.roadIndexList
                        .forEach(roadIndex => {
                            const road = katan.roadList[roadIndex];

                            if (road.playerIndex === katan.playerIndex) {
                                castle.ripple = true;
                                castle.hide = false;
                                castle.show = true;
                            }
                        });
                }
            }

            return castle;
        });

        return katan;
    }),

    endMakeCastle: () => update(katan => {
        katan.isMakeCastle = false;

        if (!katanStore.hasAction()) {
            katanStore.turn();
        }

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

    setShowCastle: () => update(katan => {
        katan.castleList =  katan.castleList
            .map(castle => {
                if (castle.constructable && castle.playerIndex === -1) {
                    castle.show = true;
                    castle.hide = false;
                }

                return castle;
            });

        return katan;
    }),

    exchange: (player, resourceType, targetResourceType) => update(katan => {
        player.resource[targetResourceType] += 1;
        player.resource[resourceType] -= player.trade[resourceType].count;
        katanStore.recomputePlayer();
        return katan;
    }),

    recomputePlayer: () => update((katan) => {
        katan.playerList = katan.playerList
            .map(player => {
                player.trade.tree.action =
                    katan.rollDice &&
                    player.index === katan.playerIndex;

                player.trade.mud.action =
                    katan.rollDice &&
                    player.index === katan.playerIndex;

                player.trade.wheat.action =
                    katan.rollDice &&
                    player.index === katan.playerIndex;

                player.trade.sheep.action =
                    katan.rollDice &&
                    player.index === katan.playerIndex;

                player.trade.iron.action =
                    katan.rollDice &&
                    player.index === katan.playerIndex;

                player.trade.tree.enable =
                    player.resource.tree >= player.trade.tree.count;

                player.trade.mud.enable =
                    player.resource.mud >= player.trade.mud.count;

                player.trade.wheat.enable =
                    player.resource.wheat >= player.trade.wheat.count;

                player.trade.sheep.enable =
                    player.resource.sheep >= player.trade.sheep.count;

                player.trade.iron.enable =
                    player.resource.iron >= player.trade.iron.count;

                player.make.road =
                    katan.rollDice &&
                    player.index === katan.playerIndex &&
                    player.construction.road >= 1 &&
                    player.resource.tree >= 1 &&
                    player.resource.mud >= 1;

                player.make.castle =
                    katan.rollDice &&
                    player.index === katan.playerIndex &&
                    player.construction.castle >= 1 &&
                    player.resource.tree >= 1 &&
                    player.resource.mud >= 1 &&
                    player.resource.wheat >= 1 &&
                    player.resource.sheep >= 1;

                player.make.city =
                    katan.rollDice &&
                    player.index === katan.playerIndex &&
                    player.construction.city >= 1 &&
                    player.resource.iron >= 3 &&
                    player.resource.wheat >= 2;

                player.make.dev =
                    katan.rollDice &&
                    player.index === katan.playerIndex &&
                    player.resource.iron >= 1 &&
                    player.resource.sheep >= 1 &&
                    player.resource.wheat >= 1;

                return player;
            });

        return katan;
    })
};

export default katanStore;