<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade} from "./animation";
    const [stoneSend, stoneReceive] = stoneCrossfade;

    export let boat;
    export let boatType;
    let stoneListList;
    let enable;
    let actionType;

    $: {
        stoneListList = boat.stoneListList;
        enable = $gameStore.enable;
        actionType = $gameStore.actionType;
    }

    let firstTurn = true;

    const turn = () => {
        if (firstTurn) {
            firstTurn = false;
            return;
        }

        gameStore.turn();
        firstTurn = true;
    }
</script>

<div class="boat">
    {#each stoneListList as stoneList}
        <div class:boat_stone_empty={stoneList.length === 0}>
            {#each stoneList as stone (stone)}
                <div class="stone"
                     in:stoneReceive={{key: stone}}
                     on:introend={turn}
                     style="background-color: {stone.color}">
                </div>
            {/each}
        </div>
    {/each}

    {#if !boat.arrived && $gameStore.enable}
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
