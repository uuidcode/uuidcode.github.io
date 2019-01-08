function Special(name) {
    this.name = name;
    this.$ui = null;

    this.init = function () {
        this.$ui = $('<div></div>');
        this.$ui.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: config.block.width,
            height: config.block.height,
            lineHeight: config.block.height + 'px',
            textAlign: 'center',
            fontWeight: 'bold'
        });

        this.$ui.html(this.name);
    };

    this.init();

}