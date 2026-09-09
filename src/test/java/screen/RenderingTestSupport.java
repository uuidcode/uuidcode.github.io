package screen;

import java.awt.Component;
import java.awt.Container;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;

import javax.imageio.ImageIO;
import javax.swing.JComponent;
import javax.swing.SwingUtilities;

import org.junit.After;
import org.junit.Before;

abstract class RenderingTestSupport {
    protected File imageFile;
    protected BufferedImage source;
    protected ImageTabPanel tabs;

    @Before
    public void prepareImage() throws Exception {
        this.imageFile = File.createTempFile(
            "rendering-test-", // prefix
            ".png", // suffix
            Util.getImageDir() // directory
        );

        this.source = new BufferedImage(
            640, // width
            480, // height
            BufferedImage.TYPE_INT_RGB // imageType
        );

        for (int row = 0; row < this.source.getHeight(); row++) {
            for (int column = 0; column < this.source.getWidth(); column++) {
                this.source.setRGB(
                    column, // x
                    row, // y
                    0xFF000000 | (row % 256 << 16) | (column % 256 << 8) | (row + column) % 256 // rgb
                );
            }
        }

        ImageIO.write(
            this.source, // im
            "png", // formatName
            this.imageFile // output
        );

        SwingUtilities.invokeAndWait(() -> this.tabs = new ImageTabPanel());
    }

    @After
    public void removeImage() throws Exception {
        SwingUtilities.invokeAndWait(() -> this.tabs.removeAll());

        Files.deleteIfExists(this.imageFile.toPath());
    }

    protected ImagePanel addImageOnEdt() {
        this.tabs.addTab(this.imageFile.getName());

        return (ImagePanel) this.tabs.getSelectedComponent();
    }

    protected static <ComponentType extends Component> ComponentType findComponent(
        Container container,
        Class<ComponentType> type
    ) {
        for (Component component : container.getComponents()) {
            if (type.isInstance(component)) {
                return type.cast(component);
            }

            if (component instanceof Container) {
                ComponentType match = findComponent(
                    (Container) component, // container
                    type
                );

                if (match != null) {
                    return match;
                }
            }
        }

        return null;
    }

    protected static BufferedImage render(JComponent component) {
        BufferedImage result = new BufferedImage(
            component.getWidth(), // width
            component.getHeight(), // height
            BufferedImage.TYPE_INT_ARGB // imageType
        );

        Graphics2D graphics = result.createGraphics();

        try {
            component.paint(graphics);
        } finally {
            graphics.dispose();
        }

        return result;
    }
}
