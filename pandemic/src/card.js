import katanStore from './katan.js'
import {recomputePlayer} from "./player";
import {takeResource} from "./resource";
import {shuffle} from "./util";
import {get} from "svelte/store";

export const knightCard = () => {
    alert('기사\n도둑을 옮기고 자원하나를 빼았습니다.');

    const katan = get(katanStore);
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

    recomputePlayer();
};

export const roadCard = () => {
    alert('도로 2개를 만드세요.');
    katanStore.setMakeRoad2Mode();
    katanStore.makeRoad();
};

export const takeResourceCard = async () => {
    alert('상대방의 자원 2개를 받습니다.');
    katanStore.setTakeResourceMode();
    await takeResource();
    await takeResource();
    katanStore.unsetTakeResourceMode();
};

export const getResourceCard = () => {
    alert('자원 2개를 받으세요.');
    katanStore.setGetResourceMode();
};

export const getPointCard = () => {
    alert('1점을 얻었습니다.');
    katanStore.plusPoint();
};

export const openCard = async () => {
    let cardType;

    katanStore.update(katan => {
        const card = katan.cardList.pop();
        katan.afterCardList = [...katan.afterCardList, card];

        cardType = card.type;

        console.log('openCard', katan.playerIndex, card.type);

        const player = katanStore.getActivePlayer();

        player.resource.sheep -= 1;
        player.resource.wheat -= 1;
        player.resource.iron -= 1;

        return katan;
    });

    if (cardType === 'point') {
        getPointCard();
    } else if (cardType === 'knight') {
        knightCard();
    } else if (cardType === 'road') {
        roadCard();
    } else if (cardType === 'getResource') {
        getResourceCard()
    } else if (cardType === 'takeResource') {
        await takeResourceCard();
    }

    katanStore.doActionAndTurn();
};

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
            type: 'getResource'
        });
    }

    for (let i = 0; i < 2; i++) {
        cardList.push({
            type: 'takeResource'
        });
    }

    return shuffle(cardList);
};