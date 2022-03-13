<script type="text/javascript">
    import gameStore from "./gameStore";
    import {foodCrossfade} from "./animation";
    const [foodSend, foodReceive] = foodCrossfade;

    export let itemCard;
</script>

<table class="game-table box"
       style="width: 190px;margin: 5px">
    <tr>
        <td class="active">이름</td>
        <td class="active">{itemCard.name}</td>
        <td class="active">유형</td>
        <td>{itemCard.category}</td>
    </tr>
    <tr>
        <td colspan="4">{itemCard.description}
            {#if itemCard.feature == 'food'}
                <span>
                    <div style="display: inline-block">
                        <div style="display:flex; flex-wrap: wrap; margin-left: 5px">
                            {#each itemCard.foodList as food (food)}
                                <div in:foodReceive={{key: food}}
                                     out:foodSend={{key: food}}>
                                    <div style="width: 10px;height:10px;background-color: lightgreen;border:1px solid greenyellow"></div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </span>
            {/if}
            {#if itemCard.canPreventRisk == true}
                <button class="card-action-dice-button"
                        on:click={()=>gameStore.preventRisk(itemCard)}>위기사항처리</button>
            {/if}

            {#if itemCard.canAction == true}
                <button class="none-action-dice-button"
                        on:click={()=>gameStore.use(itemCard)}>사용</button>
                <button class="none-action-dice-button"
                        on:click={()=>gameStore.cancel(itemCard)}>취소</button>
            {/if}
        </td>
    </tr>
</table>