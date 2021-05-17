<script>
    import gameStore from './pandemic'

    export let city;
    let playerList;
    let activePlayer;

    $: {
        playerList = $gameStore.playerList;
        activePlayer = gameStore.getActivePlayer();
    }
</script>

<div class="city city-{city.index}"
     class:blue={city.blue}
     class:lab={city.lab}
     class:yellow={city.yellow}
     class:black={city.black}
     class:red={city.red}
     class:ripple={city.contagion}
     style="left:{city.x}px;top:{city.y}px">
    {#if city.vaccine}
        <div class="vaccine">
            <button on:click={() => gameStore.removeVirus(city.vaccine)}
            class="btn btn-success btn-sm">완치</button>
        </div>
    {/if}

    {@html city.displayVirusCount}

    {#if $gameStore.debug}
    <div class="city-index">{city.index}</div>
    {/if}

    {#if city.lab}
        <div class="lab-title">연구소</div>
    {/if}

    <div class:right={city.right}
         class:top={city.top}
            class="player-position">
        {#each playerList as player}
            {#if city.index === player.cityIndex}
                <div class="player player-board-icon-{player.index}"
                     class:ripple={player.turn}
                     class:turn={player.turn}>
                    <img class="player-image" src="{player.image}">
                </div>
            {/if}
        {/each}

        <div class="move-button-panel">
            {#if city.cure}
                <button on:click={() => gameStore.cure(city)}
                class="btn btn-success btn-xs">치료</button>
            {/if}

            {#if city.movable}
                <button on:click={() => gameStore.moveCity(city.index)}
                class:btn-primary={city.moveNext}
                class:btn-info={city.moveDirect}
                class:btn-light={city.moveLab}
                class:btn-warning={city.moveEveryWhere}
                class="btn btn-xs">이동</button>
            {/if}

            {#if city.buildLab}
                <button on:click={() => gameStore.build(city)}
                class="btn btn-dark btn-xs">연구</button>
            {/if}
        </div>
    </div>
</div>

<style>
    .move-button-panel {
        position: absolute;
        display: flex;
        left: 0;
        top: 0;
        width: 90px;
        height: 20px;
        text-align: left;
        z-index: 200;
        opacity: .7;
    }
    .vaccine {
        position: absolute;
        left: 0;
        top: -10px;
        width: 50px;
        height: 50px;
        z-index: 1000;
    }

    .btn-xs {
        padding: 1px 1px !important;
        font-size: 11px !important;
        line-height: 1.5 !important;
        border-radius: 3px !important;
        height: 22px;
        font-weight: bolder;
        z-index: 1000;
    }

    .lab-panel-title {
        position: absolute;
        left: 668px;
        top: 800px;
        width: 82px;
        height: 20px;
        color: white;
        background-color: black;
        font-weight: bolder;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
    }

    .lab-panel {
        position: absolute;
        left: 670px;
        top: 820px;
        width: 80px;
        height: 80px;
        color: white;
        border: 2px solid white;
        font-weight: bolder;
        font-size: 60px;
        line-height: 80px;
        text-align: center;
    }

    .lab {
        border: 2px solid white;
    }

    .lab-title {
        position: absolute;
        color: white;
        background-color: rgba(0, 0, 0, 0.4);
        left: -2px;
        top: -10px;
        width: 40px;
        height: 20px;
        line-height: 20px;
        font-weight: bolder;
        font-size: 12px;
        text-shadow: 0 0 0 black, 0 0 0 black, 0 0 0 black, 0 0 0 black;
        border: 1px solid white;
    }

    .city {
        position: absolute;
        z-index: 100;
        font-weight: bolder;
        color: white;
        text-shadow: -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white, 2px 2px 0 white;
        width: 40px;
        height: 40px;
        font-size: 40px;
        line-height: 35px;
        text-align: center;
    }

    .city.red {
        color: red;
    }

    .city.black {
        color: black;
    }

    .city.blue {
        color: blue;
    }

    .city.yellow {
        color: yellow;
        text-shadow: -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black;
    }

    .city-index {
        position: absolute;
        right: -10px;
        bottom: 20px;
        width: 20px;
        height: 20px;
        font-size: 14px;
        line-height: 20px;
        font-weight: bolder;
        color: white;
        background-color: black;
        text-align: center;
        z-index: 110;
        text-shadow: 0 0 0 white,
        0 0 0 white,
        0 0 0 white,
        0 0 0 white;
    }

    .player-position {
        display: flex;
        position: absolute;
        top: 25px;
        width: 90px;
        height: 30px;
        z-index: 120;
    }

    .player-position.right {
        position: absolute;
        left: 0;
        top: 25px;
    }

    .player-position.top {
        position: absolute;
        left: 0;
        top: 25px;
    }

    .player {
        position: relative;
        width: 32px;
        height: 32px;
        background-color: white;
        box-shadow: 1px 1px 1px 1px black;
    }

    .player-image {
        position: absolute;
        left: 0;
        top: 0;
        width: 30px;
        height: 30px;
    }
</style>