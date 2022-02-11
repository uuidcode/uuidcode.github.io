<script>
    import gameStore from "./gameStore";

    export let itemCardRow;

    $: {
    }
</script>

<table class="player-item-card">
    <tr>
        <td class="active" width="100">{itemCardRow.name}</td>
        <td width="100">{itemCardRow.count}</td>
    </tr>
    <tr>
        <td colspan="2">{itemCardRow.description}</td>
    </tr>
</table>