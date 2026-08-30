package screen;

import java.awt.Dimension;
import java.awt.Insets;
import java.awt.Point;
import java.awt.Rectangle;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SeePreviewTest {
    @Test
    public void calculateControlLocationKeepsControlInsideScreenInsets() {
        Point location = SeePreview.calculateControlLocation(
            new Rectangle(0, 0, 1440, 900),
            new Insets(24, 0, 80, 0),
            new Dimension(160, 40)
        );

        assertEquals(new Point(1260, 760), location);
    }

    @Test
    public void calculateControlLocationSupportsNegativeScreenOrigin() {
        Point location = SeePreview.calculateControlLocation(
            new Rectangle(-1280, 0, 1280, 720),
            new Insets(0, 0, 60, 0),
            new Dimension(120, 40)
        );

        assertEquals(new Point(-140, 600), location);
    }
}
