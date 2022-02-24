<script>
    import gameStore from "./gameStore";
    import Place from "./Place.svelte";
    import {flip} from 'svelte/animate';
    import {itemCardCrossfade, trashCrossfade, foodCrossfade, deadSurvivorCrossfade} from './animation';
    const [send, receive] = itemCardCrossfade;
    const [trashSend, trashReceive] = trashCrossfade;
    const [foodSend, foodReceive] = foodCrossfade;
    const [deadSurvivorSend, deadSurvivorReceive] = deadSurvivorCrossfade;

    let placeList;
    let deadSurvivorList;
    let currentRiskCard;
    let successRiskCardList;
    let camp;
    let actionTable;
    let messageList;

    $: {
        placeList = $gameStore.placeList;
        messageList = $gameStore.messageList;
        deadSurvivorList = $gameStore.deadSurvivorList;
        currentRiskCard = $gameStore.currentRiskCard;
        successRiskCardList = $gameStore.successRiskCardList;
        camp = $gameStore.placeList.find(place => place.name === '피난기지');
        actionTable = $gameStore.actionTable;
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
                <td>{$gameStore.deadSurvivorCount}
                    <div style="display: flex;width:50px;flex-wrap: wrap;margin-left: 5px">
                        {#each deadSurvivorList as surviror (surviror)}
                            <div in:deadSurvivorReceive={{key: surviror}}
                                 out:deadSurvivorSend={{key: surviror}}>
                                <div style="width: 10px;height:10px;background-color: lightgreen;border:1px solid greenyellow"></div>
                            </div>
                        {/each}
                    </div>
                </td>
                <td class="active">좀비</td>
                <td>{$gameStore.zombieCount}</td>
                <td class="active">좀비토큰</td>
                <td>{$gameStore.zombieTokenCount}</td>
            </tr>
        </table>

        <table class="game-table" style="margin: 10px 10px 0 10px">
            <tr>
                {#each actionTable as action}
                    <td class="active">{action.name}</td><td>{action.count}</td>
                {/each}
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
                            <td>{place.foodCount}
                                <div>
                                    <div style="display: flex;width:50px;flex-wrap: wrap">
                                        {#each camp.foodList as food, index (food)}
                                            <div animate:flip
                                                 in:foodReceive={{key: food}}
                                                 out:foodSend={{key: food}}>
                                                <div style="width: 10px;height:10px;background-color:#ffdc7a;border:1px solid #f7ce59"></div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>굶주림 토큰</td>
                            <td>{place.starvingTokenCount}</td>
                            <td>쓰레기</td>
                            <td>{place.trashCount}
                                <div>
                                    <div style="display: flex;width:50px;flex-wrap: wrap">
                                        {#each camp.trashList as itemCard (itemCard)}
                                            <div animate:flip
                                                 in:trashReceive={{key: itemCard}}
                                                 out:trashSend={{key: itemCard}}>
                                                <div style="width: 10px;height:10px;background-color: lightgreen;border:1px solid greenyellow"></div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </td>
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
            <div style="font-size: 20px;">{currentRiskCard.name}, 지금까지 모은 아이템수 : {successRiskCardList.length}</div>
            <div style="display:flex;margin-left: 10px">
                {#each successRiskCardList as successRiskCard (successRiskCard)}
                    <div style="width:25px;height:25px;border-radius:25px;background-color:lightgreen;border:1px solid greenyellow;margin-right: 5px"
                        animate:flip
                        in:receive={{key: successRiskCard}}
                        out:send={{key: successRiskCard}}></div>
                {/each}
            </div>
        </div>
    {/if}

    {#if messageList.length > 0}
        <div style="display: flex;flex-direction: column;justify-content: center;margin: 10px 300px;">
            {#each messageList as message, index}
                <div>{index + 1} {message}</div>
            {/each}
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