function GoldenKey() {
    this.$ui = null;
    this.goldenKey = null;

    this.show = function (goldenKey) {
        this.goldenKey = goldenKey;
        var template = $('#goldenKeyTemplate').html();

        this.$ui = $(template);
        this.$ui.find('.modal-title').html(goldenKey.name);
        this.$ui.find('.modal-body').html(goldenKey.description);
        board.append(this.$ui);

        this.initEvent();
        this.showModal();
    };

    this.initEvent = function () {
        var self = this;
        this.$ui.find('.run-golden-key-button').on('click', function () {
            if (self.goldenKey.run()) {
                board.readyNextTurn();
            }

            board.goldenKeyIndex++;
            self.hideModal();
        });
    };

    this.getModal = function () {
        return util.getModal('.golden-key-modal');
    };

    this.showModal = function () {
        this.getModal().showModal();
    };

    this.hideModal = function () {
        this.getModal().hideModal();
    };
}