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
<table>
    <tr>
        <td style="vertical-align: top;background-color: {gameStore.getPlayerColor(0)}; "><Player playerIndex="0"></Player></td>
        <td>
            <table style="width: 1550px">
                <tr>
                    {#each placeList as place, i}
                        <td valign="top"><Place placeIndex={i}></Place></td>
                    {/each}
                </tr>
            </table>
        </td>
        <td style="vertical-align: top;background-color: {gameStore.getPlayerColor(1)}"><Player playerIndex="1"></Player></td>
    </tr>
</table>
<div style="position: absolute;left:400px;top:300px;">

<Action></Action>

</div>