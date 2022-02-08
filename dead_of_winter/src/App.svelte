<script>
    import gameStore from "./gameStore";
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
        <td width="400">테드</td>
        <td width="800"></td>
        <td width="400">다은</td>
    </tr>
</table>
<main>

</main>

<style>

</style>