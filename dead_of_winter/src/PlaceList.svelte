<script>
    import gameStore from "./gameStore";
    import ItemCard from "./ItemCard.svelte";
    import PlaceLeft from "./PlaceLeft.svelte";
    import PlaceRight from "./PlaceRight.svelte";
    import PlaceCenter from "./PlaceCenter.svelte";
    import Place from "./Place.svelte";

    let placeList;

    $: {
        placeList = $gameStore.placeList;
    }
</script>

<div class="flex-column">
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
                <tr>
                    <td>아이템카드수</td>
                    <td>{place.itemCardList.length}</td>
                </tr>
            </table>
        </div>
    {/each}
    </div>

    <div class="place-container">
    {#each placeList as place, placeIndex}
        <div class="place-container {place.activeClassName}">
            <Place placeIndex={placeIndex}></Place>
        </div>
    {/each}
    </div>
</div>