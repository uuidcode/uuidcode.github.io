package screen;

import java.awt.Component;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JLabel;
import javax.swing.SwingUtilities;
import javax.swing.border.LineBorder;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

// 갤러리에서 선택된(활성화된) 탭의 썸네일이 두꺼운 선택 테두리로 강조되는지 검증한다.
public class GalleryCaptureUnitTest extends RenderingTestSupport {
    private static final int SELECTED_THICKNESS = 3;
    private static final int NORMAL_THICKNESS = 1;

    @Test
    public void selectedTabThumbnailIsHighlighted() throws Exception {
        this.addImageOnEdt();
        this.addImageOnEdt();

        SwingUtilities.invokeAndWait(() -> this.tabs.setGalleryVisible(true));

        SwingUtilities.invokeAndWait(() -> {
            this.tabs.setSelectedIndex(0);

            ImagePanel selectedPanel = (ImagePanel) this.tabs.getSelectedComponent();

            ImageGalleryPanel gallery = findComponent(
                selectedPanel, // container
                ImageGalleryPanel.class // type
            );

            List<JLabel> thumbnails = collectThumbnails(gallery);

            assertEquals(
                2, // expected
                thumbnails.size() // actual
            );

            assertEquals(
                SELECTED_THICKNESS, // expected
                thickness(thumbnails.get(0)) // actual
            );

            assertEquals(
                NORMAL_THICKNESS, // expected
                thickness(thumbnails.get(1)) // actual
            );
        });
    }

    private static int thickness(JLabel thumbnail) {
        return ((LineBorder) thumbnail.getBorder()).getThickness();
    }

    private static List<JLabel> collectThumbnails(Component component) {
        List<JLabel> result = new ArrayList<>();
        collect(component, result);

        return result;
    }

    private static void collect(Component component, List<JLabel> result) {
        if (component instanceof JLabel && ((JLabel) component).getIcon() != null) {
            result.add((JLabel) component);
        }

        if (component instanceof java.awt.Container) {
            for (Component child : ((java.awt.Container) component).getComponents()) {
                collect(child, result);
            }
        }
    }
}
