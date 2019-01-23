function Board() {
    this.$element = $('.board');
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

    this.playDieSound = function () {
        this.playSound('die');
    };

    this.playWinSound = function () {
        this.playSound('win');
    };

    this.playJumpSound = function (count) {
        this.playSound('jump' + count);
    };

    this.initPlayer = function () {
        for (var i = 0; i < config.playerList.length; i++) {
            var player = new Player(this.playerList.length);
            this.playerList.push(player);
            this.$element.append(player.$element);

            var playerInfo = new PlayerInfo(player);
            this.playerInfoList.push(playerInfo);
            this.$element.append(playerInfo.$element);
            this.updatePlayerAmount(player, playerInfo);
        }
    };

    this.updatePlayerAmount = function (player, playerInfo) {
        var $amount = playerInfo.$element.find('.amount');
        $amount.text(util.toDisplayAmount(player.amount));
    };

    this.updatePlayInfo = function(currentPlayer) {
        this.playerInfoList[currentPlayer.index].$element.remove();

        var playerInfo = new PlayerInfo(currentPlayer);
        this.playerInfoList[currentPlayer.index] = playerInfo;

        this.$element.append(playerInfo.$element);
        this.updatePlayerAmount(currentPlayer, playerInfo);
    };

    this.initBlock = function () {
        this.blockList = [];
        this.$element.empty();
        var $dic = $('<div></div>');
        $dic.attr('id', 'die');
        this.$element.append($dic);

        for (var i = 0; i < 40; i++) {
            var block = new Block(i, Block.list[i]);
            this.blockList.push(block);
            this.$element.append(block.$element);
        }
    };

    this.initDie = function () {
        this.die = new Die();
        this.$element.append(this.die.$element);
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
            this.playerInfoList[i].$element.find(selector).css({
                borderWidth: 1,
                borderColor: '#0003'
            });
        }

        var playIndex = this.getPlayerIndex();

        this.playerInfoList[playIndex].$element.find(selector).css({
            borderWidth: 5,
            borderColor: config.selectedColor
        });

        /** @type Player **/
        var currentPlayer = this.getCurrentPlayer();
        var that = this;

        this.playerInfoList[playIndex].$element.transfer({
            to: that.blockList[currentPlayer.position].$element
        })

        currentPlayer.$element.removeClass('live').addClass('turn');
        setTimeout(function () {
            currentPlayer.$element.removeClass('turn').addClass('live');
        }, 1000);
    };

    this.getPlayerIndex = function () {
        return this.turnIndex % this.playerList.length
    };

    this.currentPlayerIsOnSpaceTravel = function () {
        var currentPlayer = this.getCurrentPlayer();
        return this.blockList[currentPlayer.position].name === config.spaceTravel;
    };

    this.getBlockHtml = function (target) {
        var targetBlock = board.getTargetBlock(target);
        var $image = $('<img>').css({
            width: '100%'
        });

        $image.attr('src', targetBlock.getImageUrl());
        return $image[0].outerHTML;
    };

    this.readyNextTurn = function () {
        if (this.currentPlayerIsOnSpaceTravel()) {
            new Toast().showPickPlace(board.activePlayer.bind(this));
        } else {
            new Toast().show('주사위를 던지세요.', board.activePlayer.bind(this));
        }
    };

    this.getFundingPlace = function () {
        return this.getTargetBlock(config.fundingPlace);
    };

    this.getTargetBlock = function (name) {
        return board.blockList.find(function (block) {
            return block.name === name
        });
    };

    this.append = function ($element) {
        this.$element.append($element);
    };

    this.ready = function () {
        new Ready();
    };

    this.initTimer = function (minuteTimer) {
        new Timer(minuteTimer);
    };

    this.start = function (minuteTimer) {
        board.initBlock();
        board.initPlayer();
        board.initDie();
        board.initTimer(minuteTimer);
        board.readyNextTurn();
    };

    this.win = function (player) {
        new Win(player);
    };
}

var board = new Board();
board.ready();