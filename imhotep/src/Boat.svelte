<script>
    import Sortable from 'sortablejs';
    import { afterUpdate } from 'svelte'

    export let boat;

    let stoneList = null;

    const handleSortItem = e => {
        const target = $items.find(item => item.id === e.item.id)
        const allItems = $items.filter(item => item.id !== e.item.id)
        const _items = allItems.filter(item => item.boardId === e.to.id)
        target.boardId = e.to.id
        _items.splice(e.newIndex, 0, target)

        const newItems = allItems
            .filter(item => item.boardId !== e.to.id)
            .concat(_items)
        items.set(newItems)
    }

    afterUpdate(() => {
        if (stoneList) {
            new Sortable(stoneList, {
                onEnd: handleSortItem
            });
        }
    })
</script>

<div class="boat-load" bind:this={stoneList}>
    {#each boat.stoneList as stone, i}
        <div class="player-stone"
             style:background={stone.color}
             style="{stone.style}"></div>
    {/each}
</div>