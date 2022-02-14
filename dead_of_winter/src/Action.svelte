<script>
    import gameStore from "./gameStore";

    let currentPlayer;

    $: {
        currentPlayer = gameStore.getCurrentPlayer($gameStore);
    }
</script>
<table class="game-info">
    <tr>
        <td class="active" width="100">라운드</td>
        <td width="100">{$gameStore.round}</td>
        <td class="active" width="100">사기</td>
        <td width="100">{$gameStore.moral}</td>
        <td class="active" width="100">생존자</td>
        <td width="100">{$gameStore.survivorCount}</td>
        <td class="active" width="100">좀비</td>
        <td width="100">{$gameStore.zombieCount}</td>
        <td class="active" width="100">아이템</td>
        <td width="100">{$gameStore.itemCardCount}</td>
    </tr>
    <tr>
        <td class="active" width="100">죽은 생존자</td>
        <td width="100">{$gameStore.deadSurvivorCount}</td>
        <td class="active" width="100">죽은 좀비</td>
        <td width="100">{$gameStore.deadZombieCount}</td>
        <td class="active" width="100">생존자</td>
        <td width="100">{$gameStore.survivorCount}</td>
        <td class="active" width="100">좀비 토큰</td>
        <td width="100">{$gameStore.zombieTokenCount}</td>
        <td class="active" width="100">아이템</td>
        <td width="100">{$gameStore.itemCardCount}</td>
    </tr>
</table>
<table class="action-panel">
    <tr>
        <td colspan="8">
            <button class="game-button dice"
                on:click={()=>gameStore.rollActionDice()}>행동 주사기 굴리기</button>
    </tr>
    <tr>
        <td width="50">주사위</td>
        <td class="no-action-dice" style="background-color: lightskyblue">식사</td>
        <td class="action-dice" style="background-color: lightsalmon">공격</td>
        <td class="action-dice" style="background-color: lightsalmon">검색</td>
        <td class="action-dice" style="background-color: lightsalmon">바리케이트 설치</td>
        <td class="action-dice" style="background-color: lightsalmon">쓰레기 처분</td>
        <td class="action-dice" style="background-color: lightsalmon">좀비 유인</td>
    </tr>
    {#each currentPlayer.actionTable as action}
        <tr>
           <td>{action.power}</td>
            <td><button>+1</button></td>
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
        </tr>
    {/each}
</table>