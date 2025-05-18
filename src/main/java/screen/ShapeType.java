package screen;

import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.image.BufferedImage;

import static screen.FillType.TRANSPARENT;

public enum ShapeType implements Drawable {
    FILL_ARROW {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.FILL, colorType);
        }
    },
    DRAW_ARROW {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processArrow(g2, startPoint, endPoint, 10, 20, 30, fillType, DrawType.DRAW, colorType);
        }
    },
    FILL_RECTANGLE {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.FILL, colorType);
        }
    },
    DRAW_RECTANGLE {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processRect(g2, startPoint, endPoint, fillType, DrawType.DRAW, colorType);
        }
    },
    N1 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "1");
        }
    },
    N2 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "2");
        }
    },
    N3 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "3");
        }
    },
    N4 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "4");
        }
    },
    N5 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "5");
        }
    },
    N6 {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "6");
        }
    },
    A {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "A");
        }
    },
    B {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "B");
        }
    },
    C {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "C");
        }
    },
    D {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "D");
        }
    },
    E {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "E");
        }
    },
    F {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processAlphabet(g2, startPoint, colorType, "F");
        }
    },
    BLUR {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processBlur(bufferedImage, g2, startPoint,endPoint, 20);
        }
    },
    CROP {
        @Override
        public void draw(BufferedImage bufferedImage, Graphics2D g2, FillType fillType, Point startPoint, Point endPoint, ColorType colorType) {
            Util.processRect(g2, startPoint, endPoint, TRANSPARENT, DrawType.FILL, colorType);
        }
    };
}
