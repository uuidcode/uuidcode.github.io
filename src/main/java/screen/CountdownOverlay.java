package screen;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.GraphicsDevice;
import java.awt.Rectangle;
import java.awt.RenderingHints;

import javax.swing.JPanel;
import javax.swing.JWindow;

// delay shot 카운트다운 동안 화면 중앙에 남은 초를 표시하는 오버레이 창
public class CountdownOverlay extends JWindow {
    private static final int OVERLAY_SIZE = 200;
    private static final Color TEXT_COLOR = new Color(255, 255, 255, 235);
    private static final Color BADGE_COLOR = new Color(0, 0, 0, 140);
    private int second;

    public CountdownOverlay(GraphicsDevice graphicsDevice) {
        this.setAlwaysOnTop(true);

        this.setFocusableWindowState(false);

        this.setBackground(new Color(0, 0, 0, 0));

        this.setContentPane(new CountdownPanel());

        Rectangle bounds = graphicsDevice.getDefaultConfiguration().getBounds();

        int x = bounds.x + (bounds.width - OVERLAY_SIZE) / 2;
        int y = bounds.y + (bounds.height - OVERLAY_SIZE) / 2;

        this.setBounds(x, y, OVERLAY_SIZE, OVERLAY_SIZE);
    }

    public void setSecond(int second) {
        this.second = second;

        this.repaint();
    }

    private class CountdownPanel extends JPanel {
        private CountdownPanel() {
            this.setOpaque(false);
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);

            Graphics2D g2 = (Graphics2D) g.create();

            try {
                g2.setRenderingHint(
                    RenderingHints.KEY_ANTIALIASING,
                    RenderingHints.VALUE_ANTIALIAS_ON
                );

                int width = this.getWidth();
                int height = this.getHeight();
                int diameter = Math.min(width, height);
                int badgeX = (width - diameter) / 2;
                int badgeY = (height - diameter) / 2;

                g2.setColor(BADGE_COLOR);

                g2.fillOval(badgeX, badgeY, diameter, diameter);

                g2.setColor(TEXT_COLOR);

                g2.setFont(this.getFont().deriveFont(Font.BOLD, diameter * 0.5f));

                String text = String.valueOf(CountdownOverlay.this.second);
                FontMetrics fontMetrics = g2.getFontMetrics();
                int textX = (width - fontMetrics.stringWidth(text)) / 2;
                int textY = (height - fontMetrics.getHeight()) / 2 + fontMetrics.getAscent();

                g2.drawString(text, textX, textY);
            } finally {
                g2.dispose();
            }
        }
    }
}
