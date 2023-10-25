package screen;

import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;
import javax.swing.JPanel;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import static java.awt.Color.black;
import static java.awt.event.KeyEvent.VK_C;
import static java.awt.event.KeyEvent.VK_Z;

@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
public class ImageViewPanel extends JPanel
    implements MouseListener, MouseMotionListener, KeyListener {

    private final File imageFile;
    private Point stratPoint;
    private Point endPoint;
    private BufferedImage bufferedImage;
    private BufferedImage previousBufferedImage;

    public ImageViewPanel(File imageFile) {
        this.imageFile = imageFile;
        this.addMouseListener(this);
        this.addMouseMotionListener(this);

    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);

        if (bufferedImage == null) {
            try {
                this.bufferedImage = ImageIO.read(this.imageFile);
                g.drawImage(bufferedImage, 0, 0, bufferedImage.getWidth(),
                    bufferedImage.getHeight(), this);

                g.setColor(black);
                g.drawRect(0, 0, bufferedImage.getWidth() - 1,
                    bufferedImage.getHeight() - 1);

                Graphics2D g2 = bufferedImage.createGraphics();
                g2.setColor(black);
                g2.drawRect(0, 0, bufferedImage.getWidth() - 1,
                    bufferedImage.getHeight() - 1);

                this.save(this.imageFile);
            } catch (Throwable ignored) {
            }
        } else {
            g.drawImage(this.bufferedImage, 0, 0, bufferedImage.getWidth(),
                bufferedImage.getHeight(), this);
        }

        if (this.stratPoint != null) {
            Store.mode.draw(g, this.stratPoint, this.endPoint);
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {

    }

    @Override
    public void mousePressed(MouseEvent e) {
        int width = this.bufferedImage.getWidth();
        int height = this.bufferedImage.getHeight();
        Point point = e.getPoint();

        if (point.x < width && point.y < height) {
            this.stratPoint = point;
        } else {
            this.resetPoint();
        }
    }

    private void resetPoint() {
        this.stratPoint = null;
        this.endPoint = null;
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        Graphics g = this.bufferedImage.getGraphics();
        this.previousBufferedImage = this.bufferedImage;

        Store.mode.draw(g, this.bufferedImage, this.stratPoint, this.endPoint);

        try {
            ImageIO.write(bufferedImage, "png", this.imageFile);
        } catch (Throwable ignored) {
        }

        this.resetPoint();
    }

    @Override
    public void mouseEntered(MouseEvent e) {

    }

    @Override
    public void mouseExited(MouseEvent e) {

    }

    @Override
    public void mouseDragged(MouseEvent e) {
        int width = this.bufferedImage.getWidth();
        int height = this.bufferedImage.getHeight();
        Point point = e.getPoint();

        if (point.x < width && point.y < height) {
            this.endPoint = point;
            e.getComponent().repaint();
        } else {
            resetPoint();
        }
    }

    @Override
    public void mouseMoved(MouseEvent e) {

    }

    private void drawArrowLine(Graphics g, int x0, int y0, int x1,
                               int y1, int headLength, int headAngle) {
        double offs = headAngle * Math.PI / 180.0;
        double angle = Math.atan2(y0 - y1, x0 - x1);
        int[] xs = { x1 + (int) (headLength * Math.cos(angle + offs)), x1,
            x1 + (int) (headLength * Math.cos(angle - offs)) };
        int[] ys = { y1 + (int) (headLength * Math.sin(angle + offs)), y1,
            y1 + (int) (headLength * Math.sin(angle - offs)) };
        g.drawLine(x0, y0, x1, y1);
        g.drawPolyline(xs, ys, 3);
    }

    public void save(File selectedFile) {
        try {
            ImageIO.write(this.bufferedImage, "png", selectedFile);
        } catch (Throwable ignored) {
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {

    }

    @Override
    public void keyPressed(KeyEvent e) {

    }

    public void keyReleased(KeyEvent e) {
        if ((e.isControlDown() || e.isMetaDown()) && e.getKeyCode() == VK_Z) {
            this.bufferedImage = this.previousBufferedImage;
            this.save(imageFile);
            this.repaint();
            System.out.println("z");
        }

        if ((e.isControlDown() || e.isMetaDown()) && e.getKeyCode() == VK_C) {
            this.bufferedImage = this.previousBufferedImage;
            this.save(this.imageFile);
            this.repaint();
            this.copy(this.imageFile);
            System.out.println("c");
        }
    }

    public void copy(File imageFile) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder();
            String command = "osascript -e 'set the clipboard to " +
                "(read (POSIX file \"" + imageFile + "\") as  {«class PNGf»})'";
            processBuilder.command("sh", "-c", command);
            processBuilder.start();
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }
}
