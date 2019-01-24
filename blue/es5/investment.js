function Investment() {
    this.$element = null;

    /** @type Block **/
    this.show = function (block) {
        /** @type Player **/
        var player = board.getCurrentPlayer();

        if (block.player == player) {
            if (block.hasNotBuilding()) {
                return false;
            }
        }

        var template = Handlebars.compile(this.template());
        this.$element = $(template({
            block: block,
            player: player
        }));

        var that = this;
        var timeOut = 0;

        if ($('.toast-modal').length > 0) {
            timeOut = 2000;
        }

        setTimeout(function () {
            that.showModal();

            if (block.player === null) {
                $('#cancelButton,#buyButton').show();

                if (block.amount > player.amount) {
                    $('#buyButton').hide();
                }

                $('#buyButton').text(util.getPayMessage(block.amount));
                $('#notPayButton,#payButton,#resetButton,#payFeeButton,#useTicketButton').hide();
            } else if (block.player == player) {
                that.showInvestmentCount();
                that.$element.find('.investment-add').show();
                $('#notPayButton,#payButton,#resetButton').show();
                $('#cancelButton,#buyButton,#useTicketButton,#payFeeButton').hide();
            } else {
                that.showInvestmentCount();
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

            $('#buyButton').on('click', function () {
                block.player = player;
                player.amount -= block.amount;

                block.update();
                board.updatePlayInfo(player);
                player.readyNextTurn(that);
            });

            $('#cancelButton, #notPayButton').on('click', function () {
                player.readyNextTurn(that);
            });

            $('#resetButton').on('click', function () {
                for (var i = 0; i < block.newBuildingCountList.length; i++) {
                    var $investmentCount = $('.investment-count').eq(i + 1);
                    var count = block.newBuildingCountList[i];
                    $investmentCount.text(parseInt($investmentCount.text()) - count);
                }

                player.initNewBuilding(block);
            });

            $('#payFeeButton').on('click', function () {
                var totalFees = block.getTotalFees();
                that.hideModal();

                if (player.payOnly(totalFees)) {
                    return;
                }

                var message = util.toDisplayAmount(totalFees) + '을 지불하였습니다.';
                block.player.income(totalFees, message);
            });

            $('#useTicketButton').on('click', function () {
                that.hideModal();
                player.ticketCount--;
                var message = '우대권을 사용하였습니다.';
                board.updatePlayInfo(player);
                new Toast().showAndReadyToNextTurn(message);
            });

        }, timeOut);

        return true;
    };

    this.showInvestmentCount = function () {
        this.$element.find('.investment-count').show();
    };

    this.getModal = function () {
        return util.getModal(this.$element);
    };

    this.showModal = function () {
        this.getModal().showModal();
    };

    this.hideModal = function () {
        this.getModal().hideModal();
    };

    this.template = function () {
        return `
        <div class="modal investment-modal" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <span class="modal-title" style="font-weight: bold">{{block.name}}</span>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-6 m-auto text-center">
                                    <img src="{{block.getImageUrl}}" class="place" width="100px" height="50px" style="border:1px solid black">
                                    <img src="{{block.getOwnerImageUrl}}" class="owner" width="30px" height="30pxpx">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-10 m-auto">
                                    <table class="table" style="margin: 10px">
                                        <thead>
                                        <tr>
                                            <th scope="col">구입비용</th>
                                            <th scope="col">통행료</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td class="display-amount">{{block.displayAmount}}</td>
                                            <td class="display-fees">{{block.displayFees}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {{#if block.hasBuilding}}
                            <div class="row">
                                <div class="col-md-10 m-auto">
                                    <strong>건축비</strong>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-10 m-auto">
                                    <table class="table" style="margin: 10px">
                                        <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">비용</th>
                                            <th scope="col">수익</th>
                                            <th scope="col" class="investment-count" style="display:none">개수</th>
                                            <th scope="col" class="investment-add" style="display:none"></th>
                                        </tr>
                                        </thead>
                                        <tbody class="investment-item-container">
                                            {{#each block.buildingList}}
                                            <tr>
                                                <td class="name">{{name}}</td>
                                                <td class="price">{{displayPrice}}</td>
                                                <td class="fees">{{displayFees}}</td>
                                                <td class="investment-count" style="display:none">{{count}}</td>
                                                <td class="investment-add" style="display:none">
                                                    <button type="button" class="btn btn-primary investment-add-button">추가</button>
                                                </td>
                                            </tr>
                                            {{/each}}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {{/if}}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark player-amount" disabled>{{player.getDisplayAmount}}</button>
                        <button type="button" id="buyButton" class="btn btn-primary"></button>
                        <button type="button" id="payButton" class="btn btn-primary">구입한다</button>
                        <button type="button" id="cancelButton" class="btn btn-warning">안산다</button>
                        <button type="button" id="notPayButton" class="btn btn-warning">안산다</button>
                        <button type="button" id="resetButton" class="btn btn-success">원래데로</button>
                        <button type="button" id="payFeeButton" class="btn btn-primary"></button>
                        <button type="button" id="useTicketButton" class="btn btn-success">우대권사용</button>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}