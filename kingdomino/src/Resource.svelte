<script>
    import game from './game'

    export let resourceCardIndex;
    export let resourceIndex;
    let resource;

    $: {
        resource = $game.resourceCardList[resourceCardIndex]
                .resourceList[resourceIndex];
    }

</script>

<div class="resource"
    class:sea={resource.sea}
    class:forest={resource.forest}
    class:mud={resource.mud}
    class:field={resource.field}
    class:cave={resource.cave}
    class:wheat={resource.wheat}>
</div>

<style>
.resource {
    width: 50px;
    height: 50px;
}
</style>