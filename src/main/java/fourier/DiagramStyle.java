package fourier;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.geom.Ellipse2D;
import java.awt.geom.Line2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;

/**
 * 설명용 그림들이 함께 쓰는 색, 글꼴, 기본 그리기 도구.
 */
public class DiagramStyle {
    public static final int SHEET_WIDTH = 1180;
    public static final double MARGIN_LEFT = 56;
    public static final double MARGIN_RIGHT = 1124;

    public static final Color BACKGROUND_COLOR = Color.WHITE;
    public static final Color INK_COLOR = new Color(30, 30, 32);
    public static final Color MUTED_COLOR = new Color(130, 130, 134);
    public static final Color LINE_COLOR = new Color(205, 205, 208);
    public static final Color BLUE_COLOR = new Color(46, 111, 217);
    public static final Color BLUE_FILL_COLOR = new Color(46, 111, 217, 55);
    public static final Color ORANGE_COLOR = new Color(222, 118, 48);
    public static final Color ORANGE_FILL_COLOR = new Color(222, 118, 48, 55);
    public static final Color GREEN_COLOR = new Color(55, 160, 100);
    public static final Color GREEN_FILL_COLOR = new Color(55, 160, 100, 85);
    public static final Color RED_FILL_COLOR = new Color(206, 70, 88, 85);
    public static final Color PANEL_COLOR = new Color(246, 246, 243);
    public static final Color OUTLINE_COLOR = new Color(120, 120, 120, 150);

    public static final Color TEAL_COLOR = new Color(38, 150, 140);
    public static final Color GOLD_COLOR = new Color(196, 146, 32);
    public static final Color BIRD_COLOR = new Color(166, 70, 44);
    public static final Color FADED_COLOR = new Color(214, 214, 216);

    public static final String KOREAN = "Apple SD Gothic Neo";
    public static final Font TITLE_FONT = new Font(KOREAN, Font.BOLD, 30);
    public static final Font HEAD_FONT = new Font(KOREAN, Font.BOLD, 20);
    public static final Font SMALL_HEAD_FONT = new Font(KOREAN, Font.BOLD, 16);
    public static final Font BODY_FONT = new Font(KOREAN, Font.PLAIN, 15);
    public static final Font TINY_FONT = new Font(KOREAN, Font.PLAIN, 13);
    public static final Font BADGE_FONT = new Font(KOREAN, Font.BOLD, 16);
    public static final Font SIGN_FONT = new Font(KOREAN, Font.PLAIN, 16);
    public static final Font ARROW_FONT = new Font(KOREAN, Font.PLAIN, 22);
    public static final Font MATH_FONT = new Font("Serif", Font.ITALIC, 22);
    public static final Font MATH_BIG_FONT = new Font("Serif", Font.ITALIC, 26);
    public static final Font NUMBER_FONT = new Font("Serif", Font.PLAIN, 22);
    public static final Font SUBSCRIPT_FONT = new Font("Serif", Font.PLAIN, 14);

    private DiagramStyle() {
    }

    /**
     * 흰 바탕을 깔고 안티앨리어싱을 켠 그리기 핸들을 만든다.
     */
    public static Graphics2D open(BufferedImage image) {
        Graphics2D g2 = image.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_STROKE_CONTROL, RenderingHints.VALUE_STROKE_PURE);
        g2.setColor(BACKGROUND_COLOR);
        g2.fillRect(0, 0, image.getWidth(), image.getHeight());

        return g2;
    }

    public static void header(
        Graphics2D g2,
        String title,
        String subtitle
    ) {
        text(
            g2,
            title,
            TITLE_FONT,
            INK_COLOR,
            MARGIN_LEFT,
            64
        );

        text(
            g2,
            subtitle,
            BODY_FONT,
            MUTED_COLOR,
            MARGIN_LEFT,
            96
        );

        g2.setColor(LINE_COLOR);
        g2.setStroke(new BasicStroke(1f));
        g2.draw(new Line2D.Double(MARGIN_LEFT, 118, MARGIN_RIGHT, 118));
    }

    public static void divider(
        Graphics2D g2,
        double y
    ) {
        g2.setColor(LINE_COLOR);
        g2.setStroke(new BasicStroke(1f, BasicStroke.CAP_BUTT, BasicStroke.JOIN_MITER, 10f, new float[] {4f, 4f}, 0f));
        g2.draw(new Line2D.Double(MARGIN_LEFT, y, MARGIN_RIGHT, y));
    }

    public static void text(
        Graphics2D g2,
        String value,
        Font font,
        Color color,
        double x,
        double baselineY
    ) {
        g2.setFont(font);
        g2.setColor(color);
        g2.drawString(value, (float) x, (float) baselineY);
    }

    public static void center(
        Graphics2D g2,
        String value,
        Font font,
        Color color,
        double centerX,
        double baselineY
    ) {
        g2.setFont(font);
        g2.setColor(color);

        double width = g2.getFontMetrics().stringWidth(value);
        g2.drawString(value, (float) (centerX - width / 2), (float) baselineY);
    }

    public static void badge(
        Graphics2D g2,
        String value,
        double centerX,
        double centerY
    ) {
        g2.setColor(INK_COLOR);
        g2.fill(new Ellipse2D.Double(centerX - 15, centerY - 15, 30, 30));
        g2.setColor(Color.WHITE);
        g2.setFont(BADGE_FONT);

        double width = g2.getFontMetrics().stringWidth(value);
        g2.drawString(value, (float) (centerX - width / 2), (float) (centerY + 6));
    }

    /**
     * source 를 비율 그대로 target 안에 가운데 맞춰 넣는 변환.
     */
    public static AffineTransform fitTransform(
        Rectangle2D source,
        Rectangle2D target
    ) {
        double scale = Math.min(target.getWidth() / source.getWidth(), target.getHeight() / source.getHeight());
        AffineTransform transform = new AffineTransform();
        transform.translate(target.getCenterX(), target.getCenterY());
        transform.scale(scale, scale);
        transform.translate(-source.getCenterX(), -source.getCenterY());

        return transform;
    }
}
