package screen;

import java.awt.Dimension;

import org.junit.Test;

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
}
