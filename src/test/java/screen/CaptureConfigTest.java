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

    // 체크박스를 끈 채로 다시 캡처하면 꺼진 상태가, 켠 채로 다시 캡처하면 켜진 상태가 그대로 쓰인다.
    @Test
    public void keepCurrentScreenFollowsStoredPreference() {
        boolean originalValue = CapturePreferences.isKeepCurrentScreenEnabled();

        try {
            CapturePreferences.setKeepCurrentScreenEnabled(false);

            assertFalse(new CaptureConfig().isKeepCurrentScreenEnabled());

            CapturePreferences.setKeepCurrentScreenEnabled(true);

            assertTrue(new CaptureConfig().isKeepCurrentScreenEnabled());
        } finally {
            CapturePreferences.setKeepCurrentScreenEnabled(originalValue);
        }
    }

    @Test
    public void copyCarriesKeepCurrentScreen() {
        CaptureConfig captureConfig = new CaptureConfig();

        captureConfig.setKeepCurrentScreenEnabled(false);

        CaptureConfig copied = captureConfig.copy();

        assertFalse(copied.isKeepCurrentScreenEnabled());
    }
}
