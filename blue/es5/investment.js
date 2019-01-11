function Investment() {
    this.$ui = null;
    this.buildingList = null;

    this.show = function (block) {
        var player = board.getCurrentPlayer();
        this.buildingList = block.buildingList;

        this.$ui = $($('#investmentInfoTemplate').html());
        board.append(this.$ui);

        this.$ui.find('.display-amount').html(block.displayAmount);
        this.$ui.find('.display-fees').html(block.displayFees);

        this.getModal().find('.modal-title').css({
            fontWeight: 'bold'
        }).html(block.name);

        this.$ui.find('table').css({
            margin: 10
        });

        var $place = this.$ui.find('.place');
        $place.css({
            border: '1px solid black'
        });

        $place.attr('src', block.getImageUrl());
        this.$ui.find('.owner').attr('src', block.getOwnerImageUrl());

        if (this.buildingList.length > 0) {
            this.createBuildingList();
        }

        this.$ui.find('.player-amount').text('잔액 : ' + util.toDisplayAmount(player.amount));
        var self = this;

        if (block.player === null) {
            $('#cancelButton,#buyButton').show();

            if (block.amount > player.amount) {
                $('#buyButton').hide();
            }

            $('#buyButton').text(util.getPayMessage(block.amount));
            $('#notPayButton,#payButton,#resetButton,#payFeeButton,#useTicketButton').hide();
        } else if (block.player == player) {
            this.showInvestmentCount();
            this.$ui.find('.investment-add').show();
            $('#notPayButton,#payButton,#resetButton').show();
            $('#cancelButton,#buyButton,#useTicketButton,#payFeeButton').hide();

            if (!block.buildingList) {
                self.hideModal();
                return;
            }
        } else {
            this.showInvestmentCount();
            var totalFee = block.getTotalFees();
            $('#notPayButton,#payButton,#resetButton').hide();
            $('#cancelButton,#buyButton').hide();
            $('#payFeeButton').html(util.toDisplayAmount(totalFee) + '을 지불합니다.').show();

            if (player.ticketCount > 0) {
                $('#useTicketButton').show();
            } else {
                $('#useTicketButton').hide();
            }
        }

        var timeOut = 0;

        if ($('.toast-modal').length > 0) {
            timeOut = 2000;
        }

        setTimeout(function () {
            self.showModal();
        }, timeOut);
    };

    this.showInvestmentCount = function () {
        this.$ui.find('.investment-count').show();
    };

    this.getModal = function () {
        return util.getModal('.investment-modal');
    };

    this.showModal = function () {
        this.getModal().showModal();
    };

    this.hideModal = function () {
        this.getModal().hideModal();
    };

    this.createBuildingList = function () {
        var html = $('#investmentBuildingTemplate').html();
        this.$ui.find('.container-fluid').append(html);

        for (var i = 0; i < this.buildingList.length; i++) {
            var building = this.buildingList[i];
            var $item = $($('#investmentBuildingItemTemplate').html());
            $item.find('.name').html(building.name);
            $item.find('.investment-count').html(building.count);
            $item.find('.price').html(building.displayPrice);
            $item.find('.fees').html(building.displayFees);
            this.$ui.find('.investment-item-container').append($item);
        }
    };
}