package screen;

import java.awt.Color;
import java.awt.Component;
import java.awt.Container;
import java.awt.GraphicsEnvironment;
import java.awt.image.BufferedImage;

import javax.imageio.ImageIO;
import javax.swing.JButton;
import javax.swing.SwingUtilities;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assume.assumeTrue;

// 이미지 탭의 auto 버튼은 캡처의 auto 처럼 바깥 단색 여백을 잘라낸다.
// Swing 컴포넌트를 생성하므로 헤드리스 환경에서는 건너뛴다.
public class ImagePanelAutoTrimApiTest extends RenderingTestSupport {
    @Test
    public void autoButtonTrimsTheUniformBorder() throws Exception {
        assumeTrue(!GraphicsEnvironment.isHeadless());

        this.writeBorderedImage();

        this.tabs.addTab(this.imageFile.getName());

        SwingUtilities.invokeAndWait(() -> {
            ImagePanel panel = (ImagePanel) this.tabs.getSelectedComponent();

            assertEquals(
                20, // expected
                panel.getDisplayImage().getWidth() // actual
            );

            JButton autoButton = findButton(
                panel, // container
                "auto" // text
            );

            assertNotNull(autoButton);

            autoButton.doClick();

            assertEquals(
                10, // expected
                panel.getDisplayImage().getWidth() // actual
            );

            assertEquals(
                10, // expected
                panel.getDisplayImage().getHeight() // actual
            );
        });
    }

    // 가장자리를 단색으로 채우고 가운데 10 * 10 만 다른 색으로 둔 이미지를 만든다.
    private void writeBorderedImage() throws Exception {
        BufferedImage image = new BufferedImage(
            20, // width
            20, // height
            BufferedImage.TYPE_INT_RGB // imageType
        );

        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                image.setRGB(
                    x,
                    y,
                    Color.BLACK.getRGB() // rgb
                );
            }
        }

        for (int y = 5; y < 15; y++) {
            for (int x = 5; x < 15; x++) {
                image.setRGB(
                    x,
                    y,
                    Color.WHITE.getRGB() // rgb
                );
            }
        }

        ImageIO.write(
            image, // im
            "png", // formatName
            this.imageFile // output
        );
    }

    private static JButton findButton(
        Container container,
        String text
    ) {
        for (Component component : container.getComponents()) {
            if (component instanceof JButton && text.equals(((JButton) component).getText())) {
                return (JButton) component;
            }

            if (component instanceof Container) {
                JButton found = findButton(
                    (Container) component, // container
                    text
                );

                if (found != null) {
                    return found;
                }
            }
        }

        return null;
    }
}
