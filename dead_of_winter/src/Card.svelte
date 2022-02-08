<script>
    import gameStore from "./gameStore";

    export let cardIndex;

    let cardList;
    let card

    $: {
        cardList = $gameStore.cardList;
        card = $gameStore.cardList[cardIndex];
    }
</script>

<div class="card">{card.type}</div>
