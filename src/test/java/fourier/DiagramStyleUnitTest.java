package fourier;

import java.awt.geom.AffineTransform;
import java.awt.geom.Rectangle2D;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class DiagramStyleUnitTest {
    @Test
    public void fitTransformKeepsTheAspectRatio() {
        Rectangle2D.Double source = new Rectangle2D.Double(
            0,
            0,
            100,
            50
        );

        Rectangle2D.Double target = new Rectangle2D.Double(
            0,
            0,
            200,
            200
        );

        AffineTransform transform = DiagramStyle.fitTransform(source, target);
        Rectangle2D result = transform.createTransformedShape(source).getBounds2D();

        assertEquals(
            200.0, // expected
            result.getWidth(), // actual
            1e-9 // delta
        );

        assertEquals(
            100.0, // expected
            result.getHeight(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void fitTransformCentersInsideTheTarget() {
        Rectangle2D.Double source = new Rectangle2D.Double(
            10,
            20,
            100,
            50
        );

        Rectangle2D.Double target = new Rectangle2D.Double(
            300,
            400,
            200,
            200
        );

        AffineTransform transform = DiagramStyle.fitTransform(source, target);
        Rectangle2D result = transform.createTransformedShape(source).getBounds2D();

        assertEquals(
            target.getCenterX(), // expected
            result.getCenterX(), // actual
            1e-9 // delta
        );

        assertEquals(
            target.getCenterY(), // expected
            result.getCenterY(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void fitTransformNeverOverflowsTheTarget() {
        Rectangle2D.Double source = new Rectangle2D.Double(
            0,
            0,
            37,
            910
        );

        Rectangle2D.Double target = new Rectangle2D.Double(
            0,
            0,
            200,
            120
        );

        AffineTransform transform = DiagramStyle.fitTransform(source, target);
        Rectangle2D result = transform.createTransformedShape(source).getBounds2D();

        assertEquals(
            120.0, // expected
            result.getHeight(), // actual
            1e-9 // delta
        );

        assertEquals(
            true, // expected
            result.getWidth() <= target.getWidth() + 1e-9 // actual
        );
    }
}
