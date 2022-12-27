<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade} from "./animation";
    const [stoneSend, stoneReceive] = stoneCrossfade;

    export let playerIndex;

    let player;

    $: {
        player = $gameStore.playerList[playerIndex];
    }
</script>

<div class="player">
    <div class="player-title">{player.name}</div>
    <div class="player-stone-container">
        {#each $gameStore.playerList[playerIndex].stoneList as stone (stone)}
            <div class="stone"
                 animate:flip
                 in:stoneReceive={{key: stone}}
                 out:stoneSend={{key: stone}}
                 style="background-color: {$gameStore.playerList[stone.playerIndex].color}"
                >
            </div>
        {/each}
    </div>

    <div class="action">
        {#if player.canGetStone}
            <button on:click={() => gameStore.getStone()}
                    style="background-color: {gameStore.getCurrentPlayerColor()}">돌 가져오기</button>
        {/if}
    </div>
</div>