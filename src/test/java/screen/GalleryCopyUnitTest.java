package screen;

import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.awt.image.BufferedImage;

import org.junit.Test;

import static java.awt.image.BufferedImage.TYPE_INT_ARGB;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

// 갤러리 썸네일 선택 시 클립보드로 복사되는 이미지 페이로드(ImageTransferable)를 검증한다.
public class GalleryCopyUnitTest {
    @Test
    public void transferableExposesImageUnderImageFlavor() throws Exception {
        BufferedImage image = new BufferedImage(
            10, // width
            10, // height
            TYPE_INT_ARGB // imageType
        );

        ImageTransferable transferable = new ImageTransferable(image);

        assertTrue(transferable.isDataFlavorSupported(DataFlavor.imageFlavor));

        assertSame(image, transferable.getTransferData(DataFlavor.imageFlavor));
    }

    @Test(expected = UnsupportedFlavorException.class)
    public void transferableRejectsUnsupportedFlavor() throws Exception {
        BufferedImage image = new BufferedImage(
            10, // width
            10, // height
            TYPE_INT_ARGB // imageType
        );

        ImageTransferable transferable = new ImageTransferable(image);

        transferable.getTransferData(DataFlavor.stringFlavor);
    }
}
