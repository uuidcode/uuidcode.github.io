Vue.component('place', {
    props: ['index'],
    mixins: [coreMixin],
    template: `
        <div v-bind:style="getPlaceStyle()" class="place">
            <normal v-else-if="isNormalOrLandmark()" v-bind:index="index"></normal>
            <golden-key v-else-if="isGoldenKey()" v-bind:index="index"></golden-key>
            <special v-else-if="isSpecial()" v-bind:index="index"></special>
        </div>
    `,
    data: function () {
        return {
            place: config.placeList[this.index]
        }
    },
    methods: {
        getPlaceStyle() {
            return {
                position: 'absolute',
                left: this.getLeft() + 'px',
                top: this.getTop() + 'px',
                width: config.place.width + 'px',
                height: config.place.height + 'px',
                zIndex: 100
            }
        }
    }
});