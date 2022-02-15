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
                    <td style="vertical-align: top">
                        <table>
                            <tr><td><Place placeIndex={0}></Place></td></tr>
                        </table>
                    </td>
                    <td style="vertical-align: top">
                        <table >
                            <tr>
                                <td class="place-section-td"><Place placeIndex={1}></Place></td>
                                <td class="place-section-td"><Place placeIndex={2}></Place></td>
                                <td class="place-section-td"><Place placeIndex={3}></Place></td>
                            </tr>
                            <tr>
                                <td colspan="3" style="height: 20px"></td>
                            </tr>
                            <tr>
                                <td class="place-section-td"><Place placeIndex={4}></Place></td>
                                <td class="place-section-td"><Place placeIndex={5}></Place></td>
                                <td class="place-section-td"><Place placeIndex={6}></Place></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
        <td style="vertical-align: top;background-color: {gameStore.getPlayerColor(1)}"><Player playerIndex="1"></Player></td>
    </tr>
</table>
<!--<div style="position: absolute;left:400px;top:300px;">-->

<!--<Action></Action>-->

<!--</div>-->