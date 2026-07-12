package screen;

import java.awt.Color;
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
}
