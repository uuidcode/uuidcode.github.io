<script>
import gameStore from './gameStore.js'
</script>

<div class="board">
    <div class="part player-part">
        {#each $gameStore.playerList as player}
            <div class="player">
                <div>{player.name}</div>
                {#each player.stoneList as stone, i}
                    <div class="player-stone"
                         on:click={e => gameStore.moveStone(stone, 200, 200)}
                         style="left: {i * 50}px;{stone.style};">{i}</div>
                {/each}
            </div>
        {/each}
    </div>
    <div class="part sea-part">
        {#each $gameStore.boatList as boat}
            <div class="boat">{boat.min}/{boat.max}</div>
        {/each}
    </div>
    <div class="part land-part"></div>
</div>