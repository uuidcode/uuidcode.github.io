<script>
    import gameStore from './pandemic'

    export let player;

    let cityList;

    $: {
        cityList = $gameStore.cityList;

        player.cityList = player.cityIndexList
            .map(index => cityList.find(city => city.index === index));
    }
</script>

<div class="{player.class}">
    <div class="player-header">
        <img src="{player.image}" width="50" height="50">
        <div class="action">{player.action}</div>
    </div>
    {#each player.cityList as city}
        <div class="city"
             class:blue={city.blue}
             class:yellow={city.yellow}
             class:black={city.black}
             class:red={city.red}>
            {city.name}
        </div>
    {/each}
</div>

<style>
    .player-header {
        display: flex;
    }

    .action {
        display: inline-block;
        font-size: 50px;
        font-weight: bolder;
        color: black;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }

    .city {
        width: 300px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 30px;
        font-weight: bolder;
        color: white;
        text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
        border: 1px solid white;
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