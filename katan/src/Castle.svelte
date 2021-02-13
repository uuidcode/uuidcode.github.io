<script>
    export let castle;

    let style = `left:${castle.left}px;top:${castle.top}px`;
</script>

<div class="castle" style={style}>
</div>

<style>
    .castle {
        position: absolute;
        width: 40px;
        height: 40px;
        text-align: center;
        border: 1px solid black;
        border-radius: 30px;
        background-color: lightyellow;
    }
</style>