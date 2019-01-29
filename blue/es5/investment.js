function Investment() {
    this.$element = null;
    this.player = null;
    this.block = null;
    var that = this;

    /** @type Block **/
    this.show = function (block) {
        this.block = block;
        this.initNewBuilding(block);

        /** @type Player **/
        this.player = board.getCurrentPlayer();

        if (this.block.player === this.player) {
            if (block.hasNotBuilding()) {
                return false;
            }
        }

        this.createElement();
        this.initEvent();

        return true;
    };

    this.initEvent = function () {
        setTimeout(function () {
            that.showModal();
            that.initButton();
            that.initBuyButton();
            that.initCancelButton();
            that.initNotPayButton();
            that.initPayButton();
            that.initUserTicketButton();
            that.initInvestmentAddButton();
        }, this.getTimeout());
    };

    this.createElement = function () {
        var template = Handlebars.compile(this.template());

        this.$element = $(template({
            block: that.block,
            player: that.player
        }));
    };

    this.getTimeout = function () {
        if ($('.toast-modal').length > 0) {
            return 1000;
        }

        return 0;
    };

    this.initButton = function () {
        if (this.block.player === null) {
            this.getCancelButton().show();

            if (this.player.amount >= this.block.amount) {
                this.getBuyButton().text(util.getPayMessage(this.block.amount));
                this.getBuyButton().show();
            }
        } else if (this.block.player == this.player) {
            this.showInvestmentCount();
            this.$element.find('.investment-add').show();
            this.getNotPayButton().show();
            this.getPayButton().show();
            this.getResetButton().show();
        } else {
            this.showInvestmentCount();
            var totalFee = that.block.getTotalFees();
            this.getPayButton()
                .html(util.toDisplayAmount(totalFee) + '을 지불합니다.')
                .show();

            if (this.player.ticketCount > 0) {
                this.getUseTicketButton().show();
            }
        }
    };

    this.initBuyButton = function () {
        this.getBuyButton().on('click', function () {
            that.block.player = that.player;
            that.player.amount -= that.block.amount;
            that.block.update();
            board.updatePlayInfo(that.player);
            that.player.readyNextTurn(that);
        });
    };

    this.initCancelButton = function () {
        that.getCancelButton().on('click', function () {
            that.player.readyNextTurn(that);
        });
    };

    this.initNotPayButton = function () {
        that.getNotPayButton().on('click', function () {
            that.player.readyNextTurn(that);
        });
    };

    this.initResetButton = function () {
        this.getResetButton().on('click', function () {
            for (var i = 0; i < that.block.newBuildingCountList.length; i++) {
                var $investmentCount = $('.investment-count').eq(i + 1);
                var count = that.block.newBuildingCountList[i];
                $investmentCount.text(parseInt($investmentCount.text()) - count);
            }

            that.player.initNewBuilding(that.block);
        });
    };

    this.initPayButton = function () {
        this.getPayButton().on('click', function () {
            for (var i = 0; i < that.block.buildingList.length; i++) {
                var building = that.block.buildingList[i];
                building.count += that.block.newBuildingCountList[i];
            }

            that.block.player.amount -= that.block.investmentAmount;
            board.updatePlayInfo(that.block.player);
            that.player.readyNextTurn(that);
            that.block.building.update();
        });
    };

    this.initUserTicketButton = function () {
        this.getUseTicketButton().on('click', function () {
            that.hideModal();
            player.ticketCount--;
            var message = '우대권을 사용하였습니다.';
            board.updatePlayInfo(player);
            new Toast().showAndReadyToNextTurn(message);
        });
    };

    this.initInvestmentAddButton = function () {
        this.getInvestmentAddButton().on('click', function () {
            var buildingIndex = that.getInvestmentAddButton().index($(this));
            var displayPrice = block.buildingList[buildingIndex].displayPrice;
            var price = util.toAmount(displayPrice);

            if (block.investmentAmount + price > player.amount) {
                alert('더 이상 구입할 수 없습니다.');
                return;
            }

            that.block.buildingIndex = buildingIndex;
            that.block.investmentAmount += price;
            that.block.newBuildingCountList[block.buildingIndex] += 1;

            var $parent = $(this).closest('tr');
            var $count = $parent.find('.investment-count');
            var currentCount = $count.text() || '0';
            $count.text(parseInt(currentCount, 10) + 1);

            that.getPayButton()
                .text(util.getPayMessage(block.investmentAmount))
                .show();
        });
    };

    this.initNewBuilding = function (block) {
        block.newBuildingCountList = [0, 0, 0];
        block.investmentAmount = 0;
        this.getPayButton().hide();
    };

    this.getInvestmentAddButton = function () {
        return $('.investment-add-button');
    };

    this.getUseTicketButton = function () {
        return $('#useTicketButton');
    };

    this.getPayFeeButton = function () {
        return $('#payFeeButton');
    };

    this.getResetButton = function () {
        return $('#resetButton');
    };

    this.getNotPayButton = function () {
        return $('#notPayButton');
    };

    this.getCancelButton = function () {
        return $('#cancelButton');
    };

    this.getBuyButton = function () {
        return $('#buyButton');
    };

    this.getPayButton = function () {
        return $('#payButton');
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
                        <button type="button" id="buyButton" class="btn btn-primary" style="display: none"></button>
                        <button type="button" id="payButton" class="btn btn-primary" style="display: none">구입한다</button>
                        <button type="button" id="cancelButton" class="btn btn-warning" style="display: none">안산다</button>
                        <button type="button" id="notPayButton" class="btn btn-warning" style="display: none">안산다</button>
                        <button type="button" id="resetButton" class="btn btn-success" style="display: none">원래데로</button>
                        <button type="button" id="payFeeButton" class="btn btn-primary" style="display: none"></button>
                        <button type="button" id="useTicketButton" class="btn btn-success" style="display: none">우대권사용</button>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}