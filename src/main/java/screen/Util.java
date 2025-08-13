package screen;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsEnvironment;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Shape;
import java.awt.Transparency;
import java.awt.geom.AffineTransform;
import java.awt.geom.Area;
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
import static java.util.Arrays.fill;
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
                                   int size,
                                   boolean clipping) {
        try {
            Rectangle2D rect = getRectangle2D(start, end);
            BufferedImage subImage = bufferedImage.getSubimage((int) rect.getX(),
                (int) rect.getY(), (int) rect.getWidth(), (int) rect.getHeight());

            if (clipping) {
                BufferedImage allImage = bufferedImage.getSubimage(0, 0,
                    bufferedImage.getWidth(), bufferedImage.getHeight());

                BufferedImage blurredAllImage = blur(allImage);

                Area outside = new Area(new Rectangle(0, 0,
                    bufferedImage.getWidth(), bufferedImage.getHeight()));

                outside.subtract(new Area(rect));

                Shape oldClip = g2.getClip();
                g2.setClip(outside);
                g2.drawImage(blurredAllImage, 0, 0, null);
                g2.setClip(oldClip);
            } else {
                BufferedImage blurredSubImage = blur(subImage);

                g2.drawImage(blurredSubImage, (int) rect.getX(), (int) rect.getY(), null);
            }
        } catch (Throwable t) {
        }
    }

    public static BufferedImage blur(BufferedImage src) {
        int radius = 10;
        int k = radius * 2 + 1;
        float w = 1f / k;
        float[] line = new float[k];
        fill(line, w);

        Kernel h = new Kernel(k, 1, line);
        Kernel v = new Kernel(1, k, line);

        ConvolveOp opH = new ConvolveOp(h, ConvolveOp.EDGE_NO_OP, null);
        ConvolveOp opV = new ConvolveOp(v, ConvolveOp.EDGE_NO_OP, null);

        BufferedImage tmp  = createCompatible(src);
        BufferedImage dest = createCompatible(src);

        opH.filter(src, tmp);
        return opV.filter(tmp, dest);
    }

    private static BufferedImage createCompatible(BufferedImage src) {
        GraphicsConfiguration gc = GraphicsEnvironment
            .getLocalGraphicsEnvironment()
            .getDefaultScreenDevice()
            .getDefaultConfiguration();
        BufferedImage dst = gc.createCompatibleImage(
            src.getWidth(), src.getHeight(), Transparency.TRANSLUCENT);
        return dst;
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
