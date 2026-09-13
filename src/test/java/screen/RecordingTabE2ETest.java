package screen;

import java.awt.Component;
import java.awt.Container;
import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;

import javax.imageio.ImageIO;
import javax.swing.JButton;
import javax.swing.SwingUtilities;

import org.jcodec.api.awt.AWTFrameGrab;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeTrue;

// 화면 녹화 → mp4 저장 → 첫 프레임 png 저장 → 탭 생성까지의 전체 흐름을 확인한다.
// 실제 화면 캡처가 필요하므로 헤드리스 환경에서는 건너뛴다.
public class RecordingTabE2ETest extends RenderingTestSupport {
    @Test
    public void recordedVideoBecomesPlayableTab() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        File videoFile = File.createTempFile(
            "recording-tab-e2e-", // prefix
            ScreenRecorder.VIDEO_EXTENSION, // suffix
            Util.getImageDir() // directory
        );

        ScreenRecorder recorder = new ScreenRecorder(
            new Rectangle(
                0, // x
                0, // y
                160, // width
                120 // height
            ), // captureRectangle
            ScreenRecorder.DEFAULT_FPS, // fps
            videoFile // outputFile
        );

        recorder.start();

        Thread.sleep(800);

        recorder.stop();

        String baseName = ImageFrame.toRecordingBaseName(videoFile);
        File imageFile = Util.getImageFile(baseName);

        BufferedImage firstFrame = AWTFrameGrab.getFrame(
            videoFile, // file
            0.0 // second
        );

        ImageIO.write(
            firstFrame, // im
            "png", // formatName
            imageFile // output
        );

        try {
            this.tabs.addTab(
                baseName, // name
                null, // captureRectangle
                null, // captureConfig
                false, // windowCapture
                videoFile // videoFile
            );

            SwingUtilities.invokeAndWait(() -> {
                ImagePanel panel = (ImagePanel) this.tabs.getSelectedComponent();

                assertNotNull(panel.getDisplayImage());

                assertTrue(hasButton(
                    panel, // container
                    "player" // text
                ));
            });
        } finally {
            Files.deleteIfExists(videoFile.toPath());
            Files.deleteIfExists(imageFile.toPath());
        }
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
