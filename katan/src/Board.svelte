<script>
    import config from './config.js'
    import { toStyle } from './util.js'
    import Cell from './Cell.svelte'
    import Castle from './Castle.svelte'
    import Road from './Road.svelte'
    import katan from './katan.js'

    export let resourceList;
    export let castleList;

    let boardStyle = toStyle({
        width: 5 * config.cell.width + 'px',
        height: 5 * config.cell.width + 'px'
    });
</script>

<main class="board" style={boardStyle}>
    {#each resourceList as resource, i}
        <Cell resourceIndex={i}></Cell>
    {/each}
    {#each castleList as castle, i}
        <Castle castleIndex={i}></Castle>
    {/each}
    {#each $katan.roadList as road, i}
        <Road roadIndex={i}></Road>
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
        margin: 20px;
    }
</style>