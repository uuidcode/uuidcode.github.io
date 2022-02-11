<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";

    export let placeIndex;

    const survivorCountPerRow = 4;

    let placeList;
    let place
    let survivorList;
    let survivorAreaTable = [];

    $: {
        placeList = $gameStore.placeList;
        place = placeList[placeIndex];

        let survivorAreaRow = [];

        console.log('>>> place', place);

        [...Array(place.maxSurviveCount).keys()].forEach((_, index) => {
            if (index % survivorCountPerRow === 0) {
                survivorAreaRow = [];
                survivorAreaTable.push(survivorAreaRow);
            }

            survivorAreaRow.push(index);
        });

        console.log('>>> survivorAreaTable', survivorAreaTable);
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
                            <td class="zombie-area"></td>
                        {/each}
                    </tr>
                {/each}
            </table>
        </td>
        <td class="active" style="width: 50px">생존자</td>
        <td>
            <table>
                {#each survivorAreaTable as survivorAreaRow}
                    <tr>
                        {#each survivorAreaRow as survivorAreaIndex}
                            <td class="survivor-area"></td>
                        {/each}
                    </tr>
                {/each}
            </table>
        </td>
        <td class="active" style="width: 70px">아이템</td>
        <td class="item-card">{place.cardList.length}</td>
    </tr>
</table>

