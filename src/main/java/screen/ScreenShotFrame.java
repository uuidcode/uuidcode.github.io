package screen;

import java.awt.Color;
import java.awt.Image;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.JFrame;

import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;

public class ScreenShotFrame extends JFrame {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);

    public ScreenShotFrame(GraphicsDevice graphicsDevice, ImageFrame imageFrame, Image baseScreenImage) {
        super("ScreenShotFrame");
        ScreenShotPanel contentPane = new ScreenShotPanel(graphicsDevice, imageFrame, this, baseScreenImage);
        contentPane.addMouseListener(contentPane);
        contentPane.addMouseMotionListener(contentPane);
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.setUndecorated(true);
        this.setAlwaysOnTop(true);
        // 창을 투명하게 두면 화면에 비치는 것은 공짜지만, 다시 그릴 때마다 macOS 가
        // 그 자리를 뒤 화면과 다시 합성하면서 번쩍인다(드래그 중에 특히 심하다).
        // 그래서 창은 불투명하게 두고, 캡처를 시작한 순간의 화면을 얼려서 직접 깐다.
        // 불투명 창은 Liquid Glass 재질도 타지 않으므로 블러 문제도 함께 사라진다.
        contentPane.setOpaque(true);

        int x = graphicsDevice.getDefaultConfiguration().getBounds().x;
        int y = graphicsDevice.getDefaultConfiguration().getBounds().y;
        this.setLocation(x, y);

        int width = graphicsDevice.getDisplayMode().getWidth();
        int height = graphicsDevice.getDisplayMode().getHeight();
        this.setSize(width, height);
        this.setContentPane(contentPane);

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            boolean isOK = this.equals(ke.getComponent());

            if (isOK && ke.getID() == KeyEvent.KEY_RELEASED) {
                if (ke.getKeyCode() == KeyEvent.VK_ESCAPE) {
                    contentPane.cancelCapture();
                }
            }

            return false;
        });

        this.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    toggleFullscreen(ScreenShotFrame.this);
                }
            }
        });
    }

    private static void toggleFullscreen(JFrame frame) {
        GraphicsDevice gd = GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice();
        if (gd.getFullScreenWindow() == frame) {
            gd.setFullScreenWindow(null);
        } else {
            gd.setFullScreenWindow(frame);
        }
    }
}
