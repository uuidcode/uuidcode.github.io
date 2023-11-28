<script>
    import Sortable from 'sortablejs';
    import { afterUpdate } from 'svelte'

    export let boat;

    let stoneList = null;

    const handleSortItem = e => {
        console.log('>>> e.to', e.to);
        console.log('>>> e.to.children', e.to.children);

        // boat.stoneList = Array.from(e.to.children)
        //     .map(child => child.getAttribute('stoneIndex'))
        //     .map(index => Number(index))
        //     .map(stoneIndex => boat.stoneList.find(stone => stone.index === stoneIndex));
    }

    afterUpdate(() => {
        if (stoneList) {
            new Sortable(stoneList, {
                direction: 'horizontal',
                onEnd: handleSortItem
            });
        }
    })
</script>

<div class="boat-load" bind:this={stoneList}>
    {#each boat.stoneList as stone, i}
        <div class="player-stone"
             stoneIndex="{stone.index}"
             style:background={stone.color}
             style="{stone.style}">{stone.index}</div>
    {/each}
</div>