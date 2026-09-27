package screen;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

import org.junit.Test;

import static java.awt.image.BufferedImage.TYPE_INT_ARGB;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

// write 스킵 판단의 핵심인 이미지 동등 비교(Util.imagesEqual)를 검증한다.
public class WriteSkipUnitTest {
    private static BufferedImage filled(
        int width,
        int height,
        Color color
    ) {
        BufferedImage image = new BufferedImage(
            width,
            height,
            TYPE_INT_ARGB // imageType
        );

        Graphics2D g2 = image.createGraphics();
        g2.setColor(color);
        g2.fillRect(
            0, // x
            0, // y
            width,
            height
        );

        g2.dispose();

        return image;
    }

    @Test
    public void equalWhenSamePixels() {
        BufferedImage a = filled(
            20, // width
            20, // height
            Color.RED // color
        );

        BufferedImage b = filled(
            20, // width
            20, // height
            Color.RED // color
        );

        assertTrue(Util.imagesEqual(a, b));
    }

    @Test
    public void equalWhenSameReference() {
        BufferedImage a = filled(
            20, // width
            20, // height
            Color.RED // color
        );

        assertTrue(Util.imagesEqual(a, a));
    }

    @Test
    public void notEqualWhenPixelDiffers() {
        BufferedImage a = filled(
            20, // width
            20, // height
            Color.RED // color
        );

        BufferedImage b = filled(
            20, // width
            20, // height
            Color.BLUE // color
        );

        assertFalse(Util.imagesEqual(a, b));
    }

    @Test
    public void notEqualWhenSizeDiffers() {
        BufferedImage a = filled(
            20, // width
            20, // height
            Color.RED // color
        );

        BufferedImage b = filled(
            20, // width
            21, // height
            Color.RED // color
        );

        assertFalse(Util.imagesEqual(a, b));
    }

    @Test
    public void notEqualWhenOneIsNull() {
        BufferedImage a = filled(
            20, // width
            20, // height
            Color.RED // color
        );

        assertFalse(Util.imagesEqual(a, null));

        assertFalse(Util.imagesEqual(null, a));
    }
}
