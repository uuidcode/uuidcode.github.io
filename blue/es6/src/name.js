import {$, config} from './config'

export class Name {
    constructor() {
        this.name = null;
        this.$element = null;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    render() {
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

        return this.$element.html(this.name);
    };

    static of() {
        return new Name();
    }
}