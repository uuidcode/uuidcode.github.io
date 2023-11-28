<script>
    import Sortable from 'sortablejs';
    import { afterUpdate } from 'svelte'

    export let boat;

    let stoneList = null;

    afterUpdate(() => {
        if (stoneList) {
            new Sortable(stoneList);
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