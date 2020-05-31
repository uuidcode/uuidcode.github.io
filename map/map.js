const OFFSET = 25;

let data = {
    blockList: [
        {
            index: 0,
            linkList: [1, 2],
            styleObject: {
                left: 100,
                top: 0
            }
        },
        {
            index: 1,
            linkList: [3],
            styleObject: {
                left: 200,
                top: 0
            }
        },
        {
            index: 2,
            linkList: [],
            styleObject: {
                left: 100,
                top: 100
            }
        },
        {
            index: 3,
            linkList: [4],
            styleObject: {
                left: 300,
                top: 0
            }
        },
        {
            index: 4,
            linkList: [5],
            styleObject: {
                left: 400,
                top: 0
            }
        },
        {
            index: 5,
            linkList: [6],
            styleObject: {
                left: 450,
                top: 50
            }
        },
        {
            index: 6,
            linkList: [7],
            styleObject: {
                left: 450,
                top: 125
            }
        },
        {
            index: 7,
            linkList: [8],
            styleObject: {
                left: 400,
                top: 175
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
                top: 125
            }
        },
        {
            index: 9,
            linkList: [4],
            styleObject: {
                left: 350,
                top: 50
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

function getCurvedArrow(item, nextItem) {
    let itemLinkList = getLinkList(item);
    let nextItemLinkList = getLinkList(nextItem);

    console.log('>>> itemLinkList', itemLinkList);
    console.log('>>> nextItemLinkList', nextItemLinkList);

    return itemLinkList.flatMap(x => {
        return nextItemLinkList.map(y => {
            return [...x, ...y, Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2)];
        })
    })
    .sort((x, y) => x[4] - y[4]);
}

data.blockList.forEach((item) => {
    item.classObject = {
        ...item.classObject,
        block: true
    };

    item.linkList.forEach((nextItemIndex) => {
        let nextItem = data.blockList[nextItemIndex];
        let curvedArrow = getCurvedArrow(item, nextItem);

        console.log('>>> curvedArrow', curvedArrow);

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

