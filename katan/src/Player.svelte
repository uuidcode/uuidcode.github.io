<script>
    export let player;
</script>

<main>
    <table class="resource" class:turn={player.turn}>
        <tr>
            <td><img src="tree.png"></td>
            <td>{player.resource.tree}</td>
        </tr>
        <tr>
            <td><img src="mud.png"></td>
            <td>{player.resource.mud}</td>
        </tr>
        <tr>
            <td><img src="wheat.png"></td>
            <td>{player.resource.wheat}</td>
        </tr>
        <tr>
            <td><img src="sheep.png"></td>
            <td>{player.resource.sheep}</td>
        </tr>
        <tr>
            <td><img src="iron.png"></td>
            <td>{player.resource.iron}</td>
        </tr>
    </table>
</main>

<style>
    .resource td {
        height: 50px;
        width: 50px;
        background-color: lightgray;
        text-align: center;
        border: 1px solid white;
    }

    table.resource {
        border: 10px solid white;
    }

    table.resource.turn {
        border: 10px solid lightblue;
    }

    .resource img {
        width: 50px;
        height: 50px;
    }
</style>