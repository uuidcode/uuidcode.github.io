<script>
    import config from './config.js'
    import { toStyle } from './util.js'
    export let resource;

    let cellStyle = toStyle({
        left: resource.left + 'px',
        top: resource.top + 'px',
        width: config.cell.width + 'px',
        height: config.cell.height + 'px',
    });

    let imageStyle = toStyle({
        width: config.cell.width + 'px',
        height: config.cell.height + 'px',
    });

    let numberStyle = toStyle({
        left: (config.cell.width - config.number.width) / 2 + 'px',
        top: (config.cell.height - config.number.height) / 2 + 'px',
        width: config.number.width + 'px',
        height: config.number.height + 'px',
        "line-height": config.number.height + 'px',
        "border-radius": config.number.height / 2 + 'px'
    });

    let imageSrc = `${resource.type}.png`;
</script>

<div class="cell" style={cellStyle}>
    <img src={imageSrc} style={imageStyle} alt={imageSrc}>
    <div class="number" style={numberStyle}>{resource.number}</div>
</div>


<style>
    .cell {
        position: absolute;
        text-align: center;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }

    .number {
        position: absolute;
        background-color: #2e6da4;
        color: white;
        opacity: 0.6;
    }
</style>