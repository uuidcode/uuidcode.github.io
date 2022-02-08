<script>
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
</script>
<table>
    <tr>
        <td width="400"></td>
        <td width="800">{$gameStore.round}</td>
        <td width="400"></td>
    </tr>
    <tr>
        <td width="400"></td>
        <td width="800"><button on:click={()=>gameStore.plusRound()}>plusRound</button></td>
        <td width="400"></td>
    </tr>
    <tr>
        <td width="400"><Player playerIndex="0"></Player></td>
        <td width="800"></td>
        <td width="400"><Player playerIndex="1"></Player></td>
    </tr>
</table>
<main>

</main>

<style>

</style>