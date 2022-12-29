<script>
    import { fade, scale, fly } from 'svelte/transition';
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {boatCrossfade, stoneCrossfade, newStoneCrossfade} from "./animation";
    const [newStoneSend, newStoneReceive] = newStoneCrossfade;
    const [stoneSend, stoneReceive] = stoneCrossfade;

    export let playerIndex;

    let player;

    $: {
        player = $gameStore.playerList[playerIndex];
    }

    const _stoneReceive = (node, args) => {
        if ($gameStore.actionType === 'getStone') {
            newStoneReceive(node, args);
            return;
        }

        stoneReceive(node, args);
    }

    let turnCount = 1;

    const turn = () => {
        if (turnCount === 3) {
            gameStore.turn();
            turnCount = 1;
            return;
        }

        turnCount++;
    }
</script>

<div class="player">
    <div class="player-title">{player.name}</div>
    <div class="player-stone-container">
        {#each $gameStore.playerList[playerIndex].stoneListList as stoneList}
            <div class:player_stone_empty={stoneList.length === 0}>
                {#each stoneList as stone (stone)}
                    <div class="stone"
                         animate:flip
                         in:fly="{{ x: -100, duration: 1000 }}"
                         out:stoneSend={{key: stone}}
                         on:introend={turn}
                         style="background-color: {$gameStore.playerList[stone.playerIndex].color}"
                        >
                    </div>
                {/each}
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