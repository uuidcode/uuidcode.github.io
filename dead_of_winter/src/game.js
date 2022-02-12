import itemCardList from './itemCardList';
import placeList from "./placeList";
import survivorList from "./survivorList";
import riskCardList from "./riskCardList";

const game = {
    round: 6,
    moral: 6,
    survivorCount: 0,
    itemCardCount: 0,
    riskCardList: riskCardList,
    itemCardList: itemCardList,
    initItemCardList: [
        "식량1", "식량1", "식량1", "식량1", "식량1",
        "식량1", "식량1", "식량1", "식량1", "식량1",
        '약',  '약', '약', '약', '약',
        "잡동사니", "잡동사니", "잡동사니", "잡동사니", "잡동사니",
        "연료", "연료", "연료","연료","연료"
    ],
    placeList: placeList,
    survivorList: survivorList,
    playerList: [
        {
            name: '테드',
            survivorList: [],
            itemCardList:[]
        },
        {
            name: '다은',
            survivorList: [],
            itemCardList:[]
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

game.survivorList.forEach(survivor => {
    return survivor.woundedCount = 0;
});

export default game;