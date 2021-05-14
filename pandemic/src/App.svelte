<script>
    import gameStore from './pandemic'
    import PlayerPanel from "./PlayerPanel.svelte";
    import City from "./City.svelte";

    const handleKeydown = (e) => {
        if (e.keyCode === 68) {
            gameStore.toggleDebug();
        }
    };

    let cityList;
    let virusList;
    let playerList;
    let activePlayer;
    let contagionList;
    let spreadList;
    let cardList;
    let usedCardList;

    $: {
        cityList = $gameStore.cityList;
        virusList = $gameStore.virusList;
        playerList = $gameStore.playerList;
        contagionList = $gameStore.contagionList;
        spreadList = $gameStore.spreadList;
        cardList = $gameStore.cardList;
        usedCardList = $gameStore.usedCardList;
        activePlayer = playerList.find(player => player.turn);
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="pandemic">
    <PlayerPanel player={playerList[0]}></PlayerPanel>
    <div class="board">
        <img src="background.jpg" width="1300">

        {#if $gameStore.contagionMessage !== ''}
        <div class:ripple={$gameStore.contagionMessageRipple}
            class="contagion-panel">{@html $gameStore.contagionMessage}</div>
        {/if}

        <div class="card-panel">{cardList.length}</div>
        <div class="lab-panel">{$gameStore.labCount}</div>
        <div class="lab-panel-title">연구소개수</div>

        {#each contagionList as contagion}
            {#if contagion.active}
                <div class="contagion"
                     style="left:{contagion.x}px;top:{contagion.y}px"></div>
            {/if}
        {/each}

        {#each spreadList as spread}
            {#if spread.active}
                <div class="spread"
                     style="left:{spread.x}px;top:{spread.y}px"></div>
            {/if}
        {/each}

        {#each cityList as city}
            <City city={city}/>
        {/each}

        {#each virusList as virus}
            <div class="virus-icon virus-{virus.index}"
                 style="left:{virus.icon.x}px;top:{virus.icon.y}px;background-image: url({virus.icon.image})">
            </div>

            <div class="virus"
                 class:blue={virus.blue}
                 class:yellow={virus.yellow}
                 class:black={virus.black}
                 class:red={virus.red}
                 style="left:{virus.x}px;top:{virus.y}px">
                 {virus.count}
            </div>
        {/each}
    </div>
    <PlayerPanel player={playerList[1]}></PlayerPanel>
</div>

<style>
    .vaccine {
        position: absolute;
        left: 0;
        top: -10px;
        width: 50px;
        height: 50px;
        z-index: 1000;
    }

    .btn-xs {
        padding: 2px 2px !important;
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

    .contagion-panel {
        position: absolute;
        left: 290px;
        top: 358px;
        width: 700px;
        height: 100px;
        color: white;
        line-height: 100px;
        font-size: 30px;
        text-align: center;
        border: 2px solid white;
        background-color: #554A52;
        z-index: 500;
    }

    .card-panel {
        position: absolute;
        left: 795px;
        top: 680px;
        width: 145px;
        height: 200px;
        color: white;
        line-height: 300px;
        font-size: 50px;
        font-weight: bolder;
        text-align: center;
        border: 1px solid white;
    }

    .contagion {
        position: absolute;
        background-color: red;
        width: 30px;
        height: 30px;
        border-radius: 15px 15px;
        box-shadow: 2px 2px 2px #cccccc;
    }

    .spread {
        position: absolute;
        background-color: darkorange;
        width: 30px;
        height: 30px;
        border-radius: 15px 15px;
        box-shadow: 2px 2px 2px #cccccc;
    }

    .pandemic {
        display: flex;
        width: 100vw;
        height: 100vh;
    }

    .left {
        width: 300px;
    }

    .board {
        position: relative;
    }

    .right {
        width: 300px;
    }

    .virus-icon {
        z-index: 100;
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 30px 30px;
    }

    .virus {
        z-index: 100;
        position: absolute;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: white;
        font-size: 18px;
        font-weight: bolder;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
        border-radius: 15px 15px;
    }

    .virus.red {
        box-shadow: 1px 1px 2px 2px red;
        background-color: #FD682D;
    }

    .virus.blue {
        box-shadow: 1px 1px 2px 2px blue;
        background-color: #8185B1;
    }

    .virus.yellow {
        box-shadow: 1px 1px 2px 2px yellow;
        background-color: #FEEA1B;
    }

    .virus.black {
        box-shadow: 1px 1px 2px 2px black;
        background-color: #352F21;
    }
</style>