Vue.component('normal', {
    props: ['index'],
    template: `
        <div class="flag" v-bind:style="getFlagStyle()"></div>
        <div class="price" v-bind:style="getPriceStyle()">{{place.price}}</div>
        <div class="owner"></div>
        <div class="name" v-bind:style="getNameStyle()">{{place.name}}</div>
        <div class="estate" v-bind:style="getEstateStyle()">
            <span class="badge badge-primary hotel">{{place.hotelCount}}</span>
            <span class="badge badge-warning building">{{place.buildingCount}}</span>
            <span class="badge badge-danger villa">{{place.villaCount}}</span>
            <span class="badge badge-light fee"></span>
        </div>
    `,
    data: function () {
        return {
            place: config.placeList[this.index],
        }
    },
    methods: {
        getFlagStyle() {
            return {
                position: 'absolute',
                left: config.flag.left + 'px',
                top: config.flag.top + 'px',
                width: '60px',
                height: '30px',
                border: '1px solid black',
                backgroundImage: 'url(../image/' + this.getCode() + '.png)',
                backgroundSize: '60px 30px'
            }
        },
        getPriceStyle() {
            return {
                position: 'absolute',
                left: config.flag.left + 'px',
                top: config.flag.top + 'px',
                width: '60px',
                height: '30px',
                border: '1px solid black',
                backgroundImage: 'url(../image/' + this.getCode() + '.png)',
                backgroundSize: '60px 30px'
            }
        },
        getNameStyle() {
            return {
                position: 'absolute',
                left: config.name.left + 'px',
                top: config.name.top + 'px',
                width: config.name.width + 'px',
                height: config.name.height + 'px',
                lineHeight: config.name.height + 'px',
                textAlign: 'center',
                fontWeight: 'bold'
            }
        },
        getEstateStyle() {
            return {
                position: 'absolute',
                left: config.estate.left + 'px',
                top: config.estate.top + 'px',
                width: config.estate.width + 'px',
                height: config.estate.height + 'px',
                textAlign: 'center',
                display: this.getEstateDisplay()
            }
        }
    }
});