var coreMixin = {
    methods: {
        getPlaceList() {
            return this.player.placeList.map(index => config.placeList[index]);
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
        }
    }
};