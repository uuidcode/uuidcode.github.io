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
    public static final String SCREENSHOT_DIR = "screenshot";

    public static File getImageDir() {
        return new File(new File(".."), SCREENSHOT_DIR);
    }

    public static File getImageFile(String name) {
        if (name.endsWith(".png")) {
            return new File(getImageDir(), name);
        }

        return new File(getImageDir(), name + ".png");
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
                BufferedImage subImage = bufferedImage.getSubimage((int) rect.getX(),
                    (int) rect.getY(), (int) rect.getWidth(), (int) rect.getHeight());
                BufferedImage blurred = blur(subImage);
                g2.drawImage(blurred, (int) rect.getX(), (int) rect.getY(), null);
            }
        } catch (Throwable t) {
        }
    }

    public static BufferedImage blur(BufferedImage src) {
        int sw = src.getWidth();
        int sh = src.getHeight();
        int[] pixels = src.getRGB(0, 0, sw, sh, null, 0, sw);

        int radius = 20;
        int passes = 2;
        for (int p = 0; p < passes; p++) {
            pixels = boxBlurH(pixels, sw, sh, radius);
            pixels = boxBlurV(pixels, sw, sh, radius);
        }

        BufferedImage result = new BufferedImage(sw, sh, BufferedImage.TYPE_INT_ARGB);
        result.setRGB(0, 0, sw, sh, pixels, 0, sw);
        return result;
    }

    private static int[] boxBlurH(int[] src, int w, int h, int radius) {
        int[] dst = new int[src.length];
        float div = radius + radius + 1;
        for (int y = 0; y < h; y++) {
            int yi = y * w;
            long ra = 0, ga = 0, ba = 0, aa = 0;

            for (int x = -radius; x <= radius; x++) {
                int px = Math.max(0, Math.min(w - 1, x));
                int c = src[yi + px];
                aa += (c >>> 24);
                ra += (c >> 16) & 0xFF;
                ga += (c >> 8) & 0xFF;
                ba += c & 0xFF;
            }

            for (int x = 0; x < w; x++) {
                dst[yi + x] = ((int)(aa / div) << 24)
                    | ((int)(ra / div) << 16)
                    | ((int)(ga / div) << 8)
                    | (int)(ba / div);

                int addIdx = Math.min(w - 1, x + radius + 1);
                int removeIdx = Math.max(0, x - radius);
                int addC = src[yi + addIdx];
                int removeC = src[yi + removeIdx];
                aa += (addC >>> 24) - (removeC >>> 24);
                ra += ((addC >> 16) & 0xFF) - ((removeC >> 16) & 0xFF);
                ga += ((addC >> 8) & 0xFF) - ((removeC >> 8) & 0xFF);
                ba += (addC & 0xFF) - (removeC & 0xFF);
            }
        }
        return dst;
    }

    private static int[] boxBlurV(int[] src, int w, int h, int radius) {
        int[] dst = new int[src.length];
        float div = radius + radius + 1;
        for (int x = 0; x < w; x++) {
            long ra = 0, ga = 0, ba = 0, aa = 0;

            for (int y = -radius; y <= radius; y++) {
                int py = Math.max(0, Math.min(h - 1, y));
                int c = src[py * w + x];
                aa += (c >>> 24);
                ra += (c >> 16) & 0xFF;
                ga += (c >> 8) & 0xFF;
                ba += c & 0xFF;
            }

            for (int y = 0; y < h; y++) {
                dst[y * w + x] = ((int)(aa / div) << 24)
                    | ((int)(ra / div) << 16)
                    | ((int)(ga / div) << 8)
                    | (int)(ba / div);

                int addIdx = Math.min(h - 1, y + radius + 1);
                int removeIdx = Math.max(0, y - radius);
                int addC = src[addIdx * w + x];
                int removeC = src[removeIdx * w + x];
                aa += (addC >>> 24) - (removeC >>> 24);
                ra += ((addC >> 16) & 0xFF) - ((removeC >> 16) & 0xFF);
                ga += ((addC >> 8) & 0xFF) - ((removeC >> 8) & 0xFF);
                ba += (addC & 0xFF) - (removeC & 0xFF);
            }
        }
        return dst;
    }

    public static void drawText(Graphics2D g2,
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
