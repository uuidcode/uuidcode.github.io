<script>
    import gameStore from "./gameStore";
    export let boat;
</script>

{#each boat.maxStoneCount.range() as stoneIndex}
    <div class="stone"
         class:boat_stone_fill={stoneIndex < boat.stoneCount}>
        {stoneIndex}
    </div>
{/each}

<div>
    {#if boat.loadable}
        <button on:click={() => gameStore.load(boat)}>실기</button>
    {/if}
    {#each boat.destinationList as destination}
        <button>{destination.name}로 출발</button>
    {/each}
</div>
