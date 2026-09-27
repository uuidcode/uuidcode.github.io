package screen;

import java.awt.Component;

import javax.swing.JLabel;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;

// 갤러리가 켜진 상태에서 탭이 추가(캡처)되면 새 탭이 선택되고, 선택된 탭의 갤러리에 새 썸네일이 포함되는지 검증한다.
public class GalleryCaptureApiTest extends RenderingTestSupport {
    @Test
    public void addingTabSelectsItAndShowsThumbnailInGallery() throws Exception {
        this.addImageOnEdt();

        SwingUtilities.invokeAndWait(() -> this.tabs.setGalleryVisible(true));

        ImagePanel captured = this.addImageOnEdt();

        SwingUtilities.invokeAndWait(() -> {
            assertSame(captured, this.tabs.getSelectedComponent());

            ImageGalleryPanel gallery = findComponent(
                captured, // container
                ImageGalleryPanel.class // type
            );

            assertNotNull(gallery);

            assertEquals(
                this.tabs.getTabCount(), // expected
                countThumbnails(gallery) // actual
            );
        });
    }

    private static int countThumbnails(Component component) {
        int total = 0;

        if (component instanceof JLabel && ((JLabel) component).getIcon() != null) {
            total++;
        }

        if (component instanceof java.awt.Container) {
            for (Component child : ((java.awt.Container) component).getComponents()) {
                total += countThumbnails(child);
            }
        }

        return total;
    }
}
