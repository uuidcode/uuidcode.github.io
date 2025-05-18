package screen;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.GeneralPath;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;
import java.awt.image.WritableRaster;
import java.io.File;

import static java.awt.AlphaComposite.SRC_OVER;
import static java.awt.BasicStroke.CAP_BUTT;
import static java.awt.BasicStroke.JOIN_MITER;
import static java.awt.Color.WHITE;
import static java.awt.Color.lightGray;
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

    private static void init(Graphics2D g2, FillType fillType, ColorType colorType) {
        g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);
        g2.setColor(colorType.getColor());
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
                                   DrawType drawType,
                                   ColorType colorType) {
        Rectangle2D rectangle = getRectangle2D(start, end);
        init(g2, fillType, colorType);

        if (drawType == FILL) {
            g2.fill(rectangle);
            return;
        }

        g2.draw(rectangle);
    }

    public static void processBlur(BufferedImage bufferedImage,
                                   Graphics2D g2,
                                   Point2D start,
                                   Point2D end,
                                   int size) {
        float[] blurKernel = {
            0.00000067f, 0.00002292f, 0.00019117f, 0.00038771f, 0.00019117f, 0.00002292f, 0.00000067f,
            0.00002292f, 0.00078634f, 0.00655408f, 0.01328503f, 0.00655408f, 0.00078634f, 0.00002292f,
            0.00019117f, 0.00655408f, 0.05472157f, 0.11098164f, 0.05472157f, 0.00655408f, 0.00019117f,
            0.00038771f, 0.01328503f, 0.11098164f, 0.22508352f, 0.11098164f, 0.01328503f, 0.00038771f,
            0.00019117f, 0.00655408f, 0.05472157f, 0.11098164f, 0.05472157f, 0.00655408f, 0.00019117f,
            0.00002292f, 0.00078634f, 0.00655408f, 0.01328503f, 0.00655408f, 0.00078634f, 0.00002292f,
            0.00000067f, 0.00002292f, 0.00019117f, 0.00038771f, 0.00019117f, 0.00002292f, 0.00000067f
        };

        Kernel kernel = new Kernel(7, 7, blurKernel);
        ConvolveOp convolveOp = new ConvolveOp(kernel, ConvolveOp.EDGE_NO_OP, null);

        try {
            Rectangle2D rect = getRectangle2D(start, end);
            BufferedImage subImage = bufferedImage.getSubimage((int) rect.getX(), (int) rect.getY(), (int) rect.getWidth(), (int) rect.getHeight());
            BufferedImage blurredSubImage = convolveOp.filter(subImage, null);

            for (int i = 0; i < size; i++) {  // 블러 필터를 여러 번 적용
                blurredSubImage = convolveOp.filter(blurredSubImage, null);
            }

            g2.drawImage(blurredSubImage, (int) rect.getX(), (int) rect.getY(), null);
        } catch (Throwable t) {
        }
    }

    public static void processAlphabet(Graphics2D g2,
                                       Point2D start,
                                       ColorType colorType,
                                       String text) {
        Font font = g2.getFont();
        font = new Font(font.getFontName(), Font.BOLD, 30);
        g2.setFont(font);

        FontMetrics metrics = g2.getFontMetrics(g2.getFont());
        int width = metrics.stringWidth(text);
        int height = metrics.getHeight();
        int ascent = metrics.getAscent();

        g2.setStroke(new BasicStroke(5));
        Rectangle rect = new Rectangle((int) start.getX(), (int) start.getY() - ascent, width, height);
        rect.x -= 10;
        rect.y -= 5;
        rect.width += 20;
        rect.height += 10;
        g2.setColor(WHITE);
        g2.fill(rect);

        g2.setColor(colorType.getColor());
        g2.draw(rect);

        g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);
        g2.drawString(text, (int) start.getX(), (int) start.getY());

        int shadow = 3;
        g2.setColor(lightGray);
        g2.fillRect(rect.x + shadow, rect.y + rect.height + shadow , rect.width + shadow, shadow);
        g2.fillRect(rect.x + rect.width + shadow, rect.y + shadow, shadow, rect.height + shadow);
    }

    public static void processArrow(Graphics2D g2,
                                    Point2D start,
                                    Point2D end,
                                    float lineWidth,
                                    float headWidth,
                                    float headHeight,
                                    FillType fillType,
                                    DrawType drawType,
                                    ColorType colorType) {
        init(g2, fillType, colorType);

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
            return ;
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
