package screen;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import javax.swing.JFrame;

import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;

public class ScreenShotFrame extends JFrame {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);

    public ScreenShotFrame(GraphicsDevice graphicsDevice, ImageFrame imageFrame, BufferedImage baseScreenImage) {
        super("ScreenShotFrame");
        ScreenShotPanel contentPane = new ScreenShotPanel(graphicsDevice, imageFrame, this, baseScreenImage);
        contentPane.addMouseListener(contentPane);
        contentPane.addMouseMotionListener(contentPane);
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.setUndecorated(true);
        this.setAlwaysOnTop(true);
        // macOS Tahoe(26) Liquid Glass 재질이 반투명 창에 블러를 입히므로
        // 픽셀 단위 투명(perpixel translucent)으로 만들어 일반 알파 합성(블러 없는 투명)을 강제한다
        this.setBackground(new Color(0, 0, 0, 0));
        contentPane.setOpaque(false);

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
