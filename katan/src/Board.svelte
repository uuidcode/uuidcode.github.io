<script>
    import config from './config.js'
    import { toStyle } from './util.js'
    import Cell from './Cell.svelte'
    import Castle from './Castle.svelte'
    import Port from './Port.svelte'
    import Road from './Road.svelte'
    import katan from './katan.js'

    export let resourceList;
    export let castleList;

    let boardStyle = toStyle({
        width: 5 * config.cell.width + 'px'
    });
</script>

<main class="board" style={boardStyle}>
    <div class="display-dice-number dice-left">{$katan.sumDice}</div>
    <div class="display-dice-number dice-right">{$katan.sumDice}</div>
    {#each resourceList as resource, i}
        <Cell resourceIndex={i}></Cell>
    {/each}
    {#each castleList as castle, i}
        <Castle castleIndex={i}></Castle>
        <Port castleIndex={i}></Port>
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
        margin-left: 160px;
        margin-right: 160px;
        margin-top: 120px;
    }

    .display-dice-number {
        position: absolute;
        top: -190px;
        width: 250px;
        height: 250px;
        line-height: 250px;
        font-size: 200px;
        font-weight: bolder;
        border: 1px solid black;
    }

    .dice-left {
        left: -160px;
    }

    .dice-right {
        right: -160px;
    }
</style>