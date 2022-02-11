<script>
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
    import Place from "./Place.svelte";

    let placeList;

    gameStore.updateAll();

    $: {
        placeList = $gameStore.placeList;
    }
</script>
<table>
    <tr>
        <td width="400" valign="top"><Player playerIndex="0"></Player></td>
        <td width="800">
            <table width="800">
                <tr>
                    <td class="active" width="100">라운드</td>
                    <td width="100">{$gameStore.round}</td>
                    <td class="active" width="100">사기</td>
                    <td width="100">{$gameStore.moral}</td>
                    <td class="active" width="100">생존자</td>
                    <td width="100">{$gameStore.survivorCount}</td>
                </tr>
                <tr>
                    <td colspan="6">
                        <table>
                            {#each placeList as place, i}
                                <Place placeIndex={i}></Place>
                            {/each}
                        </table>
                    </td>
                </tr>
            </table>
        </td>
        <td width="400" valign="top"><Player playerIndex="1"></Player></td>
    </tr>
</table>
<style>

</style>