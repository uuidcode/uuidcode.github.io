package screen;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.GeneralPath;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;
import java.io.File;

import static java.awt.AlphaComposite.SRC_OVER;
import static java.awt.BasicStroke.CAP_BUTT;
import static java.awt.BasicStroke.JOIN_MITER;
import static java.awt.RenderingHints.KEY_ANTIALIASING;
import static java.awt.RenderingHints.VALUE_ANTIALIAS_ON;
import static screen.DrawType.FILL;

public class Util {
    public static final String SCREENSHOT_DIR = "screenshot/";

    public static File getImageFile(String name) {
        if (name.endsWith(".png")) {
            return new File(SCREENSHOT_DIR + name);
        }

        return new File(SCREENSHOT_DIR + name + ".png");
    }

    private static void init(Graphics2D g2, FillType fillType) {
        g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);
        g2.setColor(new Color(124, 166, 208, 255));
        g2.setStroke(new BasicStroke(3, CAP_BUTT, JOIN_MITER));

        if (fillType == FillType.OPAQUE) {
            return;
        }

        AlphaComposite alphaComposite = AlphaComposite.getInstance(SRC_OVER, 0.5f);
        g2.setComposite(alphaComposite);
    }

    public static void processRect(Graphics2D g2,
                                   Point2D start,
                                   Point2D end,
                                   FillType fillType,
                                   DrawType drawType) {
        Rectangle2D rectangle = getRectangle2D(start, end);
        init(g2, fillType);

        if (drawType == FILL) {
            g2.fill(rectangle);
            return;
        }

        g2.draw(rectangle);
    }

    public static void processAlphabet(Graphics2D g2,
                                       Point2D start,
                                       String text) {
        Font font = g2.getFont();
        font = new Font(font.getFontName(), Font.BOLD, 30);
        g2.setFont(font);
        g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);
        g2.setColor(new Color(124, 166, 208, 255));
        g2.drawString(text, (int) start.getX(), (int) start.getY());
    }

    public static void processArrow(Graphics2D g2,
                                    Point2D start,
                                    Point2D end,
                                    float lineWidth,
                                    float headWidth,
                                    float headHeight,
                                    FillType fillType,
                                    DrawType drawType) {
        init(g2, fillType);

        double lineLength = Math.sqrt(Math.pow(end.getX() - start.getX(), 2)
            + Math.pow(end.getY() - start.getY(), 2));

        lineLength -= headHeight;

        final GeneralPath polygon = new GeneralPath();
        polygon.moveTo(0, 0);
        polygon.lineTo(0, -lineWidth / 2);
        polygon.lineTo(lineLength, -lineWidth / 2);
        polygon.lineTo(lineLength, -headWidth / 2);
        polygon.lineTo(lineLength + headHeight, 0);
        polygon.lineTo(lineLength, headWidth / 2);
        polygon.lineTo(lineLength, lineWidth / 2);
        polygon.lineTo(0, lineWidth / 2);
        polygon.closePath();

        AffineTransform affineTransform = new AffineTransform();
        affineTransform.translate(start.getX(), start.getY());
        affineTransform.rotate(Math.atan2(end.getY() - start.getY(), end.getX() - start.getX()));
        polygon.transform(affineTransform);

        if (drawType == FILL) {
            g2.fill(polygon);
            return;
        }

        g2.draw(polygon);
    }

    public static Rectangle2D getRectangle2D(Point2D startPoint, Point2D endPoint) {
        double x = Math.min(startPoint.getX(), endPoint.getX());
        double y = Math.min(startPoint.getY(), endPoint.getY());
        double width = Math.abs(startPoint.getX() - endPoint.getX());
        double height = Math.abs(startPoint.getY() - endPoint.getY());

        return new Rectangle2D.Double(x, y, width, height);
    }

    public static Rectangle getRectangle(Point startPoint, Point endPoint) {
        int x = Math.min(startPoint.x, endPoint.x);
        int y = Math.min(startPoint.y, endPoint.y);
        int width = Math.abs(startPoint.x - endPoint.x);
        int height = Math.abs(startPoint.y - endPoint.y);

        return new Rectangle(x, y, width, height);
    }

    public static BufferedImage deepCopy(BufferedImage bi) {
        ColorModel cm = bi.getColorModel();
        boolean isAlphaPremultiplied = cm.isAlphaPremultiplied();
        WritableRaster raster = bi.copyData(null);
        return new BufferedImage(cm, raster, isAlphaPremultiplied, null);
    }
}
