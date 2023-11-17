package screen;

import java.awt.Graphics2D;
import java.awt.Point;

public enum ShapeType implements Drawable {
    FILL_ARROW {
        @Override
        public void draw(Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.FILL);
        }
    },
    DRAW_ARROW {
        @Override
        public void draw(Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.DRAW);
        }
    },
    FILL_RECTANGLE {
        @Override
        public void draw(Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.FILL);
        }
    },
    DRAW_RECTANGLE {
        @Override
        public void draw(Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.DRAW);
        }
    };
}
