<script>
    import { fade, fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import gameStore from "./gameStore";

    export let itemCard;

    $: {
    }
</script>

<table class="game-table box"
       style="width: 100%; margin: 0 0 4px 0;">
    <tr>
        <td class="active">이름</td>
        <td class="active">{itemCard.name}</td>
        <td class="active">유형</td>
        <td>{itemCard.category}</td>
    </tr>
    <tr>
        <td colspan="4">{itemCard.description}
            {#if itemCard.canPreventRisk == true}
                <button class="none-action-dice-button"
                    on:click={()=>gameStore.preventRisk(itemCard)}>위기사항처리</button>
            {/if}
        </td>
    </tr>
</table>