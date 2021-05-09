<script>
    import gameStore from './pandemic'

    const cityList = $gameStore.cityList;

    const handleClick = (e) => {
        console.log('>>> e', e);
    }
</script>

<div class="pandemic">
    <div class="left">1</div>
    <div class="board" on:click={handleClick}>
        {#each cityList as city}
            <div class="city"
                 class:blue={city.blue}
                 class:yellow={city.yellow}
                 style="left:{city.x}px;top:{city.y}px">{city.count}
                <div class="city-index">{city.index}</div>
            </div>
        {/each}
    </div>
    <div class="right">3</div>
</div>

<style>
    .city {
        position: absolute;
        z-index: 100;
        font-weight: bolder;
        color: black;
        text-shadow: 2px 2px 10px white,
        -2px -2px 10px white,
        2px -2px 10px white,
        -2px 2px 10px white;
        border-radius: 25px;
        width: 40px;
        height: 40px;
        font-size: 40px;
        line-height: 40px;
        text-align: center;
    }

    .blue {
    }

    .yellow {
    }

    .city-index {
        position: absolute;
        right: -20px;
        bottom: 20px;
        width: 20px;
        height: 20px;
        font-size: 10px;
        line-height: 20px;
        font-weight: bolder;
        color: white;
        background-color: black;
        text-align: center;
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
        width: 1300px;
        background-image: url("/background.jpg");
        background-size: contain;
        background-repeat: no-repeat;
    }

    .right {
        width: 300px;
    }
</style>