<script>
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
    import Place from "./Place.svelte";
    import Action from "./Action.svelte";
    import PlaceList from "./PlaceList.svelte";

    let placeList;
    let modalType;
    let modalClass;
    let currentSurvivor;

    gameStore.updateAll();

    $: {
        placeList = $gameStore.placeList;
        modalType = $gameStore.modalType;
        modalClass = $gameStore.modalClass;
        currentSurvivor = $gameStore.currentSurvivor;
    }
</script>

<svelte:window on:keydown={gameStore.changePlace}/>

<div class="modal {modalClass}">
    <div class="modal_body">
        {#if currentSurvivor != null}
            {#if modalType == 'move'}
                <div style="display: flex;flex-direction: column">
                    <div style="display: flex;margin-top: 10px">
                        <strong>{currentSurvivor.name}</strong>
                    </div>
                    <div style="display: flex;margin-top: 10px">
                        {#each currentSurvivor.targetPlaceList as place}
                            <button class="none-action-dice-button"
                                    disabled={place.disabled}
                                    style="margin-right: 5px"
                                    on:click={gameStore.move(currentSurvivor, place.name)}>{place.name}</button>
                        {/each}
                    </div>
                    <div style="display: flex;margin-top: 10px">위험노출 주사위 없이 이동</div>
                    <div style="display: flex;flex-direction: row-reverse;">
                        <button>취소</button>
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>

<div class="board flex">
    <div class="board-item-section board-player-section"><Player playerIndex={0}></Player></div>
    <div class="board-item-section board-content-section"><PlaceList></PlaceList></div>
    <div class="board-item-section board-player-section"><Player playerIndex={1}></Player></div>
</div>