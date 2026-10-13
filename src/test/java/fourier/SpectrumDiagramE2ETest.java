package fourier;

import java.awt.Color;
import java.awt.image.BufferedImage;

import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * 완성된 스펙트럼 그림의 픽셀을 직접 확인한다.
 */
public class SpectrumDiagramE2ETest {
    private static final double COLUMN_WIDTH = 200;
    private static final double COLUMN_GAP = 22;
    private static final int SHAPE_TOP = 664;
    private static final int SHAPE_BOTTOM = 864;

    private static BufferedImage sheet;

    @BeforeClass
    public static void setUpClass() {
        System.setProperty("java.awt.headless", "true");

        sheet = SpectrumDiagram.drawSpectrum();
    }

    private static int countNear(
        BufferedImage image,
        Color reference,
        int fromX,
        int toX,
        int fromY,
        int toY
    ) {
        int count = 0;

        for (int y = fromY; y < toY; y++) {
            for (int x = fromX; x < toX; x++) {
                Color color = new Color(image.getRGB(x, y));
                int distance = Math.abs(color.getRed() - reference.getRed())
                        + Math.abs(color.getGreen() - reference.getGreen())
                        + Math.abs(color.getBlue() - reference.getBlue());

                if (distance <= 30) {
                    count++;
                }
            }
        }

        return count;
    }

    private static int columnLeft(int index) {
        return (int) (58 + index * (COLUMN_WIDTH + COLUMN_GAP));
    }

    @Test
    public void backgroundStaysWhite() {
        assertEquals(
            Color.WHITE.getRGB(), // expected
            sheet.getRGB(4, 4) // actual
        );
    }

    @Test
    public void everyStageColumnDrawsABird() {
        for (int index = 0; index < SpectrumDiagram.STAGE_LIST.length; index++) {
            int left = columnLeft(index);

            int birdPixel = countNear(
                sheet,
                DiagramStyle.BIRD_COLOR,
                left,
                left + (int) COLUMN_WIDTH,
                SHAPE_TOP,
                SHAPE_BOTTOM
            );

            assertTrue(birdPixel > 3000);
        }
    }

    @Test
    public void bothSpectrumColorsAppearInTheTopRow() {
        int teal = countNear(
            sheet,
            DiagramStyle.TEAL_COLOR,
            715,
            1124,
            215,
            310
        );

        int gold = countNear(
            sheet,
            DiagramStyle.GOLD_COLOR,
            715,
            1124,
            345,
            440
        );

        assertTrue(teal > 2000);
        assertTrue(gold > 2000);
    }

    /**
     * N = 1 칸은 막대 하나만 색칠되고, N = 100 칸은 전부 색칠돼야 한다.
     */
    @Test
    public void highlightGrowsWithTheStage() {
        int first = columnLeft(0);
        int last = columnLeft(SpectrumDiagram.STAGE_LIST.length - 1);

        int firstHighlight = countNear(
            sheet,
            DiagramStyle.TEAL_COLOR,
            first,
            first + (int) COLUMN_WIDTH,
            590,
            644
        );

        int lastHighlight = countNear(
            sheet,
            DiagramStyle.TEAL_COLOR,
            last,
            last + (int) COLUMN_WIDTH,
            590,
            644
        );

        assertTrue(firstHighlight > 0);
        assertTrue(lastHighlight > firstHighlight * 10);
    }

    @Test
    public void lastStageLooksMoreLikeTheTargetThanTheFirst() {
        FourierBirdModel model = FourierBirdModel.create();
        double first = model.maxErrorRatio(SpectrumDiagram.STAGE_LIST[0]);
        double last = model.maxErrorRatio(SpectrumDiagram.STAGE_LIST[SpectrumDiagram.STAGE_LIST.length - 1]);

        assertTrue(first > last * 10);
    }
}
