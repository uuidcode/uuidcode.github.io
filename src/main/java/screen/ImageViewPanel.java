package screen;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.JPanel;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.SneakyThrows;
import lombok.experimental.Accessors;

import static java.awt.Color.BLACK;
import static java.awt.Color.black;
import static java.awt.image.BufferedImage.TYPE_INT_ARGB;
import static java.lang.Math.min;
import static screen.ShapeType.A;
import static screen.ShapeType.B;
import static screen.ShapeType.C;
import static screen.ShapeType.CROP;
import static screen.ShapeType.D;
import static screen.ShapeType.E;
import static screen.ShapeType.F;
import static screen.Util.deepCopy;
import static screen.Util.getRectangle2D;

@Data
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
public class ImageViewPanel extends JPanel
    implements MouseListener, MouseMotionListener {

    private ImagePanel imagePanel;
    private final File imageFile;
    private Point stratPoint;
    private Point endPoint;
    private List<BufferedImage> bufferedImageHistoryList = new ArrayList<>();
    private int imageHistoryIndex = 0;
    private ShapeType shapeType = ShapeType.FILL_ARROW;
    private FillType fillType = FillType.OPAQUE;
    private ColorType colorType = ColorType.BLUE;

    public ImageViewPanel(ImagePanel imagePanel, File imageFile) {
        this.imagePanel = imagePanel;
        this.imageFile = imageFile;
        this.init();
        this.addMouseListener(this);
        this.addMouseMotionListener(this);
    }

    private void init() {
        BufferedImage bufferedImage = this.getBufferedImage();
        this.setPreferredSize(new Dimension(bufferedImage.getWidth(), bufferedImage.getHeight()));
        this.imagePanel.init();
    }

    public BufferedImage getBufferedImage() {
        if (this.bufferedImageHistoryList.isEmpty()) {
            try {
                BufferedImage bufferedImage = ImageIO.read(this.imageFile);
                this.bufferedImageHistoryList.add(bufferedImage);
                return bufferedImage;
            } catch (Throwable t) {
                throw new RuntimeException(t);
            }
        }

        return this.bufferedImageHistoryList.get(this.imageHistoryIndex);
    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);

        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            try {
                bufferedImage = ImageIO.read(this.imageFile);
                this.bufferedImageHistoryList.add(bufferedImage);

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
            } catch (Throwable t) {
                throw new RuntimeException(t);
            }
        } else {
            g.drawImage(bufferedImage, 0, 0, bufferedImage.getWidth(),
                bufferedImage.getHeight(), this);
        }

        if (this.stratPoint != null) {
            this.shapeType.draw(bufferedImage, g, this.fillType, this.stratPoint, this.endPoint, this.colorType);
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (!this.isAlphabet()) {
            return;
        }

        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        bufferedImage = deepCopy(bufferedImage);
        Graphics g = bufferedImage.getGraphics();

        this.shapeType.draw(g, this.fillType, bufferedImage, e.getPoint(), null, this.colorType);
        this.addHistory(bufferedImage);
        this.save();
        this.resetPoint();
        this.repaint();
    }

    private boolean isAlphabet() {
        return this.shapeType == A
            || this.shapeType == B
            || this.shapeType == C
            || this.shapeType == D
            || this.shapeType == E
            || this.shapeType == F;
    }

    @Override
    public void mousePressed(MouseEvent e) {
        BufferedImage bufferedImage = this.getBufferedImage();

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
        if (this.isAlphabet()) {
            return;
        }

        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        bufferedImage = deepCopy(bufferedImage);

        if (this.stratPoint != null && this.endPoint != null) {
            if (this.shapeType == CROP) {
                bufferedImage = this.crop(bufferedImage);
            } else {
                Graphics g = bufferedImage.getGraphics();
                this.shapeType.draw(g, this.fillType, bufferedImage, this.stratPoint, this.endPoint, this.colorType);
            }

            this.addHistory(bufferedImage);
            this.init();
        }

        this.save();
        this.resetPoint();
        this.repaint();
    }

    private BufferedImage crop(BufferedImage bufferedImage) {
        Rectangle2D rect = getRectangle2D(this.stratPoint, this.endPoint);

        BufferedImage cropImage = bufferedImage.getSubimage((int) rect.getX(), (int) rect.getY(),
            (int) rect.getWidth(), (int) rect.getHeight());

        bufferedImage = new BufferedImage(cropImage.getWidth(),
            cropImage.getHeight(), TYPE_INT_ARGB);

        this.setPreferredSize(new Dimension(bufferedImage.getWidth(), bufferedImage.getHeight()));
        Graphics g = bufferedImage.getGraphics();
        g.drawImage(cropImage, 0, 0, null);
        g.setColor(BLACK);
        g.drawRect(0, 0, cropImage.getWidth() - 1, cropImage.getHeight() - 1);

        return bufferedImage;
    }

    public void addHistory(BufferedImage bufferedImage) {
        if (this.imageHistoryIndex < this.bufferedImageHistoryList.size() - 1) {
            this.bufferedImageHistoryList = this.bufferedImageHistoryList
                .subList(0, this.imageHistoryIndex + 1);
            this.imageHistoryIndex = this.bufferedImageHistoryList.size() - 1;
        }

        this.bufferedImageHistoryList.add(bufferedImage);
        this.imageHistoryIndex++;
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void mouseDragged(MouseEvent e) {
        if (this.isAlphabet()) {
            return;
        }

        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        int width = bufferedImage.getWidth();
        int height = bufferedImage.getHeight();
        Point point = e.getPoint();

        this.endPoint = new Point(min(point.x, width), min(point.y, height));
        e.getComponent().repaint();
    }

    @Override
    public void mouseMoved(MouseEvent e) {
    }

    public void save() {
        this.save(this.imageFile);
    }

    public void save(File selectedFile) {
        BufferedImage bufferedImage = this.getBufferedImage();
        this.save(selectedFile, bufferedImage);
    }

    public void save(File selectedFile, BufferedImage bufferedImage) {
        if (bufferedImage == null) {
            return;
        }

        try {
            ImageIO.write(bufferedImage, "png", selectedFile);
        } catch (Throwable ignored) {
        }
    }

    public void undo() {
        if (this.imageHistoryIndex <= 0) {
            return;
        }

        this.imageHistoryIndex--;
        this.save();
        this.init();
        this.repaint();
    }

    public void redo() {
        if (this.imageHistoryIndex >= this.bufferedImageHistoryList.size() - 1) {
            return;
        }

        this.imageHistoryIndex++;
        this.save();
        this.init();
        this.repaint();
    }

    @SneakyThrows
    public static void copy(File imageFile) {
        String os = System.getProperty("os.name").toLowerCase();

        if (os.contains("win")) {
            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
            BufferedImage image = ImageIO.read(imageFile);
            ImageTransferable transferable = new ImageTransferable(image);
            clipboard.setContents(transferable, null);
        } else if (os.contains("mac")) {
            String command = "osascript -e 'set the clipboard to " +
                "(read (POSIX file \"" + imageFile + "\") as  {«class PNGf»})'";

            ProcessBuilder processBuilder = new ProcessBuilder();
            processBuilder.command("sh", "-c", command);
            processBuilder.start();
        }
    }

    public void clear() {
        BufferedImage bufferedImage = this.bufferedImageHistoryList.get(0);
        this.save(this.imageFile, bufferedImage);
        this.bufferedImageHistoryList.clear();
        this.imageHistoryIndex = 0;
        this.revalidate();
        this.repaint();
    }
}
