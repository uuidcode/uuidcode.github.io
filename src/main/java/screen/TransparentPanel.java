package screen;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JPanel;

import static java.awt.event.KeyEvent.VK_ESCAPE;
import static javax.swing.JFrame.EXIT_ON_CLOSE;

public class TransparentPanel extends JPanel
    implements KeyListener, MouseListener, MouseMotionListener {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);
    Point stratPoint;
    Point endPoint;
    ButtonTabPanel tabbedPane;
    JFrame frame;
    JFrame imageFrame;

    public TransparentPanel(ImageFrame imageFrame, JFrame frame) {
        this.tabbedPane = imageFrame.getTabbedPane();
        this.imageFrame = imageFrame;
        this.frame = frame;
    }

    public void keyPressed(KeyEvent e) {
        printEventInfo("Key Pressed", e);

    }

    public void keyReleased(KeyEvent e) {
        // TODO Auto-generated method stub

    }

    public void keyTyped(KeyEvent e) {
        // TODO Auto-generated method stub
        printEventInfo("Key Typed", e);

    }

    private void printEventInfo(String str, KeyEvent e) {
        System.out.println(str);
        int code = e.getKeyCode();
        System.out.println("   Code: " + KeyEvent.getKeyText(code));
        System.out.println("   Char: " + e.getKeyChar());

        if (code == VK_ESCAPE) {
            System.exit(0);
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {

    }

    @Override
    public void mousePressed(MouseEvent e) {
        stratPoint = e.getPoint();
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        try {
            Rectangle rectangle = this.getRectangle();
            this.stratPoint = null;
            this.endPoint = null;
            frame.setBackground(new Color(0, 0, 0, 0));

            rectangle.width++;
            rectangle.height++;
            frame.getContentPane().repaint();

            new Thread(() -> {
                try {
                    Thread.sleep(100);

                    BufferedImage image = new Robot().createScreenCapture(rectangle);
                    String fileName = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
                    File file = Util.getImageFile(fileName);
                    ImageIO.write(image, "png", file);

                    tabbedPane.addTab(fileName);
                    imageFrame.setVisible(true);
                    frame.setBackground(BACKGROUND_COLOR);
                    frame.setVisible(false);
                } catch (Throwable ignored) {
                }
            }).start();
        } catch (Throwable ignored) {
        }
    }

    @Override
    public void mouseEntered(MouseEvent e) {

    }

    @Override
    public void mouseExited(MouseEvent e) {

    }

    @Override
    public void mouseDragged(MouseEvent e) {
        endPoint = e.getPoint();
        e.getComponent().repaint();
    }

    @Override
    public void mouseMoved(MouseEvent e) {

    }

    public Rectangle getRectangle() {
        int x = Math.min(stratPoint.x, endPoint.x);
        int y = Math.min(stratPoint.y, endPoint.y);
        int width = Math.abs(stratPoint.x - endPoint.x);
        int height = Math.abs(stratPoint.y - endPoint.y);

        return new Rectangle(x, y, width, height);
    }

    public void paint(Graphics g) {
        super.paint(g);

        if (stratPoint != null) {
            Rectangle rectangle = this.getRectangle();
            g.setColor(new Color(255, 255, 255, 100));
            g.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Hello");
        ImageFrame imageFrame = new ImageFrame(frame);

        imageFrame.setDefaultCloseOperation(EXIT_ON_CLOSE);
        imageFrame.setLocation(0, 0);
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        imageFrame.setSize(screenSize);
        imageFrame.setVisible(true);

        frame.setDefaultCloseOperation(EXIT_ON_CLOSE);
        frame.setUndecorated(true);
        frame.setAlwaysOnTop(true);
        frame.setLocation(0, 0);
        frame.setSize(screenSize);

        TransparentPanel contentPane = new TransparentPanel(imageFrame, frame);
        contentPane.setBackground(new Color(0, 0, 0, 100));
        frame.addKeyListener(contentPane);
        contentPane.addMouseListener(contentPane);
        contentPane.addMouseMotionListener(contentPane);

        frame.setContentPane(contentPane);
        frame.setBackground(BACKGROUND_COLOR);
        frame.setVisible(false);
    }
}
