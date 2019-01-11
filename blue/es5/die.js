function Die() {
    this.$ui = null;
    this.box = null;

    this.init = function () {
        this.$ui = $('#die');

        var css = {
            position: 'absolute',
            border: '1px solid black',
            left: config.block.width,
            top: config.block.height,
            width: config.die.width,
            height: config.die.height,
            margin: config.die.margin
        };

        this.$ui.addClass('shadow');
        this.$ui.css(css);

        var dieCanvas = $t.id('die');
        $t.dice.use_true_random = false;

        this.box = new $t.dice.dice_box(dieCanvas, {
            w: css.width,
            h: css.height
        });

        this.box.rolling = false;
        var self = this;

        this.$ui.on('click', function () {
            if (board.currentPlayerIsOnSpaceTravel()) {
                new Toast().showPickPlace();
            } else {
                board.turn();
            }
        });
    };

    this.notationGetter = function () {
        return $t.dice.parse_notation("1d6");
    };

    this.beforeRoll = function (vectors, notation, callback) {
        callback();
    };

    this.roll = function (callback) {
        if (!callback) {
            callback = function () {};
        }

        board.playDieSound();
        this.box.start_throw(this.notationGetter, this.beforeRoll, callback);
    };

    this.go = function (count) {
        this.roll(function () {
           board.getCurrentPlayer().go(count);
        });
    };

    this.goFast = function (count) {
        this.roll(function () {
            board.getCurrentPlayer().goFast(count);
        });
    };

    this.init();
}