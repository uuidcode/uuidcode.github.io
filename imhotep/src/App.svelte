<script>
    import {flip} from 'svelte/animate';
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
    import Boat from "./Boat.svelte";
    import {boatCrossfade} from "./animation";

    const [boatSend, boatReceive] = boatCrossfade;

    let destinationList;
    let destinationBoatList;
    let boatList;

    $: {
        destinationList = $gameStore.destinationList;
        destinationBoatList = $gameStore.destinationBoatList;
        boatList = $gameStore.boatList;
    }
</script>

<div class="board">
    <div class="source">
        <Player playerIndex="0"></Player>
        <Player playerIndex="1"></Player>
    </div>
    <div class="port source-port">
        {#each boatList as boat (boat)}
            <div animate:flip
                 in:boatReceive={{key: boat}}
                 out:boatSend={{key: boat}}>
                <Boat boat={boat}></Boat>
            </div>
        {/each}
    </div>
    <div class="port destination-port">
        {#each destinationBoatList as boat (boat)}
            <div animate:flip
                 in:boatReceive={{key: boat}}
                 out:boatSend={{key: boat}}>
                <Boat boat={boat}></Boat>
            </div>
        {/each}
    </div>
    <div class="destination-container">
        {#each destinationList as destination}
            <div class="destination">{destination.name}</div>
        {/each}
    </div>
</div>