<script>
    import { onDestroy } from 'svelte';
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'

    export let castleIndex;
    let castle = $katan.castleList[castleIndex];
    let castleStyle;

    const pick = () => {
        if (!castle.ripple) {
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
            borderRadius: config.castle.height + 'px',
            color: 'white'
        };

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

    const unsubscribe = katan.subscribe(currentKatan => {
        castleStyle = createStyle();
        castle = currentKatan.castleList[castleIndex];
    });

    onDestroy(unsubscribe);

    castleStyle = createStyle();
</script>

{#if config.debug}
    <div class="castle" style={castleStyle}>
        <div>{castle.i},{castle.j}</div>
        <div>{castle.index}</div>
    </div>
{:else}
    <div class="castle"
         on:click={()=>pick()}
    class:ripple={castle.ripple}
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
        background-color: yellow;
        font-weight: bolder;
        font-size: 12px;
        opacity: 0.6;
    }

    .pick {
        cursor: pointer;
    }
</style>