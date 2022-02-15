<script>
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
    import Place from "./Place.svelte";
    import Action from "./Action.svelte";
    import PlaceList from "./PlaceList.svelte";

    let placeList;

    gameStore.updateAll();

    $: {
        placeList = $gameStore.placeList;
    }
</script>

<div class="board flex">
    <div class="board-item-section board-player-section"><Player playerIndex={0}></Player></div>
    <div class="board-item-section board-content-section"><PlaceList></PlaceList></div>
    <div class="board-item-section board-player-section"><Player playerIndex={1}></Player></div>
</div>