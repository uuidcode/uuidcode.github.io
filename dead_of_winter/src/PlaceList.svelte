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
    let playerList;
    let deadSurvivorList;
    let currentRiskCard;
    let successRiskCardList;
    let camp;
    let actionTable;
    let messageList;
    let goal;

    $: {
        placeList = $gameStore.placeList;
        playerList = $gameStore.playerList;
        goal = $gameStore.goal;
        messageList = $gameStore.messageList;
        deadSurvivorList = $gameStore.deadSurvivorList;
        currentRiskCard = $gameStore.currentRiskCard;
        successRiskCardList = $gameStore.successRiskCardList;
        camp = $gameStore.placeList.find(place => place.name === '피난기지');
        actionTable = $gameStore.actionTable;
    }
</script>

<div class="flex-column">
    <div style="display: flex;justify-content: center;background-color: #0f6674;color:white;">
        <div style="line-height: 30px">목표 : <span class="game-title">{goal}</span></div>
        <div style="line-height: 30px;display: flex;margin-left: 10px">
            {#if currentRiskCard != null}
                <div>
                위기상황 : <span class="game-title">{currentRiskCard.name}</span>
                지금까지 모은 아이템수 : <span class="game-title">{successRiskCardList.length}</span>
                </div>
                <div style="display:flex;margin-left: 10px;align-items: center">
                    {#each successRiskCardList as successRiskCard (successRiskCard)}
                        <div style="width:25px;height:25px;border-radius:25px;background-color:lightgreen;border:1px solid greenyellow;margin-right: 5px"
                             animate:flip
                             in:receive={{key: successRiskCard}}
                             out:send={{key: successRiskCard}}></div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <div class="flex" style="padding: 3px;justify-content: space-evenly">
        {#each placeList as place, placeIndex}
            <div class="flex place-header {gameStore.getPlaceClassName(place)}" on:click={gameStore.changePlaceByName(place.name)}>
                {#if place.name == '피난기지'}
                    <table>
                        <tr>
                            <td colspan="4" style="height: 26px">{place.name} ({place.index + 1})
                                {#each playerList as player, index}
                                    <span style="border-radius: 10px;border: 1px solid darkgray;padding: 2px;background-color: {gameStore.getPlayerColor(index)}">{player.name} : {place.playerSurvivorMap[player.name].length}</span>
                                    &nbsp;
                                {/each}
                            </td>
                        </tr>
                        <tr>
                            <td>좀비수</td>
                            <td>{place.currentZombieCount}/{place.maxZombieCount}</td>
                            <td>바리케이트수</td>
                            <td>{place.currentBarricadeCount}/{place.maxZombieCount}</td>
                        </tr>
                        <tr>
                            <td>생존자수</td>
                            <td>
                                <div style="display: flex; flex-direction: column">
                                    {place.survivorList.length}/{place.maxSurvivorCount}
                                </div>
                            </td>
                            <td>식량(<span style="background-color: lightgreen">{Math.floor(place.survivorList.length / 2)}필요</span>)</td>
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
                            <td colspan="2" style="height: 26px">{place.name} ({place.index + 1})
                                {#each playerList as player, index}
                                    <span style="border-radius: 10px;border: 1px solid darkgray;padding: 2px;background-color: {gameStore.getPlayerColor(index)}">{player.name} : {place.playerSurvivorMap[player.name].length}</span>
                                    &nbsp;
                                {/each}
                            </td>
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
                            <td>
                                <div style="display: flex; flex-direction: column">
                                    {place.survivorList.length}/{place.maxSurvivorCount}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>아이템카드수</td>
                            <td>{place.itemCardList.length}</td>
                        </tr>
                    </table>
                {/if}
            </div>
        {/each}
    </div>

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