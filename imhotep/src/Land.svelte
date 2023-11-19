<script>
    import gameStore from './gameStore.js'
</script>

<div class="part land-part">
    {#each $gameStore.landList as land, i}
        {#if i === 4}
            <div class="land">
                <div>{land.name}</div>
                <div>
                    <div class="obelisk_stone">{$gameStore.playerList[0].name} : {$gameStore.playerList[0].obeliskStoneCount}</div>
                    <div class="obelisk_stone">{$gameStore.playerList[1].name} :  {$gameStore.playerList[1].obeliskStoneCount}</div>
                </div>
            </div>
        {:else if i === 3}
            <div class="land">
                <div>{land.name}</div>
                <div>
                    {#each land.stoneList as stone, i}
                        <div class="wall_stone" style="background:{stone.color}"></div>
                    {/each}
                </div>
                <div>
                    <div class="wall_stone">{$gameStore.playerList[0].name} : {$gameStore.playerList[0].wallStoneCount}</div>
                    <div class="wall_stone">{$gameStore.playerList[1].name} : {$gameStore.playerList[1].wallStoneCount}</div>
                </div>
            </div>
        {:else}
            <div class="land">
                <div>{land.name}</div>
                <div class="land-control" bind:this={land.element}></div>
            </div>
        {/if}
    {/each}
</div>