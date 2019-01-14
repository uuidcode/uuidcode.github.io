function Player(index) {
    this.index = index;
    this.playerConfig = config.playerList[this.index];
    this.image = this.playerConfig.image;
    this.amount = this.playerConfig.amount;
    this.name = this.playerConfig.name;
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
    this.backward = false;
    this.freeSpaceTravel = false;
    this.end = false;
    this.robot = this.playerConfig.robot;
    this.moving = false;

    this.initEvent = function() {
        var self = this;

        this.$ui.on('animationend', function () {
            var position = self.getPosition();

            self.$ui.removeClass(self.getDirectionClass());
            self.$ui.css(position);

            setTimeout(function () {
                if (self.backward) {
                    self.back(self.curentCount - 1);
                } else {
                    self.go(self.curentCount - 1);
                }
            }, 100);
        });

        setInterval(function () {
            console.log('>>> setInterval');

            if (self.robot && self.moving == false) {
                if (board.getCurrentPlayer() === self) {
                    if ($('.investment-modal').length > 0) {
                        var block = board.blockList[self.position];

                        if (block.type === 'nation') {
                            if (block.player === null) {
                                $('#buyButton').click();
                                return;
                            } else if (block.player === self) {
                                return;
                            } else {
                                $('#payButton').click();
                                return;
                            }
                        }
                    } else if($('.golden-key-modal').length > 0) {
                        $('.run-golden-key-button').click();
                        return;
                    }

                    self.rollDie();
                }
            }
        }, 2000);
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

                var html = $('#winTemplate').html();
                var $winModal = $(html);
                $winModal.find('.player-image').attr('src', winPlayer.getImageUrl());
                $winModal.find('.player-name').text(winPlayer.name + '이/가 이겼습니다.');
                $winModal.showModal().removeModalWhenClose();
                confetti.start();
                board.playWinSound();
                $winModal.find('.win-button').on('click', function () {
                    location.reload();
                });

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
                        return true;
                    }
                }
            }

            if (amount > block.amount) {
                block.reset();
                amount -= block.amount
            } else {
                this.amount = block.amount - amount;
                block.reset();
                return true;
            }
        }

        return false;
    };

    this.incomeWithTitle = function (amount, title) {
        this.income(amount, title + ' ' + util.toDisplayAmount(amount) + '을 은행에서 받았습니다.');
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
        var self = this;
        board.die.roll(function (notation, count) {
            self.go(count[0]);
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

    this.escapeFromIsland = function () {
        this.inIsland = false;
        this.inIslandCount = 0;
        new Toast().show('무인도를 탈출합니다.');
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

    this.arrived = function () {
        if (this.curentCount === 0) {
            this.payable = true;
            this.fast = false;
            this.backward = false;

            var block = board.blockList[this.position];
            block.welcome();

            if (block.type === config.goldenKey) {
                this.runGoldenKey();
            } else if (block.name === config.island) {
                this.inIsland = true;
                this.readyNextTurn();
            } else if (block.name === config.fundingPlace) {
                block.resetFunding();
                this.readyNextTurn();
            } else if (block.name === config.fundingName) {
                var amount = util.toDisplayAmount(config.fundAmount);
                var message = config.fundingPlace + '에 ' + amount + '를 납부하였습니다.';
                this.pay(config.fundAmount, message);
                this.readyNextTurn();
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

        if (this.position == -1) {
            this.position = 39;
        }

        this.currentDirection = this.getDirection();
        this.$ui.addClass(this.getDirectionClass());
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
            this.moving = false;
            return;
        }

        this.currentPosition = this.position;
        this.position++;
        this.position = this.position % config.blockSize;
        this.currentDirection = this.getDirection();
        this.$ui.addClass(this.getDirectionClass());
        this.moving = true;

        if (this.position === 0 && count > 1) {
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
        if (!investment.show(block)) {
            this.readyNextTurn();
            return;
        }

        $('#buyButton').on('click', function () {
            block.player = self;
            self.amount -= block.amount;

            block.update();
            board.updatePlayInfo(self);
            self.readyNextTurn(investment);
        });

        $('#cancelButton, #notPayButton').on('click', function () {
            self.readyNextTurn(investment);
        });

        var self = this;

        $('#resetButton').on('click', function () {
            for (var i = 0; i < block.newBuildingCountList.length; i++) {
                var $investmentCount = $('.investment-count').eq(i + 1);
                var count = block.newBuildingCountList[i];
                $investmentCount.text(parseInt($investmentCount.text()) - count);
            }

            self.initNewBuilding(block);
        });

        $('#payFeeButton').on('click', function () {
            var totalFees = block.getTotalFees();
            investment.hideModal();

            if (self.payOnly(totalFees)) {
                return;
            }

            var message = util.toDisplayAmount(totalFees) + '을 지불하였습니다.';
            block.player.income(totalFees, message);
        });

        $('#useTicketButton').on('click', function () {
            investment.hideModal();
            self.ticketCount--;
            var message = '우대권을 사용하였습니다.';
            board.updatePlayInfo(self);
            new Toast().showAndReadyToNextTurn(message);
        });

        this.addBuilding(investment, block);
    };

    this.initNewBuilding = function (block) {
        block.newBuildingCountList = [0, 0, 0];
        block.investmentAmount = 0;
        this.getPayButton().hide();
    };

    this.getPayButton = function () {
        return $('#payButton');
    };

    this.addBuilding = function (investment, block) {
        this.initNewBuilding(block);
        var $payButton = this.getPayButton();
        var self = this;

        $payButton.on('click', function () {
            for (var i = 0; i < block.buildingList.length; i++) {
                var building = block.buildingList[i];
                building.count += block.newBuildingCountList[i];
            }

            self.amount -= block.investmentAmount;
            board.updatePlayInfo(self);
            self.readyNextTurn(investment);
            block.building.update();
        });

        var addButton = investment.$ui.find('.investment-add-button');

        addButton.on('click', function () {
            var buildingIndex = addButton.index($(this));
            var price = util.toAmount(block.buildingList[buildingIndex].displayPrice);

            if (block.investmentAmount + price > self.amount) {
                alert('더 이상 구입할 수 없습니다.');
                return;
            }

            block.buildingIndex = buildingIndex;
            block.investmentAmount += price;
            block.newBuildingCountList[block.buildingIndex] += 1;

            var $parent = $(this).closest('tr');
            var $count = $parent.find('.investment-count');
            var currentCount = $count.text() || '0';
            $count.text(parseInt(currentCount, 10) + 1);

            $payButton.text(util.getPayMessage(block.investmentAmount)).show();
        });
    };

    this.getBlockList = function () {
        var self = this;

        return board.blockList.filter(function (block) {
            return block.player === self;
        });
    };

    this.payForBuilding = function (amount, title) {
        var sum = 0;

        this.getBlockList()
            .forEach(function (block) {
                for (var i = 0; i < block.buildingList.length; i++) {
                    sum += block.buildingList[i].count * amount[i];
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