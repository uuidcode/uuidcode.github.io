package screen;

import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;
import javax.swing.JPanel;

import com.github.uuidcode.util.CoreUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

import static java.awt.Color.black;

@Slf4j
@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
public class ImageViewPanel extends JPanel
    implements MouseListener, MouseMotionListener {

    private final File imageFile;
    private Point stratPoint;
    private Point endPoint;

    public ImageViewPanel(File imageFile) {
        this.imageFile = imageFile;
        this.addMouseListener(this);
        this.addMouseMotionListener(this);

    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);

        BufferedImage bufferedImage = Store.get().getBufferedImage();

        if (bufferedImage == null) {
            try {
                Store.get().setBufferedImage(this.imageFile);
                bufferedImage = Store.get().getBufferedImage();

                g.drawImage(bufferedImage, 0, 0, bufferedImage.getWidth(),
                    bufferedImage.getHeight(), this);

                g.setColor(black);
                g.drawRect(0, 0, bufferedImage.getWidth() - 1,
                    bufferedImage.getHeight() - 1);

                Graphics2D g2 = bufferedImage.createGraphics();
                g2.setColor(black);
                g2.drawRect(0, 0, bufferedImage.getWidth() - 1,
                    bufferedImage.getHeight() - 1);

                Store.get().setBufferedImage(bufferedImage, this.imageFile, false);
            } catch (Throwable ignored) {
            }
        } else {
            g.drawImage(bufferedImage, 0, 0, bufferedImage.getWidth(),
                bufferedImage.getHeight(), this);
        }

        if (this.stratPoint != null) {
            Store.get().getMode().draw(g, this.stratPoint, this.endPoint);
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {

    }

    @Override
    public void mousePressed(MouseEvent e) {
        BufferedImage bufferedImage = Store.get().getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        int width = bufferedImage.getWidth();
        int height = bufferedImage.getHeight();
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
        BufferedImage bufferedImage = Store.get().getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        Graphics g = bufferedImage.getGraphics();
        Store.get().getMode().draw(g, bufferedImage, this.stratPoint, this.endPoint);
        Store.get().setBufferedImage(bufferedImage, this.imageFile, true);
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
        BufferedImage bufferedImage = Store.get().getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        int width = bufferedImage.getWidth();
        int height = bufferedImage.getHeight();
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

    public void saveImage() {
        this.saveImage(this.imageFile);
    }

    public void saveImage(File selectedFile) {
        try {
            BufferedImage bufferedImage = Store.get().getBufferedImage();
            ImageIO.write(bufferedImage, "png", selectedFile);
        } catch (Throwable ignored) {
        }
    }

    public void undo() {
        BufferedImage previous = Store.get().getPrevious();

        if (previous == null) {
            return;
        }

        this.saveImage();
        this.repaint();

        if (log.isDebugEnabled()) {
            log.debug(">>> undo store: {}", CoreUtil.toJson(Store.get()));
        }
    }

    public void redo() {
        BufferedImage next = Store.get().getPrevious();

        if (next == null) {
            return;
        }

        this.saveImage();
        this.repaint();

        if (log.isDebugEnabled()) {
            log.debug(">>> undo store: {}", CoreUtil.toJson(Store.get()));
        }
    }

    public void copy(File imageFile) {
        try {
            String command = "osascript -e 'set the clipboard to " +
                "(read (POSIX file \"" + imageFile + "\") as  {«class PNGf»})'";

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.command("sh", "-c", command);
            processBuilder.start();
        } catch (Throwable t) {
            throw new RuntimeException(t);
        }
    }
}
