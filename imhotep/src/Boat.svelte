<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade} from "./animation";

    const [stoneSend, stoneReceive] = boatCrossfade;

    export let boat;
</script>

{#each boat.maxStoneCount.range() as stoneIndex (stoneIndex)}
    <div class="stone"
         animate:flip
         in:stoneReceive={{key: stoneIndex}}
         out:stoneSend={{key: stoneIndex}}
         class:boat_stone_fill={stoneIndex < boat.stoneCount}>
        {stoneIndex}
    </div>
{/each}

<div>
    {#if boat.loadable}
        <button on:click={() => gameStore.load(boat)}>싣기</button>
    {/if}

    {#if !boat.arrived}
        {#each boat.destinationList as destination}
            <button on:click={() => gameStore.move(boat, destination)}>{destination.name}로 출발</button>
        {/each}
    {/if}
</div>
