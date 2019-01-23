function Win(player) {
    /** @type Player **/
    this.init = function (player) {
        var template = Handlebars.compile(this.template());
        var $winModal = $(template({
            player: player
        }));

        $winModal.showModal().removeModalWhenClose();
        confetti.start();
        board.playWinSound();

        $winModal.find('.win-button').on('click', function () {
            location.reload();
        });
    };

    this.template = function () {
        return `
            <div class="modal start-modal" data-keyboard="false" data-backdrop="static">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">축하합니다.</h4>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-3 m-auto text-center">
                                        <img src="{{player.getImageUrl}}" class="player-image" width="50px" height="50px">
                                    </div>
                                    <div class="col-md-9 m-auto text-center">
                                        <span class="player-name">{{player.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary win-button">확인</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    this.init(player);
}