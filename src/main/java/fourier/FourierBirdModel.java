package fourier;

import java.awt.geom.Path2D;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 벌새 외곽선을 x, y 두 개의 푸리에 급수로 나눠 담는다.
 *
 * <p>영상과 같이 x 사슬은 가로 위치, y 사슬은 세로 위치를 만들어내고
 * 두 안내선이 만나는 곳이 펜의 위치가 된다.
 */
public class FourierBirdModel {
    public static final int DEFAULT_SAMPLE_COUNT = 2048;
    public static final int DEFAULT_MAX_HARMONIC = 100;

    private final Path2D.Double outlinePath;
    private final List<Point2D.Double> outlinePointList;
    private final FourierSeries seriesX;
    private final FourierSeries seriesY;
    private final Rectangle2D.Double bounds;

    public FourierBirdModel(
        Path2D.Double outlinePath,
        List<Point2D.Double> outlinePointList,
        FourierSeries seriesX,
        FourierSeries seriesY
    ) {
        this.outlinePath = outlinePath;
        this.outlinePointList = Collections.unmodifiableList(outlinePointList);
        this.seriesX = seriesX;
        this.seriesY = seriesY;
        this.bounds = toBounds(outlinePointList);
    }

    public static FourierBirdModel create(
        int sampleCount,
        int maxHarmonic
    ) {
        Path2D.Double outlinePath = Hummingbird.createPath();

        List<Point2D.Double> outlinePointList = OutlineBuilder.resample(
            outlinePath,
            sampleCount
        );

        double[] xSampleList = new double[sampleCount];
        double[] ySampleList = new double[sampleCount];

        for (int index = 0; index < sampleCount; index++) {
            Point2D.Double point = outlinePointList.get(index);
            xSampleList[index] = point.x;
            ySampleList[index] = point.y;
        }

        FourierSeries seriesX = FourierSeries.fit(
            xSampleList,
            maxHarmonic
        );

        FourierSeries seriesY = FourierSeries.fit(
            ySampleList,
            maxHarmonic
        );

        return new FourierBirdModel(
            outlinePath,
            outlinePointList,
            seriesX,
            seriesY
        );
    }

    public static FourierBirdModel create() {
        return create(
            DEFAULT_SAMPLE_COUNT,
            DEFAULT_MAX_HARMONIC
        );
    }

    private static Rectangle2D.Double toBounds(List<Point2D.Double> pointList) {
        double minX = Double.MAX_VALUE;
        double minY = Double.MAX_VALUE;
        double maxX = -Double.MAX_VALUE;
        double maxY = -Double.MAX_VALUE;

        for (Point2D.Double point : pointList) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }

        return new Rectangle2D.Double(
            minX,
            minY,
            maxX - minX,
            maxY - minY
        );
    }

    /**
     * harmonicCount 개의 항만 남겼을 때 매개변수 t 에서의 펜 위치.
     */
    public Point2D.Double penAt(
        double t,
        int harmonicCount
    ) {
        return new Point2D.Double(
            this.seriesX.valueAt(t, harmonicCount),
            this.seriesY.valueAt(t, harmonicCount)
        );
    }

    /**
     * 한 바퀴를 resolution 등분해 얻은 근사 곡선.
     */
    public List<Point2D.Double> approximationPointList(
        int harmonicCount,
        int resolution
    ) {
        List<Point2D.Double> pointList = new ArrayList<Point2D.Double>();

        for (int index = 0; index <= resolution; index++) {
            double t = 2 * Math.PI * index / resolution;

            pointList.add(penAt(t, harmonicCount));
        }

        return pointList;
    }

    /**
     * 표본점에서 측정한 최대 오차를 외곽선 높이에 대한 비율로 돌려준다.
     * 영상에서 100 차일 때 약 0.0057 로 소개한 값과 같은 성격의 수치다.
     */
    public double maxErrorRatio(int harmonicCount) {
        int sampleCount = this.outlinePointList.size();
        double maxError = 0;

        for (int index = 0; index < sampleCount; index++) {
            double t = 2 * Math.PI * index / sampleCount;
            Point2D.Double target = this.outlinePointList.get(index);
            Point2D.Double approximation = penAt(t, harmonicCount);
            maxError = Math.max(maxError, target.distance(approximation));
        }

        return maxError / this.bounds.height;
    }

    public Path2D.Double getOutlinePath() {
        return this.outlinePath;
    }

    public List<Point2D.Double> getOutlinePointList() {
        return this.outlinePointList;
    }

    public FourierSeries getSeriesX() {
        return this.seriesX;
    }

    public FourierSeries getSeriesY() {
        return this.seriesY;
    }

    public Rectangle2D.Double getBounds() {
        return this.bounds;
    }

    public int getMaxHarmonic() {
        return Math.min(this.seriesX.size(), this.seriesY.size());
    }
}
