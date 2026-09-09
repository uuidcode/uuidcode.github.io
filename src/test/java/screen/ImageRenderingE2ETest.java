package screen;

import java.awt.Point;
import java.awt.image.BufferedImage;
import java.nio.file.Files;

import javax.swing.JScrollPane;
import javax.swing.JViewport;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;

public class ImageRenderingE2ETest extends RenderingTestSupport {
    @Test
    public void savedImageSurvivesTabCreationScrollingAndRepainting() throws Exception {
        byte[] originalFile = Files.readAllBytes(this.imageFile.toPath());

        this.tabs.addTab(this.imageFile.getName());

        SwingUtilities.invokeAndWait(() -> {
            JScrollPane scrollPane = findComponent(
                (ImagePanel) this.tabs.getSelectedComponent(), // container
                JScrollPane.class // type
            );

            scrollPane.setSize(
                360, // width
                240 // height
            );

            scrollPane.doLayout();

            JViewport viewport = scrollPane.getViewport();

            viewport.doLayout();

            for (int offset : new int[]{0, 40, 100, 20, 0}) {
                viewport.setViewPosition(new Point(
                    offset, // x
                    offset // y
                ));

                BufferedImage rendered = render(viewport);

                for (int row = 80; row < rendered.getHeight(); row++) {
                    for (int column = 0; column < rendered.getWidth(); column++) {
                        assertEquals(
                            this.source.getRGB(
                                column + offset, // x
                                row + offset // y
                            ), // expected
                            rendered.getRGB(
                                column, // x
                                row // y
                            ) // actual
                        );
                    }
                }
            }
        });

        assertArrayEquals(
            originalFile, // expecteds
            Files.readAllBytes(this.imageFile.toPath()) // actuals
        );
    }
}
