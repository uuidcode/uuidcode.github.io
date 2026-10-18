package screen;

import java.awt.Component;
import java.awt.Container;
import java.awt.GraphicsEnvironment;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeTrue;

// 이미지 탭 버튼 줄의 끝은 auto, write, close 순서로 놓인다.
// Swing 컴포넌트를 생성하므로 헤드리스 환경에서는 건너뛴다.
public class ImagePanelButtonOrderApiTest extends RenderingTestSupport {
    @Test
    public void autoAndWriteArePlacedLeftOfClose() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        this.tabs.addTab(this.imageFile.getName());

        SwingUtilities.invokeAndWait(() -> {
            ImagePanel panel = (ImagePanel) this.tabs.getSelectedComponent();
            List<String> labels = buttonLabels(panel);

            int autoIndex = labels.indexOf("auto");
            int writeIndex = labels.indexOf("write");
            int closeIndex = labels.indexOf("close");

            assertTrue(autoIndex >= 0);

            assertEquals(
                autoIndex + 1, // expected
                writeIndex // actual
            );

            assertEquals(
                writeIndex + 1, // expected
                closeIndex // actual
            );
        });
    }

    private static List<String> buttonLabels(Container container) {
        List<String> labels = new ArrayList<>();

        collectButtonLabels(
            container,
            labels
        );

        return labels;
    }

    private static void collectButtonLabels(
        Container container,
        List<String> labels
    ) {
        for (Component component : container.getComponents()) {
            if (component instanceof JButton) {
                labels.add(((JButton) component).getText());
            }

            if (component instanceof Container) {
                collectButtonLabels(
                    (Container) component, // container
                    labels
                );
            }
        }
    }
}
