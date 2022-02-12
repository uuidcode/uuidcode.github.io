<script>
    import gameStore from "./gameStore";
    export let survivor;
</script>

<table class="player-survivor">
    <tr>
        <td class="active" width="30">번호</td>
        <td width="30">{survivor.index}</td>
        <td class="active" width="30">이름</td>
        <td colspan="5">{survivor.name}</td>
    </tr>
    <tr>
        <td class="active" width="30">능력</td>
        <td width="20">{survivor.power}</td>
        <td class="active" width="30">공격</td>
        <td width="20">{survivor.attack}</td>
        <td class="active" width="30">검색</td>
        <td width="20">{survivor.search}</td>
        <td class="active" width="30">부상</td>
        <td width="20">{survivor.wound}</td>
    </tr>
    <tr>
        <td colspan="8">{survivor.ability.name}</td>
    </tr>
</table>

