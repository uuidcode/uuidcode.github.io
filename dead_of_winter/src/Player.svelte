<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";

    export let playerIndex;

    let player;
    let playerList;
    let survivorIndexList;

    $: {
        playerList = $gameStore.playerList;
        player = playerList[playerIndex];
        survivorIndexList = player.survivorIndexList;
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
</table>

