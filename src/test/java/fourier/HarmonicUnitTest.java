package fourier;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class HarmonicUnitTest {
    @Test
    public void amplitudeIsTheLengthOfTheRotatingVector() {
        Harmonic harmonic = new Harmonic(
            1, // order
            3, // cosine
            4 // sine
        );

        assertEquals(
            5.0, // expected
            harmonic.getAmplitude(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void phaseIsTheStartingAngleOfTheRotatingVector() {
        Harmonic harmonic = new Harmonic(
            1, // order
            0, // cosine
            2 // sine
        );

        assertEquals(
            Math.PI / 2, // expected
            harmonic.getPhase(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void valueAtMatchesTheCosineAndSineMix() {
        Harmonic harmonic = new Harmonic(
            3, // order
            2, // cosine
            -1 // sine
        );

        double t = 0.37;
        double expected = 2 * Math.cos(3 * t) - Math.sin(3 * t);

        assertEquals(
            expected, // expected
            harmonic.valueAt(t), // actual
            1e-9 // delta
        );
    }

    @Test
    public void amplitudeAndPhaseRebuildTheSameTerm() {
        Harmonic harmonic = new Harmonic(
            4, // order
            -1.25, // cosine
            0.75 // sine
        );

        double t = 1.11;
        double rebuilt = harmonic.getAmplitude() * Math.cos(4 * t - harmonic.getPhase());

        assertEquals(
            harmonic.valueAt(t), // expected
            rebuilt, // actual
            1e-9 // delta
        );
    }
}
