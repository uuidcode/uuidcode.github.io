import katanStore from './katan.js'
import {showConstructableCastle} from "./castle";
import {get} from "svelte/store";

const getLoadTopBySingle = (katanObject, multiple) => {
    return multiple * katanObject.config.cell.height / 8 - katanObject.config.load.width / 2 ;
};

const getLoadTop = (katanObject, currentRow, targetRow, currentMultiple, targetMultiple) => {
    let multiple = currentMultiple;

    if (currentRow === targetRow) {
        multiple = targetMultiple;
    }

    return getLoadTopBySingle(katanObject, multiple) ;
};

export const createRoadList = (katanObject) => {
    const roadList = [];

    for (let i = 0; i <= 11; i++) {
        for (let j = 0; j <= 20; j++) {
            if (i === 0 || i === 11) {
                if (j === 5 || j === 7 || j === 9 || j === 11 || j === 13 || j === 15) {
                    let top = getLoadTop(katanObject, i, 11, 1, 31);

                    roadList.push({
                        left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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
                    let top = getLoadTop(katanObject, i, 10, 4, 28);

                    roadList.push({
                        left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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
                    let top = getLoadTop(katanObject, i, 9, 7, 25);

                    roadList.push({
                        left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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

                    let top = getLoadTop(katanObject, i, 8, 10, 22);

                    roadList.push({
                        left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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

                    let top = getLoadTop(katanObject, i, 7, 13, 19);

                    roadList.push({
                        left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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
                    let top = getLoadTopBySingle(katanObject, 16);

                    roadList.push({
                        left: j * (katanObject.config.cell.width / 4) - katanObject.config.load.width / 2,
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

    roadList.forEach((road, index) => road.index = index);
    roadList.forEach(road => road.hide = true);
    roadList.forEach(road => road.show = false);
    roadList.forEach(road => road.ripple = false);
    roadList.forEach(road => road.playerIndex = -1);
    roadList.forEach(road => road.title = '');

    roadList[0].castleIndexList = [0, 1];
    roadList[1].castleIndexList = [1, 2];
    roadList[2].castleIndexList = [2, 3];
    roadList[3].castleIndexList = [3, 4];
    roadList[4].castleIndexList = [4, 5];
    roadList[5].castleIndexList = [5, 6];

    roadList[6].castleIndexList = [0, 8];
    roadList[7].castleIndexList = [2, 10];
    roadList[8].castleIndexList = [4, 12];
    roadList[9].castleIndexList = [6, 14];

    roadList[10].castleIndexList = [7, 8];
    roadList[11].castleIndexList = [8, 9];
    roadList[12].castleIndexList = [9, 10];
    roadList[13].castleIndexList = [10, 11];
    roadList[14].castleIndexList = [11, 12];
    roadList[15].castleIndexList = [12, 13];
    roadList[16].castleIndexList = [13, 14];
    roadList[17].castleIndexList = [14, 15];

    roadList[18].castleIndexList = [7, 17];
    roadList[19].castleIndexList = [9, 19];
    roadList[20].castleIndexList = [11, 21];
    roadList[21].castleIndexList = [13, 23];
    roadList[22].castleIndexList = [15, 25];

    roadList[23].castleIndexList = [16, 17];
    roadList[24].castleIndexList = [17, 18];
    roadList[25].castleIndexList = [18, 19];
    roadList[26].castleIndexList = [19, 20];
    roadList[27].castleIndexList = [20, 21];
    roadList[28].castleIndexList = [21, 22];
    roadList[29].castleIndexList = [22, 23];
    roadList[30].castleIndexList = [23, 24];
    roadList[31].castleIndexList = [24, 25];
    roadList[32].castleIndexList = [25, 26];

    roadList[33].castleIndexList = [16, 27];
    roadList[34].castleIndexList = [18, 29];
    roadList[35].castleIndexList = [20, 31];
    roadList[36].castleIndexList = [22, 33];
    roadList[37].castleIndexList = [24, 35];
    roadList[38].castleIndexList = [26, 37];

    roadList[39].castleIndexList = [27, 28];
    roadList[40].castleIndexList = [28, 29];
    roadList[41].castleIndexList = [29, 30];
    roadList[42].castleIndexList = [30, 31];
    roadList[43].castleIndexList = [31, 32];
    roadList[44].castleIndexList = [32, 33];
    roadList[45].castleIndexList = [33, 34];
    roadList[46].castleIndexList = [34, 35];
    roadList[47].castleIndexList = [35, 36];
    roadList[48].castleIndexList = [36, 37];

    roadList[49].castleIndexList = [28, 38];
    roadList[50].castleIndexList = [30, 40];
    roadList[51].castleIndexList = [32, 42];
    roadList[52].castleIndexList = [34, 44];
    roadList[53].castleIndexList = [36, 46];

    roadList[54].castleIndexList = [38, 39];
    roadList[55].castleIndexList = [39, 40];
    roadList[56].castleIndexList = [40, 41];
    roadList[57].castleIndexList = [41, 42];
    roadList[58].castleIndexList = [42, 43];
    roadList[59].castleIndexList = [43, 44];
    roadList[60].castleIndexList = [44, 45];
    roadList[61].castleIndexList = [45, 46];

    roadList[62].castleIndexList = [39, 47];
    roadList[63].castleIndexList = [41, 49];
    roadList[64].castleIndexList = [43, 51];
    roadList[65].castleIndexList = [45, 53];

    roadList[66].castleIndexList = [47, 48];
    roadList[67].castleIndexList = [48, 49];
    roadList[68].castleIndexList = [49, 50];
    roadList[69].castleIndexList = [50, 51];
    roadList[70].castleIndexList = [51, 52];
    roadList[71].castleIndexList = [52, 53];

    roadList[0].roadIndexList = [1, 6];
    roadList[1].roadIndexList = [0, 2, 7];
    roadList[2].roadIndexList = [1, 3, 7];
    roadList[3].roadIndexList = [2, 4, 8];
    roadList[4].roadIndexList = [3, 5, 8];
    roadList[5].roadIndexList = [4, 9];

    roadList[6].roadIndexList = [0, 10, 11];
    roadList[7].roadIndexList = [1, 2, 12 , 13];
    roadList[8].roadIndexList = [3, 4, 14, 15];
    roadList[9].roadIndexList = [5, 16, 17];

    roadList[10].roadIndexList = [6, 11, 18];
    roadList[11].roadIndexList = [6, 10, 12, 19];
    roadList[12].roadIndexList = [7, 11, 13, 19];
    roadList[13].roadIndexList = [7, 12, 14, 20];
    roadList[14].roadIndexList = [8, 13, 15, 20];
    roadList[15].roadIndexList = [8, 14, 16, 21];
    roadList[16].roadIndexList = [9, 15, 17, 21];
    roadList[17].roadIndexList = [9, 16, 22];

    roadList[18].roadIndexList = [10, 23, 24];
    roadList[19].roadIndexList = [11, 12, 25, 26];
    roadList[20].roadIndexList = [13, 14, 27, 28];
    roadList[21].roadIndexList = [15, 16, 29, 30];
    roadList[22].roadIndexList = [17, 31, 32];

    roadList[23].roadIndexList = [18, 24, 33];
    roadList[24].roadIndexList = [18, 23, 25, 34];
    roadList[25].roadIndexList = [19, 24, 26, 34];
    roadList[26].roadIndexList = [19, 25, 27, 35];
    roadList[27].roadIndexList = [20, 26, 28, 35];
    roadList[28].roadIndexList = [20, 27, 29, 36];
    roadList[29].roadIndexList = [21, 28, 30, 36];
    roadList[30].roadIndexList = [21, 29, 31, 37];
    roadList[31].roadIndexList = [22, 30, 32, 37];
    roadList[32].roadIndexList = [22, 31, 38];

    roadList[33].roadIndexList = [23, 39];
    roadList[34].roadIndexList = [24, 25, 40, 41];
    roadList[35].roadIndexList = [26, 27, 42, 43];
    roadList[36].roadIndexList = [28, 29, 44, 45];
    roadList[37].roadIndexList = [30, 31, 46, 47];
    roadList[38].roadIndexList = [32, 48];

    roadList[39].roadIndexList = [33, 40, 49];
    roadList[40].roadIndexList = [34, 39, 41, 49];
    roadList[41].roadIndexList = [34, 40, 42, 50];
    roadList[42].roadIndexList = [35, 41, 43, 50];
    roadList[43].roadIndexList = [35, 42, 44, 51];
    roadList[44].roadIndexList = [36, 43, 45, 51];
    roadList[45].roadIndexList = [36, 44, 46, 52];
    roadList[46].roadIndexList = [37, 45, 47, 52];
    roadList[47].roadIndexList = [37, 46, 48, 53];
    roadList[48].roadIndexList = [38, 47, 53];

    roadList[49].roadIndexList = [39, 40, 54];
    roadList[50].roadIndexList = [41, 42, 55, 56];
    roadList[51].roadIndexList = [43, 44, 57, 58];
    roadList[52].roadIndexList = [45, 46, 59, 60];
    roadList[53].roadIndexList = [47, 48, 61];

    roadList[54].roadIndexList = [49, 55, 62];
    roadList[55].roadIndexList = [50, 54, 56, 62];
    roadList[56].roadIndexList = [50, 55, 57, 63];
    roadList[57].roadIndexList = [51, 56, 58, 63];
    roadList[58].roadIndexList = [51, 57, 59, 64];
    roadList[59].roadIndexList = [52, 58, 60, 64];
    roadList[60].roadIndexList = [52, 59, 61, 65];
    roadList[61].roadIndexList = [53, 60, 65];

    roadList[62].roadIndexList = [54, 55, 66];
    roadList[63].roadIndexList = [56, 57, 66, 68];
    roadList[64].roadIndexList = [58, 59, 69, 70];
    roadList[65].roadIndexList = [60, 61, 71];

    roadList[66].roadIndexList = [62, 67];
    roadList[67].roadIndexList = [63, 66, 68];
    roadList[68].roadIndexList = [63, 67, 69];
    roadList[69].roadIndexList = [64, 68, 70];
    roadList[70].roadIndexList = [64, 69, 71];
    roadList[71].roadIndexList = [65, 70];
    
    return roadList;
};

export const recomputeRoad = () =>  {
    recomputeLongRoad();
    recomputeRoadPoint();
};

const recomputeRoadPoint = () => katanStore.update(katan => {
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
});

const recomputeLongRoad = () => {
    katanStore.update(katan => {
        katan.playerList
            .forEach(player => {
                const list = katan.roadList
                    .filter(road => road.playerIndex === player.index);

                list.forEach(road => {
                    processLinkedRoadList(katan, player, road, []);
                });
            });

        return katan;
    });
};

export const processLinkedRoadList = (katan, player, road, resultList) => {
    if (resultList.includes(road.index)) {
        return;
    }

    const resultListLength = resultList.length;

    if (resultListLength >= 2) {
        const a = getIntersectionCastle(katan,
            resultList[resultListLength - 1],
            road.index);

        const b = getIntersectionCastle(katan,
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

    const roadList = getLinkedRoadList(katan, player, road);

    if (resultList.length > player.maxRoadLength) {
        player.maxRoadLength = resultList.length;
    }

    if (roadList.length === 0) {
        return;
    }

    roadList.forEach(currentRoad => {
        processLinkedRoadList(katan, player, currentRoad, [...resultList]);
    });
};

const getIntersectionCastle = (katan, roadIndexA, roadIndexB) => {
    const listA = katan.roadList[roadIndexA].castleIndexList;
    const listB = katan.roadList[roadIndexB].castleIndexList;
    return listA.find(index => listB.includes(index));
};

const getLinkedRoadList = (katan, player, road) => {
    const roadIndex = road.index;

    return katan.roadList[roadIndex]
        .roadIndexList
        .map(index => katan.roadList[index])
        .filter(road => road.playerIndex === player.index);
};

export const setHideRoad = () => katanStore.update(katan => {
    katan.roadList =  katan.roadList
        .map(road => {
            if (road.playerIndex === -1) {
                road.show = false;
                road.hide = true;
            }

            return road;
        });

    return katan;
});

export const setRoadRippleDisabled = () => katanStore.update(katan => {
    katan.roadList = katan.roadList
        .map(road => {
            road.ripple = false;
            return road;
        });

    return katan;
});

export const clickMakeRoad = (roadIndex) =>{
    const katan = get(katanStore);
    const player = katanStore.getActivePlayer();

    console.log('clickMakeRoad', player.index, roadIndex);

    if (katan.roadList[roadIndex].playerIndex !== -1) {
        return;
    }

    setRoad(roadIndex, player.index);
    setHideRoad();
    setRoadRippleDisabled();

    if (katan.isStartMode) {
        endMakeRoad();
        return;
    }

    showConstructableCastle();
    endMakeRoad();
    katanStore.turn();

    if (katanStore.isStartable()) {
        katanStore.start();
    }
};

export const getPossibleRoadTotalLength = (katan) => {
    return katan.roadList
        .map(road => getPossibleRoadLength(katan, road))
        .reduce((a, b) => a + b);
};

export const getPossibleRoadLength = (katan, road) => {
    if (road.playerIndex === -1) {
        return road.roadIndexList
            .map(roadIndex => katan.roadList[roadIndex])
            .filter(currentRoad => {
                const castleListA = road.castleIndexList;
                const castleListB = currentRoad.castleIndexList;
                const currentCastleIndex = castleListA
                    .find(castleIndex => castleListB.includes(castleIndex));

                if (currentCastleIndex) {
                    const castle = katan.castleList[currentCastleIndex];

                    return currentRoad.playerIndex === katan.playerIndex &&
                        (castle.playerIndex === -1 || castle.playerIndex === katan.playerIndex)
                }

                return currentRoad.playerIndex === katan.playerIndex;
            })
            .length;
    }

    return 0;
};

export const setNewRoadRippleEnabled = () => {
    katanStore.update(katan => {
        katan.roadList = katan.roadList
            .map(road => {
                let length = getPossibleRoadLength(katan, road);

                if (length > 0) {
                    road.hide = false;
                    road.show = true;
                }

                return road;
            });

        return katan;
    });

    const katan = get(katanStore);

    const roadLength = katan.roadList.filter(road => road.show).length;
    const player = katanStore.getActivePlayer();

    if (katan.isMakeRoad2Mode) {
        if (player.construction.road === 0 || roadLength === 0) {
            alert('도로를 만들수 없습니다.');
            katanStore.unsetMakeRoad2Mode();
            katanStore.unsetMakeRoadMode();
            setHideRoad();
            return;
        }

        if (player.construction.road === 1 || roadLength === 1) {
            alert('도로를 1개만 만들 수 있습니다.');
            katanStore.unsetMakeRoad2Mode();
            katanStore.update(katan => {
                katan.makeRoadCount = 1;
                return katan;
            });
        }
    }
};

export const makeRoad = () => {
    katanStore.update(katan => {
        console.log('makeRoad', katan.playerIndex);
        katan.isMakeRoadMode = true;
        return katan;
    });

    setNewRoadRippleEnabled();
};

export const setRoadRippleEnabled = (castleIndex) => katanStore.update(katan => {
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
});

const endMakeRoad = () => katanStore.update(katan => {
    if (katan.isMakeRoad2Mode) {
        katan.makeRoadCount += 1;
    } else {
        katan.isMakeRoadMode = false;
    }

    if (katan.isStartMode) {
        if (katan.isMakeRoad2Mode && katan.makeRoadCount === 1) {
            makeRoad();
        } else {
            katan.isMakeRoad2Mode = false;
            katan.isMakeRoadMode = false;
            katan.makeRoadCount = 0;
            katanStore.doActionAndTurn();
        }
    }

    return katan;
});

export const setRoad = (roadIndex, playerIndex) => katanStore.update(katan => {
    let road = katan.roadList[roadIndex];
    road.playerIndex = playerIndex;
    road.pick = false;
    road.title = '도로';

    const player = katan.playerList[playerIndex];
    player.pickRoad += 1;
    player.construction.road -= 1;

    if (katan.isStartMode &&
        katan.isMakeRoadMode &&
        katan.isMakeRoad2Mode === false) {
        player.resource.tree -= 1;
        player.resource.mud -= 1;
    }

    return katan;
});