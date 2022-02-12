<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";
    import ItemCard from "./ItemCard.svelte";

    export let playerIndex;

    let player;
    let playerList;
    let survivorList;
    let itemCardTable;
    let itemCardList;

    $: {
        playerList = $gameStore.playerList;
        player = playerList[playerIndex];
        survivorList = player.survivorList;
        itemCardTable = player.itemCardTable;
        itemCardList = player.itemCardList;
    }
</script>

<table>
    <tr style="background-color: {player.color}">
        <td colspan="2">
            <table class="player-header">
                <tr>
                    <td>{player.name}</td>
                    <td class="active">생존자</td>
                    <td>{survivorList.length}</td>
                    <td class="active">아이템</td>
                    <td>{itemCardList.length}</td>
                    <td>행동주사위</td>
                    <td>
                        <table>
                            <tr>
                                {#each player.actionDiceList as dice}
                                <td>{dice}</td>
                                {/each}
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td valign="top" width="260">
            {#each survivorList as survivor}
                <Survivor survivor={survivor}></Survivor>
            {/each}
        </td>
        <td valign="top" width="260">
            {#each itemCardTable as itemCardRow}
                <ItemCard itemCardRow={itemCardRow}></ItemCard>
            {/each}
        </td>
    </tr>
</table>

