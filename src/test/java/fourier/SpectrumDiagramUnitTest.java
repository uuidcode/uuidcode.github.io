package fourier;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SpectrumDiagramUnitTest {
    private static final double MAX_AMPLITUDE = 300;

    @Test
    public void largestAmplitudeFillsTheBar() {
        assertEquals(
            1.0, // expected
            SpectrumDiagram.barRatio(MAX_AMPLITUDE, MAX_AMPLITUDE), // actual
            1e-9 // delta
        );
    }

    @Test
    public void amplitudeAtTheFloorGivesAnEmptyBar() {
        assertEquals(
            0.0, // expected
            SpectrumDiagram.barRatio(SpectrumDiagram.AMPLITUDE_FLOOR, MAX_AMPLITUDE), // actual
            1e-9 // delta
        );
    }

    @Test
    public void ratioStaysInsideTheUnitRange() {
        double[] amplitudeList = {0, 0.0001, 0.05, 1, 50, 300, 1000};

        for (double amplitude : amplitudeList) {
            double ratio = SpectrumDiagram.barRatio(amplitude, MAX_AMPLITUDE);

            assertTrue(ratio >= 0);
            assertTrue(ratio <= 1);
        }
    }

    @Test
    public void biggerAmplitudeGivesATallerBar() {
        double small = SpectrumDiagram.barRatio(0.3, MAX_AMPLITUDE);
        double medium = SpectrumDiagram.barRatio(5, MAX_AMPLITUDE);
        double large = SpectrumDiagram.barRatio(120, MAX_AMPLITUDE);

        assertTrue(small < medium);
        assertTrue(medium < large);
    }

    /**
     * 선형 눈금이면 100 차 막대가 보이지 않는다. 로그 눈금이라 눈에 띄는 높이가 남아야 한다.
     */
    @Test
    public void smallestHarmonicStaysVisible() {
        double ratio = SpectrumDiagram.barRatio(0.28, MAX_AMPLITUDE);

        assertTrue(ratio > 0.1);
    }

    @Test
    public void stageListRisesAndEndsAtTheFullSeries() {
        for (int index = 1; index < SpectrumDiagram.STAGE_LIST.length; index++) {
            assertTrue(SpectrumDiagram.STAGE_LIST[index - 1] < SpectrumDiagram.STAGE_LIST[index]);
        }

        assertEquals(
            1, // expected
            SpectrumDiagram.STAGE_LIST[0] // actual
        );

        assertEquals(
            FourierBirdModel.DEFAULT_MAX_HARMONIC, // expected
            SpectrumDiagram.STAGE_LIST[SpectrumDiagram.STAGE_LIST.length - 1] // actual
        );
    }

    /**
     * 그림이 보여주려는 이야기 — 차수를 올릴수록 오차가 줄어든다.
     */
    @Test
    public void errorFallsAcrossEveryStage() {
        FourierBirdModel model = FourierBirdModel.create();

        for (int index = 1; index < SpectrumDiagram.STAGE_LIST.length; index++) {
            double previous = model.maxErrorRatio(SpectrumDiagram.STAGE_LIST[index - 1]);
            double current = model.maxErrorRatio(SpectrumDiagram.STAGE_LIST[index]);

            assertTrue(previous > current);
        }
    }
}
