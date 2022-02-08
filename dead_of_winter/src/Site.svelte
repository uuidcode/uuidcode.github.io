<script>
    import gameStore from "./gameStore";
    import Survivor from "./Survivor.svelte";

    export let siteIndex;

    let siteList;
    let site

    $: {
        siteList = $gameStore.siteList;
        site = $gameStore.siteList[siteIndex];
    }
</script>

<table width="800">
    <tr>
        <td colspan="2" class="active">{site.name}</td>
    </tr>
    <tr>
        <td class="active">생존자</td>
        <td></td>
    </tr>
    <tr>
        <td class="active">좀비</td>
        <td></td>
    </tr>
</table>

