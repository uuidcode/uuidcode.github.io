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

<div class="flex-column player-card-list-section" style="background-color: {gameStore.getCurrentPlayerColor()}">
    <table class="game-table" style="margin: 10px">
        <tr><td>{player.name}</td></tr>
    </table>
    {#each itemCardTable as itemCardRow}
        <ItemCard itemCardRow={itemCardRow}></ItemCard>
    {/each}
</div>

