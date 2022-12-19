<script>
    import gameStore from "./gameStore";

    export let playerIndex;
</script>

<div class="player">
    {#each $gameStore.playerList[playerIndex].stoneCount.range() as stoneIndex}
        <div class="stone">
            {stoneIndex}
        </div>
    {/each}
</div>