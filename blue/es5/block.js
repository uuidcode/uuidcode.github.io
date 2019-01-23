function Block(index, data) {
    this.index = index;
    this.type = null;
    this.name = null;
    this.displayAmount = null;
    this.displayTravelFees = null;
    this.amount = null;
    this.code = null;
    this.$element = null;
    this.player = null;
    this.buildingList = [];
    this.fundingCount = 0;
    this.building = null;

    if (data) {
        this.type = data.type || 'nation';
        this.name = data.name || '';
        this.displayAmount = data.displayAmount || '';
        this.amount = data.amount || 0;
        this.displayFees = data.displayFees || '';
        this.fees = data.fees || 0;
        this.code = data.code || '';
        this.displayTravelFees = data.displayTravelFees;

        if (data.buildingList) {
            this.buildingList = data.buildingList;
        }
    }

    this.welcome = function () {
        var that = this;

        this.$element.animate({
            backgroundColor: config.selectedColor
        }, function () {
            that.$element.animate({
                backgroundColor: '#ffffff'
            });
        });
    };

    this.getTotalFees = function () {
        var totalFees = 0;

        this.buildingList.forEach(function (building) {
            totalFees += building.fees * building.count;
        });

        if (totalFees == 0) {
            totalFees = this.fees;
        }

        return totalFees;
    };

    this.getTotalAmount = function () {
        var totalAmount = 0;

        this.buildingList.forEach(function (building) {
            totalAmount += util.toAmount(building.displayPrice) * building.count;
        });

        totalAmount += this.amount;

        return totalAmount;
    };

    this.reset = function () {
        this.player = null;
        this.buildingList.forEach(function (building) {
            building.count = 0;
        });
        this.update();
    };

    this.getOwnerImageUrl = function () {
        if (this.player == null) {
            return config.defaultOwnerImageUrl;
        }

        return this.player.getImageUrl();
    };

    this.update = function () {
        this.updateOwner();
        this.building.update();
    };

    this.updateOwner = function () {
        var imageUrl = config.defaultOwnerImageUrl;

        if (this.player != null) {
            imageUrl = this.player.getImageUrl();
        }

        this.$element.find('.owner').attr('src', imageUrl);
    };

    this.init = function () {
        var that = this;
        var position = this.processPosition();

        this.$element = $('<div></div>');
        this.$element.on('click', function () {
            if (board.currentPlayerIsOnSpaceTravel()) {
                if (that.name === config.spaceTravel) {
                    return;
                }

                var currentPlayer = board.getCurrentPlayer();
                currentPlayer.goFastToIndex(that);
            }
        });

        this.$element.addClass('block');
        this.$element.css({
            position: 'absolute',
            left: position.left,
            top: position.top,
            width: config.block.width,
            height: config.block.height,
            zIndex: 100
        });

        if (this.type == 'nation') {
            var flag = new Flag(this.code);
            this.$element.append(flag.$element);

            var name = new Name(this.name);
            this.$element.append(name.$element);

            var amount = new Amount(this.displayAmount);
            this.$element.append(amount.$element);

            var owner = new Owner(null);
            this.$element.append(owner.$element);

            this.building = new Building(this);
            this.$element.append(this.building.$element);
        } else if (this.type == config.goldenKey) {
            var key = new Key();
            this.$element.append(key.$element);
        } else if (this.type == 'special') {
            var special = new Special(this.name, this.code);
            this.$element.append(special.$element);
        }
    };

    this.processPosition = function () {
        var left = 0;
        var top = 0;
        var placement = null;

        if (this.index >= 0 && this.index <= 10) {
            left = this.index * config.block.width;
            placement = 'top';
        } else if (this.index > 10 && this.index <= 20) {
            left = 10 * config.block.width;
            top = (this.index - 10) * config.block.height;
            placement = 'right';
        } else if (this.index > 20 && this.index <= 30) {
            left = (30 - this.index) * config.block.width;
            top = 10 * config.block.height;
            placement = 'bottom';
        } else if (this.index > 30) {
            top = (40 - this.index) * config.block.height;
            placement = 'left';
        }

        return {
            left: left,
            top: top,
            placement: placement
        };
    };

    this.getImageUrl = function () {
        return '../image/'+ this.code + '.png';
    };

    this.getDisplayAmount = function () {
        return util.toDisplayAmount(this.amount);
    };

    this.addFunding = function () {
        this.fundingCount++;
        this.amount = this.getFundingAmount();
        this.updateFundingAmount();
    };

    this.resetFunding = function () {
        if (this.fundingCount > 0) {
            var message = config.fundingName + ' ' + util.toDisplayAmount(this.amount) + '을 받았습니다.';
            board.getCurrentPlayer().income(this.amount);
            this.fundingCount = 0;
            this.amount = this.getFundingAmount();
            this.updateFundingAmount();
            new Toast().showAndReadyToNextTurn(message);
            return true;
        }

        return false;
    };

    this.getFundingAmount = function () {
        return 150000 * this.fundingCount;
    };

    this.getDisplayFundingAmount = function () {
        return this.fundingCount * 15 + '만원';
    };

    this.updateFundingAmount = function () {
        this.$element.find('.block-amount').text(util.toDisplayAmount(this.amount));
    };

    this.hasBuilding = function () {
        return this.buildingList.length > 0
    };

    this.hasNotBuilding = function () {
        return !this.hasBuilding();
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
        type: config.goldenKey
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
        type: config.goldenKey
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
        type: config.goldenKey
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
        type: config.goldenKey
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
        type: config.goldenKey
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
        type: config.goldenKey
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

Block.random = function () {
    util.shuffle(Block.list);

    var startIndex = 0;

    for (var i = 0; i < Block.list.length; i++) {
        if (Block.list[i].name === config.start) {
            startIndex = i;
            break;
        }
    }

    if (startIndex !== 0) {
        var startBlock = Block.list[startIndex];
        var tempBlock = Block.list[0];
        Block.list[0] = startBlock;
        Block.list[startIndex] = tempBlock;
    }
};

Block.init = function () {
    for (var i = 0; i < Block.list.length; i++) {
        var block = Block.list[i];

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
};

Block.init();