Vue.component('golden-key', {
    props: ['index'],
    template: `
        <div v-bind:style="specialStyle">
            <span v-bind:style="nameStyle">{{name}}</span>
        </div>
    `,
    data: function () {
        return {
            place: {},
            specialStyle: {
                position: 'absolute',
                left: 0,
                top: 0,
                width: config.place.width + 'px',
                height: config.place.height + 'px',
                lineHeight: config.block.height + 'px',
                textAlign: 'center',
                fontWeight: 'bold',
                backgroundImage: `url(../image/${this.code}.png)`,
                backgroundSize: `${config.block.width}px ${config.block.height}px`,
                color: 'white'
            },
            nameStyle: {
                backgroundColor: config.selectedColor
            }
        }
    },
    created() {
        EventBus.$on('message', this.onReceive);
        EventBus.$emit('message', 'init-special');
    },
    methods: {
        onReceive(command) {
            if (command === 'init-special') {
                this.place = config.placeList[this.index];
            }
        }
    }
});