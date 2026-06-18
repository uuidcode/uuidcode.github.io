package screen;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsDevice;
import java.awt.MouseInfo;
import java.awt.Point;
import java.awt.PointerInfo;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

import javax.imageio.ImageIO;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

import java.awt.GridLayout;

import static java.awt.KeyboardFocusManager.getCurrentKeyboardFocusManager;

public class ScreenShotPanel extends JPanel
    implements MouseListener, MouseMotionListener {
    public static final Color BACKGROUND_COLOR = new Color(0, 0, 0, 100);
    private static final int GRID_SIZE = 100;
    private static final int GRID_LABEL_INTERVAL = 100;
    private static final Color GRID_COLOR = new Color(255, 255, 255, 28);
    private static final Color GRID_LABEL_COLOR = new Color(255, 255, 255, 110);
    private static final Color GUIDE_TEXT_BACKGROUND = new Color(0, 0, 0, 140);
    private static final Color GUIDE_TEXT_COLOR = new Color(255, 255, 255, 235);
    private static final int GUIDE_TEXT_PADDING = 4;

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

        getCurrentKeyboardFocusManager().addKeyEventDispatcher(ke -> {
            if (ke.getID() == KeyEvent.KEY_RELEASED && ke.getKeyCode() == KeyEvent.VK_ESCAPE) {
                this.cancelCapture();
            }

            return false;
        });
    }

    private JPanel createControlPanel() {
        JPanel panel = new JPanel(new GridLayout(3, 2));
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
        cancelButton.addActionListener(e -> this.cancelCapture());
        panel.add(cancelButton);

        return panel;
    }

    private void shot(Integer second, boolean isAll) {
        Rectangle rectangle = Util.getRectangle(this.stratPoint, this.endPoint);
        stratPoint = null;
        endPoint = null;
        guideOverlayVisible = false;
        screenShotFrame.setBackground(new Color(0, 0, 0, 0));

        rectangle.width++;
        rectangle.height++;
        if (controlPanel != null) {
            controlPanel.setVisible(false);
        }
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

                captureConfig.setLastRectangle(rectangle);

                if (isAll) {
                    capture(robot, display, 0, 0, this.tabbedPane, captureConfig);
                } else {
                    capture(robot, rectangle, x, y, this.tabbedPane, captureConfig);
                }
            } catch (Throwable t) {
                throw new RuntimeException(t);
            } finally {
                guideOverlayVisible = true;
                imageFrame.setVisible(true);
                screenShotFrame.setBackground(BACKGROUND_COLOR);
                imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
            }
        }).start();
    }

    void cancelCapture() {
        if (controlPanel != null) {
            controlPanel.setVisible(false);
        }

        this.resetColorPreviewState();
        stratPoint = null;
        endPoint = null;
        mousePosition = null;
        guideOverlayVisible = true;
        screenShotFrame.setBackground(BACKGROUND_COLOR);
        imageFrame.getScreenShotFrameList().forEach(f -> f.setVisible(false));
        imageFrame.setVisible(true);
        this.repaint();
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

    public static void capture(Robot robot,
                               Rectangle rectangle,
                               int x,
                               int y,
                               ImageTabPanel tabbedPane,
                               CaptureConfig config) throws IOException {

        // 캡처 전 마우스를 화면 밖으로 이동하여 커서가 캡처되지 않도록 함
        robot.mouseMove(-10000, -10000);

        // 마우스 이동 후 잠시 대기 (화면 갱신 시간)
        try {
            Thread.sleep(50);
        } catch (InterruptedException ignored) {
        }

        BufferedImage image = robot.createScreenCapture(rectangle);

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

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
        if (SwingUtilities.isRightMouseButton(e)) {
            this.startColorPreview(e.getPoint());
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

        if (this.controlPanel != null) {
            this.controlPanel.setVisible(false);
        }
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        if (SwingUtilities.isRightMouseButton(e) && this.rightButtonPressed) {
            this.rightButtonPressed = false;
            this.commitColorSelection(e.getPoint());
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
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void mouseDragged(MouseEvent e) {
        if (this.rightButtonPressed) {
            this.updateColorPreview(e.getPoint());
            e.getComponent().repaint();
            return;
        }

        endPoint = e.getPoint();
        e.getComponent().repaint();
    }

    @Override
    public void mouseMoved(MouseEvent e) {
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

    public void paint(Graphics g) {
        super.paint(g);
        this.drawOverlayContents((Graphics2D) g, true);
    }

    private void drawOverlayContents(Graphics2D g2, boolean includeColorPreview) {
        if (guideOverlayVisible && captureConfig.isGridEnabled()) {
            this.drawGrid(g2);
        }

        Integer fixedWidth = captureConfig.getFixedWidth();
        Integer fixedHeight = captureConfig.getFixedHeight();

        if (fixedWidth != null && fixedHeight != null && mousePosition != null) {
            Rectangle rectangle = new Rectangle(mousePosition.x, mousePosition.y, fixedWidth, fixedHeight);
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

    private void drawGrid(Graphics2D g2) {
        g2.setColor(GRID_COLOR);

        for (int x = 0; x < this.getWidth(); x += GRID_SIZE) {
            g2.drawLine(x, 0, x, this.getHeight());
        }

        for (int y = 0; y < this.getHeight(); y += GRID_SIZE) {
            g2.drawLine(0, y, this.getWidth(), y);
        }

        this.drawGridLabels(g2);
    }

    private void drawGridLabels(Graphics2D g2) {
        Rectangle displayBounds = graphicsDevice.getDefaultConfiguration().getBounds();
        Font originalFont = g2.getFont();
        Font gridFont = originalFont.deriveFont(10f);
        g2.setFont(gridFont);
        g2.setColor(GRID_LABEL_COLOR);

        for (int x = 0; x < this.getWidth(); x += GRID_LABEL_INTERVAL) {
            for (int y = 0; y < this.getHeight(); y += GRID_LABEL_INTERVAL) {
                String text = "(" + (x + displayBounds.x) + ", " + (y + displayBounds.y) + ")";
                this.drawPlainOverlayText(g2, text, x + 3, y + 12);
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

    private void drawPlainOverlayText(Graphics2D g2, String text, int x, int baselineY) {
        FontMetrics metrics = g2.getFontMetrics();
        int clampedX = Math.max(0, Math.min(x, this.getWidth() - metrics.stringWidth(text)));
        int clampedBaselineY = Math.max(metrics.getAscent(), Math.min(baselineY, this.getHeight() - metrics.getDescent()));
        g2.drawString(text, clampedX, clampedBaselineY);
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
}
