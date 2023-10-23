package screen;

import java.awt.Color;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import javax.swing.JFrame;

import static java.awt.Toolkit.getDefaultToolkit;
import static java.awt.event.KeyEvent.VK_ESCAPE;

public class ScreenShotFrame extends JFrame implements KeyListener {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);

    public ScreenShotFrame(String title, ImageFrame imageFrame) {
        super(title);
        ScreenShotPanel contentPane = new ScreenShotPanel(imageFrame, this);
        contentPane.setBackground(new Color(0, 0, 0, 100));
        this.addKeyListener(this);
        contentPane.addMouseListener(contentPane);
        contentPane.addMouseMotionListener(contentPane);
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.setUndecorated(true);
        this.setAlwaysOnTop(true);
        this.setLocation(0, 0);
        this.setSize(getDefaultToolkit().getScreenSize());
        this.setContentPane(contentPane);
        this.setBackground(BACKGROUND_COLOR);
        this.setVisible(false);
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
