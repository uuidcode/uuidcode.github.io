package screen;

// delay shot 카운트다운의 진행/취소 상태.
// 카운트다운은 촬영 스레드에서 돌고 esc 는 EDT 에서 들어오므로 volatile 로 공유한다.
class CountdownState {
    private volatile boolean running;
    private volatile boolean cancelled;

    // 새 카운트다운을 시작한다. 이전 취소 기록은 지운다.
    void start() {
        this.cancelled = false;
        this.running = true;
    }

    void finish() {
        this.running = false;
    }

    // 카운트다운이 돌고 있을 때만 취소를 받아들인다. 받아들였으면 true 를 반환한다.
    boolean cancel() {
        if (!this.running) {
            return false;
        }

        this.cancelled = true;

        return true;
    }

    boolean isRunning() {
        return this.running;
    }

    boolean isCancelled() {
        return this.cancelled;
    }
}
