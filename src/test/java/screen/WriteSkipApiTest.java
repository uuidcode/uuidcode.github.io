package screen;

import java.awt.image.BufferedImage;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// markWritten 으로 기록한 이미지와 동일하면 스킵(true), 크기가 다르면 스킵하지 않는다(false).
public class WriteSkipApiTest extends RenderingTestSupport {
    @Test
    public void skipsWhenSameAsLastWritten() throws Exception {
        ImagePanel imagePanel = this.addImageOnEdt();

        AtomicBoolean sameSkipped = new AtomicBoolean();
        AtomicBoolean differentSkipped = new AtomicBoolean(true);

        SwingUtilities.invokeAndWait(() -> {
            BufferedImage current = imagePanel.getDisplayImage();
            imagePanel.markWritten(current);

            sameSkipped.set(imagePanel.isUnchangedSinceLastWrite(current));

            BufferedImage different = new BufferedImage(
                current.getWidth() + 1, // width
                current.getHeight(), // height
                BufferedImage.TYPE_INT_ARGB // imageType
            );

            differentSkipped.set(imagePanel.isUnchangedSinceLastWrite(different));
        });

        assertTrue(sameSkipped.get());

        assertFalse(differentSkipped.get());
    }
}
