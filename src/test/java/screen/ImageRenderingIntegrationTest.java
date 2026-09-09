package screen;

import java.awt.event.ContainerAdapter;
import java.awt.event.ContainerEvent;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.swing.JScrollPane;
import javax.swing.JViewport;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ImageRenderingIntegrationTest extends RenderingTestSupport {
    @Test
    public void captureWorkerAddsImageComponentsOnEdt() throws Exception {
        AtomicBoolean addedOnEdt = new AtomicBoolean();

        SwingUtilities.invokeAndWait(() -> this.tabs.addContainerListener(new ContainerAdapter() {
            @Override
            public void componentAdded(ContainerEvent event) {
                if (event.getChild() instanceof ImagePanel) {
                    addedOnEdt.set(SwingUtilities.isEventDispatchThread());
                }
            }
        }));

        this.tabs.addTab(this.imageFile.getName());

        assertTrue(addedOnEdt.get());
    }

    @Test
    public void imageViewportRepaintsInsteadOfCopyingOldPixels() throws Exception {
        SwingUtilities.invokeAndWait(() -> {
            JScrollPane scrollPane = findComponent(
                this.addImageOnEdt(), // container
                JScrollPane.class // type
            );

            assertEquals(
                JViewport.SIMPLE_SCROLL_MODE, // expected
                scrollPane.getViewport().getScrollMode() // actual
            );
        });
    }
}
