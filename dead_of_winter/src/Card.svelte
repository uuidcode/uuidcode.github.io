<script>
    import gameStore from "./gameStore";

    export let itemCardRow;

    $: {
    }
</script>

<tr>
    <td class="active">{itemCardRow.name}</td>
    <td>{itemCardRow.count}</td>
</tr>