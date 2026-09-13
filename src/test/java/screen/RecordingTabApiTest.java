package screen;

import java.awt.Component;
import java.awt.Container;
import java.awt.GraphicsEnvironment;
import java.io.File;

import javax.swing.JButton;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeTrue;

// 영상 탭이 videoFile을 노출하고 player 버튼을 갖는지, 일반 이미지 탭은 갖지 않는지 검증한다.
// Swing 컴포넌트를 생성하므로 헤드리스 환경에서는 건너뛴다.
public class RecordingTabApiTest extends RenderingTestSupport {
    @Test
    public void videoTabExposesVideoFileAndPlayerButton() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        File videoFile = new File(
            Util.getImageDir(), // parent
            "sample.mp4" // child
        );

        this.tabs.addTab(
            this.imageFile.getName(), // name
            null, // captureRectangle
            null, // captureConfig
            false, // windowCapture
            videoFile // videoFile
        );

        SwingUtilities.invokeAndWait(() -> {
            ImagePanel panel = (ImagePanel) this.tabs.getSelectedComponent();

            assertEquals(
                videoFile, // expected
                panel.getVideoFile() // actual
            );

            assertTrue(hasButton(
                panel, // container
                "player" // text
            ));
        });
    }

    @Test
    public void imageTabHasNoPlayerButton() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        this.tabs.addTab(this.imageFile.getName());

        SwingUtilities.invokeAndWait(() -> {
            ImagePanel panel = (ImagePanel) this.tabs.getSelectedComponent();

            assertNull(panel.getVideoFile());

            assertFalse(hasButton(
                panel, // container
                "player" // text
            ));
        });
    }

    private static boolean hasButton(
        Container container,
        String text
    ) {
        for (Component component : container.getComponents()) {
            if (component instanceof JButton && text.equals(((JButton) component).getText())) {
                return true;
            }

            if (component instanceof Container && hasButton(
                (Container) component, // container
                text // text
            )) {
                return true;
            }
        }

        return false;
    }
}
