package screen;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import static screen.ScreenShotPanel.AreaControlButton;

// 캡처 영역 컨트롤 패널의 버튼 순서(see/auto 가 shot 바로 다음)와
// delay shot 카운트다운의 esc 취소 상태 전이를 검증한다.
public class CaptureControlUnitTest {
    private static List<String> labels() {
        List<String> result = new ArrayList<>();

        for (AreaControlButton areaControlButton : AreaControlButton.values()) {
            result.add(areaControlButton.getLabel());
        }

        return result;
    }

    @Test
    public void seeAndAutoFollowShot() {
        List<String> labels = labels();
        int shotIndex = labels.indexOf("shot");

        assertEquals(
            "see", // expected
            labels.get(shotIndex + 1) // actual
        );

        assertEquals(
            "auto", // expected
            labels.get(shotIndex + 2) // actual
        );
    }

    @Test
    public void areaControlButtonOrderIsFixed() {
        assertEquals(
            List.of(
                "shot and write",
                "shot",
                "see",
                "auto",
                "self",
                "record",
                "delay shot",
                "delay shot all",
                "cancel"
            ), // expected
            labels() // actual
        );
    }

    // 버튼이 3 의 배수여야 3 * 3 격자가 빈칸 없이 채워진다.
    @Test
    public void areaControlButtonsFillThreeByThreeGrid() {
        assertEquals(
            3, // expected
            ScreenShotPanel.AREA_CONTROL_COLUMN_COUNT // actual
        );

        assertEquals(
            9, // expected
            AreaControlButton.values().length // actual
        );
    }

    @Test
    public void cancelIsIgnoredWhenCountdownIsNotRunning() {
        CountdownState state = new CountdownState();

        assertFalse(state.cancel());

        assertFalse(state.isCancelled());
    }

    @Test
    public void cancelIsAcceptedWhileCountdownIsRunning() {
        CountdownState state = new CountdownState();
        state.start();

        assertTrue(state.isRunning());

        assertTrue(state.cancel());

        assertTrue(state.isCancelled());
    }

    @Test
    public void cancelIsIgnoredAfterCountdownFinished() {
        CountdownState state = new CountdownState();
        state.start();
        state.finish();

        assertFalse(state.cancel());

        assertFalse(state.isCancelled());
    }

    @Test
    public void startClearsPreviousCancel() {
        CountdownState state = new CountdownState();
        state.start();
        state.cancel();
        state.finish();

        state.start();

        assertFalse(state.isCancelled());

        assertTrue(state.isRunning());
    }
}
