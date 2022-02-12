<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";
    import ItemCard from "./ItemCard.svelte";

    export let playerIndex;

    let player;
    let playerList;
    let survivorList;
    let itemCardTable;
    let itemCardList;

    $: {
        playerList = $gameStore.playerList;
        player = playerList[playerIndex];
        survivorList = player.survivorList;
        itemCardTable = player.itemCardTable;
        itemCardList = player.itemCardList;
    }
</script>

<table>
    <tr>
        <table class="player-header">
            <tr>
                <td>{player.name}</td>
                <td class="active">생존자</td>
                <td>{survivorList.length}</td>
                <td class="active">아이템</td>
                <td>{itemCardList.length}</td>
            </tr>
        </table>
    </tr>
    <tr>
        <td valign="top" width="260">
            {#each survivorList as survivor}
                <Survivor survivor={survivor}></Survivor>
            {/each}
        </td>
        <td valign="top" width="260">
            {#each itemCardTable as itemCardRow}
                <ItemCard itemCardRow={itemCardRow}></ItemCard>
            {/each}
        </td>
    </tr>
</table>

