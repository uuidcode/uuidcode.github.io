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
        {#if currentPlace.entranceList.length > 0}
            <div class="flex" style="justify-content: space-evenly; align-content: flex-start;margin: 10px">
                {#each currentPlace.entranceList as entrance, entranceIndex}
                    <table class="game-table zombie-line">
                        <tr>
                            {#each Array(currentPlace.entranceList[0].maxZombieCount) as _, zombieIndex}
                                <td class="zombie-position">
                                    {#if zombieIndex < currentPlace.entranceList[0].currentZombieCount}
                                        좀비
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    </table>
                {/each}
            </div>
        {:else}
            <div class="flex">
                {#each Array(currentPlace.entranceList[0].maxZombieCount) as _, zombieIndex}
                    <div class="zombie-position">
                        {#if zombieIndex < currentPlace.entranceList[0].currentZombieCount}
                            좀비
                        {/if}
                    </div>
                {/each}
                <div class="side-door">문</div>
            </div>
        {/if}
    </div>

    <div class="flex survivor-container"
         on:drop|preventDefault={event => gameStore.drop(event, currentPlace.name)}
         on:dragover|preventDefault={(event) => {}}>
        {#each currentPlace.survivorLocationList as survivor}
            <div draggable={survivor!==null}
                 style="background-color: lightgreen; border: 1px solid white"
                on:dragstart={event => gameStore.drag(event, survivor.index, currentPlace.name)}>
                <div class="survivor-position">
                    {#if survivor}
                        <div class="survivor flex-column">
                            <div class="survivor-name" style="background-color: {gameStore.getPlayerColorForSurvivor(survivor)}">{survivor.name}
                                <span class="power">P:{survivor.power}</span>
                                <span class="attack">A:{survivor.attack}</span>
                                S:{survivor.search}
                                W:{survivor.wound}
                            </div>
                            <div class="survivor-ability-name">{survivor.ability.name}</div>
                            <div>
                                <table class="game-table" style="width: 100%">
                                    {#each survivor.actionTable as action}
                                        <tr>
                                            <td style="width: 30px;text-align:center">{action.dice.power}</td>
                                            <td><button disabled={!action.food}>식사</button></td>
                                            <td><button disabled={!action.attack}>공격</button></td>
                                            <td><button disabled={!action.search}>검색</button></td>
                                            <td><button disabled={!action.barricade}>바리케이트 설치</button></td>
                                            <td><button disabled={!action.clean}>쓰레기 처분</button></td>
                                            <td><button disabled={!action.invite}>좀비유인</button></td>
                                        </tr>
                                    {/each}
                                </table>
                                {#if gameStore.isCurrentPlayerOfSurvivor(survivor) == true}
                                    {#each placeList as place}
                                        {#if currentPlace.name != place.name}
                                            <button on:click={gameStore.move(survivor, place.name)}>{place.name}</button>
                                        {/if}
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>