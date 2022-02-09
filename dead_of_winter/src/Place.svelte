<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";

    export let placeIndex;

    let placeList;
    let place

    $: {
        place = $gameStore.placeList;
        place = $gameStore.placeList[placeIndex];
    }
</script>

<table width="800">
    <tr>
        <td colspan="2" class="active place">{place.name}</td>
    </tr>
    <tr>
        <td class="active">생존자</td>
        <td></td>
    </tr>
    <tr>
        <td class="active">좀비</td>
        <td></td>
    </tr>
</table>

