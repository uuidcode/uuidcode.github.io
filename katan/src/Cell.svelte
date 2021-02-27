<script>
    import { onDestroy } from 'svelte';
    import config from './config.js'
    import { toStyle } from './util.js'
    import katan from './katan';
    import { fly } from 'svelte/transition';

    export let resourceIndex;
    let resource = $katan.resourceList[resourceIndex];

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

    const getNumberStyle = (width, height) => {
        return toStyle({
            left: (config.cell.width - width) / 2 + 'px',
            top: (config.cell.height - height) / 2 + 'px',
            width: width + 'px',
            height: height + 'px',
            "line-height": height + 'px',
            "border-radius": height / 2 + 'px',
            "font-size": '30px'
        });
    };

    const getNumberStyleByResource = () => {
        if (resource.buglar) {
            return getNumberStyle(config.buglar.width, config.buglar.height);
        }

        return getNumberStyle(config.number.width, config.number.height);
    };

    let numberStyle = getNumberStyleByResource();
    let imageSrc = `${resource.type}.png`;
    let resourceImage = `${resource.type}_item.png`;

    let resourceImageStyle = toStyle({
        left: resource.left + (config.cell.width  - config.resource.width) / 2 + 'px',
        top: resource.top + (config.cell.height - config.resource.height) / 2 + 'px',
        width: `${config.resource.width}px`,
        height: `${config.resource.height}px`,
    });

    const unsubscribe = katan.subscribe(currentKatan => {
        resource = currentKatan.resourceList[resourceIndex];
        numberStyle = getNumberStyleByResource();
    });

    onDestroy(unsubscribe);
</script>

<div class="cell" style={cellStyle}>
    <div class="inner-cell" style={innerCellStyle}>
        <img src={imageSrc}
             style={imageStyle} alt={imageSrc}>
        <div class="number"
             on:click={()=>katan.moveBuglar(resource.index)}
             class:pick={resource.numberRipple}
             class:ripple={resource.numberRipple}
             class:buglar={resource.buglar}
             style={numberStyle}>
            {resource.number}
            {#if resource.buglar}
                (도둑)
            {/if}

            {#if config.debug}
            ,{resource.index}
            {/if}
        </div>
    </div>
</div>

{#if resource.buglar===false}
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

    .pick {
        cursor: pointer;
    }

    .buglar {
        background-color: red;
    }

    .resource {
        position: absolute;
        z-index: 100;
        filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
    }
</style>