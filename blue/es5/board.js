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
            this.$ui.append(player.$ui);

            var playerInfo = new PlayerInfo(player);
            this.playerInfoList.push(playerInfo);
            this.$ui.append(playerInfo.$ui);
            this.updatePlayerAmount(player, playerInfo);
        }
    };

    this.updatePlayerAmount = function (player, playerInfo) {
        var $amount = playerInfo.$ui.find('.amount');
        $amount.text(util.toDisplayAmount(player.amount));
    };

    this.updatePlayInfo = function(currentPlayer) {
        this.playerInfoList[currentPlayer.index].$ui.remove();

        var playerInfo = new PlayerInfo(currentPlayer);
        this.playerInfoList[currentPlayer.index] = playerInfo;

        this.$ui.append(playerInfo.$ui);
        this.updatePlayerAmount(currentPlayer, playerInfo);
    };

    this.initBlock = function () {
        this.blockList = [];
        this.$ui.empty();
        var $dic = $('<div></div>');
        $dic.attr('id', 'die');
        this.$ui.append($dic);

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
        board.activePlayer();

        if (this.currentPlayerIsOnSpaceTravel()) {
            new Toast().showPickPlace();
        } else {
            new Toast().show('주사위를 던지세요.');
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

    this.append = function ($ui) {
        this.$ui.append($ui);
    };

    this.ready = function () {
        var html = $('#startTemplate').html();
        var playerHtml = $('#startPlayerTemplate').html();

        var $modal = $(html);
        var $playerList = $modal.find('.player-list');
        var reset = function () {
            $modal.find('.row').each(function (index) {
                $(this).find('.player-index').text(index + 1);
            });
        };

        config.playerList.forEach(function (player, index) {
            var $player = $(playerHtml);
            var $playerImage = $player.find('.player-image');
            $playerImage.attr('src', util.getImageUrl(player.image));
            $playerImage.attr('data-image', player.image);
            $playerList.append($player);
        });

        reset();

        $modal.on('click', '.up-button', function () {
            var index = $modal.find('.up-button').index($(this));

            if (index === 0) {
                return;
            }

            var $row = $(this).closest('.row');
            $row.insertBefore($row.parent('').find('.row').eq(index - 1));
            reset();
        });

        $modal.on('click', '.down-button', function () {
            var index = $modal.find('.down-button').index($(this));

            if (index === config.playerList.length - 1) {
                return;
            }

            var $row = $(this).closest('.row');
            $row.insertAfter($row.parent('').find('.row').eq(index - 1));
            reset();

        });

        $modal.on('click', '.start-button', function () {
            var $row = $modal.find('.player-row');

            for (var i = 0; i < $row.length; i++) {
                var $currentPlayer = $row.eq(i);
                var $playerName = $currentPlayer.find('.player-name');

                if ($playerName.val().trim() === '') {
                    alert('이름을 입력하세요.');
                    $playerName.focus();
                    return;
                }

                config.playerList[i].image = $currentPlayer.find('.player-image').attr('data-image');
                config.playerList[i].name = $currentPlayer.find('.player-name').val().trim();
            }

            var randomPlace = $modal.find('.random-place').is(':checked');

            if (randomPlace) {
                shuffle(config.blockList);

                var startIndex = 0;

                for (var i = 0; i < config.blockList.length; i++) {
                    if (config.blockList[i].name === config.start) {
                        startIndex = i;
                        break;
                    }
                }

                if (startIndex !== 0) {
                    var startBlock = config.blockList[startIndex];
                    var tempBlock = config.blockList[0];
                    config.blockList[0] = startBlock;
                    config.blockList[startIndex] = tempBlock;
                }

            }

            board.start($modal.find('.minute-timer').val());
            $modal.hideModal();
        });

        $modal.showModal().removeModalWhenClose();

        setTimeout(function () {
            $modal.find('.player-name').eq(0).focus();
        }, 1000);
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

    this.win = function (winPlayer) {
        var html = $('#winTemplate').html();
        var $winModal = $(html);
        $winModal.find('.player-image').attr('src', winPlayer.getImageUrl());
        $winModal.find('.player-name').text(winPlayer.name + '이/가 이겼습니다.');
        $winModal.showModal().removeModalWhenClose();
        confetti.start();
        board.playWinSound();

        $winModal.find('.win-button').on('click', function () {
            location.reload();
        });
    };
}

var board = new Board();
board.ready();