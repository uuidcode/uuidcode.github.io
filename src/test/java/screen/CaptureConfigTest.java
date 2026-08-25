package screen;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class CaptureConfigTest {
    @Test
    public void seeModeDefaultsToFalse() {
        CaptureConfig captureConfig = new CaptureConfig();

        assertFalse(captureConfig.isSeeMode());
    }

    @Test
    public void copyCarriesSeeMode() {
        CaptureConfig captureConfig = new CaptureConfig();

        captureConfig.setSeeMode(true);

        CaptureConfig copied = captureConfig.copy();

        assertTrue(copied.isSeeMode());
    }
}
