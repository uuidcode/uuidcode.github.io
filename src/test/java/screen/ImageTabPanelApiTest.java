package screen;

import java.awt.Rectangle;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class ImageTabPanelApiTest extends RenderingTestSupport {
    @Test
    public void addTabReturnsAfterImageIsSelected() throws Exception {
        AtomicBoolean selectedBeforeReturn = new AtomicBoolean();

        SwingUtilities.invokeAndWait(() -> this.tabs.addChangeListener(event ->
            selectedBeforeReturn.set(this.tabs.getSelectedComponent() instanceof ImagePanel)));

        this.tabs.addTab(
            this.imageFile.getName(), // name
            new Rectangle(this.source.getRaster().getBounds()), // captureRectangle
            new CaptureConfig(), // captureConfig
            false // windowCapture
        );

        assertTrue(selectedBeforeReturn.get());

        SwingUtilities.invokeAndWait(() -> {
            assertEquals(
                1, // expected
                this.tabs.getTabCount() // actual
            );

            ImagePanel selected = (ImagePanel) this.tabs.getSelectedComponent();

            assertEquals(
                this.imageFile.getName(), // expected
                selected.getTabName() // actual
            );

            assertNotNull(selected.getDisplayImage());
        });
    }

    @Test
    public void addTabCanBeCalledFromEdt() throws Exception {
        SwingUtilities.invokeAndWait(() -> {
            this.tabs.addTab(this.imageFile.getName());

            assertEquals(
                1, // expected
                this.tabs.getTabCount() // actual
            );
        });
    }

    @Test
    public void imageLoadingFailureIsReportedToCaller() throws Exception {
        try {
            this.tabs.addTab(this.imageFile.getName() + "-missing");

            fail("Missing image must fail synchronously");
        } catch (RuntimeException expected) {
            assertNotNull(expected.getCause());
        }

        SwingUtilities.invokeAndWait(() -> assertTrue(this.tabs.getTabCount() == 0));
    }
}
