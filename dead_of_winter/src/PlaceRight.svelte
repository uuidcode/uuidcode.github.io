<script>
    import gameStore from "./gameStore";
    import ItemCard from "./ItemCard.svelte";
    import Place from "./Place.svelte";

    $: {
    }
</script>

<div class="place-left place-part">
    <div class="flex">
        <Place placeIndex="4"></Place>
    </div>
    <div class="flex">
        <Place placeIndex="5"></Place>
    </div>
    <div class="flex">
        <Place placeIndex="6"></Place>
    </div>
</div>