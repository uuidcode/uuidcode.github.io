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
        width: 102px;
        height: 102px;
        text-align: center;
        border: 1px solid black;
    }

    .cell img {
        width: 100px;
        height: 100px;
    }

    .number {
        position: absolute;
        left: 0;
        top: 0;
        width: 30px;
        height: 30px;
        background-color: #2e6da4;
        color: white;
        opacity: 0.6;
    }
</style>