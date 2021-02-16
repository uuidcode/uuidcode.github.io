<script>
    import config from './config.js'
    import { toStyle } from './util.js'
    import Cell from './Cell.svelte'
    import Castle from './Castle.svelte'
    import Load from './Load.svelte'
    import playListStore from './playListStore'
    import resourceListStore from './resourceListStore'
    import roadListStore from './roadListStore'

    export let resourceList;
    export let castleList;

    let boardStyle = toStyle({
        width: 5 * config.cell.width + 'px',
        height: 5 * config.cell.width + 'px'
    });
</script>

<main class="board" style={boardStyle}>
    {#each $resourceListStore as resource}
        <Cell resource={resource}></Cell>
    {/each}
    {#each $castleListStore as castle, i}
        <Castle castleIndex={i}></Castle>
    {/each}
    {#each roadListStore as load, i}
        <Load loadIndex={i}></Load>
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
        margin: 50px;
    }
</style>