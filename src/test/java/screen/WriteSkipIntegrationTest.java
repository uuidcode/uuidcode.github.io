package screen;

import java.awt.image.BufferedImage;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertFalse;

// 아직 한 번도 write 하지 않은 패널은 현재 이미지와 "이전 이미지"가 없으므로 스킵하지 않는다.
public class WriteSkipIntegrationTest extends RenderingTestSupport {
    @Test
    public void firstWriteIsNotSkipped() throws Exception {
        ImagePanel imagePanel = this.addImageOnEdt();

        AtomicBoolean unchanged = new AtomicBoolean(true);

        SwingUtilities.invokeAndWait(() -> {
            BufferedImage current = imagePanel.getDisplayImage();
            unchanged.set(imagePanel.isUnchangedSinceLastWrite(current));
        });

        assertFalse(unchanged.get());
    }
}
