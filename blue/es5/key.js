function Key() {
    this.$element = null;

    this.init = function () {
        this.$element = $('<div></div>');
        this.$element.css({
            position: 'absolute',
            left: (config.block.width - config.key.width) / 2,
            top: config.key.top,
            width: config.key.width,
            height: config.key.height,
            backgroundImage: 'url(../image/key.png)',
            backgroundSize: `${config.key.width}px ${config.key.height}px`
        });
    };

    this.init();

}