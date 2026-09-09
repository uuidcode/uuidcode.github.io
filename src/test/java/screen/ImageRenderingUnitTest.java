package screen;

import java.awt.Color;
import java.awt.image.BufferedImage;

import javax.swing.BorderFactory;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ImageRenderingUnitTest extends RenderingTestSupport {
    @Test
    public void imageDoesNotPaintOverBorder() throws Exception {
        SwingUtilities.invokeAndWait(() -> {
            ImageViewPanel view = findComponent(
                this.addImageOnEdt(), // container
                ImageViewPanel.class // type
            );

            view.setSize(
                this.source.getWidth(),
                this.source.getHeight()
            );

            view.setBorder(BorderFactory.createLineBorder(
                Color.MAGENTA, // color
                4 // thickness
            ));

            BufferedImage result = render(view);

            assertEquals(
                Color.MAGENTA.getRGB(), // expected
                result.getRGB(
                    0, // x
                    100 // y
                ) // actual
            );
        });
    }

    @Test
    public void imageDoesNotPaintOverChildren() throws Exception {
        SwingUtilities.invokeAndWait(() -> {
            ImageViewPanel view = findComponent(
                this.addImageOnEdt(), // container
                ImageViewPanel.class // type
            );

            view.setSize(
                this.source.getWidth(),
                this.source.getHeight()
            );

            view.setLayout(null);

            JPanel child = new JPanel();

            child.setBackground(Color.MAGENTA);

            child.setBounds(
                200, // x
                200, // y
                30, // width
                30 // height
            );

            view.add(child);

            BufferedImage result = render(view);

            assertEquals(
                Color.MAGENTA.getRGB(), // expected
                result.getRGB(
                    210, // x
                    210 // y
                ) // actual
            );
        });
    }
}
