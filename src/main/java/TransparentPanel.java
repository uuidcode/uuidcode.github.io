import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
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
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;
import javax.swing.JToolBar;

import static java.awt.event.KeyEvent.VK_ESCAPE;

public class TransparentPanel extends JPanel implements KeyListener, MouseListener, MouseMotionListener {
    Point stratPoint;
    Point endPoint;
    JTabbedPane tabbedPane;
    JFrame frame;
    JFrame imageFrame;

    public TransparentPanel(JTabbedPane tabbedPane, JFrame imageFrame, JFrame frame) {
        this.tabbedPane = tabbedPane;
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

            new Thread() {
                public void run() {
                    try {
                        Thread.sleep(100);

                        BufferedImage image = new Robot().createScreenCapture(rectangle);
                        String fileName = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
                        File file = new File("screenshot/" + fileName + ".png");
                        ImageIO.write(image, "png", file);

                        JPanel panel = new JPanel() {
                            public void paint(Graphics g) {
                                super.paint(g);

                                try {
                                    BufferedImage bufferedImage = ImageIO.read(file);
                                    g.drawImage(bufferedImage, 0, 0, bufferedImage.getWidth(),
                                        bufferedImage.getHeight(), this);
                                    g.setColor(Color.black);
                                    g.drawRect(0, 0, bufferedImage.getWidth() - 1,
                                        bufferedImage.getHeight() - 1);

                                    Graphics2D g2 = bufferedImage.createGraphics();
                                    g2.setColor(Color.black);
                                    g2.drawRect(0, 0, bufferedImage.getWidth() - 1,
                                        bufferedImage.getHeight() - 1);
                                    ImageIO.write(bufferedImage, "png", file);
                                } catch (Throwable ignored) {
                                }
                            }
                        };

                        tabbedPane.add(fileName, panel);
                        imageFrame.setVisible(true);
                        frame.setVisible(false);
                    } catch (Throwable t) {
                    }
                }
            }.start();

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
            JFrame imageFrame = new JFrame("Hello");
            JFrame frame = new JFrame("Hello");

            imageFrame.setDefaultCloseOperation(javax.swing.WindowConstants.HIDE_ON_CLOSE);
            imageFrame.setAlwaysOnTop(true);
            imageFrame.setType(javax.swing.JFrame.Type.NORMAL);
            imageFrame.getRootPane().putClientProperty("apple.awt.draggableWindowBackground", false);
            imageFrame.setLocation(0, 0); // 1620 780
            Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
            imageFrame.setSize(screenSize);

            JPanel panel = new JPanel(new BorderLayout());
            JTabbedPane tabbedPane = new JTabbedPane();
            panel.add(tabbedPane, BorderLayout.CENTER);
            JToolBar toolBar = new JToolBar("Still draggable");
            JButton captureButton = new JButton("캡쳐");
            captureButton.addActionListener(e -> {
                imageFrame.setVisible(false);
                frame.setVisible(true);
            });
            toolBar.add(captureButton);
            panel.add(toolBar, BorderLayout.NORTH);
            imageFrame.setContentPane(panel);
            imageFrame.setVisible(true);


            javax.swing.JFrame.setDefaultLookAndFeelDecorated(true);
            frame.setDefaultCloseOperation(javax.swing.WindowConstants.HIDE_ON_CLOSE);
            frame.setUndecorated(true);
            frame.setAlwaysOnTop(true);
            frame.setType(javax.swing.JFrame.Type.NORMAL);
            frame.getRootPane().putClientProperty("apple.awt.draggableWindowBackground", false);
            frame.setLocation(0, 0); // 1620 780
            frame.setSize(screenSize);

            TransparentPanel contentPane = new TransparentPanel(tabbedPane, imageFrame, frame);
            frame.addKeyListener(contentPane);
            contentPane.addMouseListener(contentPane);
            contentPane.addMouseMotionListener(contentPane);

            frame.setContentPane(contentPane);
            frame.setBackground(new Color(0, 0, 0, 100));
            frame.setVisible(false);
    }

}
