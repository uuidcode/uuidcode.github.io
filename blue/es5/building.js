function Building(block) {
    this.block = block;
    this.$ui = null;

    this.init = function () {
        this.$ui = $($('#buildingTemplate').html());
        this.$ui.css({
            position: 'absolute',
            left: config.building.left,
            top: config.building.top,
            width: config.building.width,
            height: config.building.height,
            textAlign: 'center'
        });

        this.update();
    };

    /** @type Block **/
    this.update = function () {
        for (var i = 0; i < this.block.buildingList.length; i++) {
            var building = this.block.buildingList[i];
            this.$ui.find('.building-badge').eq(i).text(building.count);
        }

        var $totalFees = this.$ui.find('.total-fees');
        $totalFees.text('');

        if (this.block.player != null) {
            var totalFees = this.block.getTotalFees();

            if (totalFees > 0) {
                $totalFees.text(util.toDisplayAmount(totalFees));
            }
        }
    };

    this.getName = function (index) {
        util.getBuildName(index);
    };

    this.init();
}

Block.list = [
    {
        type: 'special',
        code: 'start',
        name: config.start
    },
    {
        code: 'tw',
        name: config.taipei,
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
        name: config.beijing,
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
        name: config.jeju,
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
        name: config.concorde,
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
        name: config.fundingPlace,
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
        name: config.busan,
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
        name: config.queenElizabeth,
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
        name: config.spaceTravel,
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
        name: config.columbia,
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
        name: config.fundingName
    },
    {
        code: 'kr',
        name: config.seoul,
        displayAmount: '100만원',
        displayFees: '200만원'
    }
];

Building.random = function () {
    util.shuffle(Building.list);

    var startIndex = 0;

    for (var i = 0; i < Building.list.length; i++) {
        if (Building.list[i].name === config.start) {
            startIndex = i;
            break;
        }
    }

    if (startIndex !== 0) {
        var startBlock = Building.list[startIndex];
        var tempBlock = Building.list[0];
        Building.list[0] = startBlock;
        Building.list[startIndex] = tempBlock;
    }
};
