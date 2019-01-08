var blue = {
    numberOfPlayers: 2,
    amountOfStarting: 500_000,

    init: function () {
        var canvas = $t.id('canvas');

        canvas.style.width = '640px';
        canvas.style.height = '720px';

        $t.dice.use_true_random = false;

        var box = new $t.dice.dice_box(canvas, {
            w: 640,
            h: 720
        });

        box.rolling = false;

        function notation_getter() {
            return $t.dice.parse_notation("1d6");
        }

        function before_roll(vectors, notation, callback) {
            callback();
        }

        function after_roll(notation, result) {
            console.log(notation, result)
        }

        $('#canvas').on('click', function () {
            box.start_throw(notation_getter, before_roll, after_roll);
        });

        box.start_throw(notation_getter, before_roll, after_roll);

        var position = $('.cell-1-5').position();

        $('#player1').css({
            position: 'fixed',
            display: 'block',
            left: position.left + 'px',
            top: position.top + 'px'
        });
    }
};

$(function() {
    blue.init();
});