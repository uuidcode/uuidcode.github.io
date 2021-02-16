import {writable} from "svelte/store";
import config from './config.js'
import { getDisplay } from './util.js'

let katan = {
    dice: [6, 6],
    mode: 'ready',
    playerList: [
        {
            color: 'lightblue',
            name: '다은',
            turn: true,
            pickTown: true,
            pickLoad: false,
            resource: {
                tree: 0,
                mud: 0,
                wheat: 0,
                sheep: 0,
                iron: 0
            },
            index: 0
        },
        {
            color: 'lightcoral',
            name: '아빠',
            turn: false,
            pickTown: false,
            pickLoad: false,
            resource: {
                tree: 0,
                mud: 0,
                wheat: 0,
                sheep: 0,
                iron: 0
            },
            index: 1
        }
    ]
};


function random() {
    return () => Math.random() - 0.5;
}

function shuffle(list) {
    return list.sort(random());
}

katan.castleList = [];

for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 11; j++) {
        if (i === 0 || i === 5) {
            if (j >= 2 && j <= 8) {
                let top = 0;

                if (i === 5) {
                    top = i * (3 * config.cell.height / 4);
                }

                if (j % 2 === i % 2) {
                    top += config.cell.height / 4
                }

                katan.castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    ripple: false,
                    constructable: false,
                    empty: true
                });
            }
        } else if (i === 1 || i === 4) {
            if (j >= 1 && j <= 9) {
                let top = (3 * config.cell.height / 4);

                if (i === 4) {
                    top = i * (3 * config.cell.height / 4);
                }

                if (j % 2 === i % 2) {
                    top += config.cell.height / 4
                }

                const constructable = j >= 3 && j <= 7;

                katan.castleList.push({
                    left: j * (config.cell.width / 2) - config.castle.width / 2,
                    top: top - config.castle.height / 2,
                    ripple: constructable,
                    constructable: constructable,
                    empty: true
                });
            }
        } else if (i === 2 || i === 3) {
            let top = 2 * (3 * config.cell.height / 4);

            if (i === 3) {
                top = i * (3 * config.cell.height / 4);
            }

            if (j % 2 === i % 2) {
                top += config.cell.height / 4
            }

            const constructable = j >= 2 && j <= 8;

            katan.castleList.push({
                left: j * (config.cell.width / 2) - config.castle.width / 2,
                top: top - config.castle.height / 2,
                ripple: constructable,
                constructable: constructable,
                empty: true
            });
        }
    }
}

katan.loadList = [];

for (let i = 0; i <= 11; i++) {
    for (let j = 0; j <= 20; j++) {
        if (i === 0 || i === 11) {
            if (j === 5 || j === 7 || j === 9 || j === 11 || j === 13 || j === 15) {
                let top = config.cell.height / 8 - config.load.width / 2 ;

                if (i === 11) {
                    top = 31 * config.cell.height / 8 - config.load.width / 2 ;
                }

                katan.loadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    ripple: false,
                    constructable: false,
                    empty: true
                });
            }
        } else if (i === 1 || i === 10) {
            if (j === 4 || j === 8 || j === 12 || j === 16) {
                let top = config.cell.height / 2 - config.load.width / 2 ;

                if (i === 10) {
                    top = 28 * config.cell.height / 8 - config.load.width / 2 ;
                }

                katan.loadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    ripple: false,
                    constructable: false,
                    empty: true
                });
            }
        } else if (i === 2 || i === 9) {
            if (j === 3 || j === 5 || j === 7 || j === 9 || j === 11 || j === 13 || j === 15 || j === 17) {
                let top = 7 * config.cell.height / 8 - config.load.width / 2 ;

                if (i === 9) {
                    top = 25 * config.cell.height / 8 - config.load.width / 2 ;
                }

                katan.loadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    ripple: false,
                    constructable: false,
                    empty: true
                });
            }
        } else if (i === 3 || i === 8) {
            if (j === 2 || j === 6 || j === 10 || j === 14 || j === 18) {
                let top = 5 * config.cell.height / 4 - config.load.width / 2 ;

                if (i === 8) {
                    top = 22 * config.cell.height / 8 - config.load.width / 2 ;
                }

                katan.loadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    ripple: false,
                    constructable: false,
                    empty: true
                });
            }
        } else if (i === 4 || i === 7) {
            if (j === 1 || j === 3 || j === 5 || j === 7 || j === 9 ||
                j === 11 || j === 13 || j === 15 || j === 17 || j === 19) {
                let top = 13 * config.cell.height / 8 - config.load.width / 2 ;

                if (i === 7) {
                    top = 19 * config.cell.height / 8 - config.load.width / 2 ;
                }

                katan.loadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    ripple: false,
                    constructable: false,
                    empty: true
                });
            }
        } else if (i === 5) {
            if (j === 0 || j === 4 || j === 8 || j === 12 || j === 16 || j === 20) {
                let top = 8 * config.cell.height / 4 - config.load.width / 2 ;

                katan.loadList.push({
                    left: j * (config.cell.width / 4) - config.load.width / 2,
                    top: top,
                    ripple: false,
                    constructable: false,
                    empty: true
                });
            }
        }
    }
}

console.log('>>> katan.loadList', katan.loadList);

let resourceList = [];

resourceList.push({
    type: 'dessert'
});

for (let i = 0; i < 4; i++) {
    resourceList.push({
        type: 'tree'
    });

    resourceList.push({
        type: 'iron'
    });

    resourceList.push({
        type: 'sheep'
    });
}

for (let i = 0; i < 3; i++) {
    resourceList.push({
        type: 'mud'
    });

    resourceList.push({
        type: 'wheat'
    });
}

katan.resourceList = resourceList;

katan.turn = () => {
    katan.playerList
        .forEach(player => {
            player.turn = !player.turn
        });
};

let numberList = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
numberList = shuffle(numberList);

katan.resourceList = katan.resourceList
    .map((resource, index) => {
        if (resource.type === 'dessert') {
            resource.number = 7;
        } else {
            resource.number = numberList.pop();
        }

        return resource;
    })
    .sort(random())
    .map((resource, index) => {
        let left = 0;
        let top = 0;

        if (0 <= index && index <= 2) {
            left = config.cell.width + config.cell.width * index;
        } else if (3 <= index && index <= 6) {
            left = config.cell.width / 2 + config.cell.width * (index - 3);
            top = 3 * config.cell.height / 4;
        } else if (7 <= index && index <= 11) {
            left = config.cell.width * (index - 7);
            top = 2 * (3 * config.cell.height / 4);
        } else if (12 <= index && index <= 15) {
            left = config.cell.width / 2 + config.cell.width * (index - 12);
            top = 3 * (3 * config.cell.height / 4);
        } else if (16 <= index && index <= 18) {
            left = config.cell.width * (index - 15);
            top = 4 * (3 * config.cell.height / 4);
        }

        resource.left = left;
        resource.top = top;

        return resource;
    });

const { subscribe, set, update } = writable(katan);

const storeKatan = {
    subscribe,

    isReady: () => katan.mode === 'ready',

    isStart: () => katan.mode === 'start',

    start: () => update(katan => {
        katan.mode = 'start';
        return katan;
    }),

    roll: (a, b) => update(katna => {
        katna.dice[0] = a;
        katna.dice[1] = b;
        return katan;
    }),

    getNumber: () => katna.dice[0] =  + katna.dice[1],

    getActivePlayer: () => {
        return katan.playerList
            .filter(player => player.turn)[0];
    },

    setCastle: (castleIndex, playerIndex) => update(katan => {
        katan.castleList[castleIndex].playerIndex = playerIndex;
        return katan;
    }),
};

export default storeKatan;