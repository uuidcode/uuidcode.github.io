package screen;

import java.awt.Color;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;

import javax.swing.JPanel;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ScreenShotPanelTest {
    @Test
    public void trimUniformBorderRemovesSolidBackgroundAroundImage() {
        BufferedImage source = new BufferedImage(6, 6, BufferedImage.TYPE_INT_ARGB);
        Color backgroundColor = new Color(0, 0, 0, 255);
        Color foregroundColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, backgroundColor.getRGB());
            }
        }

        for (int y = 2; y <= 3; y++) {
            for (int x = 2; x <= 3; x++) {
                source.setRGB(x, y, foregroundColor.getRGB());
            }
        }

        BufferedImage trimmedImage = ScreenShotPanel.trimUniformBorder(source);

        assertEquals(2, trimmedImage.getWidth());
        assertEquals(2, trimmedImage.getHeight());
        assertEquals(foregroundColor.getRGB(), trimmedImage.getRGB(0, 0));
        assertEquals(foregroundColor.getRGB(), trimmedImage.getRGB(1, 0));
        assertEquals(foregroundColor.getRGB(), trimmedImage.getRGB(0, 1));
        assertEquals(foregroundColor.getRGB(), trimmedImage.getRGB(1, 1));
    }

    @Test
    public void trimUniformBorderBoundsReportsTrimmedOffset() {
        BufferedImage source = new BufferedImage(6, 6, BufferedImage.TYPE_INT_ARGB);
        Color backgroundColor = new Color(0, 0, 0, 255);
        Color foregroundColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, backgroundColor.getRGB());
            }
        }

        for (int y = 2; y <= 3; y++) {
            for (int x = 2; x <= 3; x++) {
                source.setRGB(x, y, foregroundColor.getRGB());
            }
        }

        Rectangle bounds = ScreenShotPanel.trimUniformBorderBounds(source);

        assertEquals(2, bounds.x);
        assertEquals(2, bounds.y);
        assertEquals(2, bounds.width);
        assertEquals(2, bounds.height);
    }

    @Test
    public void trimUniformBorderBoundsReturnsFullBoundsWhenNoBorderExists() {
        BufferedImage source = new BufferedImage(2, 2, BufferedImage.TYPE_INT_ARGB);
        Color fillColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, fillColor.getRGB());
            }
        }

        Rectangle bounds = ScreenShotPanel.trimUniformBorderBounds(source);

        assertEquals(0, bounds.x);
        assertEquals(0, bounds.y);
        assertEquals(2, bounds.width);
        assertEquals(2, bounds.height);
    }

    @Test
    public void trimUniformBorderKeepsOriginalImageWhenNoSolidBorderExists() {
        BufferedImage source = new BufferedImage(2, 2, BufferedImage.TYPE_INT_ARGB);
        Color fillColor = new Color(255, 255, 255, 255);

        for (int y = 0; y < source.getHeight(); y++) {
            for (int x = 0; x < source.getWidth(); x++) {
                source.setRGB(x, y, fillColor.getRGB());
            }
        }

        BufferedImage trimmedImage = ScreenShotPanel.trimUniformBorder(source);

        assertEquals(2, trimmedImage.getWidth());
        assertEquals(2, trimmedImage.getHeight());
    }

    @Test
    public void configureControlPanelMakesPanelTransparent() {
        JPanel panel = new JPanel();

        ScreenShotPanel.configureControlPanel(panel);

        assertFalse(panel.isOpaque());
        assertEquals(new Color(0, 0, 0, 0), panel.getBackground());
    }

    @Test
    public void shouldRepaintWhenHidingControlPanelReturnsFalseWhenCaptureIsStarting() {
        boolean repaintBounds = ScreenShotPanel.shouldRepaintWhenHidingControlPanel(true);

        assertFalse(repaintBounds);
    }

    @Test
    public void shouldRepaintWhenHidingControlPanelReturnsTrueWhenCaptureIsNotStarting() {
        boolean repaintBounds = ScreenShotPanel.shouldRepaintWhenHidingControlPanel(false);

        assertTrue(repaintBounds);
    }

    @Test
    public void shouldMoveSelectionReturnsFalseWhenCommandIsNotPressed() {
        Rectangle rectangle = new Rectangle(
            10, // x
            10, // y
            40, // width
            20 // height
        );

        Point point = new Point(
            20, // x
            20 // y
        );

        boolean moveSelection = ScreenShotPanel.shouldMoveSelection(
            rectangle,
            point,
            false // moveRequested
        );

        assertFalse(moveSelection);
    }

    @Test
    public void shouldMoveSelectionReturnsTrueWhenCommandIsPressedInsideSelection() {
        Rectangle rectangle = new Rectangle(
            10, // x
            10, // y
            40, // width
            20 // height
        );

        Point point = new Point(
            20, // x
            20 // y
        );

        boolean moveSelection = ScreenShotPanel.shouldMoveSelection(
            rectangle,
            point,
            true // moveRequested
        );

        assertTrue(moveSelection);
    }

    @Test
    public void shouldMoveSelectionReturnsFalseWhenCommandIsPressedOutsideSelection() {
        Rectangle rectangle = new Rectangle(
            10, // x
            10, // y
            40, // width
            20 // height
        );

        Point point = new Point(
            5, // x
            5 // y
        );

        boolean moveSelection = ScreenShotPanel.shouldMoveSelection(
            rectangle,
            point,
            true // moveRequested
        );

        assertFalse(moveSelection);
    }

    @Test
    public void moveSelectionRectangleMovesSelectionByDragDelta() {
        Rectangle origin = new Rectangle(
            10, // x
            10, // y
            40, // width
            20 // height
        );

        Point startPoint = new Point(
            20, // x
            20 // y
        );

        Point point = new Point(
            30, // x
            35 // y
        );

        Rectangle movedRectangle = ScreenShotPanel.moveSelectionRectangle(
            origin,
            startPoint,
            point,
            100, // boundaryWidth
            100 // boundaryHeight
        );

        Rectangle expectedRectangle = new Rectangle(
            20, // x
            25, // y
            40, // width
            20 // height
        );

        assertEquals(
            expectedRectangle, // expected
            movedRectangle // actual
        );
    }

    @Test
    public void moveSelectionRectangleKeepsSelectionInsideBounds() {
        Rectangle origin = new Rectangle(
            70, // x
            80, // y
            40, // width
            30 // height
        );

        Point startPoint = new Point(
            80, // x
            90 // y
        );

        Point point = new Point(
            120, // x
            130 // y
        );

        Rectangle movedRectangle = ScreenShotPanel.moveSelectionRectangle(
            origin,
            startPoint,
            point,
            100, // boundaryWidth
            100 // boundaryHeight
        );

        Rectangle expectedRectangle = new Rectangle(
            60, // x
            70, // y
            40, // width
            30 // height
        );

        assertEquals(
            expectedRectangle, // expected
            movedRectangle // actual
        );
    }
}
