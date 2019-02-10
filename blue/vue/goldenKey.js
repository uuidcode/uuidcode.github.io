Vue.component('golden-key', {
    props: ['index'],
    template: `
        <div v-bind:style="goldenKeyStyle"></div>
    `,
    data: function () {
        return {
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
    },
    methods: {
    }
});