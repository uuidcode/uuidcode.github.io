package screen;

import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class ScreenRecorderUnitTest {
    @Test
    public void resolveOutputFileUsesMp4Extension() {
        File outputFile = ScreenRecorder.resolveOutputFile();

        assertTrue(outputFile.getName().endsWith(ScreenRecorder.VIDEO_EXTENSION));
    }

    @Test
    public void toEvenRectangleRoundsOddDimensionsDown() {
        Rectangle rectangle = ScreenRecorder.toEvenRectangle(new Rectangle(
            5, // x
            7, // y
            101, // width
            51 // height
        ));

        assertEquals(
            100, // expected
            rectangle.width // actual
        );

        assertEquals(
            50, // expected
            rectangle.height // actual
        );

        assertEquals(
            5, // expected
            rectangle.x // actual
        );

        assertEquals(
            7, // expected
            rectangle.y // actual
        );
    }

    @Test
    public void toEvenRectangleKeepsMinimumSize() {
        Rectangle rectangle = ScreenRecorder.toEvenRectangle(new Rectangle(
            0, // x
            0, // y
            1, // width
            1 // height
        ));

        assertEquals(
            2, // expected
            rectangle.width // actual
        );

        assertEquals(
            2, // expected
            rectangle.height // actual
        );
    }

    @Test
    public void toEncodableImageProducesEvenDimensions() {
        BufferedImage source = new BufferedImage(
            65, // width
            49, // height
            BufferedImage.TYPE_INT_ARGB // imageType
        );

        BufferedImage encodable = ScreenRecorder.toEncodableImage(source);

        assertEquals(
            64, // expected
            encodable.getWidth() // actual
        );

        assertEquals(
            48, // expected
            encodable.getHeight() // actual
        );
    }

    @Test
    public void encodeFramesCreatesNonEmptyMp4() throws Exception {
        File outputFile = File.createTempFile(
            "screen-recorder-test-", // prefix
            ScreenRecorder.VIDEO_EXTENSION, // suffix
            Util.getImageDir() // directory
        );

        try {
            ScreenRecorder.encodeFrames(
                outputFile, // outputFile
                ScreenRecorder.DEFAULT_FPS, // fps
                buildFrames(
                    6, // frameCount
                    64, // width
                    48 // height
                )
            );

            assertTrue(outputFile.exists());
            assertTrue(outputFile.length() > 0);
        } finally {
            Files.deleteIfExists(outputFile.toPath());
        }
    }

    private static List<BufferedImage> buildFrames(
        int frameCount,
        int width,
        int height
    ) {
        List<BufferedImage> frameList = new ArrayList<>();

        for (int index = 0; index < frameCount; index++) {
            BufferedImage frame = new BufferedImage(
                width, // width
                height, // height
                BufferedImage.TYPE_INT_RGB // imageType
            );

            int shade = index * 40 % 256;

            for (int row = 0; row < height; row++) {
                for (int column = 0; column < width; column++) {
                    frame.setRGB(
                        column, // x
                        row, // y
                        0xFF000000 | (shade << 16) | (column % 256 << 8) | row % 256 // rgb
                    );
                }
            }

            frameList.add(frame);
        }

        return frameList;
    }
}
