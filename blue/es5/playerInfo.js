function PlayerInfo(player) {
    this.$ui = null;

    this.init = function (player) {
        var blockList = player.getBlockList();

        var data = {
            blockList: blockList,
            player: player
        };

        var html = Handlebars.compile(this.template()).template(data);
        this.$ui = $(html);

        this.$ui.find('.place-count').text(blockList.length);

        if (player.ticketCount > 0) {
            this.$ui.find('.ticket')
                .text('우대권: ' + player.ticketCount)
                .show();
        }

        if (player.escapeTicketCount > 0) {
            this.$ui.find('.ticket')
                .text('무인도 탈출권: ' + player.escapeTicketCount)
                .show();
        }

        this.$ui.find('.modal-dialog').css({
            margin: 0
        });

        this.$ui.find('.modal-body').css({
            maxHeight: config.playerInfo.height
        });

        var left = config.die.margin +
            config.block.width +
            config.die.width +
            config.playerInfo.left +
            (config.playerInfo.width + config.playerInfo.left) * player.index;

        var top = config.block.height + config.playerInfo.top;

        this.$ui.css({
           position: 'absolute',
           display: 'block',
           width: config.playerInfo.width,
           height: config.playerInfo.height,
           left: left,
           top: top
        });
    };

    this.template = function () {
        return `
        <div class="modal show" tabindex="-1" role="dialog">
            <div class="modal-dialog shadow" role="document">
                <div class="modal-content">
                    <div class="modal-body player-modal-body" style="overflow-y: auto">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-4 text-center" style="padding: 0px">
                                    <img src="{{player.getImageUrl}}" class="player-image" width="40" height="40">
                                    <span class="player-name">player.name</span>
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
                                        {{#list blockList}}
                                        <tr>
                                            <td class="flag"><img src={{getImageUrl}}width="35" height="20" style="border:1px solid black"></td>
                                            <td class="name">{{name}}</td>
                                            <td class="building-amount">{{getDisplayAmount}}</td>
                                        </tr>
                                        {{/list}}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    this.init(player);
}