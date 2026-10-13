package fourier;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * main 으로 한 번 돌렸을 때 실제로 읽을 수 있는 PNG 가 나오는지 끝까지 확인한다.
 */
public class InnerProductDiagramIntegrationTest {
    @BeforeClass
    public static void setUpClass() {
        System.setProperty("java.awt.headless", "true");
    }

    private static File createTemporaryDirectory() throws IOException {
        File directory = new File(System.getProperty("java.io.tmpdir"), "diagram-main-" + System.nanoTime());

        if (!directory.mkdirs()) {
            throw new IOException("임시 디렉터리를 만들 수 없습니다: " + directory);
        }

        return directory;
    }

    @Test
    public void mainWritesReadablePngFiles() throws IOException {
        File directory = createTemporaryDirectory();

        InnerProductDiagram.main(new String[] {directory.getAbsolutePath()});

        BufferedImage main = ImageIO.read(new File(directory, InnerProductDiagram.MAIN_FILE_NAME));
        BufferedImage orthogonal = ImageIO.read(new File(directory, InnerProductDiagram.ORTHOGONAL_FILE_NAME));

        assertEquals(
            InnerProductDiagram.MAIN_HEIGHT, // expected
            main.getHeight() // actual
        );

        assertEquals(
            InnerProductDiagram.ORTHOGONAL_HEIGHT, // expected
            orthogonal.getHeight() // actual
        );
    }

    @Test
    public void rerunningOverwritesTheSameFiles() throws IOException {
        File directory = createTemporaryDirectory();

        InnerProductDiagram.main(new String[] {directory.getAbsolutePath()});

        long firstLength = new File(directory, InnerProductDiagram.MAIN_FILE_NAME).length();

        InnerProductDiagram.main(new String[] {directory.getAbsolutePath()});

        long secondLength = new File(directory, InnerProductDiagram.MAIN_FILE_NAME).length();

        assertEquals(
            2, // expected
            directory.listFiles().length // actual
        );

        assertEquals(
            firstLength, // expected
            secondLength // actual
        );
    }

    @Test
    public void diagramAndSimulationShareTheSameHarmonicIdea() {
        FourierBirdModel model = FourierBirdModel.create(
            256, // sampleCount
            8 // maxHarmonic
        );

        assertTrue(model.getSeriesX().getHarmonicList().get(0).getAmplitude() > 0);

        assertEquals(
            1, // expected
            model.getSeriesX().getHarmonicList().get(0).getOrder() // actual
        );
    }
}
