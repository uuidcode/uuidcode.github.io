Vue.component('player', {
    props: ['index'],
    mixins: [coreMixin],
    template: `
        <img :style="getPlayerStyle()" class="live">
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
                left: player.left,
                top: player.top,
                width: player.width,
                height: player.height,
                borderRadius: '50%',
                zIndex: 100
            }
        }
    }
});