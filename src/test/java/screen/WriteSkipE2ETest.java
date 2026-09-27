package screen;

import java.awt.image.BufferedImage;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// write 후 이미지가 그대로면(픽셀 동일) 다시 write 해도 스킵되고, 한 픽셀이라도 바뀌면 스킵되지 않는다.
public class WriteSkipE2ETest extends RenderingTestSupport {
    @Test
    public void unchangedImageIsSkippedButEditedImageIsNot() throws Exception {
        ImagePanel imagePanel = this.addImageOnEdt();

        AtomicBoolean unchangedSkipped = new AtomicBoolean();
        AtomicBoolean editedSkipped = new AtomicBoolean(true);

        SwingUtilities.invokeAndWait(() -> {
            BufferedImage written = imagePanel.getDisplayImage();
            imagePanel.markWritten(written);

            // 편집 없이 동일한 픽셀의 별도 인스턴스 → 스킵되어야 한다.
            BufferedImage sameContent = Util.deepCopy(written);
            unchangedSkipped.set(imagePanel.isUnchangedSinceLastWrite(sameContent));

            // 한 픽셀을 바꾼 이미지 → 스킵되지 않아야 한다.
            BufferedImage edited = Util.deepCopy(written);
            int changed = edited.getRGB(0, 0) ^ 0x00FFFFFF;
            edited.setRGB(
                0, // x
                0, // y
                changed // rgb
            );

            editedSkipped.set(imagePanel.isUnchangedSinceLastWrite(edited));
        });

        assertTrue(unchangedSkipped.get());

        assertFalse(editedSkipped.get());
    }
}
