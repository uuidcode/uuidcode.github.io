import katanStore from './katan.js'

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

    const roadList = getLinkedRoadList(katan, player, road, resultList);

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

const getLinkedRoadList = (katan, player, road, resultList) => {
    const roadIndex = road.index;

    return katan.roadList[roadIndex]
        .roadIndexList
        .map(index => katan.roadList[index])
        .filter(road => road.playerIndex === player.index);
};