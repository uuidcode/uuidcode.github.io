function Owner(player) {
    this.$ui = null;
    this.player = player;

    this.init = function () {
        this.$ui = $('<div></div>');

        var $image = $('<img>');
        $image.addClass('owner');
        $image.attr('width', config.owner.width);
        $image.attr('height', config.owner.height);
        $image.attr('src', config.defaultOwnerImageUrl);
        this.$ui.append($image);

        this.$ui.css({
            position: 'absolute',
            left: config.owner.left,
            top: config.owner.top,
            width: config.owner.width,
            height: config.owner.height
        });
    };

    this.init();
}