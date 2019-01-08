function Player(index) {
    this.index = index;
    this.playerConfig = config.playerList[this.index];
    this.image = this.playerConfig.image;
    this.amount = this.playerConfig.amount;
    this.position = 0;
    this.$ui = null;
    this.curentCount = 0;
    this.currentDirection = null;
    this.currentPosition = 0;
    this.fast = false;
    this.payable = true;
    this.inIsland = false;
    this.inIslandCount = 0;
    this.ticketCount = 0;
    this.escapeTicketCount = 0;
    this.nextTargetBlock = null;
    this.buyable = true;

    this.initEvent = function() {
        var self = this;

        this.$ui.on('animationend', function () {
            var position = self.getPosition();

            self.$ui.removeClass(self.getDirectionClass());
            self.$ui.css(position);

            setTimeout(function () {
                self.go(self.curentCount - 1);
            }, 100);
        });
    };

    this.pay = function (amount, message) {
        console.log('>>> pay amount', amount);

        this.amount -= amount;
        board.updatePlayInfo(this);

        if (message) {
            new Toast().showAndReadyToNextTurn(message);
        } else {
            board.readyNextTurn();
        }
    };

    this.income = function (amount, message) {
        console.log('>>> income amount', amount);

        this.amount += amount;
        board.updatePlayInfo(this);

        if (message) {
            new Toast().showAndReadyToNextTurn(message);
        } else {
            board.readyNextTurn();
        }
    };

    this.init = function() {
        var self = this;
        this.$ui = $('<img>');
        this.$ui.attr('src', this.getImageUrl());
        this.$ui.addClass('live');
        this.$ui.attr('data-index', this.index);

        this.$ui.css({
            position: 'absolute',
            left: this.playerConfig.left,
            top: this.playerConfig.top,
            width: this.playerConfig.width,
            height: this.playerConfig.height,
            borderRadius: '50%',
            zIndex: 100
        });

        this.initEvent();
    };

    this.setPlayerImage = function ($ui) {
        $ui.find('.player-image').attr('src', this.getImageUrl());
    };

    this.getPosition = function () {
        var left = 0;
        var top = 0;

        if (this.currentPosition >= 0 && this.currentPosition < 10) {
            left = (this.currentPosition + 1) * config.block.width;
            top = this.playerConfig.top;
        } else if (this.currentPosition >= 10 && this.currentPosition < 20) {
            left = config.block.width * 10;
            top = (this.currentPosition - 10 + 1) * config.block.height + this.playerConfig.top;
        } else if (this.currentPosition >= 20 && this.currentPosition < 30) {
            left = (30 - this.currentPosition - 1) * config.block.width;
            top = config.block.height * 10 +  + this.playerConfig.top;
        } else if (this.currentPosition >= 30 && this.currentPosition < 40) {
            top = (40 - this.currentPosition - 1) * config.block.height + this.playerConfig.top;
        }

        left += this.playerConfig.left;

        return {
            left: left,
            top: top
        };
    };

    this.rollDie = function() {
        var self = this;

        board.die.roll(function (notation, count) {
            self.go(count);
        });
    };

    this.goFastToBlockAsWayPoint = function (name, nextTargetBlock) {
        this.nextTargetBlock = nextTargetBlock;
        this.buyable = false;
        this.goFastToBlock(name);
    };

    this.goFastToBlock = function (name, payable) {
        this.payable = payable || true;
        var targetBlock = board.getTargetBlock(name);
        var currentPlayer = board.getCurrentPlayer();
        var count = targetBlock.index - currentPlayer.position;

        if (count < 0) {
            count = config.blockSize - currentPlayer.position;
            count += targetBlock.index;
        }

        currentPlayer.goFast(count);
    };

    this.goFast = function(count) {
        this.fast = true;
        this.go(count);
    };

    this.initIsland = function () {
        this.inIsland = false;
        this.inIslandCount = 0;
    };

    this.escapeFromIsland = function (count) {
        var self = this;

        if (this.inIsland) {
            if (this.inIslandCount === 3) {
                this.initIsland();
                return true;
            } else {
                if (count === 6) {
                    this.inIsland();
                    return true;
                } else {
                    this.inIslandCount++;
                    new Toast().showAndReadyToNextTurn('무인도를 탈출하지 못했습니다.[' + this.inIsland + ']');
                    return false;
                }
            }
        }

        return true;
    };

    this.arrived = function () {
        if (this.curentCount === 0) {
            this.payable = true;
            this.fast = false;

            var block = board.blockList[this.position];
            block.welcome();

            if (block.type === config.goldenKey) {
                this.runGoldenKey();
            } else if (block.name === config.island) {
                this.inIsland = true;
                this.readyNextTurn();
            } else if (block.name === config.fundingPlace) {
                this.block.resetFunding();
            } else if (block.name === config.fundingName) {
                this.pay(config.fundAmount);
                board.getFundingPlace().addFunding();
            } else if (block.name === config.start) {
                this.getPayAndReadyToNextTurn();
            } else {
                this.buy(block);
            }

            return true;
        }

        return false;
    };

    this.go = function(count) {
        if (!this.escapeFromIsland(count)) {
            return;
        }

        this.curentCount = count;

        if (this.arrived()) {
            return;
        }

        this.currentPosition = this.position;
        this.position++;
        this.position = this.position % config.blockSize;
        this.currentDirection = this.getDirection();
        this.$ui.addClass(this.getDirectionClass());

        if (this.position === 0) {
            if (this.payable) {
                this.getPay();
            }
        }
    };

    this.getPay = function (callback) {
        this.amount += 500000;
        board.updatePlayInfo(this);
        new Toast().show('월급 50만원을 받았습니다.', callback);
    };

    this.getPayAndReadyToNextTurn = function () {
        this.getPay(this.readyNextTurn);
    };

    this.addTicket = function () {
        this.ticketCount++;
        board.updatePlayInfo(this);
        new Toast().showAndReadyToNextTurn('우대권이 발급되었습니다.');
    };

    this.addEscapeTicket = function () {
        this.escapeTicketCount++;
        this.updatePlayInfo(this);
        new Toast().showAndReadyToNextTurn('무인도 탈출권이 발급되었습니다.');
    };

    this.getDirectionClass = function () {
        if (this.fast) {
            return 'fast-' + this.currentDirection;
        }

        return this.currentDirection;
    };

    this.getDirection = function() {
        if (this.currentPosition >= 0 && this.currentPosition < 10) {
            return "right";
        } else if (this.currentPosition >= 10 && this.currentPosition < 20) {
            return "down";
        } else if (this.currentPosition >= 20 && this.currentPosition < 30) {
            return "left";
        } else if (this.currentPosition >= 30 && this.currentPosition < 40) {
            return "up";
        }
    };

    this.readyNextTurn = function (modal) {
        console.log('>>> readyNextTurn');

        if (modal) {
            modal.hideModal();
        }

        if (this.nextTargetBlock != null) {
            this.buyable = true;
            var nextTargetBlock = this.nextTargetBlock;
            this.nextTargetBlock = null;
            this.goFastToBlock(nextTargetBlock);
            return;
        }

        board.turnIndex++;
        board.readyNextTurn();
    };

    this.getImageUrl = function () {
        return '../image/' + this.image;
    };

    this.runGoldenKey = function () {
        var goldenKey = config.goldenKeyList[board.goldenKeyIndex];
        new GoldenKey().show(goldenKey);
    };

    this.island = function () {
        this.inIsland = true;
    };

    this.buy = function (block) {
        if (this.buyable === false) {
            if (block.player === null || block.player === this) {
                this.readyNextTurn();
                return;
            }
        }

        var self = this;
        var investment = new Investment();
        investment.show(block);

        $('#buyButton').on('click', function () {
            block.player = self;
            self.amount -= block.amount;

            block.updateOwner();

            board.updatePlayInfo(self);
            self.readyNextTurn(investment);
        });

        $('#cancelButton, #notPayButton').on('click', function () {
            self.readyNextTurn(investment);
        });

        $('#resetButton').on('click', function () {
            this.initNewBuilding();
            $('#payButton').text('구입한다');
        });

        $('#payFeeButton').on('click', function () {
            var totalFees = block.getTotalFees();
            investment.hideModal();

            self.pay(totalFees);
            block.player.income(totalFees);

            var message = '통행료 ' + totalFees.toLocaleString() + '원을 지불하였습니다.';
            new Toast().showAndReadyToNextTurn(message);
        });

        $('#useTicketButton').on('click', function () {
            investment.hideModal();
            this.ticketCount--;
            var message = '우대권을 사용하였습니다.';
            new Toast().showAndReadyToNextTurn(message);
        });

        this.addBuilding(investment, block);
    };

    this.initNewBuilding = function () {
        block.newBuildingCountList = [0, 0, 0];
        block.investmentAmount = 0;
        this.getPayButton().hide();
    };

    this.getPayButton = function () {
        return $('#payButton');
    };

    this.addBuilding = function (investment, block) {
        this.initNewBuilding();
        var $payButton = this.getPayButton();

        $payButton.on('click', function () {
            for (var i = 0; i < this.buildingList.length; i++) {
                var building = this.buildingList[i];
                building.count += block.newBuildingCountList[i];
            }

            this.amount -= block.investmentAmount;
            this.readyNextTurn(investment);
        });

        var addButton = investment.$ui.find('.investment-add-button');

        addButton.on('click', function () {
            this.getPayButton().show();
            block.buildingIndex = addButton.index($(this));
            block.investmentAmount += block.buildingList[block.buildingIndex].price;
            block.newBuildingCountList[block.buildingIndex]++;

            var $parent = $(this).closest('tr');
            var $count = $parent.find('.investment-count');
            var currentCount = $count.text() || '0';
            $count.text(parseInt(currentCount, 10) + 1);

            $payButton.text(block.investmentAmount.toLocaleString() + '원으로 구입합니다');
        });
    };

    this.getBlockList = function () {
        var self = this;
        return board.blockList.filter(function (block) {
            return block.player === self;
        });
    };

    this.init();
}