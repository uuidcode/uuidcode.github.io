package screen;

import java.awt.Component;
import java.awt.Container;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import javax.swing.AbstractButton;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// self / self area 버튼이 ImageFrame 툴바에서 빠졌는지,
// 캡처 영역 UI 의 self 토글이 ImageFrame 을 실제로 여닫는지 검증한다.
public class SelfCaptureIntegrationTest {
    // self 를 두 번 누르면 보였다가 다시 숨겨져 원래 상태로 돌아와야 한다.
    @Test
    public void selfTogglesImageFrameVisibility() throws Exception {
        AtomicReference<boolean[]> states = new AtomicReference<>();

        SwingUtilities.invokeAndWait(() -> {
            ImageFrame imageFrame = new ImageFrame();

            try {
                imageFrame.setVisible(false);

                ScreenShotPanel panel = new ScreenShotPanel(
                    java.awt.GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice(),
                    imageFrame,
                    null, // screenShotFrame
                    null // baseScreenImage
                );

                invokeToggleSelf(panel);
                boolean afterFirst = imageFrame.isVisible();

                invokeToggleSelf(panel);
                boolean afterSecond = imageFrame.isVisible();

                states.set(new boolean[] {afterFirst, afterSecond});
            } catch (Exception e) {
                throw new RuntimeException(e);
            } finally {
                imageFrame.dispose();
            }
        });

        assertTrue(states.get()[0]);

        assertFalse(states.get()[1]);
    }

    private static void invokeToggleSelf(ScreenShotPanel panel) throws Exception {
        java.lang.reflect.Method method = ScreenShotPanel.class.getDeclaredMethod("toggleSelf");
        method.setAccessible(true);
        method.invoke(panel);
    }

    @Test
    public void imageFrameToolbarNoLongerHasSelfButtons() throws Exception {
        AtomicReference<List<String>> labels = new AtomicReference<>();

        SwingUtilities.invokeAndWait(() -> {
            ImageFrame imageFrame = new ImageFrame();

            try {
                labels.set(buttonLabels(imageFrame.createControlPanel()));
            } finally {
                imageFrame.dispose();
            }
        });

        assertTrue(labels.get().contains("capture"));

        assertFalse(labels.get().contains("self"));

        assertFalse(labels.get().contains("self area"));
    }

    private static List<String> buttonLabels(Container container) {
        List<String> result = new ArrayList<>();
        collect(container, result);

        return result;
    }

    private static void collect(
        Component component,
        List<String> result
    ) {
        if (component instanceof AbstractButton) {
            result.add(((AbstractButton) component).getText());
        }

        if (component instanceof Container) {
            for (Component child : ((Container) component).getComponents()) {
                collect(child, result);
            }
        }
    }
}
