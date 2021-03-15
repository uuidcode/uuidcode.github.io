import config from './config.js'
import {random, shuffle} from "./util";
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
    isGetResourceFormOtherPlayer: false,
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
    showResourceModal: false
};

katanObject.cardList = createCardList();
katanObject.afterCardList = [];

katanObject.playerList = createPlayerList();
katanObject.castleList = createCastleList();
katanObject.roadList = createRoadList();
katanObject.resourceList = createResourceList();

export default katanObject;