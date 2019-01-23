function Building(block) {
    this.block = block;
    this.$ui = null;

    this.init = function () {
        var template = Handlebars.compile(this.template());
        this.$ui = $(template());
        this.$ui.css({
            position: 'absolute',
            left: config.building.left,
            top: config.building.top,
            width: config.building.width,
            height: config.building.height,
            textAlign: 'center'
        });

        this.update();
    };

    /** @type Block **/
    this.update = function () {
        for (var i = 0; i < this.block.buildingList.length; i++) {
            var building = this.block.buildingList[i];
            this.$ui.find('.building-badge').eq(i).text(building.count);
        }

        var $totalFees = this.$ui.find('.total-fees');
        $totalFees.text('');

        if (this.block.player != null) {
            var totalFees = this.block.getTotalFees();

            if (totalFees > 0) {
                $totalFees.text(util.toDisplayAmount(totalFees));
            }
        }
    };

    this.getName = function (index) {
        util.getBuildName(index);
    };

    this.template = function () {
        return `
        <div>
            <span class="badge badge-primary building-badge"></span>
            <span class="badge badge-warning building-badge"></span>
            <span class="badge badge-danger building-badge"></span>
            <span class="badge badge-light total-fees"></span>
        </div>
        `
    };

    this.init();
}