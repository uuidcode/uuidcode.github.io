<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {foodCrossfade, deadSurvivorCrossfade} from './animation';
    const [foodSend, foodReceive] = foodCrossfade;
    const [deadSurvivorSend, deadSurvivorReceive] = deadSurvivorCrossfade;

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

    $: {
        currentPlayer = gameStore.getCurrentPlayer();
        placeList = $gameStore.placeList;
        dangerDice = $gameStore.dangerDice;
        selectedItemCardFeature = $gameStore.selectedItemCardFeature;
        currentPlace = placeList[placeIndex];
        survivorList = currentPlace.survivorList;
        survivorLocationList = currentPlace.survivorLocationList;
    }
</script>

<div class="place place-part">
    <div class="place-name">{currentPlace.name} {currentPlace.index + 1}</div>
    <div>
        <div class="flex"
             style="justify-content: space-evenly; align-content: flex-start; margin: 10px">
            {#each currentPlace.entranceList as entrance, entranceIndex}
                <table class="game-table zombie-line">
                    <tr>
                        {#each Array(currentPlace.entranceList[entranceIndex].maxZombieCount) as _, zombieIndex}
                            <td class="zombie-position">
                                {#if zombieIndex < currentPlace.entranceList[entranceIndex].zombieCount}
                                    <div style="width:100%;height:100%;background-color: darkred"></div>
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
    <div class="flex survivor-container">
        {#each currentPlace.survivorLocationList as survivor, index (survivor??index)}
            <div in:deadSurvivorReceive={{key: survivor}}
                 out:deadSurvivorSend={{key: survivor}}
                 style="background-color: lightgreen; border: 1px solid white">
                <div class="survivor-position">
                    {#if survivor}
                        <table class="game-table" style="width: 100%">
                            <tr>
                                <td style="background-color: {gameStore.getPlayerColorForSurvivor(survivor)}">
                                    <div style="display:flex">
                                        <div style=" display: flex;align-items: center;">{survivor.name}</div>
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
                            <tr><td>{survivor.ability.name}</td></tr>
                            {#if survivor.actionTable.length > 0 && gameStore.isCurrentPlayerOfSurvivor(survivor) == true}
                                <tr>
                                    <td>
                                        {#each placeList as place}
                                            {#if currentPlace.name != place.name && selectedItemCardFeature == null}
                                                <button class="none-action-dice-button"
                                                        disabled={dangerDice}
                                                        style="margin-right: 5px"
                                                        on:click={gameStore.move(survivor, place.name)}>{place.name}</button>
                                            {/if}
                                        {/each}
                                        로 이동
                                    </td>
                                </tr>
                            {/if}

                            {#if survivor.actionTable.length > 0}
                                <tr>
                                    <td>
                                        <table class="game-table" style="width: 100%">
                                            {#each survivor.actionTable as action, actionIndex}
                                                <tr>
                                                    <td style="width: 20px;text-align:center;background-color: {action.dice.done ? 'lightgray' : 'lightgreen'}">{action.dice.power}</td>
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
                                                            disabled={!action.search}>검색</button></td>
                                                    <td><button
                                                            class="action-dice-button"
                                                            disabled={!action.search}>능력</button></td>
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
                                                            on:click={() => gameStore.clean(actionIndex, 3)}
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
                                                                on:click={() => gameStore.selectItemCard(currentPlace, 1)}>
                                                        공격</button></td>
                                                    <td><button class="card-action-dice-button"
                                                                disabled={!survivor.actionItemCard.search}
                                                                on:click={() => gameStore.selectItemCard(currentPlace, 1)}>
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