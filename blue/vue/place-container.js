Vue.component('place-container', {
    props: ['index'],
    mixins: [coreMixin],
    template: `
        <div v-bind:style="getPlaceContainerStyle()" class="place">
            <place v-if="isPlaceOrLandmark()" v-bind:index="index"></place>
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
        getPlaceContainerStyle() {
            return {
                position: 'absolute',
                left: this.getPlaceLeft() + 'px',
                top: this.getPlaceTop() + 'px',
                width: config.place.width + 'px',
                height: config.place.height + 'px',
                zIndex: 100
            }
        }
    }
});