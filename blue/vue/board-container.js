new Vue({
    mixins: [coreMixin],
    el: '#app',
    mounted() {
        var self = this;

        EventBus.$on('message', function (message) {
            var playerIndex = config.turn % config.playerList.length;
            var player = config.playerList[playerIndex];

            console.log('>>> message', message);
            console.log('>>> player', player);

            if (message.type === 'go') {
                var direction = self.getDirection(player);
                player.move.direction = message.type;
                player.move.count = message.count;
                player.playerClass.top = 'top' === direction;
                player.playerClass.right = 'right' === direction;
                player.playerClass.bottom = 'bottom' === direction;
                player.playerClass.left = 'left' === direction;
                player.playerClass.live = false;
            } else if (message.type === 'arrive') {
                if (player.move.count > 0) {
                    player.position = (player.position + 1) % 40;
                    var position = self.getPlayerPosition(player);
                    player.left = position.left + 'px';
                    player.top = position.top + 'px';
                    var playerClass = {
                        top: false,
                        right: false,
                        bottom: false,
                        left: false,
                        live: true
                    };
                    player.playerClass = playerClass;
                    self.sendMessage({
                        type: 'go',
                        count: player.move.count - 1
                    });
                }
            }
        });
    }
});