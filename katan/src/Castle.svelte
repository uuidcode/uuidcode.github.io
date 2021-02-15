<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'

    export let castleIndex;
    const castle = $katan.castleList[castleIndex];
    let castleStyle;

    const pick = () => {
        const player = katan.getActivePlayer();

        console.log('>>> player', player);

        if (player.pickTown === true) {
            katan.setCastle(castleIndex, player.index);
            castleStyle = createStyle();
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
            castleStyleObject.backgroundColor = $katan.playerList[castle.playerIndex].color;
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
</div>

<style>
    .castle {
        position: absolute;
        text-align: center;
        border: 1px solid greenyellow;
        background-color: yellow;
    }

    .pick {
        cursor: pointer;
    }
</style>