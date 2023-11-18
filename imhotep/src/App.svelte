<script>
import { afterUpdate } from 'svelte';
import gameStore from './gameStore.js'

afterUpdate(() => {

});
</script>

<div class="board">
    <div class="part player-part">
        {#each $gameStore.playerList as player}
            <div class="player">
                {#each player.stoneList as stone, i}
                    <div class="player-stone"
                         bind:this={stone.element}
                         style="{stone.style}">{i}</div>
                {/each}
                <div>{player.name}</div>
            </div>
        {/each}
    </div>
    <div class="part sea-part">
        {#each $gameStore.boatList as boat}
            <div class="boat" bind:this={boat.element}>
                <div class="boat-load"></div>
                <div>
                    <button
                        on:animationend={e => gameStore.loadEnd(boat)}
                        on:click={e => gameStore.load(boat)}>싣기</button>
                </div>
            </div>
        {/each}
    </div>
    <div class="part land-part"></div>
</div>