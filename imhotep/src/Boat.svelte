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
    let stoneListList;
    let enable;

    $: {
        stoneListList = boat.stoneListList;
        enable = $gameStore.enable;
    }
</script>

<div class="boat">
    {#each stoneListList as stoneList}
        <div class:boat_stone_empty={stoneList.length === 0}>
            {#each stoneList as stone (stone)}
                <div class="stone"
                     in:_stoneReceive={{key: stone}}
                     out:_stoneSend={{key: stone}}
                     on:introend={() => gameStore.turn2()}
                     style="background-color: {stone.color}">
                    {stone.index}
                </div>
            {/each}
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
