package screen;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;

import static java.awt.AlphaComposite.SRC_OVER;
import static java.awt.BasicStroke.CAP_BUTT;
import static java.awt.BasicStroke.JOIN_MITER;
import static java.awt.RenderingHints.KEY_ANTIALIASING;
import static java.awt.RenderingHints.VALUE_ANTIALIAS_ON;
import static screen.Util.getRectangle;

public enum Mode implements Drawable {
    ARROW {
        @Override
        public void draw(Graphics g, Point startPoint, Point endPoint) {
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);

            g2.setColor(new Color(124, 166, 208, 244));
            g2.setStroke(new BasicStroke(10, CAP_BUTT, JOIN_MITER));
            setAlphaComposite(g2);
            Util.drawArrow(g2, startPoint, endPoint,
                new BasicStroke(10, CAP_BUTT, JOIN_MITER),
                new BasicStroke(10, CAP_BUTT, JOIN_MITER), 50);
        }
    },
    FILL_RECTANGLE {
        @Override
        public void draw(Graphics g, Point startPoint, Point endPoint) {
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);

            g2.setColor(new Color(124, 166, 208, 255));
            g2.setStroke(new BasicStroke(10, CAP_BUTT, JOIN_MITER));
            setAlphaComposite(g2);
            Rectangle rectangle = getRectangle(startPoint, endPoint);
            g2.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
    },
    DRAW_RECTANGLE {
        @Override
        public void draw(Graphics g, Point startPoint, Point endPoint) {
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);

            g2.setColor(new Color(124, 166, 208, 255));
            g2.setStroke(new BasicStroke(3, CAP_BUTT, JOIN_MITER));
            setAlphaComposite(g2);
            Rectangle rectangle = getRectangle(startPoint, endPoint);
            g2.drawRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
    };

    private static void setAlphaComposite(Graphics2D g2) {
        AlphaComposite alphaComposite = AlphaComposite.getInstance(SRC_OVER, 0.5f);
        g2.setComposite(alphaComposite);
    }
}
