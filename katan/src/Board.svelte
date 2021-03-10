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
        width: 4 * config.cell.width + 'px',
        height: 4 * config.cell.height + 'px'
    });
</script>

<main class="board" style={boardStyle}>
    <div class="display-dice-number display-dice-number-1 dice-left">{$katan.sumDice}</div>
    <div class="display-dice-number display-dice-number-2 dice-right">{$katan.sumDice}</div>
    <div class="display-card display-card-left">발전카드<br>사용전<br>{$katan.cardList.length}</div>
    <div class="display-card display-card-right">발전카드<br>사용후<br>{$katan.afterCardList.length}</div>
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
        margin-left: 150px;
        margin-right: 150px;
        margin-top: 80px;
    }

    .display-dice-number {
        position: absolute;
        top: -150px;
        width: 150px;
        height: 150px;
        line-height: 150px;
        font-size: 100px;
        font-weight: bolder;
        border: 1px solid black;
        background-color: white;
        text-align: center;
    }

    .dice-left {
        left: -150px;
    }

    .dice-right {
        right: -330px;
    }

    .display-card {
        vertical-align: middle;
        position: absolute;
        bottom: -135px;
        width: 150px;
        height: 150px;
        font-size: 20px;
        font-weight: bolder;
        border: 1px solid black;
        background-color: white;
        text-align: center;
    }

    .display-card-left {
        left: -150px;
    }

    .display-card-right {
        right: -330px;
    }
</style>