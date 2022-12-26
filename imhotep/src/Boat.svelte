<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade} from "./animation";
    const [stoneSend, stoneReceive] = stoneCrossfade;
    const [boatSend, boatReceive] = boatCrossfade;
    // export let boatListIndex;
    export let boatType;

    const send = (node, args) => {
        console.log('>>> node', args);
        console.log('>>> args', args);

        if (boatType === 'source') {
            boatSend(node, args);
        }
    }

    const receive = (node, args) => {
        if (boatType === 'source') {
            boatReceive(node, args);
        }
    }

    export let boat;

    // $: {
    //     if (boatType === 'source') {
    //         boat = $gameStore.boatListList[boatListIndex][0];
    //     } else if (boatType === 'destination') {
    //         boat = $gameStore.destinationBoatListList[boatListIndex][0];
    //     }
    // }
</script>

<div in:receive={{key: boat}}
     out:send={{key: boat}}>
    <div class="boat">
        {#each boat.stoneList as stone (stone)}
            <div class="stone"
                 in:stoneReceive={{key: stone}}
                 out:stoneSend={{key: stone}}
                 on:introend={() => gameStore.turn()}
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
</div>