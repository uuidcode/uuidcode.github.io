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

    // 네이티브 헬퍼가 내려 주는 이름과 자바가 찾는 이름이 어긋나면 전역 단축키가 먹지 않는다.
    @Test
    public void globalHotkeyNamesMatchShortcutKeys() {
        assertEquals("f1", ImageFrame.TO_FRONT_HOTKEY_NAME);

        assertEquals("f2", ImageFrame.CAPTURE_HOTKEY_NAME);

        assertEquals("f3", ImageFrame.TO_FRONT_CAPTURE_HOTKEY_NAME);
    }

    @Test
    public void directShortcutRunsWhenPressedWithoutModifier() {
        assertTrue(ImageFrame.isDirectShortcutEnabled(keyEvent(0)));
    }

    @Test
    public void directShortcutIsIgnoredWhenModifierIsPressed() {
        assertFalse(ImageFrame.isDirectShortcutEnabled(keyEvent(KeyEvent.META_DOWN_MASK)));

        assertFalse(ImageFrame.isDirectShortcutEnabled(keyEvent(KeyEvent.SHIFT_DOWN_MASK)));
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
