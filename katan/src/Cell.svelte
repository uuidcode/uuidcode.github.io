<script>
    export let resource;

    let style = `left:${resource.left}px;top:${resource.top}px`;
    let image = `${resource.type}.png`;
</script>

<div class="cell" style={style}>
    <img src={image}>
    <div class="number">{resource.number}</div>
</div>

<style>
    .cell {
        position: absolute;
        width: 162px;
        height: 162px;
        text-align: center;
        border: 1px solid black;
    }

    .cell img {
        width: 160px;
        height: 160px;
    }

    .number {
        position: absolute;
        left: 60px;
        top: 60px;
        width: 40px;
        height: 40px;
        background-color: #2e6da4;
        color: white;
        opacity: 0.6;
        line-height: 40px;
    }
</style>