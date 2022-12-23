<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade} from "./animation";

    const [stoneSend, stoneReceive] = boatCrossfade;

    export let playerIndex;

    let player;

    $: {
        player = $gameStore.playerList[playerIndex];
    }
</script>

<div class="player">
    {#each $gameStore.playerList[playerIndex].stoneList as stoneIndex (stoneIndex)}
        <div class="stone"
             animate:flip
             in:stoneReceive={{key: stoneIndex}}
             out:stoneSend={{key: stoneIndex}}
            >
            {stoneIndex}
        </div>
    {/each}

    <div class="action">
        {#if player.canGetStone}
            <button>돌 가져오기</button>
        {/if}
    </div>
</div>