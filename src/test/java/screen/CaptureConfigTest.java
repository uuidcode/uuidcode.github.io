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
    public void writeAfterCaptureDefaultsToFalse() {
        assertFalse(new CaptureConfig().isWriteAfterCaptureEnabled());
    }

    // 새 탭의 ImagePanel 은 복사본만 받으므로, 복사가 빠지면 shot and write 가 write 로 이어지지 않는다.
    @Test
    public void copyCarriesWriteAfterCapture() {
        CaptureConfig captureConfig = new CaptureConfig();

        captureConfig.setWriteAfterCaptureEnabled(true);

        assertTrue(captureConfig.copy().isWriteAfterCaptureEnabled());
    }

    @Test
    public void copyCarriesKeepCurrentScreen() {
        CaptureConfig captureConfig = new CaptureConfig();

        captureConfig.setKeepCurrentScreenEnabled(false);

        CaptureConfig copied = captureConfig.copy();

        assertFalse(copied.isKeepCurrentScreenEnabled());
    }
}
