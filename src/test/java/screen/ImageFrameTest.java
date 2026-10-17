package screen;

import java.awt.event.KeyEvent;

import javax.swing.JPanel;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ImageFrameTest {
    @Test
    public void toCaptureButtonLabelKeepsCaptureButtonName() {
        assertEquals("capture", ImageFrame.toCaptureButtonLabel("capture"));
    }

    @Test
    public void toCaptureButtonLabelRemovesCapturePrefixFromExtendedLabels() {
        assertEquals("self area", ImageFrame.toCaptureButtonLabel("capture self area"));
    }

    @Test
    public void toCaptureButtonLabelKeepsLabelsWithoutPrefix() {
        assertEquals("clipboard", ImageFrame.toCaptureButtonLabel("clipboard"));
    }

    @Test
    public void captureShortcutIsF2() {
        assertEquals(KeyEvent.VK_F2, ImageFrame.CAPTURE_SHORTCUT_KEY_CODE);
    }

    @Test
    public void toFrontShortcutIsF1() {
        assertEquals(KeyEvent.VK_F1, ImageFrame.TO_FRONT_SHORTCUT_KEY_CODE);
    }

    @Test
    public void toFrontCaptureShortcutIsF3() {
        assertEquals(KeyEvent.VK_F3, ImageFrame.TO_FRONT_CAPTURE_SHORTCUT_KEY_CODE);
    }

    @Test
    public void autoShotShortcutsAreF4ToF6() {
        assertEquals(KeyEvent.VK_F4, ImageFrame.AUTO_SHOT_SHORTCUT_KEY_CODE);

        assertEquals(KeyEvent.VK_F5, ImageFrame.AUTO_SHOT_WRITE_SHORTCUT_KEY_CODE);

        assertEquals(KeyEvent.VK_F6, ImageFrame.AUTO_TRIM_SHOT_WRITE_SHORTCUT_KEY_CODE);
    }

    // 네이티브 헬퍼가 내려 주는 이름과 자바가 찾는 이름이 어긋나면 전역 단축키가 먹지 않는다.
    @Test
    public void globalHotkeyNamesMatchShortcutKeys() {
        assertEquals("f1", ImageFrame.TO_FRONT_HOTKEY_NAME);

        assertEquals("f2", ImageFrame.CAPTURE_HOTKEY_NAME);

        assertEquals("f3", ImageFrame.TO_FRONT_CAPTURE_HOTKEY_NAME);

        assertEquals("f4", ImageFrame.AUTO_SHOT_HOTKEY_NAME);

        assertEquals("f5", ImageFrame.AUTO_SHOT_WRITE_HOTKEY_NAME);

        assertEquals("f6", ImageFrame.AUTO_TRIM_SHOT_WRITE_HOTKEY_NAME);
    }

    @Test
    public void functionKeyShortcutRunsWithShift() {
        assertTrue(ImageFrame.isFunctionKeyShortcutEnabled(keyEvent(KeyEvent.SHIFT_DOWN_MASK)));
    }

    // 맨 기능키는 받아쓰기 등 시스템 기능이, cmd+f5 는 VoiceOver 가 먼저 가져가므로
    // shift 조합으로만 받는다.
    @Test
    public void functionKeyShortcutIsIgnoredWithoutShift() {
        assertFalse(ImageFrame.isFunctionKeyShortcutEnabled(keyEvent(0)));

        assertFalse(ImageFrame.isFunctionKeyShortcutEnabled(keyEvent(KeyEvent.META_DOWN_MASK)));
    }

    @Test
    public void functionKeyShortcutIsIgnoredWhenOtherModifierIsPressed() {
        assertFalse(ImageFrame.isFunctionKeyShortcutEnabled(
            keyEvent(KeyEvent.SHIFT_DOWN_MASK | KeyEvent.META_DOWN_MASK)));

        assertFalse(ImageFrame.isFunctionKeyShortcutEnabled(
            keyEvent(KeyEvent.SHIFT_DOWN_MASK | KeyEvent.CTRL_DOWN_MASK)));
    }

    private static KeyEvent keyEvent(int modifiers) {
        return new KeyEvent(
            new JPanel(), // source
            KeyEvent.KEY_RELEASED, // id
            0L, // when
            modifiers,
            ImageFrame.CAPTURE_SHORTCUT_KEY_CODE, // keyCode
            KeyEvent.CHAR_UNDEFINED // keyChar
        );
    }
}
