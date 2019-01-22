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
    seoul: SEOUL,
    busan: BUSAN,
    jeju: JEJU,
    beijing: BEIJING,
    taipei: TAIPEI,
    fundingPlace: FUNDING_PLACE,
    spaceTravel: SPACE_TRAVEL,
    queenElizabeth: QUEEN_ELIZABETH,
    worldTour: WORLD_TOUR,
    sellHalfPrice: SELL_HALF_PRICE,
    ticket: TICKET,
    columbia: COLUMBIA,
    concorde: CONCORDE,
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

for (var i = 0; i < Building.list.length; i++) {
    var block = Building.list[i];

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