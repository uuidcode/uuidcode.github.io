<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'
    import playListStore from './playListStore';

    export let castleIndex;
    const castle = $katan.castleList[castleIndex];
    let castleStyle;

    const pick = () => {
        const player = playListStore.getActivePlayer();

        if (player.pickTown === true) {
            katan.setCastle(castleIndex, player.index);
            katan.setCastleRippleDisabled();
            katan.setLoadRippleEnabled();
            castleStyle = createStyle();

            player.pickTown = false;
            player.pickLoad = true;
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

    castleStyle = createStyle();
</script>

<div class="castle"
     on:click={() => pick()}
     class:ripple={castle.ripple}
     class:pick={castle.ripple}
     style={castleStyle}>
    {castle.i},{castle.j}
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