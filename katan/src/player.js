import katanStore from './katan.js'
import { recomputeRoad } from "./road";
import {getPossibleCastleIndexList} from "./castle";
import {getPossibleRoadTotalLength} from "./road";

export const recomputePlayer = () => {
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

                const possibleCastleIndexList =
                    getPossibleCastleIndexList(katan);

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
};