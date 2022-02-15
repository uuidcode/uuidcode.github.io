<script>
    import gameStore from "./gameStore";
    import ItemCard from "./ItemCard.svelte";
    import PlaceLeft from "./PlaceLeft.svelte";
    import PlaceRight from "./PlaceRight.svelte";
    import PlaceCenter from "./PlaceCenter.svelte";

    $: {
    }
</script>

<div class="flex">
    <PlaceLeft></PlaceLeft>
    <PlaceCenter></PlaceCenter>
    <PlaceRight></PlaceRight>
</div>