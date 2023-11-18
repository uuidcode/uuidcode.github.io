<script>
import gameStore from './gameStore.js'

gameStore.init();

</script>

<div class="board">
    <div class="part player-part">
        {#each $gameStore.playerList as player}
            <div class="player" class:active={player.active}>
                <div>{player.name}</div>
                <div>
                    {#each player.stoneList as stone, i}
                        <div class="player-stone"
                             style:background={player.color}
                             style="{stone.style}"></div>
                    {/each}
                </div>
                <div>
                    {#if player.canGet}
                        <button on:click={e => gameStore.getStone(player)}>가져오기</button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    <div class="part sea-part">
        {#each $gameStore.boatList as boat}
            <div class="boat" bind:this={boat.element}>
                <div>{boat.minStone}/{boat.maxStone}</div>
                <div class="boat-load">
                    {#each boat.stoneList as stone, i}
                        <div class="player-stone"
                             style:background={stone.color}
                             style="{stone.style}"></div>
                    {/each}
                </div>
                <div>
                    {#if boat.canLoad}
                        <button on:click={e => gameStore.load(boat)}>싣기</button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    <div class="part land-part"></div>
</div>