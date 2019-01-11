function Special(name, code) {
    this.name = name;
    this.code = code;
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

        if (this.code) {
            this.$ui.css({
                backgroundImage: 'url(../image/' + this.code + '.png)',
                backgroundSize: config.block.width + 'px ' + config.block.height + 'px',
                color: 'white'
            })
        }
    };

    this.init();

}