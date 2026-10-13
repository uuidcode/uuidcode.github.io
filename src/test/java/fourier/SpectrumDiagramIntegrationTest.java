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
 * 생성기 - 모델 - 파일 쓰기가 한 줄로 이어지는지 확인한다.
 */
public class SpectrumDiagramIntegrationTest {
    @BeforeClass
    public static void setUpClass() {
        System.setProperty("java.awt.headless", "true");
    }

    private static File createTemporaryDirectory() throws IOException {
        File directory = new File(System.getProperty("java.io.tmpdir"), "spectrum-main-" + System.nanoTime());

        if (!directory.mkdirs()) {
            throw new IOException("임시 디렉터리를 만들 수 없습니다: " + directory);
        }

        return directory;
    }

    @Test
    public void mainWritesAReadablePng() throws IOException {
        File directory = createTemporaryDirectory();

        SpectrumDiagram.main(new String[] {directory.getAbsolutePath()});

        BufferedImage image = ImageIO.read(new File(directory, SpectrumDiagram.FILE_NAME));

        assertEquals(
            SpectrumDiagram.SHEET_HEIGHT, // expected
            image.getHeight() // actual
        );
    }

    @Test
    public void everyStageCanBeRebuiltFromTheModel() {
        FourierBirdModel model = FourierBirdModel.create();

        for (int stage : SpectrumDiagram.STAGE_LIST) {
            assertTrue(stage <= model.getMaxHarmonic());

            assertEquals(
                1201, // expected
                model.approximationPointList(stage, 1200).size() // actual
            );
        }
    }

    @Test
    public void bothDiagramsWriteIntoTheSameFolder() throws IOException {
        File directory = createTemporaryDirectory();

        InnerProductDiagram.write(directory);
        SpectrumDiagram.write(directory);

        assertEquals(
            3, // expected
            directory.listFiles().length // actual
        );
    }
}
