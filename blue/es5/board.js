function Board() {
    this.$ui = $('.board');
    this.playerList = [];
    this.playerInfoList = [];
    this.blockList = [];
    this.turnIndex = 0;
    this.die = null;
    this.goldenKeyIndex = 0;

    this.playSound = function (name) {
        var mp3 = $('.' + name + '-sound').get(0);
        mp3.play();
    };

    this.playDieSound = function (name) {
        this.playSound('die');
    };

    this.playJumpSound = function (count) {
        this.playSound('jump' + count);
    };

    this.initPlayer = function () {
        for (var i = 0; i < config.playerList.length; i++) {
            var player = new Player(this.playerList.length);
            this.playerList.push(player);
            this.$ui.append(player.$ui);

            var playerInfo = new PlayerInfo(player);
            this.playerInfoList.push(playerInfo);
            this.$ui.append(playerInfo.$ui);
            this.updatePlayerAmount(player, playerInfo);
        }
    };

    this.updatePlayerAmount = function (player, playerInfo) {
        var $amount = playerInfo.$ui.find('.amount');

        var odometer = new Odometer({
            el: $amount[0],
            value: 0,
            format: '(,ddd)',
            duration: 1000
        });

        odometer.update(player.amount);
    };

    this.updatePlayInfo = function(currentPlayer) {
        this.playerInfoList[currentPlayer.index].$ui.remove();

        var playerInfo = new PlayerInfo(currentPlayer);
        this.playerInfoList[currentPlayer.index] = playerInfo;

        this.$ui.append(playerInfo.$ui);
        this.updatePlayerAmount(currentPlayer, playerInfo);
    };

    this.initBlock = function () {
        for (var i = 0; i < 40; i++) {
            var block = new Block(i, config.blockList[i]);
            this.blockList.push(block);
            this.$ui.append(block.$ui);
        }
    };

    this.initDie = function () {
        this.die = new Die();
        this.$ui.append(this.die.$ui);
    };

    this.turn = function () {
        var playIndex = this.getPlayerIndex();
        var player = this.playerList[playIndex];
        player.rollDie();
    };

    this.getCurrentPlayer = function () {
        var playIndex = this.getPlayerIndex();
        return this.playerList[playIndex];
    };

    this.activePlayer = function () {
        var selector = '.modal-content';

        for (var i = 0; i < this.playerInfoList.length; i++) {
            this.playerInfoList[i].$ui.find(selector).css({
                borderWidth: 1,
                borderColor: '#0003'
            });
        }

        var playIndex = this.getPlayerIndex();
        this.playerInfoList[playIndex].$ui.find(selector).css({
            borderWidth: 5,
            borderColor: config.selectedColor
        });
    };

    this.getPlayerIndex = function () {
        return this.turnIndex % this.playerList.length
    };

    this.readyNextTurn = function () {
        board.activePlayer();
        new Toast().show('주사위를 던지세요.');
    };

    this.getFundingPlace = function () {
        return this.getTargetBlock(config.fundingPlace);
    };

    this.getTargetBlock = function (name) {
        return board.blockList.find(function (block) {
            return block.name === name
        });
    };

    this.append = function ($ui) {
        this.$ui.append($ui);
    }
}

var board = new Board();
board.initBlock();
board.initPlayer();
board.initDie();
board.die.roll();
board.readyNextTurn();