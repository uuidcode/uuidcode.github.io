package fourier;

import java.awt.geom.Path2D;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class HummingbirdUnitTest {
    @Test
    public void outlineFillsTheReferenceBox() {
        Path2D.Double path = Hummingbird.createPath();
        Rectangle2D bounds = path.getBounds2D();

        assertEquals(
            0.0, // expected
            bounds.getX(), // actual
            1e-6 // delta
        );

        assertEquals(
            0.0, // expected
            bounds.getY(), // actual
            1e-6 // delta
        );

        assertEquals(
            1000.0, // expected
            bounds.getWidth(), // actual
            1e-6 // delta
        );

        assertEquals(
            912.0, // expected
            bounds.getHeight(), // actual
            1e-6 // delta
        );
    }

    @Test
    public void samplePointListReturnsTheRequestedCount() {
        assertEquals(
            512, // expected
            Hummingbird.samplePointList(512).size() // actual
        );
    }

    /**
     * 깃털 끝처럼 한 걸음 안에서 되꺾이는 자리는 현의 길이가 짧아지므로,
     * 간격이 균등하다는 것은 "한 걸음보다 더 벌어진 구간이 없다" 로 확인한다.
     */
    @Test
    public void samplePointListNeverLeavesALongGap() {
        List<Point2D.Double> pointList = Hummingbird.samplePointList(1024);
        int count = pointList.size();
        double totalLength = 0;
        double maxDistance = 0;

        for (int index = 0; index < count; index++) {
            double distance = pointList.get(index).distance(pointList.get((index + 1) % count));
            totalLength += distance;
            maxDistance = Math.max(maxDistance, distance);
        }

        double step = totalLength / count;

        assertTrue(maxDistance <= step * 1.02);
    }

    @Test
    public void almostEverySampleStepMatchesTheAverage() {
        List<Point2D.Double> pointList = Hummingbird.samplePointList(1024);
        int count = pointList.size();
        double totalLength = 0;

        for (int index = 0; index < count; index++) {
            totalLength += pointList.get(index).distance(pointList.get((index + 1) % count));
        }

        double step = totalLength / count;
        int offCount = 0;

        for (int index = 0; index < count; index++) {
            double distance = pointList.get(index).distance(pointList.get((index + 1) % count));

            if (Math.abs(distance - step) > step * 0.02) {
                offCount++;
            }
        }

        assertTrue(offCount < count / 25);
    }

    @Test
    public void everySampleStaysInsideTheReferenceBox() {
        List<Point2D.Double> pointList = Hummingbird.samplePointList(256);

        for (Point2D.Double point : pointList) {
            assertTrue(point.x >= -1e-6 && point.x <= 1000 + 1e-6);
            assertTrue(point.y >= -1e-6 && point.y <= 912 + 1e-6);
        }
    }

    @Test
    public void beakTipIsTheRightmostPoint() {
        List<Point2D.Double> pointList = Hummingbird.samplePointList(2048);
        double maxX = 0;

        for (Point2D.Double point : pointList) {
            maxX = Math.max(maxX, point.x);
        }

        assertEquals(
            1000.0, // expected
            maxX, // actual
            1.0 // delta
        );
    }
}
