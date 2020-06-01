const OFFSET = 25;

let data = {
    blockList: [
        {
            index: 0,
            linkList: [1, 2],
            styleObject: {
                left: 100,
                top: 50
            }
        },
        {
            index: 1,
            linkList: [3],
            styleObject: {
                left: 200,
                top: 50
            }
        },
        {
            index: 2,
            linkList: [18],
            styleObject: {
                left: 100,
                top: 150
            }
        },
        {
            index: 3,
            linkList: [4],
            styleObject: {
                left: 300,
                top: 50
            }
        },
        {
            index: 4,
            linkList: [5],
            styleObject: {
                left: 400,
                top: 50
            }
        },
        {
            index: 5,
            linkList: [6, 12],
            linkPosition: [2, 1],
            styleObject: {
                left: 450,
                top: 100
            },
            classObject: {
                gate: true
            }
        },
        {
            index: 6,
            linkList: [7],
            styleObject: {
                left: 450,
                top: 175
            },
            classObject: {
                home: true
            }
        },
        {
            index: 7,
            linkList: [8, 10],
            linkPosition: [3, 2],
            styleObject: {
                left: 400,
                top: 225
            },
            classObject: {
                gate: true
            }
        },
        {
            index: 8,
            linkList: [9],
            styleObject: {
                left: 350,
                top: 175
            },
            classObject: {
                forest: true
            }
        },
        {
            index: 9,
            linkList: [4],
            styleObject: {
                left: 350,
                top: 100
            }
        },
        {
            index: 10,
            linkList: [11],
            styleObject: {
                left: 400,
                top: 300
            }
        },
        {
            index: 11,
            linkList: [12],
            styleObject: {
                left: 500,
                top: 300
            },
            classObject: {
                sea: true
            }
        },
        {
            index: 12,
            linkList: [13],
            styleObject: {
                left: 600,
                top: 300
            }
        },
        {
            index: 13,
            linkList: [14],
            styleObject: {
                left: 650,
                top: 350
            }
        },
        {
            index: 14,
            linkList: [15],
            styleObject: {
                left: 650,
                top: 425
            }
        },
        {
            index: 15,
            linkList: [16],
            linkPosition: [3],
            styleObject: {
                left: 600,
                top: 475
            }
        },
        {
            index: 16,
            linkList: [17],
            styleObject: {
                left: 550,
                top: 425
            }
        },
        {
            index: 17,
            linkList: [12],
            styleObject: {
                left: 550,
                top: 350
            }
        },
        {
            index: 18,
            linkList: [19],
            styleObject: {
                left: 100,
                top: 250
            }
        },
        {
            index: 19,
            linkList: [20],
            styleObject: {
                left: 150,
                top: 300
            }
        },
        {
            index: 20,
            linkList: [21, 22],
            linkPosition: [3, 2],
            styleObject: {
                left: 100,
                top: 350
            },
            classObject: {
                gate: true
            }
        },
        {
            index: 21,
            linkList: [18],
            styleObject: {
                left: 50,
                top: 300
            }
        },
        {
            index: 22,
            linkList: [23],
            styleObject: {
                left: 100,
                top: 450
            }
        },
        {
            index: 23,
            linkList: [24, 2],
            styleObject: {
                left: 200,
                top: 450
            },
            classObject: {
                gate: true
            }
        },
        {
            index: 24,
            linkList: [25],
            styleObject: {
                left: 300,
                top: 450
            },
            classObject: {
                home: true
            }
        },
        {
            index: 25,
            linkList: [17],
            styleObject: {
                left: 400,
                top: 450
            }
        }
    ]
};

function getLinkList(item) {
    return [
        [item.styleObject.left + OFFSET, item.styleObject.top],
        [item.styleObject.left + 2 * OFFSET, item.styleObject.top + OFFSET],
        [item.styleObject.left + OFFSET, item.styleObject.top + 2 * OFFSET],
        [item.styleObject.left, item.styleObject.top + OFFSET]
    ];
}

function getCurvedArrow(item, nextItem, index) {
    let itemLinkList = getLinkList(item);

    if (item.linkPosition) {
        console.log('>>> item.linkPosition', item.linkPosition);
        console.log('>>> index', index);
        let linkPosition = item.linkPosition[index];
        itemLinkList = [itemLinkList[linkPosition]];
    }

    let nextItemLinkList = getLinkList(nextItem);

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

    item.linkList.forEach((nextItemIndex, index) => {
        let nextItem = data.blockList[nextItemIndex];
        let curvedArrow = getCurvedArrow(item, nextItem, index);

        curvedArrow = curvedArrow[0];

        $(document.body).curvedArrow({
            p0x: curvedArrow[0],
            p0y: curvedArrow[1],
            p1x: curvedArrow[0],
            p1y: curvedArrow[1],
            p2x: curvedArrow[2],
            p2y: curvedArrow[3],
            strokeStyle: 'rgba(133, 255, 133, 1)',
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

