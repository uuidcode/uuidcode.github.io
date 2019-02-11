Vue.component('special', {
    props: ['index'],
    template: `
        <div v-bind:style="getSpecialStyle()">
            <span v-bind:style="nameStyle">{{place.name}}</span>
        </div>
    `,
    data: function () {
        return {
            place: config.placeList[this.index],
            nameStyle: {
                backgroundColor: config.selectedColor
            }
        }
    },
    methods: {
        getBackgroundImage() {
            return `url(../image/${this.place.code}.png)`;
        },
        getSpecialStyle() {
            return {
                position: 'absolute',
                left: 0,
                top: 0,
                width: config.place.width + 'px',
                height: config.place.height + 'px',
                lineHeight: config.place.height + 'px',
                textAlign: 'center',
                fontWeight: 'bold',
                backgroundImage: this.getBackgroundImage(),
                backgroundSize: `${config.place.width}px ${config.place.height}px`,
                color: 'white'
            }
        }
    }
});