<script>
    import katan from './katan'
    import { toStyle } from './util.js'

    export let roadIndex;

    const createStyle = () => {
        const player = katan.getActivePlayer();

        let styleObject = {
            left: road.left + 'px',
            top: road.top + 'px',
            width: $katan.config.load.width + 'px',
            height: $katan.config.load.height + 'px',
            lineHeight: $katan.config.castle.height + 'px',
            backgroundColor: player.color
        };

        if ($katan.config.debug) {
            delete styleObject.lineHeight;
            styleObject.color = 'black';
            styleObject.backgroundColor = 'lightblue';
        }

        if (road.playerIndex !== -1) {
            styleObject.backgroundColor =
                    $katan.playerList[road.playerIndex].color;
            styleObject.cursor = 'default';
        }

        return toStyle(styleObject);
    };

    let road;
    let roadStyle;

    $: {
        road = $katan.roadList[roadIndex];
        roadStyle = createStyle();
    }
</script>

{#if $katan.config.debug}
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
<!--        <div>{road.i},{road.j},{road.playerIndex},{road.index}</div>-->
    </div>
{/if}

<style>
    .road {
        position: absolute;
        text-align: center;
        background-color: blueviolet;
        font-weight: bolder;
        font-size: 12px;
        cursor: pointer;
        border: 2px solid black;
        opacity: 0.9;
        z-index: 2000;
    }

    .pick {
        cursor: pointer;
    }
</style>