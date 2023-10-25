package screen;

import java.awt.Color;
import java.awt.GraphicsDevice;

import javax.swing.JFrame;

public class ScreenShotFrame extends JFrame {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);

    public ScreenShotFrame(GraphicsDevice graphicsDevice, ImageFrame imageFrame) {
        super("ScreenShotFrame");
        ScreenShotPanel contentPane = new ScreenShotPanel(graphicsDevice, imageFrame, this);
        contentPane.setBackground(new Color(0, 0, 0, 100));
        contentPane.addMouseListener(contentPane);
        contentPane.addMouseMotionListener(contentPane);
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.setUndecorated(true);
        this.setAlwaysOnTop(true);

        int x = graphicsDevice.getDefaultConfiguration().getBounds().x;
        int y = graphicsDevice.getDefaultConfiguration().getBounds().y;
        this.setLocation(x, y);

        int width = graphicsDevice.getDisplayMode().getWidth();
        int height = graphicsDevice.getDisplayMode().getHeight();
        this.setSize(width, height);
        this.setContentPane(contentPane);
        this.setBackground(BACKGROUND_COLOR);
    }
}
