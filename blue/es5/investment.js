function Investment() {
    this.$ui = null;

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
        this.$ui = $(template({
            block: block
        }));
        board.append(this.$ui);

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

        return true;
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
                                    <table class="table">
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
                                    <table class="table" style="maring: 10px">
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
                                            {{#each build.buildingList}}
                                            <tr>
                                                <td class="name">{{name}}</td>
                                                <td class="price">{{displacePrice}}</td>
                                                <td class="fees">{{displaceFees}}</td>
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