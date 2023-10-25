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
    private BufferedImage nextBufferedImage;

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

        try {
            this.previousBufferedImage = ImageIO.read(this.imageFile);
        } catch (Throwable ignored) {
        }

        Store.mode.draw(g, this.bufferedImage, this.stratPoint, this.endPoint);
        this.save();
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

    public void save() {
        this.save(this.imageFile);
    }

    public void save(File selectedFile) {
        try {
            ImageIO.write(this.bufferedImage, "png", selectedFile);
        } catch (Throwable ignored) {
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
        System.out.println("getKeyCode:" + e.getKeyCode());
        System.out.println("isControlDown:" + e.isControlDown());
        System.out.println("isMetaDown:" + e.isMetaDown());
    }

    @Override
    public void keyPressed(KeyEvent e) {
        System.out.println("getKeyCode:" + e.getKeyCode());
        System.out.println("isControlDown:" + e.isControlDown());
        System.out.println("isMetaDown:" + e.isMetaDown());
    }

    public void keyReleased(KeyEvent e) {
    }

    public void undo() {
        this.nextBufferedImage = this.bufferedImage;
        this.bufferedImage = this.previousBufferedImage;
        this.save();
        this.bufferedImage = null;
        this.repaint();
    }

    public void redo() {
        if (this.nextBufferedImage == null) {
            return;
        }

        this.previousBufferedImage = this.bufferedImage;
        this.bufferedImage = this.nextBufferedImage;
        this.save();
        this.bufferedImage = null;
        this.repaint();
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
