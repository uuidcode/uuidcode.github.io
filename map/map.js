let data = {
    blockList: [
        {
            index: 0,
            linkList: [1, 2],
            styleObject: {
                left: 0,
                top: 0
            }
        },
        {
            index: 1,
            linkList: [],
            styleObject: {
                left: 150,
                top: 0
            }
        },
        {
            index: 2,
            linkList: [],
            styleObject: {
                left: 0,
                top: 150
            }
        }
    ]
};

data.blockList.forEach((item) => {
    item.classObject = {
        block: true
    };

    item.linkList.forEach((nextItemIndex) => {
        let nextItem = data.blockList[nextItemIndex];

        $(document.body).curvedArrow({
            p0x: item.styleObject.left + 50,
            p0y: item.styleObject.top + 50,
            p1x: item.styleObject.left + 50,
            p1y: item.styleObject.top + 50,
            p2x: nextItem.styleObject.left + 50,
            p2y: nextItem.styleObject.top + 50,
            strokeStyle: 'rgba(133, 255, 133, 1)'
        });
    });
});

let app = new Vue({
    el: '#app',
    data: data,
    methods: {}
});

