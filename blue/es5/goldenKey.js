function GoldenKey() {
    this.$element = null;
    this.goldenKey = null;

    this.show = function (goldenKey) {
        this.goldenKey = goldenKey;
        var template = Handlebars.compile(this.template());
        var description = null;

        if ($.isFunction(this.goldenKey.description)) {
            description = this.goldenKey.description();
        } else {
            description = this.goldenKey.description;
        }

        this.$element = $(template({
            goldenKey: goldenKey,
            description: description
        }));

        this.initEvent();
        this.showModal();
    };

    this.initEvent = function () {
        var that = this;
        this.$element.find('.run-golden-key-button').on('click', function () {
            that.hideModal();
            that.goldenKey.run();
            board.goldenKeyIndex++;

            if (board.goldenKeyIndex >= config.goldenKey.length) {
                board.goldenKeyIndex = 0;
                GoldenKey.resetGoldenKey();
            }
        });
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
            <div class="modal show golden-key-modal" data-keyboard="false" data-backdrop="static">
                <div class="modal-dialog shadow" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{goldenKey.name}}</h5>
                        </div>
                        <div class="modal-body">{{{description}}}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary run-golden-key-button">확인</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };
}

GoldenKey.createBuildingCost = function (name, priceList) {
    var html = `
            <div class="container-fluid">
                <div class="row" style="margin-top: 20px">
                    <div class="col-md-6 m-auto">
                        <table class="table table-bordered">
                            <tbody>
                            <tr>
                                <td>호텔</td>
                                <td>{{list.[0]}}</td>
                            </tr>
                            <tr>
                                <td>빌딩</td>
                                <td>{{list.[1]}}</td>
                            </tr>
                            <tr>
                                <td>별장</td>
                                <td>{{list.[2]}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

    return {
        name: name,
        description: function () {
            var template = Handlebars.compile(html);
            var result = template({
                list: priceList
            });
            return `${name}를 각 건물별로 아래와 같이 지불하세요.${result}`;
        },
        run: function () {
            board.getCurrentPlayer().payForBuilding(priceList, name);
        }
    }
};

GoldenKey.income = function (name, amount, amountName) {

};

GoldenKey.list = [
    {
        name: '복권당첨',
        amount: '20만원',
        amountName: '당첨금',
        description: function () {
            return `${this.amountName} ${this.amount}을 은행에서 받습니다.`
        },
        run: function () {
            board.getCurrentPlayer().incomeWithTitle(this.amount, this.amountName);
        }
    },
    {
        name: '무인도 탈출권',
        description: '무인도 탈출권을 획득하였습니다.',
        run: function () {
            board.getCurrentPlayer().addEscapeTicket();
        }
    },
    {
        name: config.ticket,
        description: '상대방이 소유한 장소에 비용없이 머무룰 수 있습니다.',
        run: function () {
            board.getCurrentPlayer().addTicket();
        }
    },
    {
        name: '무인도',
        description: '폭풍우를 만났습니다.<br>무인도로 가세요.<br>출발점을 지나더라도 월급을 받을 수 없습니다.',
        run: function () {
            board.getCurrentPlayer().goFastToBlock('무인도', false);
        }
    },
    GoldenKey.createBuildingCost('방범비', ['5만원', '3만원', '1만원']),
    GoldenKey.createBuildingCost('정기종합 소득세', ['15만원', '10만원', '3만원']),
    GoldenKey.createBuildingCost('건물수리', ['10만원', '6만원', '3만원']),
    {
        name: config.sellHalfPrice,
        description: '당신의 부동산중에서 가장 비싼 곳을 반액으로 은행에 파세요.',
        run: function () {
            /** @type Player **/
            var currentPlayer = board.getCurrentPlayer();
            var blockList = currentPlayer.getBlockList();
            /** @type Block **/
            var maxAmountBlock = null;
            var maxAmount = 0;

            for (var i = 0; i < blockList.length; i++) {
                var block = blockList[i];
                var sum = block.getTotalAmount();

                if (maxAmount < sum) {
                    maxAmountBlock = block;
                    maxAmount = sum;
                }
            }

            if (maxAmountBlock != null) {
                maxAmountBlock.reset();
                var amount = maxAmount / 2;
                var message = maxAmountBlock.name + '을/를' + util.toDisplayAmount(amount) + '에 팔았습니다.';
                board.getCurrentPlayer().income(amount, message);
                return;
            }

            new Toast().showAndReadyToNextTurn('소유하고 있는 부동산이 없습니다.');
        }
    },
    {
        name: '유람선 여행',
        description: function () {
            var itemList = [];
            itemList.push(config.queenElizabeth + '를 타고 ' + config.beijing + '로 가세요.');
            itemList.push(config.queenElizabeth + ' 소유주에게 탑승료를 지불합니다.');
            itemList.push('출발지를 경유하면 월급을 받으세요');
            return util.getDescriptionAndFromToHtml(itemList, config.queenElizabeth, config.beijing);
        },
        run: function () {
            var currentPlayer = board.getCurrentPlayer();
            currentPlayer.goFastToBlockAsWayPoint(config.queenElizabeth, config.beijing);
        }
    },
    {
        name: '항공여행',
        description: function () {
            var itemList = [];
            itemList.push(config.concorde + '를 타고 ' + config.taipei + '로 가세요.');
            itemList.push(config.concorde + ' 소유주에게 탑승료를 지불합니다.');
            itemList.push('출발지를 경유하면 월급을 받으세요');
            return util.getDescriptionAndFromToHtml(itemList, config.concorde, config.taipei);
        },
        run: function () {
            var currentPlayer = board.getCurrentPlayer();
            currentPlayer.goFastToBlockAsWayPoint(config.concorde, config.taipei);
        }
    },
    {
        name: '우주여행 초청장',
        description: function () {
            var itemList = [];
            itemList.push('우주항공국에서 우주여행 초청장이 왔습니다');
            itemList.push('무료이므로 콜롬비호아호 소유주에게 탑승료를 지불하지 않아도 됩니다');
            itemList.push('출발지를 경유하면 월급을 받으세요');
            return util.getDescriptionWithImageHtml(itemList, config.spaceTravel);
        },
        run: function () {
            var currentPlayer = board.getCurrentPlayer();
            currentPlayer.freeSpaceTravel = true;
            currentPlayer.goFastToBlock(config.spaceTravel);
        }
    },
    {
        name: '이사',
        description: '뒤로 3칸 가세요.',
        run: function () {
            board.getCurrentPlayer().back(3);
        }
    },
    {
        name: '이사',
        description: '뒤로 2칸 가세요.',
        run: function () {
            board.getCurrentPlayer().back(2);
        }
    },
    {
        name: '사회복지기금배당',
        description: '사회복지기금접수처로 가세요.',
        run: function () {
            board.getCurrentPlayer().goFastToBlock(config.fundingPlace);
        }
    },
    {
        name: '고속도로',
        description: '출발지까지 곧바로 가세요.',
        run: function () {
            board.getCurrentPlayer().goFastToBlock(config.start);
        }
    },
    {
        name: '관광여행',
        description: config.seoul + '로 관광여행을 갑니다.',
        run: function () {
            board.getCurrentPlayer().goFastToBlock(config.seoul);
        }
    },
    {
        name: '관광여행',
        description: config.jeju + '로 관광여행을 갑니다.',
        run: function () {
            board.getCurrentPlayer().goFastToBlock(config.jeju);
        }
    },
    {
        name: '관광여행',
        description: config.busan + '로 관광여행을 갑니다.',
        run: function () {
            board.getCurrentPlayer().goFastToBlock(config.busan);
        }
    },
    {
        name: '해외유학',
        description: '학교 등록금 10만원을 은행에 납부합니다.',
        run: function () {
            board.getCurrentPlayer().payWithTitle(100000, '등록금');
        }
    },
    {
        name: '건강진단',
        description: '병원에서 건강진단을 받았습니다.<br>은행에 5만원을 납부합니다.',
        run: function () {
            board.getCurrentPlayer().payWithTitle(50000, '건강진단금');
            return false;
        }
    },
    {
        name: config.worldTour,
        description: '현재 위치에서 한바퀴 됩니다.<br>월급도 받고 사회복지기금접수처의 기금도 받습니다.',
        run: function () {
            board.getCurrentPlayer().goFast(40);

            /** @type Block **/
            var fundingPlace = board.getFundingPlace();
            fundingPlace.resetFunding();
        }
    },
    {
        name: '노벨평화상 수상',
        description: '수상금 30만원을 은행에서 받습니다.',
        run: function () {
            board.getCurrentPlayer().incomeWithTitle(300000, '수상금');
        }
    },
    {
        name: '장학금 혜택',
        description: '장학금 10만원을 은행에서 받습니다.',
        run: function () {
            board.getCurrentPlayer().incomeWithTitle(100000, '장학금');
        }
    },
    {
        name: '과속운전 벌금',
        description: '벌금 5만원을 은행에 납부합니다.',
        run: function () {
            board.getCurrentPlayer().payWithTitle(50000, '벌금');
            return false;
        }
    },
    {
        name: '연금해택',
        description: '은행에서 노후연금 5만원을 받으세요.',
        run: function () {
            board.getCurrentPlayer().incomeWithTitle(50000, '노후연금');
        }
    },
    {
        name: '자동차대회 우승',
        description: '자동차대회에서 우승하였습니다.<br>상금 10만원을 받으세요.',
        run: function () {
            board.getCurrentPlayer().incomeWithTitle(100000, '우승상금');
        }
    }
];

var goldenKeyLength = GoldenKey.list.length;

for (var i = 0; i < goldenKeyLength; i++) {
    var goldenKey = GoldenKey.list[i];

    if (goldenKey.name === config.worldTour ||
        goldenKey.name === config.ticket ||
        goldenKey.name === config.sellHalfPrice) {
        var newGoldenKey = util.copy(goldenKey);
        GoldenKey.list.push(newGoldenKey);
    }
}

GoldenKey.resetGoldenKey = function() {
    // util.shuffle(GoldenKey.list);
};

GoldenKey.resetGoldenKey();