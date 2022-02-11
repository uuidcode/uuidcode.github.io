<script>
    import gameStore from "./gameStore";

    export let survivorIndex;

    let survivor;
    let survivorList;

    $: {
        survivorList = $gameStore.survivorList;
        survivor = survivorList[survivorIndex];
    }
</script>

<table class="survivor">
    <tr>
        <td class="active" width="40">이름</td>
        <td colspan="5">{survivor.name}</td>
    </tr>
    <tr>
        <td class="active">능력</td>
        <td>{survivor.power}</td>
        <td class="active">공격</td>
        <td>{survivor.attack}</td>
        <td class="active">검색</td>
        <td>{survivor.search}</td>
    </tr>
    <tr>
        <td width="200px" colspan="6">{survivor.ability.name}</td>
    </tr>
</table>

