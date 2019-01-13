START = '출발';
FUNDING = '사회복지기금';
FUNDING_PLACE = '사회복지기금접수처';
SPACE_TRAVEL = '우주여행';
COLUMBIA = '컬럼비아호';
TAIPEI = '타이베이';
CONCORDE = '콩코드여객기';
SEOUL = '서울';
BUSAN = '부산';
JEJU = '제주';
WORLD_TOUR = '세계일주 초대권';
TICKET = '우대권';
SELL_HALF_PRICE = '반액대매출';

var config = {
    blockSize: 40,
    selectedColor: 'rgba(0, 123, 255, 0.5)',
    fundAmount: 150000,
    start: START,
    fundingName: FUNDING,
    fundingPlace: FUNDING_PLACE,
    spaceTravel: SPACE_TRAVEL,
    columbia: COLUMBIA,
    island: '무인도',
    goldenKey: 'goldenKey',
    block : {
        width: 160,
        height: 80
    },
    defaultOwnerImageUrl: '../image/empty.png',
    playerList: [
        {
            left: 15,
            top: 10,
            width: 50,
            height: 50,
            image: 'apeach.png',
            amount: 3000000,
            name: '어피치'

        },
        {
            left: 90,
            top: 10,
            width: 50,
            height: 50,
            image: 'lion.png',
            amount: 3000000,
            name: '라이언'
        }
    ],
    flag: {
        left: 0,
        top: 0,
        width: 60,
        height: 30
    },
    amount: {
        left: 60,
        top: 0,
        width: 70,
        height: 30
    },
    owner: {
        left: 130,
        top: 0,
        width: 30,
        height: 30
    },
    name: {
        left: 0,
        top: 30,
        width: 160,
        height: 20
    },
    building: {
        left: 0,
        top: 50,
        width: 160,
        height: 30
    },
    key: {
        top: 5,
        width: 60,
        height: 60
    },
    playerInfo: {
        left: 10,
        top: 10,
        width: 300,
        height: 700
    },
    die: {
        width: 700,
        height: 700,
        margin: 10
    },
    blockList: [
        {
            type: 'special',
            code: 'start',
            name: START
        },
        {
            code: 'tw',
            name: TAIPEI,
            displayAmount: '5만원',
            displayFees: '2천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '25만원',
                    displayFees: '25만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '15만원',
                    displayFees: '9만원'
                },
                {
                    name: '별장',
                    displayPrice: '5만원',
                    displayFees: '3만원'
                }
            ]
        },
        {
            type: 'goldenKey'
        },
        {
            code: 'cn',
            name: '베이징',
            displayAmount: '8만원',
            displayFees: '4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '25만원',
                    displayFees: '45만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '15만원',
                    displayFees: '18만원'
                },
                {
                    name: '별장',
                    displayPrice: '5만원',
                    displayFees: '6만원'
                }
            ]
        },
        {
            code: 'ph',
            name: '마닐라',
            displayAmount: '8만원',
            displayFees: '4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '25만원',
                    displayFees: '45만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '15만원',
                    displayFees: '18만원'
                },
                {
                    name: '별장',
                    displayPrice: '5만원',
                    displayFees: '6만원'
                }
            ]
        },
        {
            code: 'kr',
            name: JEJU,
            displayAmount: '20만원',
            displayFees: '30만원',
            buildingList: []
        },
        {
            code: 'sg',
            name: '싱가포르',
            displayAmount: '10만원',
            displayFees: '6천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '25만원',
                    displayFees: '55만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '15만원',
                    displayFees: '27만원'
                },
                {
                    name: '별장',
                    displayPrice: '5만원',
                    displayFees: '9만원'
                }
            ]
        },
        {
            type: 'goldenKey'
        },
        {
            code: 'eg',
            name: '카이로',
            displayAmount: '10만원',
            displayFees: '6천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '25만원',
                    displayFees: '55만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '15만원',
                    displayFees: '27만원'
                },
                {
                    name: '별장',
                    displayPrice: '5만원',
                    displayFees: '9만원'
                }
            ]
        },
        {
            code: 'tr',
            name: '이스탄불',
            displayAmount: '12만원',
            displayFees: '8천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '25만원',
                    displayFees: '60만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '15만원',
                    displayFees: '30만원'
                },
                {
                    name: '별장',
                    displayPrice: '5만원',
                    displayFees: '10만원'
                }
            ]
        },
        {
            type: 'special',
            code: 'is',
            name: '무인도'
        },
        {
            code: 'gr',
            name: '아테네',
            displayAmount: '14만원',
            displayFees: '1만원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    displayFees: '75만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '30만원',
                    displayFees: '45만원'
                },
                {
                    name: '별장',
                    displayPrice: '10만원',
                    displayFees: '15만원'
                }
            ]
        },
        {
            type: 'goldenKey'
        },
        {
            code: 'dk',
            name: '코펜하겐',
            displayAmount: '16만원',
            displayFees: '1만 2천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    displayFees: '90만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '30만원',
                    displayFees: '50만원'
                },
                {
                    name: '별장',
                    displayPrice: '10만원',
                    displayFees: '18만원'
                }
            ]
        },
        {
            code: 'se',
            name: '스톡홀름',
            displayAmount: '16만원',
            displayFees: '1만 2천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    displayFees: '90만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '30만원',
                    displayFees: '50만원'
                },
                {
                    name: '별장',
                    displayPrice: '10만원',
                    displayFees: '18만원'
                }
            ]
        },
        {
            code: 'cc',
            name: CONCORDE,
            displayAmount: '20만원',
            displayFees: '30만원'
        },
        {
            code: 'ch',
            name: '베른',
            displayAmount: '18만원',
            displayFees: '1만 4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    displayFees: '95만원',
                },
                {
                    name: '빌딩',
                    displayPrice: '30만원',
                    displayFees: '55만원'
                },
                {
                    name: '별장',
                    displayPrice: '10만원',
                    displayFees: '20만원'
                }
            ]
        },
        {
            type: 'goldenKey'
        },
        {
            code: 'de',
            name: '베를린',
            displayAmount: '18만원',
            displayFees: '1만 4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    displayFees: '95만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '30만원',
                    displayFees: '55만원'
                },
                {
                    name: '별장',
                    displayPrice: '10만원',
                    displayFees: '20만원'
                }
            ]
        },
        {
            code: 'ca',
            name: '오타와',
            displayAmount: '20만원',
            displayFees: '1만 6천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    displayFees: '100만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '30만원',
                    displayFees: '60만원'
                },
                {
                    name: '별장',
                    displayPrice: '10만원',
                    displayFees: '22만원'
                }
            ]
        },
        {
            code: 'we',
            name: FUNDING_PLACE,
            displayAmount: '0원'
        },
        {
            code: 'ar',
            name: '부에노스아이레스',
            displayAmount: '22만원',
            displayFees: '1만 8천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '50만원',
                    displayFees: '105만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    displayFees: '70만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    displayFees: '25만원'
                }
            ]
        },
        {
            type: 'goldenKey'
        },
        {
            code: 'br',
            name: '상파울루',
            displayAmount: '24만원',
            displayFees: '2만원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    displayFees: '110만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    displayFees: '75만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    displayFees: '30만원'
                }
            ]
        },
        {
            code: 'au',
            name: '시드니',
            displayAmount: '24만원',
            displayFees: '2만원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    displayFees: '110만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    displayFees: '75만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    displayFees: '30만원'
                }
            ]
        },
        {
            code: 'kr',
            name: BUSAN,
            displayAmount: '50만원',
            displayFees: '60만원'
        },
        {
            code: 'us',
            name: '하와이',
            displayAmount: '26만원',
            displayFees: '2만 2천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    displayFees: '115만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    displayFees: '80만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    displayFees: '33만원'
                }
            ]
        },
        {
            code: 'pt',
            name: '리스본',
            displayAmount: '26만원',
            displayFees: '2만 2천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    displayFees: '115만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    displayFees: '80만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    displayFees: '33만원'
                }
            ]
        },
        {
            code: 'qu',
            name: '퀸 엘리자베스호',
            displayAmount: '30만원',
            displayFees: '25만원'
        },
        {
            code: 'es',
            name: '마드리드',
            displayAmount: '28만원',
            displayFees: '2만 4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '75만원',
                    displayFees: '120만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '45만원',
                    displayFees: '85만원'
                },
                {
                    name: '별장',
                    displayPrice: '15만원',
                    displayFees: '36만원'
                }
            ]
        },
        {
            code: 'st',
            type: 'special',
            name: SPACE_TRAVEL,
            displayTravelFees: '20만원'
        },
        {
            code: 'jp',
            name: '도쿄',
            displayAmount: '30만원',
            displayFees: '2만 4천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    displayFees: '127만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    displayFees: '90만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    displayFees: '39만원'
                }
            ]
        },
        {
            code: 'co',
            name: COLUMBIA,
            displayAmount: '45만원',
            displayFees: '40만원'
        },
        {
            code: 'fr',
            name: '파리',
            displayAmount: '32만원',
            displayFees: '2만 8천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    displayFees: '140만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    displayFees: '100만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    displayFees: '45만원'
                }
            ]
        },
        {
            code: 'it',
            name: '로마',
            displayAmount: '32만원',
            displayFees: '2만 8천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    displayFees: '140만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    displayFees: '100만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    displayFees: '45만원'
                }
            ]
        },
        {
            type: 'goldenKey'
        },
        {
            code: 'gb',
            name: '런던',
            displayAmount: '35만원',
            displayFees: '3만 5천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    displayFees: '150만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    displayFees: '110만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    displayFees: '50만원'
                }
            ]
        },
        {
            code: 'us',
            name: '뉴욕',
            displayAmount: '35만원',
            displayFees: '3만 5천원',
            buildingList: [
                {
                    name: '호텔',
                    displayPrice: '100만원',
                    displayFees: '150만원'
                },
                {
                    name: '빌딩',
                    displayPrice: '60만원',
                    displayFees: '110만원'
                },
                {
                    name: '별장',
                    displayPrice: '20만원',
                    displayFees: '50만원'
                }
            ]
        },
        {
            type: 'special',
            code: 'we',
            name: FUNDING
        },
        {
            code: 'kr',
            name: SEOUL,
            displayAmount: '100만원',
            displayFees: '200만원'
        }
    ],
    goldenKeyList: [
        {
            name: '항공여행',
            description: function () {
                var itemList = [];
                itemList.push(CONCORDE + '를 타고 ' + TAIPEI + '로 가세요.');
                itemList.push(CONCORDE + ' 소유주에게 탑승료를 지불합니다.');
                itemList.push('출발지를 경유하면 월급을 받으세요');
                return util.getDescriptionWithImageHtml(itemList, CONCORDE);
            },
            run: function () {
                var currentPlayer = board.getCurrentPlayer();
                currentPlayer.goFastToBlockAsWayPoint(CONCORDE, TAIPEI);
            }
        },
        {
            name: '우주여행 초청장',
            description: function () {
                var itemList = [];
                itemList.push('우주항공국에서 우주여행 초청장이 왔습니다');
                itemList.push('무료이므로 콜롬비호아호 소유주에게 탑승료를 지불하지 않아도 됩니다');
                itemList.push('출발지를 경유하면 월급을 받으세요');
                return util.getDescriptionWithImageHtml(itemList, SPACE_TRAVEL);
            },
            run: function () {
                var currentPlayer = board.getCurrentPlayer();
                currentPlayer.freeSpaceTravel = true;
                currentPlayer.goFastToBlock(SPACE_TRAVEL);
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
                board.getCurrentPlayer().goFastToBlock(START);
            }
        },
        {
            name: TICKET,
            description: '상대방이 소유한 장소에 비용없이 머무룰 수 있습니다.',
            run: function () {
                board.getCurrentPlayer().addTicket();
            }
        },
        {
            name: '유람선 여행',
            description: '퀸 엘리자베스호를 타고 베이징으로 가세요.<br>퀸 엘리자베스호 소유주에게 탑승료를 지불합니다.',
            run: function () {
                var currentPlayer = board.getCurrentPlayer();
                currentPlayer.goFastToBlockAsWayPoint('퀸 엘리자베스호', '베이징');
            }
        },
        {
            name: '무인도',
            description: '폭풍우를 만났습니다.<br>무인도로 가세요.<br>출발점을 지나더라도 월급을 받을 수 없습니다.',
            run: function () {
                board.getCurrentPlayer().goFastToBlock('무인도', false);
            }
        },
        {
            name: '관광여행',
            description: SEOUL + '로 관광여행을 갑니다.',
            run: function () {
                board.getCurrentPlayer().goFastToBlock(SEOUL);
            }
        },
        {
            name: '관광여행',
            description: JEJU + '로 관광여행을 갑니다.',
            run: function () {
                board.getCurrentPlayer().goFastToBlock(JEJU);
            }
        },
        {
            name: '관광여행',
            description: BUSAN + '로 관광여행을 갑니다.',
            run: function () {
                board.getCurrentPlayer().goFastToBlock(BUSAN);
            }
        },
        {
            name: SELL_HALF_PRICE,
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
                    var sum = 0;
                    sum += block.amount;

                    for (var j = 0; j < block.buildingList.length; j++) {
                        var building = block.buildingList[j];
                        sum += building.price * building.count;
                    }

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
                }

                currentPlayer.readyNextTurn();
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
            name: WORLD_TOUR,
            description: '현재 위치에서 한바퀴 됩니다.<br>월급도 받고 사회복지기금접수처의 기금도 받습니다.',
            run: function () {
                board.getCurrentPlayer().goFast(40);

                /** @type Block **/
                var fundingPlace = board.getFundingPlace();
                fundingPlace.resetFunding();
            }
        },
        {
            name: '정기종합 소득세',
            description: '종합소득세를 각 건물별로 아래와 같이 지불하세요.<br>호텔: 15만원<br>빌딩: 10만원<br>별장: 3만원',
            run: function () {
                board.getCurrentPlayer().payForBuilding([150000, 100000, 30000], '종합소득세');
            }
        },
        {
            name: '방범비',
            description: '방범비를 각 건물별로 아래와 같이 지불하세요.<br>호텔: 5만원<br>빌딩: 3만원<br>별장: 1만원',
            run: function () {
                board.getCurrentPlayer().payForBuilding([50000, 30000, 10000], '방범비');
            }
        },
        {
            name: '건물수리',
            description: '건물수리비를 각 건물별로 아래와 같이 지불하세요.<br>호텔: 10만원<br>빌딩: 6만원<br>별장: 3만원',
            run: function () {
                board.getCurrentPlayer().payForBuilding([100000, 60000, 30000], '건물수리비');
            }
        },
        // {
        //     name: '무인도 탈출권',
        //     description: '무인도에서 탈출할 수 있습니다.<br>20만원에 팔 수 있습니다.',
        //     run: function () {
        //         board.getCurrentPlayer().addEscapeTicket();
        //     }
        // },
        {
            name: '노벨평화상 수상',
            description: '수상금 30만원을 은행에서 받습니다.',
            run: function () {
                board.getCurrentPlayer().incomeWithTitle(300000, '수상금');
            }
        },
        {
            name: '장학금 혜택',
            description: '장학금 30만원을 은행에서 받습니다.',
            run: function () {
                board.getCurrentPlayer().incomeWithTitle(100000, '장학금');
            }
        },
        {
            name: '복권당첨',
            description: '당첨금 20만원을 은행에서 받습니다.',
            run: function () {
                board.getCurrentPlayer().incomeWithTitle(200000, '당첨금');
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
    ],
    calculateFee: function (amount, title) {
        var sum = 0;

        board.getBlockList()
            .forEach(function (block) {
                for (var i = 0; i < block.buildingList.length; i++) {
                    sum += block.buildingList[i].count * amount[i];
                }
            });

        var message = title + '로 ' + util.toDisplayAmount(sum) + '을 납부하였습니다.';
        board.getCurrentPlayer().pay(sum, message);
    }
};

for (var i = 0; i < config.blockList.length; i++) {
    var block = config.blockList[i];

    if (block.displayAmount) {
        block.amount = util.toAmount(block.displayAmount);
    }

    if (block.displayFees) {
        block.fees = util.toAmount(block.displayFees);
    }

    var buildingList = block.buildingList;

    if (buildingList) {
        for (var j = 0; j < buildingList.length; j++) {
            var building = buildingList[j];

            if (building.displayAmount) {
                building.amount = util.toAmount(building.displayAmount);
            }

            if (building.displayFees) {
                building.fees = util.toAmount(building.displayFees);
            }

            building.count = 0;
        }
    }
}

function shuffle(array) {
    var counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        var index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        var temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function iterationCopy(src) {
    var target = {};

    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            target[prop] = src[prop];
        }
    }

    return target;
}

var goldenKeyLength = config.goldenKeyList.length;

for (var i = 0; i < goldenKeyLength; i++) {
    var goldenKey = config.goldenKeyList[i];

    if (goldenKey.name == WORLD_TOUR ||
        goldenKey.name == TICKET ||
        goldenKey.name == SELL_HALF_PRICE) {
        var newGoldenKey = iterationCopy(goldenKey);
        config.goldenKeyList.push(newGoldenKey);
    }
}

function resetGoldenKey() {
    shuffle(config.goldenKeyList);
}

resetGoldenKey();