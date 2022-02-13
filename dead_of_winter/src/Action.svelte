<script>
    import gameStore from "./gameStore";

    let currentPlayer;

    $: {
        currentPlayer = $gameStore.playerList[$gameStore.turn % 2];
    }
</script>
<table class="action-panel" style="background-color: {currentPlayer.color}">
    <tr>
        <td colspan="7"><button class="game-button dice"
                                on:click={()=>gameStore.rollActionDice()}>행동 주사기 굴리기</button></td>
    </tr>
    <tr>
        <td width="200">행동주사위</td>
        <td width="200">공격</td>
        <td width="200">검색</td>
        <td width="200">바리케이트 설치</td>
        <td width="200">쓰레기 처분</td>
        <td width="200">좀비 유인</td>
        <td width="200">생존자 특수능력</td>
    </tr>
    {#each currentPlayer.actionDiceList as dice}
        <tr>
           <td>{dice}</td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td></td>
        </tr>
    {/each}
</table>