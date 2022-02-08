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

<table>
    <tr>
        <td class="active">이름</td>
        <td>{survivor.name}</td>
    </tr>
</table>

