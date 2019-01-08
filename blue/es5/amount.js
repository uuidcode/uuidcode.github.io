function Amount(amount) {
    this.amount = amount;
    this.$ui = null;

    this.init = function () {
        this.$ui = $('<div></div>');
        this.$ui.addClass('block-amount');
        this.$ui.css({
            position: 'absolute',
            left: config.amount.left,
            top: config.amount.top,
            width: config.amount.width,
            height: config.amount.height,
            lineHeight: config.amount.height + 'px',
            textAlign: 'center',
            fontWeight: 'bold'
        });
        
        this.$ui.html(this.amount);
    };

    this.init();
}