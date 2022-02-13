<script>
    import gameStore from "./gameStore";

    let currentPlayer;

    $: {
        currentPlayer = gameStore.getCurrentPlayer($gameStore);
    }
</script>
<table class="action-panel"
       cellspacing="0"
       style="background-color: {currentPlayer.color}">
    <tr>
        <td colspan="7"><button class="game-button dice"
                                on:click={()=>gameStore.rollActionDice()}>행동 주사기 굴리기</button></td>
    </tr>
    <tr>
        <td width="50">주사위</td>
        <td>공격</td>
        <td>검색</td>
        <td>바리케이트 설치</td>
        <td>쓰레기 처분</td>
        <td>좀비 유인</td>
        <td>생존자 특수능력</td>
    </tr>
    {#each currentPlayer.actionTable as action}
        <tr>
           <td>{action.dice}</td>
           <td>
               {#each action.attackSurvivorList as survivor}
                   <button>{survivor.index}</button>
               {/each}
           </td>
           <td>
               {#each action.searchSurvivorList as survivor}
                   <button>{survivor.index}</button>
               {/each}
           </td>
            <td>
                {#each action.barricadeSurvivorList as survivor}
                    <button>{survivor.index}</button>
                {/each}
            </td>
            <td>
                {#each action.trashSurvivorList as survivor}
                    <button>{survivor.index}</button>
                {/each}
            </td>
            <td>
                {#each action.inviteZombieSurvivorList as survivor}
                    <button>{survivor.index}</button>
                {/each}
            </td>
           <td></td>
        </tr>
    {/each}
</table>