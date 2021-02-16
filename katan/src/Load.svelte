<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'

    export let loadIndex;
    const load = $katan.loadList[loadIndex];
    let loadStyle;

    const pick = () => {
        const player = katan.getActivePlayer();

        if (player.pickTown === true) {
            katan.setCastle(loadIndex, player.index);
            loadStyle = createStyle();

            player.pickTown = false;
            player.pickLoad = true;
        }
    };

    const createStyle = () => {
        let loadStyleObject = {
            left: load.left + 'px',
            top: load.top + 'px',
            width: config.load.width + 'px',
            height: config.load.height + 'px',
            borderRadius: config.load.height + 'px'
        };

        // if (castle.playerIndex !== undefined) {
        //     loadStyleObject.backgroundColor =
        //         $katan.playerList[castle.playerIndex].color;
        // }

        return toStyle(loadStyleObject);
    };

    loadStyle = createStyle();

    $: {
        console.log('....');
    }
</script>

<div class="load"
     on:click={() => pick()}
     class:load-ripple={load.loadRipple}
     class:pick={load.loadRipple}
     style={loadStyle}>
    {load.i},{load.j}
</div>

<style>
    .load {
        position: absolute;
        text-align: center;
        border: 1px solid dodgerblue;
        background-color: lightblue;
        opacity: 0.6;
    }

    .pick {
        cursor: pointer;
    }
</style>