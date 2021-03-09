<script>
    import katan from './katan.js'
    import Board from './Board.svelte'
    import Dice from './Dice.svelte'
    import Player from './Player.svelte'
    import { toStyle } from './util.js'
    import { Tooltip } from './bootstrap.esm.min.js'
    import jQuery from 'jquery';

    const getHeaderStyle = () => {
        return toStyle({
            backgroundColor: player.color
        });
    };

    let player;
    let playerList;
    let headerStyle;

    $: {
        playerList = $katan.playerList;
        player = playerList[$katan.playerIndex];
        headerStyle = getHeaderStyle();
    }

    jQuery(() => {
        setTimeout(() => {
            const element = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            const tooltipTriggerList = [].slice.call(element);
            const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                const trade = tooltipTriggerEl.getAttribute('trade');
                const type = tooltipTriggerEl.getAttribute('type');
                const placement = tooltipTriggerEl.getAttribute('placement');
                let title = `<strong>${trade}:1</strong> `;

                if (type !== 'all') {
                    title += `<img class="port-resource" src="${type}_item.png">`;
                } else {
                    title += `<div class="port-resource">ALL</div>`;
                }

                const tooltip = new Tooltip(tooltipTriggerEl, {
                    html: true,
                    placement: placement,
                    trigger: 'manual',
                    title: title
                });

                tooltip.show();

                return tooltip
            });
        }, 1000);
    });
</script>

<div class="katan">
    <table class="header">
        <tr>
            <td valign="top" class="player">
                <Player playerIndex={0}></Player>
            </td>
            <td valign="top" class="text-center" width="1200px">
                <h1 class="message-header" style={headerStyle}><img src={player.image}> {$katan.message}</h1>
                <div class="dice-container">
                    <Dice number={$katan.dice[0]}></Dice>
                    <Dice number={$katan.dice[1]}></Dice>
                    <button class="btn btn-primary"
                            disabled={$katan.diceDisabled}
                            on:click={()=>katan.play()}>주사위 굴리기</button>
                    <button class="btn btn-primary"
                            disabled={!$katan.action}
                        on:click={()=>katan.turn()}>완료</button>
<!--                    <input type="number" class="test-dice" bind:value={$katan.testDice}>-->
<!--                    <button class="btn btn-primary"-->
<!--                            on:click={()=>katan.makeDev()}>test</button>-->
                </div>
                <Board resourceList="{$katan.resourceList}"
                       castleList="{$katan.castleList}">
                </Board>
            </td>
            <td valign="top" class="player">
                <Player playerIndex={1}></Player>
            </td>
        </tr>
    </table>
</div>
<style>
    .header {
        border-collapse: collapse;
        border-spacing: 0;
    }

    .header td {
        border: 1px solid black;
    }

    .header tr {
        border: 0 solid white;
    }

    .dice-container {
        display: flex;
        justify-content: center;
    }

    .dice-container * {
        margin: 5px;
    }

    .player {
        width: 270px;
    }

    td {
        border: 1px;
    }

    .katan {
        margin-top: 0;
        margin-left: auto;
        margin-right: auto;
        transform: scale(0.7);
        transform-origin: 0 0;
    }

    .message-header {
        color: white;
        padding: 10px;
    }
</style>