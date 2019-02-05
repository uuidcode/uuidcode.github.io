function Timer(minuteTimer) {
    this.$element = null;

    this.init = function () {
        this.$element = $('<div></div>');
        this.$element.addClass('timer');
        this.$element.attr('data-minutes-left', minuteTimer);

        var css = {
            position: 'absolute',
            left: config.block.width,
            top: config.block.height + config.die.height,
            width: config.timer.width,
            height: config.timer.height,
            margin: config.timer.margin
        };

        this.$element.css(css);
        board.$element.append(this.$element);

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