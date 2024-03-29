import itemCardList from './itemCardList';
import placeList from "./placeList";
import survivorList from "./survivorList";
import riskCardList from "./riskCardList";

const game = {
    fail: false,
    itemCardAnimationType: 'risk',
    modalClass: '',
    modalType: '',
    actionType: '',
    currentActionIndex: -1,
    goal: '좀비 40구를 잡아라',
    messageList: [],
    zombieIndex: 0,
    entranceZombieIndex: 0,
    foodIndex: 0,
    campFoodIndex: 0,
    campTrashIndex: 0,
    selectedItemCardFeature: null,
    selectedActionIndex: 0,
    actionTable: [],
    currentPlace: null,
    currentPlaceName: '피난기지',
    currentRiskCard: null,
    riskCard: true,
    dangerDice: false,
    currentSurvivor: null,
    successRiskCardList: [],
    currentPlayer: null,
    canTurn: false,
    canAction: false,
    rollDice: false,
    turn: 0,
    round: 6,
    moral: 6,
    survivorCount: 0,
    deadSurvivorCount: 0,
    deadSurvivorList: [],
    zombieCount: 0,
    zombieTokenCount: 0,
    deadZombieCount: 0,
    deadZombieList: [],
    itemCardCount: 0,
    riskCardList: riskCardList,
    itemCardList: itemCardList,
    initItemCardList: [
        '식량1', '식량1', "식량1", "식량1", "식량1",
        "식량1", "식량1", "식량1", "식량1", "식량1",
        '약',  '약', '약', '약', '약',
        "잡동사니", "잡동사니", "잡동사니", "잡동사니", "잡동사니",
        "연료", "연료", "연료","연료","연료"
    ],
    placeList: placeList,
    survivorList: survivorList,
    playerList: [
        {
            index: 0,
            name: '테드',
            color: '#e3befa',
            survivorList: [],
            itemCardList:[],
            actionDiceList: [],
            actionTable: []
        },
        {
            index: 1,
            name: '다은',
            color: '#FCF3CF  ',
            survivorList: [],
            itemCardList:[],
            actionDiceList: [],
            actionTable: []
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