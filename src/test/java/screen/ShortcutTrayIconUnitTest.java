package screen;

import java.awt.Image;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// 메뉴바 아이콘이 보여 줄 단축키 목록과 아이콘 그리기를 검증한다.
// SystemTray 등록은 화면이 있어야 하므로 여기서 하지 않는다.
public class ShortcutTrayIconUnitTest {
    private static List<String> menuLabels() {
        List<String> result = new ArrayList<>();

        for (FunctionShortcut functionShortcut : FunctionShortcut.values()) {
            result.add(functionShortcut.getMenuLabel());
        }

        return result;
    }

    @Test
    public void hasSixShortcuts() {
        assertEquals(
            6, // expected
            FunctionShortcut.values().length // actual
        );
    }

    @Test
    public void shortcutsAreFunctionKeyOneToSix() {
        int[] expected = {
            KeyEvent.VK_F1,
            KeyEvent.VK_F2,
            KeyEvent.VK_F3,
            KeyEvent.VK_F4,
            KeyEvent.VK_F5,
            KeyEvent.VK_F6
        };

        FunctionShortcut[] shortcuts = FunctionShortcut.values();

        for (int index = 0; index < expected.length; index++) {
            assertEquals(
                expected[index], // expected
                shortcuts[index].getKeyCode() // actual
            );
        }
    }

    @Test
    public void menuShowsShiftPrefixedShortcutText() {
        assertEquals(
            "shift+F1", // expected
            FunctionShortcut.TO_FRONT.getShortcutText() // actual
        );

        assertEquals(
            "shift+F6", // expected
            FunctionShortcut.SHOT_AND_WRITE_AND_RETURN.getShortcutText() // actual
        );
    }

    @Test
    public void everyMenuLabelHasShortcutAndTitle() {
        for (FunctionShortcut functionShortcut : FunctionShortcut.values()) {
            String label = functionShortcut.getMenuLabel();

            assertTrue(label.startsWith("shift+F"));

            assertTrue(label.contains(functionShortcut.getTitle()));
        }
    }

    // 같은 설명이 둘 이상이면 메뉴에서 어느 것인지 구분할 수 없다.
    @Test
    public void menuLabelsAreUnique() {
        List<String> labels = menuLabels();

        assertEquals(
            labels.size(), // expected
            labels.stream().distinct().count() // actual
        );
    }

    @Test
    public void hotkeyNameMatchesKeyCode() {
        for (FunctionShortcut functionShortcut : FunctionShortcut.values()) {
            int offset = functionShortcut.getKeyCode() - KeyEvent.VK_F1;

            assertEquals(
                "f" + (offset + 1), // expected
                functionShortcut.getHotkeyName() // actual
            );
        }
    }

    @Test
    public void iconIsDrawnAtRequestedSize() {
        Image icon = ShortcutTrayIcon.createIcon(32);

        assertEquals(
            32, // expected
            icon.getWidth(null) // actual
        );

        assertEquals(
            32, // expected
            icon.getHeight(null) // actual
        );
    }

    // 전부 투명하면 메뉴바에서 아무것도 안 보인다.
    @Test
    public void iconHasVisiblePixels() {
        BufferedImage icon = (BufferedImage) ShortcutTrayIcon.createIcon(32);

        boolean painted = false;

        for (int y = 0; y < icon.getHeight(); y++) {
            for (int x = 0; x < icon.getWidth(); x++) {
                if (((icon.getRGB(x, y) >> 24) & 0xFF) != 0) {
                    painted = true;
                }
            }
        }

        assertTrue(painted);
    }

    @Test
    public void iconBackgroundStaysTransparent() {
        BufferedImage icon = (BufferedImage) ShortcutTrayIcon.createIcon(32);

        assertFalse(((icon.getRGB(0, 0) >> 24) & 0xFF) != 0);
    }
}
