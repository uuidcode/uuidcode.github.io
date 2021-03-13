import {recomputeRoad} from "./road";
import {getPossibleCastleIndexList} from "./castle";
import {getPossibleRoadTotalLength} from "./road";

export const createPlayerList = () => {
    const playerList = [
        {
            color: '#E4A2AE',
            name: '다은',
            turn: true,
            pickCastle: 0,
            pickRoad: 0,
            image: 'apeach.png',
            maxRoadLength: 0,
            resourceSum: 0
        },
        {
            color: '#90CDEA',
            name: '아빠',
            turn: false,
            pickCastle: 0,
            pickRoad: 0,
            image: 'lion.png',
            maxRoadLength: 0,
            resourceSum: 0
        }
    ];

    playerList.forEach((player, i) => {
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

    return createPlayerList;
};

export const recomputePlayer = (katanStore) => {
    recomputeRoad();

    katanStore.update(katan => {
        katan.playerList = katan.playerList
            .map(player => {
                let sum = player.point.knight;
                sum += player.point.road;
                sum += player.point.point;
                sum += player.point.castle;
                sum += player.point.city;

                player.point.sum = sum;
                player.resourceSum = katanStore.sumResource(katan, player);

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
                    getPossibleRoadTotalLength(katan) > 0;

                player.make.castle =
                    katanStore.isActive(katan) &&
                    player.index === katan.playerIndex &&
                    player.construction.castle >= 1 &&
                    player.resource.tree >= 1 &&
                    player.resource.mud >= 1 &&
                    player.resource.wheat >= 1 &&
                    player.resource.sheep >= 1 &&
                    getPossibleCastleIndexList(katan).length > 0;

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
};