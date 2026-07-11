package screen;

import java.awt.Color;

import javax.swing.JPanel;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ScreenShotPanelTest {
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
