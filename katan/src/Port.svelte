<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'

    export let castleIndex;

    const createStyle = () => {
        let styleObject = {
            left: castle.left + 'px',
            top: castle.top + 'px',
            width: config.castle.width + 'px',
            height: config.castle.height + 'px',
            lineHeight: config.castle.height + 'px',
            borderRadius: config.castle.height + 'px'
        };

        return toStyle(styleObject);
    };

    let castleList;
    let castle;
    let castleStyle;
    let name = '';

    $: {
        castleList = $katan.castleList;
        castle = castleList[castleIndex];
        castleStyle = createStyle();

        if (castle.port.enabled) {
            if (castle.port.type !== undefined) {
                if (castle.port.type === 'all') {
                    name = `${castle.port.trade}:1`;
                } else {
                    name = `${castle.port.type}(${castle.port.trade}:1)`;
                }
            } else {
                name = '';
            }
        } else {
            name = '';
        }

    }
</script>

{#if name!==''}
<div class="port"
    style={castleStyle}>
    <div>{name}</div>
</div>
{/if}

<style>
    .port {
        position: absolute;
        text-align: center;
        background-color: lightgrey;
        border: 1px solid darkgrey;
        font-weight: bolder;
        font-size: 14px;
        opacity: 0.6;
        cursor: pointer;
        z-index: 10;
    }

    .pick {
        cursor: pointer;
    }
</style>