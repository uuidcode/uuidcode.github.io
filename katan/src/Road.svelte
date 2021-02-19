<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'
    import { onDestroy } from 'svelte';

    export let roadIndex;

    let roadList = $katan.roadList;
    let road = roadList[roadIndex];
    let roadStyle;

    const pick = () => {
        let player = katan.getActivePlayer();

        if (player.pickRoad === true) {
            katan.setRoad(roadIndex, player.index);
            katan.setHideRoad();
            katan.setRoadRippleDisabled();
            katan.setShowCastle();
            katan.setCastleRippleEnabled();

            katan.turn();

            player = katan.getActivePlayer();
            player.pickCastle = true;
        }
    };

    const createStyle = () => {
        let styleObject = {
            left: road.left + 'px',
            top: road.top + 'px',
            width: config.load.width + 'px',
            height: config.load.height + 'px',
            borderRadius: config.load.height + 'px'
        };

        if (road.playerIndex !== -1) {
            styleObject.backgroundColor =
                    $katan.playerList[road.playerIndex].color;
        }

        return toStyle(styleObject);
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
     class:ripple={road.ripple}
     class:pick={road.ripple}
     class:hide={road.hide}
     class:show={road.show}
     style={roadStyle}>
<!--<div>{road.i},{road.j}</div>-->
<!--<div>{road.index}</div>-->
{#if road.title !== undefined}
    <div>{road.title}</div>
{/if}
</div>

<style>
    .road {
        position: absolute;
        text-align: center;
        border: 1px solid greenyellow;
        background-color: yellow;
        opacity: 0.6;
    }

    .pick {
        cursor: pointer;
    }
</style>