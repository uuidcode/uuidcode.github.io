<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";

    export let placeIndex;

    const survivorCountPerRow = 4;

    let placeList;
    let currentPlace;
    let survivorList;
    let survivorLocationList;
    let survivorAreaTable = [];
    let currentPlayer;

    $: {
        currentPlayer = gameStore.getCurrentPlayer();
        placeList = $gameStore.placeList;
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
                                    좀비
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
        {#each currentPlace.survivorLocationList as survivor}
            <div style="background-color: lightgreen; border: 1px solid white">
                <div class="survivor-position">
                    {#if survivor}
                        <table class="game-table" style="width: 100%">
                            <tr><td style="background-color: {gameStore.getPlayerColorForSurvivor(survivor)}">
                                {survivor.name}
                                P:{survivor.power}
                                A:{survivor.attack}
                                S:{survivor.search}
                                W:{survivor.wound}
                            </td></tr>
                            <tr><td>{survivor.ability.name}</td></tr>
                            {#if survivor.actionTable.length > 0 && gameStore.isCurrentPlayerOfSurvivor(survivor) == true}
                                <tr>
                                    <td>
                                        {#each placeList as place}
                                            {#if currentPlace.name != place.name}
                                                <button on:click={gameStore.move(survivor, place.name)}>{place.name}</button>
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
                                                    <td style="width: 30px;text-align:center">{action.dice.power}</td>
                                                    <td><button disabled={!action.food}>식사</button></td>
                                                    <td><button disabled={!action.attack}>공격</button></td>
                                                    <td><button disabled={!action.search}>검색</button></td>
                                                    <td><button disabled={!action.search}>능력</button></td>
                                                    <td><button disabled={!action.barricade} on:click={() => gameStore.createBarricade(survivor, currentPlace, actionIndex)}>바리케이트</button></td>
                                                    <td><button disabled={!action.clean}>청소</button></td>
                                                    <td><button disabled={!action.invite}>유인</button></td>
                                                </tr>
                                            {/each}
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