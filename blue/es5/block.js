function Block(index, data) {
    this.index = index;
    this.type = null;
    this.name = null;
    this.displayAmount = null;
    this.displayTravelFees = null;
    this.amount = null;
    this.code = null;
    this.$ui = null;
    this.player = null;
    this.buildingList = [];
    this.fundingCount = 0;

    if (data) {
        this.type = data.type || 'nation';
        this.name = data.name || '';
        this.displayAmount = data.displayAmount || '';
        this.amount = data.amount || 0;
        this.displayFees = data.displayFees || '';
        this.fees = data.fees || 0;
        this.code = data.code || '';
        this.displayTravelFees = data.displayTravelFees;

        if (data.buildingList) {
            this.buildingList = data.buildingList;
        }
    }

    this.welcome = function () {
        console.log('welcome');

        var self = this;

        this.$ui.animate({
            backgroundColor: config.selectedColor
        }, function () {
            self.$ui.animate({
                backgroundColor: '#ffffff'
            });
        });
    };

    this.getTotalFees = function () {
        var totalFees = 0;

        this.buildingList.forEach(function (building) {
            totalFees += building.fees * building.count;
        });

        if (totalFees == 0) {
            totalFees = this.fees;
        }

        return totalFees;
    };

    this.getTotalAmount = function () {
        var totalAmount = 0;

        this.buildingList.forEach(function (building) {
            totalAmount += building.price * building.count;
        });

        totalAmount += this.amount;

        return totalAmount;
    };

    this.updateOwner = function () {
        var imageUrl = config.defaultOwnerImageUrl;

        if (this.player != null) {
            imageUrl = this.player.getImageUrl();
        }

        this.$ui.find('.owner').attr('src', imageUrl);
    };

    this.init = function () {
        var self = this;
        var position = this.processPosition();

        this.$ui = $('<div></div>');
        this.$ui.on('click', function () {
            if (board.currentPlayerIsOnSpaceTravel()) {
                if (self.name === config.spaceTravel) {
                    return;
                }

                var currentPlayer = board.getCurrentPlayer();
                currentPlayer.goFastToBlock(self.name);
            }
        });

        this.$ui.addClass('block');
        this.$ui.css({
            position: 'absolute',
            left: position.left,
            top: position.top,
            width: config.block.width,
            height: config.block.height,
            zIndex: 100
        });

        if (this.type == 'nation') {
            var flag = new Flag(this.code);
            this.$ui.append(flag.$ui);

            var name = new Name(this.name);
            this.$ui.append(name.$ui);

            var amount = new Amount(this.displayAmount);
            this.$ui.append(amount.$ui);

            var owner = new Owner(null);
            this.$ui.append(owner.$ui);
        } else if (this.type == config.goldenKey) {
            var key = new Key();
            this.$ui.append(key.$ui);
        } else if (this.type == 'special') {
            var special = new Special(this.name, this.code);
            this.$ui.append(special.$ui);
        }
    };

    this.processPosition = function () {
        var left = 0;
        var top = 0;
        var placement = null;

        if (this.index >= 0 && this.index <= 10) {
            left = this.index * config.block.width;
            placement = 'top';
        } else if (this.index > 10 && this.index <= 20) {
            left = 10 * config.block.width;
            top = (this.index - 10) * config.block.height;
            placement = 'right';
        } else if (this.index > 20 && this.index <= 30) {
            left = (30 - this.index) * config.block.width;
            top = 10 * config.block.height;
            placement = 'bottom';
        } else if (this.index > 30) {
            top = (40 - this.index) * config.block.height;
            placement = 'left';
        }

        return {
            left: left,
            top: top,
            placement: placement
        };
    };

    this.getImageUrl = function () {
        return '../image/'+ this.code + '.png';
    };

    this.addFunding = function () {
        this.fundingCount++;
        this.amount = this.getFundingAmount();
        this.updateFundingAmount();
    };

    this.resetFunding = function () {
        if (this.fundingCount > 0) {
            board.getCurrentPlayer().income(this.amount);
            new Toast().show(this.getDisplayFundingAmount());
        }

        this.fundingCount = 0;
        this.amount = this.getFundingAmount();
        this.updateFundingAmount();
    };

    this.getFundingAmount = function () {
        return 150000 * this.fundingCount;
    };

    this.getDisplayFundingAmount = function () {
        return this.fundingCount * 15 + '만원';
    };


    this.updateFundingAmount = function () {
        this.$ui.find('.block-amount').text(this.getDisplayFundingAmount());
    };

    this.init();
}
