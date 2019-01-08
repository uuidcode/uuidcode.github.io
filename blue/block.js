block = {
    NATION_TYPE: 'nation',

    html: function (data) {
        if (data.type == block.NATION_TYPE) {

        }
    }

};

var blockList = [];
var nation = 'nation';

for (var i = 0; i < 40; i++) {
    blockList[i] = {};
}

blockList[0] = {
    type: 'start',
    text: '출발'
};

blockList[1] = {
    type: nation,
    text: '타이베이',
    amount: '5만원',
    nation: 'tw'
};