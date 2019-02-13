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

                var playerClass = {
                    top: 'top' === direction,
                    right: 'right' === direction,
                    bottom: 'bottom' === direction,
                    left: 'left' === direction,
                    live: false
                };

                player.playerClass = playerClass;
            } else if (message.type === 'arrive') {
                var position = self.getPlayerPosition(player);
                player.position = (player.position + 1) % 40;
                player.left = position.left;
                player.top = position.top;

                console.log('>>> position', position);

                var playerClass = {
                    top: false,
                    right: false,
                    bottom: false,
                    left: false,
                    live: true
                };
                player.playerClass = playerClass;

                if (player.move.count > 1) {
                    setTimeout(function () {
                        self.sendMessage({
                            type: 'go',
                            count: player.move.count - 1
                        });
                    }, 100);
                }
            }
        });
    }
});