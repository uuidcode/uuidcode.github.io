package screen;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.JPanel;
import javax.swing.JViewport;
import javax.swing.Scrollable;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;

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
    implements MouseListener, MouseMotionListener, Scrollable {

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

    private List<DrawObject> objectList = new ArrayList<>();
    private DrawObject selectedObject;
    private Point dragStart;
    private boolean dragging;
    private BufferedImage baseImage;
    private List<MeasurementOverlay> measurementOverlays = new ArrayList<>();
    private List<Rectangle> ocrOverlays = new ArrayList<>();
    private Rectangle selectedOcrOverlay;
    private Rectangle cropBounds;
    private CropHandle activeCropHandle = CropHandle.NONE;
    private Rectangle applyCropButtonBounds;

    private static final int CROP_HANDLE_SIZE = 12;
    private static final int CROP_MIN_SIZE = 20;

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
        if (this.isCropMode()) {
            this.initializeCropBounds();
        }
        this.imagePanel.init();
    }

    public void setShapeType(ShapeType shapeType) {
        this.shapeType = shapeType;
        this.resetPoint();
        if (shapeType == CROP) {
            this.initializeCropBounds();
        } else {
            this.clearCropState();
        }
        this.repaint();
    }

    private Point getImageOffset(Dimension imageSize) {
        int x = Math.max(0, (this.getWidth() - imageSize.width) / 2);
        int y = Math.max(0, (this.getHeight() - imageSize.height) / 2);
        return new Point(x, y);
    }

    private Point toImagePoint(Point point) {
        Dimension imageSize = this.getCurrentImageSize();
        Point offset = this.getImageOffset(imageSize);
        return new Point(point.x - offset.x, point.y - offset.y);
    }

    private Dimension getCurrentImageSize() {
        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            return new Dimension(0, 0);
        }

        return new Dimension(bufferedImage.getWidth(), bufferedImage.getHeight());
    }

    private Point toClampedImagePoint(Point point) {
        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            return point;
        }

        Point imagePoint = this.toImagePoint(point);
        int maxX = Math.max(0, bufferedImage.getWidth() - 1);
        int maxY = Math.max(0, bufferedImage.getHeight() - 1);
        int x = Math.max(0, Math.min(imagePoint.x, maxX));
        int y = Math.max(0, Math.min(imagePoint.y, maxY));
        return new Point(x, y);
    }

    private boolean isInsideImage(Point point, BufferedImage bufferedImage) {
        return point.x >= 0 && point.y >= 0
            && point.x < bufferedImage.getWidth()
            && point.y < bufferedImage.getHeight();
    }

    private boolean isCropMode() {
        return this.shapeType == CROP;
    }

    private BufferedImage getCropSourceImage() {
        return this.objectList.isEmpty() ? this.getBufferedImage() : buildComposite();
    }

    private void initializeCropBounds() {
        BufferedImage bufferedImage = this.getCropSourceImage();

        if (bufferedImage == null) {
            return;
        }

        this.cropBounds = new Rectangle(0, 0, bufferedImage.getWidth(), bufferedImage.getHeight());
        this.activeCropHandle = CropHandle.NONE;
    }

    private void clearCropState() {
        this.cropBounds = null;
        this.activeCropHandle = CropHandle.NONE;
        this.applyCropButtonBounds = null;
    }

    private Point toCropEdgePoint(Point point) {
        BufferedImage bufferedImage = this.getCropSourceImage();

        if (bufferedImage == null) {
            return point;
        }

        Point imagePoint = this.toImagePoint(point);
        int x = Math.max(0, Math.min(imagePoint.x, bufferedImage.getWidth()));
        int y = Math.max(0, Math.min(imagePoint.y, bufferedImage.getHeight()));
        return new Point(x, y);
    }

    private Rectangle getCropHandleBounds(CropHandle handle, Point imageOffset) {
        if (this.cropBounds == null) {
            return new Rectangle();
        }

        int x = 0;
        int y = 0;

        switch (handle) {
            case TOP:
                x = imageOffset.x + this.cropBounds.x + this.cropBounds.width / 2 - CROP_HANDLE_SIZE / 2;
                y = imageOffset.y + this.cropBounds.y - CROP_HANDLE_SIZE / 2;
                break;
            case RIGHT:
                x = imageOffset.x + this.cropBounds.x + this.cropBounds.width - CROP_HANDLE_SIZE / 2;
                y = imageOffset.y + this.cropBounds.y + this.cropBounds.height / 2 - CROP_HANDLE_SIZE / 2;
                break;
            case BOTTOM:
                x = imageOffset.x + this.cropBounds.x + this.cropBounds.width / 2 - CROP_HANDLE_SIZE / 2;
                y = imageOffset.y + this.cropBounds.y + this.cropBounds.height - CROP_HANDLE_SIZE / 2;
                break;
            case LEFT:
                x = imageOffset.x + this.cropBounds.x - CROP_HANDLE_SIZE / 2;
                y = imageOffset.y + this.cropBounds.y + this.cropBounds.height / 2 - CROP_HANDLE_SIZE / 2;
                break;
            default:
                break;
        }

        return new Rectangle(x, y, CROP_HANDLE_SIZE, CROP_HANDLE_SIZE);
    }

    private CropHandle findCropHandle(Point point) {
        if (!this.isCropMode() || this.cropBounds == null) {
            return CropHandle.NONE;
        }

        Point imageOffset = this.getImageOffset(this.getCurrentImageSize());

        for (CropHandle handle : CropHandle.values()) {
            if (handle == CropHandle.NONE) {
                continue;
            }

            if (this.getCropHandleBounds(handle, imageOffset).contains(point)) {
                return handle;
            }
        }

        return CropHandle.NONE;
    }

    private void updateCropBounds(Point point) {
        if (this.cropBounds == null || this.activeCropHandle == CropHandle.NONE) {
            return;
        }

        BufferedImage bufferedImage = this.getCropSourceImage();

        if (bufferedImage == null) {
            return;
        }

        Point cropPoint = this.toCropEdgePoint(point);
        Rectangle updated = new Rectangle(this.cropBounds);

        switch (this.activeCropHandle) {
            case TOP:
                int newTop = Math.max(0, Math.min(cropPoint.y, this.cropBounds.y + this.cropBounds.height - CROP_MIN_SIZE));
                updated.height = this.cropBounds.y + this.cropBounds.height - newTop;
                updated.y = newTop;
                break;
            case RIGHT:
                int newRight = Math.max(this.cropBounds.x + CROP_MIN_SIZE, Math.min(cropPoint.x, bufferedImage.getWidth()));
                updated.width = newRight - this.cropBounds.x;
                break;
            case BOTTOM:
                int newBottom = Math.max(this.cropBounds.y + CROP_MIN_SIZE, Math.min(cropPoint.y, bufferedImage.getHeight()));
                updated.height = newBottom - this.cropBounds.y;
                break;
            case LEFT:
                int newLeft = Math.max(0, Math.min(cropPoint.x, this.cropBounds.x + this.cropBounds.width - CROP_MIN_SIZE));
                updated.width = this.cropBounds.x + this.cropBounds.width - newLeft;
                updated.x = newLeft;
                break;
            default:
                break;
        }

        this.cropBounds = updated;
    }

    private void applyCropSelection() {
        if (this.cropBounds == null || this.cropBounds.width <= 0 || this.cropBounds.height <= 0) {
            return;
        }

        this.clearMeasurements();
        BufferedImage source = deepCopy(this.getCropSourceImage());
        BufferedImage bufferedImage = this.crop(source, this.cropBounds);
        this.objectList.clear();
        this.selectedObject = null;
        this.baseImage = deepCopy(bufferedImage);
        this.addHistory(bufferedImage);
        this.init();
        this.save();
        this.repaint();
    }

    public BufferedImage getBufferedImage() {
        if (this.bufferedImageHistoryList.isEmpty()) {
            try {
                BufferedImage bufferedImage = ImageIO.read(this.imageFile);
                this.bufferedImageHistoryList.add(bufferedImage);
                this.baseImage = deepCopy(bufferedImage);
                return bufferedImage;
            } catch (Throwable t) {
                throw new RuntimeException(t);
            }
        }

        return this.bufferedImageHistoryList.get(this.imageHistoryIndex);
    }

    private BufferedImage buildComposite() {
        BufferedImage base = expandedBase(this.baseImage);
        Graphics2D g2 = base.createGraphics();
        for (DrawObject obj : objectList) {
            if (obj == selectedObject && dragging) continue;
            obj.draw(g2);
        }
        if (selectedObject != null && dragging) {
            selectedObject.draw(g2);
        }
        g2.dispose();
        return base;
    }

    private BufferedImage expandedBase(BufferedImage original) {
        int w = original.getWidth();
        int h = original.getHeight();
        for (DrawObject obj : objectList) {
            Rectangle b = obj.getBounds();
            w = Math.max(w, b.x + b.width);
            h = Math.max(h, b.y + b.height);
        }
        if (w == original.getWidth() && h == original.getHeight()) {
            return deepCopy(original);
        }
        BufferedImage expanded = new BufferedImage(w, h, TYPE_INT_ARGB);
        Graphics2D g = expanded.createGraphics();
        g.setColor(java.awt.Color.WHITE);
        g.fillRect(0, 0, w, h);
        g.drawImage(original, 0, 0, null);
        g.dispose();
        return expanded;
    }

    private void drawCropOverlay(Graphics2D g2, BufferedImage image) {
        if (!this.isCropMode() || this.cropBounds == null) {
            return;
        }

        Rectangle cropRect = new Rectangle(this.cropBounds);
        cropRect = cropRect.intersection(new Rectangle(0, 0, image.getWidth(), image.getHeight()));

        g2.setColor(new Color(0, 0, 0, 110));
        g2.fillRect(0, 0, image.getWidth(), cropRect.y);
        g2.fillRect(0, cropRect.y, cropRect.x, cropRect.height);
        g2.fillRect(cropRect.x + cropRect.width, cropRect.y, image.getWidth() - cropRect.x - cropRect.width, cropRect.height);
        g2.fillRect(0, cropRect.y + cropRect.height, image.getWidth(), image.getHeight() - cropRect.y - cropRect.height);

        g2.setColor(new Color(255, 208, 0, 220));
        g2.setStroke(new BasicStroke(2f));
        g2.drawRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);

        String sizeLabel = "W: " + cropRect.width + "  H: " + cropRect.height;
        FontMetrics metrics = g2.getFontMetrics();
        int labelWidth = metrics.stringWidth(sizeLabel) + 24;
        g2.setColor(new Color(20, 20, 20, 200));
        g2.fillRoundRect(cropRect.x + 8, Math.max(8, cropRect.y - 28), labelWidth, 20, 10, 10);
        g2.setColor(Color.WHITE);
        g2.drawString(sizeLabel, cropRect.x + 16, Math.max(22, cropRect.y - 14));

        Point imageOffset = this.getImageOffset(new Dimension(image.getWidth(), image.getHeight()));
        for (CropHandle handle : CropHandle.values()) {
            if (handle == CropHandle.NONE) {
                continue;
            }

            Rectangle handleRect = this.getCropHandleBounds(handle, imageOffset);
            int drawX = handleRect.x - imageOffset.x;
            int drawY = handleRect.y - imageOffset.y;
            g2.setColor(Color.WHITE);
            g2.fillRect(drawX, drawY, handleRect.width, handleRect.height);
            g2.setColor(new Color(255, 208, 0));
            g2.drawRect(drawX, drawY, handleRect.width, handleRect.height);
        }
    }

    private void drawCropPreviewOverlay(Graphics2D g) {
        if (!this.isCropMode() || this.cropBounds == null) {
            this.applyCropButtonBounds = null;
            return;
        }

        if (this.cropBounds.width <= 0 || this.cropBounds.height <= 0) {
            return;
        }

        Rectangle visibleRect = this.getVisibleRect();
        int buttonWidth = 120;
        int buttonHeight = 30;
        int buttonX = visibleRect.x + visibleRect.width - buttonWidth - 24;
        int buttonY = visibleRect.y + 20;
        this.applyCropButtonBounds = new Rectangle(buttonX, buttonY, buttonWidth, buttonHeight);

        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setColor(new Color(255, 208, 0));
        g.fillRoundRect(buttonX, buttonY, buttonWidth, buttonHeight, 12, 12);
        g.setColor(new Color(40, 40, 40));
        g.drawRoundRect(buttonX, buttonY, buttonWidth, buttonHeight, 12, 12);

        FontMetrics metrics = g.getFontMetrics();
        String text = "Apply Crop";
        int textX = buttonX + (buttonWidth - metrics.stringWidth(text)) / 2;
        int textY = buttonY + (buttonHeight - metrics.getHeight()) / 2 + metrics.getAscent();
        g.drawString(text, textX, textY);
    }

    @Override
    public void paint(Graphics g) {
        super.paint(g);

        BufferedImage bufferedImage = this.getBufferedImage();
        BufferedImage displayImage = bufferedImage;

        if (bufferedImage != null && !objectList.isEmpty()) {
            displayImage = buildComposite();
        }

        if (displayImage == null) {
            return;
        }

        Graphics2D g2 = (Graphics2D) g.create();
        Point imageOffset = this.getImageOffset(new Dimension(displayImage.getWidth(), displayImage.getHeight()));
        g2.translate(imageOffset.x, imageOffset.y);

        if (bufferedImage == null) {
            try {
                bufferedImage = ImageIO.read(this.imageFile);
                this.bufferedImageHistoryList.add(bufferedImage);
                this.baseImage = deepCopy(bufferedImage);

                g2.drawImage(bufferedImage, 0, 0, bufferedImage.getWidth(),
                    bufferedImage.getHeight(), this);
                g2.setColor(black);
                g2.drawRect(0, 0, bufferedImage.getWidth() - 1,
                    bufferedImage.getHeight() - 1);
                Graphics2D imageGraphics = bufferedImage.createGraphics();
                imageGraphics.setColor(black);
                imageGraphics.drawRect(0, 0, bufferedImage.getWidth() - 1,
                    bufferedImage.getHeight() - 1);
                imageGraphics.dispose();

                this.save(this.imageFile);
            } catch (Throwable t) {
                throw new RuntimeException(t);
            }
        } else {
            g2.drawImage(displayImage, 0, 0, displayImage.getWidth(), displayImage.getHeight(), this);
        }

        if (selectedObject != null) {
            Rectangle bounds = selectedObject.getBounds();
            g2.setColor(java.awt.Color.RED);
            g2.setStroke(new BasicStroke(1, BasicStroke.CAP_BUTT, BasicStroke.JOIN_BEVEL, 0, new float[]{4}, 0));
            g2.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        }

        this.drawCropOverlay(g2, displayImage);

        if (this.stratPoint != null && this.endPoint != null) {
            if (this.shapeType == CROP) {
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
                this.shapeType.draw(bufferedImage, g2, this.fillType, this.stratPoint, this.endPoint, this.colorType);
            }
        }

        if (this.pastePreviewImage != null && this.pastePreviewPosition != null) {
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
            java.awt.Composite originalComposite = g2.getComposite();
            g2.setComposite(java.awt.AlphaComposite.getInstance(java.awt.AlphaComposite.SRC_OVER, 0.5f));
            Util.drawText(g2, this.textPreviewPosition, this.colorType, this.textPreview);
            g2.setComposite(originalComposite);
        }

        if (this.selectCopyMode && this.selectCopyStart != null && this.selectCopyEnd != null) {
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

        if (!this.measurementOverlays.isEmpty()) {
            this.drawMeasurementOverlays(g2, displayImage.getWidth());
        }

        this.drawOcrOverlays(g2);

        g2.dispose();

        Graphics2D overlayGraphics = (Graphics2D) g.create();
        this.drawCropPreviewOverlay(overlayGraphics);
        overlayGraphics.dispose();
    }

    private DrawObject findObjectAt(Point p) {
        for (int i = objectList.size() - 1; i >= 0; i--) {
            if (objectList.get(i).contains(p)) {
                return objectList.get(i);
            }
        }
        return null;
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (this.isCropMode()) {
            if (this.applyCropButtonBounds != null && this.applyCropButtonBounds.contains(e.getPoint())) {
                this.applyCropSelection();
            }
            return;
        }

        Point point = this.toImagePoint(e.getPoint());

        if (this.textPreview != null) {
            this.confirmText(this.toClampedImagePoint(e.getPoint()));
            return;
        }

        if (this.pastePreviewImage != null) {
            this.confirmPaste(this.toClampedImagePoint(e.getPoint()));
            return;
        }

        DrawObject clicked = findObjectAt(point);
        this.selectedObject = clicked;
        this.repaint();
    }

    @Override
    public void mousePressed(MouseEvent e) {
        if (this.isCropMode()) {
            this.selectedObject = null;
            if (this.applyCropButtonBounds != null && this.applyCropButtonBounds.contains(e.getPoint())) {
                return;
            }

            this.activeCropHandle = this.findCropHandle(e.getPoint());
            return;
        }

        Point point = this.toImagePoint(e.getPoint());
        DrawObject clicked = findObjectAt(point);
        if (clicked != null) {
            this.selectedObject = clicked;
            this.dragStart = point;
            this.dragging = true;
            this.setCursor(Cursor.getPredefinedCursor(Cursor.MOVE_CURSOR));
            this.repaint();
            return;
        }

        this.selectedObject = null;

        if (this.selectCopyMode) {
            this.selectCopyStart = this.toClampedImagePoint(e.getPoint());
            this.selectCopyEnd = null;
            return;
        }

        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        int width = bufferedImage.getWidth();
        int height = bufferedImage.getHeight();
        point = this.toImagePoint(e.getPoint());

        if (this.isInsideImage(point, bufferedImage)) {
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
        if (this.isCropMode()) {
            this.activeCropHandle = CropHandle.NONE;
            this.repaint();
            return;
        }

        if (this.dragging && this.selectedObject != null) {
            objectList.remove(this.selectedObject);
            objectList.add(this.selectedObject);

            this.dragging = false;
            this.dragStart = null;
            this.setCursor(Cursor.getDefaultCursor());
            this.clearMeasurements();
            updateHistoryFromObjects();
            this.save();
            this.repaint();
            return;
        }

        if (this.selectCopyMode && this.selectCopyStart != null && this.selectCopyEnd != null) {
            this.copySelectedArea();
            return;
        }

        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        if (this.stratPoint != null && this.endPoint != null) {
            this.clearMeasurements();
            if (this.shapeType == CROP) {
                bufferedImage = deepCopy(bufferedImage);
                bufferedImage = this.crop(bufferedImage);
                this.objectList.clear();
                this.selectedObject = null;
                this.baseImage = deepCopy(bufferedImage);
                this.addHistory(bufferedImage);
                this.init();
            } else {
                DrawObject.Type objType = DrawObject.fromShapeType(this.shapeType);
                if (objType != null) {
                    DrawObject obj = new DrawObject()
                        .setType(objType)
                        .setStartPoint(new Point(this.stratPoint))
                        .setEndPoint(new Point(this.endPoint))
                        .setFillType(this.fillType)
                        .setColorType(this.colorType);

                    this.objectList.add(obj);
                    updateHistoryFromObjects();
                } else {
                    bufferedImage = deepCopy(bufferedImage);
                    Graphics g = bufferedImage.getGraphics();
                    this.shapeType.draw(g, this.fillType, bufferedImage, this.stratPoint, this.endPoint, this.colorType);
                    this.baseImage = deepCopy(bufferedImage);
                    this.addHistory(bufferedImage);
                    this.init();
                }
            }

            this.save();
        }

        this.resetPoint();
        this.repaint();
    }

    private void updateHistoryFromObjects() {
        this.clearMeasurements();
        BufferedImage composite = buildComposite();
        this.addHistory(composite);
        this.init();
    }

    private BufferedImage crop(BufferedImage bufferedImage) {
        Rectangle2D rect = getRectangle2D(this.stratPoint, this.endPoint);
        return this.crop(bufferedImage, new Rectangle(
            (int) rect.getX(),
            (int) rect.getY(),
            (int) rect.getWidth(),
            (int) rect.getHeight()
        ));
    }

    private BufferedImage crop(BufferedImage bufferedImage, Rectangle rect) {
        BufferedImage cropImage = bufferedImage.getSubimage(rect.x, rect.y, rect.width, rect.height);

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
            this.textPreviewPosition = this.toClampedImagePoint(e.getPoint());
            e.getComponent().repaint();
        }
        if (this.pastePreviewImage != null) {
            this.pastePreviewPosition = this.toClampedImagePoint(e.getPoint());
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
        if (this.isCropMode()) {
            if (this.activeCropHandle != CropHandle.NONE) {
                this.updateCropBounds(e.getPoint());
                this.repaint();
            }
            return;
        }

        Point point = this.toImagePoint(e.getPoint());

        if (this.dragging && this.selectedObject != null && this.dragStart != null) {
            int dx = point.x - this.dragStart.x;
            int dy = point.y - this.dragStart.y;
            this.selectedObject.move(dx, dy);
            this.dragStart = point;
            this.repaint();
            return;
        }

        if (this.selectCopyMode) {
            this.selectCopyEnd = this.toClampedImagePoint(e.getPoint());
            e.getComponent().repaint();
            return;
        }

        BufferedImage bufferedImage = this.getBufferedImage();

        if (bufferedImage == null) {
            return;
        }

        int width = bufferedImage.getWidth();
        int height = bufferedImage.getHeight();
        int x = Math.max(0, min(point.x, width));
        int y = Math.max(0, min(point.y, height));
        this.endPoint = new Point(x, y);
        e.getComponent().repaint();
    }

    @Override
    public void mouseMoved(MouseEvent e) {
        if (this.isCropMode()) {
            if (this.applyCropButtonBounds != null && this.applyCropButtonBounds.contains(e.getPoint())) {
                this.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
                return;
            }

            CropHandle handle = this.findCropHandle(e.getPoint());
            this.setCursor(handle.getCursor());
            return;
        }

        DrawObject hover = findObjectAt(this.toImagePoint(e.getPoint()));
        if (hover != null) {
            this.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        } else {
            this.setCursor(Cursor.getDefaultCursor());
        }

        if (this.textPreview != null) {
            this.textPreviewPosition = this.toClampedImagePoint(e.getPoint());
            e.getComponent().repaint();
            return;
        }

        if (this.pastePreviewImage != null) {
            this.pastePreviewPosition = this.toClampedImagePoint(e.getPoint());
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

        this.clearMeasurements();
        if (!objectList.isEmpty()) {
            DrawObject last = objectList.remove(objectList.size() - 1);
            if (selectedObject == last) {
                selectedObject = null;
            }
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

        this.clearMeasurements();
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
            if (mouse != null) {
                mouse = this.toClampedImagePoint(mouse);
            }
            this.pastePreviewPosition = mouse;
            if (mouse != null) {
                this.updatePastePreferredSize();
            }
            this.repaint();
        } catch (Exception ignored) {
        }
    }

    private void confirmPaste(Point clickPoint) {
        this.clearMeasurements();
        BufferedImage clipBuffered = this.pastePreviewImage;
        Point pos = this.pastePreviewPosition != null ? this.pastePreviewPosition : clickPoint;
        this.pastePreviewImage = null;
        this.pastePreviewPosition = null;

        int newWidth = Math.max(this.baseImage.getWidth(), pos.x + clipBuffered.getWidth());
        int newHeight = Math.max(this.baseImage.getHeight(), pos.y + clipBuffered.getHeight());

        if (newWidth > this.baseImage.getWidth() || newHeight > this.baseImage.getHeight()) {
            BufferedImage expanded = new BufferedImage(newWidth, newHeight, TYPE_INT_ARGB);
            Graphics2D bg = expanded.createGraphics();
            bg.setColor(java.awt.Color.WHITE);
            bg.fillRect(0, 0, newWidth, newHeight);
            bg.drawImage(this.baseImage, 0, 0, null);
            bg.dispose();
            this.baseImage = expanded;
        }

        DrawObject obj = new DrawObject()
            .setType(DrawObject.Type.PASTE)
            .setStartPoint(new Point(pos))
            .setColorType(this.colorType)
            .setPasteImage(clipBuffered);

        this.objectList.add(obj);
        updateHistoryFromObjects();
        this.save();
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
        if (mouse != null) {
            mouse = this.toClampedImagePoint(mouse);
        }
        this.textPreviewPosition = mouse;
        this.repaint();
    }

    private void confirmText(Point point) {
        this.clearMeasurements();
        DrawObject obj = new DrawObject()
            .setType(DrawObject.Type.TEXT)
            .setStartPoint(new Point(point))
            .setColorType(this.colorType)
            .setText(this.textPreview);

        this.objectList.add(obj);

        this.textPreview = null;
        this.textPreviewPosition = null;

        updateHistoryFromObjects();
        this.save();
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

    public void border() {
        this.clearMeasurements();
        BufferedImage bufferedImage = deepCopy(this.getBufferedImage());
        Graphics2D g2 = bufferedImage.createGraphics();
        g2.setColor(BLACK);
        g2.drawRect(0, 0, bufferedImage.getWidth() - 1, bufferedImage.getHeight() - 1);
        g2.dispose();
        this.baseImage = deepCopy(bufferedImage);
        this.objectList.clear();
        this.selectedObject = null;
        this.addHistory(bufferedImage);
        this.save();
        this.init();
        this.repaint();
    }

    public void shadow() {
        this.clearMeasurements();
        BufferedImage original = this.getBufferedImage();
        int shadowSize = 20;
        int shadowOffset = 5;

        int newWidth = original.getWidth() + shadowSize * 2 + shadowOffset;
        int newHeight = original.getHeight() + shadowSize * 2 + shadowOffset;

        BufferedImage result = new BufferedImage(newWidth, newHeight, TYPE_INT_ARGB);
        Graphics2D g2 = result.createGraphics();
        g2.setRenderingHint(java.awt.RenderingHints.KEY_ANTIALIASING, java.awt.RenderingHints.VALUE_ANTIALIAS_ON);

        g2.setColor(java.awt.Color.WHITE);
        g2.fillRect(0, 0, newWidth, newHeight);

        for (int i = shadowSize; i >= 1; i--) {
            float ratio = (float) (shadowSize - i + 1) / shadowSize;
            float alpha = ratio * ratio * 0.08f;
            g2.setColor(new java.awt.Color(0, 0, 0, Math.min((int) (alpha * 255), 255)));
            g2.fillRoundRect(
                shadowSize - i + shadowOffset,
                shadowSize - i + shadowOffset,
                original.getWidth() + i * 2,
                original.getHeight() + i * 2,
                i * 2, i * 2
            );
        }

        g2.drawImage(original, shadowSize, shadowSize, null);
        g2.dispose();

        this.baseImage = deepCopy(result);
        this.objectList.clear();
        this.selectedObject = null;
        this.addHistory(result);
        this.save();
        this.init();
        this.repaint();
    }

    public void rotateRight() {
        this.clearMeasurements();
        BufferedImage original = this.getBufferedImage();
        int w = original.getWidth();
        int h = original.getHeight();
        BufferedImage rotated = new BufferedImage(h, w, TYPE_INT_ARGB);
        Graphics2D g2 = rotated.createGraphics();
        g2.translate(h, 0);
        g2.rotate(Math.PI / 2);
        g2.drawImage(original, 0, 0, null);
        g2.dispose();
        this.baseImage = deepCopy(rotated);
        this.objectList.clear();
        this.selectedObject = null;
        this.addHistory(rotated);
        this.save();
        this.init();
        this.repaint();
    }

    public void rotateLeft() {
        this.clearMeasurements();
        BufferedImage original = this.getBufferedImage();
        int w = original.getWidth();
        int h = original.getHeight();
        BufferedImage rotated = new BufferedImage(h, w, TYPE_INT_ARGB);
        Graphics2D g2 = rotated.createGraphics();
        g2.translate(0, w);
        g2.rotate(-Math.PI / 2);
        g2.drawImage(original, 0, 0, null);
        g2.dispose();
        this.baseImage = deepCopy(rotated);
        this.objectList.clear();
        this.selectedObject = null;
        this.addHistory(rotated);
        this.save();
        this.init();
        this.repaint();
    }

    public void clear() {
        this.clearMeasurements();
        BufferedImage bufferedImage = this.bufferedImageHistoryList.get(0);
        this.save(this.imageFile, bufferedImage);
        this.bufferedImageHistoryList.clear();
        this.imageHistoryIndex = 0;
        this.objectList.clear();
        this.selectedObject = null;
        this.baseImage = null;
        this.revalidate();
        this.repaint();
    }

    public void deleteSelectedObject() {
        if (selectedObject == null) {
            return;
        }

        this.clearMeasurements();
        objectList.remove(selectedObject);
        this.selectedObject = null;

        if (objectList.isEmpty()) {
            BufferedImage composite = deepCopy(this.baseImage);
            this.addHistory(composite);
        } else {
            updateHistoryFromObjects();
        }

        this.save();
        this.init();
        this.repaint();
    }

    public void measureRectangles() {
        BufferedImage source = this.objectList.isEmpty() ? deepCopy(this.getBufferedImage()) : buildComposite();
        int width = source.getWidth();
        int height = source.getHeight();
        boolean[] visited = new boolean[width * height];
        List<MeasurementOverlay> overlays = new ArrayList<>();

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int index = y * width + x;

                if (visited[index]) {
                    continue;
                }

                int rgb = source.getRGB(x, y);
                if (isIgnoredPixel(rgb)) {
                    visited[index] = true;
                    continue;
                }

                MeasurementOverlay overlay = this.findRectangleRegion(source, visited, x, y);
                if (overlay != null) {
                    overlays.add(overlay);
                }
            }
        }

        overlays.sort(Comparator.comparingInt((MeasurementOverlay overlay) -> overlay.bounds.width * overlay.bounds.height)
            .reversed());

        if (overlays.size() > 30) {
            overlays = new ArrayList<>(overlays.subList(0, 30));
        }

        this.measurementOverlays = overlays;
        this.saveMeasuredColors(overlays);
        this.selectedObject = null;
        this.repaint();
    }

    private void saveMeasuredColors(List<MeasurementOverlay> overlays) {
        java.awt.Window window = SwingUtilities.getWindowAncestor(this);

        if (!(window instanceof ImageFrame)) {
            return;
        }

        ImageFrame imageFrame = (ImageFrame) window;

        for (MeasurementOverlay overlay : overlays) {
            if (overlay.label == null || overlay.color == null) {
                continue;
            }

            Point centerPoint = new Point(
                overlay.bounds.x + overlay.bounds.width / 2,
                overlay.bounds.y + overlay.bounds.height / 2
            );
            imageFrame.savePickedColor(overlay.color, centerPoint);
        }
    }

    private MeasurementOverlay findRectangleRegion(BufferedImage source, boolean[] visited, int startX, int startY) {
        int width = source.getWidth();
        int height = source.getHeight();
        int seed = source.getRGB(startX, startY);
        ArrayDeque<Point> queue = new ArrayDeque<>();
        queue.add(new Point(startX, startY));
        visited[startY * width + startX] = true;

        int minX = startX;
        int minY = startY;
        int maxX = startX;
        int maxY = startY;
        int count = 0;

        while (!queue.isEmpty()) {
            Point point = queue.removeFirst();
            int x = point.x;
            int y = point.y;
            count++;

            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);

            this.enqueueIfMatched(source, visited, queue, x - 1, y, seed);
            this.enqueueIfMatched(source, visited, queue, x + 1, y, seed);
            this.enqueueIfMatched(source, visited, queue, x, y - 1, seed);
            this.enqueueIfMatched(source, visited, queue, x, y + 1, seed);
        }

        int regionWidth = maxX - minX + 1;
        int regionHeight = maxY - minY + 1;
        int area = regionWidth * regionHeight;

        if (regionWidth < 20 || regionHeight < 20 || area < 900) {
            return null;
        }

        if (area > width * height * 0.85) {
            return null;
        }

        double density = (double) count / area;
        boolean filledRectangle = density >= 0.72;
        boolean outlineRectangle = density >= 0.03 && density <= 0.30
            && this.computeBorderCoverage(source, minX, minY, maxX, maxY, seed) >= 0.72;

        if (!filledRectangle && !outlineRectangle) {
            return null;
        }

        Rectangle bounds = new Rectangle(minX, minY, regionWidth, regionHeight);
        Color measuredColor = new Color(seed, true);
        String label = regionWidth > 250
            ? regionWidth + " x " + regionHeight + "  " + String.format("#%02X%02X%02X",
            measuredColor.getRed(), measuredColor.getGreen(), measuredColor.getBlue())
            : null;
        return new MeasurementOverlay(bounds, label, measuredColor);
    }

    private void enqueueIfMatched(BufferedImage source,
                                  boolean[] visited,
                                  ArrayDeque<Point> queue,
                                  int x,
                                  int y,
                                  int seed) {
        int width = source.getWidth();
        int height = source.getHeight();

        if (x < 0 || y < 0 || x >= width || y >= height) {
            return;
        }

        int index = y * width + x;
        if (visited[index]) {
            return;
        }

        int rgb = source.getRGB(x, y);
        if (isIgnoredPixel(rgb) || !isSimilarColor(seed, rgb)) {
            return;
        }

        visited[index] = true;
        queue.addLast(new Point(x, y));
    }

    private double computeBorderCoverage(BufferedImage source, int minX, int minY, int maxX, int maxY, int seed) {
        int matched = 0;
        int total = 0;

        for (int x = minX; x <= maxX; x++) {
            total += 2;
            if (isSimilarColor(seed, source.getRGB(x, minY))) {
                matched++;
            }
            if (isSimilarColor(seed, source.getRGB(x, maxY))) {
                matched++;
            }
        }

        for (int y = minY + 1; y < maxY; y++) {
            total += 2;
            if (isSimilarColor(seed, source.getRGB(minX, y))) {
                matched++;
            }
            if (isSimilarColor(seed, source.getRGB(maxX, y))) {
                matched++;
            }
        }

        return total == 0 ? 0.0 : (double) matched / total;
    }

    private boolean isIgnoredPixel(int rgb) {
        int alpha = (rgb >>> 24) & 0xFF;
        return alpha < 10;
    }

    private boolean isSimilarColor(int rgb1, int rgb2) {
        int r1 = (rgb1 >> 16) & 0xFF;
        int g1 = (rgb1 >> 8) & 0xFF;
        int b1 = rgb1 & 0xFF;
        int r2 = (rgb2 >> 16) & 0xFF;
        int g2 = (rgb2 >> 8) & 0xFF;
        int b2 = rgb2 & 0xFF;

        int dr = r1 - r2;
        int dg = g1 - g2;
        int db = b1 - b2;
        return dr * dr + dg * dg + db * db <= 24 * 24;
    }

    private void drawMeasurementOverlays(Graphics2D g2, int imageWidth) {
        for (MeasurementOverlay overlay : this.measurementOverlays) {
            Rectangle bounds = overlay.bounds;

            g2.setColor(new java.awt.Color(255, 0, 0, 180));
            g2.setStroke(new BasicStroke(2));
            g2.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);

            if (overlay.label == null) {
                continue;
            }

            FontMetrics metrics = g2.getFontMetrics();
            int textWidth = metrics.stringWidth(overlay.label);
            int textHeight = metrics.getHeight();
            int textX = Math.max(0, Math.min(bounds.x + (bounds.width - textWidth) / 2, imageWidth - textWidth - 8));
            int textY = Math.max(textHeight, bounds.y - 6);

            g2.setColor(new java.awt.Color(255, 255, 255, 220));
            int swatchSize = textHeight - 4;
            int boxWidth = textWidth + swatchSize + 14;
            g2.fillRoundRect(textX - 4, textY - metrics.getAscent() - 2, boxWidth, textHeight, 8, 8);
            g2.setColor(overlay.color);
            g2.fillRect(textX, textY - metrics.getAscent(), swatchSize, swatchSize);
            g2.setColor(java.awt.Color.DARK_GRAY);
            g2.drawRect(textX, textY - metrics.getAscent(), swatchSize, swatchSize);
            g2.setColor(java.awt.Color.RED);
            g2.drawString(overlay.label, textX + swatchSize + 6, textY);
        }
    }

    private void drawOcrOverlays(Graphics2D g2) {
        for (Rectangle bounds : this.ocrOverlays) {
            this.drawOcrOverlay(g2, bounds, new Color(255, 170, 0, 60), new Color(255, 140, 0, 180), 2f);
        }

        if (this.selectedOcrOverlay != null) {
            this.drawOcrOverlay(g2, this.selectedOcrOverlay, new Color(0, 180, 255, 70), new Color(0, 120, 215, 230), 3f);
        }
    }

    private void drawOcrOverlay(Graphics2D g2, Rectangle bounds, Color fillColor, Color strokeColor, float strokeWidth) {
        if (bounds == null || bounds.width <= 0 || bounds.height <= 0) {
            return;
        }

        g2.setColor(fillColor);
        g2.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
        g2.setColor(strokeColor);
        g2.setStroke(new BasicStroke(strokeWidth));
        g2.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    @Override
    public Dimension getPreferredScrollableViewportSize() {
        return this.getPreferredSize();
    }

    @Override
    public int getScrollableUnitIncrement(Rectangle visibleRect, int orientation, int direction) {
        return 20;
    }

    @Override
    public int getScrollableBlockIncrement(Rectangle visibleRect, int orientation, int direction) {
        if (orientation == SwingConstants.VERTICAL) {
            return Math.max(visibleRect.height - 20, 20);
        }

        return Math.max(visibleRect.width - 20, 20);
    }

    @Override
    public boolean getScrollableTracksViewportWidth() {
        if (!(this.getParent() instanceof JViewport)) {
            return false;
        }

        JViewport viewport = (JViewport) this.getParent();
        return viewport.getWidth() > this.getPreferredSize().width;
    }

    @Override
    public boolean getScrollableTracksViewportHeight() {
        if (!(this.getParent() instanceof JViewport)) {
            return false;
        }

        JViewport viewport = (JViewport) this.getParent();
        return viewport.getHeight() > this.getPreferredSize().height;
    }

    private void clearMeasurements() {
        this.measurementOverlays.clear();
    }

    public void setOcrOverlays(List<ImageOcrService.OcrItem> items) {
        List<Rectangle> overlays = new ArrayList<Rectangle>();
        for (ImageOcrService.OcrItem item : items) {
            Rectangle rect = this.toRectangle(item);
            if (rect != null) {
                overlays.add(rect);
            }
        }
        this.ocrOverlays = overlays;
        this.repaint();
    }

    public void clearOcrOverlays() {
        this.ocrOverlays.clear();
        this.selectedOcrOverlay = null;
        this.repaint();
    }

    public void setSelectedOcrItem(ImageOcrService.OcrItem item) {
        this.selectedOcrOverlay = this.toRectangle(item);
        this.repaint();
    }

    private Rectangle toRectangle(ImageOcrService.OcrItem item) {
        if (item == null || item.getRect() == null) {
            return null;
        }

        ImageOcrService.OcrRect rect = item.getRect();
        return new Rectangle(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
    }

    private static class MeasurementOverlay {
        private final Rectangle bounds;
        private final String label;
        private final Color color;

        private MeasurementOverlay(Rectangle bounds, String label, Color color) {
            this.bounds = bounds;
            this.label = label;
            this.color = color;
        }
    }

    private enum CropHandle {
        TOP(Cursor.getPredefinedCursor(Cursor.N_RESIZE_CURSOR)),
        RIGHT(Cursor.getPredefinedCursor(Cursor.E_RESIZE_CURSOR)),
        BOTTOM(Cursor.getPredefinedCursor(Cursor.S_RESIZE_CURSOR)),
        LEFT(Cursor.getPredefinedCursor(Cursor.W_RESIZE_CURSOR)),
        NONE(Cursor.getDefaultCursor());

        private final Cursor cursor;

        CropHandle(Cursor cursor) {
            this.cursor = cursor;
        }

        public Cursor getCursor() {
            return this.cursor;
        }
    }
}
