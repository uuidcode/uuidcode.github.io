package fourier;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

/**
 * 실제 그리기 경로를 그대로 태워 한 장면을 오프스크린으로 만들어 본다.
 */
public class FourierBirdE2ETest {
    private static final int WIDTH = 720;
    private static final int HEIGHT = 900;
    private static final Color BACKGROUND_COLOR = new Color(8, 18, 15);

    private static FourierBirdModel model;

    @BeforeClass
    public static void setUpClass() {
        System.setProperty("java.awt.headless", "true");

        model = FourierBirdModel.create();
    }

    private static BufferedImage render(
        int harmonicCount,
        double progress
    ) {
        FourierBirdPanel panel = new FourierBirdPanel(model);
        panel.setSize(WIDTH, HEIGHT);
        panel.setHarmonicCount(harmonicCount);
        panel.setProgress(progress);

        BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = image.createGraphics();

        try {
            panel.paint(g2);
        } finally {
            g2.dispose();
        }

        return image;
    }

    private static int countForegroundPixel(BufferedImage image) {
        int count = 0;

        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                if (image.getRGB(x, y) != BACKGROUND_COLOR.getRGB()) {
                    count++;
                }
            }
        }

        return count;
    }

    @Test
    public void sceneIsPaintedOnTheDarkBackground() {
        BufferedImage image = render(
            10, // harmonicCount
            0.5 // progress
        );

        assertTrue(countForegroundPixel(image) > 10000);
    }

    @Test
    public void cornerStaysAtTheBackgroundColor() {
        BufferedImage image = render(
            10, // harmonicCount
            0.5 // progress
        );

        assertTrue(image.getRGB(3, 3) == BACKGROUND_COLOR.getRGB());
    }

    @Test
    public void finishedLapCoversMoreAreaThanAStartingLap() {
        BufferedImage early = render(
            40, // harmonicCount
            0.1 // progress
        );

        BufferedImage late = render(
            40, // harmonicCount
            1.0 // progress
        );

        assertTrue(countForegroundPixel(late) > countForegroundPixel(early));
    }

    @Test
    public void everyScheduledHarmonicRendersWithoutFailure() {
        int[] harmonicList = {1, 2, 5, 10, 20, 50, 100};

        for (int harmonicCount : harmonicList) {
            BufferedImage image = render(
                harmonicCount, // harmonicCount
                0.8 // progress
            );

            assertTrue(countForegroundPixel(image) > 5000);
        }
    }

    @Test
    public void birdAreaHoldsWarmColorsWhenTheLapIsDone() {
        BufferedImage image = render(
            100, // harmonicCount
            1.0 // progress
        );

        int warmCount = 0;

        for (int y = 400; y < 690; y++) {
            for (int x = 290; x < 620; x++) {
                Color color = new Color(image.getRGB(x, y));

                if (color.getRed() > color.getBlue() + 40) {
                    warmCount++;
                }
            }
        }

        assertTrue(warmCount > 20000);
    }
}
