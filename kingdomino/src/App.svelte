<script>
    import game from './game.js'
    import ResourceCardContainer from './ResourceCardContainer.svelte'
</script>

<div class="game">
    <div>
        <ResourceCardContainer></ResourceCardContainer>
    </div>
    <div></div>
    <div></div>
</div>

<style>
.game {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 300px 1fr;
    width: 100vw;
    height: 100vh;
}

.game div:nth-child(1) {
    grid-column: 1 / span 2;
}
</style>