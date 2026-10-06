package screen;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// capture 를 시작해도 ImageFrame 은 숨겨지지 않고 맨 뒤로만 간다.
// 그래야 alt(cmd)+tab 목록에 남아 다시 앞으로 불러와 자신을 찍을 수 있다.
public class SelfCaptureApiTest {
    @Test
    public void imageFrameStaysVisibleWhileAreaCaptureIsRunning() throws Exception {
        java.util.concurrent.atomic.AtomicBoolean visible =
            new java.util.concurrent.atomic.AtomicBoolean();

        javax.swing.SwingUtilities.invokeAndWait(() -> {
            ImageFrame imageFrame = new ImageFrame();

            try {
                imageFrame.toBack();

                visible.set(imageFrame.isVisible());
            } finally {
                imageFrame.dispose();
            }
        });

        assertTrue(visible.get());
    }

    @Test
    public void captureConfigNoLongerCarriesSelfMode() {
        CaptureConfig config = new CaptureConfig();

        assertFalse(config.copy().isWindowCaptureMode());

        assertFalse(config.copy().isSeeMode());
    }
}
