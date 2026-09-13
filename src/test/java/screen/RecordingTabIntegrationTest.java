package screen;

import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;

import javax.imageio.ImageIO;
import javax.swing.SwingUtilities;

import org.jcodec.api.awt.AWTFrameGrab;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assume.assumeTrue;

// 녹화한 mp4의 첫 프레임이 탭 이미지로 표시되고 영상 파일이 탭에 연결되는지 검증한다.
// 실제 화면 캡처가 필요하므로 헤드리스 환경에서는 건너뛴다.
public class RecordingTabIntegrationTest extends RenderingTestSupport {
    @Test
    public void firstFrameOfRecordingBecomesTabImage() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        File videoFile = File.createTempFile(
            "recording-tab-integration-", // prefix
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

        Thread.sleep(700);

        recorder.stop();

        BufferedImage firstFrame = AWTFrameGrab.getFrame(
            videoFile, // file
            0.0 // second
        );

        File imageFile = File.createTempFile(
            "recording-tab-frame-", // prefix
            ".png", // suffix
            Util.getImageDir() // directory
        );

        ImageIO.write(
            firstFrame, // im
            "png", // formatName
            imageFile // output
        );

        try {
            this.tabs.addTab(
                imageFile.getName(), // name
                null, // captureRectangle
                null, // captureConfig
                false, // windowCapture
                videoFile // videoFile
            );

            SwingUtilities.invokeAndWait(() -> {
                ImagePanel panel = (ImagePanel) this.tabs.getSelectedComponent();

                assertNotNull(panel.getDisplayImage());

                assertEquals(
                    videoFile, // expected
                    panel.getVideoFile() // actual
                );
            });
        } finally {
            Files.deleteIfExists(videoFile.toPath());
            Files.deleteIfExists(imageFile.toPath());
        }
    }
}
