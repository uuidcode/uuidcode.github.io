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

data.blockList.forEach((item) => {
    item.classObject = {
        ...item.classObject,
        block: true
    };

    item.linkList.forEach((nextItemIndex) => {
        let nextItem = data.blockList[nextItemIndex];

        let offset = 25;

        $(document.body).curvedArrow({
            p0x: item.styleObject.left + offset,
            p0y: item.styleObject.top + offset,
            p1x: item.styleObject.left + offset,
            p1y: item.styleObject.top + offset,
            p2x: nextItem.styleObject.left + offset,
            p2y: nextItem.styleObject.top + offset,
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

