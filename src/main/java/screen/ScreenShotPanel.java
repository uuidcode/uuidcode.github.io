package screen;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsDevice;
import java.awt.GridLayout;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.PointerInfo;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Stroke;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.geom.Area;
import java.awt.geom.Ellipse2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import javax.swing.Timer;

import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;

public class ScreenShotPanel extends JPanel
    implements MouseListener, MouseMotionListener {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);
    private static final int PRE_CAPTURE_HIDE_DELAY_MS = 30;
    private static final int WINDOW_FRONT_SETTLE_DELAY_MS = 60;
    private static final int MOUSE_HIDE_SETTLE_DELAY_MS = 20;
    private static final Color PREVIEW_GRID_COLOR = new Color(255, 255, 255, 28);
    private static final Color PREVIEW_GRID_LABEL_COLOR = new Color(255, 255, 255, 110);
    private static final Color CAPTURE_GRID_COLOR = new Color(255, 196, 0, 150);
    private static final Color CAPTURE_GRID_LABEL_COLOR = new Color(255, 224, 130, 240);
    private static final Color CAPTURE_GRID_LABEL_BACKGROUND = new Color(0, 0, 0, 150);
    private static final Color GUIDE_TEXT_BACKGROUND = new Color(0, 0, 0, 140);
    private static final Color GUIDE_TEXT_COLOR = new Color(255, 255, 255, 235);
    private static final int GUIDE_TEXT_PADDING = 4;
    private static final int GRID_LABEL_INTERVAL = 100;
    private static final int CONTROL_PANEL_REPAINT_PADDING = 24;
    private static final int WINDOW_CAPTURE_PADDING = 20;
    private static final Color WINDOW_CAPTURE_BACKGROUND_COLOR = new Color(63, 66, 48);
    private static final int WINDOW_CORNER_SAMPLE_INSET = 2;
    private static final int WINDOW_CORNER_SAMPLE_SIZE = 8;
    private final GraphicsDevice graphicsDevice;
    private Point stratPoint;
    private Point endPoint;
    private Point mousePosition;
    private final ImageTabPanel tabbedPane;
    private final ScreenShotFrame screenShotFrame;
    private final ImageFrame imageFrame;
    private final BufferedImage baseScreenImage;
    private JPanel controlPanel = null;
    private final CaptureConfig captureConfig;
    private boolean guideOverlayVisible = true;
    private boolean rightButtonPressed;
    private Point colorPreviewPoint;
    private Color colorPreviewColor;
    private final Timer windowCaptureHoverTimer;
    private Rectangle windowCapturePreviewRect;
    private ImageFrame.WindowTarget windowCaptureTarget;
    private Point windowCaptureHoverPoint;
    private int windowCaptureRequestId;

    public ScreenShotPanel(GraphicsDevice graphicsDevice,
                           ImageFrame imageFrame,
                           ScreenShotFrame screenShotFrame,
                           BufferedImage baseScreenImage) {
        this.graphicsDevice = graphicsDevice;
        this.tabbedPane = imageFrame.getTabbedPane();
        this.imageFrame = imageFrame;
        this.screenShotFrame = screenShotFrame;
        this.baseScreenImage = baseScreenImage;
        this.captureConfig = imageFrame.getCaptureConfig();
        this.setLayout(null);
        this.windowCaptureHoverTimer = new Timer(250, e -> this.resolveWindowCapturePreview());
        this.windowCaptureHoverTimer.setRepeats(false);

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            if (ke.getID() == KeyEvent.KEY_RELEASED && ke.getKeyCode() == KeyEvent.VK_ESCAPE) {
                this.cancelCapture();
            }

            return false;
        });
    }

    private JPanel createControlPanel() {
        if (this.captureConfig.isWindowCaptureMode()) {
            JPanel panel = new JPanel(new GridLayout(1, 2));
            panel.setBackground(new Color(0, 0, 0, 0));
            panel.setOpaque(false);

            JButton captureButton = new JButton("capture");
            captureButton.addActionListener(e -> this.shot(null, false));
            panel.add(captureButton);

            JButton cancelButton = new JButton("cancel");
            cancelButton.addActionListener(e -> this.cancelCapture());
            panel.add(cancelButton);
            return panel;
        }

        JPanel panel = new JPanel(new GridLayout(2, 2));
        panel.setBackground(new Color(0, 0, 0, 0));

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
        cancelButton.addActionListener(e -> this.cancelCapture());
        panel.add(cancelButton);

        return panel;
    }

    private void shot(Integer second, boolean isAll) {
        Rectangle selectionRectangle = this.getSelectionRectangle();
        if (selectionRectangle == null) {
            return;
        }
        ImageFrame.WindowTarget selectedWindowTarget = this.windowCaptureTarget;
        stratPoint = null;
        endPoint = null;
        this.windowCapturePreviewRect = null;
        this.windowCaptureTarget = null;
        guideOverlayVisible = false;

        if (!this.captureConfig.isWindowCaptureMode()) {
            selectionRectangle.width++;
            selectionRectangle.height++;
        }
        if (controlPanel != null) {
            this.hideControlPanel();
        }
        boolean keepImageFrameVisible = this.captureConfig.isSelfAreaCaptureMode();
        if (!keepImageFrameVisible) {
            imageFrame.setVisible(false);
        }
        imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));

        new Thread(() -> {
            try {
                PointerInfo pointerInfo = MouseInfo.getPointerInfo();
                Point mousePoint = pointerInfo.getLocation();
                int x = (int) mousePoint.getX();
                int y = (int) mousePoint.getY();

                Robot robot = new Robot();

                Thread.sleep(PRE_CAPTURE_HIDE_DELAY_MS);

                if (keepImageFrameVisible) {
                    try {
                        this.imageFrame.bringCurrentAppToFront();
                        Thread.sleep(WINDOW_FRONT_SETTLE_DELAY_MS);
                    } catch (Throwable ignored) {
                    }
                }

                if (this.captureConfig.isWindowCaptureMode() && selectedWindowTarget != null) {
                    try {
                        this.imageFrame.bringWindowToFront(selectedWindowTarget);
                        Thread.sleep(WINDOW_FRONT_SETTLE_DELAY_MS);
                    } catch (Throwable ignored) {
                    }
                }

                if (second != null) {
                    Thread.sleep(second * 1000);
                }

                Rectangle captureRectangle;
                if (this.captureConfig.isWindowCaptureMode() && selectedWindowTarget != null) {
                    captureRectangle = new Rectangle(selectedWindowTarget.getRectangle());
                } else {
                    Rectangle display = graphicsDevice.getDefaultConfiguration().getBounds();
                    captureRectangle = new Rectangle(selectionRectangle);
                    captureRectangle.x += display.x;
                    captureRectangle.y += display.y;
                }

                captureConfig.setLastRectangle(new Rectangle(captureRectangle));

                boolean windowCapture = this.captureConfig.isWindowCaptureMode() && selectedWindowTarget != null;

                if (isAll) {
                    Rectangle display = graphicsDevice.getDefaultConfiguration().getBounds();

                    capture(
                        robot,
                        display,
                        0,
                        0,
                        this.tabbedPane,
                        captureConfig,
                        false
                    );
                } else {
                    capture(
                        robot,
                        captureRectangle,
                        x,
                        y,
                        this.tabbedPane,
                        captureConfig,
                        windowCapture
                    );
                }
            } catch (Throwable t) {
                throw new RuntimeException(t);
            } finally {
                guideOverlayVisible = true;
                try {
                    SwingUtilities.invokeAndWait(() -> {
                        if (!keepImageFrameVisible) {
                            imageFrame.setVisible(true);
                        }
                        imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
                    });
                } catch (Throwable ignored) {
                }

                try {
                    imageFrame.bringCurrentAppToFront();
                } catch (Throwable ignored) {
                }

                SwingUtilities.invokeLater(() -> {
                    imageFrame.toFront();
                    imageFrame.requestFocus();
                });
            }
        }).start();
    }

    void cancelCapture() {
        this.hideControlPanel();

        this.resetColorPreviewState();
        this.windowCaptureHoverTimer.stop();
        this.windowCapturePreviewRect = null;
        this.windowCaptureTarget = null;
        this.windowCaptureHoverPoint = null;
        stratPoint = null;
        endPoint = null;
        mousePosition = null;
        guideOverlayVisible = true;
        imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
        imageFrame.setVisible(true);
        this.refreshOverlayImmediately();
    }

    private void startColorPreview(Point point) {
        this.rightButtonPressed = true;
        this.colorPreviewPoint = point;
        this.updateColorPreview(point);
        this.repaint();
    }

    private void updateColorPreview(Point point) {
        this.colorPreviewPoint = point;

        if (point == null || this.baseScreenImage == null) {
            this.colorPreviewColor = null;
            return;
        }

        int x = Math.max(0, Math.min(point.x, this.baseScreenImage.getWidth() - 1));
        int y = Math.max(0, Math.min(point.y, this.baseScreenImage.getHeight() - 1));
        this.colorPreviewColor = new Color(this.baseScreenImage.getRGB(x, y));
    }

    private void commitColorSelection(Point point) {
        this.updateColorPreview(point);
        Color selectedColor = this.colorPreviewColor;

        if (selectedColor != null) {
            imageFrame.setPickedColor(selectedColor);
            imageFrame.savePickedColor(selectedColor, this.toAbsolutePoint(point));
        }

        this.cancelCapture();
    }

    private Point toAbsolutePoint(Point point) {
        if (point == null) {
            return null;
        }

        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();
        return new Point(point.x + displayBounds.x, point.y + displayBounds.y);
    }

    private void resetColorPreviewState() {
        this.rightButtonPressed = false;
        this.colorPreviewPoint = null;
        this.colorPreviewColor = null;
    }

    public static void capture(
        Robot robot,
        Rectangle rectangle,
        int x,
        int y,
        ImageTabPanel tabbedPane,
        CaptureConfig config,
        boolean windowCapture
    ) throws IOException {

        // 캡처 전 마우스를 화면 밖으로 이동하여 커서가 캡처되지 않도록 함
        robot.mouseMove(-10000, -10000);

        // 마우스 이동 후 잠시 대기 (화면 갱신 시간)
        try {
            Thread.sleep(MOUSE_HIDE_SETTLE_DELAY_MS);
        } catch (InterruptedException ignored) {
        }

        BufferedImage image = robot.createScreenCapture(rectangle);
        Integer captureGridSize = config.getCaptureGridMode().getCaptureGridSize();

        if (captureGridSize != null) {
            Graphics2D g2 = image.createGraphics();

            drawGrid(
                g2,
                image.getWidth(),
                image.getHeight(),
                captureGridSize,
                rectangle.x,
                rectangle.y,
                CAPTURE_GRID_COLOR,
                CAPTURE_GRID_LABEL_COLOR,
                CAPTURE_GRID_LABEL_BACKGROUND
            );

            g2.dispose();
        }

        if (windowCapture) {
            image = applyWindowCaptureFrame(image);
        }

        // 캡처 후 마우스를 원래 위치로 복원
        robot.mouseMove(x, y);

        if (config.isImgTagEnabled()) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(image, "png", baos);

            String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
            String imgTag = "<img src=\"data:image/png;base64," + base64 + "\">";
            Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(imgTag), null);

            return;
        }

        String fileName = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss").format(new Date());
        File file = Util.getImageFile(fileName);
        ImageIO.write(image, "png", file);

        try {
            ImageViewPanel.copy(file);
        } catch (Throwable ignored) {
        }

        tabbedPane.addTab(fileName);
    }

    private static BufferedImage applyWindowCaptureFrame(BufferedImage capturedImage) {
        int width = capturedImage.getWidth();
        int height = capturedImage.getHeight();
        int paddedWidth = width + WINDOW_CAPTURE_PADDING * 2;
        int paddedHeight = height + WINDOW_CAPTURE_PADDING * 2;

        BufferedImage framed = new BufferedImage(
            paddedWidth,
            paddedHeight,
            BufferedImage.TYPE_INT_ARGB
        );

        Graphics2D g2 = framed.createGraphics();

        try {
            g2.setColor(WINDOW_CAPTURE_BACKGROUND_COLOR);
            g2.fillRect(0, 0, paddedWidth, paddedHeight);

            if (isRoundedRectangleWindow(capturedImage)) {
                fillRoundedCorners(g2, capturedImage);
            }

            g2.drawImage(capturedImage, WINDOW_CAPTURE_PADDING, WINDOW_CAPTURE_PADDING, null);
        } finally {
            g2.dispose();
        }

        return framed;
    }

    private static boolean isRoundedRectangleWindow(BufferedImage capturedImage) {
        int width = capturedImage.getWidth();
        int height = capturedImage.getHeight();

        if (width < WINDOW_CORNER_SAMPLE_SIZE * 4 || height < WINDOW_CORNER_SAMPLE_SIZE * 4) {
            return false;
        }

        int centerX = width / 2;
        int referenceColor = capturedImage.getRGB(centerX, WINDOW_CORNER_SAMPLE_INSET);
        int topLeft = capturedImage.getRGB(WINDOW_CORNER_SAMPLE_INSET, WINDOW_CORNER_SAMPLE_INSET);
        int topRight = capturedImage.getRGB(width - 1 - WINDOW_CORNER_SAMPLE_INSET, WINDOW_CORNER_SAMPLE_INSET);
        int innerLeft = capturedImage.getRGB(WINDOW_CORNER_SAMPLE_SIZE * 4, WINDOW_CORNER_SAMPLE_INSET);
        int innerRight = capturedImage.getRGB(width - 1 - WINDOW_CORNER_SAMPLE_SIZE * 4, WINDOW_CORNER_SAMPLE_INSET);

        int cornerDiff = Math.max(colorDistance(topLeft, referenceColor), colorDistance(topRight, referenceColor));
        int innerDiff = Math.max(colorDistance(innerLeft, referenceColor), colorDistance(innerRight, referenceColor));

        return cornerDiff > 30 && cornerDiff > innerDiff + 20;
    }

    private static int colorDistance(int argb1, int argb2) {
        int r1 = (argb1 >> 16) & 0xFF;
        int g1 = (argb1 >> 8) & 0xFF;
        int b1 = argb1 & 0xFF;
        int r2 = (argb2 >> 16) & 0xFF;
        int g2 = (argb2 >> 8) & 0xFF;
        int b2 = argb2 & 0xFF;

        return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    }

    private static void fillRoundedCorners(Graphics2D g2, BufferedImage capturedImage) {
        int width = capturedImage.getWidth();
        int height = capturedImage.getHeight();
        int cornerRadius = detectCornerRadius(capturedImage);

        if (cornerRadius <= 0) {
            return;
        }

        int offsetX = WINDOW_CAPTURE_PADDING;
        int offsetY = WINDOW_CAPTURE_PADDING;
        int diameter = cornerRadius * 2;

        Area cornerArea = new Area(new Rectangle(offsetX, offsetY, width, height));

        Area topLeftSquare = new Area(new Rectangle(offsetX, offsetY, cornerRadius, cornerRadius));
        topLeftSquare.subtract(new Area(new Ellipse2D.Float(offsetX, offsetY, diameter, diameter)));

        Area topRightSquare = new Area(new Rectangle(offsetX + width - cornerRadius, offsetY, cornerRadius, cornerRadius));
        topRightSquare.subtract(new Area(new Ellipse2D.Float(offsetX + width - diameter, offsetY, diameter, diameter)));

        Area bottomLeftSquare = new Area(new Rectangle(offsetX, offsetY + height - cornerRadius, cornerRadius, cornerRadius));
        bottomLeftSquare.subtract(new Area(new Ellipse2D.Float(offsetX, offsetY + height - diameter, diameter, diameter)));

        Area bottomRightSquare = new Area(new Rectangle(offsetX + width - cornerRadius, offsetY + height - cornerRadius, cornerRadius, cornerRadius));
        bottomRightSquare.subtract(new Area(new Ellipse2D.Float(offsetX + width - diameter, offsetY + height - diameter, diameter, diameter)));

        Area cornersToFill = new Area();
        cornersToFill.add(topLeftSquare);
        cornersToFill.add(topRightSquare);
        cornersToFill.add(bottomLeftSquare);
        cornersToFill.add(bottomRightSquare);
        cornersToFill.intersect(cornerArea);

        g2.setColor(WINDOW_CAPTURE_BACKGROUND_COLOR);
        g2.fill(cornersToFill);
    }

    private static int detectCornerRadius(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        int maxScan = Math.min(40, Math.min(width, height) / 2);
        int centerX = width / 2;
        int referenceColor = image.getRGB(centerX, Math.min(WINDOW_CORNER_SAMPLE_INSET, height - 1));

        for (int i = 0; i < maxScan; i++) {
            int argb = image.getRGB(i, i);

            if (colorDistance(argb, referenceColor) < 30) {
                return i;
            }
        }

        return 0;
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
        if (SwingUtilities.isRightMouseButton(e)) {
            this.startColorPreview(e.getPoint());
            return;
        }

        if (this.captureConfig.isWindowCaptureMode()) {
            return;
        }

        Integer fixedWidth = captureConfig.getFixedWidth();
        Integer fixedHeight = captureConfig.getFixedHeight();

        if (fixedWidth != null && fixedHeight != null) {
            Point clickPoint = e.getPoint();
            stratPoint = clickPoint;
            endPoint = new Point(clickPoint.x + fixedWidth, clickPoint.y + fixedHeight);
            mousePosition = null;
            e.getComponent().repaint();
            this.shot(null, false);
            return;
        }

        stratPoint = e.getPoint();

        this.hideControlPanel();
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        if (SwingUtilities.isRightMouseButton(e) && this.rightButtonPressed) {
            this.rightButtonPressed = false;
            this.commitColorSelection(e.getPoint());
            return;
        }

        if (this.captureConfig.isWindowCaptureMode()) {
            return;
        }

        if (stratPoint == null || endPoint == null) {
            return;
        }

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
        if (this.captureConfig.isWindowCaptureMode()) {
            this.windowCaptureHoverPoint = e.getPoint();
            if (this.windowCapturePreviewRect != null && this.windowCapturePreviewRect.contains(e.getPoint())) {
                this.showControlPanelForRectangle(this.windowCapturePreviewRect);
                this.refreshOverlayImmediately();
            }
            this.windowCaptureHoverTimer.restart();
        }
    }

    @Override
    public void mouseExited(MouseEvent e) {
        if (this.captureConfig.isWindowCaptureMode()) {
            Point localMousePoint = this.getCurrentLocalMousePoint();
            if (this.isInsideActiveWindowCaptureArea(localMousePoint)) {
                this.windowCaptureHoverPoint = localMousePoint;
                this.showControlPanelForRectangle(this.windowCapturePreviewRect);
                this.refreshOverlayImmediately();
                return;
            }

            this.windowCaptureHoverTimer.stop();
            this.windowCaptureHoverPoint = null;
            this.windowCapturePreviewRect = null;
            this.windowCaptureTarget = null;
            this.hideControlPanel();
            this.refreshOverlayImmediately();
        }
    }

    @Override
    public void mouseDragged(MouseEvent e) {
        if (this.rightButtonPressed) {
            this.updateColorPreview(e.getPoint());
            e.getComponent().repaint();
            return;
        }

        if (this.captureConfig.isWindowCaptureMode()) {
            return;
        }

        endPoint = e.getPoint();
        e.getComponent().repaint();
    }

    @Override
    public void mouseMoved(MouseEvent e) {
        if (this.captureConfig.isWindowCaptureMode()) {
            this.windowCaptureHoverPoint = e.getPoint();

            if (this.windowCapturePreviewRect != null && this.windowCapturePreviewRect.contains(e.getPoint())) {
                this.showControlPanelForRectangle(this.windowCapturePreviewRect);
                this.windowCaptureHoverTimer.restart();
                this.refreshOverlayImmediately();
                return;
            }

            this.windowCaptureHoverTimer.restart();
            return;
        }

        Integer fixedWidth = captureConfig.getFixedWidth();
        Integer fixedHeight = captureConfig.getFixedHeight();

        if (fixedWidth != null && fixedHeight != null) {
            mousePosition = e.getPoint();
            e.getComponent().repaint();
        }
    }

    public Rectangle getRectangle() {
        return Util.getRectangle(this.stratPoint, this.endPoint);
    }

    private Rectangle getSelectionRectangle() {
        if (this.captureConfig.isWindowCaptureMode()) {
            return this.windowCapturePreviewRect == null ? null : new Rectangle(this.windowCapturePreviewRect);
        }

        return (this.stratPoint == null || this.endPoint == null) ? null : this.getRectangle();
    }

    @Override
    public void paint(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g.create();
        try {
            if (this.baseScreenImage != null) {
                g2.drawImage(this.baseScreenImage, 0, 0, this);
            }

            g2.setColor(BACKGROUND_COLOR);
            g2.fillRect(0, 0, this.getWidth(), this.getHeight());
            this.drawOverlayContents(g2, true);
        } finally {
            g2.dispose();
        }

        this.paintBorder(g);
        this.paintChildren(g);
    }

    private void drawOverlayContents(Graphics2D g2, boolean includeColorPreview) {
        Integer previewGridSize = captureConfig.getCaptureGridMode().getPreviewGridSize();
        if (guideOverlayVisible && previewGridSize != null) {
            Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();
            drawGrid(g2, this.getWidth(), this.getHeight(), previewGridSize, displayBounds.x, displayBounds.y,
                PREVIEW_GRID_COLOR, PREVIEW_GRID_LABEL_COLOR, null);
        }

        Integer fixedWidth = captureConfig.getFixedWidth();
        Integer fixedHeight = captureConfig.getFixedHeight();

        if (fixedWidth != null && fixedHeight != null && mousePosition != null) {
            Rectangle rectangle = new Rectangle(mousePosition.x, mousePosition.y, fixedWidth, fixedHeight);
            g2.setColor(new Color(255, 255, 255, 100));
            g2.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            this.drawSelectionGuides(g2, rectangle);
        } else if (this.captureConfig.isWindowCaptureMode() && this.windowCapturePreviewRect != null) {
            Rectangle rectangle = this.windowCapturePreviewRect;
            g2.setColor(new Color(255, 255, 255, 100));
            g2.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            this.drawSelectionGuides(g2, rectangle);
        } else if (stratPoint != null && endPoint != null) {
            Rectangle rectangle = this.getRectangle();
            g2.setColor(new Color(255, 255, 255, 100));
            g2.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            this.drawSelectionGuides(g2, rectangle);
        }

        if (includeColorPreview && this.rightButtonPressed && this.colorPreviewPoint != null && this.colorPreviewColor != null) {
            this.drawColorPreview(g2);
        }
    }

    private static void drawGrid(Graphics2D g2,
                                 int width,
                                 int height,
                                 int gridSize,
                                 int offsetX,
                                 int offsetY,
                                 Color lineColor,
                                 Color labelColor,
                                 Color labelBackgroundColor) {
        Stroke originalStroke = g2.getStroke();
        g2.setStroke(new java.awt.BasicStroke(1f, java.awt.BasicStroke.CAP_BUTT,
            java.awt.BasicStroke.JOIN_BEVEL, 0, new float[]{4f, 4f}, 0));
        g2.setColor(lineColor);

        for (int x = 0; x < width; x += gridSize) {
            g2.drawLine(x, 0, x, height);
        }

        for (int y = 0; y < height; y += gridSize) {
            g2.drawLine(0, y, width, y);
        }

        g2.setStroke(originalStroke);

        drawGridLabels(g2, width, height, gridSize, offsetX, offsetY, labelColor, labelBackgroundColor);
    }

    private static void drawGridLabels(Graphics2D g2,
                                       int width,
                                       int height,
                                       int gridSize,
                                       int offsetX,
                                       int offsetY,
                                       Color labelColor,
                                       Color labelBackgroundColor) {
        Font originalFont = g2.getFont();
        Font gridFont = originalFont.deriveFont(10f);
        g2.setFont(gridFont);
        g2.setColor(labelColor);

        for (int x = 0; x < width; x += GRID_LABEL_INTERVAL) {
            for (int y = 0; y < height; y += GRID_LABEL_INTERVAL) {
                String text = "(" + (x + offsetX) + ", " + (y + offsetY) + ")";
                drawPlainOverlayText(g2, width, height, text, x + 3, y + 12, labelColor, labelBackgroundColor);
            }
        }

        g2.setFont(originalFont);
    }

    private void drawSelectionGuides(Graphics2D g2, Rectangle rectangle) {
        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();

        int left = rectangle.x + displayBounds.x;
        int top = rectangle.y + displayBounds.y;
        int right = rectangle.x + rectangle.width + displayBounds.x;
        int bottom = rectangle.y + rectangle.height + displayBounds.y;

        this.drawGuideLabel(g2, "(" + left + ", " + top + ")",
            rectangle.x + 6, rectangle.y - 8, false);
        this.drawGuideLabel(g2, "(" + right + ", " + top + ")",
            rectangle.x + rectangle.width - 6, rectangle.y - 8, true);
        this.drawGuideLabel(g2, "(" + left + ", " + bottom + ")",
            rectangle.x + 6, rectangle.y + rectangle.height + 18, false);
        this.drawGuideLabel(g2, "(" + right + ", " + bottom + ")",
            rectangle.x + rectangle.width - 6, rectangle.y + rectangle.height + 18, true);

        String sizeText = "w: " + rectangle.width + "  h: " + rectangle.height;
        int topCenterX = rectangle.x + rectangle.width / 2;
        this.drawTopCenteredGuideLabel(g2, sizeText, topCenterX, rectangle.y - 8);
    }

    private void drawGuideLabel(Graphics2D g2, String text, int anchorX, int baselineY, boolean alignRight) {
        FontMetrics metrics = g2.getFontMetrics();
        int textWidth = metrics.stringWidth(text);
        int textHeight = metrics.getHeight();
        int x = alignRight ? anchorX - textWidth - GUIDE_TEXT_PADDING * 2 : anchorX;
        int y = baselineY - metrics.getAscent();

        x = Math.max(0, Math.min(x, this.getWidth() - textWidth - GUIDE_TEXT_PADDING * 2));
        y = Math.max(0, Math.min(y, this.getHeight() - textHeight - GUIDE_TEXT_PADDING * 2));

        g2.setColor(GUIDE_TEXT_BACKGROUND);
        g2.fillRoundRect(x, y, textWidth + GUIDE_TEXT_PADDING * 2, textHeight + GUIDE_TEXT_PADDING * 2, 8, 8);
        g2.setColor(GUIDE_TEXT_COLOR);
        g2.drawString(text, x + GUIDE_TEXT_PADDING, y + GUIDE_TEXT_PADDING + metrics.getAscent());
    }

    private void drawTopCenteredGuideLabel(Graphics2D g2, String text, int centerX, int baselineY) {
        FontMetrics metrics = g2.getFontMetrics();
        int textWidth = metrics.stringWidth(text);
        int textHeight = metrics.getHeight();
        int x = centerX - (textWidth + GUIDE_TEXT_PADDING * 2) / 2;
        int y = baselineY - metrics.getAscent();

        x = Math.max(0, Math.min(x, this.getWidth() - textWidth - GUIDE_TEXT_PADDING * 2));
        y = Math.max(0, Math.min(y, this.getHeight() - textHeight - GUIDE_TEXT_PADDING * 2));

        g2.setColor(GUIDE_TEXT_BACKGROUND);
        g2.fillRoundRect(x, y, textWidth + GUIDE_TEXT_PADDING * 2, textHeight + GUIDE_TEXT_PADDING * 2, 8, 8);
        g2.setColor(GUIDE_TEXT_COLOR);
        g2.drawString(text, x + GUIDE_TEXT_PADDING, y + GUIDE_TEXT_PADDING + metrics.getAscent());
    }

    private static void drawPlainOverlayText(Graphics2D g2,
                                             int width,
                                             int height,
                                             String text,
                                             int x,
                                             int baselineY,
                                             Color textColor,
                                             Color backgroundColor) {
        FontMetrics metrics = g2.getFontMetrics();
        int clampedX = Math.max(0, Math.min(x, width - metrics.stringWidth(text)));
        int clampedBaselineY = Math.max(metrics.getAscent(), Math.min(baselineY, height - metrics.getDescent()));

        if (backgroundColor != null) {
            int boxX = Math.max(0, clampedX - 2);
            int boxY = Math.max(0, clampedBaselineY - metrics.getAscent());
            int boxWidth = Math.min(width - boxX, metrics.stringWidth(text) + 4);
            int boxHeight = Math.min(height - boxY, metrics.getHeight());
            Color originalColor = g2.getColor();
            g2.setColor(backgroundColor);
            g2.fillRoundRect(boxX, boxY, boxWidth, boxHeight, 6, 6);
            g2.setColor(textColor);
            g2.drawString(text, clampedX, clampedBaselineY);
            g2.setColor(originalColor);
            return;
        }

        Color originalColor = g2.getColor();
        g2.setColor(textColor);
        g2.drawString(text, clampedX, clampedBaselineY);
        g2.setColor(originalColor);
    }

    private void drawColorPreview(Graphics2D g2) {
        if (this.colorPreviewColor == null) {
            return;
        }

        String text = "RGB(" + this.colorPreviewColor.getRed()
            + ", " + this.colorPreviewColor.getGreen()
            + ", " + this.colorPreviewColor.getBlue()
            + ") " + String.format("#%02X%02X%02X",
            this.colorPreviewColor.getRed(),
            this.colorPreviewColor.getGreen(),
            this.colorPreviewColor.getBlue());

        FontMetrics metrics = g2.getFontMetrics();
        int textWidth = metrics.stringWidth(text);
        int textHeight = metrics.getHeight();
        int swatchSize = textHeight;
        int boxWidth = textWidth + swatchSize + GUIDE_TEXT_PADDING * 4;
        int boxHeight = textHeight + GUIDE_TEXT_PADDING * 2;
        int preferredRightX = this.colorPreviewPoint.x + 16;
        int preferredLeftX = this.colorPreviewPoint.x - boxWidth - 16;
        int x = preferredRightX + boxWidth <= this.getWidth()
            ? preferredRightX
            : Math.max(0, preferredLeftX);
        int y = Math.max(0, Math.min(this.colorPreviewPoint.y - boxHeight / 2, this.getHeight() - boxHeight));

        g2.setColor(GUIDE_TEXT_BACKGROUND);
        g2.fillRoundRect(x, y, boxWidth, boxHeight, 8, 8);

        if (this.colorPreviewColor != null) {
            g2.setColor(this.colorPreviewColor);
            g2.fillRect(x + GUIDE_TEXT_PADDING, y + GUIDE_TEXT_PADDING, swatchSize, swatchSize);
            g2.setColor(Color.WHITE);
            g2.drawRect(x + GUIDE_TEXT_PADDING, y + GUIDE_TEXT_PADDING, swatchSize, swatchSize);
        }

        g2.setColor(GUIDE_TEXT_COLOR);
        int textX = x + swatchSize + GUIDE_TEXT_PADDING * 3;
        int textY = y + GUIDE_TEXT_PADDING + metrics.getAscent();
        g2.drawString(text, textX, textY);
    }

    private void resolveWindowCapturePreview() {
        if (!this.captureConfig.isWindowCaptureMode() || this.windowCaptureHoverPoint == null) {
            return;
        }

        Point localPoint = new Point(this.windowCaptureHoverPoint);
        Point absolutePoint = this.toAbsolutePoint(localPoint);
        int requestId = ++this.windowCaptureRequestId;

        new Thread(() -> {
            try {
                ImageFrame.WindowTarget target = this.imageFrame.getWindowTargetAtPoint(absolutePoint);
                Rectangle localRect = this.toLocalRectangle(target.getRectangle());

                SwingUtilities.invokeLater(() -> {
                    if (requestId != this.windowCaptureRequestId) {
                        return;
                    }

                    this.windowCaptureTarget = target;
                    this.windowCapturePreviewRect = localRect;
                    this.showControlPanelForRectangle(localRect);
                    this.refreshOverlayImmediately();
                });
            } catch (Throwable ignored) {
                SwingUtilities.invokeLater(() -> {
                    if (requestId != this.windowCaptureRequestId) {
                        return;
                    }

                    if (this.isInsideActiveWindowCaptureArea(this.windowCaptureHoverPoint)) {
                        this.showControlPanelForRectangle(this.windowCapturePreviewRect);
                        this.refreshOverlayImmediately();
                        return;
                    }

                    this.windowCaptureTarget = null;
                    this.windowCapturePreviewRect = null;
                    this.hideControlPanel();
                    this.refreshOverlayImmediately();
                });
            }
        }, "window-capture-preview").start();
    }

    private Rectangle toLocalRectangle(Rectangle globalRect) {
        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();
        Rectangle localRect = new Rectangle(globalRect);
        localRect.translate(-displayBounds.x, -displayBounds.y);
        return localRect.intersection(new Rectangle(0, 0, this.getWidth(), this.getHeight()));
    }

    private void showControlPanelForRectangle(Rectangle rectangle) {
        if (rectangle.width <= 0 || rectangle.height <= 0) {
            this.hideControlPanel();
            return;
        }

        if (this.controlPanel == null) {
            this.controlPanel = this.createControlPanel();
            this.add(this.controlPanel);
            this.revalidate();
            this.repaint();
        }

        Rectangle previousBounds = this.controlPanel.getBounds();
        this.controlPanel.setVisible(true);
        Dimension dimension = this.controlPanel.getPreferredSize();
        this.controlPanel.setBounds(
            rectangle.x + (int) ((rectangle.getWidth() - dimension.getWidth()) / 2),
            rectangle.y + (int) ((rectangle.getHeight() - dimension.getHeight()) / 2),
            (int) dimension.getWidth(),
            (int) dimension.getHeight()
        );
        this.controlPanel.repaint();

        if (!previousBounds.isEmpty() && !previousBounds.equals(this.controlPanel.getBounds())) {
            this.repaintExpanded(previousBounds);
        }

        this.repaintExpanded(this.controlPanel.getBounds());
    }

    private void hideControlPanel() {
        if (this.controlPanel == null || !this.controlPanel.isVisible()) {
            return;
        }

        Rectangle bounds = this.controlPanel.getBounds();
        this.controlPanel.setVisible(false);
        this.repaintExpanded(bounds);
    }

    private void repaintExpanded(Rectangle bounds) {
        this.repaint(
            bounds.x - CONTROL_PANEL_REPAINT_PADDING,
            bounds.y - CONTROL_PANEL_REPAINT_PADDING,
            bounds.width + CONTROL_PANEL_REPAINT_PADDING * 2,
            bounds.height + CONTROL_PANEL_REPAINT_PADDING * 2
        );
    }

    private Point getCurrentLocalMousePoint() {
        PointerInfo pointerInfo = MouseInfo.getPointerInfo();
        if (pointerInfo == null) {
            return null;
        }

        Point point = new Point(pointerInfo.getLocation());
        SwingUtilities.convertPointFromScreen(point, this);
        return point;
    }

    private boolean isInsideActiveWindowCaptureArea(Point point) {
        if (point == null) {
            return false;
        }

        if (this.windowCapturePreviewRect != null && this.windowCapturePreviewRect.contains(point)) {
            return true;
        }

        return this.controlPanel != null
            && this.controlPanel.isVisible()
            && this.controlPanel.getBounds().contains(point);
    }

    private void refreshOverlayImmediately() {
        if (!this.captureConfig.isWindowCaptureMode()) {
            this.repaint();
            return;
        }

        if (!SwingUtilities.isEventDispatchThread()) {
            SwingUtilities.invokeLater(this::refreshOverlayImmediately);
            return;
        }

        if (!this.isDisplayable() || this.getWidth() <= 0 || this.getHeight() <= 0) {
            this.repaint();
            return;
        }

        this.revalidate();
        this.paintImmediately(0, 0, this.getWidth(), this.getHeight());
        Toolkit.getDefaultToolkit().sync();
    }
}
