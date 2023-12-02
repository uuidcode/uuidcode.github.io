<script>
    import gameStore from './gameStore.js'
</script>

<div class="part land-part">
    <div class="info">{$gameStore.leftTurn}번 남았습니다.</div>
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
        {:else if i === 2}
            <div class="land">
                <div>{land.name}</div>
                {#each land.stoneList as stoneList}
                    <div style="height:50px">
                        {#each stoneList as stone, i}
                            <div class="wall_stone" style="background:{stone.color}"></div>
                        {/each}
                    </div>
                {/each}
            </div>
        {:else if i === 1}
            <div class="land">
                <div>{land.name}</div>
                {#each land.stoneList as stoneList}
                    <div style="height:50px">
                        {#each stoneList as stone, i}
                            <div class="wall_stone" style="background:{stone.color}"></div>
                        {/each}
                    </div>
                {/each}
            </div>
        {:else if i === 0}
            <div class="land">
                <div>{land.name}</div>
                {#each land.itemList as item}
                    <div class="item">
                        {item.name}<br>
                        {item.description}
                    </div>
                {/each}
            </div>
        {/if}
    {/each}
</div>