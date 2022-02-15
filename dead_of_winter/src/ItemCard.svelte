<script>
    import gameStore from "./gameStore";

    export let itemCardRow;

    $: {
    }
</script>

<div class="player-card">
    <div class="flex">
        <div class="player-card-item player-card-item-first player-card-item-label player-card-name">{itemCardRow.name}</div>
        <div class="player-card-item player-card-count">{itemCardRow.count}</div>
        <div class="player-card-item player-card-item-label player-card-category-label">유형</div>
        <div class="player-card-item player-card-category">{itemCardRow.category}</div>
    </div>
    <div class="flex">
        <div class="player-card-item player-card-description">{itemCardRow.description}</div>
    </div>
</div>