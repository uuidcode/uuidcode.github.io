import {$, config} from './config'
import {Flag} from './flag'
import {Name} from './name'
import {Price} from './price'
import {Owner} from './owner'
import {Estate} from './estate'

export class Place {
    constructor() {
        this.index = null;
        this.code = null;
        this.type = null;
        this.name = null;
        this.price = null;
        this.fee = null;
        this.hotelPrice = null;
        this.hotelFee = null;
        this.buildingPrice = null;
        this.buildingFee = null;
        this.villaPrice = null;
        this.villaFee = null;
        this.$element = null;
    }

    setVillaFee(villaFee) {
        this.villaFee = villaFee;
        return this;
    }

    setVillaPrice(villaPrice) {
        this.villaPrice = villaPrice;
        return this;
    }

    setBuildingFee(buildingFee) {
        this.buildingFee = buildingFee;
        return this;
    }

    setBuildingPrice(buildingPrice) {
        this.buildingPrice = buildingPrice;
        return this;
    }

    setHotelFee(hotelFee) {
        this.hotelFee = hotelFee;
        return this;
    }

    setHotelPrice(hotelPrice) {
        this.hotelPrice = hotelPrice;
        return this;
    }

    setFee(fee) {
        this.fee = fee;
        return this;
    }

    setPrice(price) {
        this.price = price;
        return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setType(type) {
        this.type = type;
        return this;
    }

    setIndex(index) {
        this.index = index;
        return this;
    }

    setCode(code) {
        this.code = code;
        return this;
    }

    processPosition() {
        let left = 0;
        let top = 0;
        let placement = null;

        if (this.index >= 0 && this.index <= 10) {
            left = this.index * config.place.width;
            placement = 'top';
        } else if (this.index > 10 && this.index <= 20) {
            left = 10 * config.place.width;
            top = (this.index - 10) * config.place.height;
            placement = 'right';
        } else if (this.index > 20 && this.index <= 30) {
            left = (30 - this.index) * config.place.width;
            top = 10 * config.block.height;
            placement = 'bottom';
        } else if (this.index > 30) {
            top = (40 - this.index) * config.place.height;
            placement = 'left';
        }

        return {
            left: left,
            top: top,
            placement: placement
        };
    };

    render() {
        let position = this.processPosition();

        this.$element = $('<div></div>');
        this.$element.on('click', function () {
            if (board.currentPlayerIsOnSpaceTravel()) {
                if (that.name === config.spaceTravel) {
                    return;
                }

                var currentPlayer = board.getCurrentPlayer();
                currentPlayer.goFastToIndex(that);
            }
        });

        this.$element.addClass('block');
        this.$element.css({
            position: 'absolute',
            left: position.left,
            top: position.top,
            width: config.block.width,
            height: config.block.height,
            zIndex: 100
        });

        if (this.type == 'nation') {
            const flag = Flag.of();
            flag.setCode(this.code);
            this.$element.append(flag.render());

            const name = Name.of();
            name.setName(this.name);
            this.$element.append(name.render());

            const price = Price.of();
            price.setPrice(this.price);
            this.$element.append(price.render());

            const owner = Owner.of();
            this.$element.append(owner.render());

            const estate = Estate.of();
            this.$element.append(estate.render());
        } else if (this.type == config.goldenKey) {
            var key = new Key();
            this.$element.append(key.$element);
        } else if (this.type == 'special') {
            var special = new Special(this.name, this.code);
            this.$element.append(special.$element);
        }
    };

    template() {
        return `
        <div>
            <div class="flag"></div>
            <div class="price"></div>
            <div class="owner"></div>
            <div class="name"></div>
            <div class="estate">
                <span class="badge badge-primary hotel"></span>
                <span class="badge badge-warning building"></span>
                <span class="badge badge-danger villa"></span>
                <span class="badge badge-light fee"></span>
            </div>
        </div>
        `
    }
}