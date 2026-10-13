package fourier;

import java.awt.geom.Point2D;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class FourierBirdModelUnitTest {
    private static final FourierBirdModel MODEL = FourierBirdModel.create();

    @Test
    public void modelKeepsTheRequestedHarmonicCount() {
        assertEquals(
            FourierBirdModel.DEFAULT_MAX_HARMONIC, // expected
            MODEL.getMaxHarmonic() // actual
        );
    }

    @Test
    public void modelKeepsTheRequestedSampleCount() {
        assertEquals(
            FourierBirdModel.DEFAULT_SAMPLE_COUNT, // expected
            MODEL.getOutlinePointList().size() // actual
        );
    }

    @Test
    public void errorShrinksAsHarmonicsAreAdded() {
        double threeHarmonics = MODEL.maxErrorRatio(3);
        double tenHarmonics = MODEL.maxErrorRatio(10);
        double thirtyHarmonics = MODEL.maxErrorRatio(30);
        double hundredHarmonics = MODEL.maxErrorRatio(100);

        assertTrue(threeHarmonics > tenHarmonics);
        assertTrue(tenHarmonics > thirtyHarmonics);
        assertTrue(thirtyHarmonics > hundredHarmonics);
    }

    @Test
    public void hundredHarmonicsStayCloseToTheOutline() {
        double ratio = MODEL.maxErrorRatio(100);

        assertTrue(ratio > 0);
        assertTrue(ratio < 0.01);
    }

    @Test
    public void fullHarmonicPenFollowsTheOutline() {
        Point2D.Double target = MODEL.getOutlinePointList().get(0);
        Point2D.Double pen = MODEL.penAt(0, MODEL.getMaxHarmonic());

        assertEquals(
            0.0, // expected
            target.distance(pen) / MODEL.getBounds().height, // actual
            0.01 // delta
        );
    }

    @Test
    public void approximationLoopStartsAndEndsAtTheSamePlace() {
        List<Point2D.Double> pointList = MODEL.approximationPointList(
            20, // harmonicCount
            600 // resolution
        );

        assertEquals(
            601, // expected
            pointList.size() // actual
        );

        assertEquals(
            0.0, // expected
            pointList.get(0).distance(pointList.get(600)), // actual
            1e-9 // delta
        );
    }

    @Test
    public void seriesMeanSitsInsideTheOutlineBounds() {
        double meanX = MODEL.getSeriesX().getMean();
        double meanY = MODEL.getSeriesY().getMean();

        assertTrue(MODEL.getBounds().contains(meanX, meanY));
    }

    @Test
    public void smallerModelCanBeBuiltOnDemand() {
        FourierBirdModel small = FourierBirdModel.create(
            256, // sampleCount
            16 // maxHarmonic
        );

        assertEquals(
            16, // expected
            small.getMaxHarmonic() // actual
        );

        assertEquals(
            256, // expected
            small.getOutlinePointList().size() // actual
        );
    }
}
