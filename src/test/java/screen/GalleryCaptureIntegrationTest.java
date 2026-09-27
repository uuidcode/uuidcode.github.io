package screen;

import java.awt.Component;
import java.awt.Rectangle;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

// 캡처 중 프레임이 숨겨진 상태로 갤러리가 만들어져도, 다시 표시되면 선택된 썸네일이 화면 안으로 스크롤되는지 검증한다.
public class GalleryCaptureIntegrationTest extends RenderingTestSupport {
    @Test
    public void selectedThumbnailBecomesVisibleAfterHiddenCapture() throws Exception {
        JFrame[] frameHolder = new JFrame[1];

        SwingUtilities.invokeAndWait(() -> {
            JFrame frame = new JFrame();
            frame.setSize(
                500, // width
                500 // height
            );

            frame.add(this.tabs);
            frameHolder[0] = frame;
            frame.setVisible(true);
        });

        // 갤러리 strip 이 뷰포트보다 넓어지도록 여러 탭을 만든다.
        for (int i = 0; i < 6; i++) {
            this.addImageOnEdt();
        }

        SwingUtilities.invokeAndWait(() -> this.tabs.setGalleryVisible(true));

        // 캡처 중처럼 프레임을 숨긴 상태에서 탭을 추가한다.
        SwingUtilities.invokeAndWait(() -> frameHolder[0].setVisible(false));

        this.addImageOnEdt();

        SwingUtilities.invokeAndWait(() -> frameHolder[0].setVisible(true));

        Thread.sleep(300);

        SwingUtilities.invokeAndWait(() -> {
            ImagePanel selected = (ImagePanel) this.tabs.getSelectedComponent();

            ImageGalleryPanel gallery = findComponent(
                selected, // container
                ImageGalleryPanel.class // type
            );

            JScrollPane scrollPane = findComponent(
                gallery, // container
                JScrollPane.class // type
            );

            JLabel lastThumbnail = lastThumbnail(gallery);

            assertNotNull(lastThumbnail);

            Rectangle viewRect = scrollPane.getViewport().getViewRect();

            assertTrue(
                "captured thumbnail must be scrolled into view", // message
                viewRect.intersects(lastThumbnail.getBounds()) // condition
            );
        });

        SwingUtilities.invokeAndWait(() -> frameHolder[0].dispose());
    }

    private static JLabel lastThumbnail(Component component) {
        JLabel[] holder = new JLabel[1];
        collectLast(component, holder);

        return holder[0];
    }

    private static void collectLast(Component component, JLabel[] holder) {
        if (component instanceof JLabel && ((JLabel) component).getIcon() != null) {
            holder[0] = (JLabel) component;
        }

        if (component instanceof java.awt.Container) {
            for (Component child : ((java.awt.Container) component).getComponents()) {
                collectLast(child, holder);
            }
        }
    }
}
