import {$, config} from './config'

export class Price {
    constructor() {
        this.price = null;
        this.$element = null;
    }

    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
        return this;
    }

    render() {
        this.$element = $(`<div>${this.price}</div>`);
        this.$element.addClass('price');
        return this.$element.css({
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

    static of() {
        return new Price();
    }
}