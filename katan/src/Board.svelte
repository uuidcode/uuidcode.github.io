<script>
    import Cell from './Cell.svelte'

    export let resourceList;
</script>

<main class="board">
    {#each resourceList as resource}
        <Cell resource={resource}></Cell>
    {/each}
</main>

<style>
    .resource td {
        height: 100px;
        background-color: lightgray;
        margin: 1px;
        border: 1px solid white;
        text-align: center;
    }

    .board {
        position: relative;
        width: 500px;
        height: 500px;
        margin: 50px;
    }
</style>