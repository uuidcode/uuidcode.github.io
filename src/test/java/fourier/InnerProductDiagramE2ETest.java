package fourier;

import java.awt.Color;
import java.awt.image.BufferedImage;

import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * 완성된 그림의 픽셀을 직접 들여다본다.
 */
public class InnerProductDiagramE2ETest {
    @BeforeClass
    public static void setUpClass() {
        System.setProperty("java.awt.headless", "true");
    }

    private static int countMatching(
        BufferedImage image,
        Color reference,
        int tolerance
    ) {
        int count = 0;

        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                Color color = new Color(image.getRGB(x, y));
                int distance = Math.abs(color.getRed() - reference.getRed())
                        + Math.abs(color.getGreen() - reference.getGreen())
                        + Math.abs(color.getBlue() - reference.getBlue());

                if (distance <= tolerance) {
                    count++;
                }
            }
        }

        return count;
    }

    @Test
    public void sheetBackgroundStaysWhite() {
        BufferedImage image = InnerProductDiagram.drawMain();

        assertEquals(
            Color.WHITE.getRGB(), // expected
            image.getRGB(4, 4) // actual
        );

        assertEquals(
            Color.WHITE.getRGB(), // expected
            image.getRGB(image.getWidth() - 4, image.getHeight() - 4) // actual
        );
    }

    @Test
    public void mainSheetIsMostlyEmptyButHasContent() {
        BufferedImage image = InnerProductDiagram.drawMain();
        int total = image.getWidth() * image.getHeight();
        int white = countMatching(image, Color.WHITE, 6);

        assertTrue(white < total);
        assertTrue(total - white > 20000);
    }

    @Test
    public void orthogonalSheetShowsBothPositiveAndNegativeArea() {
        BufferedImage image = InnerProductDiagram.drawOrthogonal();
        int green = countMatching(image, new Color(208, 236, 220), 40);
        int red = countMatching(image, new Color(244, 212, 217), 40);

        assertTrue(green > 3000);
        assertTrue(red > 3000);
    }

    @Test
    public void leftPlotHasNoNegativeArea() {
        BufferedImage image = InnerProductDiagram.drawOrthogonal();
        int redOnLeft = 0;
        Color reference = new Color(244, 212, 217);

        for (int y = 320; y < 400; y++) {
            for (int x = 80; x < 560; x++) {
                Color color = new Color(image.getRGB(x, y));
                int distance = Math.abs(color.getRed() - reference.getRed())
                        + Math.abs(color.getGreen() - reference.getGreen())
                        + Math.abs(color.getBlue() - reference.getBlue());

                if (distance <= 40) {
                    redOnLeft++;
                }
            }
        }

        assertEquals(
            0, // expected
            redOnLeft // actual
        );
    }

    @Test
    public void bothSheetsRenderRepeatably() {
        BufferedImage first = InnerProductDiagram.drawMain();
        BufferedImage second = InnerProductDiagram.drawMain();

        for (int y = 0; y < first.getHeight(); y += 17) {
            for (int x = 0; x < first.getWidth(); x += 17) {
                assertEquals(
                    first.getRGB(x, y), // expected
                    second.getRGB(x, y) // actual
                );
            }
        }
    }
}
