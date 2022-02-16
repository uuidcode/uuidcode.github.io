<script>
    import gameStore from "./gameStore";
    import ItemCard from "./ItemCard.svelte";
    import PlaceLeft from "./PlaceLeft.svelte";
    import PlaceRight from "./PlaceRight.svelte";
    import PlaceCenter from "./PlaceCenter.svelte";

    let placeList;

    $: {
        placeList = $gameStore.placeList;
    }
</script>

<div class="flex">
    {#each placeList as place, placeIndex}
        <div class="flex place-header">
            <table>
                <tr>
                    <td colspan="2">{place.name}</td>
                </tr>
                <tr>
                    <td>좀비수</td>
                    <td>{place.currentZombieCount}/{place.maxZombieCount}</td>
                </tr>
                <tr>
                    <td>생존자수</td>
                    <td>{place.survivorList.length}/{place.maxSurvivorCount}</td>
                </tr>
            </table>
        </div>
    {/each}
</div>