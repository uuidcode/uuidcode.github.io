package screen;

import java.awt.GraphicsEnvironment;
import java.awt.Rectangle;
import java.io.File;
import java.nio.file.Files;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.junit.Assume.assumeTrue;

// ScreenRecorder 공개 API의 계약을 검증한다. 실제 캡처가 필요하므로 헤드리스 환경에서는 건너뛴다.
public class ScreenRecorderApiTest {
    @Test
    public void startIsIdempotentAndStopReturnsOutputFile() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        File outputFile = File.createTempFile(
            "screen-recorder-api-", // prefix
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
            assertSame(
                outputFile, // expected
                recorder.getOutputFile() // actual
            );

            recorder.start();
            recorder.start();

            assertTrue(recorder.isRecording());

            Thread.sleep(400);

            File stopped = recorder.stop();

            assertEquals(
                outputFile, // expected
                stopped // actual
            );

            assertNull(recorder.getFailure());
        } finally {
            Files.deleteIfExists(outputFile.toPath());
        }
    }
}
