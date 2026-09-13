package screen;

import java.io.File;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class RecordingTabUnitTest {
    @Test
    public void toRecordingBaseNameStripsMp4Extension() {
        String baseName = ImageFrame.toRecordingBaseName(new File("2026-09-13-10-20-30.mp4"));

        assertEquals(
            "2026-09-13-10-20-30", // expected
            baseName // actual
        );
    }

    @Test
    public void toRecordingBaseNameKeepsNameWithoutExtension() {
        String baseName = ImageFrame.toRecordingBaseName(new File("sample"));

        assertEquals(
            "sample", // expected
            baseName // actual
        );
    }

    @Test
    public void toRecordingBaseNameUsesFileNameOnly() {
        String baseName = ImageFrame.toRecordingBaseName(new File("/tmp/screenshot/clip.mp4"));

        assertEquals(
            "clip", // expected
            baseName // actual
        );
    }
}
