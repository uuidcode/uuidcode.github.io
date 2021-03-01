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
            borderRadius: config.castle.height + 'px'
        };

        return toStyle(styleObject);
    };

    let castleList;
    let castle;
    let castleStyle;
    let name = '';
    let resourceHtml;
    let placement;
    let port;

    $: {
        castleList = $katan.castleList;
        castle = castleList[castleIndex];
        castleStyle = createStyle();
        port = castle.port;

        if (castle.port.enabled) {
            if (castle.port.type !== undefined) {
                placement = castle.port.tooltip;

                if (castle.port.type === 'all') {
                    name = `${castle.port.trade}:1`;
                } else {
                    name = `${castle.port.trade}:1`;
                    resourceHtml = `<img class="port-resource" src="tree_item.png">`;
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
    data-bs-toggle="tooltip"
    placement={placement}
    trade={port.trade}
    style={castleStyle}>
    <div >{name}</div>
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
        padding: 2px;
    }

    .pick {
        cursor: pointer;
    }

    .port-resource {
        width: 40px;
        height: 40px;
    }
</style>