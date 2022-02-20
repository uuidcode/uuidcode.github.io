<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {itemCardCrossfade} from './animation';
    const [send, receive] = itemCardCrossfade;

    export let playerIndex;

    let player;
    let playerList;
    let survivorList;
    let itemCardTable;
    let itemCardList;

    $: {
        playerList = $gameStore.playerList;
        player = playerList[playerIndex];
        survivorList = player.survivorList;
        itemCardTable = player.itemCardTable;
        itemCardList = player.itemCardList;
    }
</script>

<div class="flex-column player-card-list-section" style="background-color: {gameStore.getCurrentPlayerColor()}">
    <table class="game-table" style="margin: 10px">
        <tr><td>{player.name}</td></tr>
    </table>
    <div>
        {#each itemCardList as itemCard (itemCard)}
            <table class="game-table box"
                   animate:flip
                   in:receive={{key: itemCard}}
                   out:send={{key: itemCard}}
                   style="width: 100%; margin: 0 0 4px 0;">
                <tr>
                    <td class="active">이름</td>
                    <td class="active">{itemCard.name}</td>
                    <td class="active">유형</td>
                    <td>{itemCard.category}</td>
                </tr>
                <tr>
                    <td colspan="4">{itemCard.description}
                        {#if itemCard.canPreventRisk == true}
                            <button class="none-action-dice-button"
                                    on:click={()=>gameStore.preventRisk(itemCard)}>위기사항처리</button>
                        {/if}

                        {#if itemCard.canAction == true}
                            <button class="none-action-dice-button"
                                    on:click={()=>gameStore.use(itemCard)}>사용</button>
                        {/if}
                    </td>
                </tr>
            </table>
        {/each}
    </div>
</div>

