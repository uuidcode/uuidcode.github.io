function Flag(code) {
    this.code = code;
    this.$ui = null;

    this.init = function () {
        this.$ui = $('<div></div>');
        this.$ui.css({
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