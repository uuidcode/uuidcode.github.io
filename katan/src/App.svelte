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

<main>
    <table>
        <tr>
            <td valign="top">
                <Player player={$katan.playerList[0]}></Player>
            </td>
            <td valign="top">
                <Board resourceList="{$katan.resourceList}"
                       castleList="{$katan.castleList}">
                </Board>
            </td>
            <td valign="top">
                <Player player={$katan.playerList[1]}></Player>
            </td>
            <td valign="top">
                <div>{$katan.mode}</div>
                <div class:hide={katan.isReady()}>
                <Dice number={$katan.dice[0]}></Dice>
                <Dice number={$katan.dice[1]}></Dice>
                <button class="btn btn-primary" on:click={() => play()}>주사위 굴리기</button>
                </div>
            </td>
        </tr>
    </table>
</main>