<script>
    import katan from './katan'
    import config from './config.js'
    import { toStyle } from './util.js'

    export let castle;

    console.log('>>> katan', katan);

    let castleStyle = toStyle({
        left: castle.left + 'px',
        top: castle.top + 'px',
        width: config.castle.width + 'px',
        height: config.castle.height + 'px',
        borderRadius: config.castle.height + 'px'
    });
</script>

<div class="castle ripple"
     class:ripple={castle.ripple}
     style={castleStyle}>
    {katan.isStart()}
</div>

<style>
    .castle {
        position: absolute;
        text-align: center;
        border: 1px solid greenyellow;
        background-color: yellow;
    }
</style>