<script>
    import { toStyle } from './util.js'
    import katan from './katan';

    export let resourceIndex;

    const margin = $katan.config.cell.margin;
    const offset = 100 - $katan.config.cell.margin;

    let innerCellStyle = toStyle({
        'clip-path': `polygon(50% ${margin}%, ${offset}% 25%, ${offset}% 75%, 50% ${offset}%, ${margin}% 75%, ${margin}% 25%)`
    });

    let imageStyle = toStyle({
        width: $katan.config.cell.width + 'px',
        height: $katan.config.cell.height + 'px',
    });

    const getNumberStyle = (width, height) => {
        return toStyle({
            left: ($katan.config.cell.width - width) / 2 + 'px',
            top: ($katan.config.cell.height - height) / 2 + 'px',
            width: width + 'px',
            height: height + 'px',
            "line-height": height + 'px',
            "border-radius": height / 2 + 'px',
            "font-size": '20px'
        });
    };

    const getNumberStyleByResource = () => {
        if (resource.burglar) {
            return getNumberStyle($katan.config.burglar.width, $katan.config.burglar.height);
        }

        return getNumberStyle($katan.config.number.width, $katan.config.number.height);
    };

    let resource;
    let numberStyle;
    let cellStyle;
    let resourceImageStyle;
    let imageSrc;
    let resourceImage;

    $: {
        resource = $katan.resourceList[resourceIndex];
        numberStyle = getNumberStyleByResource();

        cellStyle = toStyle({
            left: resource.left + 'px',
            top: resource.top + 'px',
            width: $katan.config.cell.width + 'px',
            height: $katan.config.cell.height + 'px'
        });

        resourceImageStyle = toStyle({
            left: resource.left + ($katan.config.cell.width  - $katan.config.resource.width) / 2 + 'px',
            top: resource.top + ($katan.config.cell.height - $katan.config.resource.height) / 2 + 'px',
            width: `${$katan.config.resource.width}px`,
            height: `${$katan.config.resource.height}px`,
        });

        imageSrc = `${resource.type}.png`;
        resourceImage = `${resource.type}_item.png`;
    }
</script>

<div class="cell" style={cellStyle}>
    <div class="inner-cell" style={innerCellStyle}>
        <img src={imageSrc}
             style={imageStyle} alt={imageSrc}>
        <div class="number number_{resource.number} number_{resource.number}_{resource.numberIndex}"
             on:click={()=>katan.moveBurglar(resource.index)}
             class:pick={resource.numberRipple}
             class:ripple={resource.numberRipple}
             class:burglar={resource.burglar}
             style={numberStyle}>
            {resource.number}
            {#if resource.burglar}
                (도둑)
            {/if}

            {#if $katan.config.debug}
            ,{resource.index}
            {/if}
        </div>
    </div>
</div>

{#if resource.burglar===false}
    <div>
    <img src="{resourceImage}"
         style="{resourceImageStyle}"
         class="resource_{resourceIndex} resource hide">
    </div>
{/if}

<style>
    .cell {
        position: absolute;
        text-align: center;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
        opacity: 0.9;
    }

    .number {
        position: absolute;
        background-color: white;
        color: black;
        opacity: 0.8;
        font-weight: bolder;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
    }

    .pick {
        cursor: pointer;
    }

    .burglar {
        background-color: red;
    }

    .resource {
        position: absolute;
        z-index: 100;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
    }
</style>