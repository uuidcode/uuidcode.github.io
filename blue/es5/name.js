function Name(name) {
    this.name = name;
    this.$ui = null;

    this.init = function () {
        this.$ui = $('<div></div>');
        this.$ui.addClass('block-name');
        this.$ui.css({
            position: 'absolute',
            left: config.name.left,
            top: config.name.top,
            width: config.name.width,
            height: config.name.height,
            lineHeight: config.name.height + 'px',
            textAlign: 'center',
            fontWeight: 'bold'
        });

        this.$ui.html(this.name);
    };

    this.init();

}