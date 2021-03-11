import { shuffle } from "./util";

let cardList = [];

for (let i = 0; i < 5; i++) {
    cardList.push('point')
}

for (let i = 0; i < 14; i++) {
    cardList.push('knight')
}

for (let i = 0; i < 2; i++) {
    cardList.push('road');
    cardList.push('resource');
    cardList.push('get');
}

cardList = shuffle(cardList);