<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'
    import { onDestroy } from 'svelte';

    export let roadIndex;

    let roadList = $katan.roadList;
    let road = roadList[roadIndex];
    let roadStyle;

    const createStyle = () => {
        let styleObject = {
            left: road.left + 'px',
            top: road.top + 'px',
            width: config.load.width + 'px',
            height: config.load.height + 'px',
            lineHeight: config.castle.height + 'px'
        };

        if (!$katan.isMakeRoad) {
            styleObject.cursor = 'default';
        }

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
         on:click={()=>katan.clickMakeRoad(roadIndex)}
         class:ripple1={road.ripple}
         class:pick={road.ripple}
         class:hide={road.hide}
         class:show={road.show}
         style={roadStyle}>
        <div>{road.title}</div>
    </div>
{/if}

<style>
    .road {
        position: absolute;
        text-align: center;
        background-color: blueviolet;
        font-weight: bolder;
        font-size: 20px;
        cursor: pointer;
        border: 2px solid black;
    }

    .pick {
        cursor: pointer;
    }
</style>