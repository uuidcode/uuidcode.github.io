<script>
    import gameStore from "./gameStore";
    import Player from "./Player.svelte";
    import Site from "./Site.svelte";

    let siteList;

    $: {
        siteList = $gameStore.siteList;
    }
</script>
<table>
    <tr>
        <td width="400"><Player playerIndex="0"></Player></td>
        <td width="800">
            <table width="800">
                <tr>
                    <td class="active" width="100">라운든</td>
                    <td>{$gameStore.round}</td>
                </tr>
                <tr>
                    <td class="active">사기</td>
                    <td>{$gameStore.moral}</td>
                </tr>
                <tr>
                    {#each siteList as site}
                        <Site siteIndex={site.index}></Site>
                    {/each}
                </tr>
            </table>
        </td>
        <td width="400"><Player playerIndex="1"></Player></td>
    </tr>
</table>
<style>

</style>