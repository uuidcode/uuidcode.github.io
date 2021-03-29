<script>
    import game from './game'
    import Resource from "./Resource.svelte";

    export let resourceCardIndex;
    let resource;

    $: {
        resource = $game.resourceCardList[resourceCardIndex];
    }
</script>

<div class="resource-card">
    <Resource resourceCardIndex={resourceCardIndex} resourceIndex={0}></Resource>
    <Resource resourceCardIndex={resourceCardIndex} resourceIndex={1}></Resource>
</div>

<style>
    .resource-card {
        display: flex;
    }
</style>