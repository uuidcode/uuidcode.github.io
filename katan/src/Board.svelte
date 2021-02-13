<script>
    import Cell from './Cell.svelte'
    import Castle from './Castle.svelte'

    export let resourceList;
    export let castleList;
</script>

<main class="board">
    {#each resourceList as resource}
        <Cell resource={resource}></Cell>
    {/each}
    {#each castleList as castle}
        <Castle castle={castle}></Castle>
    {/each}
</main>

<style>
    .resource td {
        height: 160px;
        background-color: lightgray;
        margin: 1px;
        border: 1px solid white;
        text-align: center;
    }

    .board {
        position: relative;
        width: 800px;
        height: 800px;
        margin: 50px;
    }
</style>