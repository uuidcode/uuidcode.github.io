<script>
    import gameStore from "./gameStore";

    export let itemCardRow;

    $: {
    }
</script>

<table class="game-table box" style="width: 100%; margin: 0 0 4px 0;">
    <tr>
        <td class="active">{itemCardRow.name}</td>
        <td>{itemCardRow.count}</td>
        <td class="active">유형</td>
        <td>{itemCardRow.category}</td>
    </tr>
    <tr>
        <td colspan="4">{itemCardRow.description}</td>
    </tr>
</table>