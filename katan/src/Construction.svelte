<script>
    import katan from './katan'
    import { onDestroy } from 'svelte';

    let player = katan.getActivePlayer();

    const unsubscribe = katan.subscribe(currentKatan => {
        player = katan.getActivePlayer();
    });

    onDestroy(unsubscribe);
</script>


<main>
    <table class="construction-resource">
        <tr>
            <td colspan="2" class="header">건설</td>
        </tr>
        <tr>
            <td>
                <img src="tree_item.png">
                <img src="mud_item.png">
            </td>
            <td>
                <button class="btn btn-primary btn-sm"
                        on:click={()=>katan.setNewRoadRippleEnabled()}
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
                <button class="btn btn-primary btn-sm" disabled={!player.make.castle}>마을 만들기</button>
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
                <button class="btn btn-primary btn-sm" disabled={!player.make.city}>마을 만들기</button>
            </td>
        </tr>
        <tr>
            <td>
                <img src="wheat_item.png">
                <img src="sheep_item.png">
                <img src="iron_item.png">
            </td>
            <td>
                <button class="btn btn-primary btn-sm" disabled={!player.make.dev}>발전카드</button>
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
        margin-top: 10px;
    }

    .construction-resource img {
        width: 60px;
        height: 60px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 4px;
    }
</style>