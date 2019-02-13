Vue.component('player', {
    props: ['index'],
    mixins: [coreMixin],
    template: `
        <img @animationend="arrive" 
            :id="getPlayerId()" 
            :src="player.image" 
            :style="getPlayerStyle()" 
            :class="getPlayerClass()">
    `,
    data: function () {
        return {
            player: config.playerList[this.index]
        }
    },
    methods: {
        getPlayerId() {
            return `player-${this.index}`
        },
        getPlayerStyle() {
            return {
                position: 'absolute',
                left: this.player.left + 'px',
                top: this.player.top + 'px',
                width: this.player.width + 'px',
                height: this.player.height + 'px',
                borderRadius: '50%',
                zIndex: 100
            }
        },
        getPlayerClass() {
            return this.player.playerClass;
        },
        arrive() {
            var self = this;
            setTimeout(function () {
                self.sendMessage({
                    type: 'arrive'
                });
            }, 100);

        }
    }
});