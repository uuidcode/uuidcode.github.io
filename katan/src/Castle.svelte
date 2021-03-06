<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'

    export let castleIndex;

    const pick = () => {
        const castle = $katan.castleList[castleIndex];

        if (castle.playerIndex !== -1) {
            return;
        }

        const player = katan.getActivePlayer();

        katan.setCastle(castleIndex, player.index);

        katan.setHideCastle();
        katan.setCastleRippleDisabled();

        if ($katan.isMakeCastle) {
            katan.endMakeCastle();
            katan.updateAndShowResourceModal();
        } else {
            katan.setRoadRippleEnabled(castleIndex);

        }
    };

    const createStyle = () => {
        let styleObject = {
            left: castle.left + 'px',
            top: castle.top + 'px',
            width: config.castle.width + 'px',
            height: config.castle.height + 'px',
            lineHeight: config.castle.height + 'px',
            borderRadius: config.castle.height + 'px'
        };

        if (castle.playerIndex !== -1) {
            styleObject.cursor = 'default';
        }

        if (config.debug) {
            delete styleObject.lineHeight;
            styleObject.color = 'black';
        }

        if (castle.playerIndex !== -1) {
            styleObject.backgroundColor =
                    $katan.playerList[castle.playerIndex].color;
        }

        return toStyle(styleObject);
    };

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
         on:click={()=>pick()}
    class:ripple1={castle.ripple}
    class:hide={castle.hide}
    class:show={castle.show}
    style={castleStyle}>
    <div>{castle.title}</div>
    </div>
{/if}

<style>
    .castle {
        position: absolute;
        text-align: center;
        background-color: blueviolet;
        font-weight: bolder;
        font-size: 20px;
        cursor: pointer;
        z-index: 20;
        border: 2px solid black;
    }

    .pick {
        cursor: pointer;
    }
</style>