var blue = {
    block : {
        width: 120,
        height: 70
    },

    $playerA: $('#playerA'),
    $playerB: $('#playerB'),
    $board : $('.board'),

    playerData: {
        A: {
            image: 'lion.jpg',
            position: 1
        },
        B: {
            image: 'apache.jpg',
            position: 1
        }
    },

    blockList: [],

    initBlockData: function () {
        for (var i = 0; i < 40; i++) {
            blue.blockList[i] = {};
        }

        blue.blockList[0] = {
            type: 'start',
            name: '출발'
        };

        blue.blockList[1] = blue.createNationBlock({
            name: '타이베이',
            amount: '5만원',
            nation: 'tw'
        });

        blue.blockList[2] = {
            type: 'key'
        };

        blue.blockList[3] = blue.createNationBlock({
            name: '베이징',
            amount: '8만원',
            nation: 'cn'
        });

        blue.blockList[4] = blue.createNationBlock({
            name: '마닐라',
            amount: '8만원',
            nation: 'ph'
        });

        blue.blockList[5] = blue.createNationBlock({
            name: '제주',
            amount: '20만원',
            nation: 'kr'
        });

        blue.blockList[6] = blue.createNationBlock({
            name: '싱가포르',
            amount: '10만원',
            nation: 'sg'
        });

        blue.blockList[7] = {
            type: 'key'
        };

        blue.blockList[8] = blue.createNationBlock({
            name: '카이로',
            amount: '10만원',
            nation: 'eg'
        });

        blue.blockList[9] = blue.createNationBlock({
            name: '이스탄불',
            amount: '12만원',
            nation: 'tr'
        });
    },

    createNationBlock: function (data) {
        data.type = 'nation';
        return data;
    },

    processPosition: function (i) {
        var left = 0;
        var top = 0;
        var placement = null;

        if (i >= 0 && i <= 10) {
            left = i * blue.block.width;
            placement = 'top';
        } else if (i > 10 && i <= 20) {
            left = 10 * blue.block.width;
            top = (i - 10) * blue.block.height;
            placement = 'right';
        } else if (i > 20 && i <= 30) {
            left = (30 - i) * blue.block.width;
            top = 10 * blue.block.height;
            placement = 'bottom';
        } else if (i > 30) {
            top = (40 - i) * blue.block.height;
            placement = 'left';
        }

        return {
            left: left,
            top: top,
            placement: placement
        };
    },

    createBlock: function (i) {
        var $block = $('<div></div>');
        $block.addClass('block');
        $block.html(i);
        $block.attr('data-index', i);
        return $block;
    },

    initBlock: function () {
        blue.initBlockData();

        for (var i = 0; i < 40; i++) {
            var $block = this.createBlock(i);

            var popoverOption = {
                content: 'hello'
            };

            var position = blue.processPosition(i);
            popoverOption.placement = position.placement;

            $block.css({
               position: 'absolute',
               left: position.left,
               top: position.top,
               width: blue.block.width,
               height: blue.block.height
            });

            blue.processComponent($block);

            $block.popover(popoverOption).popover('show');
        }
    },

    processComponent: function ($block) {
        var index = $block.attr('data-index');
        var blockData = blue.blockList[index];
        var componentList = blue.createBlockComponent(blockData);

        for (var j = 0; j < componentList.length; j++) {
            $block.append(componentList[j]);
        }

        blue.$board.append($block);
    },

    createFlagComponent: function (data) {
        var $flag = $('<div></div>');
        $flag.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: 60,
            height: 30,
            backgroundImage: 'url(' + data.nation + '.png)',
            backgroundSize: '60px 30px'
        });

        return $flag;
    },

    createAmountComponent: function (data) {
        var $amount = $('<div></div>');
        $amount.html(data.amount);
        $amount.css({
            position: 'absolute',
            left: 60,
            top: 0,
            width: 60,
            height: 30,
            lineHeight: '30px',
            textAlign: 'center',
            fontWeight: 'bold'
        });

        return $amount;
    },

    createNameComponent: function (data) {
        var $name = $('<div></div>');
        $name.html(data.name);
        $name.css({
            position: 'absolute',
            left: 0,
            top: 30,
            width: 120,
            height: 35,
            lineHeight: '35px',
            textAlign: 'center',
            fontWeight: 'bold'
        });

        return $name;
    },

    createBlockComponent: function (data) {
        var result = [];

        if (data.type == 'nation') {
            result.push(this.createFlagComponent(data));
            result.push(this.createAmountComponent(data));
            result.push(this.createNameComponent(data));
        } else if (data.type == 'start') {
            result.push(this.createNameComponent(data));
        } else if (data.type == 'key') {
            result.push(this.createKey());
        }

        return result;
    },

    createKey: function () {
        var $key = $('<div></div>');
        $key.css({
            position: 'absolute',
            left: 25,
            top: 2,
            width: 70,
            height: 70,
            backgroundImage: 'url(key.png)',
            backgroundSize: '70px 70px'
        });
        return $key;
    },

    createPlayerA: function () {
        blue.$playerA.css({
            position: 'absolute',
            left: 130,
            top: 10,
            width: 50,
            height: 50,
            borderRadius: '50%',
            zIndex: 100
        }).show();
    },

    createPlayerB: function () {
        blue.$playerB.css({
            position: 'absolute',
            left: 10,
            top: 10,
            width: 50,
            height: 50,
            borderRadius: '50%',
            zIndex: 100
        }).show();
    },

    initPlayer: function () {
        blue.createPlayerA();
        blue.createPlayerB();
    }
};

$(function() {
    blue.initBlock();
    blue.initPlayer();
});