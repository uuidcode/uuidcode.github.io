import katanStore from './katan.js'
import {recomputePlayer} from "./player";
import {takeResource} from "./resource";
import {shuffle} from "./util";

const processResource = () => katanStore.update(katan => {
    const player = katanStore.getActivePlayer();
    player.resource.sheep -= 1;
    player.resource.wheat -= 1;
    player.resource.iron -= 1;
    return katan;
});

export const knightCard = (katan) => {
    alert('기사\n도둑을 옮기고 자원하나를 빼았습니다.');
    const player = katanStore.getCurrentPlayer(katan);
    katanStore.setKnightMode();
    katanStore.readyMoveBurglar();

    player.construction.knight += 1;

    if (player.construction.knight >= 3) {
        const other = katanStore.getOtherPlayer(katan);

        if (player.construction.knight > other.construction.knight) {
            if (player.point.knight === 0) {
                alert('최강 기사단을 달성하였습니다.\n2점을 회득합니다.');
            }

            player.point.knight = 2;

            if (other.point.knight === 2) {
                other.point.knight = 0;
            }
        }
    }
};

export const roadCard = (katan) => {
    alert('도로 2개를 만드세요.');
    katan.isMakeRoad2 = true;
    katanStore.makeRoad();
    recomputePlayer();
};

export const takeResourceCard = (katan) => {
    alert('상대방의 자원 2개를 받습니다.');
    katan.isGetResourceFormOtherPlayer = true;
    takeResource();
    recomputePlayer();
};

export const getResourceCard = (katan) => {
    alert('자원 2개를 받으세요.');
    katan.isGetResource = true;
    recomputePlayer();
};

export const getPointCard = (katan) => {
    const player = katanStore.getCurrentPlayer(katan);
    alert('1점을 얻었습니다.');
    player.point.point += 1;
    recomputePlayer();
};

export const makeDev = () => katanStore.update(katan => {
    const card = katan.cardList.pop();
    katan.afterCardList = [...katan.afterCardList, card];

    processResource();

    if (card.type === 'point') {
        getPointCard(katan);
    } else if (card.type === 'knight') {
        knightCard(katan);
    } else if (card.type === 'road') {
        roadCard(katan);
    } else if (card.type === 'resource') {
        getResourceCard(katan)
    } else if (card.type === 'get') {
        takeResourceCard(katan);
    }

    return katan;
});

export const createCardList = () => {
    const cardList = [];

    for (let i = 0; i < 5; i++) {
        cardList.push({
            type: 'point'
        })
    }

    for (let i = 0; i < 14; i++) {
        cardList.push({
            type: 'knight'
        })
    }

    for (let i = 0; i < 2; i++) {
        cardList.push({
            type: 'road'
        });
    }

    for (let i = 0; i < 2; i++) {
        cardList.push({
            type: 'resource'
        });
    }

    for (let i = 0; i < 2; i++) {
        cardList.push({
            type: 'get'
        });
    }

    return shuffle(cardList);
};