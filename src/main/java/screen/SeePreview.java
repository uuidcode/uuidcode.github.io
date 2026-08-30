package screen;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.Insets;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Toolkit;

import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.JWindow;

// see 모드에서 선택 영역 내부를 밑의 앱으로 클릭/드래그 통과시키기 위해,
// 영역을 덮지 않고 테두리(점선)만 4개의 얇은 창으로 그리고 cancel/capture 창을 우측 하단에 띄운다.
// 내부에는 창이 전혀 없으므로 마우스 이벤트가 그대로 밑의 앱으로 전달된다.
public class SeePreview {
    private static final int BORDER_THICKNESS = 2;
    private static final int CONTROL_MARGIN = 20;
    private static final Color DASH_COLOR = new Color(255, 59, 48);

    private final Rectangle rectangle;
    private final JWindow topWindow;
    private final JWindow bottomWindow;
    private final JWindow leftWindow;
    private final JWindow rightWindow;
    private final JWindow controlWindow;

    public SeePreview(
        GraphicsDevice graphicsDevice,
        Rectangle rectangle,
        Runnable onCapture,
        Runnable onCancel
    ) {
        this.rectangle = new Rectangle(rectangle);
        this.topWindow = this.createEdgeWindow(true);
        this.bottomWindow = this.createEdgeWindow(true);
        this.leftWindow = this.createEdgeWindow(false);
        this.rightWindow = this.createEdgeWindow(false);
        this.controlWindow = this.createControlWindow(onCapture, onCancel);

        this.layoutEdgeWindows();

        this.layoutControlWindow(graphicsDevice);
    }

    private JWindow createEdgeWindow(boolean horizontal) {
        JWindow window = new JWindow();

        window.setAlwaysOnTop(true);

        window.setFocusableWindowState(false);

        window.setBackground(new Color(0, 0, 0, 0));

        window.setContentPane(new EdgePanel(horizontal));

        return window;
    }

    private JWindow createControlWindow(Runnable onCapture, Runnable onCancel) {
        JWindow window = new JWindow();

        window.setAlwaysOnTop(true);

        window.setFocusableWindowState(false);

        JPanel panel = new JPanel(new FlowLayout(FlowLayout.CENTER, 6, 6));

        JButton cancelButton = new JButton("cancel");

        cancelButton.addActionListener(e -> onCancel.run());

        JButton captureButton = new JButton("capture");

        captureButton.addActionListener(e -> onCapture.run());

        panel.add(cancelButton);

        panel.add(captureButton);

        Util.styleButtonsAsSquare(panel);

        window.setContentPane(panel);

        window.pack();

        return window;
    }

    private void layoutEdgeWindows() {
        int x = this.rectangle.x;
        int y = this.rectangle.y;
        int width = this.rectangle.width;
        int height = this.rectangle.height;
        int thickness = BORDER_THICKNESS;

        this.topWindow.setBounds(x - thickness, y - thickness, width + thickness * 2, thickness);

        this.bottomWindow.setBounds(x - thickness, y + height, width + thickness * 2, thickness);

        this.leftWindow.setBounds(x - thickness, y, thickness, height);

        this.rightWindow.setBounds(x + width, y, thickness, height);
    }

    private void layoutControlWindow(GraphicsDevice graphicsDevice) {
        Dimension size = this.controlWindow.getSize();
        GraphicsConfiguration configuration = graphicsDevice.getDefaultConfiguration();
        Rectangle bounds = configuration.getBounds();
        Insets insets = this.getScreenInsets(configuration);
        Point location = calculateControlLocation(
            bounds,
            insets,
            size
        );

        this.controlWindow.setLocation(location);
    }

    private Insets getScreenInsets(GraphicsConfiguration configuration) {
        try {
            return Toolkit.getDefaultToolkit().getScreenInsets(configuration);
        } catch (Throwable ignored) {
            return new Insets(0, 0, 0, 0);
        }
    }

    static Point calculateControlLocation(
        Rectangle bounds,
        Insets insets,
        Dimension size
    ) {
        int left = bounds.x + insets.left + CONTROL_MARGIN;
        int top = bounds.y + insets.top + CONTROL_MARGIN;
        int right = bounds.x + bounds.width - insets.right - CONTROL_MARGIN;
        int bottom = bounds.y + bounds.height - insets.bottom - CONTROL_MARGIN;
        int x = Math.max(left, right - size.width);
        int y = Math.max(top, bottom - size.height);

        return new Point(x, y);
    }

    public void show() {
        this.topWindow.setVisible(true);

        this.bottomWindow.setVisible(true);

        this.leftWindow.setVisible(true);

        this.rightWindow.setVisible(true);

        this.controlWindow.setVisible(true);

        this.controlWindow.toFront();
    }

    public void hideWindows() {
        this.topWindow.setVisible(false);

        this.bottomWindow.setVisible(false);

        this.leftWindow.setVisible(false);

        this.rightWindow.setVisible(false);

        this.controlWindow.setVisible(false);
    }

    public void dispose() {
        this.topWindow.dispose();

        this.bottomWindow.dispose();

        this.leftWindow.dispose();

        this.rightWindow.dispose();

        this.controlWindow.dispose();
    }

    private class EdgePanel extends JPanel {
        private final boolean horizontal;

        private EdgePanel(boolean horizontal) {
            this.horizontal = horizontal;

            this.setOpaque(false);
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);

            Graphics2D g2 = (Graphics2D) g.create();

            try {
                g2.setColor(DASH_COLOR);

                g2.setStroke(new BasicStroke(
                    BORDER_THICKNESS,
                    BasicStroke.CAP_BUTT,
                    BasicStroke.JOIN_BEVEL,
                    0,
                    new float[]{6f, 4f},
                    0
                ));

                int center = BORDER_THICKNESS / 2;

                if (this.horizontal) {
                    g2.drawLine(0, center, this.getWidth(), center);
                } else {
                    g2.drawLine(center, 0, center, this.getHeight());
                }
            } finally {
                g2.dispose();
            }
        }
    }
}
