var player = {
    playerList: [],
    $playerList: [],

    initData: function () {
        for (var i = 0; i < 2; i++) {
            player.playerList[i] = {};
            var currentPlayer = player.playerList[i];

            if (i == 0) {
                currentPlayer.image = 'apeach.png';
            } else if (i == 1) {
                currentPlayer.image = 'lion.png';
            }
        }
    },

    initItem: function () {
        for (var i = 0; i < player.playerList.length; i++) {
            player.$playerList[i] = $('<img>');
            var $currentPlayer = player.$playerList[i];
            var left = 10;
            var top = 10;

            if (i == 1) {
                left = 70;
            }

            $currentPlayer.attr('src', $currentPlayer.image);
            $currentPlayer.attr('data-index', i);
            $currentPlayer.css({
                position: 'absolute',
                left: left,
                top: top,
                borderRadius: '50%',
                zIndex: 100
            });

            board.$board.append($currentPlayer);
        }
    },

    init: function () {
        player.initData();
        player.initItem();
    },

    go: function (index, count) {
        var $currentPlayer = player.$playerList[index];
        var currentPlayer = player.playerList[index];

        for (var i = 0; i < count; i++) {
            var direction = player.getDirection(index);
            $currentPlayer.addClass(direction);

            $currentPlayer.on('animationend', function () {
                $currentPlayer.removeClass(direction);
            });
        }

        currentPlayer.position += count;
    },

    getDirection: function (index) {
        var $currentPlayer = player.$playerList[index];
        var currentPlayer = player.playerList[index];
        var position = currentPlayer.position;

        if (position >= 0 && position < 10) {
            return "right";
        } else if (position >= 10 && position < 20) {
            return "down";
        } else if (position >= 20 && position < 30) {
            return "left";
        } else if (position >= 30 && position < 40) {
            return "up";
        }
    },

    throwDie: function (index) {
        var count = 3;
        player.go(index, count);
    }
};

$(function() {
    player.init();
});