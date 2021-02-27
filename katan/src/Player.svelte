<script>
    import katan from './katan'
    import { onDestroy } from 'svelte';
    import Construction from './Construction.svelte'
    import { toStyle } from './util.js'

    export let playerIndex;
    export let type = 'player';

    let player = $katan.playerList[playerIndex];
    let turnClassEnabled = player.turn && type === 'player';
    let modalMode = type === 'modal';

    const getResourceList = () => {
        return [
            {
                'type': 'tree',
                'count': player.resource.tree
            },
            {
                'type': 'mud',
                'count': player.resource.mud
            },
            {
                'type': 'wheat',
                'count': player.resource.wheat
            },
            {
                'type': 'sheep',
                'count': player.resource.sheep
            },
            {
                'type': 'iron',
                'count': player.resource.iron
            }
        ];
    };

    const getPlayerColor = () => {
        if (player.turn) {
            return player.color;
        }

        return 'white';
    };

    const getPlayerStyle = () => {
        return toStyle({
            border: '20px solid ' + getPlayerColor()
        });
    };

    let playerStyle = getPlayerStyle();
    let resourceList = getResourceList();
    let resourceClassName = 'trade-resource';

    const unsubscribe = katan.subscribe(currentKatan => {
        player = currentKatan.playerList[playerIndex];
        playerStyle = getPlayerStyle();
        resourceList = getResourceList();
        turnClassEnabled = player.turn && type === 'player';
    });

    onDestroy(unsubscribe);

    if (katan.construction) {

    }
</script>

<main>
    <table class="trade-resource" style={playerStyle}>
        <tr>
            <td class="name"
                style="background-color:{player.color}">{player.name}</td>
        </tr>
        <tr>
            <td>
                <table class="inner-resource">
                    {#if !modalMode}
                        <tr>
                            <td colspan="3" class="header">점수</td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <table width="100%">
                                    <tr class="point">
                                        <td>마을</td>
                                        <td>도시</td>
                                        <td>최장 교역로</td>
                                        <td>최강 기사단</td>
                                        <td>현재 점수</td>
                                    </tr>
                                    <tr>
                                        <td>{player.point.castle}</td>
                                        <td>{player.point.city}</td>
                                        <td>{player.point.road}</td>
                                        <td>{player.point.knight}</td>
                                        <td>{player.point.sum}</td>
                                    </tr>
                                </table>
                            </td>

                        </tr>
                        <tr>
                            <td colspan="3" class="header">건설</td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <table class="construction" width="100%">
                                    <tr>
                                        <td>마을</td>
                                        <td>도시</td>
                                        <td>도로</td>
                                    </tr>
                                    <tr>
                                        <td>{player.construction.castle}</td>
                                        <td>{player.construction.city}</td>
                                        <td>{player.construction.road}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" class="header">자원</td>
                        </tr>
                    {/if}

                    {#each resourceList as resource}
                        <tr>
                            <td width="80">
                                <img src="{resource.type}_item.png"
                                     class="player_{player.index}_{resource.type}">
                            </td>
                            <td class="number">{resource.count}</td>
                            <td>
                                {#if player.trade[resource.type].enable}
                                    <table class="trade-target-resource">
                                        <tr>
                                            {#each resourceList as tradeResource}
                                                {#if resource.type!==tradeResource.type}
                                                    <td>
                                                        <div>
                                                            <img class="trade-resource" src="{tradeResource.type}_item.png">
                                                            <button class="btn btn-primary btn-sm"
                                                                    on:click={()=>katan.exchange(player, resource.type, tradeResource.type)}>
                                                                {player.trade[resource.type].count}:1 교환
                                                            </button>
                                                        </div>
                                                    </td>
                                                {/if}
                                            {/each}
                                        </tr>
                                    </table>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </table>
            </td>
        </tr>
        <tr>
            <td class="header">건설</td>
        </tr>
        <tr>
            <td>
                <Construction/>
            </td>
        </tr>
    </table>
</main>

<style>
    .resource td {
        text-align: center;
    }

    .resource img {
        width: 100px;
        height: 100px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 4px;
    }

    .trade-resource img {
        width: 60px;
        height: 60px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 4px;
    }

    .number {
        line-height: 100px;
        font-size: 60px;
        font-weight: 600;
        width: 80px;
    }

    .trade-resource {
        width:600px;
    }
    .trade-resource .number {
        line-height: 40px;
        font-size: 40px;
        font-weight: 600;
        width: 80px;
        text-align: center;
    }

    .name {
        font-weight: bolder;
        font-size: 20px;
        color: white;
    }

    .header {
        background-color: lightskyblue;
    }

    .construction, .construction td {
        border: 1px solid lightskyblue;
    }

    td {
        border: 1px solid lightskyblue;
    }

    .trade-target-resource td {
        border: unset;
    }
    .construction-resource img {
        width: 60px;
        height: 60px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 4px;
    }

    table.inner-resource {
        width: 100%;
    }

    button {
        margin: 2px;
    }
</style>