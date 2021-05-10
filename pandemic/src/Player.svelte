<script>
    import gameStore from './pandemic'

    const cityList = $gameStore.cityList;

    export let player;

    $: {
        player.cityList = player.cityIndexList
            .map(index => cityList.find(city => city.index === index));
    }
</script>

<div class="{player.class}">
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
    .city {
        width: 300px;
        height: 100px;
        text-align: center;
        line-height: 100px;
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