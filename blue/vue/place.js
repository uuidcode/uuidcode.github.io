Vue.component('place', {
    mixins: [coreMixin],
    props: ['index'],
    template: `
        <div v-bind:style="getDefaultStyle()">
            <div class="flag" v-bind:style="getFlagStyle()"></div>
            <div class="price" v-bind:style="getPriceStyle()">{{place.price}}</div>
            <div class="owner" v-if="existsOwner()" v-bind:style="getOwnerStyle()">
                <img :src="place.owner.image" 
                    :width="config.owner.width" 
                    :height="config.owner.height">
            </div>
            <div class="name" v-bind:style="getNameStyle()">{{place.name}}</div>
            <div class="estate" v-bind:style="getEstateStyle()">
                <span class="badge badge-primary hotel">{{place.hotelCount}}</span>
                <span class="badge badge-warning building">{{place.buildingCount}}</span>
                <span class="badge badge-danger villa">{{place.villaCount}}</span>
                <span class="badge badge-light fee"></span>
            </div>
        </div>
    `,
    data: function () {
        return {
            place: config.placeList[this.index],
        }
    },
    methods: {
        getDefaultStyle() {
            return {
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: config.place.width + 'px',
                height: config.place.height + 'px',
                zIndex: 100
            }
        },
        getFlagStyle() {
            return {
                position: 'absolute',
                left: config.flag.left + 'px',
                top: config.flag.top + 'px',
                width: '60px',
                height: '30px',
                border: '1px solid black',
                backgroundImage: this.getBackgroundFlagImage(),
                backgroundSize: '60px 30px'
            }
        },
        getPriceStyle() {
            return {
                position: 'absolute',
                left: config.price.left + 'px',
                top: config.price.top + 'px',
                width: config.price.width + 'px',
                height: config.price.height + 'px',
                lineHeight: config.price.height + 'px',
                textAlign: 'center',
                fontWeight: 'bold'
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
                display: this.getDisplayStyle(this.isPlace())
            }
        },
        getOwnerStyle() {
            return {
                position: 'absolute',
                left: config.owner.left,
                top: config.owner.top,
                width: config.owner.width,
                height: config.owner.height,
                display: this.getDisplayStyle(this.place.owner)
            }
        }
    }
});