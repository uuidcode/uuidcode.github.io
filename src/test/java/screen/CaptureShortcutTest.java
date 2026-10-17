package screen;

import java.util.Arrays;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

public class CaptureShortcutTest {
    // 버튼으로 시작한 캡처는 놓아도 바로 찍히지 않으므로 "놓으면" 안내가 없다.
    @Test
    public void noneIsNotShortcut() {
        assertFalse(CaptureShortcut.NONE.isShortcut());

        assertNull(CaptureShortcut.NONE.toActionLabel(false));

        assertNull(CaptureShortcut.NONE.toReleaseActionLabel(false));
    }

    // 왼쪽 설명에는 영역을 드래그해서 쓰는 shift+f2 ~ shift+f5 를 f2 부터 순서대로 모두 펼친다.
    // shift+f1 은 영역과 상관없이 창만 앞으로 부르므로 빠진다.
    @Test
    public void areaShortcutListCoversF2ToF5InOrder() {
        assertEquals(
            Arrays.asList(
                CaptureShortcut.CAPTURE,
                CaptureShortcut.SHOT,
                CaptureShortcut.SHOT_AND_RETURN,
                CaptureShortcut.SHOT_AND_WRITE
            ), // expected
            CaptureShortcut.getAreaShortcutList() // actual
        );
    }

    @Test
    public void areaShortcutListExcludesNone() {
        assertFalse(CaptureShortcut.getAreaShortcutList().contains(CaptureShortcut.NONE));
    }

    // 키 이름이 ImageFrame 의 키코드 매핑과 어긋나면 왼쪽 설명이 거짓말을 한다.
    @Test
    public void areaShortcutsKnowTheirKey() {
        assertEquals("shift+f2", CaptureShortcut.CAPTURE.getKeyLabel());

        assertEquals("shift+f3", CaptureShortcut.SHOT.getKeyLabel());

        assertEquals("shift+f4", CaptureShortcut.SHOT_AND_RETURN.getKeyLabel());

        assertEquals("shift+f5", CaptureShortcut.SHOT_AND_WRITE.getKeyLabel());
    }

    @Test
    public void functionKeysAreShortcuts() {
        assertTrue(CaptureShortcut.CAPTURE.isShortcut());

        assertTrue(CaptureShortcut.SHOT.isShortcut());

        assertTrue(CaptureShortcut.SHOT_AND_RETURN.isShortcut());

        assertTrue(CaptureShortcut.SHOT_AND_WRITE.isShortcut());
    }

    // 단축키가 곧 어느 버튼을 누른 셈이 되는지를 정한다.
    @Test
    public void shortcutCarriesAutoShotMode() {
        assertSame(AutoShotMode.NONE, CaptureShortcut.CAPTURE.getAutoShotMode());

        assertSame(AutoShotMode.SHOT, CaptureShortcut.SHOT.getAutoShotMode());

        assertSame(AutoShotMode.SHOT_AND_RETURN, CaptureShortcut.SHOT_AND_RETURN.getAutoShotMode());

        assertSame(AutoShotMode.SHOT_AND_WRITE, CaptureShortcut.SHOT_AND_WRITE.getAutoShotMode());
    }

    // shift+f4 는 shot 과 똑같이 찍되, 끝나고 화면을 유지하지 않고 ImageFrame 으로 돌아온다.
    @Test
    public void shotAndReturnShootsLikeShotButComesBack() {
        assertEquals("shot and return", CaptureShortcut.SHOT_AND_RETURN.toActionLabel(false));

        assertEquals("auto and return", CaptureShortcut.SHOT_AND_RETURN.toActionLabel(true));

        assertTrue(CaptureShortcut.SHOT_AND_RETURN.getAutoShotMode().isReturnToImageFrame());

        assertFalse(CaptureShortcut.SHOT_AND_RETURN.getAutoShotMode().isWriteAfterCapture());
    }

    // 돌아오기는 shift+f4 에만 붙는다. 다른 단축키는 keep screen 설정을 그대로 따른다.
    @Test
    public void otherShortcutsDoNotReturnToImageFrame() {
        assertFalse(CaptureShortcut.CAPTURE.getAutoShotMode().isReturnToImageFrame());

        assertFalse(CaptureShortcut.SHOT.getAutoShotMode().isReturnToImageFrame());

        assertFalse(CaptureShortcut.SHOT_AND_WRITE.getAutoShotMode().isReturnToImageFrame());
    }

    // 왼쪽 설명에는 단축키 이름을 그대로 쓰고, 영역 안에는 놓는 순간 무엇이 되는지를 쓴다.
    // shift+f2 는 놓아도 바로 찍지 않고 버튼이 뜰 뿐이라 둘이 갈린다.
    @Test
    public void captureDescribesItselfAsCaptureButReleasesIntoButtons() {
        assertEquals("capture", CaptureShortcut.CAPTURE.toActionLabel(false));

        assertEquals("capture", CaptureShortcut.CAPTURE.toActionLabel(true));

        assertEquals("버튼 선택", CaptureShortcut.CAPTURE.toReleaseActionLabel(false));

        assertEquals("버튼 선택", CaptureShortcut.CAPTURE.toReleaseActionLabel(true));
    }

    // cmd 를 누른 채 놓으면 여백을 자동으로 잘라내는 auto 쪽으로 가고,
    // 왼쪽 설명도 그동안 같은 이름으로 바뀐다.
    @Test
    public void autoShotShortcutsSwitchToAutoWhenCommandIsHeld() {
        assertEquals("shot", CaptureShortcut.SHOT.toActionLabel(false));

        assertEquals("auto", CaptureShortcut.SHOT.toActionLabel(true));

        assertEquals("shot", CaptureShortcut.SHOT.toReleaseActionLabel(false));

        assertEquals("auto", CaptureShortcut.SHOT.toReleaseActionLabel(true));

        assertEquals("shot and write", CaptureShortcut.SHOT_AND_WRITE.toActionLabel(false));

        assertEquals("auto and write", CaptureShortcut.SHOT_AND_WRITE.toActionLabel(true));

        assertEquals("auto and write", CaptureShortcut.SHOT_AND_WRITE.toReleaseActionLabel(true));
    }

    @Test
    public void everyAreaShortcutHasAnActionLabelForBothCommandStates() {
        for (CaptureShortcut areaShortcut : CaptureShortcut.getAreaShortcutList()) {
            assertNotNull(areaShortcut.getKeyLabel());

            assertNotNull(areaShortcut.toActionLabel(false));

            assertNotNull(areaShortcut.toActionLabel(true));

            assertNotNull(areaShortcut.toReleaseActionLabel(false));

            assertNotNull(areaShortcut.toReleaseActionLabel(true));
        }
    }
}
