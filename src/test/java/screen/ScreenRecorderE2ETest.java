package screen;

import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;

import org.jcodec.api.awt.AWTFrameGrab;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeTrue;

// 화면을 녹화해 MP4로 저장한 뒤, 저장된 파일을 실제로 디코딩해 재생 가능한지까지 확인하는 종단 테스트.
// 실제 화면 캡처가 필요하므로 헤드리스 환경에서는 건너뛴다.
public class ScreenRecorderE2ETest {
    @Test
    public void recordedMp4CanBeDecodedBack() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        File outputFile = File.createTempFile(
            "screen-recorder-e2e-", // prefix
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
            outputFile // outputFile
        );

        try {
            recorder.start();

            Thread.sleep(800);

            recorder.stop();

            assertTrue(outputFile.length() > 0);

            BufferedImage firstFrame = AWTFrameGrab.getFrame(
                outputFile, // file
                0.0 // second
            );

            assertNotNull(firstFrame);
            assertTrue(firstFrame.getWidth() > 0);
            assertTrue(firstFrame.getHeight() > 0);
        } finally {
            Files.deleteIfExists(outputFile.toPath());
        }
    }
}
