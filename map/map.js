function getLinkList(item) {
    console.log('>>> item', item);

    return [
        [item.x * (2 * OFFSET) + OFFSET, item.y * (2 * OFFSET)],
        [item.x * (2 * OFFSET) + 2 * OFFSET, item.y * (2 * OFFSET) + OFFSET],
        [item.x * (2 * OFFSET) + OFFSET, item.y * (2 * OFFSET) + 2 * OFFSET],
        [item.x * (2 * OFFSET), item.y * (2 * OFFSET) + OFFSET]
    ];
}

function getCurvedArrow(item, nextItem, index) {
    let itemLinkList = getLinkList(item);

    if (item.linkPosition) {
        let linkPosition = item.linkPosition[index];
        itemLinkList = [itemLinkList[linkPosition]];
    }

    let nextItemLinkList = getLinkList(nextItem);

    if (nextItem.reverseLinkPosition) {
        let linkPosition = nextItem.reverseLinkPosition[item.index];
        console.log('>>> linkPosition', linkPosition);
        console.log('>>> item.index', item.index);
        nextItemLinkList = [nextItemLinkList[linkPosition]];
        console.log('>>> nextItemLinkList', nextItemLinkList);
    }

    return itemLinkList.flatMap(x => {
        return nextItemLinkList.map((y, index) => {
            let distance = Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2);
            return [...x, ...y, distance, index];
        })
    })
    .sort((x, y) => x[4] - y[4]);
}

function rotate (arr, count)  {
    if (count === 0) {
        return arr;
    }

    return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
}

data.blockList.forEach((item) => {
    item.classObject = {
        ...item.classObject,
        block: true
    };

    item.styleObject = {
        left: 2 * OFFSET * item.x,
        top: 2 * OFFSET * item.y
    };
});

data.blockList.forEach((item) => {
    console.log('>>> item.styleObject', item.styleObject);

    item.linkList.forEach((nextItemIndex, index) => {
        let nextItem = data.blockList[nextItemIndex];
        let curvedArrow = getCurvedArrow(item, nextItem, index);

        curvedArrow = curvedArrow[0];

        let p1x = curvedArrow[0];
        let p1y = curvedArrow[1];

        if (item.linkStyle) {
            let linkStyle = item.linkStyle[index];

            if (linkStyle === 1) {
                p1y = curvedArrow[3];
            } else if (linkStyle === 2) {
                p1x = curvedArrow[2];
            }
        }

        let strokeStyle = 'rgba(133, 255, 133, 1)';

        if (item.strokeStyle) {
            if (item.strokeStyle[index] === 1) {
                strokeStyle = 'rgba(169, 169, 169, 1)';
            }
        }

        $(document.body).curvedArrow({
            p0x: curvedArrow[0],
            p0y: curvedArrow[1],
            p1x: p1x,
            p1y: p1y,
            p2x: curvedArrow[2],
            p2y: curvedArrow[3],
            strokeStyle: strokeStyle,
            lineWidth: 5,
            size: 15
        });
    });
});

let sound = null;

for (let i = 0; i < data.blockList.length; i++) {
    let block = data.blockList[i];
    block.classObject = {
        ...block.classObject,
        ripple: false
    }
}

let app = new Vue({
    el: '#app',
    data: data,
    methods: {
        playDieSound: function () {
            app.playSound('die');
        },

        playJumpSound: function () {
            app.playSound('jump');
        },

        playSound: function (className) {
            if (sound != null) {
                sound.currentTime = 0;
                sound.pause();
            }

            sound = app.getAudio(className);
            sound.play();
        },

        getAudio: function (className) {
            return $('.' + className + '-sound').get(0)
        },
        
        nextBlock: function (position, count, start) {
            if (start) {
                app.status.blockIndexList = [];

                let block = app.blockList[position];
            }

            if (count === 0) {
                console.log('>>> position', position);
                app.status.blockIndexList.push(position);
                return;
            }

            let linkList = app.blockList[position].linkList;
            let jumpIndex = app.blockList[position].jumpIndex;
            let linkIndex = app.blockList[position].linkIndex;

            for (let i = 0; i < linkList.length; i++) {
                let blockIndex = linkList[i];

                if (jumpIndex && jumpIndex === blockIndex) {
                    continue;
                }

                if (!start) {
                    if (linkIndex && linkIndex === blockIndex) {
                        continue;
                    }
                }

                let block = app.blockList[blockIndex];
                app.nextBlock(block.index, count - 1, false);
            }
        },
        moveByEvent: function (event) {
            let $target = $(event.target);
            let blockIndex = $target.attr('data-block-index');
            app.moveByIndex(blockIndex, true);
        },
        moveByIndex: function (blockIndex, nextTurn) {
            app.playJumpSound();
            let block = app.blockList[blockIndex];
            let playerIndex = app.status.playerIndex;
            let player = app.playerList[playerIndex];
            player.styleObject.left = block.x * 2 * OFFSET;
            player.styleObject.top = block.y * 2 * OFFSET;
            player.position = block.index;

            Vue.set(app.playerList, playerIndex, player);
            
            setTimeout(function () {
                app.setBlockRippleOff();
                app.setBackgroundOff();

                if (block.jumpIndex) {
                    app.moveByIndex(block.jumpIndex, true);
                } else if (block.classObject.home) {
                    app.moveByIndex(HOME, true);
                } else if (!block.classObject.forestEntry &&
                    block.classObject.forest) {
                    app.moveByIndex(FOREST, true);
                } else if (block.classObject.start) {
                    app.status.rolling = false;
                } else {
                    app.nextTurn();

                    if (player.position === app.playerList[app.status.playerIndex].position) {
                        app.moveByIndex(HOME, false);
                    }
                }
            }, 1000);
        },
        nextTurn: function () {
            app.status.rolling = false;
            let nextPlayerIndex = (app.status.playerIndex + 1) % 2;
            app.status.playerIndex = nextPlayerIndex;
        },

        setBlockRipple: function (mode) {
            app.blockList.forEach((block, index) => {
                block.classObject.ripple = mode;
                Vue.set(app.blockList, block.index, block);
            });
        },
        setBlockRippleOn: function () {
            app.setBlockRipple(true);
        },
        setBlockRippleOff: function () {
            app.setBlockRipple(false);
        },
        setBackgroundOn: function () {
            app.setBackground(true);
        },
        setBackgroundOff: function () {
            // app.setBackground(false);
        },
        setBackground: function (mode) {
            app.status.background.classObject.backgroundEnabled = mode;
        }
    }
});

// for (let i = 0; i < 50; i++) {
//     for (let j = 0; j < 50; j++) {
//         let $div = $('<div/>').css({
//             position: 'absolute',
//             left: i * 50,
//             top: j * 50,
//             border: '1px solid lightgrey',
//             width: 50,
//             height: 50,
//             paddingTop: 30,
//             fontSize: 11
//         })
//         .text(`(${i}, ${j})`)
//         .addClass('grid')
//         .hide();
//
//         $('body').append($div);
//     }
// }

$('body').on('keyup', function (event) {
   if (event.which === 65) {
       $('.grid').toggle();
   }
});

let $die = $('#die');

let die = new Die(function (count) {
    if (app.status.count !== '0') {
        count = parseInt(app.status.count);
    }

    let playerIndex = app.status.playerIndex;
    let position = app.playerList[playerIndex].position;
    app.nextBlock(position, count, true);

    app.setBackgroundOn();
    app.setBlockRippleOff();

    app.status.blockIndexList.forEach(blockIndex => {
        let block = app.blockList[blockIndex];
        block.classObject.ripple = true;
        Vue.set(app.blockList, block.index, block);
    });
});

$die.append(die.$element);
