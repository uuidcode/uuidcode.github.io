<script>
    import katan from './katan'
    import Construction from './Construction.svelte'
    import { toStyle } from './util.js'

    export let playerIndex;

    const getResourceList = (player) => {
        return $katan.resourceTypeList
            .map(typeObject => ({
                type: typeObject.type,
                count: player.resource[typeObject.type]
            }));
    };

    const getPlayerColor = () => {
        if (player.turn) {
            return player.color;
        }

        return 'white';
    };

    const getPlayerStyle = () => {
        return toStyle({
            border: '10px solid ' + getPlayerColor()
        });
    };

    let player;
    let playerList;
    let playerStyle;
    let resourceList;

    $: {
        playerList = $katan.playerList;
        player = playerList[playerIndex];
        playerStyle = getPlayerStyle();
        resourceList = getResourceList(player);
    }
</script>

<main>
    <table class="trade-resource" style="{playerStyle}"
           cellspacing="0" cellpadding="0">
        <tr>
            <td class="name"
                style="background-color:{player.color}">
                <div class="player-header"><img src={player.image} alt=""></div>
                <div class="player-header player-sum">점수 {player.point.sum} 자원 {player.resourceSum}</div>
            </td>
        </tr>
        <tr>
            <td>
                <table class="inner-resource">
                    <tr>
                        <td colspan="3" class="header">점수</td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <table width="100%">

                                <tr class="point">
                                    <td>마을</td>
                                    <td>도시</td>
                                    <td>발전</td>
                                    <td>최장 교역로</td>
                                    <td>최강 기사단</td>
                                </tr>
                                <tr>
                                    <td>{player.point.castle}</td>
                                    <td>{player.point.city}</td>
                                    <td>{player.point.point}</td>
                                    <td>{player.point.road}</td>
                                    <td>{player.point.knight}</td>
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
                                    <td>기사</td>
                                    <td>최장도로</td>
                                </tr>
                                <tr>
                                    <td>{player.construction.castle} / 5</td>
                                    <td>{player.construction.city} / 4</td>
                                    <td>{player.construction.road} / 15</td>
                                    <td>{player.construction.knight}</td>
                                    <td>{player.maxRoadLength}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td colspan="3" class="header">자원</td>
                    </tr>

                    {#each resourceList as resource}
                        <tr>
                            <td width="80">
                                <div class="resource-item">
                                    <img src="{resource.type}_item.png" alt=""
                                         on:click={()=>katan.plus(playerIndex, resource.type)}
                                         class="resource player_{player.index}_{resource.type}">
                                    <div class="trade-ratio">{player.trade[resource.type].count}:1</div>
                                </div>
                            </td>
                            <td class="number">{resource.count}</td>
                            <td>
                                {#if $katan.isGetResource && $katan.playerIndex === playerIndex}
                                    <button class="get-resource-button btn btn-primary btn-sm"
                                            on:click={()=>katan.getResource(resource.type)}>
                                        받기
                                    </button>
                                {:else}
                                    {#if player.trade[resource.type].enable}
                                        <table class="trade-target-resource">
                                            <tr>
                                                {#each resourceList as tradeResource}
                                                    {#if resource.type!==tradeResource.type}
                                                        <td>
                                                            <div>
                                                                <img class="trade-resource" src="{tradeResource.type}_item.png" alt="">
                                                                <button class="trade-button btn btn-primary btn-sm"
                                                                        disabled={!player.trade[resource.type].action}
                                                                        on:click={()=>katan.exchange(resource.type, tradeResource.type)}>
                                                                    {player.trade[resource.type].count}:1교환
                                                                </button>
                                                            </div>
                                                        </td>
                                                    {/if}
                                                {/each}
                                            </tr>
                                        </table>
                                    {/if}
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
                <Construction playerIndex={playerIndex}></Construction>
            </td>
        </tr>
    </table>
</main>

<style>
    img.resource {
        width: 74px;
        height: 74px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 2px;
    }

    img.trade-resource {
        width: 40px;
        height: 40px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 2px;
    }

    .number {
        line-height: 100px;
        font-size: 60px;
        font-weight: 600;
        width: 40px;
    }

    .trade-resource {
        border-spacing: 0;
        width: 430px;
    }

    .trade-resource .number {
        line-height: 40px;
        font-size: 40px;
        font-weight: 600;
        width: 40px;
        text-align: center;
    }

    .name {
        font-weight: bolder;
        font-size: 12px;
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
        font-size: 14px;
        font-weight: bolder;
    }

    button {
        font-size: 20px !important;
    }

    button.trade-button {
        font-size: 12px !important;
    }

    .trade-target-resource td {
        border: unset;
    }

    table.inner-resource {
        width: 100%;
        border-spacing: 0;
    }

    button {
        margin: 2px;
    }

    .player-header {
        display: inline-block;
        vertical-align: top;
        font-size: 45px;
        line-height: 70px;
        height: 70px;
    }

    .player-header img {
        width: 60px;
        height: 60px;
    }

    .player-sum {
        margin-left: 5px;
    }

    .resource-item {
        position: relative;
    }

    .trade-ratio {
        position: absolute;
        bottom: 0;
        height: 20px;
        left: 0;
        opacity: 0.4;
        background-color: black;
        color: white;
        font-size: 20px;
        font-weight: bolder;
        line-height: 20px;
        width: 90%;
        margin: 4px;
        text-align: center;
    }

    .get-resource-button {
        margin: 10px;
    }
</style>