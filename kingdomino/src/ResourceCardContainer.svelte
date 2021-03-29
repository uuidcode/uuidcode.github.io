<script>
    import game from './game.js'
    import ResourceCard from './ResourceCard.svelte'
</script>

<div class="resource-card-container">
    {#each $game.resourceCardList as resourceCard, i}
        <ResourceCard resourceCardIndex={i}></ResourceCard>
    {/each}
</div>

<style>
    .resource-card-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        width: 100vw;
        height: 200px;
    }
</style>