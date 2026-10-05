package screen;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// delay shot 두 번 시나리오: 첫 번째는 esc 로 취소해 촬영하지 않고,
// 두 번째는 끝까지 둬서 촬영까지 가는지 검증한다.
public class CaptureControlE2ETest {
    // runCountdown 과 같은 판정: 취소되지 않았을 때만 촬영한다.
    private static boolean shouldCapture(CountdownState state) {
        return !state.isCancelled();
    }

    @Test
    public void escapeDuringCountdownSkipsOnlyThatShot() {
        CountdownState state = new CountdownState();

        // 첫 번째 delay shot - 카운트다운 도중 esc
        state.start();

        assertTrue(state.cancel());

        assertFalse(shouldCapture(state));

        state.finish();

        // esc 가 카운트다운 밖에서는 촬영 취소로 쓰이지 않는다.
        assertFalse(state.cancel());

        // 두 번째 delay shot - 끝까지 진행
        state.start();

        assertTrue(shouldCapture(state));

        state.finish();

        assertTrue(shouldCapture(state));
    }
}
