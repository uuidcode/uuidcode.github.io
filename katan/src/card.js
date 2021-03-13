import katanStore from './katan.js'
import {recomputePlayer} from "./player";
import {takeResource} from "./resource";
import {getPossibleCastleIndexList, setNewCityRippleEnabled} from "./castle";

const processResource = () => katanStore.update(katan => {
    const player = katanStore.getActivePlayer();
    player.resource.sheep -= 1;
    player.resource.wheat -= 1;
    player.resource.iron -= 1;
    return katan;
});

export const knightCard = (player, katan) => {
    alert('기사\n도둑을 옮기고 자원하나를 빼았습니다.');
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
}

export const makeDev = () => katanStore.update(katan => {
    const card = katan.cardList.pop();
    katan.afterCardList = [...katan.afterCardList, card];

    processResource();

    const player = katanStore.getActivePlayer();

    if (card.type === 'point') {
        alert('1점을 얻었습니다.');
        player.point.point += 1;
    } else if (card.type === 'knight') {
        knightCard(player, katan);
    } else if (card.type === 'road') {
        alert('도로 2개를 만드세요.');
        katan.isMakeRoad2 = true;
        katanStore.makeRoad();
    } else if (card.type === 'resource') {
        alert('자원 2개를 받으세요.');
        katan.isGetResource = true;
    } else if (card.type === 'get') {
        alert('상대방의 자원 2개를 받습니다.');
        katan.isGetResourceFormOtherPlayer = true;
        takeResource();
    }

    recomputePlayer();

    return katan;
});