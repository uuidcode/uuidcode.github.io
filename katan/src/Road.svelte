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
        if (!road.ripple) {
            return;
        }

        let player = katan.getActivePlayer();

        katan.setRoad(roadIndex, player.index);
        katan.setHideRoad();
        katan.setRoadRippleDisabled();
        katan.setShowCastle();
        katan.setCastleRippleEnabled();

        katan.turn();

        if (katan.isStartable()) {
            katan.start();
        }
    };

    const createStyle = () => {
        let styleObject = {
            left: road.left + 'px',
            top: road.top + 'px',
            width: config.load.width + 'px',
            height: config.load.height + 'px',
            lineHeight: config.castle.height + 'px',
            color: 'white'
        };

        if (config.debug) {
            delete styleObject.lineHeight;
            styleObject.color = 'black';
            styleObject.backgroundColor = 'lightblue';
        }

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

{#if config.debug}
    <div class="road" style={roadStyle}>
        <div>{road.i},{road.j}</div>
        <div>{road.index}</div>
    </div>
{:else}
    <div class="road"
         on:click={() => pick()}
         class:ripple={road.ripple}
         class:pick={road.ripple}
         class:hide={road.hide}
         class:show={road.show}
         style={roadStyle}>
    {#if road.title !== undefined}
        <div>{road.title}</div>
    {/if}
    </div>
{/if}

<style>
    .road {
        position: absolute;
        text-align: center;
        border: 1px solid greenyellow;
        background-color: yellow;
        font-weight: bolder;
        font-size: 12px;
        color: white;
        opacity: 0.6;
    }

    .pick {
        cursor: pointer;
    }
</style>