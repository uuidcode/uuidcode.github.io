Vue.component('board', {
    mixins: [coreMixin],
    template: `
        <div>
            <die></die>
            <place-container v-for="(place, index) in placeList"
                v-bind:index="index"
                :key="place.index">
            </place-container>
            <player-info v-for="(player, index) in playerList"
                 v-bind:index="index"
                 :key="player.index">
            </player-info>
            <player v-for="(player, index) in playerList"
                 v-bind:index="index"
                 :key="player.index">
            </player>
        </div>
    `,
    data() {
        return {
            placeList: config.placeList,
            playerList: config.playerList
        }
    }
});