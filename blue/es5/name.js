function Name(name) {
    this.name = name;
    this.$element = null;

    this.init = function () {
        this.$element = $('<div></div>');
        this.$element.addClass('block-name');
        this.$element.css({
            position: 'absolute',
            left: config.name.left,
            top: config.name.top,
            width: config.name.width,
            height: config.name.height,
            lineHeight: config.name.height + 'px',
            textAlign: 'center',
            fontWeight: 'bold'
        });

        this.$element.html(this.name);
    };

    this.init();

}