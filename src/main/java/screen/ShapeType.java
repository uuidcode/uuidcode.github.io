package screen;

import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.image.BufferedImage;

import static screen.FillType.TRANSPARENT;

public enum ShapeType implements Drawable {
    FILL_ARROW {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.FILL);
        }
    },
    DRAW_ARROW {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.DRAW);
        }
    },
    FILL_RECTANGLE {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.FILL);
        }
    },
    DRAW_RECTANGLE {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.DRAW);
        }
    },
    N1 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "1");
        }
    },
    N2 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "2");
        }
    },
    N3 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "3");
        }
    },
    N4 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "4");
        }
    },
    N5 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "5");
        }
    },
    N6 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "6");
        }
    },
    A {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "A");
        }
    },
    B {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "B");
        }
    },
    C {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "C");
        }
    },
    D {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "D");
        }
    },
    E {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "E");
        }
    },
    F {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processAlphabet(g2, startPoint, "F");
        }
    },
    BLUR {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processBlur(bufferedImage, g2, startPoint,endPoint, 20);
        }
    },
    CROP {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint) {
            Util.processRect(g2, startPoint, endPoint, TRANSPARENT, DrawType.FILL);
        }
    };
}
