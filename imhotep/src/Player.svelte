<script>
    import gameStore from "./gameStore";

    export let playerIndex;
    let player;

    $: {
        player = $gameStore.playerList[playerIndex];
    }
</script>

<div class="player">
    {#each $gameStore.playerList[playerIndex].stoneCount.range() as stoneIndex}
        <div class="stone">
            {stoneIndex}
        </div>
    {/each}

    <div class="action">
        {#if player.canGetStone}
            <button>돌 가져오기</button>
        {/if}
    </div>
</div>