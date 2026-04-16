package screen;

import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class DrawObject {
    public enum Type {
        FILL_ARROW, DRAW_ARROW, FILL_RECTANGLE, DRAW_RECTANGLE, PASTE, TEXT
    }

    private Type type;
    private Point startPoint;
    private Point endPoint;
    private FillType fillType;
    private ColorType colorType;
    private BufferedImage pasteImage;
    private String text;

    public void draw(Graphics2D g2) {
        switch (type) {
            case FILL_ARROW:
                Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.FILL, colorType);
                break;
            case DRAW_ARROW:
                Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.DRAW, colorType);
                break;
            case FILL_RECTANGLE:
                Util.processRect(g2, startPoint, endPoint, fillType, DrawType.FILL, colorType);
                break;
            case DRAW_RECTANGLE:
                Util.processRect(g2, startPoint, endPoint, fillType, DrawType.DRAW, colorType);
                break;
            case PASTE:
                if (pasteImage != null) {
                    g2.drawImage(pasteImage, startPoint.x, startPoint.y,
                        pasteImage.getWidth(), pasteImage.getHeight(), null);
                }
                break;
            case TEXT:
                if (text != null) {
                    Util.drawText(g2, startPoint, colorType, text);
                }
                break;
        }
    }

    public Rectangle getBounds() {
        switch (type) {
            case FILL_ARROW:
            case DRAW_ARROW:
            case FILL_RECTANGLE:
            case DRAW_RECTANGLE:
                int x = Math.min(startPoint.x, endPoint.x);
                int y = Math.min(startPoint.y, endPoint.y);
                int w = Math.abs(startPoint.x - endPoint.x);
                int h = Math.abs(startPoint.y - endPoint.y);
                return new Rectangle(x - 5, y - 5, w + 10, h + 10);
            case PASTE:
                if (pasteImage != null) {
                    return new Rectangle(startPoint.x, startPoint.y,
                        pasteImage.getWidth(), pasteImage.getHeight());
                }
                return new Rectangle(startPoint.x, startPoint.y, 0, 0);
            case TEXT:
                return getTextBounds();
            default:
                return new Rectangle(startPoint.x, startPoint.y, 0, 0);
        }
    }

    private Rectangle getTextBounds() {
        BufferedImage tmp = new BufferedImage(1, 1, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = tmp.createGraphics();
        java.awt.Font font = new java.awt.Font(g.getFont().getFontName(), java.awt.Font.BOLD, 30);
        g.setFont(font);
        java.awt.FontMetrics metrics = g.getFontMetrics();
        int width = metrics.stringWidth(text);
        int height = metrics.getHeight();
        int ascent = metrics.getAscent();
        g.dispose();
        int shadow = 3;
        return new Rectangle(startPoint.x - 10, startPoint.y - ascent - 5,
            width + 20 + shadow, height + 10 + shadow);
    }

    public boolean contains(Point p) {
        return getBounds().contains(p);
    }

    public void move(int dx, int dy) {
        startPoint = new Point(startPoint.x + dx, startPoint.y + dy);
        if (endPoint != null) {
            endPoint = new Point(endPoint.x + dx, endPoint.y + dy);
        }
    }

    public static Type fromShapeType(ShapeType shapeType) {
        switch (shapeType) {
            case FILL_ARROW: return Type.FILL_ARROW;
            case DRAW_ARROW: return Type.DRAW_ARROW;
            case FILL_RECTANGLE: return Type.FILL_RECTANGLE;
            case DRAW_RECTANGLE: return Type.DRAW_RECTANGLE;
            default: return null;
        }
    }
}
