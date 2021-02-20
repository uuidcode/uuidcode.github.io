<script>
    import Player from './Player.svelte'
    import Board from './Board.svelte'
    import Dice from './Dice.svelte'
    import katan from './katan.js'

    function play() {
        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 6) + 1;

        katan.roll(a, b);

        const number = katan.getNumber();

        $katan.resourceList
            .filter(resouce => resouce.number === number)
            .forEach(resouce => {
                const player = $katan.playerList
                    .find(play => play.turn);

                player.resource[resouce.type]++;
            });

        katan.turn();
    }
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
                    <button class="btn btn-primary" on:click={() => play()}>주사위 굴리기</button>
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