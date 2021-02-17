<script>
    import { onDestroy } from 'svelte';
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'

    export let castleIndex;
    let castle = $katan.castleList[castleIndex];
    let castleStyle;

    const pick = () => {
        const player = katan.getActivePlayer();

        if (player.pickCastle === true) {
            katan.setCastle(castleIndex, player.index);

            katan.setHideCastle();
            katan.setCastleRippleDisabled();
            katan.setPickRoadMode();

            katan.setRoadRippleEnabled();
            katan.setShowRoad();
        }
    };

    const createStyle = () => {
        let castleStyleObject = {
            left: castle.left + 'px',
            top: castle.top + 'px',
            width: config.castle.width + 'px',
            height: config.castle.height + 'px',
            borderRadius: config.castle.height + 'px'
        };

        if (castle.playerIndex !== undefined) {
            castleStyleObject.backgroundColor =
                $katan.playerList[castle.playerIndex].color;
        }

        return toStyle(castleStyleObject);
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
    class:hide1={castle.hide}
    class:show1={castle.show}
    style={castleStyle}>
<div>{castle.i},{castle.j}</div>
<div>{castle.index}</div>
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