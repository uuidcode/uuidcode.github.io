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
        {#if place.entranceList.length > 1}
            <div class="flex">
                <div class="place-name">{place.name}</div>
            </div>
            <div class="flex flex-space-around width-100-percent">
            {#each place.entranceList as entrance}
                <div class="flex-column width-50">
                    {#each Array(entrance.maxZombieCount) as _, zombieIndex}
                        <div class="zombie-position">
                            {#if zombieIndex < entrance.currentZombieCount}
                                좀비
                            {/if}
                        </div>
                    {/each}
                    <div class="front-door">문</div>
                </div>
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
            <div class="place-name">{place.name}</div>
            </div>
        {/if}

    <div class="flex-column"
         on:drop|preventDefault={event => gameStore.drop(event, place.name)}
         on:dragover|preventDefault={(event) => {}}>
        {#each place.survivorLocationList as survivor}
            <div draggable={survivor!==null}
                on:dragstart={event => gameStore.drag(event, survivor.index, place.name)}>
                <div class="survivor-position">
                    {#if survivor}
                        <div class="survivor">
                            <div class="survivor-name" style="background-color: {gameStore.getPlayerColorForSurvivor(survivor)}">{survivor.name}
                                <span class="power">P:{survivor.power}</span>
                                <span class="attack">A:{survivor.attack}</span>
                                S:{survivor.search}
                                W:{survivor.wound}
                            </div>
                            <div class="survivor-ability-name">{survivor.ability.name}</div>
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>