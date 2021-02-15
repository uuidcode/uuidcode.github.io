<script>
    import config from './config.js'
    import { toStyle } from './util.js'
    export let castle;

    let castleStyle = toStyle({
        left: castle.left + 'px',
        top: castle.top + 'px',
        width: config.castle.width + 'px',
        height: config.castle.height + 'px',
        'border-radius': config.castle.height + 'px'
    });
</script>

<div class="castle ripple" style={castleStyle}>
</div>

<style>
    .castle {
        position: absolute;
        text-align: center;
        border: 1px solid greenyellow;
        background-color: yellow;
    }
</style>