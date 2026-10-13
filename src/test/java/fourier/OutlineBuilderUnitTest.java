package fourier;

import java.awt.geom.Path2D;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.util.List;

import org.junit.Test;

import static fourier.OutlineBuilder.CORNER;
import static fourier.OutlineBuilder.SMOOTH;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class OutlineBuilderUnitTest {
    private static final double[] SQUARE = {
        0, 0, CORNER,
        100, 0, CORNER,
        100, 100, CORNER,
        0, 100, CORNER
    };

    private static final double[] CIRCLE_LIKE = {
        50, 0, SMOOTH,
        100, 50, SMOOTH,
        50, 100, SMOOTH,
        0, 50, SMOOTH
    };

    @Test
    public void cornerOnlyPathKeepsTheStraightEdges() {
        Path2D.Double path = OutlineBuilder.buildClosedPath(SQUARE);
        Rectangle2D bounds = path.getBounds2D();

        assertEquals(
            0.0, // expected
            bounds.getX(), // actual
            1e-9 // delta
        );

        assertEquals(
            100.0, // expected
            bounds.getWidth(), // actual
            1e-9 // delta
        );

        assertEquals(
            100.0, // expected
            bounds.getHeight(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void resampleSpreadsPointsEvenlyAlongTheSquare() {
        List<Point2D.Double> pointList = OutlineBuilder.resample(
            OutlineBuilder.buildClosedPath(SQUARE), // path
            8 // count
        );

        assertEquals(
            8, // expected
            pointList.size() // actual
        );

        assertEquals(
            50.0, // expected
            pointList.get(1).x, // actual
            1e-6 // delta
        );

        assertEquals(
            0.0, // expected
            pointList.get(1).y, // actual
            1e-6 // delta
        );

        assertEquals(
            100.0, // expected
            pointList.get(2).x, // actual
            1e-6 // delta
        );

        assertEquals(
            100.0, // expected
            pointList.get(4).y, // actual
            1e-6 // delta
        );
    }

    @Test
    public void resampleKeepsAConstantStepLength() {
        List<Point2D.Double> pointList = OutlineBuilder.resample(
            OutlineBuilder.buildClosedPath(SQUARE), // path
            40 // count
        );

        double first = pointList.get(0).distance(pointList.get(1));

        for (int index = 1; index < pointList.size() - 1; index++) {
            assertEquals(
                first, // expected
                pointList.get(index).distance(pointList.get(index + 1)), // actual
                1e-6 // delta
            );
        }
    }

    @Test
    public void smoothPointsBulgeOutsideTheControlPolygon() {
        Path2D.Double path = OutlineBuilder.buildClosedPath(CIRCLE_LIKE);

        List<Point2D.Double> pointList = OutlineBuilder.resample(
            path, // path
            200 // count
        );

        double maxDistance = 0;

        for (Point2D.Double point : pointList) {
            maxDistance = Math.max(maxDistance, point.distance(50, 50));
        }

        assertTrue(maxDistance > 49);
        assertTrue(maxDistance < 56);
    }

    @Test
    public void firstResampledPointIsTheFirstOutlinePoint() {
        List<Point2D.Double> pointList = OutlineBuilder.resample(
            OutlineBuilder.buildClosedPath(SQUARE), // path
            16 // count
        );

        assertEquals(
            0.0, // expected
            pointList.get(0).distance(0, 0), // actual
            1e-9 // delta
        );
    }
}
