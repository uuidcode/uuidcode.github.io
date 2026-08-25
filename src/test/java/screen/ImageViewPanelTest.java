package screen;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ImageViewPanelTest {
    @Test
    public void cropImageKeepsEdgePixelsWithoutAddingBorder() {
        BufferedImage source = new BufferedImage(4, 4, BufferedImage.TYPE_INT_ARGB);
        Color fillColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, fillColor.getRGB());
            }
        }

        BufferedImage croppedImage = ImageViewPanel.cropImage(
            source,
            new Rectangle(1, 1, 2, 2)
        );

        assertEquals(2, croppedImage.getWidth());
        assertEquals(2, croppedImage.getHeight());
        assertEquals(fillColor.getRGB(), croppedImage.getRGB(0, 0));
        assertEquals(fillColor.getRGB(), croppedImage.getRGB(1, 0));
        assertEquals(fillColor.getRGB(), croppedImage.getRGB(0, 1));
        assertEquals(fillColor.getRGB(), croppedImage.getRGB(1, 1));
    }

    @Test
    public void clampScaleKeepsValueWithinBounds() {
        assertEquals(0.1, ImageViewPanel.clampScale(0.01), 0.0001);
        assertEquals(8.0, ImageViewPanel.clampScale(20.0), 0.0001);
        assertEquals(1.5, ImageViewPanel.clampScale(1.5), 0.0001);
    }

    @Test
    public void scaleDimensionRoundsScaledSize() {
        Dimension enlarged = ImageViewPanel.scaleDimension(100, 50, 2.0);
        assertEquals(200, enlarged.width);
        assertEquals(100, enlarged.height);

        Dimension reduced = ImageViewPanel.scaleDimension(101, 51, 0.5);
        assertEquals(51, reduced.width);
        assertEquals(26, reduced.height);
    }
}
