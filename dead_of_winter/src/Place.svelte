<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";

    export let placeIndex;

    const survivorCountPerRow = 4;

    let placeList;
    let place
    let survivorList;
    let survivorLocationList;
    let survivorAreaTable = [];

    $: {
        placeList = $gameStore.placeList;
        place = placeList[placeIndex];
        survivorList = place.survivorList;
        survivorLocationList = place.survivorLocationList;
    }
</script>

<div class="place place-part">
    <div class="place-name">{place.name} {place.index + 1}</div>
    <div>
        {#if place.entranceList.length > 0}
            <div class="flex" style="justify-content: space-evenly; align-content: flex-start;margin: 10px">
                {#each place.entranceList as entrance, entranceIndex}
                    <table class="game-table zombie-line">
                        <tr>
                            {#each Array(place.entranceList[0].maxZombieCount) as _, zombieIndex}
                                <td class="zombie-position">
                                    {#if zombieIndex < place.entranceList[0].currentZombieCount}
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
                {#each Array(place.entranceList[0].maxZombieCount) as _, zombieIndex}
                    <div class="zombie-position">
                        {#if zombieIndex < place.entranceList[0].currentZombieCount}
                            좀비
                        {/if}
                    </div>
                {/each}
                <div class="side-door">문</div>
            </div>
        {/if}
    </div>

    <div class="flex survivor-container"
         on:drop|preventDefault={event => gameStore.drop(event, place.name)}
         on:dragover|preventDefault={(event) => {}}>
        {#each place.survivorLocationList as survivor}
            <div draggable={survivor!==null}
                 style="background-color: lightgreen; border: 1px solid white"
                on:dragstart={event => gameStore.drag(event, survivor.index, place.name)}>
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
                                            <td><button>식사</button></td>
                                            <td><button>공격</button></td>
                                            <td><button>검색</button></td>
                                            <td><button>바리케이트 설치</button></td>
                                            <td><button>쓰레기 처분</button></td>
                                            <td><button>좀비유인</button></td>
                                        </tr>
                                    {/each}
                                </table>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>