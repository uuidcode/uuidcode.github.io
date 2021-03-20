<script>
    import { toStyle } from './util.js'
    import Cell from './Cell.svelte'
    import Castle from './Castle.svelte'
    import Port from './Port.svelte'
    import Road from './Road.svelte'
    import katan from './katan.js'

    export let resourceList;
    export let castleList;

    let knightCard;
    let pointCard;
    let roadCard;
    let takeResourceCard;
    let getResourceCard;

    $: {
        knightCard = $katan.cardList.filter(card => card.type === 'knight').length;
        pointCard = $katan.cardList.filter(card => card.type === 'point').length;
        roadCard = $katan.cardList.filter(card => card.type === 'road').length;
        takeResourceCard = $katan.cardList.filter(card => card.type === 'takeResource').length;
        getResourceCard = $katan.cardList.filter(card => card.type === 'getResource').length;
    }
</script>
<div class="board-outer">
    <div class="board">
        <div class="display-dice-number display-dice-number-1 dice-left">{$katan.sumDice}</div>
        <div class="display-dice-number display-dice-number-2 dice-right">{$katan.sumDice}</div>
        <div class="display-card display-card-left">발전카드<br>사용전<br>{$katan.cardList.length}</div>
        <div class="display-card display-card-right">발전카드<br>사용후<br>{$katan.afterCardList.length}</div>
        <div class="display-card-info">
            <table>
                <tr>
                    <td on:click={()=>katan.testKnightCard()}>기사</td>
                    <td on:click={()=>katan.testPointCard()}>점수</td>
                    <td on:click={()=>katan.testRoadCard()}>도로2개 만들기</td>
                    <td on:click={()=>katan.testTakeResourceCard()}>자원2개 뺏기</td>
                    <td on:click={()=>katan.testGetResourceCard()}>자원2개 얻기</td>
                </tr>
                <tr>
                    <td>{knightCard}/14</td>
                    <td>{pointCard}/5</td>
                    <td>{roadCard}/2</td>
                    <td>{takeResourceCard}/2</td>
                    <td>{getResourceCard}/2</td>
                </tr>
            </table>
        </div>
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
    </div>
</div>
<style>
    .resource td {
        height: 160px;
        background-color: lightgray;
        margin: 1px;
        border: 1px solid white;
        text-align: center;
    }

    .board-outer {
        top: -20px;
        box-sizing: border-box;
        position: relative;
        width: 1000px;
        height: 760px;
        padding: 100px 150px 0 150px;
    }

    .board {
        position: relative;
        width: 100%;
        height: 650px;
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
        right: -150px;
    }

    .display-card {
        vertical-align: middle;
        position: absolute;
        bottom: -20px;
        width: 150px;
        height: 150px;
        font-size: 20px;
        font-weight: bolder;
        border: 1px solid black;
        background-color: white;
        text-align: center;
    }

    .display-card-info {
        position: absolute;
        bottom: -10px;
        width: 700px;
        height: 50px;
        text-align: center;
    }

    .display-card-info table {
        margin: 10px auto;
    }

    .display-card-info td {
        border: 1px solid lightskyblue;
        font-size: 14px;
        font-weight: bolder;
        width: 120px;
    }

    .display-card-left {
        left: -150px;
    }

    .display-card-right {
        right: -150px;
    }
</style>