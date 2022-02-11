import itemCardList from './itemCardList';
import placeList from "./placeList";
import survivorList from "./survivorList";
import riskCardList from "./riskCardList";

const game = {
    round: 6,
    moral: 6,
    survivorCount: 0,
    riskCardList: riskCardList,
    itemCardList: itemCardList,
    placeList: placeList,
    survivorList: survivorList,
    playerList: [
        {
            name: '테드',
            survivorIndexList: [0, 3],
            itemCardList:['권총', "약", "잡동사니", "약", "약", "잡동사니"]
        },
        {
            name: '다은',
            survivorIndexList: [1, 2],
            itemCardList:['주사기']
        }
    ]
}

const groupByType = game.survivorList
    .reduce((group, survivor) => {
        const { ability } = survivor;

        const key = `${ability.type}-${ability.place}`;
        group[key] = group[key] ?? 0;
        group[key]++;

        return group;
    }, {});

console.log('>>> groupByType', groupByType);

game.survivorList.forEach(survivor => {
    return survivor.woundedCount = 0;
});

export default game;