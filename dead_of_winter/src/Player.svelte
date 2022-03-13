<script>
    import gameStore from "./gameStore";
    import {flip} from 'svelte/animate';
    import {
        itemCardCrossfade,
        trashCrossfade,
        placeItemCardCrossfade
    } from './animation';
    import ItemCard from "./ItemCard.svelte";
    const [itemCardSend, itemCardReceive] = itemCardCrossfade;
    const [placeItemCardSend, placeItemCardReceive] = placeItemCardCrossfade;
    const [trashSend, trashReceive] = trashCrossfade

    export let playerIndex;

    let player;
    let playerList;
    let currentPlayer;
    let survivorList;
    let itemCardTable;
    let itemCardList;
    let selectedItemCardFeature;
    let itemCardAnimationType;

    const send = (node, args) => {
        if (itemCardAnimationType === 'risk') {
            itemCardSend(node, args);
        } else if (itemCardAnimationType === 'get') {
            placeItemCardSend(node, args);
        } else {
            trashSend(node, args);
        }
    }

    const receive = (node, args) => {
        if (itemCardAnimationType === 'risk') {
            itemCardReceive(node, args);
        } else if (itemCardAnimationType === 'get') {
            placeItemCardReceive(node, args);
        } else {
            trashReceive(node, args);
        }
    }

    $: {
        playerList = $gameStore.playerList;
        itemCardAnimationType = $gameStore.itemCardAnimationType;
        currentPlayer = $gameStore.currentPlayer;
        selectedItemCardFeature = $gameStore.selectedItemCardFeature;
        player = playerList[playerIndex];
        survivorList = player.survivorList;
        itemCardTable = player.itemCardTable;
        itemCardList = player.itemCardList;
    }
</script>

<div class="flex-column player-card-list-section"
     style="background-color: {currentPlayer.index === player.index ? gameStore.getCurrentPlayerColor() : 'white'}">
    <div style="display:flex;flex-direction:column;padding: 10px 5px">
        <div style="padding:5px 10px;border-radius: 10px;border:1px solid darkgray;text-align: center">{player.name}</div>
        <div style="margin-top: 5px">아이템 카드 : {player.itemCardList.length}, 생존자 : {player.survivorList.length}</div>
    </div>
    <div style="height:100vh">
        {#each itemCardList as itemCard (itemCard)}
            <div animate:flip
                 in:receive={{key: itemCard}}
                 out:send={{key: itemCard}}>
                <ItemCard itemCard={itemCard}></ItemCard>
            </div>
        {/each}
    </div>
</div>

