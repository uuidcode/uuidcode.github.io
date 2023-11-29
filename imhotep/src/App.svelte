<script>
import gameStore from './gameStore.js'
import Land from "./Land.svelte";
import Boat from "./Boat.svelte";
import Sortable from 'sortablejs';
import { afterUpdate } from 'svelte'

let boatList = [];

afterUpdate(() => {
    boatList.forEach(boat => {
        new Sortable(boat);
    })
})

gameStore.init();

</script>

<div class="board">
    <div class="part player-part">
        {#each $gameStore.playerList as player}
            <div class="player" class:active={player.active}>
                <div class="player-name">{player.name}
                    {#if player.useTool}
                         - {player.useToolName} 사용중
                    {/if}
                </div>
                <div class="player-tool">망치 : {player.hammerCount}<br>
                    석재 3개를 받고 석재 1개를 배 1척에 싣습니다.
                    {#if player.canUseHammer}
                        <br><button on:click={e => gameStore.useHammer()}>사용</button>
                    {/if}
                </div>
                <div class="player-tool">끌 : {player.chiselCount}<br>
                    배 1척에 석재 2개를 싣습니다. 배 2척에 각각 석재 1개를 싣습니다.
                    {#if player.canUseChisel}
                        <br><button on:click={e => gameStore.useChisel()}>사용</button>
                    {/if}
                </div>
                <div class="player-tool">돛 : {player.sailCount}<br>
                    배 1척에 석재 1개를 싣고 그 배를 항구로 보냅니다.
                    {#if player.canUseSail}
                        <br><button on:click={e => gameStore.useSail()}>사용</button>
                    {/if}
                </div>
                <div class="player-tool">지렛대 : {player.leverCount}<br>
                    배 한척을 빈 항구로 옮깁니다. 석재 내리는 순서를 마음대로 바꿉니다.
                    {#if player.canUseLever}
                        <br><button on:click={e => gameStore.useLever()}>사용</button>
                    {/if}
                </div>
                <div>
                    {#each player.stoneList as stone, i}
                        <div class="player-stone"
                             style:background={player.color}
                             style="{stone.style}"></div>
                    {/each}
                </div>
                <div>
                    {#if player.canGetStone}
                        <button on:click={() => gameStore.getStoneAndNextTure(player)}>가져오기</button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    <div class="part sea-part">
        {#each $gameStore.boatList as boat, boatIndex}
            <Boat boat={boat}></Boat>
        {/each}
    </div>
    <Land/>
</div>