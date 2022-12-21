<script>
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
</script>

<div class="board">
    <div class="source">
        <Player playerIndex="0"></Player>
        <Player playerIndex="1"></Player>
    </div>
    <div class="port">
        {#each $gameStore.boatList as boat}
            <div class="boat">
                {#each boat.maxStoneCount.range() as stoneIndex}
                    <div class="stone"
                         class:boat_stone_fill={stoneIndex < boat.stoneCount}>
                        {stoneIndex}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
    <div class="destination">
        <div class="region"></div>
        <div class="region"></div>
        <div class="region"></div>
        <div class="region"></div>
        <div class="region"></div>
    </div>
</div>