<script>
    import katan from './katan'
    import { onDestroy } from 'svelte';

    export let playerIndex;
    export let type = 'player';

    let player = $katan.playerList[playerIndex];
    let turnClassEnabled = player.turn && type === 'player';
    let modalMode = type === 'modal';
    let colspan = modalMode ? 3 : 2;

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

    let resourceList = getResourceList();

    const unsubscribe = katan.subscribe(currentKatan => {
        player = currentKatan.playerList[playerIndex];
        resourceList = getResourceList();
        turnClassEnabled = player.turn && type === 'player';
    });

    onDestroy(unsubscribe);
</script>

<main>
    <table class="resource" class:turn={turnClassEnabled}>
        <tr>
            <td>
                <table class="inner-resource">
                    <tr>
                        <td colspan="{colspan}"
                            class="name"
                            style="background-color:{player.color}">{player.name}</td>
                    </tr>

                    {#if !modalMode}
                        <tr>
                            <td colspan="2" class="header">점수</td>
                        </tr>
                        <tr class="point">
                            <td>마을</td>
                            <td>{player.point.castle}</td>
                        </tr>
                        <tr>
                            <td>도시</td>
                            <td>{player.point.city}</td>
                        </tr>
                        <tr>
                            <td>최장 교역로</td>
                            <td>{player.point.road}</td>
                        </tr>
                        <tr>
                            <td>최강 기사단</td>
                            <td>{player.point.knight}</td>
                        </tr>
                        <tr>
                            <td>현재 점수</td>
                            <td>{player.point.sum}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="header">건설</td>
                        </tr>
                        <tr>
                            <td colspan="2">
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
                    {/if}

                    <tr>
                        <td colspan="2" class="header">자원</td>
                    </tr>

                    {#each resourceList as resource}
                        <tr>
                            <td>
                                <img src="{resource.type}_item.png"
                                     class="player_{player.index}_{resource.type}">
                            </td>
                            <td class="number">{resource.count}</td>
                            {#if modalMode}
                                <td>
                                    {#if resource.count>=4}
                                        <table class="trade-resource">
                                            <tr>
                                                {#each resourceList as tradeResource}
                                                    {#if resource.type!==tradeResource.type}
                                                        <td><img class="trade-resource" src="{tradeResource.type}_item.png"></td>
                                                    {/if}
                                                {/each}
                                            </tr>
                                            <tr>
                                                {#each resourceList as tradeResource}
                                                    {#if resource.type!==tradeResource.type}
                                                        <td><button class="btn btn-primary btn-sm"
                                                                    on:click={()=>katan.exchange(player, resource.type, tradeResource.type)}>4:1 교환</button></td>
                                                    {/if}
                                                {/each}
                                            </tr>
                                        </table>
                                    {/if}
                                </td>
                            {/if}
                        </tr>
                    {/each}
                </table>
            </td>
        </tr>
    </table>
</main>

<style>
    .resource td {
        text-align: center;
    }

    table.resource {
        border: 20px solid white;
    }

    table.resource.turn {
        border: 20px solid blueviolet;
    }

    .resource img {
        width: 100px;
        height: 100px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 4px;
    }

    .trade-resource  img {
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
</style>