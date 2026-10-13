package fourier;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class FourierSeriesUnitTest {
    private static final int SAMPLE_COUNT = 64;

    private static double[] createSampleList() {
        double[] sampleList = new double[SAMPLE_COUNT];

        for (int index = 0; index < SAMPLE_COUNT; index++) {
            double t = 2 * Math.PI * index / SAMPLE_COUNT;
            sampleList[index] = 3 + 2 * Math.cos(t) - 1.5 * Math.sin(t) + 0.5 * Math.cos(3 * t);
        }

        return sampleList;
    }

    @Test
    public void fitRecoversTheMean() {
        FourierSeries series = FourierSeries.fit(
            createSampleList(), // sampleList
            4 // maxHarmonic
        );

        assertEquals(
            3.0, // expected
            series.getMean(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void fitRecoversEachCoefficient() {
        FourierSeries series = FourierSeries.fit(
            createSampleList(), // sampleList
            4 // maxHarmonic
        );

        assertEquals(
            2.0, // expected
            series.getHarmonicList().get(0).getCosine(), // actual
            1e-9 // delta
        );

        assertEquals(
            -1.5, // expected
            series.getHarmonicList().get(0).getSine(), // actual
            1e-9 // delta
        );

        assertEquals(
            0.0, // expected
            series.getHarmonicList().get(1).getAmplitude(), // actual
            1e-9 // delta
        );

        assertEquals(
            0.5, // expected
            series.getHarmonicList().get(2).getCosine(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void fitKeepsTheRequestedHarmonicCount() {
        FourierSeries series = FourierSeries.fit(
            createSampleList(), // sampleList
            7 // maxHarmonic
        );

        assertEquals(
            7, // expected
            series.size() // actual
        );
    }

    @Test
    public void partialSumUsesOnlyTheLeadingHarmonics() {
        FourierSeries series = FourierSeries.fit(
            createSampleList(), // sampleList
            4 // maxHarmonic
        );

        double t = 0.8;
        double expected = 3 + 2 * Math.cos(t) - 1.5 * Math.sin(t);

        assertEquals(
            expected, // expected
            series.valueAt(t, 1), // actual
            1e-9 // delta
        );
    }

    @Test
    public void fullSumReproducesTheOriginalSignal() {
        FourierSeries series = FourierSeries.fit(
            createSampleList(), // sampleList
            4 // maxHarmonic
        );

        double t = 2 * Math.PI * 5 / SAMPLE_COUNT;

        assertEquals(
            createSampleList()[5], // expected
            series.valueAt(t, 4), // actual
            1e-9 // delta
        );
    }

    @Test
    public void harmonicCountAboveTheSeriesSizeIsClamped() {
        FourierSeries series = FourierSeries.fit(
            createSampleList(), // sampleList
            4 // maxHarmonic
        );

        double t = 1.3;

        assertEquals(
            series.valueAt(t, 4), // expected
            series.valueAt(t, 99), // actual
            1e-12 // delta
        );
    }

    @Test
    public void zeroHarmonicsLeavesOnlyTheMean() {
        FourierSeries series = FourierSeries.fit(
            createSampleList(), // sampleList
            4 // maxHarmonic
        );

        assertEquals(
            3.0, // expected
            series.valueAt(1.7, 0), // actual
            1e-9 // delta
        );
    }
}
