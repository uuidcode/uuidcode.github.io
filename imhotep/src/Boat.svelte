<script>
    export let boat;
</script>

{#each boat.maxStoneCount.range() as stoneIndex}
    <div class="stone"
         class:boat_stone_fill={stoneIndex < boat.stoneCount}>
        {stoneIndex}
    </div>
{/each}