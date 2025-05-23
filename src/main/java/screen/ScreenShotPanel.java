package screen;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.GraphicsDevice;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.PointerInfo;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JPanel;

import static java.awt.Color.BLACK;
import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;

public class ScreenShotPanel extends JPanel
    implements MouseListener, MouseMotionListener {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);

    private final GraphicsDevice graphicsDevice;
    private Point stratPoint;
    private Point endPoint;
    private final ImageTabPanel tabbedPane;
    private final ScreenShotFrame screenShotFrame;
    private final ImageFrame imageFrame;
    private JPanel controlPanel = null;
    public static Rectangle lastRectangle = null;

    public ScreenShotPanel(GraphicsDevice graphicsDevice,
                           ImageFrame imageFrame,
                           ScreenShotFrame screenShotFrame) {
        this.graphicsDevice = graphicsDevice;
        this.tabbedPane = imageFrame.getTabbedPane();
        this.imageFrame = imageFrame;
        this.screenShotFrame = screenShotFrame;
        this.setLayout(null);

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            if (ke.getID() == KeyEvent.KEY_RELEASED && ke.getKeyCode() == KeyEvent.VK_ESCAPE) {
                imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
                this.imageFrame.setVisible(true);
            }

            return false;
        });
    }

    private JPanel createControlPanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.X_AXIS));
        panel.setBackground(new Color(0, 0, 0, 0));

        JButton shotAllButton = new JButton("shot all");
        shotAllButton.addActionListener(e -> this.shot(null, true));
        panel.add(shotAllButton);

        JButton shotButton = new JButton("shot");
        shotButton.addActionListener(e -> this.shot(null, false));
        panel.add(shotButton);

        JButton delayShotButton = new JButton("delay shot");

        delayShotButton.addActionListener(e -> {
            imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
            imageFrame.setVisible(true);
            this.shot(5, false);
        });

        panel.add(delayShotButton);

        JButton delayShotAllButton = new JButton("delay shot all");

        delayShotAllButton.addActionListener(e -> {
            imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
            imageFrame.setVisible(false);
            this.shot(5, true);
        });

        panel.add(delayShotAllButton);

        JButton cancelButton = new JButton("cancel");
        cancelButton.addActionListener(e -> {
            controlPanel.setVisible(false);
            stratPoint = null;
            endPoint = null;
            imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
            imageFrame.setVisible(true);
        });
        panel.add(cancelButton);

        return panel;
    }

    private void shot(Integer second, boolean isAll) {
        Rectangle rectangle = Util.getRectangle(this.stratPoint, this.endPoint);
        stratPoint = null;
        endPoint = null;
        screenShotFrame.setBackground(new Color(0, 0, 0, 0));

        rectangle.width++;
        rectangle.height++;
        controlPanel.setVisible(false);
        screenShotFrame.getContentPane().repaint();
        imageFrame.setVisible(false);

        new Thread(() -> {
            try {
                PointerInfo pointerInfo = MouseInfo.getPointerInfo();
                Point mousePoint = pointerInfo.getLocation();
                int x = (int) mousePoint.getX();
                int y = (int) mousePoint.getY();

                Robot robot = new Robot();

                Thread.sleep(100);

                if (second != null) {
                    Thread.sleep(second * 1000);
                }

                Rectangle display = graphicsDevice.getDefaultConfiguration().getBounds();
                rectangle.x += display.x;
                rectangle.y += display.y;

                lastRectangle = rectangle;

                if (isAll) {
                    capture(robot, display, 0, 0, this.tabbedPane);
                } else {
                    capture(robot, rectangle, x, y, this.tabbedPane);
                }

                imageFrame.setVisible(true);
                screenShotFrame.setBackground(BACKGROUND_COLOR);
                imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
            } catch (Throwable t) {
                throw new RuntimeException(t);
            }
        }).start();
    }

    public static void capture(Robot robot, Rectangle rectangle, int x, int y, ImageTabPanel tabbedPane) throws IOException {
        BufferedImage image = robot.createScreenCapture(rectangle);
        robot.mouseMove(x, y);

        if (ImageFrame.borderCheckbox.isSelected()) {
            Graphics g = image.getGraphics();
            g.setColor(BLACK);
            g.drawRect(0, 0, (int) (rectangle.getWidth() - 1), (int) (rectangle.getHeight() - 1));
        }

        String fileName = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
        File file = Util.getImageFile(fileName);
        ImageIO.write(image, "png", file);

        tabbedPane.addTab(fileName);
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
        stratPoint = e.getPoint();

        if (this.controlPanel != null) {
            this.controlPanel.setVisible(false);
        }
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        try {
            Rectangle rectangle = this.getRectangle();

            if (this.controlPanel == null) {
                this.controlPanel = this.createControlPanel();
                this.add(this.controlPanel);
                this.revalidate();
                this.repaint();
            }

            this.controlPanel.setVisible(true);
            Dimension dimension = controlPanel.getPreferredSize();

            this.controlPanel.setBounds(rectangle.x + (int) ((rectangle.getWidth() - dimension.getWidth()) / 2),
                rectangle.y + (int) ((rectangle.getHeight()  - dimension.getHeight()) / 2),
                (int) dimension.getWidth(),
                (int) dimension.getHeight());
        } catch (Throwable throwable) {
            throw new RuntimeException(throwable);
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
        return Util.getRectangle(this.stratPoint, this.endPoint);
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
