<script>
import gameStore from './gameStore.js'
import Land from "./Land.svelte";

gameStore.init();

</script>

<div class="board">
    <div class="part player-part">
        {#each $gameStore.playerList as player}
            <div class="player" class:active={player.active}>
                <div class="player-name">{player.name}</div>
                <div class="player-tool">망치 : {player.hammerCount}<br>
                    석재 3개를 받고 석재 1개를 배 1척에 싣습니다.</div>
                <div class="player-tool">끌 : {player.chiselCount}<br>
                    배 1척에 석재 2개를 싣습니다. 배 2척에 각각 석재 1개를 싣습니다.</div>
                <div class="player-tool">돛 : {player.sailCount}<br>
                    배 1척에 석재 1개를 싣고 그 배를 항구로 보냅니다.</div>
                <div class="player-tool">지렛대 : {player.leverCount}<br>
                    배 한척을 빈 항구로 옮깁니다. 석재 내리는 순서를 마음대로 바꿉니다.</div>
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
            <div class="boat" bind:this={boat.element} style="{boat.style}">
                <div class="boat-load-max">
                    {#each gameStore.createList(boat.maxStone) as stone, i}
                        <div class="boat-stone"></div>
                    {/each}
                </div>
                <div class="boat-load-min">
                    {#each gameStore.createList(boat.minStone) as stone, i}
                        <div class="boat-min-stone"></div>
                    {/each}
                </div>
                <div class="boat-load">
                    {#each boat.stoneList as stone, i}
                        <div class="player-stone"
                             style:background={stone.color}
                             style="{stone.style}"></div>
                    {/each}
                </div>
                <div class="boat-controller">
                    {#if boat.canLoad}
                        <button on:click={e => gameStore.load(boat)}>싣기</button>
                    {/if}
                    {#if boat.canMoveToMarket}
                        <button on:click={e => gameStore.move(boat, gameStore.getMarket())}>장터</button>
                    {/if}

                    {#if boat.canMoveToPyramid}
                        <button on:click={e => gameStore.move(boat, gameStore.getPyramid())}>피라미드</button>
                    {/if}

                    {#if boat.canMoveToTomb}
                        <button on:click={e => gameStore.move(boat, gameStore.getTomb())}>묘실</button>
                    {/if}

                    {#if boat.canMoveToWall}
                        <button on:click={e => gameStore.move(boat, gameStore.getWall())}>성벽</button>
                    {/if}

                    {#if boat.canMoveToObelisk}
                        <button on:click={e => gameStore.move(boat, gameStore.getObelisk())}>오빌리스크</button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    <Land/>
</div>