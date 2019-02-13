Vue.component('player', {
    props: ['index'],
    mixins: [coreMixin],
    template: `
        <img :style="getPlayerStyle()"
            class="live">
    `,
    data: function () {
        return {
            player: config.playerList[this.index]
        }
    },
    methods: {
        getPlayerStyle() {
            return {
                position: 'absolute',
                left: this.playerConfig.left,
                top: this.playerConfig.top,
                width: this.playerConfig.width,
                height: this.playerConfig.height,
                borderRadius: '50%',
                zIndex: 100
            }
        }
    }
});