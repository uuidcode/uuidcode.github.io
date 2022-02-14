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

<table style="width: 220px">
    <tr>
        <td class="active place" style="text-align: center;">{place.name}</td>
    </tr>
    <tr>
        <td align="center">
            <table>
                <tr>
                {#if place.entranceList.length > 1}
                    {#each place.entranceList as entrance}
                        <td>
                            <table>
                            {#each Array(entrance.maxZombieCount) as _, zombieIndex}
                                <tr>
                                    <td class="zombie-area" style="width:33px">
                                        {#if zombieIndex < entrance.currentZombieCount}
                                            좀비
                                         {/if}
                                    </td>
                                </tr>
                            {/each}
                            </table>
                        </td>
                    {/each}
                {:else}
                    {#each Array(place.entranceList[0].maxZombieCount) as _, zombieIndex}
                        <td class="zombie-area" style="width:33px">
                            {#if zombieIndex < place.entranceList[0].currentZombieCount}
                                좀비
                            {/if}
                        </td>
                    {/each}
                {/if}
                </tr>
            </table>
            <table style="width: 100%">
                <tr>
                    <td colspan="{place.entranceList.length}" valign="top">
                        <table style="width: 100%;height:50px"
                               on:drop|preventDefault={event => gameStore.drop(event, place.name)}
                               on:dragover|preventDefault={(event) => {}}>
                            {#each place.survivorLocationList as survivor}
                                <tr draggable={survivor!==null}
                                    on:dragstart={event => gameStore.drag(event, survivor.index, place.name)}>
                                    <td  style="height:50px;background-color: lightgreen;border:1px solid black">
                                        {#if survivor}
                                        <table class="player-survivor" style="width:100%">
                                            <tr>
                                                <td style="padding: 2px;background-color: {gameStore.getPlayerColorForSurvivor(survivor)}">
                                                    {survivor.name}
                                                    <span class="power">P:{survivor.power}</span>
                                                    <span class="attack">A:{survivor.attack}</span>
                                                    S:{survivor.search}
                                                    W:{survivor.wound}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 2px;height:25px;background-color: white">{survivor.ability.name}</td>
                                            </tr>
                                        </table>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

