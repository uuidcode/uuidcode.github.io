import {setRoadRippleEnabled} from "./road";
import config from "./config";
import katanObject from "./katanObject";
import {random} from "./util";

const setHideCastle = (katanStore) => katanStore.update(katan => {
    katan.castleList =  katan.castleList
        .map(castle => {
            if (castle.playerIndex === -1) {
                castle.show = false;
                castle.hide = true;
            }

            return castle;
        });

    return katan;
});

export const setNewCityRippleEnabled = (katanStore) => katanStore.update(katan => {
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
});

const endMakeCastle = (katanStore) => katanStore.update(katan => {
    katan.isMakeCastle = false;
    katanStore.doActionAndTurn();
    return katan;
});

const endMakeCity = (katanStore, castleIndex) => katanStore.update(katan => {
    katan.isMakeCity = false;
    katanStore.doActionAndTurn();
    return katan;
});

export const getPossibleCastleIndexList = (katan) => {
    return katan.castleList
        .filter(castle => castle.playerIndex === -1)
        .map(castle => {
            const castleLength = castle.castleIndexList
                .filter(castleIndex => katan.castleList[castleIndex].playerIndex === -1)
                .length;

            console.log('>>> castleLength1', castle.i,
                castle.j, castle.index, castleLength);

            console.log('>>> castle.castleIndexList', castle.castleIndexList);

            if (castleLength === castle.castleIndexList.length) {
                const castleLength = castle.roadIndexList
                    .filter(roadIndex => {
                        const road = katan.roadList[roadIndex];
                        return road.playerIndex === katan.playerIndex
                    })
                    .length;

                console.log('>>> castleLength2', castleLength);

                if (castleLength > 0) {
                    return castle.index;
                }
            }

            return -1;
        })
        .filter(index => index >= 0);
};

export const makeCastle = (katanStore) => katanStore.update(katan => {
    katan.isMakeCastle = true;
    setNewCastleRippleEnabled();
    return katan;
});

export const makeCity = (katanStore) => katanStore.update(katan => {
    katan.isMakeCity = true;
    setNewCityRippleEnabled();
    return katan;
});

export const setCastleRippleDisabled = (katanStore) => katanStore.update(katan => {
    katan.castleList = katan.castleList.map(castle => {
        castle.ripple = false;
        return castle;
    });

    return katan;
});

export const castleClickable = (katanStore, katan, castleIndex) => {
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
};

export const clickMakeCastle = (katanStore, castleIndex) => katanStore.update(katan => {
    if (!castleClickable(katan, castleIndex)) {
        return katan;
    }

    const player = katanStore.getActivePlayer();
    setCastle(castleIndex, player.index);
    setHideCastle();
    setCastleRippleDisabled();

    if (katan.isMakeCastle) {
        endMakeCastle();
    } else if (katan.isMakeCity){
        endMakeCity(castleIndex);
    } else {
        setRoadRippleEnabled(castleIndex);
    }

    return katan;
});

const setCastle = (katanStore, castleIndex, playerIndex) => katanStore.update(katan => {
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
});

export const showConstructableCastle = (katanStore) => katanStore.update(katan => {
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
});

const setNewCastleRippleEnabled = (katanStore) => katanStore.update(katan => {
    const castleIndexList = getPossibleCastleIndexList(katan);

    katan.castleList = katan.castleList.map(castle => {
        if (castleIndexList.includes(castle.index)) {
            castle.hide = false;
            castle.show = true;
        }

        return castle;
    });

    return katan;
});

export const createCastleList = () => {
    const castleList = [];

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

                    castleList.push({
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

                    castleList.push({
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

                castleList.push({
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

    castleList.forEach((castle, index) => castle.index = index);
    castleList.forEach((castle) => castle.playerIndex = -1);
    castleList.forEach((castle) => castle.city = false);
    castleList.forEach(castle => castle.constructable = castle.show);
    castleList.forEach(castle => castle.title = '');
    castleList.forEach(castle => castle.tradable = false);

    castleList[0].port = {
        enabled: true,
        placement: 'top'
    };

    castleList[1].port = {
        enabled: true,
        placement: 'top'
    };

    castleList[2].port = {
        enabled: true,
        placement: 'top'
    };

    castleList[3].port = {
        enabled: true,
        placement: 'top'
    };

    castleList[4].port = {
        enabled: true,
        placement: 'top'
    };

    castleList[5].port = {
        enabled: true,
        placement: 'top'
    };

    castleList[6].port = {
        enabled: true,
        placement: 'top'
    };

    castleList[7].port = {
        enabled: true,
        placement: 'left'
    };

    castleList[8].port = {
        enabled: true,
        placement: 'left'
    };

    castleList[9].port = {
        enabled: false
    };

    castleList[10].port = {
        enabled: false
    };

    castleList[11].port = {
        enabled: false
    };

    castleList[12].port = {
        enabled: false
    };

    castleList[13].port = {
        enabled: false
    };

    castleList[14].port = {
        enabled: true,
        placement: 'right'
    };

    castleList[15].port = {
        enabled: true,
        placement: 'right'
    };

    castleList[16].port = {
        enabled: true,
        placement: 'left'
    };

    castleList[17].port = {
        enabled: true,
        placement: 'left'
    };

    castleList[18].port = {
        enabled: false
    };

    castleList[19].port = {
        enabled: false
    };

    castleList[20].port = {
        enabled: false
    };

    castleList[21].port = {
        enabled: false
    };

    castleList[22].port = {
        enabled: false
    };

    castleList[23].port = {
        enabled: false
    };

    castleList[24].port = {
        enabled: false
    };

    castleList[25].port = {
        enabled: true,
        placement: 'right'
    };

    castleList[26].port = {
        enabled: true,
        placement: 'right'
    };

    castleList[27].port = {
        enabled: true,
        placement: 'left'
    };

    castleList[28].port = {
        enabled: true,
        placement: 'left'
    };

    castleList[29].port = {
        enabled: false
    };

    castleList[30].port = {
        enabled: false
    };

    castleList[31].port = {
        enabled: false
    };

    castleList[32].port = {
        enabled: false
    };

    castleList[33].port = {
        enabled: false
    };

    castleList[34].port = {
        enabled: false
    };

    castleList[35].port = {
        enabled: false
    };

    castleList[36].port = {
        enabled: true,
        placement: 'right'
    };

    castleList[37].port = {
        enabled: true,
        placement: 'right'
    };

    castleList[38].port = {
        enabled: true,
        placement: 'left'
    };

    castleList[39].port = {
        enabled: true,
        placement: 'left'
    };

    castleList[40].port = {
        enabled: false
    };

    castleList[41].port = {
        enabled: false
    };

    castleList[42].port = {
        enabled: false
    };

    castleList[43].port = {
        enabled: false
    };

    castleList[44].port = {
        enabled: false
    };

    castleList[45].port = {
        enabled: true,
        placement: 'right'
    };

    castleList[46].port = {
        enabled: true,
        placement: 'right'
    };

    castleList[47].port = {
        enabled: true,
        placement: 'bottom'
    };

    castleList[48].port = {
        enabled: true,
        placement: 'bottom'
    };

    castleList[49].port = {
        enabled: true,
        placement: 'bottom'
    };

    castleList[50].port = {
        enabled: true,
        placement: 'bottom'
    };

    castleList[51].port = {
        enabled: true,
        placement: 'bottom'
    };

    castleList[52].port = {
        enabled: true,
        placement: 'bottom'
    };
    
    castleList[53].port = {
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

    castleList.filter(castle => castle.port.enabled)
        .map(castle => castle.index)
        .sort(random())
        .slice(0, portList.length)
        .forEach(i => {
            const port = portList.pop();

            castleList[i].port = {
                ...castleList[i].port,
                trade: port.trade,
                type: port.type,
                tradable: true
            }
        });

    castleList[0].roadIndexList = [0, 6];
    castleList[1].roadIndexList = [0, 1];
    castleList[2].roadIndexList = [1, 2, 7];
    castleList[3].roadIndexList = [2, 3];
    castleList[4].roadIndexList = [3, 4, 8];
    castleList[5].roadIndexList = [4, 5];
    castleList[6].roadIndexList = [5, 9];

    castleList[7].roadIndexList = [18, 10];
    castleList[8].roadIndexList = [6, 10, 11];
    castleList[9].roadIndexList = [11, 12, 19];
    castleList[10].roadIndexList = [7, 12, 13];
    castleList[11].roadIndexList = [13, 14, 20];
    castleList[12].roadIndexList = [8, 14, 15];
    castleList[13].roadIndexList = [15, 16, 21];
    castleList[14].roadIndexList = [9, 16, 17];
    castleList[15].roadIndexList = [17, 22];

    castleList[16].roadIndexList = [23, 33];
    castleList[17].roadIndexList = [18, 23, 24];
    castleList[18].roadIndexList = [24, 25, 34];
    castleList[19].roadIndexList = [19, 25, 26];
    castleList[20].roadIndexList = [26, 27, 35];
    castleList[21].roadIndexList = [20, 27, 28];
    castleList[22].roadIndexList = [28, 29, 36];
    castleList[23].roadIndexList = [21, 29, 30];
    castleList[24].roadIndexList = [30, 31, 37];
    castleList[25].roadIndexList = [22, 31, 32];
    castleList[26].roadIndexList = [32, 38];

    castleList[27].roadIndexList = [33, 39];
    castleList[28].roadIndexList = [39, 40, 49];
    castleList[29].roadIndexList = [34, 40, 41];
    castleList[30].roadIndexList = [41, 42, 50];
    castleList[31].roadIndexList = [35, 42, 43];
    castleList[32].roadIndexList = [43, 44, 51];
    castleList[33].roadIndexList = [36, 44, 45];
    castleList[34].roadIndexList = [45, 46, 52];
    castleList[35].roadIndexList = [37, 46, 47];
    castleList[36].roadIndexList = [47, 48, 53];
    castleList[37].roadIndexList = [38, 48];

    castleList[38].roadIndexList = [49, 54];
    castleList[39].roadIndexList = [54, 55, 62];
    castleList[40].roadIndexList = [50, 55, 56];
    castleList[41].roadIndexList = [56, 57, 63];
    castleList[42].roadIndexList = [51, 57, 58];
    castleList[43].roadIndexList = [58, 59, 64];
    castleList[44].roadIndexList = [52, 59, 60];
    castleList[45].roadIndexList = [60, 61, 65];
    castleList[46].roadIndexList = [53, 61];

    castleList[47].roadIndexList = [62, 66];
    castleList[48].roadIndexList = [66, 67];
    castleList[49].roadIndexList = [63, 67, 68];
    castleList[50].roadIndexList = [68, 69];
    castleList[51].roadIndexList = [64, 69, 70];
    castleList[52].roadIndexList = [70, 71];
    castleList[53].roadIndexList = [65, 71];

    castleList[0].castleIndexList = [1, 8];
    castleList[1].castleIndexList = [0, 2];
    castleList[2].castleIndexList = [1, 3, 10];
    castleList[3].castleIndexList = [2, 4];
    castleList[4].castleIndexList = [3, 5, 12];
    castleList[5].castleIndexList = [4, 6];
    castleList[6].castleIndexList = [5, 14];

    castleList[7].castleIndexList = [8, 17];
    castleList[8].castleIndexList = [0, 7, 9];
    castleList[9].castleIndexList = [8, 10, 19];
    castleList[10].castleIndexList = [2, 9, 11];
    castleList[11].castleIndexList = [10, 12, 21];
    castleList[12].castleIndexList = [4, 11 ,13];
    castleList[13].castleIndexList = [12, 14, 23];
    castleList[14].castleIndexList = [6, 13, 15];
    castleList[15].castleIndexList = [14, 25];

    castleList[16].castleIndexList = [17, 27];
    castleList[17].castleIndexList = [7, 16, 18];
    castleList[18].castleIndexList = [17, 19, 29];
    castleList[19].castleIndexList = [9, 18, 20];
    castleList[20].castleIndexList = [19, 21, 31];
    castleList[21].castleIndexList = [11, 20, 22];
    castleList[22].castleIndexList = [21, 23, 33];
    castleList[23].castleIndexList = [13, 22, 24];
    castleList[24].castleIndexList = [23, 25, 35];
    castleList[25].castleIndexList = [15, 24, 26];
    castleList[26].castleIndexList = [25, 37];

    castleList[27].castleIndexList = [16, 28];
    castleList[28].castleIndexList = [27, 29, 38];
    castleList[29].castleIndexList = [18, 28, 30];
    castleList[30].castleIndexList = [29, 31, 40];
    castleList[31].castleIndexList = [20, 30, 32];
    castleList[32].castleIndexList = [31, 33, 42];
    castleList[33].castleIndexList = [22, 32, 34];
    castleList[34].castleIndexList = [33, 35, 44];
    castleList[35].castleIndexList = [24, 34, 36];
    castleList[36].castleIndexList = [35, 37, 46];
    castleList[37].castleIndexList = [26, 36];

    castleList[38].castleIndexList = [28, 39];
    castleList[39].castleIndexList = [38, 40, 47];
    castleList[40].castleIndexList = [30, 39, 41];
    castleList[41].castleIndexList = [40, 42, 49];
    castleList[42].castleIndexList = [32, 41, 43];
    castleList[43].castleIndexList = [42, 44, 51];
    castleList[44].castleIndexList = [34, 43, 45];
    castleList[45].castleIndexList = [44, 46, 53];
    castleList[46].castleIndexList = [36, 45];

    castleList[47].castleIndexList = [39, 48];
    castleList[48].castleIndexList = [47, 49];
    castleList[49].castleIndexList = [41, 48, 50];
    castleList[50].castleIndexList = [49, 51];
    castleList[51].castleIndexList = [43, 50, 52];
    castleList[52].castleIndexList = [51, 53];
    castleList[53].castleIndexList = [45, 52];
    
    return castleList;
};