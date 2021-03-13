<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'
    import {castleClickable, clickMakeCastle} from './castle'

    export let castleIndex;

    const createStyle = () => {
        const player = katan.getActivePlayer();

        let styleObject = {
            left: castle.left + 'px',
            top: castle.top + 'px',
            width: config.castle.width + 'px',
            height: config.castle.height + 'px',
            lineHeight: config.castle.height + 'px',
            borderRadius: config.castle.height + 'px',
            backgroundColor: player.color
        };

        if (!castleClickable($katan, castleIndex)) {
            styleObject.cursor = 'default';
        }

        if (config.debug) {
            delete styleObject.lineHeight;
            styleObject.color = 'black';
        }

        if (castle.playerIndex !== -1) {
            styleObject.backgroundColor = $katan.playerList[castle.playerIndex].color;
        }

        return toStyle(styleObject);
    };

    const internalClickMakeCastle = () => clickMakeCastle(castleIndex);
    let castle;
    let castleStyle;

    $: {
        castle = $katan.castleList[castleIndex];
        castleStyle = createStyle();
    }
</script>

{#if config.debug}
    <div class="castle" style={castleStyle}>
        <div>{castle.i},{castle.j}</div>
        <div>{castle.index}</div>
    </div>
{:else}
    <div class="castle"
         on:click={internalClickMakeCastle}
    class:ripple={castle.ripple}
    class:hide={castle.hide}
    class:show={castle.show}
    style={castleStyle}>
    <div>{castle.title}</div>
<!--        <div>{castle.i},{castle.j},{castle.playerIndex},{castle.index}</div>-->
    </div>
{/if}

<style>
    .castle {
        position: absolute;
        text-align: center;
        background-color: blueviolet;
        font-weight: bolder;
        font-size: 12px;
        cursor: pointer;
        z-index: 20;
        border: 2px solid black;
        opacity: 0.9;
    }

    .pick {
        cursor: pointer;
    }
</style>