<script>
    import gameStore from "./gameStore";
    import ItemCard from "./ItemCard.svelte";
    import PlaceLeft from "./PlaceLeft.svelte";
    import PlaceRight from "./PlaceRight.svelte";
    import PlaceCenter from "./PlaceCenter.svelte";
    import Place from "./Place.svelte";

    let placeList;

    $: {
        placeList = $gameStore.placeList;
    }
</script>

<div class="flex-column">
    <div>
        <table class="game-table" style="margin: 10px 10px 0 10px">
            <tr>
                <td class="active">횟수</td>
                <td>{$gameStore.turn}</td>
                <td class="active">라운드</td>
                <td>{$gameStore.round}</td>
                <td class="active">사기</td>
                <td>{$gameStore.moral}</td>
                <td class="active">생존자</td>
                <td>{$gameStore.survivorCount}</td>
                <td class="active">죽은 생존자</td>
                <td>{$gameStore.deadSurvivorCount}</td>
                <td class="active">좀비</td>
                <td>{$gameStore.zombieCount}</td>
                <td class="active">좀비토큰</td>
                <td>{$gameStore.zombieTokenCount}</td>
                <td class="active">죽은 좀비토큰</td>
                <td>{$gameStore.deadZombieCount}</td>
            </tr>
        </table>
    </div>
    <div class="flex" style="padding: 10px">
        {#each placeList as place, placeIndex}
            <div class="flex place-header {gameStore.getPlaceClassName(place)}" on:click={gameStore.changePlaceByName(place.name)}>
                <table>
                    <tr>
                        <td colspan="2">{place.name}</td>
                    </tr>
                    <tr>
                        <td>장소번호</td>
                        <td>{place.index + 1}</td>
                    </tr>
                    <tr>
                        <td>좀비수</td>
                        <td>{place.currentZombieCount}/{place.maxZombieCount}</td>
                    </tr>
                    <tr>
                        <td>생존자수</td>
                        <td>{place.survivorList.length}/{place.maxSurvivorCount}</td>
                    </tr>
                    <tr>
                        <td>아이템카드수</td>
                        <td>{place.itemCardList.length}</td>
                    </tr>
                </table>
            </div>
        {/each}
        <button class="game-button dice"  disabled={$gameStore.rollDice}
                on:click={()=>gameStore.rollActionDice()}>행동 주사기 굴리기</button>

            <button className="game-button" disabled={!$gameStore.canTurn} style="margin-left: 10px"
                    on:click={()=>gameStore.turn()}>완료
            </button>
    </div>

    <div class="place-container">
    {#each placeList as place, placeIndex}
        <div class="place-container {place.activeClassName}">
            <Place placeIndex={placeIndex}></Place>
        </div>
    {/each}
    </div>
</div>