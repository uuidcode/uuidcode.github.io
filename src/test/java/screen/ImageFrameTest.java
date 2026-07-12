package screen;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ImageFrameTest {
    @Test
    public void toCaptureButtonLabelRemovesCapturePrefix() {
        assertEquals("auto", ImageFrame.toCaptureButtonLabel("capture auto"));
        assertEquals("self area", ImageFrame.toCaptureButtonLabel("capture self area"));
    }

    @Test
    public void toCaptureButtonLabelKeepsLabelsWithoutPrefix() {
        assertEquals("clipboard", ImageFrame.toCaptureButtonLabel("clipboard"));
    }
}
