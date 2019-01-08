function Toast() {
    this.$ui = null;

    this.showAndReadyToNextTurn = function (message) {
        this.show(message, function () {
            board.getCurrentPlayer().readyNextTurn();
        })
    };

    this.show = function (message, callback) {
        var self = this;

        this.$ui = $($('#toastTemplate').html());
        board.append(this.$ui);

        this.setMessage(message);
        this.processPlayer();
        this.showModal();

        setTimeout(function () {
            self.hideModal();

            if (callback) {
                callback();
            }
        }, 1000);
    };

    this.setMessage = function (message) {
        this.$ui.find('.toast-message').html(message);
    };

    this.processPlayer = function () {
        var currentPlayer = board.getCurrentPlayer();
        currentPlayer.setPlayerImage(this.$ui);
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
}