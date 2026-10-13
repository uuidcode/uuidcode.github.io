package fourier;

import java.awt.geom.Path2D;
import java.awt.geom.PathIterator;
import java.awt.geom.Point2D;
import java.util.ArrayList;
import java.util.List;

/**
 * (x, y, type) 삼중값 배열을 닫힌 외곽선으로 바꾸고, 호 길이 기준으로 균등 표본을 뽑는다.
 *
 * <p>type 이 {@link #SMOOTH} 인 점은 이웃 점을 이용한 Catmull-Rom 접선을 쓰고,
 * {@link #CORNER} 인 점은 접선을 인접 선분 방향으로 맞춰 꺾인 깃털 끝을 만든다.
 */
public class OutlineBuilder {
    public static final double SMOOTH = 0;
    public static final double CORNER = 1;

    private static final double FLATNESS = 0.05;

    private OutlineBuilder() {
    }

    public static Path2D.Double buildClosedPath(double[] pointList) {
        int count = pointList.length / 3;
        double[] xList = new double[count];
        double[] yList = new double[count];
        boolean[] cornerList = new boolean[count];

        for (int index = 0; index < count; index++) {
            xList[index] = pointList[index * 3];
            yList[index] = pointList[index * 3 + 1];
            cornerList[index] = pointList[index * 3 + 2] == CORNER;
        }

        Path2D.Double path = new Path2D.Double();
        path.moveTo(xList[0], yList[0]);

        for (int index = 0; index < count; index++) {
            int next = (index + 1) % count;
            int previous = (index + count - 1) % count;
            int afterNext = (next + 1) % count;

            double outgoingX = xList[next] - xList[index];
            double outgoingY = yList[next] - yList[index];

            if (!cornerList[index]) {
                outgoingX = (xList[next] - xList[previous]) / 2;
                outgoingY = (yList[next] - yList[previous]) / 2;
            }

            double incomingX = xList[next] - xList[index];
            double incomingY = yList[next] - yList[index];

            if (!cornerList[next]) {
                incomingX = (xList[afterNext] - xList[index]) / 2;
                incomingY = (yList[afterNext] - yList[index]) / 2;
            }

            path.curveTo(
                xList[index] + outgoingX / 3,
                yList[index] + outgoingY / 3,
                xList[next] - incomingX / 3,
                yList[next] - incomingY / 3,
                xList[next],
                yList[next]
            );
        }

        path.closePath();

        return path;
    }

    /**
     * 닫힌 경로를 호 길이 기준으로 count 개의 점으로 균등 분할한다.
     */
    public static List<Point2D.Double> resample(
        Path2D path,
        int count
    ) {
        List<Point2D.Double> flatList = flatten(path);
        int flatCount = flatList.size();
        double[] lengthList = new double[flatCount + 1];

        for (int index = 0; index < flatCount; index++) {
            Point2D.Double current = flatList.get(index);
            Point2D.Double next = flatList.get((index + 1) % flatCount);
            lengthList[index + 1] = lengthList[index] + current.distance(next);
        }

        double total = lengthList[flatCount];
        List<Point2D.Double> resultList = new ArrayList<Point2D.Double>();
        int cursor = 0;

        for (int index = 0; index < count; index++) {
            double target = total * index / count;

            while (cursor < flatCount - 1 && lengthList[cursor + 1] < target) {
                cursor++;
            }

            double span = lengthList[cursor + 1] - lengthList[cursor];
            double ratio = 0;

            if (span > 0) {
                ratio = (target - lengthList[cursor]) / span;
            }

            Point2D.Double current = flatList.get(cursor);
            Point2D.Double next = flatList.get((cursor + 1) % flatCount);

            Point2D.Double point = new Point2D.Double(
                current.x + (next.x - current.x) * ratio,
                current.y + (next.y - current.y) * ratio
            );

            resultList.add(point);
        }

        return resultList;
    }

    private static List<Point2D.Double> flatten(Path2D path) {
        List<Point2D.Double> pointList = new ArrayList<Point2D.Double>();
        PathIterator iterator = path.getPathIterator(null, FLATNESS);
        double[] segment = new double[6];

        while (!iterator.isDone()) {
            int type = iterator.currentSegment(segment);

            if (type != PathIterator.SEG_CLOSE) {
                Point2D.Double point = new Point2D.Double(
                    segment[0],
                    segment[1]
                );

                pointList.add(point);
            }

            iterator.next();
        }

        return pointList;
    }
}
