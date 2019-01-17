function Robot() {
    /** @type Player **/
    this.run = function (player) {
        /** @type Player **/
        var currentPlayer = board.getCurrentPlayer();

        if (currentPlayer != player) {
            return;
        }

        if (board.blockList[player.position].name === config.spaceTravel) {
            currentPlayer.goFastToBlock(config.start);
            return;
        }

        if ($('.investment-modal').length > 0) {
            var block = board.blockList[player.position];

            if (block.player === null) {
                if (currentPlayer.amount >= block.amount) {
                    $('#buyButton').click();
                } else {
                    $('#cancelButton').click();
                }

                return;
            } else if (block.player === player) {
                var random = block.buildingList.length;
                random = Math.floor(Math.random() * random);
                var building = block.buildingList[random];

                if (currentPlayer.amount >= building.price) {
                    $('.investment-add').eq(random).click();
                    setTimeout(function () {
                        $('#payButton').click();
                    }, 100);

                } else {
                    $('#notPayButton').click();
                }

                return;
            } else {
                var totalFees = block.getTotalFees();

                if (currentPlayer.ticketCount > 0) {
                    if (totalFees >= currentPlayer.amount || totalFees > 1000000) {
                        $('#useTicketButton').click();
                        return;
                    }
                }

                $('#payFeeButton').click();
                return;
            }
        } else if($('.golden-key-modal').length > 0) {
            $('.run-golden-key-button').click();
            return;
        }

        player.rollDie();
    }
}