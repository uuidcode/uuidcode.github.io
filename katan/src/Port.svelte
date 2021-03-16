<script>
    import katan from './katan'
    import { toStyle } from './util.js'

    export let castleIndex;

    const createStyle = () => {
        let styleObject = {
            left: castle.left + 'px',
            top: castle.top + 'px',
            width: $katan.config.castle.width + 'px',
            height: $katan.config.castle.height + 'px',
            borderRadius: $katan.config.castle.height + 'px'
        };

        return toStyle(styleObject);
    };

    let castleList;
    let castle;
    let portStyle;
    let port;

    $: {
        castleList = $katan.castleList;
        castle = castleList[castleIndex];
        portStyle = createStyle();
        port = castle.port;
    }
</script>

{#if port.tradable}
<div class="port"
    data-bs-toggle="tooltip"
    placement={port.placement}
    trade={port.trade}
    type={port.type}
    style={portStyle}>
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
        opacity: 0;
        z-index: 10;
        padding: 2px;
    }
</style>