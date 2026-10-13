package fourier;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * 화면을 그리지 않고 {@link FourierBirdPanel} 의 공개 동작만 확인한다.
 */
public class FourierBirdPanelApiTest {
    private FourierBirdPanel panel;

    @Before
    public void setUp() {
        FourierBirdModel model = FourierBirdModel.create(
            256, // sampleCount
            24 // maxHarmonic
        );

        this.panel = new FourierBirdPanel(model);
    }

    @Test
    public void panelStartsAtTheFirstHarmonic() {
        assertEquals(
            1, // expected
            this.panel.getHarmonicCount() // actual
        );
    }

    @Test
    public void harmonicCountIsClampedToTheModelRange() {
        this.panel.setHarmonicCount(999);

        assertEquals(
            24, // expected
            this.panel.getHarmonicCount() // actual
        );

        this.panel.setHarmonicCount(-5);

        assertEquals(
            1, // expected
            this.panel.getHarmonicCount() // actual
        );
    }

    @Test
    public void progressIsClampedToASingleLap() {
        this.panel.setProgress(2.5);

        assertEquals(
            1.0, // expected
            this.panel.getProgress(), // actual
            1e-9 // delta
        );

        this.panel.setProgress(-1);

        assertEquals(
            0.0, // expected
            this.panel.getProgress(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void resetGoesBackToTheStartOfTheSchedule() {
        this.panel.setHarmonicCount(20);
        this.panel.setProgress(0.7);
        this.panel.reset();

        assertEquals(
            1, // expected
            this.panel.getHarmonicCount() // actual
        );

        assertEquals(
            0.0, // expected
            this.panel.getProgress(), // actual
            1e-9 // delta
        );
    }

    @Test
    public void autoAdvanceCanBeTurnedOff() {
        assertTrue(this.panel.isAutoAdvance());

        this.panel.setAutoAdvance(false);

        assertFalse(this.panel.isAutoAdvance());
    }

    @Test
    public void errorRatioFollowsTheHarmonicCount() {
        this.panel.setHarmonicCount(2);

        double coarse = this.panel.getMaxErrorRatio();

        this.panel.setHarmonicCount(24);

        double fine = this.panel.getMaxErrorRatio();

        assertTrue(coarse > fine);
    }

    @Test
    public void statusTextShowsTheHarmonicCount() {
        this.panel.setHarmonicCount(7);

        assertTrue(FourierBird.toStatusText(this.panel).startsWith("N = 7,"));
    }
}
