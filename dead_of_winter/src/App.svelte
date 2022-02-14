<script>
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
    import Place from "./Place.svelte";
    import Action from "./Action.svelte";

    let placeList;

    gameStore.updateAll();

    $: {
        placeList = $gameStore.placeList;
    }
</script>
<table cellspacing="0" cellpadding="0">
    <tr>
        <td width="260" valign="top" rowspan="2"
            style="background-color: {gameStore.getPlayerColor(0)}"><Player playerIndex="0"></Player></td>
        <td width="800">
           <Action></Action>
        </td>
        <td width="260" valign="top" rowspan="2"
            style="background-color: {gameStore.getPlayerColor(1)}"><Player playerIndex="1"></Player></td>
    </tr>
    <tr>
        <td>
            <table style="width: 1380px" cellspacing="0" class="game-info">
                <tr>
                    <td class="active" width="100">라운드</td>
                    <td width="100">{$gameStore.round}</td>
                    <td class="active" width="100">사기</td>
                    <td width="100">{$gameStore.moral}</td>
                    <td class="active" width="100">생존자</td>
                    <td width="100">{$gameStore.survivorCount}</td>
                    <td class="active" width="100">좀비</td>
                    <td width="100">{$gameStore.zombieCount}</td>
                    <td class="active" width="100">아이템</td>
                    <td width="100">{$gameStore.itemCardCount}</td>
                </tr>
                <tr>
                    <td colspan="10">
                        <table style="width: 800px">
                            <tr>
                                {#each placeList as place, i}
                                    <td valign="top"><Place placeIndex={i}></Place></td>
                                {/each}
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>