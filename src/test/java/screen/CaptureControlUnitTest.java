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
                "record",
                "delay shot",
                "delay shot all",
                "cancel"
            ), // expected
            labels() // actual
        );
    }

    // self 가 ImageFrame 툴바로 빠져 8 개가 됐다. 3 열이라 마지막 줄 한 칸이 빈다.
    @Test
    public void areaControlButtonsFillThreeColumns() {
        assertEquals(
            3, // expected
            ScreenShotPanel.AREA_CONTROL_COLUMN_COUNT // actual
        );

        assertEquals(
            8, // expected
            AreaControlButton.values().length // actual
        );
    }

    // self 는 오버레이가 아니라 ImageFrame 툴바에 있다.
    @Test
    public void areaControlPanelHasNoSelfButton() {
        assertFalse(labels().contains("self"));
    }

    // 영역을 잡는 동안 cmd 를 누르고 있으면 안내의 cmd 줄이 켜져 보여야 한다.
    @Test
    public void cmdRowLooksActiveWhileCmdIsHeld() {
        assertTrue(ScreenShotPanel.isModifierRowActive(
            "cmd",
            true // autoTrimKeyDown
        ));
    }

    @Test
    public void cmdRowLooksInactiveWhenCmdIsNotHeld() {
        assertFalse(ScreenShotPanel.isModifierRowActive(
            "cmd",
            false // autoTrimKeyDown
        ));
    }

    // esc 는 누름 상태가 없으므로 cmd 를 눌러도 켜지면 안 된다.
    @Test
    public void escRowNeverLooksActive() {
        assertFalse(ScreenShotPanel.isModifierRowActive(
            "esc",
            true // autoTrimKeyDown
        ));
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
