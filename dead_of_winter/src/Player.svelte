<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";
    import Card from "./Card.svelte";

    export let playerIndex;

    let player;
    let playerList;
    let survivorIndexList;
    let itemCardTable;

    $: {
        playerList = $gameStore.playerList;
        player = playerList[playerIndex];
        survivorIndexList = player.survivorIndexList;
        itemCardTable = player.itemCardTable;
    }
</script>

<table>
    <tr>
        <td class="active" colspan="2">{player.name}</td>
    </tr>
    <tr>
        <td valign="top">
            <table>
                {#each survivorIndexList as survivorIndex}
                <tr>
                    <td><Survivor survivorIndex={survivorIndex}></Survivor></td>
                </tr>
                {/each}
            </table>
        </td>
        <td valign="top">
            {#each itemCardTable as itemCardRow}
                <Card itemCardRow={itemCardRow}></Card>
            {/each}
        </td>
    </tr>
</table>

