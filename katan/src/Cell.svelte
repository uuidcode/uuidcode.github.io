<script>
    import config from './config.js'
    import { toStyle } from './util.js'
    export let resource;

    const margin = config.cell.margin;
    const offset = 100 - config.cell.margin;

    let cellStyle = toStyle({
        left: resource.left + 'px',
        top: resource.top + 'px',
        width: config.cell.width + 'px',
        height: config.cell.height + 'px'
    });

    let innerCellStyle = toStyle({
        'clip-path': `polygon(50% ${margin}%, ${offset}% 25%, ${offset}% 75%, 50% ${offset}%, ${margin}% 75%, ${margin}% 25%)`
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
        "border-radius": config.number.height / 2 + 'px',
        "font-size": 2 * config.number.height / 5 + 'px'
    });

    let imageSrc = `${resource.type}.png`;
</script>

<div class="cell" style={cellStyle}>
    <div class="inner-cell" style={innerCellStyle}>
        <img src={imageSrc} style={imageStyle} alt={imageSrc}>
        <div class="number" style={numberStyle}>{resource.number},{resource.index}</div>
    </div>
</div>

<style>
    .cell {
        position: absolute;
        text-align: center;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        -webkit-mask-image: -webkit-gradient(
                radial, 50% 50%, 0, 50% 50%, 200, from(#000), to(rgba(0,0,0,0.3)));
    }

    .number {
        position: absolute;
        background-color: white;
        color: black;
        opacity: 0.6;
        font-weight: bolder;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
    }
</style>