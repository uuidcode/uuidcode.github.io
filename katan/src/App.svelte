<script>
    import Board from './Board.svelte'
    import Dice from './Dice.svelte'
    import Player from './Player.svelte'
    import katan from './katan.js'
    //
    // setTimeout(() => {
    //     katan.setShowResourceModal();
    //     setTimeout(katan.showResourceModal, 1000);
    // }, 1000);

</script>

<main style="margin: auto; width: 1300px">
    <table>
        <tr>
            <td valign="top" class="player">
                <Player playerIndex={0}></Player>
            </td>
            <td valign="top" class="text-center">
                <div class="dice-container">
                    <Dice number={$katan.dice[0]}></Dice>
                    <Dice number={$katan.dice[1]}></Dice>
                    <button class="btn btn-primary"
                            disabled={$katan.diceDisabled}
                            on:click={()=>katan.play()}>주사위 굴리기</button>
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
</main>
<div class="modal fade" id="katanModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {$katan.bodyMessage}
            </div>

            {#if $katan.buttonMessage!==''}
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" on:click={()=>katan.clickMessage()}>{$katan.buttonMessage}</button>
                </div>
            {/if}
        </div>
    </div>
</div>

{#if $katan.showResourceModal}
<div class="modal fade" id="resourceModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="max-width:800px">
        <div class="modal-content">
            <div class="modal-body">
                <Player type="modal"
                        playerIndex={$katan.playerIndex}></Player>
            </div>

            <div class="modal-footer">
                <button type="button"
                        on:click={()=>katan.closeResourceModal()}
                        class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .dice-container {
        display: flex;
        justify-content: center;
    }

    .dice-container * {
        margin: 5px;
    }

    .player {
        width: 250px;
    }

    td {
        border: 1px;
    }
</style>