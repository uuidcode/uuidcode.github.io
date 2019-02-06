import {$, config} from './config'
import codes from '../../image/*.png'

export class Flag {
    constructor() {
        this.code = null;
        this.$element = null;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
        return this;
    }

    render() {
        this.$element = $('<div></div>');
        const imageUrl = codes[this.code];
        this.$element.css({
            position: 'absolute',
            left: config.flag.left,
            top: config.flag.top,
            width: config.flag.width,
            height: config.flag.height,
            border: '1px solid black',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${config.flag.width}px ${config.flag.height}px`
        });

        return this.$element;
    }

    static of() {
        return new Flag();
    }
}