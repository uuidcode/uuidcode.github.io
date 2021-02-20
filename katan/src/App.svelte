<script>
    import Player from './Player.svelte'
    import Board from './Board.svelte'
    import Dice from './Dice.svelte'
    import katan from './katan.js'
</script>

<main style="margin: auto; width: 80%">
    <table>
        <tr>
            <td></td>
            <td>
                <div>{$katan.mode}</div>
                <div>{$katan.message}</div>
                <div class:hide={$katan.isReady}
                     class:show={$katan.isStart}>
                    <Dice number={$katan.dice[0]}></Dice>
                    <Dice number={$katan.dice[1]}></Dice>
                    <button class="btn btn-primary" on:click={() => katan.play()}>주사위 굴리기</button>
                </div>
            </td>
            <td></td>
        </tr>
        <tr>
            <td valign="top" class="player">
                <Player player={$katan.playerList[0]}></Player>
            </td>
            <td valign="top">
                <Board resourceList="{$katan.resourceList}"
                       castleList="{$katan.castleList}">
                </Board>
            </td>
            <td valign="top" class="player">
                <Player player={$katan.playerList[1]}></Player>
            </td>
        </tr>
    </table>
</main>

<style>
    .player {
        width: 200px;
    }

    td {
        border: 1px;
    }
</style>