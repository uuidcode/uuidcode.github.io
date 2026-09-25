package screen;

import javax.swing.SwingUtilities;

import org.junit.Test;

// ImagePanel.copyToClipboard() 공개 API 가 예외 없이 현재 이미지를 클립보드로 복사하는지 확인한다.
public class GalleryCopyApiTest extends RenderingTestSupport {
    @Test
    public void copyToClipboardRunsWithoutError() throws Exception {
        ImagePanel imagePanel = this.addImageOnEdt();

        SwingUtilities.invokeAndWait(imagePanel::copyToClipboard);
    }
}
