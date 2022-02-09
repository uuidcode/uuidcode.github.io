<script>
    import gameStore from "./gameStore";

    export let itemCardIndex;

    let cardList;
    let card

    $: {
        cardList = $gameStore.cardList;
        card = $gameStore.itemCardList[itemCardIndex];
    }
</script>

<div class="card">{card.type}</div>
