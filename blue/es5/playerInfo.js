function PlayerInfo(player) {
    this.$ui = null;

    this.createNation = function(player) {
        var nationHtml = $('#nationTemplate').html();
        var $nationContainer = this.$ui.find('.nationContainer');

        for (var i = 0; i < board.blockList.length; i++) {
            var block = board.blockList[i];

            if (block.player == player) {
                var $nation = $(nationHtml);
                $nation.find('.flag').find('img').attr('src', block.getImageUrl());
                $nation.find('.name').html(block.name);
                $nationContainer.append($nation);
            }
        }
    };

    this.init = function (player) {
        var template = $('#playerInfoTemplate').html();
        this.$ui = $(template);
        var blockList = player.getBlockList();
        this.$ui.find('.place-count').text(blockList.length);

        if (player.ticketCount > 0) {
            this.$ui.find('.ticket')
                .text('우대권: ' + player.ticketCount)
                .show();
        }

        if (player.escapeTicketCount > 0) {
            this.$ui.find('.ticket')
                .text('무인도 탈출권: ' + player.escapeTicketCount)
                .show();
        }

        this.$ui.find('.modal-dialog').css({
            margin: 0
        });

        this.$ui.find('.modal-body').css({
            maxHeight: config.playerInfo.height
        });

        var left = config.die.margin +
            config.block.width +
            config.die.width +
            config.playerInfo.left +
            (config.playerInfo.width + config.playerInfo.left) * player.index;

        var top = config.block.height + config.playerInfo.top;

        this.$ui.css({
           position: 'absolute',
           display: 'block',
           width: config.playerInfo.width,
           height: config.playerInfo.height,
           left: left,
           top: top
        });

        this.$ui.find('.player').attr('src', player.getImageUrl());

        this.createNation(player);
    };

    this.init(player);
}