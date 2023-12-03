<script>
    import gameStore from './gameStore.js'
    import Sortable from 'sortablejs';
    import {afterUpdate, onMount} from 'svelte'

    export let boat;
    let stoneList = null;
    let element = null;

    const handleSortItem = e => {
        gameStore.sortStone(e, boat.index);
    }

    afterUpdate(() => {
        if (stoneList) {
            if ($gameStore.activePlayer.useToolName !== '지렛대') {
                return;
            }

            new Sortable(stoneList, {
                direction: 'horizontal',
                onEnd: handleSortItem
            });
        }
    })

    onMount(() => {
        console.log(boat);
    })
</script>

<div class="boat" bind:this={element} style="{boat.style}">
    <div class="boat-load-max" style="width: {50 * boat.maxStone}px">
        {#each gameStore.createList(boat.maxStone) as stone, i}
            <div class="boat-stone"></div>
        {/each}
    </div>
    <div class="boat-load-min" style="margin-left: {50 * (boat.maxStone - boat.minStone)}px; width: {50 * boat.minStone}px">
        {#each gameStore.createList(boat.minStone) as stone, i}
            <div class="boat-min-stone"></div>
        {/each}
    </div>
    <div class="boat-load" bind:this={stoneList} style="margin-left: {50 * (boat.maxStone - boat.stoneList.length)}px">
        {#each [...boat.stoneList].reverse() as stone, i}
            <div class="player-stone"
                 stoneIndex="{stone.index}"
                 style:background={stone.color}
                 style="{stone.style}">{stone.index}</div>
        {/each}
    </div>
    <div class="boat-controller">
        {#if boat.canLoad}
            <button on:click={e => gameStore.load(boat)}>싣기</button>
        {/if}
        {#if boat.canMoveToMarket}
            <button on:click={e => gameStore.move(boat, element, gameStore.getMarket())}>장터</button>
        {/if}

        {#if boat.canMoveToPyramid}
            <button on:click={e => gameStore.move(boat, element, gameStore.getPyramid())}>피라미드</button>
        {/if}

        {#if boat.canMoveToTomb}
            <button on:click={e => gameStore.move(boat, element, gameStore.getTomb())}>묘실</button>
        {/if}

        {#if boat.canMoveToWall}
            <button on:click={e => gameStore.move(boat, element, gameStore.getWall())}>성벽</button>
        {/if}

        {#if boat.canMoveToObelisk}
            <button on:click={e => gameStore.move(boat, element, gameStore.getObelisk())}>오빌리스크</button>
        {/if}
    </div>
</div>