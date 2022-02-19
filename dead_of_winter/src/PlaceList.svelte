<script>
    import gameStore from "./gameStore";
    import PlaceLeft from "./PlaceLeft.svelte";
    import PlaceRight from "./PlaceRight.svelte";
    import PlaceCenter from "./PlaceCenter.svelte";
    import Place from "./Place.svelte";

    let placeList;
    let currentRiskCard;
    let successRiskCardCount;

    $: {
        placeList = $gameStore.placeList;
        currentRiskCard = $gameStore.currentRiskCard;
        successRiskCardCount = $gameStore.successRiskCardCount;
    }
</script>

<div class="flex-column">
    <div style="display: flex;justify-content: space-evenly">
        <table class="game-table" style="margin: 10px 10px 0 10px">
            <tr>
                <td class="active">횟수</td>
                <td>{$gameStore.turn}</td>
                <td class="active">라운드</td>
                <td>{$gameStore.round}</td>
                <td class="active">사기</td>
                <td>{$gameStore.moral}</td>
                <td class="active">생존자</td>
                <td>{$gameStore.survivorCount}</td>
                <td class="active">죽은 생존자</td>
                <td>{$gameStore.deadSurvivorCount}</td>
                <td class="active">좀비</td>
                <td>{$gameStore.zombieCount}</td>
                <td class="active">좀비토큰</td>
                <td>{$gameStore.zombieTokenCount}</td>
                <td class="active">죽은 좀비토큰</td>
                <td>{$gameStore.deadZombieCount}</td>
            </tr>
        </table>

        <table class="game-table" style="margin: 10px 10px 0 10px">
            <tr>
                <td>위기상항카드</td>
                <td>행동주사위</td>
                <td>공격, 검색, 능력 사용, 바리케이트 설치, 쓰레기 처분, 좀비 유인, 식사, 이동, 위기대응, 카드사용</td>
                <td>완료</td>
            </tr>
        </table>
    </div>
    <div class="flex" style="padding: 10px;justify-content: space-evenly">
        {#each placeList as place, placeIndex}
            <div class="flex place-header {gameStore.getPlaceClassName(place)}" on:click={gameStore.changePlaceByName(place.name)}>
                {#if place.name == '피난기지'}
                    <table>
                        <tr>
                            <td colspan="4">{place.name} {place.index + 1}</td>
                        </tr>
                        <tr>
                            <td>좀비수</td>
                            <td>{place.currentZombieCount}/{place.maxZombieCount}</td>
                            <td>바리케이트수</td>
                            <td>{place.currentBarricadeCount}/{place.maxZombieCount}</td>
                        </tr>
                        <tr>
                            <td>생존자수</td>
                            <td>{place.survivorList.length}/{place.maxSurvivorCount}</td>
                            <td>식량</td>
                            <td>{place.foodCount}</td>
                        </tr>
                        <tr>
                            <td>굶주림 토큰</td>
                            <td>{place.starvingTokenCount}</td>
                            <td>쓰레기</td>
                            <td>{place.trashCount}</td>
                        </tr>
                    </table>
                {:else}
                    <table>
                        <tr>
                            <td colspan="2">{place.name} {place.index + 1}</td>
                        </tr>
                        <tr>
                            <td>좀비수</td>
                            <td>{place.currentZombieCount}/{place.maxZombieCount}</td>
                        </tr>
                        <tr>
                            <td>바리케이트수</td>
                            <td>{place.currentBarricadeCount}/{place.maxZombieCount}</td>
                        </tr>
                        <tr>
                            <td>생존자수</td>
                            <td>{place.survivorList.length}/{place.maxSurvivorCount}</td>
                        </tr>
                        <tr>
                            <td>아이템카드수</td>
                            <td>{place.itemCardList.length}</td>
                        </tr>
                    </table>
                {/if}
            </div>
        {/each}

        <button class="game-button dice action-button" disabled={!$gameStore.riskCard}
                style="width: 100px"
                on:click={()=>gameStore.choiceRiskCard()}>
                위기사항카드
        </button>

        <button class="game-button dice action-button" disabled={!$gameStore.rollDice}
                style="width: 100px"
                on:click={()=>gameStore.rollActionDice()}>행동 주사위</button>

        <button class="game-button dice action-button" disabled={!$gameStore.dangerDice}
                style="width: 100px"
                on:click={()=>gameStore.rollDangerActionDice()}>위험 노출<br/>주사위</button>

        <button class="game-button action-button" disabled={!$gameStore.canTurn}
                style="width: 100px"
                on:click={()=>gameStore.turn()}>완료</button>

    </div>
    {#if currentRiskCard != null}
        <div style="display: flex;justify-content: center;margin: 10px;background-color: #0f6674;color:white">
        <div style="font-size: 20px;">{currentRiskCard.name} 처리된 카드수 : {successRiskCardCount}</div>
        </div>
    {/if}

    <div class="place-container">
    {#each placeList as place, placeIndex}
        <div class="place-container {place.activeClassName}">
            <Place placeIndex={placeIndex}></Place>
        </div>
    {/each}
    </div>
</div>