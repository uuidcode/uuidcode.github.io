<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";
    import Card from "./Card.svelte";

    export let playerIndex;

    let player;
    let playerList;
    let survivorIndexList;
    let cardIndexList;

    $: {
        playerList = $gameStore.playerList;
        player = playerList[playerIndex];
        survivorIndexList = player.survivorIndexList;
        cardIndexList = player.cardIndexList;
    }
</script>

<table>
    <tr>
        <td class="active">플레이어 이름</td>
        <td>{player.name}</td>
    </tr>
    <tr>
        <td class="active">생존자</td>
        <td>
            {#each survivorIndexList as survivorIndex}
                <Survivor survivorIndex={survivorIndex}></Survivor>
            {/each}
        </td>
    </tr>
    <tr>
        <td class="active">카드</td>
        <td>
            {#each cardIndexList as cardIndex}
                <Card cardIndex={cardIndex}></Card>
            {/each}
        </td>
    </tr>
</table>

