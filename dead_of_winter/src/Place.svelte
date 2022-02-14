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

<table style="width: 198px">
    <tr>
        <td class="active place" style="text-align: center; border: 1px solid black">{place.name}</td>
    </tr>
    <tr>
        <td align="center" style="border: 1px solid black">
            <table style="width: {place.entranceList.length * 33}px">
                <tr>
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
                                    <td style="height:50px;border: 1px solid black;">
                                        {#if survivor}
                                        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid black">
                                            <tr>
                                                <td style="height:25px;background-color: {gameStore.getPlayerColorForSurvivor(survivor)}">{survivor.index}</td>
                                            </tr>
                                            <tr>
                                                <td style="height:25px;background-color: lightskyblue">이동</td>
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

