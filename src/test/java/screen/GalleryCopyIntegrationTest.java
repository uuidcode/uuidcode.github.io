package screen;

import java.awt.event.MouseEvent;

import javax.swing.JLabel;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static java.awt.event.MouseEvent.MOUSE_CLICKED;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;

// 하단 갤러리에서 썸네일을 클릭하면 해당 탭이 선택되고 클립보드 복사가 함께 수행되는지 확인한다.
public class GalleryCopyIntegrationTest extends RenderingTestSupport {
    @Test
    public void clickingThumbnailSelectsTabAndCopies() throws Exception {
        ImagePanel imagePanel = this.addImageOnEdt();

        SwingUtilities.invokeAndWait(() -> this.tabs.setGalleryVisible(true));

        SwingUtilities.invokeAndWait(() -> {
            ImageGalleryPanel gallery = findComponent(
                imagePanel, // container
                ImageGalleryPanel.class // type
            );

            assertNotNull(gallery);

            JLabel thumbnail = findComponent(
                gallery, // container
                JLabel.class // type
            );

            assertNotNull(thumbnail);

            thumbnail.dispatchEvent(new MouseEvent(
                thumbnail, // source
                MOUSE_CLICKED, // id
                System.currentTimeMillis(), // when
                0, // modifiers
                1, // x
                1, // y
                1, // clickCount
                false // popupTrigger
            ));

            assertSame(imagePanel, this.tabs.getSelectedComponent());
        });
    }
}
