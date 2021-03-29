<script>
    import game from './game.js'
</script>

<div class="game">
    {#each $game.resourceCardList as resourceCard}
        <div>
            {#each resourceCard.resourceList as resource}
                <div>
                    sea:{resource.sea},
                    forest:{resource.forest},
                    mud:{resource.mud},
                    cave:{resource.cave},
                    field:{resource.field},
                    wheat:{resource.wheat},
                    crown:{resource.crown}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
.game {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 300px 1fr;
    width: 100vw;
    height: 100vh;
}

.game div {
    border: 1px solid black;
    background-color: lightgreen;
}

.game div:nth-child(1) {
    grid-column: 1 / span 2;
}
</style>