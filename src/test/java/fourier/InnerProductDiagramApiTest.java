package fourier;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * 그림 생성기의 공개 메서드 계약을 확인한다.
 */
public class InnerProductDiagramApiTest {
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
    public void mainSheetHasTheDeclaredSize() {
        BufferedImage image = InnerProductDiagram.drawMain();

        assertEquals(
            InnerProductDiagram.SHEET_WIDTH, // expected
            image.getWidth() // actual
        );

        assertEquals(
            InnerProductDiagram.MAIN_HEIGHT, // expected
            image.getHeight() // actual
        );
    }

    @Test
    public void orthogonalSheetHasTheDeclaredSize() {
        BufferedImage image = InnerProductDiagram.drawOrthogonal();

        assertEquals(
            InnerProductDiagram.SHEET_WIDTH, // expected
            image.getWidth() // actual
        );

        assertEquals(
            InnerProductDiagram.ORTHOGONAL_HEIGHT, // expected
            image.getHeight() // actual
        );
    }

    @Test
    public void writeCreatesBothFiles() throws IOException {
        File directory = createTemporaryDirectory("diagram-write");

        InnerProductDiagram.write(directory);

        assertTrue(new File(directory, InnerProductDiagram.MAIN_FILE_NAME).isFile());
        assertTrue(new File(directory, InnerProductDiagram.ORTHOGONAL_FILE_NAME).isFile());
    }

    @Test
    public void writeCreatesAMissingDirectory() throws IOException {
        File parent = createTemporaryDirectory("diagram-parent");
        File directory = new File(parent, "not-yet/created");

        InnerProductDiagram.write(directory);

        assertTrue(directory.isDirectory());
        assertTrue(new File(directory, InnerProductDiagram.MAIN_FILE_NAME).isFile());
    }

    @Test
    public void writtenFilesAreNotEmpty() throws IOException {
        File directory = createTemporaryDirectory("diagram-size");

        InnerProductDiagram.write(directory);

        assertTrue(new File(directory, InnerProductDiagram.MAIN_FILE_NAME).length() > 1000);
        assertTrue(new File(directory, InnerProductDiagram.ORTHOGONAL_FILE_NAME).length() > 1000);
    }
}
