<script>
    import { onDestroy } from 'svelte';
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'

    export let castleIndex;
    let castle = $katan.castleList[castleIndex];
    let castleStyle;

    const pick = () => {
        if (!castle.pick) {
            return;
        }

        const player = katan.getActivePlayer();

        if (player.pickCastle === true) {
            player.pickRoad = true;
            katan.setCastle(castleIndex, player.index);

            katan.setHideCastle();
            katan.setCastleRippleDisabled();
            katan.setPickRoadMode();

            katan.setRoadRippleEnabled();
        }
    };

    const createStyle = () => {
        console.log('>>> castle', castle);

        let styleObject = {
            left: castle.left + 'px',
            top: castle.top + 'px',
            width: config.castle.width + 'px',
            height: config.castle.height + 'px',
            borderRadius: config.castle.height + 'px'
        };

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

<div class="castle"
    on:click={() => pick()}
    class:ripple={castle.ripple}
    class:pick={castle.ripple}
    class:hide={castle.hide}
    class:show={castle.show}
    style={castleStyle}>
<!--<div>{castle.i},{castle.j}</div>-->
<!--<div>{castle.index}</div>-->
</div>

<style>
    .castle {
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