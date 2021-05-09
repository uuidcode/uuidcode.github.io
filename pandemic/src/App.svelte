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
                 class:black={city.black}
                 class:red={city.red}
                 style="left:{city.x}px;top:{city.y}px">{city.count}
<!--                <div class="city-index">{city.index}</div>-->
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
        color: white;
        text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
        width: 40px;
        height: 40px;
        font-size: 40px;
        line-height: 40px;
        text-align: center;
    }

    /*.blue {*/
    /*    text-shadow: 2px 2px 10px #7A7CAE,*/
    /*    -2px -2px 10px #7A7CAE,*/
    /*    2px -2px 10px #7A7CAE,*/
    /*    -2px 2px 10px #7A7CAE;*/
    /*}*/

    /*.yellow {*/
    /*    text-shadow: 2px 2px 10px #F9E14E,*/
    /*    -2px -2px 10px #F9E14E,*/
    /*    2px -2px 10px #F9E14E,*/
    /*    -2px 2px 10px #F9E14E;*/
    /*}*/

    /*.black {*/
    /*    text-shadow: 2px 2px 10px #4C452D,*/
    /*    -2px -2px 10px #4C452D,*/
    /*    2px -2px 10px #4C452D,*/
    /*    -2px 2px 10px #4C452D;*/
    /*}*/


    /*.red {*/
    /*    text-shadow: 2px 2px 10px #D95B22,*/
    /*    -2px -2px 10px #D95B22,*/
    /*    2px -2px 10px #D95B22,*/
    /*    -2px 2px 10px #D95B22;*/
    /*}*/

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
        width: 1300px;
        background-image: url("/background.jpg");
        background-size: contain;
        background-repeat: no-repeat;
    }

    .right {
        width: 300px;
    }
</style>