function Die() {
    this.$element = null;
    this.box = null;

    this.init = function () {
        this.$element = $('#die');

        var css = {
            position: 'absolute',
            border: '1px solid black',
            left: '0px',
            top: '0px',
            width: 400,
            height: 400
        };

        this.$element.addClass('shadow');
        this.$element.css(css);

        var dieCanvas = $t.id('die');
        $t.dice.use_true_random = false;

        this.box = new $t.dice.dice_box(dieCanvas, {
            w: css.width,
            h: css.height
        });

        this.box.rolling = false;
        var that = this;

        this.$element.on('click', function () {
            that.roll(function (notation, count) {
            });
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

        this.box.start_throw(this.notationGetter, this.beforeRoll, callback);
    };

    this.init();
    
    console.log('init');
    
}