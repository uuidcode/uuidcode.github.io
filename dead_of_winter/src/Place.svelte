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

<table width="800">
    <tr>
        <td class="active place" style="width: 70px">{place.name}</td>
        <td class="active" style="width: 50px">좀비</td>
        <td style="width: 200px">
            <table>
                {#each place.entranceList as entrance}
                    <tr>
                        {#each Array(entrance.maxZombieCount) as _, zombieIndex}
                            <td class="zombie-area">
                                {#if zombieIndex < entrance.currentZombieCount}
                                    좀비
                                 {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </table>
        </td>
        <td class="active" style="width: 50px">생존자</td>
        <td style="width: 200px">
            {#if place.activeSurvivor != null}
                <Survivor survivor={place.activeSurvivor}></Survivor>
            {/if}
            <table>
                {#each survivorLocationList as row, rowIndex}
                    <tr on:drop|preventDefault={event => gameStore.drop(event, place.name)}
                        on:dragover|preventDefault={(event) => {}}>
                        {#each row as survivor, survivorIndex (rowIndex * row.length + survivorIndex)}
                            <td class="survivor-area"
                                draggable={true}
                                on:dragstart={event => gameStore.drag(event, survivor.index, place.name)}>
                                {#if survivor}
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid black">
                                        <tr>
                                            <td style="background-color: {gameStore.getPlayerColorForSurvivor(survivor)}">{survivor.index}</td>
                                        </tr>
                                        <tr>
                                            <td style="background-color: lightskyblue">이동</td>
                                        </tr>
                                    </table>
                                {/if}
                            </td>
                        {/each}
                    </tr>
                {/each}
            </table>
        </td>
        <td class="active" style="width: 70px">아이템</td>
        <td class="item-card">{place.itemCardList.length}</td>
    </tr>
</table>

