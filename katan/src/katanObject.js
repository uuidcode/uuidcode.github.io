import {createCardList} from "./card";
import {createPlayerList} from "./player";
import {createCastleList} from "./castle";
import {createRoadList} from "./road";
import {createResourceList} from "./resource";

const katanObject = {
    testDice: 0,
    maxRoadLength: 0,
    resourceTypeList: [
        {
            type: 'tree'
        },
        {
            type: 'mud'
        },
        {
            type: 'wheat'
        },
        {
            type: 'sheep'
        },
        {
            type: 'iron'
        }
    ],
    rollDice: false,
    action: false,
    isGetResource: false,
    isTakeResource: false,
    isMakeRoadMode: false,
    isMakeRoad2Mode: false,
    makeRoadCount: 0,
    getResourceCount: 0,
    takeResourceFromBurglarCount: 0,
    takeResourceFromBurglarCompleteCount: 0,
    isMakeCastle: false,
    isMakeCity: false,
    construction: false,
    isKnightMode: false,
    isBurglarMode: false,
    message: '마을을 만들곳을 클릭하세요',
    diceDisabled: true,
    dice: [6, 6],
    sumDice: 12,
    mode: 'ready',
    isReady: true,
    isStartMode: false,
    playerIndex: 0,
    showResourceModal: false,
    config: {
        debug: false,
        cell: {
            width: 130,
            height: 130,
            margin: 2
        },
        castle: {
            width: 32,
            height: 32,
        },
        load: {
            width: 32,
            height: 32,
        },
        number: {
            width: 60,
            height: 60,
        },
        resource: {
            width: 60,
            height: 60,
        },
        burglar: {
            width: 90,
            height: 90,
        },
        selectedColor: 'blueviolet'
    }

};

katanObject.cardList = createCardList();
katanObject.afterCardList = [];

katanObject.playerList = createPlayerList();
katanObject.castleList = createCastleList(katanObject);
katanObject.roadList = createRoadList(katanObject);
katanObject.resourceList = createResourceList(katanObject);

export default katanObject;