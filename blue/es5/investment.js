function Investment() {
    this.$ui = null;
    this.buildingList = null;

    this.show = function (block) {
        console.log('>>> investment show');

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

        var $image = this.$ui.find('img');
        $image.css({
            border: '1px solid black'
        });

        $image.attr('src', block.getImageUrl());

        if (this.buildingList.length > 0) {
            this.createBuildingList();
        }

        if (block.player === null) {
            $('#cancelButton,#buyButton').show();
            $('#notPayButton,#payButton,#resetButton,#payFeeButton,#useTicketButton').hide();
        } else if (block.player == player) {
            this.$ui.find('.investment-count').show();
            this.$ui.find('.investment-add').show();
            $('#notPayButton,#payButton,#resetButton').show();
            $('#cancelButton,#buyButton,#useTicketButton').hide();
        } else {
            var totalFee = block.getTotalFees();
            $('#notPayButton,#payButton,#resetButton').hide();
            $('#cancelButton,#buyButton').hide();
            $('#payFeeButton').html(totalFee.toLocaleString() + '원을 지불합니다.').show();

            if (player.ticketCount > 0) {
                $('#useTicketButton').show();
            } else {
                $('#useTicketButton').hide();
            }
        }

        this.showModal();
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