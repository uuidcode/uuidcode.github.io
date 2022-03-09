<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {foodCrossfade, deadSurvivorCrossfade, deadZombieCrossfade} from './animation';
    const [foodSend, foodReceive] = foodCrossfade;
    const [deadSurvivorSend, deadSurvivorReceive] = deadSurvivorCrossfade;
    const [deadZombieSend, deadZombieReceive] = deadZombieCrossfade;
    export let placeIndex;

    const survivorCountPerRow = 4;

    let placeList;
    let currentPlace;
    let survivorList;
    let survivorLocationList;
    let survivorAreaTable = [];
    let currentPlayer;
    let dangerDice;
    let selectedItemCardFeature;
    let itemCardList;
    let deadSurvivorList;
    let deadZombieList;

    $: {
        currentPlayer = gameStore.getCurrentPlayer();
        placeList = $gameStore.placeList;
        dangerDice = $gameStore.dangerDice;
        itemCardList = $gameStore.itemCardList;
        selectedItemCardFeature = $gameStore.selectedItemCardFeature;
        currentPlace = placeList[placeIndex];
        survivorList = currentPlace.survivorList;
        survivorLocationList = currentPlace.survivorLocationList;
        deadSurvivorList = $gameStore.deadSurvivorList;
        deadZombieList = $gameStore.deadZombieList;
    }
</script>

<div class="place place-part">
    <div style="display: flex">
        {#each itemCardList as itemCard (itemCard)}
            <div style="width:1px;height:1px"></div>
        {/each}
    </div>
    <div>
        <div style="display: flex">
                <div style="display: flex">
                    <table class="game-table">
                        <tr>
                            <td class="active">횟수</td>
                            <td class="game-info">{$gameStore.turn + 1}</td>
                            <td class="active">라운드</td>
                            <td class="game-info">{$gameStore.round}</td>
                            <td class="active">사기</td>
                            <td class="game-info">{$gameStore.moral}</td>
                            <td class="active">생존자</td>
                            <td class="game-info">{$gameStore.survivorCount}</td>
                            <td class="active">죽은 생존자</td>
                            <td class="game-info">
                                <div style="display: flex">
                                    <div>{$gameStore.deadSurvivorCount}</div>
                                    <div style="display:flex; width:50px; flex-wrap: wrap; margin-left: 5px">
                                        {#each deadSurvivorList as surviror (surviror)}
                                            <div in:deadSurvivorReceive={{key: surviror}}
                                                 out:deadSurvivorSend={{key: surviror}}>
                                                <div style="width: 5px;height:5px;background-color: lightgreen;border:1px solid greenyellow"></div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </td>
                            <td class="active">좀비</td>
                            <td class="game-info">{$gameStore.zombieCount}</td>
                            <td class="active">죽은 좀비</td>
                            <td class="game-info">
                                <div style="display: flex">
                                    <div>{$gameStore.deadZombieCount}</div>
                                    <div style="display:flex; width:50px; flex-wrap: wrap; margin-left: 5px">
                                        {#each deadZombieList as deadZombie (deadZombie)}
                                            <div in:deadZombieReceive={{key: deadZombie}}
                                                 out:deadZombieSend={{key: deadZombie}}>
                                                <div style="width: 5px;height:5px;background-color: lightsalmon;border:1px solid red"></div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div style="margin-left: 20px">
                        <button class="game-button dice action-button" disabled={!$gameStore.riskCard}
                                style="height: 30px"
                                on:click={()=>gameStore.choiceRiskCard()}>
                            위기상황카드
                        </button>

                        <button class="game-button dice action-button" disabled={!$gameStore.rollDice}
                                style="height: 30px"
                                on:click={()=>gameStore.rollActionDice()}>행동 주사위</button>

                        <button class="game-button action-button" disabled={!$gameStore.canTurn}
                                style="height: 30px"
                                on:click={()=>gameStore.turn()}>완료</button>
                    </div>
                </div>
            <div style="display: table;margin-left: 10px">
            <div class="place-name">{currentPlace.name}</div>
            </div>
            <div class="flex"
                 style="justify-content: space-evenly; align-content: flex-start; margin: 2px">
                {#each currentPlace.entranceList as entrance, entranceIndex}
                    <table class="game-table zombie-line">
                        <tr>
                            {#each Array(currentPlace.entranceList[entranceIndex].maxZombieCount) as _, zombieIndex}
                                <td class="zombie-position">
                                    {#if zombieIndex < currentPlace.entranceList[entranceIndex].zombieCount}
                                        <div in:deadZombieReceive={{key: currentPlace.entranceList[entranceIndex].zombieList[zombieIndex]}}
                                             out:deadZombieSend={{key: currentPlace.entranceList[entranceIndex].zombieList[zombieIndex]}}
                                             style="width:100%;height:100%;background-color: darkred"></div>
                                    {:else if currentPlace.entranceList[entranceIndex].maxZombieCount - zombieIndex <= currentPlace.entranceList[entranceIndex].barricadeCount}
                                        <div style="width:100%;height:100%;background-color: lightgray"></div>
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    </table>
                {/each}
            </div>
        </div>
    </div>
    <div class="flex survivor-container">
        {#each currentPlace.survivorLocationList as survivor, index (survivor??index)}
            <div in:deadSurvivorReceive={{key: survivor}}
                 out:deadSurvivorSend={{key: survivor}}
                 on:introend={() => gameStore.rollDangerActionDice(survivor)}
                 style="border: 1px solid lightgreen">
                <div class="survivor-position">
                    {#if survivor}
                        <table class="game-table" style="width: 100%">
                            <tr>
                                <td rowspan="2" style="width:40px;" valign="top">
                                    <img src="image/{survivor.index}.png" style="width: 60px;height:60px">
                                </td>
                                <td style="background-color: {gameStore.getPlayerColorForSurvivor(survivor)}">
                                    <div style="display:flex">
                                        <div style=" display: flex;align-items: center;">
                                            <span style="padding:2px 10px;border-radius: 10px;border:1px solid darkgray">{survivor.playerName}</span>
                                            <div style="display: inline-block;margin-left: 4px">{survivor.name}</div>
                                        </div>
                                        <table class="game-table" style="margin-left: 5px">
                                            <tr>
                                                <td>파워</td>
                                                <td>{survivor.power}</td>
                                                <td>공격</td>
                                                <td>{survivor.attack}</td>
                                                <td>검색</td>
                                                <td>{survivor.search}</td>
                                                <td>부상</td>
                                                <td>
                                                    <div style="display: flex;align-items: center;justify-content: center;">
                                                        <div>{survivor.wound}</div>
                                                        {#each survivor.woundList as wound, woundIndex}
                                                            <div style="width:10px;height:10px;border-radius:10px;background-color: lightsalmon;border:1px solid red"></div>
                                                        {/each}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        <div style="display: flex">
                                            {#each survivor.foodList as food, index (food)}
                                                <div animate:flip
                                                     in:foodReceive={{key: food}}
                                                     out:foodSend={{key: food}}>
                                                    <div style="margin-top: 3px;width: 10px;height:10px;background-color: lightgreen;border:1px solid greenyellow;"></div>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {survivor.job} : {survivor.ability.name}

                                    {#if survivor.canUseAbility == false}
                                        <span style="background-color: lightgreen">능력을 사용하였습니다.</span>
                                    {/if}
                                </td>
                            </tr>
                            {#if survivor.actionTable.length > 0 && gameStore.isCurrentPlayerOfSurvivor(survivor) == true}
                                <tr>
                                    <td colspan="2">
                                        {#each survivor.targetPlaceList as place}
                                            <button class="none-action-dice-button"
                                                    disabled={place.disabled}
                                                    style="margin-right: 5px"
                                                    on:click={gameStore.move(survivor, place.name)}>{place.name}</button>
                                        {/each}
                                        로 이동
                                    </td>
                                </tr>
                            {/if}

                            {#if survivor.actionTable.length > 0}
                                <tr>
                                    <td colspan="2">
                                        <table class="game-table" style="width: 100%">
                                            {#each survivor.actionTable as action, actionIndex}
                                                <tr>
                                                    <td style="width: 20px;text-align:center;background-color: {action.dice.done ? 'lightgray' : 'lightgreen'}">
                                                        <span style="cursor: pointer" on:click|preventDefault={() => gameStore.done(survivor, actionIndex)} alt="행동주사위 포기">{action.dice.power}</span>
                                                    </td>
                                                    <td>
                                                        <button class="food-action-dice-button"
                                                            disabled={!action.food}
                                                            on:click={() => gameStore.plusPower(survivor, currentPlace, actionIndex)}>
                                                            식사+1</button>
                                                        <button class="card-action-dice-button"
                                                                disabled={!action.itemFood}
                                                                on:click={() => gameStore.selectItemCard(currentPlace, actionIndex)}>
                                                            아이템+1</button>
                                                    </td>
                                                    <td>
                                                        <button class="action-dice-button"
                                                                disabled={!action.attack}
                                                            on:click={() => gameStore.attack(survivor, currentPlace, actionIndex)}>
                                                            공격</button>
                                                    </td>
                                                    <td><button
                                                            class="action-dice-button"
                                                            disabled={!action.search}
                                                            on:click={() => gameStore.search(null, survivor, currentPlace, actionIndex)}>
                                                        검색</button></td>
                                                    <td><button
                                                            class="action-dice-button"
                                                            disabled={!action.ability}
                                                            on:click={() => gameStore.useAbility(survivor, currentPlace, actionIndex)}>
                                                        능력</button></td>
                                                    <td>
                                                        <button
                                                            class="action-dice-button"
                                                            disabled={!action.barricade}
                                                            on:click={() => gameStore.createBarricade(currentPlace, actionIndex)}>
                                                        바리케이트</button>
                                                    </td>
                                                    <td>
                                                        <button class="action-dice-button"
                                                            disabled={!action.invite}
                                                            on:click={() => gameStore.inviteZombie(currentPlace, actionIndex)}>
                                                            유인</button>
                                                    </td>
                                                    <td><button
                                                            class="action-dice-button"
                                                            on:click={() => gameStore.clean(3, actionIndex)}
                                                            disabled={!action.clean}>청소</button></td>

                                                </tr>
                                            {/each}
                                            {#if survivor.actionItemCard.enabled}
                                                <tr>
                                                    <td></td>
                                                    <td><button class="card-action-dice-button"
                                                                disabled={!survivor.actionItemCard.food}
                                                                on:click={() => gameStore.selectItemCardWithoutDice(currentPlace, survivor, 'food')}>
                                                        식량공급</button></td>
                                                    <td><button class="card-action-dice-button"
                                                                disabled={!survivor.actionItemCard.attack}
                                                                on:click={() => gameStore.selectItemCardWithoutDice(currentPlace, survivor, 'attack')}>
                                                        공격</button></td>
                                                    <td><button class="card-action-dice-button"
                                                                disabled={!survivor.actionItemCard.search}
                                                                on:click={() => gameStore.selectItemCardWithoutDice(currentPlace, survivor, 'search')}>
                                                        검색</button></td>
                                                    <td><button class="card-action-dice-button"
                                                                disabled={!survivor.actionItemCard.care}
                                                                on:click={() => gameStore.selectItemCardWithoutDice(currentPlace, survivor, 'care')}>
                                                        치료</button></td>
                                                    <td><button class="card-action-dice-button"
                                                                disabled={!survivor.actionItemCard.barricade}
                                                                on:click={() => gameStore.selectItemCardWithoutDice(currentPlace, survivor, 'barricade')}>
                                                        바리케이트</button></td>
                                                    <td></td>
                                                    <td><button class="card-action-dice-button"
                                                                disabled={!survivor.actionItemCard.clean}
                                                                on:click={() => gameStore.selectItemCardWithoutDice(currentPlace, survivor, 'clean')}>
                                                        청소</button></td>
                                                </tr>
                                            {/if}
                                        </table>
                                    </td>
                                </tr>
                            {/if}
                        </table>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>