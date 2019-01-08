var block = {
    config : {
        width: 120,
        height: 70
    },

    blockList: [],
    $blockList: [],

    initData: function () {
        for (var i = 0; i < 40; i++) {
            block.blockList[i] = {};
        }

        block.blockList[0] = {
            type: 'start',
            name: '출발'
        };

        block.blockList[1] = block.createNationBlock({
            name: '타이베이',
            amount: '5만원',
            nation: 'tw'
        });

        block.blockList[2] = {
            type: 'key'
        };

        block.blockList[3] = block.createNationBlock({
            name: '베이징',
            amount: '8만원',
            nation: 'cn'
        });

        block.blockList[4] = block.createNationBlock({
            name: '마닐라',
            amount: '8만원',
            nation: 'ph'
        });

        block.blockList[5] = block.createNationBlock({
            name: '제주',
            amount: '20만원',
            nation: 'kr'
        });

        block.blockList[6] = block.createNationBlock({
            name: '싱가포르',
            amount: '10만원',
            nation: 'sg'
        });

        block.blockList[7] = {
            type: 'key'
        };

        block.blockList[8] = block.createNationBlock({
            name: '카이로',
            amount: '10만원',
            nation: 'eg'
        });

        block.blockList[9] = block.createNationBlock({
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
            left = i * block.config.width;
            placement = 'top';
        } else if (i > 10 && i <= 20) {
            left = 10 * block.config.width;
            top = (i - 10) * block.config.height;
            placement = 'right';
        } else if (i > 20 && i <= 30) {
            left = (30 - i) * block.config.width;
            top = 10 * block.config.height;
            placement = 'bottom';
        } else if (i > 30) {
            top = (40 - i) * block.config.height;
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

    init: function () {
        block.initData();

        for (var i = 0; i < 40; i++) {
            var $currentBlock = this.createBlock(i);
            block.$blockList[i] = $currentBlock;
            
            var popoverOption = {
                content: 'hello'
            };

            var position = block.processPosition(i);
            popoverOption.placement = position.placement;

            $currentBlock.css({
                position: 'absolute',
                left: position.left,
                top: position.top,
                width: block.config.width,
                height: block.config.height
            });

            block.processComponent($currentBlock);

            $currentBlock.popover(popoverOption).popover('show');
        }
    },

    processComponent: function ($block) {
        var index = $block.attr('data-index');
        var blockData = block.blockList[index];
        var componentList = block.createBlockComponent(blockData);

        for (var j = 0; j < componentList.length; j++) {
            $block.append(componentList[j]);
        }

        board.$board.append($block);
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
    }
};

$(function() {
    block.init();
});