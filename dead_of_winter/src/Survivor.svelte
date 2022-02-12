<script>
    import gameStore from "./gameStore";

    export let survivor;

</script>

<table class="survivor">
    <tr>
        <td class="active" width="30">이름</td>
        <td colspan="3">{survivor.name}</td>
        <td class="active">부상</td>
        <td>{survivor.wound}</td>
    </tr>
    <tr>
        <td class="active" width="30">능력</td>
        <td>{survivor.power}</td>
        <td class="active" width="30">공격</td>
        <td>{survivor.attack}</td>
        <td class="active" width="30">검색</td>
        <td>{survivor.search}</td>
    </tr>
    <tr>
        <td width="200px" colspan="6">{survivor.ability.name}</td>
    </tr>
</table>

