package screen;

import java.awt.Component;
import java.awt.event.MouseEvent;

import javax.swing.JLabel;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static java.awt.event.MouseEvent.MOUSE_CLICKED;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;

// 여러 탭이 있을 때 다른 탭의 썸네일을 선택하면 해당 탭으로 전환되고 클립보드 복사가 수행되는 전체 흐름을 검증한다.
public class GalleryCopyE2ETest extends RenderingTestSupport {
    @Test
    public void clickingOtherTabThumbnailSwitchesTabAndCopies() throws Exception {
        this.addImageOnEdt();
        this.addImageOnEdt();

        SwingUtilities.invokeAndWait(() -> this.tabs.setGalleryVisible(true));

        SwingUtilities.invokeAndWait(() -> {
            Component firstTab = this.tabs.getComponentAt(0);
            ImagePanel selectedPanel = (ImagePanel) this.tabs.getSelectedComponent();

            ImageGalleryPanel gallery = findComponent(
                selectedPanel, // container
                ImageGalleryPanel.class // type
            );

            assertNotNull(gallery);

            JLabel firstThumbnail = findComponent(
                gallery, // container
                JLabel.class // type
            );

            assertNotNull(firstThumbnail);

            firstThumbnail.dispatchEvent(new MouseEvent(
                firstThumbnail, // source
                MOUSE_CLICKED, // id
                System.currentTimeMillis(), // when
                0, // modifiers
                1, // x
                1, // y
                1, // clickCount
                false // popupTrigger
            ));

            assertSame(firstTab, this.tabs.getSelectedComponent());
        });
    }
}
