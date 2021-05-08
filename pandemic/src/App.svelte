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
            <div class="city" style="left:{city.x}px;top:{city.y}px">{city.count}</div>
        {/each}
    </div>
    <div class="right">3</div>
</div>


<style>
    .city {
        position: absolute;
        z-index: 100;
        font-weight: bolder;
        font-size: 40px;
        color: black;
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