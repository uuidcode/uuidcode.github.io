package screen;

import java.awt.BasicStroke;
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
import static screen.ShapeType.CROP;
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
    private BufferedImage pastePreviewImage;
    private Point pastePreviewPosition;
    private String textPreview;
    private Point textPreviewPosition;
    private boolean selectCopyMode;
    private Point selectCopyStart;
    private Point selectCopyEnd;

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

        if (this.stratPoint != null && this.endPoint != null) {
            if (this.shapeType == CROP) {
                Graphics2D g2 = (Graphics2D) g;
                Rectangle2D rect = getRectangle2D(this.stratPoint, this.endPoint);
                java.awt.Composite originalComposite = g2.getComposite();
                g2.setComposite(java.awt.AlphaComposite.getInstance(java.awt.AlphaComposite.SRC_OVER, 0.3f));
                g2.setColor(java.awt.Color.BLUE);
                g2.fillRect((int) rect.getX(), (int) rect.getY(), (int) rect.getWidth(), (int) rect.getHeight());
                g2.setComposite(originalComposite);
                g2.setColor(java.awt.Color.BLUE);
                g2.setStroke(new BasicStroke(2));
                g2.drawRect((int) rect.getX(), (int) rect.getY(), (int) rect.getWidth(), (int) rect.getHeight());
            } else {
                this.shapeType.draw(bufferedImage, g, this.fillType, this.stratPoint, this.endPoint, this.colorType);
            }
        }

        if (this.pastePreviewImage != null && this.pastePreviewPosition != null) {
            Graphics2D g2 = (Graphics2D) g;
            java.awt.Composite originalComposite = g2.getComposite();
            g2.setComposite(java.awt.AlphaComposite.getInstance(java.awt.AlphaComposite.SRC_OVER, 0.5f));
            g2.drawImage(this.pastePreviewImage, this.pastePreviewPosition.x, this.pastePreviewPosition.y,
                this.pastePreviewImage.getWidth(), this.pastePreviewImage.getHeight(), this);
            g2.setComposite(originalComposite);

            g2.setColor(java.awt.Color.RED);
            g2.setStroke(new BasicStroke(2, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new float[]{6}, 0));
            g2.drawRect(this.pastePreviewPosition.x, this.pastePreviewPosition.y,
                this.pastePreviewImage.getWidth() - 1, this.pastePreviewImage.getHeight() - 1);
        }

        if (this.textPreview != null && this.textPreviewPosition != null) {
            Graphics2D g2 = (Graphics2D) g;
            java.awt.Composite originalComposite = g2.getComposite();
            g2.setComposite(java.awt.AlphaComposite.getInstance(java.awt.AlphaComposite.SRC_OVER, 0.5f));
            Util.drawText(g2, this.textPreviewPosition, this.colorType, this.textPreview);
            g2.setComposite(originalComposite);
        }

        if (this.selectCopyMode && this.selectCopyStart != null && this.selectCopyEnd != null) {
            Graphics2D g2 = (Graphics2D) g;
            Rectangle2D rect = getRectangle2D(this.selectCopyStart, this.selectCopyEnd);
            java.awt.Composite originalComposite = g2.getComposite();
            g2.setComposite(java.awt.AlphaComposite.getInstance(java.awt.AlphaComposite.SRC_OVER, 0.3f));
            g2.setColor(java.awt.Color.BLUE);
            g2.fillRect((int) rect.getX(), (int) rect.getY(), (int) rect.getWidth(), (int) rect.getHeight());
            g2.setComposite(originalComposite);
            g2.setColor(java.awt.Color.BLUE);
            g2.setStroke(new BasicStroke(2));
            g2.drawRect((int) rect.getX(), (int) rect.getY(), (int) rect.getWidth(), (int) rect.getHeight());
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (this.textPreview != null) {
            this.confirmText(e.getPoint());
            return;
        }

        if (this.pastePreviewImage != null) {
            this.confirmPaste();
            return;
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
        if (this.selectCopyMode) {
            this.selectCopyStart = e.getPoint();
            this.selectCopyEnd = null;
            return;
        }

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
        if (this.selectCopyMode && this.selectCopyStart != null && this.selectCopyEnd != null) {
            this.copySelectedArea();
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
        if (this.textPreview != null) {
            this.textPreviewPosition = e.getPoint();
            e.getComponent().repaint();
        }
        if (this.pastePreviewImage != null) {
            this.pastePreviewPosition = e.getPoint();
            this.updatePastePreferredSize();
            e.getComponent().repaint();
        }
    }

    @Override
    public void mouseExited(MouseEvent e) {
        if (this.textPreview != null) {
            this.textPreviewPosition = null;
            e.getComponent().repaint();
        }
        if (this.pastePreviewImage != null) {
            this.pastePreviewPosition = null;
            e.getComponent().repaint();
        }
    }

    @Override
    public void mouseDragged(MouseEvent e) {
        if (this.selectCopyMode) {
            this.selectCopyEnd = e.getPoint();
            e.getComponent().repaint();
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
        if (this.textPreview != null) {
            this.textPreviewPosition = e.getPoint();
            e.getComponent().repaint();
            return;
        }

        if (this.pastePreviewImage != null) {
            this.pastePreviewPosition = e.getPoint();
            this.updatePastePreferredSize();
            e.getComponent().repaint();
        }
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

    public void pasteFromClipboard() {
        try {
            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
            if (!clipboard.isDataFlavorAvailable(java.awt.datatransfer.DataFlavor.imageFlavor)) {
                return;
            }

            java.awt.Image clipImage = (java.awt.Image) clipboard.getData(java.awt.datatransfer.DataFlavor.imageFlavor);
            this.pastePreviewImage = toBufferedImage(clipImage);

            Point mouse = this.getMousePosition();
            this.pastePreviewPosition = mouse;
            if (mouse != null) {
                this.updatePastePreferredSize();
            }
            this.repaint();
        } catch (Exception ignored) {
        }
    }

    private void confirmPaste() {
        BufferedImage current = this.getBufferedImage();
        BufferedImage clipBuffered = this.pastePreviewImage;
        Point pos = this.pastePreviewPosition;
        this.pastePreviewImage = null;
        this.pastePreviewPosition = null;

        int newWidth = Math.max(current.getWidth(), pos.x + clipBuffered.getWidth());
        int newHeight = Math.max(current.getHeight(), pos.y + clipBuffered.getHeight());

        BufferedImage combined = new BufferedImage(newWidth, newHeight, TYPE_INT_ARGB);
        Graphics2D g = combined.createGraphics();
        g.setColor(java.awt.Color.WHITE);
        g.fillRect(0, 0, newWidth, newHeight);
        g.drawImage(current, 0, 0, null);
        g.drawImage(clipBuffered, pos.x, pos.y, null);
        g.dispose();

        this.addHistory(combined);
        this.save();
        this.init();
        this.repaint();
    }

    private void updatePastePreferredSize() {
        BufferedImage current = this.getBufferedImage();
        int newWidth = Math.max(current.getWidth(), this.pastePreviewPosition.x + this.pastePreviewImage.getWidth());
        int newHeight = Math.max(current.getHeight(), this.pastePreviewPosition.y + this.pastePreviewImage.getHeight());
        this.setPreferredSize(new Dimension(newWidth, newHeight));
        this.revalidate();
    }

    public void startTextMode(String text) {
        this.textPreview = text;
        Point mouse = this.getMousePosition();
        this.textPreviewPosition = mouse;
        this.repaint();
    }

    private void confirmText(Point point) {
        BufferedImage current = this.getBufferedImage();

        java.awt.Font font = new java.awt.Font(java.awt.Font.DIALOG, java.awt.Font.BOLD, 30);
        java.awt.FontMetrics metrics = this.getFontMetrics(font);
        int textWidth = metrics.stringWidth(this.textPreview);
        int textHeight = metrics.getHeight();
        int ascent = metrics.getAscent();
        int shadow = 3;

        int margin = 10;
        int requiredWidth = point.x + textWidth + 10 + shadow + shadow + margin;
        int requiredHeight = point.y + (textHeight - ascent) + 5 + shadow + shadow + margin;

        int newWidth = Math.max(current.getWidth(), requiredWidth);
        int newHeight = Math.max(current.getHeight(), requiredHeight);

        BufferedImage bufferedImage;
        if (newWidth > current.getWidth() || newHeight > current.getHeight()) {
            bufferedImage = new BufferedImage(newWidth, newHeight, TYPE_INT_ARGB);
            Graphics2D bg = bufferedImage.createGraphics();
            bg.setColor(java.awt.Color.WHITE);
            bg.fillRect(0, 0, newWidth, newHeight);
            bg.drawImage(current, 0, 0, null);
            bg.dispose();
        } else {
            bufferedImage = deepCopy(current);
        }

        Graphics2D g2 = bufferedImage.createGraphics();
        Util.drawText(g2, point, this.colorType, this.textPreview);
        g2.dispose();

        this.textPreview = null;
        this.textPreviewPosition = null;

        this.addHistory(bufferedImage);
        this.save();
        this.init();
        this.repaint();
    }

    public void cancelText() {
        if (this.textPreview != null) {
            this.textPreview = null;
            this.textPreviewPosition = null;
            this.repaint();
        }
    }

    public void startSelectCopyMode() {
        this.selectCopyMode = true;
        this.selectCopyStart = null;
        this.selectCopyEnd = null;
    }

    private void copySelectedArea() {
        BufferedImage bufferedImage = this.getBufferedImage();
        Rectangle2D rect = getRectangle2D(this.selectCopyStart, this.selectCopyEnd);

        int x = Math.max(0, (int) rect.getX());
        int y = Math.max(0, (int) rect.getY());
        int w = Math.min((int) rect.getWidth(), bufferedImage.getWidth() - x);
        int h = Math.min((int) rect.getHeight(), bufferedImage.getHeight() - y);

        if (w > 0 && h > 0) {
            BufferedImage subImage = bufferedImage.getSubimage(x, y, w, h);
            BufferedImage copied = new BufferedImage(w, h, TYPE_INT_ARGB);
            Graphics2D g = copied.createGraphics();
            g.drawImage(subImage, 0, 0, null);
            g.dispose();

            Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
            ImageTransferable transferable = new ImageTransferable(copied);
            clipboard.setContents(transferable, null);
        }

        this.selectCopyMode = false;
        this.selectCopyStart = null;
        this.selectCopyEnd = null;
        this.repaint();
    }

    public void cancelPaste() {
        if (this.pastePreviewImage != null) {
            this.pastePreviewImage = null;
            this.init();
            this.repaint();
        }
    }

    private static BufferedImage toBufferedImage(java.awt.Image img) {
        if (img instanceof BufferedImage) {
            return (BufferedImage) img;
        }

        BufferedImage buffered = new BufferedImage(
            img.getWidth(null), img.getHeight(null), TYPE_INT_ARGB);
        Graphics2D g = buffered.createGraphics();
        g.drawImage(img, 0, 0, null);
        g.dispose();
        return buffered;
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
