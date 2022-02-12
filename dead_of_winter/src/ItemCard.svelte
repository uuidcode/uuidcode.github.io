<script>
    import gameStore from "./gameStore";

    export let itemCardRow;

    $: {
    }
</script>

<table class="player-item-card">
    <tr>
        <td class="active" width="100">{itemCardRow.name}</td>
        <td width="50">{itemCardRow.count}</td>
        <td class="active" width="100">유형</td>
        <td width="50">{itemCardRow.category}</td>
    </tr>
    <tr>
        <td colspan="4">{itemCardRow.description}</td>
    </tr>
</table>