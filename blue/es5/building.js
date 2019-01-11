function Building(block) {
    this.block = block;
    this.$ui = null;

    this.init = function () {
        this.$ui = $($('#buildingTemplate').html());
        this.$ui.css({
            position: 'absolute',
            left: config.building.left,
            top: config.building.top,
            width: config.building.width,
            height: config.building.height,
            textAlign: 'center'
        });

        this.update(this.block);
    };

    /** @type Block **/
    this.update = function (block) {
        for (var i = 0; i < block.buildingList.length; i++) {
            var building = block.buildingList[i];
            this.$ui.find('.building-badge').eq(i).text(building.count);
        }
    };

    this.getName = function (index) {
        if (index == 0) {
            return '호텔';
        } else if (index == 1) {
            return '빌딩';
        } else if (index == 2) {
            return '별장';
        }

        return null;
    };

    this.init();
}