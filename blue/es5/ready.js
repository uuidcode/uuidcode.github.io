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

    this.getPlayerLeftPosition = function (index) {
        var playerCount = config.playerList.length;
        var playerWidth = config.block.width / playerCount;
        var offset = playerWidth - 50;
        return playerWidth * index + offset / 2;
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
            that.reset();
        });

        this.$element.on('click', '.down-button', function () {
            var index = that.$element.find('.down-button').index($(this));

            if (index === config.playerList.length - 1) {
                return;
            }

            var $row = $(this).closest('.row');
            $row.insertAfter($row.parent('').find('.row').eq(index + 1));
            that.reset();
        });

        this.$element.on('click', '.remove-player-button', function () {
            var $row = $(this).closest('.row');
            $row.remove();
            var currentIndex = parseInt($row.find('.player-index').text(), 10) - 1;

            config.playerList = config.playerList.filter(function (currentValue, index, arr) {
                return currentIndex !== index;
            });

            that.reset();
        });

        this.$element.on('click', '.add-player-button', function () {
            var newPlayer = {
                left: 90,
                top: 10,
                width: 50,
                height: 50,
                image: 'muzi.png',
                amount: 3000000,
                name: '로봇'
            };

            config.playerList.push(newPlayer);
            var template = Handlebars.compile(that.playerTemplate());
            var $newPlayer = $(template(newPlayer));
            $('.player-list').append($newPlayer);

            that.reset();
        });


        this.$element.on('click', '.start-button', function () {
            var $row = that.$element.find('.player-row');
            var width = 50;
            var height = 50;

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
                config.playerList[i].width = width;
                config.playerList[i].height = height;
                config.playerList[i].top = 10;
                config.playerList[i].left = that.getPlayerLeftPosition(i);
            }

            var randomPlace = that.$element.find('.random-place').is(':checked');

            if (randomPlace) {
                Block.random();
            }

            board.start(that.$element.find('.minute-timer').val());
            that.$element.hideModal();
        });  
    };
    
    this.reset = function () {
        this.$element.find('.row').each(function (index) {
            $(this).find('.player-index').text(index + 1);
        });

        if (config.playerList.length > 2) {
            $('.remove-player-button').show();
            $('.add-player-button').hide();
        } else {
            $('.remove-player-button').hide();
            $('.add-player-button').show();
        }
    };

    this.playerTemplate = function () {
        return  `
        <div class="row player-row">
            <div class="col-md-1 m-auto text-center">
                <span class="player-index"></span>
            </div>
            <div class="col-md-2 m-auto text-center">
                <img src="../image/{{image}}" data-image="{{image}}"
                     class="player-image live" width="50px" height="50px">
            </div>
            <div class="col-md-4 m-auto text-center">
                <input type="text" class="form-control player-name" 
                    placeholder="이름"
                    value="{{name}}">
            </div>
            <div class="col-md-5 m-auto text-center">
                <button type="button" class="btn btn-info up-button">위로</button>
                <button type="button" class="btn btn-info down-button">아래로</button>
                <button type="button" class="btn btn-info remove-player-button" style="display: none">삭제</button>
            </div>
        </div>
        `
    },

    this.template = function () {
        var playerTemplate = this.playerTemplate();

        return `
            <div class="modal start-modal" data-keyboard="false" data-backdrop="static">
                <div class="modal-dialog" role="document" style="max-width:600px">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="container-fluid player-list">
                                {{#each playerList}}
                                ${playerTemplate}
                                {{/each}}
                            </div>
                            <hr>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-4 m-auto">
                                        장소 랜덤 생성
                                    </div>
                                    <div class="col-md-8 form-inline">
                                        <input type="checkbox" class="random-place" checked>
                                    </div>
                                </div>
                            </div>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-md-4 m-auto">
                                        제한시간
                                    </div>
                                    <div class="col-md-8 form-inline">
                                        <input type="text" class="form-control minute-timer" value="20" style="width:50px">
                                        &nbsp;분
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-success add-player-button">사용자추가</button>
                            <button type="button" class="btn btn-primary start-button">시작</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    this.init();
}