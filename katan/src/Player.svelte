<script>
    export let player;
</script>

<main>
    <table class="resource" class:turn={player.turn}>
        <tr>
            <td colspan="2" style="background-color:{player.color}">{player.name}</td>
        </tr>
        <tr>
            <td><img src="tree_item.png"></td>
            <td class="number">{player.resource.tree}</td>
        </tr>
        <tr>
            <td><img src="mud_item.png"></td>
            <td class="number">{player.resource.mud}</td>
        </tr>
        <tr>
            <td><img src="wheat_item.png"></td>
            <td class="number">{player.resource.wheat}</td>
        </tr>
        <tr>
            <td><img src="sheep_item.png"></td>
            <td class="number">{player.resource.sheep}</td>
        </tr>
        <tr>
            <td><img src="iron_item.png"></td>
            <td class="number">{player.resource.iron}</td>
        </tr>
    </table>
</main>

<style>
    .resource td {
        height: 50px;
        width: 50px;
        text-align: center;
        border: 1px solid white;
    }

    table.resource {
        border: 10px solid white;
    }

    table.resource.turn {
        border: 2px solid darkblue;
    }

    .resource img {
        width: 100px;
        height: 100px;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        margin: 4px;
    }

    .number {
        line-height: 100px;
        font-size: 60px;
        font-weight: 600;
        width: 40px;
    }
</style>