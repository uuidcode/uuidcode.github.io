<script>
    import Player from './Player.svelte'
    import Board from './Board.svelte'
    import Dice from './Dice.svelte'
    import katan from './katan.js'

    export let name;
    
    function play() {
        katan.dice[0] = Math.floor(Math.random() * 6) + 1;
        katan.dice[1] = Math.floor(Math.random() * 6) + 1;

        const number = katan.dice[0] + katan.dice[1];

        katan.resourceList
                .filter(resouce => resouce.number === number)
                .forEach(resouce => {
                    const player = katan.playerList
                        .find(play => play.turn);

                    player.resource[resouce.type]++;
                });

        katan.turn();
    }
</script>

<main>
    <table>
        <tr>
            <td></td>
            <td>
                <Dice number={katan.dice[0]}></Dice>
                <Dice number={katan.dice[1]}></Dice>
                <button class="btn btn-primary" on:click={() => play()}>주사위 굴리기</button>
            </td>
            <td></td>
        </tr>
        <tr style="height: 20px">
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td valign="top">
                <Player player={katan.playerList[0]}></Player>
            </td>
            <td valign="top">
                <Board resourceList="{katan.resourceList}"></Board>
            </td>
            <td valign="top">
                <Player player={katan.playerList[1]}></Player>
            </td>
        </tr>
    </table>
</main>