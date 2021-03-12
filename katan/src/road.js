import katanStore from './katan.js'
import {recomputePlayer} from "./player";
import {showConstructableCastle} from "./castle";

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

export const clickMakeRoad = (roadIndex) => katanStore.update(katan => {
    if (!katan.isMakeRoad) {
        return katan;
    }

    const player = katanStore.getActivePlayer();
    setRoad(roadIndex, player.index);
    setHideRoad();
    setRoadRippleDisabled();

    if (katan.isStart) {
        endMakeRoad();
    } else {
        showConstructableCastle();
        endMakeRoad();
        katanStore.turn();

        if (katanStore.isStartable()) {
            katanStore.start();
        }
    }

    return katan;
});

export const getPossibleRoadTotalLength = (katan) => {
    return katan.roadList
        .map(road => getPossibleRoadLength(katan, road))
        .reduce((a, b) => a + b);
};

export const getPossibleRoadLength = (katan, road) => {
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
};

export const setNewRoadRippleEnabled = () => katanStore.update(katan => {
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

export const makeRoad = () => katanStore.update(katan => {
    katan.isMakeRoad = true;

    setNewRoadRippleEnabled();
    recomputePlayer();

    return katan;
});

export const setRoadRippleEnabled = (castleIndex) => katanStore.update(katan => {
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
});

const endMakeRoad =() => katanStore.update(katan => {
    if (katan.isMakeRoad2) {
        katan.makeRoadCount += 1;
    } else {
        katan.isMakeRoad = false;
    }

    if (katan.isStart) {
        if (katan.isMakeRoad2 && katan.makeRoadCount === 1) {
            makeRoad();
        } else {
            katan.isMakeRoad2 = false;
            katan.isMakeRoad = false;
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

    if (katan.isStart && katan.isMakeRoad && katan.isMakeRoad2 === false) {
        player.resource.tree -= 1;
        player.resource.mud -= 1;
    }

    return katan;
});