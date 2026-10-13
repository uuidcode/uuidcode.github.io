package fourier;

import java.awt.Component;
import java.awt.Container;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JPanel;
import javax.swing.JSlider;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * 조작 패널과 그림 패널이 함께 묶였을 때의 동작을 확인한다.
 */
public class FourierBirdIntegrationTest {
    private FourierBirdModel model;
    private FourierBirdPanel panel;
    private JPanel controlPanel;

    private static <T> List<T> findAll(
        Container container,
        Class<T> type
    ) {
        List<T> resultList = new ArrayList<T>();

        for (Component component : container.getComponents()) {
            if (type.isInstance(component)) {
                resultList.add(type.cast(component));
            }

            if (component instanceof Container) {
                resultList.addAll(findAll((Container) component, type));
            }
        }

        return resultList;
    }

    @Before
    public void setUp() {
        this.model = FourierBirdModel.create(
            256, // sampleCount
            24 // maxHarmonic
        );

        this.panel = new FourierBirdPanel(this.model);

        this.controlPanel = FourierBird.createControlPanel(
            this.panel,
            this.model
        );
    }

    @Test
    public void controlPanelExposesEveryControl() {
        assertEquals(
            2, // expected
            findAll(this.controlPanel, JButton.class).size() // actual
        );

        assertEquals(
            1, // expected
            findAll(this.controlPanel, JCheckBox.class).size() // actual
        );

        assertEquals(
            2, // expected
            findAll(this.controlPanel, JSlider.class).size() // actual
        );
    }

    @Test
    public void harmonicSliderCoversTheModelRange() {
        JSlider harmonicSlider = findAll(this.controlPanel, JSlider.class).get(0);

        assertEquals(
            1, // expected
            harmonicSlider.getMinimum() // actual
        );

        assertEquals(
            24, // expected
            harmonicSlider.getMaximum() // actual
        );
    }

    @Test
    public void harmonicSliderDrivesThePanelAndStopsAutoAdvance() {
        JSlider harmonicSlider = findAll(this.controlPanel, JSlider.class).get(0);
        JCheckBox autoCheckBox = findAll(this.controlPanel, JCheckBox.class).get(0);

        harmonicSlider.setValue(13);

        assertEquals(
            13, // expected
            this.panel.getHarmonicCount() // actual
        );

        assertFalse(autoCheckBox.isSelected());
        assertFalse(this.panel.isAutoAdvance());
    }

    @Test
    public void checkBoxTurnsAutoAdvanceBackOn() {
        JCheckBox autoCheckBox = findAll(this.controlPanel, JCheckBox.class).get(0);

        autoCheckBox.setSelected(false);
        autoCheckBox.doClick();

        assertTrue(this.panel.isAutoAdvance());
    }

    @Test
    public void playButtonTogglesTheAnimation() {
        JButton playButton = findAll(this.controlPanel, JButton.class).get(0);

        this.panel.start();

        assertTrue(this.panel.isPlaying());

        playButton.doClick();

        assertFalse(this.panel.isPlaying());

        assertEquals(
            "재생", // expected
            playButton.getText() // actual
        );

        playButton.doClick();

        assertTrue(this.panel.isPlaying());

        this.panel.setPlaying(false);
    }

    @Test
    public void resetButtonBringsTheHarmonicCountBackToOne() {
        JButton resetButton = findAll(this.controlPanel, JButton.class).get(1);

        this.panel.setHarmonicCount(20);
        resetButton.doClick();

        assertEquals(
            1, // expected
            this.panel.getHarmonicCount() // actual
        );
    }
}
