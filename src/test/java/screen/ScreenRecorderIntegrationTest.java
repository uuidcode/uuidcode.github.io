package screen;

import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import java.io.File;
import java.nio.file.Files;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeTrue;

// 실제 화면과 Robot을 사용하는 통합 테스트. 헤드리스 환경에서는 건너뛴다.
public class ScreenRecorderIntegrationTest {
    @Test
    public void recordsRealScreenRegionIntoMp4() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        File outputFile = File.createTempFile(
            "screen-recorder-integration-", // prefix
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

            assertTrue(recorder.isRecording());

            Thread.sleep(600);

            recorder.stop();

            assertFalse(recorder.isRecording());
            assertTrue(outputFile.exists());
            assertTrue(outputFile.length() > 0);
        } finally {
            Files.deleteIfExists(outputFile.toPath());
        }
    }
}
