function Ready() {
    this.$element = null;
    
    this.init = function () {
        var template = Handlebars.compile(this.template());
        this.$element = $(template({
            playerList: config.playerList
        }));

        this.reset();
        this.initEvent();
        this.$element.showModal().removeModalWhenClose();

        var that = this;
        setTimeout(function () {
            that.$element.find('.player-name').eq(0).focus();
        }, 1000);
    };
    
    this.initEvent = function () {
        var that = this;
        this.$element.on('click', '.up-button', function () {
            var index = that.$element.find('.up-button').index($(this));

            if (index === 0) {
                return;
            }

            var $row = $(this).closest('.row');
            $row.insertBefore($row.parent('').find('.row').eq(index - 1));
            reset();
        });

        this.$element.on('click', '.down-button', function () {
            var index = that.$element.find('.down-button').index($(this));

            if (index === config.playerList.length - 1) {
                return;
            }

            var $row = $(this).closest('.row');
            $row.insertAfter($row.parent('').find('.row').eq(index - 1));
            reset();

        });

        this.$element.on('click', '.start-button', function () {
            var $row = that.$element.find('.player-row');

            for (var i = 0; i < $row.length; i++) {
                var $currentPlayer = $row.eq(i);
                var $playerName = $currentPlayer.find('.player-name');

                if ($playerName.val().trim() === '') {
                    alert('이름을 입력하세요.');
                    $playerName.focus();
                    return;
                }

                config.playerList[i].image = $currentPlayer.find('.player-image').attr('data-image');
                config.playerList[i].name = $currentPlayer.find('.player-name').val().trim();
            }

            var randomPlace = this.$element.find('.random-place').is(':checked');

            if (randomPlace) {
                Building.random();

            }

            board.start(this.$element.find('.minute-timer').val());
            that.$element.hideModal();
        });  
    };
    
    this.reset = function () {
        this.$element.find('.row').each(function (index) {
            $(this).find('.player-index').text(index + 1);
        });
    };
    
    this.template = function () {
        return `
            <div class="modal start-modal" data-keyboard="false" data-backdrop="static">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="container-fluid player-list">
                                {{#each playList}}
                                <div class="row player-row">
                                    <div class="col-md-1 m-auto text-center">
                                        <span class="player-index"></span>
                                    </div>
                                    <div class="col-md-2 m-auto text-center">
                                        <img src="{{getImageUrl}}" data-image="{{image}}" class="player-image" width="50px" height="50px">
                                    </div>
                                    <div class="col-md-4 m-auto text-center">
                                        <input type="text" class="form-control player-name" placeholder="이름">
                                    </div>
                                    <div class="col-md-5 m-auto text-center">
                                        <button type="button" class="btn btn-info up-button">위로</button>
                                        <button type="button" class="btn btn-info down-button">아래로</button>
                                    </div>
                                </div>
                                {{/each}}
                            </div>
                            <hr>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-4 m-auto">
                                        장소 랜덤 생성
                                    </div>
                                    <div class="col-md-8 form-inline">
                                        <input type="checkbox" class="random-place">
                                    </div>
                                </div>
                            </div>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-4 m-auto">
                                        제한시간
                                    </div>
                                    <div class="col-md-8 form-inline">
                                        <input type="text" class="form-control minute-timer" value="60" style="width:50px">
                                        &nbsp;분
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary start-button">시작</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    this.init();
}