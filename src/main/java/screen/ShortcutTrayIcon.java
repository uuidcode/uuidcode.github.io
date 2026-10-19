package screen;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.Shape;
import java.awt.MenuItem;
import java.awt.PopupMenu;
import java.awt.SystemTray;
import java.awt.TrayIcon;
import java.awt.font.GlyphVector;
import java.awt.geom.AffineTransform;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;

import static java.awt.RenderingHints.KEY_ANTIALIASING;
import static java.awt.RenderingHints.VALUE_ANTIALIAS_ON;
import static java.awt.image.BufferedImage.TYPE_INT_ARGB;

// 메뉴바에 아이콘을 올리고, 눌렀을 때 shift+기능키 단축키 6개를 메뉴로 보여 준다.
// 메뉴를 고르면 단축키를 누른 것과 똑같이 동작한다.
public class ShortcutTrayIcon {
    private static final int ICON_SIZE = 32;
    private static final String ICON_TEXT = "⇧F";
    private static final String TOOLTIP = "ImageFrame 단축키";
    private static final double STROKE_RATIO = 0.08;

    // 메뉴바는 밝을 수도 어두울 수도 있어서 흰 글자에 검은 테두리를 둘러 양쪽에서 다 보이게 한다.
    private static final Color ICON_FILL_COLOR = Color.WHITE;
    private static final Color ICON_OUTLINE_COLOR = new Color(0, 0, 0, 200);

    public static boolean install(ImageFrame imageFrame) {
        if (!SystemTray.isSupported()) {
            return false;
        }

        try {
            TrayIcon trayIcon = new TrayIcon(
                createIcon(ICON_SIZE),
                TOOLTIP,
                createMenu(imageFrame)
            );

            trayIcon.setImageAutoSize(true);

            SystemTray.getSystemTray().add(trayIcon);

            return true;
        } catch (Throwable t) {
            return false;
        }
    }

    static PopupMenu createMenu(ImageFrame imageFrame) {
        PopupMenu popupMenu = new PopupMenu();

        for (FunctionShortcut functionShortcut : FunctionShortcut.values()) {
            MenuItem menuItem = new MenuItem(functionShortcut.getMenuLabel());

            // 단축키를 누른 것과 같은 동작을 그대로 실행한다.
            Runnable action = imageFrame.actionOf(functionShortcut);
            menuItem.addActionListener(e -> action.run());

            popupMenu.add(menuItem);
        }

        return popupMenu;
    }

    // 글자 폭은 글꼴마다 달라서 폰트 크기로 맞추면 잘린다.
    // 글리프의 실제 경계를 재서 아이콘 안에 꼭 맞게 줄인다.
    static Image createIcon(int size) {
        BufferedImage image = new BufferedImage(
            size,
            size,
            TYPE_INT_ARGB // imageType
        );

        Graphics2D g2 = image.createGraphics();

        try {
            g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);

            Font font = g2.getFont().deriveFont(Font.BOLD, (float) size);

            GlyphVector glyphVector = font.createGlyphVector(
                g2.getFontRenderContext(),
                ICON_TEXT
            );

            Shape outline = glyphVector.getOutline();
            Rectangle2D bounds = outline.getBounds2D();

            // 테두리가 바깥으로 번지므로 선 굵기만큼 여백을 둔다.
            double padding = size * STROKE_RATIO;
            double available = size - padding * 2;
            double scale = Math.min(
                available / bounds.getWidth(),
                available / bounds.getHeight()
            );

            AffineTransform transform = new AffineTransform();
            transform.translate(
                (size - bounds.getWidth() * scale) / 2 - bounds.getX() * scale,
                (size - bounds.getHeight() * scale) / 2 - bounds.getY() * scale
            );

            transform.scale(scale, scale);

            Shape fitted = transform.createTransformedShape(outline);

            g2.setColor(ICON_OUTLINE_COLOR);
            g2.setStroke(new BasicStroke((float) (size * STROKE_RATIO)));
            g2.draw(fitted);

            g2.setColor(ICON_FILL_COLOR);
            g2.fill(fitted);
        } finally {
            g2.dispose();
        }

        return image;
    }
}
