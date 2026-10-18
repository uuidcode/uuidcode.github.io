package screen;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class CapturePreferencesTest {
    private boolean originalKeepCurrentScreenEnabled;

    @Before
    public void saveOriginalValue() {
        this.originalKeepCurrentScreenEnabled = CapturePreferences.isKeepCurrentScreenEnabled();
    }

    @After
    public void restoreOriginalValue() {
        CapturePreferences.setKeepCurrentScreenEnabled(this.originalKeepCurrentScreenEnabled);
    }

    @Test
    public void keepCurrentScreenDefaultIsUnchecked() {
        assertFalse(CapturePreferences.KEEP_CURRENT_SCREEN_DEFAULT);
    }

    @Test
    public void keepCurrentScreenKeepsLastSelectedValue() {
        CapturePreferences.setKeepCurrentScreenEnabled(false);

        assertFalse(CapturePreferences.isKeepCurrentScreenEnabled());

        CapturePreferences.setKeepCurrentScreenEnabled(true);

        assertTrue(CapturePreferences.isKeepCurrentScreenEnabled());
    }
}
