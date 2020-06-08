const OFFSET = 25;

let data = {
    blockList: [
        {
            index: 0,
            x: 2,
            y: 1,
            linkList: [1, 2],
            classObject: {
                start: true
            }
        },
        {
            index: 1,
            x: 4,
            y: 1,
            linkList: [3],
        },
        {
            index: 2,
            x: 2,
            y: 3,
            linkList: [18],
            reverseLinkPosition: {
                0: 0,
                23: 1
            }
        },
        {
            index: 3,
            x: 6,
            y: 1,
            linkList: [4],
        },
        {
            index: 4,
            x: 8,
            y: 1,
            linkList: [5],
        },
        {
            index: 5,
            x: 9,
            y: 2,
            linkList: [6, 12],
            linkStyle: [0, 2],
            linkPosition: [2, 1],
            strokeStyle: [0, 1],
            classObject: {
                gate: true,
                link: true
            }
        },
        {
            index: 6,
            x: 9,
            y: 4,
            linkList: [7],
            classObject: {
                home: true
            }
        },
        {
            index: 7,
            x: 8,
            y: 5,
            linkList: [8, 10],
            linkPosition: [3, 2],
            classObject: {
                gate: true
            }
        },
        {
            index: 8,
            x: 7,
            y: 4,
            linkList: [9],
            classObject: {
                forest: true
            }
        },
        {
            index: 9,
            x: 7,
            y: 2,
            linkList: [4],
        },
        {
            index: 10,
            x: 8,
            y: 7,
            linkList: [11]
        },
        {
            index: 11,
            linkList: [12],
            x: 10,
            y: 7,
            classObject: {
                sea: true
            }
        },
        {
            index: 12,
            linkList: [13],
            x: 12,
            y: 7,
            reverseLinkPosition: {
                5: 0,
                11: 3,
                13: 1,
                17: 3,
                38: 0
            }
        },
        {
            index: 13,
            linkList: [14],
            x: 13,
            y: 8,
            classObject: {

            }
        },
        {
            index: 14,
            linkList: [15],
            x: 13,
            y: 10,
            classObject: {
                change: true
            }
        },
        {
            index: 15,
            linkList: [16, 26],
            linkPosition: [3, 2],
            x: 12,
            y: 11,
            classObject: {
                gate: true
            }
        },
        {
            index: 16,
            linkList: [17],
            x: 11,
            y: 10,
        },
        {
            index: 17,
            linkList: [12],
            x: 11,
            y: 8,
        },
        {
            index: 18,
            linkList: [19],
            x: 2,
            y: 5,
        },
        {
            index: 19,
            linkList: [20],
            x: 3,
            y: 6,
        },
        {
            index: 20,
            linkList: [21, 22],
            linkPosition: [3, 2],
            x: 2,
            y: 7,
            classObject: {
                gate: true
            }
        },
        {
            index: 21,
            linkList: [18],
            x: 1,
            y: 6,
        },
        {
            index: 22,
            linkList: [23, 16],
            linkPosition: [1, 2],
            linkStyle: [0, 1],
            x: 2,
            y: 9,
            strokeStyle: [0, 1],
            classObject: {
                link: true
            }
        },
        {
            index: 23,
            linkList: [24, 2],
            linkStyle: [0, 1],
            x: 4,
            y: 9,
            strokeStyle: [0, 1],
            classObject: {
                link: true
            }
        },
        {
            index: 24,
            linkList: [25],
            x: 6,
            y: 9,
            classObject: {
                home: true
            }
        },
        {
            index: 25,
            linkList: [17],
            x: 8,
            y: 9,
        },
        {
            index: 26,
            linkList: [27],
            x: 13,
            y: 12,
        },
        {
            index: 27,
            linkList: [28],
            x: 15,
            y: 12,
            classObject: {
                sea: true
            }
        },
        {
            index: 28,
            linkList: [29, 13],
            x: 17,
            y: 12,
            linkStyle: [0, 1],
            strokeStyle: [0, 1],
            linkPosition: [1, 0],
            classObject: {
                link: true
            }
        },
        {
            index: 29,
            linkList: [30],
            x: 19,
            y: 12,
            reverseLinkPosition: {
                28: 3,
                46: 0
            }
        },
        {
            index: 30,
            linkList: [31, 53],
            x: 21,
            y: 12,
            reverseLinkPosition: {
                29: 3,
                47: 0
            }
        },
        {
            index: 31,
            linkList: [32],
            x: 23,
            y: 12,
            classObject: {
                sea: true
            }
        },
        {
            index: 32,
            linkList: [33],
            x: 25,
            y: 12
        },
        {
            index: 33,
            linkList: [34],
            x: 27,
            y: 12,
            classObject: {
                sea: true
            }
        },
        {
            index: 34,
            linkList: [47],
            x: 29,
            y: 12,
            classObject: {
                home: true
            }
        },
        {
            index: 35,
            linkList: [],
            x: 31,
            y: 10,
            classObject: {
                end: true
            }
        },
        {
            index: 36,
            linkList: [37],
            x: 31,
            y: 1,
            classObject: {
                sea: true
            }
        },
        {
            index: 37,
            linkList: [38],
            x: 29,
            y: 1
        },
        {
            index: 38,
            linkList: [39, 12],
            strokeStyle: [0, 1],
            linkPosition: [2, 3],
            linkStyle: [0, 2],
            x: 27,
            y: 1
        },
        {
            index: 39,
            linkList: [40],
            x: 27,
            y: 3
        },
        {
            index: 40,
            linkList: [41],
            x: 29,
            y: 3
        },
        {
            index: 41,
            linkList: [42],
            x: 31,
            y: 3,
            classObject: {
                change: true
            }
        },
        {
            index: 42,
            linkList: [43],
            x: 31,
            y: 5
        },
        {
            index: 43,
            linkList: [44],
            x: 29,
            y: 5,
            classObject: {
                forest: true
            }
        },
        {
            index: 44,
            linkList: [45],
            x: 27,
            y: 5
        },
        {
            index: 45,
            linkList: [46],
            x: 27,
            y: 7,
            classObject: {
                forest: true
            }
        },
        {
            index: 46,
            linkList: [29],
            linkStyle: [2],
            x: 25,
            y: 7,
            classObject: {
                home: true
            }
        },
        {
            index: 47,
            linkList: [35, 30],
            strokeStyle: [0, 1],
            linkStyle: [0, 2],
            x: 29,
            y: 10,
            classObject: {
                link: true
            }
        },
        {
            index: 48,
            linkList: [49],
            x: 8,
            y: 16,
            classObject: {
                forest: true
            }
        },
        {
            index: 49,
            linkList: [50, 57],
            x: 10,
            y: 16
        },
        {
            index: 50,
            linkList: [51],
            x: 12,
            y: 16,
            classObject: {
                sea: true
            }
        },
        {
            index: 51,
            linkList: [52],
            x: 14,
            y: 16
        },
        {
            index: 52,
            linkList: [54],
            x: 16,
            y: 16
        },
        {
            index: 53,
            linkList: [54],
            x: 21,
            y: 14,
            classObject: {
                home: true
            }
        },
        {
            index: 54,
            linkList: [55],
            x: 19,
            y: 14,
            reverseLinkPosition: {
                53: 1,
                52: 2
            }
        },
        {
            index: 55,
            linkList: [56],
            x: 17,
            y: 14
        },
        {
            index: 56,
            linkList: [16],
            strokeStyle: [1],
            linkStyle: [2],
            linkPosition: [3],
            x: 15,
            y: 14,
            classObject: {
                home: true
            }
        },
        {
            index: 57,
            linkList: [58],
            x: 10,
            y: 14
        },
        {
            index: 58,
            linkList: [59],
            x: 8,
            y: 14,
            classObject: {
                home: true
            }
        },
        {
            index: 59,
            linkList: [60],
            x: 6,
            y: 14
        },
        {
            index: 60,
            linkList: [25],
            x: 4,
            y: 14
        }
    ]
};

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

let app = new Vue({
    el: '#app',
    data: data,
    methods: {}
});

for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
        let $div = $('<div/>').css({
            position: 'absolute',
            left: i * 50,
            top: j * 50,
            border: '1px solid lightgrey',
            width: 50,
            height: 50,
            paddingTop: 30,
            fontSize: 11
        })
        .text(`(${i}, ${j})`)
            .addClass('grid');

        $('body').append($div);
    }
}

$('body').on('keyup', function (event) {
   if (event.which === 65) {
       $('.grid').toggle();
   }
});

