<script>
    import {flip} from 'svelte/animate';
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
    import Boat from "./Boat.svelte";
    import {boatCrossfade} from "./animation";
    const [boatSend, boatReceive] = boatCrossfade;

    let destinationList;
    let destinationBoatList;

    $: {
        destinationList = $gameStore.destinationList;
        destinationBoatList = $gameStore.destinationBoatList;
    }
</script>

<div class="board">
    <div class="source">
        <Player playerIndex="0"></Player>
        <Player playerIndex="1"></Player>
    </div>
    <div class="port source-port">
        {#each $gameStore.boatList as boat (boat)}
            <div class="boat"
                 animate:flip
                 in:boatReceive={{key: boat}}
                 out:boatSend={{key: boat}}
                 on:click={() => gameStore.clickBoat(boat.index)}>
                <Boat boat={boat}></Boat>
            </div>
        {/each}
    </div>
    <div class="port destination-port">
        {#each destinationBoatList as destinationBoat (destinationBoat)}
            <div class="boat"
                 animate:flip
                 in:boatReceive={{key: destinationBoat}}
                 out:boatSend={{key: destinationBoat}}>
                <Boat boat={destinationBoat}></Boat>
            </div>
        {/each}
    </div>
    <div class="destination-container">
        {#each destinationList as destination}
            <div class="destination"></div>
        {/each}
    </div>
</div>