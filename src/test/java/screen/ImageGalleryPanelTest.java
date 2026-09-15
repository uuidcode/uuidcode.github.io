package screen;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

import org.junit.Test;

import static java.awt.image.BufferedImage.TYPE_INT_ARGB;
import static org.junit.Assert.assertEquals;

public class ImageGalleryPanelTest {
    @Test
    public void thumbnailSizeScalesLandscapeToFitWithinMax() {
        Dimension size = ImageGalleryPanel.thumbnailSize(
            200, // width
            100, // height
            100 // max
        );

        assertEquals(new Dimension(100, 50), size);
    }

    @Test
    public void thumbnailSizeScalesPortraitToFitWithinMax() {
        Dimension size = ImageGalleryPanel.thumbnailSize(
            100, // width
            200, // height
            100 // max
        );

        assertEquals(new Dimension(50, 100), size);
    }

    @Test
    public void thumbnailSizeEnlargesSmallSquareToMax() {
        Dimension size = ImageGalleryPanel.thumbnailSize(
            50, // width
            50, // height
            100 // max
        );

        assertEquals(new Dimension(100, 100), size);
    }

    @Test
    public void thumbnailSizeFallsBackToMaxForNonPositiveInput() {
        Dimension size = ImageGalleryPanel.thumbnailSize(
            0, // width
            0, // height
            100 // max
        );

        assertEquals(new Dimension(100, 100), size);
    }

    @Test
    public void scaleProducesImageWithRequestedDimensions() {
        BufferedImage source = new BufferedImage(
            200, // width
            100, // height
            TYPE_INT_ARGB // imageType
        );

        BufferedImage scaled = ImageGalleryPanel.scale(
            source, // source
            100, // targetWidth
            50 // targetHeight
        );

        assertEquals(100, scaled.getWidth());
        assertEquals(50, scaled.getHeight());
    }

    @Test
    public void scalePreservesSolidColor() {
        BufferedImage source = new BufferedImage(
            200, // width
            200, // height
            TYPE_INT_ARGB // imageType
        );

        Graphics2D g2 = source.createGraphics();
        g2.setColor(Color.RED);
        g2.fillRect(
            0, // x
            0, // y
            200, // width
            200 // height
        );

        g2.dispose();

        BufferedImage scaled = ImageGalleryPanel.scale(
            source, // source
            50, // targetWidth
            50 // targetHeight
        );

        assertEquals(Color.RED.getRGB(), scaled.getRGB(25, 25));
    }
}
