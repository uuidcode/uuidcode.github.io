function Toast() {
    this.$element = null;

    this.showAndReadyToNextTurn = function (message) {
        this.show(message, function () {
            board.getCurrentPlayer().readyNextTurn();
        });
    };

    this.showPickPlace = function (callback) {
        var blockHtml = board.getBlockHtml(config.spaceTravel);
        var message = `우주여행을 합니다.<br>가고 싶은 곳을 클릭하세요.<hr>${blockHtml}`;
        this.show(message, callback);
    };

    this.show = function (message, callback) {
        var that = this;
        var template = Handlebars.compile(this.template());

        this.$element = template({
            player: board.getCurrentPlayer(),
            message: message
        });

        board.append(this.$element);

        this.showModal();

        setTimeout(function () {
            that.hideModal();

            if (callback) {
                callback();
            }
        }, 1000);
    };

    this.getModal = function () {
        return util.getModal('.toast-modal');
    };

    this.showModal = function () {
        this.getModal().showModal();
    };

    this.hideModal = function () {
        this.getModal().hideModal();
    };

    this.template = function () {
        return `
        <div class="modal toast-modal" data-keyboard="false" data-backdrop="static">
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
                                <div class="col-md-12 toast-message text-center">{{{message}}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}