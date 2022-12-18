<script>
    import gameStore from "./gameStore";

</script>

<table>
    <tr>
        <td>ted.song</td>
        <td>
            <table>
                {#each $gameStore.boatList as boat}
                <tr>
                    {#each boat.maxStoneCount.range() as stoneIndex}
                        <td class="boat_stone" class:boat_stone_fill={stoneIndex < boat.stoneCount}>{stoneIndex}</td>
                    {/each}
                </tr>
                {/each}
            </table>
        </td>
    </tr>
</table>