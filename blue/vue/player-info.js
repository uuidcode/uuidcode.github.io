Vue.component('player-info', {
    props: ['index'],
    mixins: [coreMixin],
    template: `
        <div class="modal show" tabindex="-1" role="dialog" v-bind:style="getModalStyle()">
            <div class="modal-dialog shadow" role="document" v-bind:style="getModalDialogStyle()">
                <div class="modal-content">
                    <div class="modal-body player-modal-body" style="overflow-y: auto" v-bind:style="getModalBodyStyle()">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-4 text-center" style="padding: 0">
                                    <img :src="player.image" class="player-image" width="40" height="40">
                                    <span class="player-name">{{player.name}}</span>
                                    <span class="badge badge-primary ticket" style="display: none"></span>
                                    <span class="badge badge-primary escape-ticket" style="display: none"></span>
                                </div>
                                <div class="col-md-6 m-auto text-center">
                                    <span class="amount">{{player.name}}</span>
                                </div>
                                <div class="col-md-2 m-auto text-center">
                                    <span class="badge badge-primary place-count">{{player.getDisplayAmount}}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <table class="table">
                                        <tbody class="nationContainer">
                                        <tr v-for="(place, index) in getPlaceList()">
                                            <td class="flag"><img :src="getImageUrl(place.code)" width="35" height="20" style="border:1px solid black"></td>
                                            <td class="name">{{place.name}}</td>
                                            <td class="building-amount">{{place.price}}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            player: config.playerList[this.index]
        }
    },
    methods: {
        getModalStyle() {
            var left = config.die.margin +
                config.place.width +
                config.die.width +
                config.playerInfo.left +
                (config.playerInfo.width + config.playerInfo.left) * this.index;

            var top = config.place.height + config.playerInfo.top;

            return {
                position: 'absolute',
                display: 'block',
                width: config.playerInfo.width + 'px',
                height: config.playerInfo.height + 'px',
                left: left + 'px',
                top: top + 'px'
            }
        },
        getModalDialogStyle() {
            return {
                margin: 0
            }
        },
        getModalBodyStyle() {
            return {
                maxHeight: config.playerInfo.height
            }
        }
    }
});