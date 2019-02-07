import {$, config} from './config'

export class Estate {
    constructor() {
        this.$element = null;
        this.place = null;
    }

    setPlace(place) {
        this.place = place;
        return this;
    }

    render() {
        this.$element = $(this.template());
        this.$element.css({
            position: 'absolute',
            left: config.estate.left,
            top: config.estate.top,
            width: config.estate.width,
            height: config.estate.height,
            textAlign: 'center'
        });

        this.update();
    }

    update() {
        this.place.estateItemList().forEach((element, index) => {
            this.$element.find('.building-badge').eq(index).text(element.count);
        });

        const $totalFees = this.$element.find('.total-fees');
        $totalFees.text('');

        const player = this.place.getPlayer();

        if (player != null) {
            var totalFees = this.place.getTotalFees();

            if (totalFees > 0) {
                $totalFees.text(util.toDisplayAmount(totalFees));
            }
        }
    }

    static of() {
        return new Estate();
    }

    template() {
         return `
        <div>
            <span class="badge badge-primary building-badge"></span>
            <span class="badge badge-warning building-badge"></span>
            <span class="badge badge-danger building-badge"></span>
            <span class="badge badge-light total-fees"></span>
        </div>
        ';
    }
}