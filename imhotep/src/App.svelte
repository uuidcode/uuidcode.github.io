<script>
    import {flip} from 'svelte/animate';
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
    import Boat from "./Boat.svelte";
    import {boatCrossfade} from "./animation";

    const [boatSend, boatReceive] = boatCrossfade;

    let destinationBoatListList;
    let destinationList;
    let boatListList;

    $: {
        destinationBoatListList = $gameStore.destinationBoatListList;
        destinationList = $gameStore.destinationList;
        boatListList = $gameStore.boatListList;
    }
</script>

<div class="board">
    {$gameStore.turn}
    <div class="source">
        <Player playerIndex="0"></Player>
        <Player playerIndex="1"></Player>
    </div>
    <div class="port source-port">
        {#each boatListList as boatList, boatListIndex}
            <div class="terminal"
                 class:terminal-empty={boatList.length === 0}>
                {#each boatList as b}
                    <div in:boatReceive={{key: b}}
                         out:boatSend={{key: b}}>
                        <Boat boat={b} boatType="source"></Boat>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
    <div class="port destination-port">
        {#each destinationBoatListList as boatList, boatListIndex}
            <div class="terminal"
                 class:terminal-empty={boatList.length === 0}>
                {#each boatList as b}
                    <div in:boatReceive={{key: b}}
                         out:boatSend={{key: b}}
                         on:introend={() => gameStore.turn2()}
                    >
                        <Boat boat={b} boatType="destination"></Boat>
                            </div>
                {/each}
            </div>
        {/each}
    </div>
    <div class="destination-container">
        {#each destinationList as destination}
            <div class="destination">{destination.name}</div>
        {/each}
    </div>
</div>