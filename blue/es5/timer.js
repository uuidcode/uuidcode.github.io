function Timer(minuteTimer) {
    this.$ui = null;

    this.init = function () {
        this.$ui = $('<div></div>');
        this.$ui.addClass('timer');
        this.$ui.attr('data-minutes-left', minuteTimer);

        var css = {
            position: 'absolute',
            left: config.block.width,
            top: config.block.height + config.die.height,
            width: config.timer.width,
            height: config.timer.height,
            margin: config.timer.margin
        };

        this.$ui.css(css);
        board.$ui.append(this.$ui);

        $('.timer').startTimer({
            onComplete: function(){
                for (var i = 0; i < board.playerList.length; i++) {
                    /** @type Player **/
                    var player = board.playerList[i];
                    var totalAmount = 0;
                    player.getBlockList()
                        .forEach(function (block) {
                            totalAmount += block.getTotalAmount();
                        });
                    totalAmount += player.amount;
                    player.totalAmount = totalAmount;
                }

                board.playerList.sort(function (a, b) {
                    return b.totalAmount - a.totalAmount;
                });

                board.win(board.playerList[0]);
            }
        });
    };

    this.init();
}