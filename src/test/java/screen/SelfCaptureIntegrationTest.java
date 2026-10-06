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

// self / self area 버튼이 ImageFrame 툴바에서 빠졌는지 검증한다.
public class SelfCaptureIntegrationTest {
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
