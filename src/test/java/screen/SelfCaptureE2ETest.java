package screen;

import java.awt.Component;
import java.awt.Container;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

import javax.swing.AbstractButton;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// 자신을 찍는 경로가 alt(cmd)+tab 하나로 통일됐는지 확인한다.
// 툴바에도, 캡처 영역 컨트롤 패널에도 self 관련 버튼이 없어야 하고,
// capture 중에도 ImageFrame 은 숨겨지지 않아야 한다.
public class SelfCaptureE2ETest {
    @Test
    public void noSelfButtonAnywhereAndFrameStaysVisible() throws Exception {
        AtomicReference<List<String>> toolbarLabels = new AtomicReference<>();
        AtomicBoolean visibleAfterToBack = new AtomicBoolean();

        SwingUtilities.invokeAndWait(() -> {
            ImageFrame imageFrame = new ImageFrame();

            try {
                toolbarLabels.set(buttonLabels(imageFrame.createControlPanel()));

                imageFrame.toBack();

                visibleAfterToBack.set(imageFrame.isVisible());
            } finally {
                imageFrame.dispose();
            }
        });

        assertTrue(toolbarLabels.get().contains("capture"));

        assertFalse(toolbarLabels.get().contains("self"));

        assertFalse(toolbarLabels.get().contains("self area"));

        for (ScreenShotPanel.AreaControlButton areaControlButton : ScreenShotPanel.AreaControlButton.values()) {
            assertFalse("self".equals(areaControlButton.getLabel()));
        }

        assertTrue(visibleAfterToBack.get());
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
