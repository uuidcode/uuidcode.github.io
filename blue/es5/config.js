START = '출발';
FUNDING = '사회복지기금';
FUNDING_PLACE = '사회복지기금접수처';
SPACE_TRAVEL = '우주여행';
COLUMBIA = '컬럼비아호';
TAIPEI = '타이베이';
BEIJING = '베이징';
QUEEN_ELIZABETH = '퀸 엘리자베스호';
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
    worldTour: WORLD_TOUR,
    sellHalfPrice: SELL_HALF_PRICE,
    ticket: TICKET,
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
        height: 650,
        margin: 10
    },
    timer: {
        width: 200,
        height: 50,
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
            name: BEIJING,
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
            name: QUEEN_ELIZABETH,
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