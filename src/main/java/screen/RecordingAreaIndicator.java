package screen;

import java.awt.Color;
import java.awt.Rectangle;

import javax.swing.JWindow;

// 녹화 중인 화면 영역을 빨간 테두리로 표시하는 인디케이터.
// 캡처 영역 바깥 여백에 얇은 창 4개로 테두리를 그려서,
// 녹화 영상에는 테두리가 찍히지 않고 영역 내부는 그대로 클릭/조작할 수 있게 한다.
public class RecordingAreaIndicator {
    private static final int BORDER_THICKNESS = 3;
    private static final Color BORDER_COLOR = new Color(255, 45, 45);
    private final JWindow topWindow;
    private final JWindow bottomWindow;
    private final JWindow leftWindow;
    private final JWindow rightWindow;

    public RecordingAreaIndicator(Rectangle captureRectangle) {
        this.topWindow = createStrip(new Rectangle(
            captureRectangle.x - BORDER_THICKNESS, // x
            captureRectangle.y - BORDER_THICKNESS, // y
            captureRectangle.width + BORDER_THICKNESS * 2, // width
            BORDER_THICKNESS // height
        ));

        this.bottomWindow = createStrip(new Rectangle(
            captureRectangle.x - BORDER_THICKNESS, // x
            captureRectangle.y + captureRectangle.height, // y
            captureRectangle.width + BORDER_THICKNESS * 2, // width
            BORDER_THICKNESS // height
        ));

        this.leftWindow = createStrip(new Rectangle(
            captureRectangle.x - BORDER_THICKNESS, // x
            captureRectangle.y, // y
            BORDER_THICKNESS, // width
            captureRectangle.height // height
        ));

        this.rightWindow = createStrip(new Rectangle(
            captureRectangle.x + captureRectangle.width, // x
            captureRectangle.y, // y
            BORDER_THICKNESS, // width
            captureRectangle.height // height
        ));
    }

    private static JWindow createStrip(Rectangle bounds) {
        JWindow window = new JWindow();
        window.setAlwaysOnTop(true);
        window.setFocusableWindowState(false);
        window.setBackground(BORDER_COLOR);
        window.getContentPane().setBackground(BORDER_COLOR);
        window.setBounds(
            bounds.x, // x
            bounds.y, // y
            bounds.width, // width
            bounds.height // height
        );

        return window;
    }

    public void setVisible(boolean visible) {
        this.topWindow.setVisible(visible);
        this.bottomWindow.setVisible(visible);
        this.leftWindow.setVisible(visible);
        this.rightWindow.setVisible(visible);
    }

    public void dispose() {
        this.topWindow.dispose();
        this.bottomWindow.dispose();
        this.leftWindow.dispose();
        this.rightWindow.dispose();
    }
}
