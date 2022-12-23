<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade} from "./animation";

    const [stoneSend, stoneReceive] = boatCrossfade;

    export let boat;
</script>

{#each boat.stoneList as stone (stone)}
    <div class="stone"
         animate:flip
         in:stoneReceive={{key: stone}}
         out:stoneSend={{key: stone}}
         style="background-color: {gameStore.getStoneColor(stone)}"
         class:boat_stone_empty={stone.empty}>
        {stone.index}
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
