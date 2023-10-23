package screen;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.swing.JPanel;

public class ScreenShotPanel extends JPanel
    implements MouseListener, MouseMotionListener {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);
    private Point stratPoint;
    private Point endPoint;
    private final ButtonTabPanel tabbedPane;
    private final ScreenShotFrame screenShotFrame;
    private final ImageFrame imageFrame;

    public ScreenShotPanel(ImageFrame imageFrame, ScreenShotFrame screenShotFrame) {
        this.tabbedPane = imageFrame.getTabbedPane();
        this.imageFrame = imageFrame;
        this.screenShotFrame = screenShotFrame;
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
            screenShotFrame.setBackground(new Color(0, 0, 0, 0));

            rectangle.width++;
            rectangle.height++;
            screenShotFrame.getContentPane().repaint();

            new Thread(() -> {
                try {
                    Thread.sleep(100);

                    BufferedImage image = new Robot().createScreenCapture(rectangle);
                    String fileName = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
                    File file = Util.getImageFile(fileName);
                    ImageIO.write(image, "png", file);

                    tabbedPane.addTab(fileName);
                    imageFrame.setVisible(true);
                    screenShotFrame.setBackground(BACKGROUND_COLOR);
                    screenShotFrame.setVisible(false);
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
}
