<script>
    import gameStore from "./gameStore";
    import ItemCard from "./ItemCard.svelte";
    import Place from "./Place.svelte";

    $: {
    }
</script>

<div class="place-left place-part">
    <div class="flex">
        <Place placeIndex="1"></Place>
    </div>
    <div class="flex">
        <Place placeIndex="2"></Place>
    </div>
    <div class="flex">
        <Place placeIndex="3"></Place>
    </div>
</div>