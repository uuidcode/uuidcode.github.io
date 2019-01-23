function Flag(code) {
    this.code = code;
    this.$element = null;

    this.init = function () {
        this.$element = $('<div></div>');
        this.$element.css({
            position: 'absolute',
            left: config.flag.left,
            top: config.flag.top,
            width: config.flag.width,
            height: config.flag.height,
            border: '1px solid black',
            backgroundImage: 'url(../image/' + code + '.png)',
            backgroundSize: config.flag.width + 'px ' + config.flag.height + 'px'
        });
    };

    this.init();
}