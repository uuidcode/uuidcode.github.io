function EscapeIsland() {
    this.$element = null;

    this.show = function () {
        var template = Handlebars.compile(this.template());

        this.$element = template({
            player: board.getCurrentPlayer()
        });

        board.append(this.$element);

        this.showModal();
        this.onClickUseButton();
        this.onClickCancelButton();
    };

    this.getModal = function () {
        return util.getModal('.escape-island-modal');
    };

    this.showModal = function () {
        this.getModal().showModal();
    };

    this.hideModal = function () {
        this.getModal().hideModal();
    };

    this.onClickUseButton = function () {
        this.getUseButton().setOnClick(function () {
            this.hideModal();
            /** @type Player **/
            var currentPlayer = board.getCurrentPlayer();
            currentPlayer.escapeFromIsland('무인도를 탈출합니다.<br>주사위를 던지세요.');
            board.updatePlayInfo(currentPlayer);
            board.activePlayer();
        }, this);
    };

    this.onClickCancelButton = function () {
        this.getCancelButton().setOnClick(function () {
            this.hideModal();
            board.showDieToast();
        }, this);
    };

    this.getUseButton = function () {
        return $('.use-escape-button');
    };

    this.getCancelButton = function () {
        return $('.cancel-button');
    };

    this.template = function () {
        return `
        <div class="modal escape-island-modal" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog shadow" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">{{player.name}}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-12 text-center">
                                    <img src="{{player.getImageUrl}}" class="player-image" width="80" height="80">
                                </div>
                            </div>
                            <div class="row">
                                <hr>
                                <div class="col-md-12 toast-message text-center">무인도 탈출권을 사용할까요?</div>
                            </div>
                        </div>
                    </div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-success use-escape-button">사용합니다.</button>
                        <button type="button" class="btn btn-warning cancel-button">사용하지 않는다.</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}