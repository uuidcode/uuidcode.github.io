<script>
    import katan from './katan'

    export let playerIndex;
    let player;

    $: {
        player = $katan.playerList[playerIndex];
    }
</script>


<main>
    <table class="construction-resource">
        <tr>
            <td>
                <img src="tree_item.png">
                <img src="mud_item.png">
            </td>
            <td>
                <button class="btn btn-primary btn-sm"
                        on:click={()=>katan.makeRoad()}
                        disabled={!player.make.road}>도로 만들기</button>
            </td>
        </tr>
        <tr>
            <td>
                <img src="tree_item.png">
                <img src="mud_item.png">
                <img src="wheat_item.png">
                <img src="sheep_item.png">
            </td>
            <td>
                <button class="btn btn-primary btn-sm"
                        on:click={()=>katan.makeCastle()}
                        disabled={!player.make.castle}>마을 만들기</button>
            </td>
        </tr>
        <tr>
            <td>
                <img src="wheat_item.png">
                <img src="wheat_item.png">
                <img src="iron_item.png">
                <img src="iron_item.png">
                <img src="iron_item.png">
            </td>
            <td>
                <button class="btn btn-primary btn-sm"
                        on:click={()=>katan.makeCity()}
                        disabled={!player.make.city}>도시 만들기</button>
            </td>
        </tr>
        <tr>
            <td>
                <img src="wheat_item.png">
                <img src="sheep_item.png">
                <img src="iron_item.png">
            </td>
            <td>
                <button class="btn btn-primary btn-sm"
                        on:click={()=>katan.makeDev()}
                        disabled={!player.make.dev}>발전카드</button>
            </td>
        </tr>
    </table>
</main>

<style>
    .header {
        background-color: lightskyblue;
    }

    td {
        border: 1px solid lightskyblue;
    }

    .construction-resource {
        width: 100%;
        margin-top: 0;
    }

    .construction-resource img {
        width: 40px;
        height: 40px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 4px;
    }

    button {
        margin: 2px;
    }
</style>