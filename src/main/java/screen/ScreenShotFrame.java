package screen;

import java.awt.Color;
import java.awt.GraphicsDevice;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import javax.swing.JFrame;

import static java.awt.event.KeyEvent.VK_ESCAPE;

public class ScreenShotFrame extends JFrame implements KeyListener {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);

    public ScreenShotFrame(GraphicsDevice graphicsDevice, ImageFrame imageFrame) {
        super("ScreenShotFrame");
        ScreenShotPanel contentPane = new ScreenShotPanel(graphicsDevice, imageFrame, this);
        contentPane.setBackground(new Color(0, 0, 0, 100));
        this.addKeyListener(this);
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


        System.out.println("x:" + x);
        System.out.println("y:" + y);
        System.out.println("width:" + width);
        System.out.println("height:" + height);

        this.setContentPane(contentPane);
        this.setBackground(BACKGROUND_COLOR);
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == VK_ESCAPE) {
            System.exit(0);
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }
}
