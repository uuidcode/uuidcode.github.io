function Special(name, code) {
    this.name = name;
    this.code = code;
    this.$element = null;

    this.init = function () {
        this.$element = $('<div></div>');
        this.$element.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: config.block.width,
            height: config.block.height,
            lineHeight: config.block.height + 'px',
            textAlign: 'center',
            fontWeight: 'bold'

        });

        var $name = $(`<span>${this.name}</span>`);
        $name.css({
            backgroundColor: config.selectedColor
        });

        this.$element.append($name);

        if (this.code) {
            this.$element.css({
                backgroundImage: `url(../image/${this.code}.png)`,
                backgroundSize: `${config.block.width}px ${config.block.height}px`,
                color: 'white'
            })
        }
    };

    this.init();

}