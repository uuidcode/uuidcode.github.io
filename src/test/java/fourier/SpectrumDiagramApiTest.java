package fourier;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SpectrumDiagramApiTest {
    @BeforeClass
    public static void setUpClass() {
        System.setProperty("java.awt.headless", "true");
    }

    private static File createTemporaryDirectory(String name) throws IOException {
        File directory = new File(System.getProperty("java.io.tmpdir"), name + "-" + System.nanoTime());

        if (!directory.mkdirs()) {
            throw new IOException("임시 디렉터리를 만들 수 없습니다: " + directory);
        }

        return directory;
    }

    @Test
    public void sheetHasTheDeclaredSize() {
        BufferedImage image = SpectrumDiagram.drawSpectrum();

        assertEquals(
            SpectrumDiagram.SHEET_WIDTH, // expected
            image.getWidth() // actual
        );

        assertEquals(
            SpectrumDiagram.SHEET_HEIGHT, // expected
            image.getHeight() // actual
        );
    }

    @Test
    public void writeCreatesTheFile() throws IOException {
        File directory = createTemporaryDirectory("spectrum-write");

        SpectrumDiagram.write(directory);

        assertTrue(new File(directory, SpectrumDiagram.FILE_NAME).isFile());
        assertTrue(new File(directory, SpectrumDiagram.FILE_NAME).length() > 1000);
    }

    @Test
    public void writeCreatesAMissingDirectory() throws IOException {
        File parent = createTemporaryDirectory("spectrum-parent");
        File directory = new File(parent, "not-yet/created");

        SpectrumDiagram.write(directory);

        assertTrue(directory.isDirectory());
        assertTrue(new File(directory, SpectrumDiagram.FILE_NAME).isFile());
    }

    @Test
    public void sheetWidthMatchesTheOtherDiagram() {
        assertEquals(
            InnerProductDiagram.SHEET_WIDTH, // expected
            SpectrumDiagram.SHEET_WIDTH // actual
        );
    }
}
