function Player(index) {
    this.index = index;
    this.playerConfig = config.playerList[this.index];
    this.image = this.playerConfig.image;
    this.amount = this.playerConfig.amount;
    this.name = this.playerConfig.name;
    this.position = 0;
    this.$element = null;
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
    this.backward = false;
    this.freeSpaceTravel = false;
    this.end = false;

    this.initEvent = function() {
        var that = this;

        this.$element.on('animationend', function () {
            if (that.curentCount === 0) {
                return;
            }

            var position = that.getPosition();

            that.$element.removeClass(that.getDirectionClass());
            that.$element.css(position);

            setTimeout(function () {
                if (that.backward) {
                    that.back(that.curentCount - 1);
                } else {
                    that.go(that.curentCount - 1);
                }
            }, 100);
        });
    };

    this.payWithTitle = function (amount, title) {
        this.pay(amount, title + ' ' + util.toDisplayAmount(amount) + '을 은행에 납부하였습니다.');
    };

    this.payOnly = function (amount, message) {
        if (this.amount > amount) {
            this.amount -= amount;
        } else {
            amount -= this.amount;
            this.amount = 0;

            if (!this.sell(amount)) {
                this.end = true;

                /** @type Player **/
                var winPlayer = board.playerList.find(function (currentPlayer) {
                    return !currentPlayer.end;
                });

                board.win(winPlayer);

                return true;
            }
        }

        board.updatePlayInfo(this);
        return false;
    };

    this.pay = function (amount, message) {
        if (this.payOnly(amount)) {
            return;
        }

        if (message) {
            new Toast().showAndReadyToNextTurn(message);
        } else {
            board.readyNextTurn();
        }
    };

    this.sell = function (amount) {
        var blockList = this.getBlockList();

        blockList.sort(function (a, b) {
           var totalAmountOfA = a.getTotalAmount();
           var totalAmountOfB = b.getTotalAmount();

           if (totalAmountOfA < totalAmountOfB) {
               return -1;
           }

           if (totalAmountOfA > totalAmountOfB) {
               return 1;
           }

           return 0;
        });

        for (var i = 0; i < blockList.length; i++) {
            /** @type Block **/
            var block = blockList[i];
            var buildingList = block.buildingList;

            for (var j = 0; j < buildingList.length; j++) {
                var building = buildingList[buildingList.length - j - 1];
                var buildingCount = building.count;

                for (var k = 0; k < buildingCount; k++) {
                    var price = util.toAmount(building.displayPrice);
                    building.count--;

                    if (amount > price) {
                        amount -= price
                    } else {
                        this.amount = price - amount;
                        block.update();
                        return true;
                    }
                }
            }

            if (amount > block.amount) {
                amount -= block.amount
                block.reset();
            } else {
                this.amount = block.amount - amount;
                block.reset();
                return true;
            }
        }

        return false;
    };

    this.incomeWithTitle = function (amount, title) {
        if (typeof amount === 'number') {
            this.income(amount, title + ' ' + util.toDisplayAmount(amount) + '을 은행에서 받았습니다.');
        } else {
            this.income(util.toAmount(amount), `${title} ${amount}을 은행에서 받았습니다.`);
        }
    };

    this.income = function (amount, message) {
        this.amount += amount;
        board.updatePlayInfo(this);

        if (message) {
            new Toast().showAndReadyToNextTurn(message);
        } else {
            board.readyNextTurn();
        }
    };

    this.init = function() {
        var that = this;
        this.$element = $('<img>');
        this.$element.attr('src', this.getImageUrl());
        this.$element.addClass('live');
        this.$element.attr('data-index', this.index);

        this.$element.css({
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

    this.setPlayerImage = function ($element) {
        $element.find('.player-image').attr('src', this.getImageUrl());
    };

    this.getPosition = function () {
        var left = 0;
        var top = 0;

        if (this.backward) {
            if (this.currentPosition > 0 && this.currentPosition <= 10) {
                left = (this.currentPosition - 1) * config.block.width;
                top = this.playerConfig.top;
            } else if (this.currentPosition > 10 && this.currentPosition <= 20) {
                left = config.block.width * 10;
                top = (this.currentPosition - 10 - 1) * config.block.height + this.playerConfig.top;
            } else if (this.currentPosition > 20 && this.currentPosition <= 30) {
                left = (30 - this.currentPosition + 1) * config.block.width;
                top = config.block.height * 10 + this.playerConfig.top;
            } else if (this.currentPosition > 30) {
                top = (40 - this.currentPosition + 1) * config.block.height + this.playerConfig.top;
            } else if (this.currentPosition == 0) {
                top = config.block.height + this.playerConfig.top;
            }
        } else {
            if (this.currentPosition >= 0 && this.currentPosition < 10) {
                left = (this.currentPosition + 1) * config.block.width;
                top = this.playerConfig.top;
            } else if (this.currentPosition >= 10 && this.currentPosition < 20) {
                left = config.block.width * 10;
                top = (this.currentPosition - 10 + 1) * config.block.height + this.playerConfig.top;
            } else if (this.currentPosition >= 20 && this.currentPosition < 30) {
                left = (30 - this.currentPosition - 1) * config.block.width;
                top = config.block.height * 10 + this.playerConfig.top;
            } else if (this.currentPosition >= 30 && this.currentPosition < 40) {
                top = (40 - this.currentPosition - 1) * config.block.height + this.playerConfig.top;
            }
        }

        left += this.playerConfig.left;

        return {
            left: left,
            top: top
        };
    };

    this.rollDie = function() {
        var that = this;
        board.die.roll(function (notation, count) {
            that.go(count[0]);
        });
    };

    this.goFastToBlockAsWayPoint = function (name, nextTargetBlock) {
        this.nextTargetBlock = nextTargetBlock;
        this.buyable = false;
        this.goFastToBlock(name);
    };

    this.goFastToBlock = function (name, payable) {
        var targetBlock = board.getTargetBlock(name);
        this.goFastToIndex(targetBlock, payable);
    };

    this.goFastToIndex = function (targetBlock, payable) {
        if (payable === undefined) {
            this.payable = true;
        } else {
            this.payable = payable;
        }

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

    this.escapeFromIsland = function (message) {
        if (message === undefined) {
            message = '무인도를 탈출합니다.';
        }

        if (this.escapeTicketCount > 0) {
            this.escapeTicketCount--;
        }

        this.inIsland = false;
        this.inIslandCount = 0;
        new Toast().show(message);
    };

    this.tryEscapeFromIsland = function (count) {
        if (this.inIsland) {
            if (this.inIslandCount === 3) {
                this.escapeFromIsland();
                return true;
            } else {
                if (count === 6) {
                    this.escapeFromIsland();
                    return true;
                } else {
                    this.inIslandCount++;
                    new Toast().showAndReadyToNextTurn('무인도를 탈출하지 못했습니다.[' + this.inIslandCount + ']');
                    return false;
                }
            }
        }

        return true;
    };

    this.payForFund = function () {
        var that = this;
        var amount = util.toDisplayAmount(config.fundAmount);
        var fundingPlaceBlock = board.getTargetBlock(config.fundingPlace);
        var playInfo = board.playerInfoList[board.getPlayerIndex()];

        fundingPlaceBlock.addFunding();

        playInfo.$element.transfer({
            to: fundingPlaceBlock.$element
        }, function () {
            var message = config.fundingPlace + '에 ' + amount + '를 납부하였습니다.';
            that.pay(config.fundAmount, message);
        });
    };

    this.arrived = function () {
        if (this.curentCount === 0) {
            this.payable = true;
            this.fast = false;
            this.backward = false;

            /** @type Block **/
            var block = board.blockList[this.position];
            block.welcome();

            if (block.type === config.goldenKey) {
                this.runGoldenKey();
            } else if (block.name === config.island) {
                this.inIsland = true;
                this.readyNextTurn();
            } else if (block.name === config.fundingPlace) {
                block.resetFunding(true);
            } else if (block.name === config.fundingName) {
                this.payForFund();
            } else if (block.name === config.start) {
                this.getPayAndReadyToNextTurn();
            } else if (block.name === config.spaceTravel) {
                if (this.freeSpaceTravel === false) {
                    /** @type Block **/
                    var columbia = board.getTargetBlock(config.columbia);

                    var displayTravelFees = block.displayTravelFees;
                    console.log('>>> displayTravelFees', displayTravelFees);

                    if (columbia.player != null && columbia.player != this) {
                        var amount = util.toAmount(displayTravelFees);
                        this.pay(amount, '우주여행 비용' + displayTravelFees + '을 지불하였습니다.');
                        return true;
                    }
                }

                this.readyNextTurn();
            } else {
                this.buy(block);
            }

            return true;
        }

        return false;
    };

    this.back = function(count) {
        this.backward = true;

        if (!this.fast) {
            if (count > 0 && count <= 6) {
                board.playJumpSound(count);
            }
        }

        this.curentCount = count;

        if (this.arrived()) {
            return;
        }

        this.currentPosition = this.position;
        this.position--;

        if (this.position === -1) {
            this.position = 39;
        }

        this.currentDirection = this.getDirection();
        this.$element.addClass(this.getDirectionClass());
    };

    this.go = function(count) {
        if (!this.tryEscapeFromIsland(count)) {
            return;
        }

        if (!this.fast) {
            if (count > 0 && count <= 6) {
                board.playJumpSound(count);
            }
        }

        this.curentCount = count;

        if (this.arrived()) {
            return;
        }

        this.currentPosition = this.position;
        this.position++;
        this.position = this.position % config.blockSize;
        this.currentDirection = this.getDirection();
        this.$element.addClass(this.getDirectionClass());

        if (this.position === 0 && count > 1) {
            if (this.payable) {
                this.getPay();
            }
        }
    };

    this.getPay = function (callback) {
        this.amount += config.salary;
        board.updatePlayInfo(this);
        new Toast().show('월급 100만원을 받았습니다.', callback);
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
        board.updatePlayInfo(this);
        new Toast().showAndReadyToNextTurn('무인도 탈출권이 발급되었습니다.');
    };

    this.getDirectionClass = function () {
        if (this.fast) {
            return 'fast-' + this.currentDirection;
        }

        return this.currentDirection;
    };

    this.getDirection = function() {
        if (this.backward) {
            if (this.currentPosition > 0 && this.currentPosition <= 10) {
                return 'left';
            } else if (this.currentPosition > 10 && this.currentPosition <= 20) {
                return 'up';
            } else if (this.currentPosition > 20 && this.currentPosition <= 30) {
                return 'right';
            } else if (this.currentPosition > 30 || this.currentPosition == 0) {
                return 'down';
            }
        }

        if (this.currentPosition >= 0 && this.currentPosition < 10) {
            return 'right';
        } else if (this.currentPosition >= 10 && this.currentPosition < 20) {
            return 'down';
        } else if (this.currentPosition >= 20 && this.currentPosition < 30) {
            return 'left';
        } else if (this.currentPosition >= 30 && this.currentPosition < 40) {
            return 'up';
        }
    };

    this.readyNextTurn = function (modal) {
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
        return util.getImageUrl(this.image);
    };

    this.getDisplayAmount = function () {
        return util.toDisplayAmount(this.amount);
    };

    this.runGoldenKey = function () {
        var goldenKey = GoldenKey.list[board.goldenKeyIndex];
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

        var that = this;
        var investment = new Investment();

        if (!investment.show(block)) {
            this.readyNextTurn();
            return;
        }
    };

    this.initNewBuilding = function (block) {
        block.newBuildingCountList = [0, 0, 0];
        block.investmentAmount = 0;
        this.getPayButton().hide();
    };

    this.getPayButton = function () {
        return $('#payButton');
    };

    this.getBlockList = function () {
        var that = this;

        return board.blockList.filter(function (block) {
            return block.player === that;
        });
    };

    this.payForBuilding = function (amount, title) {
        var sum = 0;

        this.getBlockList()
            .forEach(function (block) {
                for (var i = 0; i < block.buildingList.length; i++) {
                    sum += block.buildingList[i].count * util.toAmount(amount[i]);
                }
            });

        if (sum > 0) {
            this.payWithTitle(sum, title);
        } else {
            new Toast().showAndReadyToNextTurn(title + '에 해당되는 건물이 없습니다.')
        }
    };

    this.init();
}