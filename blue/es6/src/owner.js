import {$, config} from './config'
import {Palyer} from './player'

export class Owner {
    constructor() {
        this.player = null;
        this.$element = null;
    }

    setPlayer(player) {
        this.player = player;
        return this;
    }

    render() {
        this.$element = $('<div></div>');

        const $image = $('<img>');
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

        return this.$element;
    }

    static of() {
        return new Owner();
    }
}