<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade} from "./animation";
    const [stoneSend, stoneReceive] = stoneCrossfade;

    export let boatType;

    const _stoneSend = (node, args) => {
        stoneSend(node, args);
        if (boatType === 'source') {
        }
    }

    const _stoneReceive = (node, args) => {
        stoneReceive(node, args);
        if (boatType === 'source') {
        }
    }

    export let boat;
    let stoneList;
    let enable;

    $: {
        stoneList = boat.stoneList.reverse();
        enable = $gameStore.enable;
    }
</script>


<div class="boat">
    {#each stoneList as stone (stone)}
        <div class="stone"
             in:stoneReceive={{key: stone}}
             out:stoneSend={{key: stone}}
             on:introend={() => gameStore.turn2()}
             style="background-color: {stone.color}"
             class:boat_stone_empty={stone.empty}>
            {stone.index}
        </div>
    {/each}

    {#if !boat.arrived && !boat.empty && enable}
        <div class="boat-action">
        {#if boat.loadable && !$gameStore.disabled && !boat.arrived}
            <button style:background-color={$gameStore.currentPlayer.color}
                disabled='{$gameStore.disabled}'
                on:click={() => gameStore.load(boat)}>싣기</button>
        {/if}

            {#each boat.destinationList as destination}
                <button style:background-color={$gameStore.currentPlayer.color}
                    disabled='{$gameStore.disabled}'
                    on:click={() => gameStore.move(boat, destination)}>{destination.name}로 출발</button>
            {/each}
        </div>
    {/if}
</div>
