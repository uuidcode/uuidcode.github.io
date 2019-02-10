Vue.component('place', {
    props: ['index'],
    template: `
        <div v-bind:style="placeStyle" class="place">
            <template v-if="isNormalOrSpecial">
                <div class="flag" v-bind:style="flagStyle"></div>
                <div class="price" v-bind:style="priceStyle">{{place.price}}</div>
                <div class="owner"></div>
                <div class="name" v-bind:style="nameStyle">{{place.name}}</div>
                <div class="estate" v-bind:style="estateStyle">
                    <span class="badge badge-primary hotel">{{place.hotelCount}}</span>
                    <span class="badge badge-warning building">{{place.buildingCount}}</span>
                    <span class="badge badge-danger villa">{{place.villaCount}}</span>
                    <span class="badge badge-light fee"></span>
                </div>
            </template>
            <golden-key v-else-if="isGoldenKey"></golden-key>
        </div>
    `,
    data: function () {
        return {
            place: {},
            placeStyle: {
                position: 'absolute',
                left: this.getLeft() + 'px',
                top: this.getTop() + 'px',
                width: config.place.width + 'px',
                height: config.place.height + 'px',
                zIndex: 100
            },
            flagStyle: {
                position: 'absolute',
                left: config.flag.left + 'px',
                top: config.flag.top + 'px',
                width: '60px',
                height: '30px',
                border: '1px solid black',
                backgroundImage: 'url(../image/' + this.getCode() + '.png)',
                backgroundSize: '60px 30px'
            },
            priceStyle: {
                position: 'absolute',
                left: config.price.left + 'px',
                top: config.price.top + 'px',
                width: config.price.width + 'px',
                height: config.price.height + 'px',
                lineHeight: config.price.height + 'px',
                textAlign: 'center',
                fontWeight: 'bold'
            },
            nameStyle: {
                position: 'absolute',
                left: config.name.left + 'px',
                top: config.name.top + 'px',
                width: config.name.width + 'px',
                height: config.name.height + 'px',
                lineHeight: config.name.height + 'px',
                textAlign: 'center',
                fontWeight: 'bold'
            },
            estateStyle: {
                position: 'absolute',
                left: config.estate.left + 'px',
                top: config.estate.top + 'px',
                width: config.estate.width + 'px',
                height: config.estate.height + 'px',
                textAlign: 'center',
                display: this.getEstateDisplay()
            },
            goldenKeyStyle: {
                position: 'absolute',
                left: ((config.place.width - config.goldenKey.width) / 2) + 'px',
                top: config.goldenKey.top + 'px',
                width: config.goldenKey.width + 'px',
                height: config.goldenKey.height + 'px',
                backgroundImage: 'url(../image/key.png)',
                backgroundSize: `${config.goldenKey.width}px ${config.goldenKey.height}px`
            }
        }
    },
    created() {
        EventBus.$on('message', this.onReceive);
        EventBus.$emit('message', 'init-place');
    },
    computed: {
        isNormalOrSpecial() {
            return this.place.type === 'normal' || this.place.type === 'special';
        },
        isGoldenKey() {
            return this.place.type === 'goldenKey';
        }
    },
    methods: {
        onReceive(command) {
            if (command === 'init-place') {
                this.place = config.placeList[this.index];
            }
        },
        getEstateDisplay() {
            if (this.place == null) {
                return 'block';
            }

            if (this.place.type === 'normal') {
                return 'block';
            }

            return 'none';
        },
        getCode() {
            return config.placeList[this.index].code;
        },
        getLeft() {
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
        getTop() {
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
});