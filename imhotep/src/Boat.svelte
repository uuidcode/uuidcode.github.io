<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade} from "./animation";
    const [stoneSend, stoneReceive] = stoneCrossfade;
    const [boatSend, boatReceive] = boatCrossfade;
    // export let boatListIndex;
    export let boatType;

    const _boatSend = (node, args) => {
        // if (boatType === 'source') {
            boatSend(node, args);
        // }
    }

    const _boatReceive = (node, args) => {
        // if (boatType === 'source') {
            boatReceive(node, args);
        // }
    }

    const _stoneSend = (node, args) => {
        if (boatType === 'source') {
            stoneSend(node, args);
        }
    }

    const _stoneReceive = (node, args) => {
        if (boatType === 'source') {
            stoneReceive(node, args);
        }
    }

    export let boat;
</script>


    <div class="boat">
        {#each boat.stoneList.reverse() as stone (stone)}
            <div class="stone"
                 in:_stoneReceive={{key: stone}}
                 out:_stoneSend={{key: stone}}
                 style="background-color: {stone.color}"
                 class:boat_stone_empty={stone.empty}>
                {stone.index}
            </div>
        {/each}

        {#if !boat.arrived && !boat.empty}
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
