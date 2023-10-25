package screen;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;

import static java.awt.BasicStroke.CAP_BUTT;
import static java.awt.BasicStroke.JOIN_MITER;
import static java.awt.RenderingHints.KEY_ANTIALIASING;
import static java.awt.RenderingHints.VALUE_ANTIALIAS_ON;
import static screen.Util.drawArrowLine;
import static screen.Util.getRectangle;

public enum Mode implements Drawable {
    ARROW {
        @Override
        public void draw(Graphics g, Point startPoint, Point endPoint) {
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);

            g2.setColor(new Color(124, 166, 208, 244));
            g2.setStroke(new BasicStroke(10, CAP_BUTT, JOIN_MITER));
            g2.drawLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            drawArrowLine(g, startPoint.x, startPoint.y, endPoint.x, endPoint.y, 20, 20);
        }
    },
    FILL_RECTANGLE {
        @Override
        public void draw(Graphics g, Point startPoint, Point endPoint) {
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(KEY_ANTIALIASING, VALUE_ANTIALIAS_ON);

            g2.setColor(new Color(124, 166, 208, 255));
            g2.setStroke(new BasicStroke(10, CAP_BUTT, JOIN_MITER));
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
            Rectangle rectangle = getRectangle(startPoint, endPoint);
            g2.drawRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
    }
}
