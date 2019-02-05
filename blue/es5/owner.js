function Owner(player) {
    this.$element = null;
    this.player = player;

    this.init = function () {
        this.$element = $('<div></div>');

        var $image = $('<img>');
        $image.addClass('owner');
        $image.attr('width', config.owner.width);
        $image.attr('height', config.owner.height);
        $image.attr('src', config.defaultOwnerImageUrl);
        this.$element.append($image);

        this.$element.css({
            position: 'absolute',
            left: config.owner.left,
            top: config.owner.top,
            width: config.owner.width,
            height: config.owner.height
        });
    };

    this.init();
}