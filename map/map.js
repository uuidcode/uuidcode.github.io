let data = {
    blockList: [
        {
            index: 0,
            link: [1],
            styleObject: {
                left: 0,
                top: 0
            }
        },
        {
            index: 1,
            styleObject: {
                left: 150,
                top: 0
            }
        }
    ]
};

data.blockList.forEach((item, index) => {
    item.classObject = {
        block: true
    }
});

let app = new Vue({
    el: '#app',
    data: data,
    methods: {}
});