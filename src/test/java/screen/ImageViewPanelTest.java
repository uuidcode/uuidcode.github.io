package screen;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Point;
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

    @Test
    public void resizeCropBoundsTopLeftMovesBothEdges() {
        Rectangle current = new Rectangle(0, 0, 100, 100);

        Rectangle updated = ImageViewPanel.resizeCropBounds(
            current,
            ImageViewPanel.CropHandle.TOP_LEFT,
            new Point(20, 30),
            100, // imageWidth
            100, // imageHeight
            20 // minSize
        );

        assertEquals(new Rectangle(20, 30, 80, 70), updated);
    }

    @Test
    public void resizeCropBoundsBottomRightMovesBothEdges() {
        Rectangle current = new Rectangle(0, 0, 100, 100);

        Rectangle updated = ImageViewPanel.resizeCropBounds(
            current,
            ImageViewPanel.CropHandle.BOTTOM_RIGHT,
            new Point(70, 60),
            100, // imageWidth
            100, // imageHeight
            20 // minSize
        );

        assertEquals(new Rectangle(0, 0, 70, 60), updated);
    }

    @Test
    public void resizeCropBoundsTopRightMovesRightAndTopEdges() {
        Rectangle current = new Rectangle(10, 10, 80, 80);

        Rectangle updated = ImageViewPanel.resizeCropBounds(
            current,
            ImageViewPanel.CropHandle.TOP_RIGHT,
            new Point(60, 40),
            100, // imageWidth
            100, // imageHeight
            20 // minSize
        );

        assertEquals(new Rectangle(10, 40, 50, 50), updated);
    }

    @Test
    public void resizeCropBoundsBottomLeftMovesLeftAndBottomEdges() {
        Rectangle current = new Rectangle(10, 10, 80, 80);

        Rectangle updated = ImageViewPanel.resizeCropBounds(
            current,
            ImageViewPanel.CropHandle.BOTTOM_LEFT,
            new Point(40, 70),
            100, // imageWidth
            100, // imageHeight
            20 // minSize
        );

        assertEquals(new Rectangle(40, 10, 50, 60), updated);
    }

    @Test
    public void adjustBrightnessIncreasesEachColorChannelKeepingAlpha() {
        BufferedImage source = new BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB);
        source.setRGB(0, 0, new Color(100, 110, 120, 200).getRGB());

        BufferedImage result = ImageViewPanel.adjustBrightness(
            source,
            20 // delta
        );

        assertEquals(new Color(120, 130, 140, 200).getRGB(), result.getRGB(0, 0));
    }

    @Test
    public void adjustBrightnessDecreasesEachColorChannelKeepingAlpha() {
        BufferedImage source = new BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB);
        source.setRGB(0, 0, new Color(100, 110, 120, 200).getRGB());

        BufferedImage result = ImageViewPanel.adjustBrightness(
            source,
            -20 // delta
        );

        assertEquals(new Color(80, 90, 100, 200).getRGB(), result.getRGB(0, 0));
    }

    @Test
    public void adjustBrightnessClampsChannelsWithinValidRange() {
        BufferedImage source = new BufferedImage(2, 1, BufferedImage.TYPE_INT_ARGB);
        source.setRGB(0, 0, new Color(250, 250, 250, 255).getRGB());
        source.setRGB(1, 0, new Color(5, 5, 5, 255).getRGB());

        BufferedImage brighter = ImageViewPanel.adjustBrightness(
            source,
            20 // delta
        );

        BufferedImage darker = ImageViewPanel.adjustBrightness(
            source,
            -20 // delta
        );

        assertEquals(new Color(255, 255, 255, 255).getRGB(), brighter.getRGB(0, 0));
        assertEquals(new Color(0, 0, 0, 255).getRGB(), darker.getRGB(1, 0));
    }

    @Test
    public void clampColorKeepsValueWithinByteRange() {
        assertEquals(0, ImageViewPanel.clampColor(-10));
        assertEquals(255, ImageViewPanel.clampColor(300));
        assertEquals(128, ImageViewPanel.clampColor(128));
    }

    @Test
    public void formatFileSizeUsesReadableUnits() {
        assertEquals("512 B", ImageViewPanel.formatFileSize(512));
        assertEquals("1.0 KB", ImageViewPanel.formatFileSize(1024));
        assertEquals("1.5 KB", ImageViewPanel.formatFileSize(1536));
        assertEquals("2.0 MB", ImageViewPanel.formatFileSize(2 * 1024 * 1024));
    }

    @Test
    public void formatImageInfoJoinsSizeFileSizeZoomRotateAndBrightness() {
        String info = ImageViewPanel.formatImageInfo(
            1920, // width
            1080, // height
            2048, // fileSizeBytes
            1.5, // scale
            90, // rotationDegrees
            40 // brightness
        );

        assertEquals("1920 x 1080  ·  2.0 KB  ·  Zoom 150%  ·  Rotate 90°  ·  Bright +40", info);
    }

    @Test
    public void formatImageInfoOmitsFileSizeWhenUnknown() {
        String info = ImageViewPanel.formatImageInfo(
            800, // width
            600, // height
            -1, // fileSizeBytes
            1.0, // scale
            0, // rotationDegrees
            0 // brightness
        );

        assertEquals("800 x 600  ·  Zoom 100%  ·  Rotate 0°  ·  Bright 0", info);
    }

    @Test
    public void formatSignedPrefixesPositiveValues() {
        assertEquals("+40", ImageViewPanel.formatSigned(40));
        assertEquals("0", ImageViewPanel.formatSigned(0));
        assertEquals("-20", ImageViewPanel.formatSigned(-20));
    }

    @Test
    public void resizeCropBoundsTopLeftClampsToMinimumSize() {
        Rectangle current = new Rectangle(0, 0, 100, 100);

        Rectangle updated = ImageViewPanel.resizeCropBounds(
            current,
            ImageViewPanel.CropHandle.TOP_LEFT,
            new Point(95, 95),
            100, // imageWidth
            100, // imageHeight
            20 // minSize
        );

        assertEquals(new Rectangle(80, 80, 20, 20), updated);
    }
}
