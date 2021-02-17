<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'
    import { onDestroy } from 'svelte';

    export let roadIndex;

    let roadList = $katan.roadList;

    console.log('>>> roadList', roadList);

    let road = roadList[roadIndex];

    console.log('>>> road', road);

    let roadStyle;

    const pick = () => {
        const player = katan.getActivePlayer();

        if (player.pickTown === true) {
            katan.setCastle(roadIndex, player.index);
            roadStyle = createStyle();

            player.pickTown = false;
            player.pickLoad = true;
        }
    };

    const createStyle = () => {
        return toStyle({
            left: road.left + 'px',
            top: road.top + 'px',
            width: config.load.width + 'px',
            height: config.load.height + 'px',
            borderRadius: config.load.height + 'px'
        });
    };

    roadStyle = createStyle();

    const unsubscribe = katan.subscribe(currentKatan => {
        roadStyle = createStyle();
        road = currentKatan.roadList[roadIndex];
    });

    onDestroy(unsubscribe);
</script>

<div class="road"
     on:click={() => pick()}
     class:road-ripple={road.roadRipple}
     class:pick={road.roadRipple}
     class:hide1={road.hide}
     class:show1={road.show}
     style={roadStyle}>
<div>{road.i},{road.j}</div>
<div>{road.index} {road.castleList}</div>
</div>

<style>
    .road {
        position: absolute;
        text-align: center;
        border: 1px solid dodgerblue;
        background-color: lightblue;
        opacity: 0.6;
    }

    .pick {
        cursor: pointer;
    }
</style>