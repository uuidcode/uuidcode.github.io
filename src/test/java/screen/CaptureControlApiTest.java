package screen;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// esc 는 EDT 에서, 카운트다운은 촬영 스레드에서 돌기 때문에
// 다른 스레드의 취소가 대기 중인 스레드에 보이는지 검증한다.
public class CaptureControlApiTest {
    private static final int TIMEOUT_SECOND = 5;
    private static final int POLL_INTERVAL_MS = 10;

    @Test
    public void cancelFromAnotherThreadIsObservedByWaitingThread() throws Exception {
        CountdownState state = new CountdownState();
        state.start();

        CountDownLatch waiting = new CountDownLatch(1);
        CountDownLatch finished = new CountDownLatch(1);
        AtomicBoolean observedCancel = new AtomicBoolean();

        Thread countdownThread = new Thread(() -> {
            waiting.countDown();

            while (!state.isCancelled()) {
                try {
                    Thread.sleep(POLL_INTERVAL_MS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();

                    return;
                }
            }

            observedCancel.set(true);

            finished.countDown();
        }, "countdown-state-test");

        countdownThread.start();

        assertTrue(waiting.await(TIMEOUT_SECOND, TimeUnit.SECONDS));

        assertTrue(state.cancel());

        assertTrue(finished.await(TIMEOUT_SECOND, TimeUnit.SECONDS));

        countdownThread.join();

        assertTrue(observedCancel.get());

        state.finish();

        assertFalse(state.isRunning());
    }
}
