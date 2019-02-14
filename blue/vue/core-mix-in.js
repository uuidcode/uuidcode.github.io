var coreMixin = {
    methods: {
        getPlaceList() {
            return this.player.placeList
                .map(index => config.placeList[index]);
        },
        getBackgroundFlagImage() {
            var url = this.getFlagImage();
            return this.getBackgroundImage(url);
        },
        getBackgroundImage(url) {
            return 'url(' +  url + ')';
        },
        getImageUrl(name) {
            return `../image/${name}.png`
        },
        getFlagImage() {
            var code = this.getCode();
            return this.getImageUrl(code);
        },
        isLandmark() {
            return this.place.type === 'landmark';
        },
        isPlace() {
            return this.place.type === 'place';
        },
        isGoldenKey() {
            return this.place.type === 'goldenKey';
        },
        isSpecial() {
            return this.place.type === 'special';
        },
        isPlaceOrLandmark() {
            return this.isPlace() || this.isLandmark();
        },
        getCode() {
            return this.place.code;
        },
        getPlaceLeft() {
            var left = 0;

            if (this.index >= 0 && this.index <= 10) {
                return this.index * config.place.width;
            } else if (this.index > 10 && this.index <= 20) {
                return 10 * config.place.width;
            } else if (this.index > 20 && this.index <= 30) {
                return (30 - this.index) * config.place.width;
            }

            return left;
        },
        getPlaceTop() {
            var top = 0;

            if (this.index > 10 && this.index <= 20) {
                return (this.index - 10) * config.place.height;
            } else if (this.index > 20 && this.index <= 30) {
                return 10 * config.place.height;
            } else if (this.index > 30) {
                return (40 - this.index) * config.place.height;
            }

            return top;
        },
        getDisplayStyle(object) {
            var display = true;

            if (typeof object === "boolean"){
                display = object;
            } else {
                if (object !== undefined && object !== null) {
                    display = true;
                }
            }

            if (display === true) {
                return 'block';
            }

            return 'none';
        },
        exists(object) {
            return object !== undefined && object !== null;
        },
        existsOwner() {
            return this.exists(this.place.owner);
        },
        getDirection(currentPlayer) {
            if (currentPlayer.move.direction == 'back') {
                if (currentPlayer.position > 0 && currentPlayer.position <= 10) {
                    return 'left';
                } else if (currentPlayer.position > 10 && currentPlayer.position <= 20) {
                    return 'up';
                } else if (currentPlayer.position > 20 && currentPlayer.position <= 30) {
                    return 'right';
                } else if (currentPlayer.position > 30 || currentPlayer.position == 0) {
                    return 'down';
                }
            }

            if (currentPlayer.position >= 0 && currentPlayer.position < 10) {
                return 'right';
            } else if (currentPlayer.position >= 10 && currentPlayer.position < 20) {
                return 'down';
            } else if (currentPlayer.position >= 20 && currentPlayer.position < 30) {
                return 'left';
            } else if (currentPlayer.position >= 30 && currentPlayer.position < 40) {
                return 'up';
            }
        },
        getPlayerPosition(currentPlayer) {
            var left = 0;
            var top = 0;

            if (this.backward) {
                if (currentPlayer.position > 0 && currentPlayer.position <= 10) {
                    left = (currentPlayer.position - 1) * config.place.width;
                    top = currentPlayer.top;
                } else if (currentPlayer.position > 10 && currentPlayer.position <= 20) {
                    left = config.place.width * 10;
                    top = (currentPlayer.position - 10 - 1) * config.place.height + currentPlayer.top;
                } else if (currentPlayer.position > 20 && currentPlayer.position<= 30) {
                    left = (30 - currentPlayer.position + 1) * config.place.width;
                    top = config.place.height * 10 + currentPlayer.top;
                } else if (currentPlayer.position > 30) {
                    top = (40 - currentPlayer.position+ 1) * config.place.height + currentPlayer.top;
                } else if (currentPlayer.position === 0) {
                    top = config.place.height + currentPlayer.top;
                }
            } else {
                if (currentPlayer.position >= 0 && currentPlayer.position < 10) {
                    left = (currentPlayer.position + 1) * config.place.width;
                    top = currentPlayer.top;
                } else if (currentPlayer.position >= 10 && currentPlayer.position < 20) {
                    left = config.place.width * 10;
                    top = (currentPlayer.position - 10 + 1) * config.place.height + currentPlayer.top;
                } else if (currentPlayer.position >= 20 && currentPlayer.position< 30) {
                    left = (30 - currentPlayer.position - 1) * config.place.width;
                    top = config.place.height * 10 + currentPlayer.top;
                } else if (currentPlayer.position >= 30 && currentPlayer.position< 40) {
                    top = (40 - currentPlayer.position- 1) * config.place.height + currentPlayer.top;
                }
            }

            return {
                left: left + currentPlayer.leftMargin,
                top: top
            }
        },
        sendMessage(message) {
            EventBus.$emit('message', message);
        }
    }
};