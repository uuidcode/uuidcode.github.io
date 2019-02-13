Vue.component('player', {
    props: ['index'],
    mixins: [coreMixin],
    template: `
        <img id="player-{{index}}" :style="getPlayerStyle()" 
        :class="getPlayerClass()"
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
                left: player.left,
                top: player.top,
                width: player.width,
                height: player.height,
                borderRadius: '50%',
                zIndex: 100
            }
        },
        getPlayerClass() {
            var direction = this.getDirection();
            return {
                top: 'top' === direction,
                right: 'right' === direction,
                bottom: 'bottom' === direction,
                left: 'left' === direction,
                live: true
            }
        }
    },
    mounted() {
        $(`#player-${this.index}`).on('animationend', function () {
            EventBus.$emit('message', {
                type: 'arrive'
            })
        });
    }
});