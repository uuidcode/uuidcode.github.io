<script>
    import gameStore from './pandemic'
    import PlayerPanel from "./PlayerPanel.svelte";

    const handleKeydown = (e) => {
        if (e.keyCode === 68) {
            gameStore.toggleDebug();
        }
    };

    let cityList;
    let virusList;
    let playerList;
    let activePlayer;

    $: {
        cityList = $gameStore.cityList;
        virusList = $gameStore.virusList;
        playerList = $gameStore.playerList;

        activePlayer = playerList.find(player => player.turn);
        console.log('>>> cityList[activePlayer.cityIndex].linkedCityIndexList', cityList[activePlayer.cityIndex].linkedCityIndexList);
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="pandemic">
    <PlayerPanel player={playerList[0]}></PlayerPanel>
    <div class="board">
        <img src="background.jpg" width="1300">
        {#each cityList as city}
            <div class="city"
                 class:blue={city.blue}
                 class:yellow={city.yellow}
                 class:black={city.black}
                 class:red={city.red}
                 style="left:{city.x}px;top:{city.y}px">{city.displayVirusCount}
                {#if $gameStore.debug}
                <div class="city-index">{city.index}</div>
                {/if}

                <div class="player-position">
                    {#each playerList as player}
                        {#if city.index === player.cityIndex}
                            <div class="player">
                                <img class="player-image" src="{player.image}">
                            </div>
                        {/if}
                    {/each}

                    {#if gameStore.curable(city)}
                        <button on:click={() => gameStore.cure(city)}
                                class="btn btn-success btn-sm">치료</button>
                    {/if}

                    {#if gameStore.movable(city)}
                        <button on:click={() => gameStore.move(city)}
                                class="btn btn-primary btn-sm">이동</button>
                    {/if}
                </div>
            </div>
        {/each}
        {#each virusList as virus}
            {#if virus.active }
            <div class="virus"
                 class:blue={virus.blue}
                 class:yellow={virus.yellow}
                 class:black={virus.black}
                 class:red={virus.red}
                 style="left:{virus.x}px;top:{virus.y}px">{virus.count}
            </div>
            {/if}
        {/each}
    </div>
    <PlayerPanel player={playerList[1]}></PlayerPanel>
</div>

<style>
    .city {
        position: absolute;
        z-index: 100;
        font-weight: bolder;
        color: white;
        text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
        width: 40px;
        height: 40px;
        font-size: 40px;
        line-height: 40px;
        text-align: center;
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

    .player-position {
        display: flex;
        width: 120px;
    }

    .player {
        position: relative;
        width: 34px;
        height: 34px;
        border-radius: 17px 17px;
        border: 2px solid white;
        background-color: white;
    }

    .player-image {
        position: absolute;
        left: 0;
        top: 0;
        width: 30px;
        height: 30px;
    }

    .control-panel {
        text-align: left;
        width: 50px;
        height: 25px;
    }
</style>