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
            <td colspan="{colspan}"
                class="name"
                style="background-color:{player.color}">{player.name}</td>
        </tr>
        {#each resourceList as resource}
            <tr>
                <td><img src="{resource.type}_item.png"
                         class="player_{player.index}_{resource.type}"></td>
                <td class="number">{resource.count}</td>
                {#if modalMode}
                    <td>
                        {#if resource.count>=4}
                        <table>
                            <tr>
                                {#each resourceList as tradeResource}
                                    {#if resource.type!==tradeResource.type}
                                        <td><img src="{tradeResource.type}_item.png"></td>
                                    {/if}
                                {/each}
                            </tr>
                            <tr>
                                {#each resourceList as tradeResource}
                                    {#if resource.type!==tradeResource.type}
                                        <td>{resource.count/4}</td>
                                    {/if}
                                {/each}
                            </tr>
                            <tr>
                                {#each resourceList as tradeResource}
                                    {#if resource.type!==tradeResource.type}
                                        <td><button class="btn btn-primary">교환</button></td>
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
</main>

<style>
    .resource td {
        text-align: center;
        border: 1px solid white;
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

    .number {
        line-height: 100px;
        font-size: 60px;
        font-weight: 600;
        width: 40px;
    }

    .name {
        font-weight: bolder;
        font-size: 20px;
        color: white;
    }
</style>