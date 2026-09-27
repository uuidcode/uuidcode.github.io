package screen;

import java.awt.Component;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.SwingUtilities;
import javax.swing.border.LineBorder;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

// 캡처 중 프레임이 숨겨진 상태에서 새 이미지 파일이 캡처되면,
// 다시 표시될 때 그 이미지가 갤러리에서 선택(강조)되고 화면 안으로 스크롤되어 보이는 전체 흐름을 검증한다.
public class GalleryCaptureE2ETest extends RenderingTestSupport {
    private static final int SELECTED_THICKNESS = 3;

    @Test
    public void capturedImageIsActivatedAndVisibleInGallery() throws Exception {
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

        for (int i = 0; i < 6; i++) {
            this.addImageOnEdt();
        }

        SwingUtilities.invokeAndWait(() -> this.tabs.setGalleryVisible(true));

        SwingUtilities.invokeAndWait(() -> frameHolder[0].setVisible(false));

        File captured = File.createTempFile(
            "captured-", // prefix
            ".png", // suffix
            Util.getImageDir() // directory
        );

        BufferedImage image = new BufferedImage(
            320, // width
            200, // height
            BufferedImage.TYPE_INT_RGB // imageType
        );

        ImageIO.write(
            image, // im
            "png", // formatName
            captured // output
        );

        this.tabs.addTab(
            captured.getName(), // name
            new Rectangle(
                0, // x
                0, // y
                320, // width
                200 // height
            ), // captureRectangle
            new CaptureConfig(), // captureConfig
            false // windowCapture
        );

        SwingUtilities.invokeAndWait(() -> frameHolder[0].setVisible(true));

        Thread.sleep(300);

        SwingUtilities.invokeAndWait(() -> {
            ImagePanel selected = (ImagePanel) this.tabs.getSelectedComponent();

            assertEquals(
                captured.getName(), // expected
                selected.getTabName() // actual
            );

            ImageGalleryPanel gallery = findComponent(
                selected, // container
                ImageGalleryPanel.class // type
            );

            JScrollPane scrollPane = findComponent(
                gallery, // container
                JScrollPane.class // type
            );

            JLabel capturedThumbnail = lastThumbnail(gallery);

            assertNotNull(capturedThumbnail);

            assertEquals(
                SELECTED_THICKNESS, // expected
                ((LineBorder) capturedThumbnail.getBorder()).getThickness() // actual
            );

            assertTrue(
                "captured thumbnail must be scrolled into view", // message
                scrollPane.getViewport().getViewRect().intersects(capturedThumbnail.getBounds()) // condition
            );
        });

        SwingUtilities.invokeAndWait(() -> frameHolder[0].dispose());
        captured.delete();
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
