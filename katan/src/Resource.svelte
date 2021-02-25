<script>
    import katan from './katan.js'
</script>

<div class="modal fade" id="resourceModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="max-width:800px">
        <div class="modal-content">
            <div class="modal-body">
                <Player type="modal"
                        playerIndex={$katan.playerIndex}></Player>
            </div>

            <div class="modal-footer">
                <button type="button"
                        on:click={()=>katan.closeResourceModalAndTurn()}
                        class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            </div>
        </div>
    </div>
</div>