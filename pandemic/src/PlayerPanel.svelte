<script>
    import gameStore from './pandemic'
    import { fade, scale } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    export let player;

    let cityList;
    let activePlayer;

    $: {
        cityList = $gameStore.cityList;
        activePlayer = gameStore.getActivePlayer();
    }
</script>

<div class="{player.class} player-container" class:turn={player.turn}>
    <div class="player-header">
        <div on:click={()=> gameStore.showPlayer(player.index)}
            class="player-info clickable">
        <img class="player-icon-{player.index}"
                src="{player.image}" width="50" height="50">
    </div>
        <div class="player-info">남은행동 : {player.action}</div>
        <div class="player-info">도시카드 : {player.cityIndexList.length}</div>
    </div>
    {#each player.cityList as city (city.index)}
        <div animate:flip="{{ duration: 300 }}"
             class="city"
             class:blue={city.blue}
             class:yellow={city.yellow}
             class:black={city.black}
             class:red={city.red}>

            {#if city.receivable}
                <div class="form-check exchange">
                    <input class="form-check-input city-exchange"
                           type="radio"
                           value="{city.index}"
                           bind:group={$gameStore.checkedCityIndex}
                           name="player-city">
                </div>
            {/if}

            {city.name}

            <div class="city-controller">
                {#if city.sendable}
                    <button class="btn btn-info btn-sm"
                            on:click={()=> gameStore.exchange(city.index)}>교환</button>
                {/if}

                {#if city.remove}
                    <button class="btn btn-danger btn-sm"
                            on:click={()=> gameStore.removeCityAndTurn(city.index)}>삭제</button>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
    .exchange {
        position: absolute;
        left: 10px;
        top: 5px;
        width: 50px;
        height: 50px;
    }

    .city-controller {
        position: absolute;
        left: 220px;
        top: -5px   ;
        width: 60px;
        height: 50px;
    }

    .clickable {
        cursor: pointer;
    }

    .player-container {
        padding-left: 10px;
        background-color: lightgrey;
    }

    .turn {
        background-color: lightskyblue;
    }

    .player-info {
        text-align: left;
        color: white;
        height: 50px;
        font-size: 30px;
        font-weight: bolder;
        width: 300px;
        line-height: 50px;
    }

    .player-info2 {
        height: 50px;
        width: 300px;
    }

    .city {
        position: relative;
        width: 280px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 25px;
        font-weight: bolder;
        color: white;
        text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
        border: 1px solid black;
        box-shadow: 10px 10px 3px 3px grey;
    }

    .city.blue {
        background-color: #8185B1;
    }

    .city.red {
        background-color: #FD682D;
    }

    .city.black {
        background-color: #352F21;
    }

    .city.yellow {
        background-color: #FEEA1B;
    }
</style>