function Amount(amount) {
    this.amount = amount;
    this.$element = null;

    this.init = function () {
        this.$element = $(`<div>${this.amount}</div>`);
        this.$element.addClass('block-amount');
        this.$element.css({
            position: 'absolute',
            left: config.amount.left,
            top: config.amount.top,
            width: config.amount.width,
            height: config.amount.height,
            lineHeight: config.amount.height + 'px',
            textAlign: 'center',
            fontWeight: 'bold'
        });
    };

    this.init();
}